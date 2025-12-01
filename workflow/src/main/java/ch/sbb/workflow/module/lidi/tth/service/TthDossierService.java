package ch.sbb.workflow.module.lidi.tth.service;

import static ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.ALLOWED_STATUSES_FOR_COMPLETE;
import static ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.UNEDITABLE_DOSSIERS;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.model.exception.NotFoundException.IdNotFoundException;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.mail.TthDossierNotificationService;
import ch.sbb.workflow.module.lidi.tth.mapper.TthDossierMapper;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TthDossierService {

  private final TthDossierRepository dossierRepository;
  private final TimetableHearingStatementClient timetableHearingStatementClient;
  private final TthDossierNotificationService notificationService;

  public TthDossier getDossierById(Long dossierId) {
    return dossierRepository.findById(dossierId).orElseThrow(() -> new IdNotFoundException(dossierId));
  }

  @Transactional
  public TthDossier createDossier(TthDossier dossier) {
    dossier.setDossierStatus(DossierStatus.ADDED);
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
    if (!ALLOWED_STATUSES_FOR_COMPLETE.contains(status)) {
      throw new IllegalArgumentException("DossierStatus " + status + " is not completable");
    }
    timetableHearingStatementClient.updateStatements(TthDossierMapper.toBatchUpdateModel(dossier, status));

    dossier.setDossierStatus(status);
    dossierRepository.saveAndFlush(dossier);
  }

  @Transactional
  public TthDossier updateDossier(Long dossierId, TthDossier dossier) {
    TthDossier currentDossier = getDossierById(dossierId);
    checkDossierIsInEditableStatus(currentDossier);

    dossier.setDossierStatus(currentDossier.getDossierStatus());
    TthDossier updatedDossier = dossierRepository.saveAndFlush(dossier);
    timetableHearingStatementClient.updateStatements(TthDossierMapper.toBatchUpdateModel(updatedDossier));

    updateRemovedStatements(currentDossier, dossier);
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
    if (UNEDITABLE_DOSSIERS.contains(dossier.getDossierStatus())) {
      throw new IllegalStateException("Dossier is not updatable in status " + dossier.getDossierStatus());
    }
  }
}
