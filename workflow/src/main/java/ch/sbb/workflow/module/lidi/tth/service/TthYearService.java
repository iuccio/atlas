package ch.sbb.workflow.module.lidi.tth.service;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingYearApiInternalClient;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.workflow.aop.LoggingAspect.WorkflowType;
import ch.sbb.workflow.aop.MethodLogged;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TthYearService {

  private final TimetableHearingYearApiInternalClient timetableHearingYearApiInternalClient;
  private final TthDossierService tthDossierService;

  @Transactional
  @MethodLogged(workflowType = WorkflowType.TTH_DOSSIER_WORKFLOW)
  public TimetableHearingYearModel closeTimetableHearingYear(Long year) {
    List<Long> statementIdsToRemoveFromDossier = tthDossierService.getStatementIdsFromDossierStatus(List.of(
        DossierStatus.ADDED, DossierStatus.DOSSIER_BO_CHECK, DossierStatus.DOSSIER_CANTON_CHECK, DossierStatus.MOVED
    ));
    tthDossierService.updateDossierStatusClosingYear();
    return timetableHearingYearApiInternalClient.closeTimetableHearing(year, statementIdsToRemoveFromDossier);
  }
}