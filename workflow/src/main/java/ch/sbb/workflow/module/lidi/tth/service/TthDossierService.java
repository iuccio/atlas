package ch.sbb.workflow.module.lidi.tth.service;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.model.exception.NotFoundException.IdNotFoundException;
import ch.sbb.atlas.model.exception.SimpleAtlasException;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import ch.sbb.workflow.module.lidi.tth.mail.TthDossierNotificationService;
import ch.sbb.workflow.module.lidi.tth.mapper.TthDossierMapper;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierQuestionRepository;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TthDossierService {

  private final TthDossierRepository dossierRepository;
  private final TthDossierQuestionRepository questionRepository;
  private final TimetableHearingStatementClient timetableHearingStatementClient;
  private final TthDossierNotificationService notificationService;
  private final BoContactPermissionService boContactPermissionService;

  @PostAuthorize("""
      @cantonBasedUserAdministrationService.isAtLeastExplicitReader(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).TIMETABLE_HEARING)
      or
      @boUserMailCheckService.isCurrentUserMailAssignedTo(returnObject)""")
  public TthDossier getDossierById(Long dossierId) {
    return dossierRepository.findById(dossierId).orElseThrow(() -> new IdNotFoundException(dossierId));
  }

  @Transactional
  @PreAuthorize("""
      @cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).TIMETABLE_HEARING, #dossier)""")
  public TthDossier createDossier(TthDossier dossier) {
    boContactPermissionService.checkPermissionForBoContactMail(dossier.getBoContactMail());

    dossier.setDossierStatus(DossierStatus.ADDED);
    TthDossier tthDossier = dossierRepository.saveAndFlush(dossier);
    timetableHearingStatementClient.updateStatements(TthDossierMapper.toBatchUpdateModel(dossier));
    return tthDossier;
  }

  @Transactional
  @PreAuthorize("""
      @cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).TIMETABLE_HEARING, #dossier)""")
  public void sendDossierToBo(TthDossier dossier) {
    dossier.setDossierStatus(DossierStatus.DOSSIER_BO_CHECK);

    notificationService.notifyBoAboutNewQuestion(dossier);

    dossierRepository.save(dossier);
  }

  @Transactional
  @PreAuthorize("""
      @cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).TIMETABLE_HEARING, #dossier)""")
  public void completeDossier(TthDossier dossier, DossierStatus status) {
    checkDossierIsInEditableStatus(dossier);
    if (!status.isAllowedForCompleteTransition()) {
      throw SimpleAtlasException.builder()
          .status(HttpStatus.BAD_REQUEST)
          .messageAndError("DossierStatus " + status + " is not completable")
          .build();
    }
    timetableHearingStatementClient.updateStatements(TthDossierMapper.toBatchUpdateModel(dossier, status));

    dossier.setDossierStatus(status);
    dossierRepository.saveAndFlush(dossier);
  }

  @Transactional
  @PreAuthorize("""
      @cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).TIMETABLE_HEARING, #dossier)""")
  public TthDossier updateDossier(Long dossierId, TthDossier dossier) {
    TthDossier currentDossier = getDossierById(dossierId);
    checkDossierIsInEditableStatus(currentDossier);
    boContactPermissionService.checkPermissionForBoContactMail(dossier.getBoContactMail());

    updateRemovedStatements(currentDossier, dossier);

    dossier.setDossierStatus(currentDossier.getDossierStatus());
    TthDossier updatedDossier = dossierRepository.saveAndFlush(dossier);
    timetableHearingStatementClient.updateStatements(TthDossierMapper.toBatchUpdateModel(updatedDossier));

    return updatedDossier;
  }

  private void updateRemovedStatements(TthDossier currentDossier, TthDossier dossier) {
    List<Long> removedStatementIds = getRemovedStatementIds(currentDossier, dossier);
    if (!removedStatementIds.isEmpty()) {
      timetableHearingStatementClient.updateStatements(BatchUpdateTimetableHearingStatementsModel.builder()
          .ids(removedStatementIds)
          .dossierCanton(dossier.getSwissCanton())
          .statementStatus(StatementStatus.RECEIVED)
          .publicComment(dossier.getPublicComment())
          .internalComment(dossier.getInternalComment())
          .topic(dossier.getTopic())
          .build());
    }
  }

  private List<Long> getRemovedStatementIds(TthDossier currentDossier, TthDossier updatedDossier) {
    List<Long> currentStatementIds = new ArrayList<>(currentDossier.getStatementIds());
    currentStatementIds.removeAll(updatedDossier.getStatementIds());
    return currentStatementIds;
  }

  private static void checkDossierIsInEditableStatus(TthDossier dossier) {
    if (!dossier.getDossierStatus().isDossierEditable()) {
      throw SimpleAtlasException.builder()
          .status(HttpStatus.PRECONDITION_FAILED)
          .messageAndError("Dossier is not updatable in status " + dossier.getDossierStatus())
          .displayCode("TTH.DOSSIER_NOT_EDITABLE")
          .build();
    }
  }

  @Transactional
  public void answerQuestion(Long questionId, String boAnswer) {
    TthDossierQuestion question = questionRepository.findById(questionId).orElseThrow(() -> new IdNotFoundException(questionId));
    TthDossier tthDossier = question.getTthDossier();

    if (tthDossier.getDossierStatus() != DossierStatus.DOSSIER_BO_CHECK) {
      throw SimpleAtlasException.builder()
          .status(HttpStatus.PRECONDITION_FAILED)
          .messageAndError("Dossier is not in status DOSSIER_BO_CHECK")
          .displayCode("TTH.DOSSIER_NOT_IN_BO_CHECK_STATUS")
          .build();
    }

    question.setAnswerToCanton(boAnswer);
    tthDossier.setDossierStatus(DossierStatus.DOSSIER_CANTON_CHECK);
    questionRepository.save(question);
    dossierRepository.save(tthDossier);
  }
}
