package ch.sbb.workflow.module.lidi.tth.controller;

import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import ch.sbb.workflow.module.lidi.tth.api.TthYearApiInternal;
import ch.sbb.workflow.module.lidi.tth.service.TthYearService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TthYearApiInternalController implements TthYearApiInternal {

  private final TthYearService tthYearService;

  @Override
  public TimetableHearingYearModel closeTimetableHearingYear(Long year) {
    return tthYearService.closeTimetableHearingYear(year);
  }
}