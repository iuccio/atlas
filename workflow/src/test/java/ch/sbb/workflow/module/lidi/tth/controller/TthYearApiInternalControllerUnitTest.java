package ch.sbb.workflow.module.lidi.tth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import ch.sbb.workflow.module.lidi.tth.service.TthYearService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TthYearApiInternalControllerUnitTest {

  @Mock
  private TthYearService tthYearService;

  @InjectMocks
  private TthYearApiInternalController tthYearApiInternalController;

  @Test
  void shouldCloseTimetableHearing() {
    // given
    TimetableHearingYearModel tthYear = TimetableHearingYearModel.builder().build();
    when(tthYearService.closeTimetableHearingYear(anyLong())).thenReturn(tthYear);
    // when
    TimetableHearingYearModel closedYear = tthYearApiInternalController.closeTimetableHearing(2026L);
    // then
    assertThat(closedYear).isEqualTo(tthYear);
    verify(tthYearService).closeTimetableHearingYear(2026L);
  }
}