package ch.sbb.workflow.module.lidi.tth.service;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.model.exception.NotFoundException.IdNotFoundException;
import ch.sbb.atlas.model.exception.SimpleAtlasException;
import ch.sbb.atlas.user.administration.security.redact.TthRedacted;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import ch.sbb.workflow.module.lidi.tth.mail.TthDossierNotificationService;
import ch.sbb.workflow.module.lidi.tth.mapper.TthDossierMapper;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierQuestionRepository;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import ch.sbb.workflow.module.lidi.tth.search.TthDossierSearchRestrictions;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

  public List<Long> getStatementIdsFromDossierStatus(List<DossierStatus> dossierStatus) {
    return dossierRepository.findStatementIdsByDossierStatusIn(dossierStatus);
  }

  @Transactional
  public void updateDossierStatusClosingYear() {
    dossierRepository.updateDossierStatusFromAddedToCanceled();
    dossierRepository.updateDossierStatusFromCheckOrMovedToDissolved();
  }

  @TthRedacted
  @PostAuthorize("@cantonBasedUserAdministrationService.isAtLeastExplicitReader(T(ch.sbb.atlas.kafka.model.user.admin"
      + ".ApplicationType).TIMETABLE_HEARING) || @boUserMailCheckService.isCurrentUserMailAssignedTo(returnObject)")
  public TthDossier getDossierById(Long dossierId) {
    return findDossier(dossierId);
  }

  @PostAuthorize("@cantonBasedUserAdministrationService.isAtLeastExplicitReader(T(ch.sbb.atlas.kafka.model.user.admin"
      + ".ApplicationType).TIMETABLE_HEARING)")
  public Page<TthDossier> getDossiers(TthDossierSearchRestrictions searchRestrictions) {
    return dossierRepository.findAll(searchRestrictions.getSpecification(),
        searchRestrictions.getPageable());
  }

  @TthRedacted
  @PostAuthorize("@boUserMailCheckService.isCurrentUserMailAssignedTo(returnObject)")
  public TthDossier getDossierForBo(Long dossierId) {
    TthDossier dossier = findDossier(dossierId);
    if (dossier.getDossierStatus() != DossierStatus.DOSSIER_BO_CHECK) {
      throw SimpleAtlasException.builder()
          .status(HttpStatus.FORBIDDEN)
          .messageAndError("Dossier is already answered")
          .displayCode("TTH.ERROR.DOSSIER_ALREADY_ANSWERED")
          .build();
    }
    return dossier;
  }

  @Transactional
  @PreAuthorize("@cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType)"
      + ".TIMETABLE_HEARING, #dossier)")
  public TthDossier createDossier(TthDossier dossier) {
    boContactPermissionService.checkPermissionForBoContactMail(dossier.getBoContactMail());

    dossier.setDossierStatus(DossierStatus.ADDED);
    TthDossier tthDossier = dossierRepository.saveAndFlush(dossier);
    timetableHearingStatementClient.updateStatements(TthDossierMapper.toBatchUpdateModel(dossier));
    return tthDossier;
  }

  @Transactional
  @PreAuthorize("@cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType)"
      + ".TIMETABLE_HEARING, #dossier)")
  public void sendDossierToBo(TthDossier dossier) {
    dossier.setDossierStatus(DossierStatus.DOSSIER_BO_CHECK);

    notificationService.notifyBoAboutNewQuestion(dossier);

    dossierRepository.save(dossier);
  }

  @Transactional
  @PreAuthorize("@cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType)"
      + ".TIMETABLE_HEARING, #dossier)")
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
  @PreAuthorize("@cantonBasedUserAdministrationService.isAtLeastWriter(T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType)"
      + ".TIMETABLE_HEARING, #dossier)")
  public TthDossier updateDossier(Long dossierId, TthDossier dossier) {
    TthDossier currentDossier = getDossierById(dossierId);
    checkDossierIsInEditableStatus(currentDossier);
    if (!dossier.getDossierStatus().isAllowedForUpdate()) {
      dossier.setDossierStatus(currentDossier.getDossierStatus());
    }
    boContactPermissionService.checkPermissionForBoContactMail(dossier.getBoContactMail());

    updateRemovedStatements(currentDossier, dossier);

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
  @PreAuthorize("@boUserMailCheckService.isCurrentUserMailAssignedTo(#tthDossier)")
  public void answerQuestion(Long questionId, String boAnswer, TthDossier tthDossier) {
    TthDossierQuestion question = questionRepository.findById(questionId).orElseThrow(() -> new IdNotFoundException(questionId));

    if (tthDossier.getDossierStatus() != DossierStatus.DOSSIER_BO_CHECK) {
      throw SimpleAtlasException.builder()
          .status(HttpStatus.PRECONDITION_FAILED)
          .messageAndError("Dossier is not in status DOSSIER_BO_CHECK")
          .displayCode("TTH.DOSSIER_NOT_IN_BO_CHECK_STATUS")
          .build();
    }

    tthDossier.setDossierStatus(DossierStatus.DOSSIER_CANTON_CHECK);
    dossierRepository.save(tthDossier);

    question.setAnswerToCanton(boAnswer);
    questionRepository.save(question);
  }

  public TthDossier getDossierByQuestionId(Long questionId) {
    return questionRepository.findByIdWithDossier(questionId).orElseThrow(() -> new IdNotFoundException(questionId))
        .getTthDossier();
  }

  public TthDossier findDossier(Long id) {
    return dossierRepository.findById(id).orElseThrow(() -> new IdNotFoundException(id));
  }
}