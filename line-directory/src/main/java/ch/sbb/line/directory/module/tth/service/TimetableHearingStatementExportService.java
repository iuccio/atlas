package ch.sbb.line.directory.module.tth.service;

import static java.util.Comparator.comparing;

import ch.sbb.atlas.amazon.service.FileService;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingStatementModelV2;
import ch.sbb.atlas.export.AtlasCsvMapper;
import ch.sbb.atlas.export.CsvExportWriter;
import ch.sbb.atlas.export.LocalizedPropertyNamingStrategy;
import ch.sbb.line.directory.module.tth.model.TimetableHearingAnonymStatementCsvModel;
import ch.sbb.line.directory.module.tth.model.TimetableHearingStatementCsvModel;
import java.io.File;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TimetableHearingStatementExportService {

  private static final String OUTPUT_DIR = "statements";

  private final FileService fileService;
  private final MessageSource timetableHearingStatementCsvTranslations;

  public File getStatementsAsCsv(List<TimetableHearingStatementModelV2> statements, Locale locale, boolean anonymized) {
    if (anonymized) {
      List<TimetableHearingAnonymStatementCsvModel> csvData = statements.stream()
          .map(TimetableHearingAnonymStatementCsvModel::fromModelAnonymized)
          .sorted(comparing(TimetableHearingAnonymStatementCsvModel::getTimetabeHearingStatementId)).toList();
      return writeCsv(csvData, TimetableHearingAnonymStatementCsvModel.class, locale);
    } else {
      List<TimetableHearingStatementCsvModel> csvData = statements.stream()
          .map(TimetableHearingStatementCsvModel::fromModel)
          .sorted(comparing(TimetableHearingStatementCsvModel::getTimetabeHearingStatementId)).toList();
      return writeCsv(csvData, TimetableHearingStatementCsvModel.class, locale);
    }
  }

  private <T> File writeCsv(List<T> csvData, Class<T> elementClass, Locale locale) {
    AtlasCsvMapper mapper = new AtlasCsvMapper(elementClass,
        new LocalizedPropertyNamingStrategy(timetableHearingStatementCsvTranslations, locale));
    String dir = fileService.getDir();
    File outputDir = new File(dir, OUTPUT_DIR);
    return CsvExportWriter.writeToFile(outputDir.getPath(), csvData, mapper.getObjectWriter());
  }
}
