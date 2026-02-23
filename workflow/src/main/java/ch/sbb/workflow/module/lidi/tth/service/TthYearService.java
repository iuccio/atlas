package ch.sbb.workflow.module.lidi.tth.service;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingYearApiInternalClient;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.model.exception.SimpleAtlasException;
import ch.sbb.workflow.aop.LoggingAspect.WorkflowType;
import ch.sbb.workflow.aop.MethodLogged;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierYear;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierYearRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TthYearService {

  private final TimetableHearingYearApiInternalClient timetableHearingYearApiInternalClient;
  private final TthDossierService tthDossierService;
  private final TthDossierYearRepository tthDossierYearRepository;

  @Transactional
  public void addTimetableHearingYear(TimetableHearingYearModel timetableHearingYearModel) {
    TthDossierYear tthDossierYear = TthDossierYear.builder()
        .timetableYear(timetableHearingYearModel.getTimetableYear())
        .hearingStatus(timetableHearingYearModel.getHearingStatus())
        .build();

    tthDossierYearRepository.save(tthDossierYear);
  }

  @Transactional
  @MethodLogged(workflowType = WorkflowType.TTH_DOSSIER_WORKFLOW)
  public TimetableHearingYearModel closeTimetableHearingYear(Long year) {
    List<Long> statementIdsToRemoveFromDossier = tthDossierService.getStatementIdsFromDossierStatus(List.of(
        DossierStatus.ADDED, DossierStatus.DOSSIER_BO_CHECK, DossierStatus.DOSSIER_CANTON_CHECK, DossierStatus.MOVED
    ));
    tthDossierService.updateDossierStatusClosingYear();
    updateDossierYearStatusToArchive(year);
    return timetableHearingYearApiInternalClient.closeTimetableHearing(year, statementIdsToRemoveFromDossier);
  }

  @Transactional
  protected void updateDossierYearStatusToArchive(Long year) {
    TthDossierYear tthDossierYear = tthDossierYearRepository.findById(year)
        .orElseThrow(() -> SimpleAtlasException.builder()
            .message("TthDossierYear with year " + year + " not found")
            .status(HttpStatus.NOT_FOUND)
            .error("Year not Found")
            .build());

    tthDossierYear.setHearingStatus(HearingStatus.ARCHIVED);
    tthDossierYearRepository.save(tthDossierYear);
  }
}
