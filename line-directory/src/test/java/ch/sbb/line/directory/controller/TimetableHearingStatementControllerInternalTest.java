package ch.sbb.line.directory.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementRequestParams;
import ch.sbb.atlas.model.exception.BadRequestException;
import ch.sbb.line.directory.service.hearing.ResponsibleTransportCompaniesResolverService;
import ch.sbb.line.directory.service.hearing.TimetableFieldNumberResolverService;
import ch.sbb.line.directory.service.hearing.TimetableHearingStatementAlternationService;
import ch.sbb.line.directory.service.hearing.TimetableHearingStatementExportService;
import ch.sbb.line.directory.service.hearing.TimetableHearingStatementService;
import ch.sbb.line.directory.service.hearing.TimetableHearingYearService;
import java.time.LocalDate;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Pageable;

class TimetableHearingStatementControllerInternalTest {

  @Mock
  private TimetableHearingStatementService timetableHearingStatementService;

  @Mock
  private TimetableHearingYearService timetableHearingYearService;

  @Mock
  private TimetableFieldNumberResolverService timetableFieldNumberResolverService;

  @Mock
  private ResponsibleTransportCompaniesResolverService responsibleTransportCompaniesResolverService;

  @Mock
  private TimetableHearingStatementExportService timetableHearingStatementExportService;

  @Mock
  private TimetableHearingStatementAlternationService timetableHearingStatementAlternationService;

  private TimetableHearingStatementControllerInternal timetableHearingStatementControllerInternal;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    timetableHearingStatementControllerInternal = new TimetableHearingStatementControllerInternal(
        timetableHearingStatementService,
        timetableHearingStatementAlternationService, timetableHearingYearService, timetableFieldNumberResolverService,
        responsibleTransportCompaniesResolverService, timetableHearingStatementExportService);
  }

  @Test
  void shouldLoadResponsibleTransportCompaniesByYear() {
    when(responsibleTransportCompaniesResolverService.getResponsibleTransportCompanies(any(), any()))
        .thenReturn(Collections.emptyList());

    timetableHearingStatementControllerInternal.getResponsibleTransportCompanies("ttfnid", 2024L);

    verify(responsibleTransportCompaniesResolverService).getResponsibleTransportCompanies("ttfnid", LocalDate.of(2024, 1, 1));
  }

  @Test
  void shouldRequireTimetableHearingYear() {
    TimetableHearingStatementRequestParams params = TimetableHearingStatementRequestParams.builder()
        .build();

    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> timetableHearingStatementControllerInternal.getStatementsAsCsv("de", params));

    assertThat(exception.getErrorResponse().getMessage()).isEqualTo("timetableHearingYear is mandatory here");
  }

  @Test
  void shouldRequireLanguage() {
    TimetableHearingStatementRequestParams params = TimetableHearingStatementRequestParams.builder()
        .timetableHearingYear(2023L)
        .build();

    BadRequestException exception = assertThrows(BadRequestException.class,
        () -> timetableHearingStatementControllerInternal.getStatementsAsCsv("en", params));

    assertThat(exception.getErrorResponse().getMessage()).isEqualTo("Language must be either de,fr,it");
  }

  @Test
  void shouldCalculateNextStatement() {
    TimetableHearingStatementRequestParams params = TimetableHearingStatementRequestParams.builder().build();
    timetableHearingStatementControllerInternal.getNextStatement(1L, Pageable.ofSize(1), params);

    verify(timetableHearingStatementAlternationService).getNextStatement(1L, Pageable.ofSize(1), params);
  }

  @Test
  void shouldCalculatePreviousStatement() {
    TimetableHearingStatementRequestParams params = TimetableHearingStatementRequestParams.builder().build();
    timetableHearingStatementControllerInternal.getPreviousStatement(1L, Pageable.ofSize(1), params);

    verify(timetableHearingStatementAlternationService).getPreviousStatement(1L, Pageable.ofSize(1), params);
  }
}
