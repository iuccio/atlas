package ch.sbb.line.directory.controller;

import ch.sbb.atlas.amazon.exception.FileException;
import ch.sbb.atlas.api.bodi.TransportCompanyModel;
import ch.sbb.atlas.api.model.Container;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementAlternatingModel;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementApiInternal;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementModelV2;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementRequestParams;
import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.atlas.api.timetable.hearing.model.UpdateHearingCantonModel;
import ch.sbb.atlas.api.timetable.hearing.model.UpdateHearingStatementStatusModel;
import ch.sbb.atlas.model.exception.BadRequestException;
import ch.sbb.line.directory.entity.TimetableHearingStatement;
import ch.sbb.line.directory.entity.TimetableHearingYear;
import ch.sbb.line.directory.entity.TimetableHearingYear_;
import ch.sbb.line.directory.exception.ForbiddenDueToHearingYearSettingsException;
import ch.sbb.line.directory.exception.ForbiddenDueWrongStatementTimeTableYearException;
import ch.sbb.line.directory.mapper.TimetableHearingStatementMapperV2;
import ch.sbb.line.directory.model.TimetableHearingStatementSearchRestrictions;
import ch.sbb.line.directory.service.hearing.ResponsibleTransportCompaniesResolverService;
import ch.sbb.line.directory.service.hearing.TimetableFieldNumberResolverService;
import ch.sbb.line.directory.service.hearing.TimetableHearingStatementAlternationService;
import ch.sbb.line.directory.service.hearing.TimetableHearingStatementExportService;
import ch.sbb.line.directory.service.hearing.TimetableHearingStatementService;
import ch.sbb.line.directory.service.hearing.TimetableHearingYearService;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TimetableHearingStatementControllerInternal implements TimetableHearingStatementApiInternal {

  private final TimetableHearingStatementService timetableHearingStatementService;
  private final TimetableHearingStatementAlternationService timetableHearingStatementAlternationService;
  private final TimetableHearingYearService timetableHearingYearService;
  private final TimetableFieldNumberResolverService timetableFieldNumberResolverService;
  private final ResponsibleTransportCompaniesResolverService responsibleTransportCompaniesResolverService;
  private final TimetableHearingStatementExportService timetableHearingStatementExportService;

  @Override
  public Container<TimetableHearingStatementModelV2> getStatements(Pageable pageable,
      TimetableHearingStatementRequestParams statementRequestParams) {
    Page<TimetableHearingStatement> hearingStatements = timetableHearingStatementService.getHearingStatements(
        TimetableHearingStatementSearchRestrictions.builder()
            .pageable(pageable)
            .statementRequestParams(statementRequestParams).build());
    List<TimetableHearingStatementModelV2> enrichedModels = timetableFieldNumberResolverService.resolveAdditionalVersionInfo(
        hearingStatements.stream().map(TimetableHearingStatementMapperV2::toModel).toList());
    return Container.<TimetableHearingStatementModelV2>builder()
        .objects(enrichedModels)
        .totalCount(hearingStatements.getTotalElements())
        .build();
  }

  @Override
  public Resource getStatementsAsCsv(String language, TimetableHearingStatementRequestParams statementRequestParams) {
    if (statementRequestParams.getTimetableHearingYear() == null) {
      throw new BadRequestException("timetableHearingYear is mandatory here");
    }
    if (!Set.of("de", "fr", "it").contains(language)) {
      throw new BadRequestException("Language must be either de,fr,it");
    }

    Container<TimetableHearingStatementModelV2> statements = getStatements(Pageable.unpaged(), statementRequestParams);
    File csvFile = timetableHearingStatementExportService.getStatementsAsCsv(
        statements.getObjects(),
        Locale.forLanguageTag(language)
    );

    try {
      return new InputStreamResource(new FileInputStream(csvFile));
    } catch (IOException e) {
      throw new FileException(e);
    }
  }

  @Override
  public TimetableHearingStatementModelV2 getStatement(Long id) {
    return TimetableHearingStatementMapperV2.toModel(timetableHearingStatementService.getTimetableHearingStatementById(id));
  }

  @Override
  public TimetableHearingStatementAlternatingModel getPreviousStatement(Long id, Pageable pageable,
      TimetableHearingStatementRequestParams statementRequestParams) {
    return timetableHearingStatementAlternationService.getPreviousStatement(id, pageable, statementRequestParams);
  }

  @Override
  public TimetableHearingStatementAlternatingModel getNextStatement(Long id, Pageable pageable,
      TimetableHearingStatementRequestParams statementRequestParams) {
    return timetableHearingStatementAlternationService.getNextStatement(id, pageable, statementRequestParams);
  }

  @Override
  public Resource getStatementDocument(Long id, String filename) {
    File file = timetableHearingStatementService.getStatementDocument(id, filename);
    try {
      return new InputStreamResource(new FileInputStream(file));
    } catch (IOException e) {
      throw new FileException(e);
    }
  }

  @Override
  public void deleteStatementDocument(Long id, String filename) {
    timetableHearingStatementService.deleteStatementDocument(
        timetableHearingStatementService.getTimetableHearingStatementById(id), filename);
  }

  @Override
  public TimetableHearingStatementModelV2 createStatement(TimetableHearingStatementModelV2 statement,
      List<MultipartFile> documents) {
    TimetableHearingYear hearingYear = timetableHearingYearService.getHearingYear(statement.getTimetableYear());
    if (!hearingYear.isStatementCreatableInternal()) {
      throw new ForbiddenDueToHearingYearSettingsException(hearingYear.getTimetableYear(),
          TimetableHearingYear_.STATEMENT_CREATABLE_INTERNAL);
    }
    return timetableHearingStatementService.createHearingStatementV2(statement, documents);
  }

  @Override
  public TimetableHearingStatementModelV2 updateHearingStatement(Long id, TimetableHearingStatementModelV2 statement,
      List<MultipartFile> documents) {
    TimetableHearingYear hearingYear = timetableHearingYearService.getHearingYear(statement.getTimetableYear());
    if (!hearingYear.isStatementEditable()) {
      throw new ForbiddenDueToHearingYearSettingsException(
          hearingYear.getTimetableYear(),
          TimetableHearingYear_.STATEMENT_EDITABLE);
    }
    TimetableHearingStatement existingStatement = timetableHearingStatementService.getTimetableHearingStatementsById(id);
    statement.setId(id);
    TimetableHearingStatement hearingStatement = timetableHearingStatementService.updateHearingStatement(existingStatement,
        statement, documents);
    return TimetableHearingStatementMapperV2.toModel(hearingStatement);
  }

  @Override
  public void updateHearingStatementStatus(UpdateHearingStatementStatusModel updateHearingStatementStatus) {

    if (updateHearingStatementStatus.getIds().isEmpty()) {
      return;
    }

    List<TimetableHearingStatement> timetableHearingStatements =
        timetableHearingStatementService.getTimetableHearingStatementsByIds(
            updateHearingStatementStatus.getIds());

    long firstStatementTimetableYear = timetableHearingStatements.stream().findFirst().orElseThrow().getTimetableYear();

    TimetableHearingYear hearingYear = timetableHearingYearService.getHearingYear(firstStatementTimetableYear);

    boolean hasMoreThanOneTimetableYear =
        timetableHearingStatements.stream().map(TimetableHearingStatement::getTimetableYear).distinct().count() > 1;

    if (hasMoreThanOneTimetableYear) {
      throw new ForbiddenDueWrongStatementTimeTableYearException(
          firstStatementTimetableYear,
          TimetableHearingYear_.TIMETABLE_YEAR);
    }

    if (!hearingYear.isStatementEditable() || hearingYear.getHearingStatus() != HearingStatus.ACTIVE) {
      throw new ForbiddenDueToHearingYearSettingsException(
          hearingYear.getTimetableYear(),
          TimetableHearingYear_.STATEMENT_EDITABLE);
    }

    timetableHearingStatements.forEach(
        timetableHearingStatement -> timetableHearingStatementService.updateHearingStatementStatus(
            timetableHearingStatement,
            updateHearingStatementStatus.getStatementStatus(),
            updateHearingStatementStatus.getJustification()));
  }

  @Override
  public void updateHearingCanton(UpdateHearingCantonModel updateHearingCantonModel) {
    List<TimetableHearingStatement> timetableHearingStatements =
        timetableHearingStatementService.getTimetableHearingStatementsByIds(updateHearingCantonModel.getIds());
    timetableHearingStatements.forEach(
        timetableHearingStatement -> timetableHearingStatementService.updateHearingCanton(timetableHearingStatement,
            updateHearingCantonModel.getSwissCanton(), updateHearingCantonModel.getComment()));
  }

  @Override
  public List<TransportCompanyModel> getResponsibleTransportCompanies(String ttfnid, Long year) {
    LocalDate validOn = LocalDate.of(year.intValue(), 1, 1);
    return responsibleTransportCompaniesResolverService.getResponsibleTransportCompanies(ttfnid, validOn);
  }

}
