package ch.sbb.line.directory.module.tth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.assertArg;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.line.directory.module.tth.client.WorkflowClient;
import ch.sbb.line.directory.module.tth.entity.TimetableHearingYear;
import ch.sbb.line.directory.module.tth.exception.HearingCurrentlyActiveException;
import ch.sbb.line.directory.module.tth.repository.TimetableHearingYearRepository;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class TimetableHearingYearServiceUnitTest {

  private TimetableHearingYearService timetableHearingYearService;

  @Mock
  private TimetableHearingYearRepository timetableHearingYearRepository;
  @Mock
  private TimetableHearingStatementService timetableHearingStatementService;
  @Mock
  private WorkflowClient workflowClient;

  private AutoCloseable closeable;

  @BeforeEach
  void setUp() {
    closeable = MockitoAnnotations.openMocks(this);
    timetableHearingYearService = new TimetableHearingYearService(
        timetableHearingYearRepository,
        timetableHearingStatementService,
        workflowClient
    );
  }

  @AfterEach
  void tearDown() throws Exception {
    closeable.close();
  }

  @Test
  void shouldTransitionStatusAccordingDossierWithCorrectFlow() {
    // given
    when(workflowClient.getStatementIdsFromStatus(anyList())).thenReturn(List.of(1L, 5L, 7L));
    doNothing().when(timetableHearingStatementService).updateStatementsToReceived(anyList());
    doNothing().when(workflowClient).patchDossierStatusClosingYear();
    // when
    timetableHearingYearService.transitionStatusAccordingDossier();
    // then
    verify(workflowClient).getStatementIdsFromStatus(
        List.of(DossierStatus.ADDED, DossierStatus.DOSSIER_BO_CHECK, DossierStatus.DOSSIER_CANTON_CHECK));
    verify(timetableHearingStatementService).updateStatementsToReceived(List.of(1L, 5L, 7L));
    verify(workflowClient).patchDossierStatusClosingYear();
  }

  @Test
  void shouldCloseTimetableHearingCorrectly() {
    // given
    var tthYear = TimetableHearingYear.builder()
        .timetableYear(2026L)
        .build();
    doNothing().when(timetableHearingStatementService).moveClosedStatementsToNextYearWithStatusUpdates(anyLong());
    when(timetableHearingYearRepository.save(any(TimetableHearingYear.class))).thenReturn(null);
    // when
    timetableHearingYearService.closeTimetableHearing(tthYear);
    // then
    verify(timetableHearingStatementService).moveClosedStatementsToNextYearWithStatusUpdates(2026L);
    verify(timetableHearingYearRepository).save(assertArg(arg -> {
      assertThat(arg.isStatementCreatableInternal()).isFalse();
      assertThat(arg.isStatementCreatableExternal()).isFalse();
      assertThat(arg.isStatementEditable()).isFalse();
      assertThat(arg.getHearingStatus()).isEqualTo(HearingStatus.ARCHIVED);
      assertThat(arg.getTimetableYear()).isEqualTo(tthYear.getTimetableYear());
    }));
  }

  @Test
  void shouldThrowWhenTransitionToActiveWhenCurrentlyActive() {
    // given
    when(timetableHearingYearRepository.hearingActive()).thenReturn(true);
    // when
    assertThrows(HearingCurrentlyActiveException.class, () -> timetableHearingYearService.mayTransitionToHearingStatus(null,
        HearingStatus.ACTIVE));
  }

  @Test
  void shouldThrowWhenTransitionToActiveWhenNotCurrentlyActiveAndYearNotPlanned() {
    // given
    var activeYear = TimetableHearingYear.builder()
        .hearingStatus(HearingStatus.ACTIVE)
        .build();
    when(timetableHearingYearRepository.hearingActive()).thenReturn(false);
    // when
    assertThrows(IllegalStateException.class,
        () -> timetableHearingYearService.mayTransitionToHearingStatus(activeYear, HearingStatus.ACTIVE));
  }

  @Test
  void shouldThrowWhenTransitionToArchivedWhenYearNotActive() {
    // given
    var plannedYear = TimetableHearingYear.builder()
        .hearingStatus(HearingStatus.PLANNED)
        .build();
    // when
    assertThrows(IllegalStateException.class,
        () -> timetableHearingYearService.mayTransitionToHearingStatus(plannedYear, HearingStatus.ARCHIVED));
  }
}