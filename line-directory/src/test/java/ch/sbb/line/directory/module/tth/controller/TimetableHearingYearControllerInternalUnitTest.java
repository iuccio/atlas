package ch.sbb.line.directory.module.tth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.line.directory.module.tth.entity.TimetableHearingYear;
import ch.sbb.line.directory.module.tth.service.TimetableHearingStatementService;
import ch.sbb.line.directory.module.tth.service.TimetableHearingYearService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TimetableHearingYearControllerInternalUnitTest {

  @Mock
  private TimetableHearingYearService timetableHearingYearService;
  @Mock
  private TimetableHearingStatementService timetableHearingStatementService;

  @InjectMocks
  private TimetableHearingYearControllerInternal timetableHearingYearControllerInternal;

  @Test
  void shouldCloseTimetableHearingCorrectly() {
    // given
    long year = 2026;
    var tthYearActive = TimetableHearingYear.builder().hearingStatus(HearingStatus.ACTIVE).build();
    var tthYearClosed = TimetableHearingYear.builder().hearingStatus(HearingStatus.ARCHIVED).build();
    when(timetableHearingYearService.getHearingYear(anyLong())).thenReturn(tthYearActive);
    doNothing().when(timetableHearingYearService)
        .mayTransitionToHearingStatus(any(TimetableHearingYear.class), any(HearingStatus.class));
    doNothing().when(timetableHearingStatementService).deleteSpamMailFromYear(anyLong());
    doNothing().when(timetableHearingYearService).transitionStatusAccordingDossier();
    when(timetableHearingYearService.closeTimetableHearing(any(TimetableHearingYear.class))).thenReturn(tthYearClosed);
    // when
    TimetableHearingYearModel closedHearingYear = timetableHearingYearControllerInternal.closeTimetableHearing(year);
    // then
    assertThat(closedHearingYear.getHearingStatus()).isEqualTo(HearingStatus.ARCHIVED);
    verify(timetableHearingYearService).getHearingYear(year);
    verify(timetableHearingYearService).mayTransitionToHearingStatus(tthYearActive, HearingStatus.ARCHIVED);
    verify(timetableHearingStatementService).deleteSpamMailFromYear(year);
    verify(timetableHearingYearService).transitionStatusAccordingDossier();
    verify(timetableHearingYearService).closeTimetableHearing(tthYearActive);
  }
}