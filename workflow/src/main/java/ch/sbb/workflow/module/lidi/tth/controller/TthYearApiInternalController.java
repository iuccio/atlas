package ch.sbb.workflow.module.lidi.tth.controller;

import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import ch.sbb.atlas.api.workflow.TthYearApiInternal;
import ch.sbb.workflow.module.lidi.tth.service.TthYearService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TthYearApiInternalController implements TthYearApiInternal {

  private final TthYearService tthYearService;

  @Override
  public void addTimetableHearingYear(TimetableHearingYearModel timetableHearingYearModel) {
    tthYearService.addTimetableHearingYear(timetableHearingYearModel);
  }

  @Override
  public TimetableHearingYearModel closeTimetableHearingYear(Long year) {
    return tthYearService.closeTimetableHearingYear(year);
  }
}
