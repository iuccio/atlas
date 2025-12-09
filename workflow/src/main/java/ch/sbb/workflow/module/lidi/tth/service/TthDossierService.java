package ch.sbb.workflow.module.lidi.tth.service;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.client.user.administration.UserAdministrationClient;
import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.user.administration.PermissionModel;
import ch.sbb.atlas.api.user.administration.UserModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.kafka.model.user.admin.ApplicationType;
import ch.sbb.atlas.kafka.model.user.admin.PermissionRestrictionType;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TthDossierService {

  private final TthDossierRepository dossierRepository;
  private final TthDossierQuestionRepository questionRepository;
  private final TimetableHearingStatementClient timetableHearingStatementClient;
  private final TthDossierNotificationService notificationService;
  private final UserAdministrationClient userAdministrationClient;

  public TthDossier getDossierById(Long dossierId) {
    return dossierRepository.findById(dossierId).orElseThrow(() -> new IdNotFoundException(dossierId));
  }

  @Transactional
  public TthDossier createDossier(TthDossier dossier) {
    dossier.setDossierStatus(DossierStatus.ADDED);
    checkPermissionForBoContactMail(dossier.getBoContactMail());
    TthDossier tthDossier = dossierRepository.saveAndFlush(dossier);
    timetableHearingStatementClient.updateStatements(TthDossierMapper.toBatchUpdateModel(dossier));
    return tthDossier;
  }

  @Transactional
  public void sendDossierToBo(Long dossierId) {
    TthDossier tthDossier = getDossierById(dossierId);
    tthDossier.setDossierStatus(DossierStatus.DOSSIER_BO_CHECK);

    notificationService.notifyBoAboutNewQuestion(tthDossier);

    dossierRepository.save(tthDossier);
  }

  @Transactional
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
  public TthDossier updateDossier(Long dossierId, TthDossier dossier) {
    TthDossier currentDossier = getDossierById(dossierId);
    checkDossierIsInEditableStatus(currentDossier);

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

  //TODO add test
  private void checkPermissionForBoContactMail(String mail) {
    UserModel user = userAdministrationClient.getUserByMail(mail);

    PermissionModel permission =
        user.getPermissions().stream()
            .filter(permissionModel -> permissionModel.getApplication().equals(ApplicationType.TIMETABLE_HEARING)).toList()
            .getFirst();

    boolean hasPermission = permission.getPermissionRestrictions()
        .stream()
        .filter(i -> i.getType() == PermissionRestrictionType.TRANSPORT_COMPANY_DOSSIER_ANSWER)
        .anyMatch(i -> Boolean.parseBoolean(i.getValueAsString()));

    if (!hasPermission) {
      //TODO add custom Exception
      throw new RuntimeException();
    }
  }
}
