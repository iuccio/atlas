package ch.sbb.line.directory.controller;

import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearApiInternal;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.line.directory.entity.TimetableHearingYear;
import ch.sbb.line.directory.mapper.TimeTableHearingYearMapper;
import ch.sbb.line.directory.model.TimetableHearingYearSearchRestrictions;
import ch.sbb.line.directory.service.hearing.TimetableHearingYearService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TimetableHearingYearControllerInternal implements TimetableHearingYearApiInternal {

  private final TimetableHearingYearService timetableHearingYearService;

  @Override
  public List<TimetableHearingYearModel> getHearingYears(List<HearingStatus> statusChoices) {
    List<TimetableHearingYear> hearingYears = timetableHearingYearService.getHearingYears(
        TimetableHearingYearSearchRestrictions.builder()
            .statusRestrictions(statusChoices)
            .build());
    return hearingYears.stream()
        .map(TimeTableHearingYearMapper::toModel)
        .toList();
  }

  @Override
  public TimetableHearingYearModel getHearingYear(Long year) {
    return TimeTableHearingYearMapper.toModel(timetableHearingYearService.getHearingYear(year));
  }

  @Override
  public TimetableHearingYearModel createHearingYear(TimetableHearingYearModel hearingYearModel) {
    TimetableHearingYear newHearing = timetableHearingYearService.createTimetableHearing(
        TimeTableHearingYearMapper.toEntity(hearingYearModel));
    return TimeTableHearingYearMapper.toModel(newHearing);
  }

  @Override
  public TimetableHearingYearModel startHearingYear(Long year) {
    TimetableHearingYear hearingYear = timetableHearingYearService.getHearingYear(year);
    TimetableHearingYear startedHearing = timetableHearingYearService.startTimetableHearing(hearingYear);
    return TimeTableHearingYearMapper.toModel(startedHearing);
  }

  @Override
  public TimetableHearingYearModel updateTimetableHearingSettings(Long year, TimetableHearingYearModel hearingYearModel) {
    TimetableHearingYear updatedHearing = timetableHearingYearService.updateTimetableHearingSettings(year,
        TimeTableHearingYearMapper.toEntity(hearingYearModel));
    return TimeTableHearingYearMapper.toModel(updatedHearing);
  }

  @Override
  public TimetableHearingYearModel closeTimetableHearing(Long year) {
    TimetableHearingYear hearingYear = timetableHearingYearService.getHearingYear(year);
    TimetableHearingYear closedHearing = timetableHearingYearService.closeTimetableHearing(hearingYear);
    return TimeTableHearingYearMapper.toModel(closedHearing);
  }
}
