package ch.sbb.exportservice.job.lidi.line.batch;

import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_LINE_CSV_JOB_NAME;
import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_LINE_JSON_JOB_NAME;

import ch.sbb.atlas.amazon.service.FileService;
import ch.sbb.atlas.api.lidi.LineVersionModelV2;
import ch.sbb.exportservice.job.lidi.line.entity.Line;
import ch.sbb.exportservice.job.lidi.line.model.LineCsvModel;
import ch.sbb.exportservice.job.lidi.line.processor.LineCsvProcessor;
import ch.sbb.exportservice.job.lidi.line.processor.LineJsonProcessor;
import ch.sbb.exportservice.job.lidi.line.sql.LineRowMapper;
import ch.sbb.exportservice.job.lidi.line.sql.LineSqlQueryUtil;
import ch.sbb.exportservice.job.lidi.line.writer.CsvLineWriter;
import ch.sbb.exportservice.job.lidi.line.writer.JsonLineWriter;
import ch.sbb.exportservice.listener.JobCompletionListener;
import ch.sbb.exportservice.listener.StepTracerListener;
import ch.sbb.exportservice.model.ExportExtensionFileType;
import ch.sbb.exportservice.model.ExportFilePathV2;
import ch.sbb.exportservice.model.ExportObjectV2;
import ch.sbb.exportservice.model.ExportTypeV2;
import ch.sbb.exportservice.tasklet.delete.FileDeletingTaskletV2;
import ch.sbb.exportservice.tasklet.upload.UploadCsvFileTaskletV2;
import ch.sbb.exportservice.tasklet.upload.UploadJsonFileTaskletV2;
import ch.sbb.exportservice.util.StepUtil;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.json.JsonFileItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class LineExportBatchConfig {

  private final JobRepository jobRepository;
  private final PlatformTransactionManager transactionManager;
  private final JobCompletionListener jobCompletionListener;
  private final StepTracerListener stepTracerListener;
  private final CsvLineWriter csvWriter;
  private final JsonLineWriter jsonWriter;

  private final FileService fileService;

  @Bean
  @StepScope
  public JdbcCursorItemReader<Line> lineReader(
      @Autowired @Qualifier("lineDirectoryDataSource") DataSource dataSource,
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2
  ) {
    JdbcCursorItemReader<Line> itemReader = new JdbcCursorItemReader<>();
    itemReader.setDataSource(dataSource);
    itemReader.setSql(LineSqlQueryUtil.getSqlQuery(exportTypeV2));
    itemReader.setFetchSize(StepUtil.FETCH_SIZE);
    itemReader.setRowMapper(new LineRowMapper());
    return itemReader;
  }

  // --- CSV ---
  @Bean
  @Qualifier(EXPORT_LINE_CSV_JOB_NAME)
  public Job exportLineCsvJob(ItemReader<Line> itemReader) {
    return new JobBuilder(EXPORT_LINE_CSV_JOB_NAME, jobRepository)
        .listener(jobCompletionListener)
        .incrementer(new RunIdIncrementer())
        .flow(exportLineCsvStep(itemReader))
        .next(uploadLineCsvFileStep())
        .next(deleteLineCsvFileStep())
        .end()
        .build();
  }

  @Bean
  public Step exportLineCsvStep(ItemReader<Line> itemReader) {
    final String stepName = "exportLineCsvStep";
    return new StepBuilder(stepName, jobRepository)
        .<Line, LineCsvModel>chunk(StepUtil.CHUNK_SIZE, transactionManager)
        .reader(itemReader)
        .processor(lineCsvProcessor())
        .writer(lineCsvWriter(null))
        .faultTolerant()
        .backOffPolicy(StepUtil.getBackOffPolicy(stepName))
        .retryPolicy(StepUtil.getRetryPolicy(stepName))
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  public LineCsvProcessor lineCsvProcessor() {
    return new LineCsvProcessor();
  }

  @Bean
  @StepScope
  public FlatFileItemWriter<LineCsvModel> lineCsvWriter(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2
  ) {
    return csvWriter.csvWriter(ExportObjectV2.LINE, exportTypeV2);
  }

  // BEGIN: Upload Csv
  @Bean
  public Step uploadLineCsvFileStep() {
    return new StepBuilder("uploadCsvFile", jobRepository)
        .tasklet(uploadLineCsvFileTasklet(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public UploadCsvFileTaskletV2 uploadLineCsvFileTasklet(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2
  ) {
    final ExportFilePathV2 filePath = ExportFilePathV2.getV2Builder(ExportObjectV2.LINE, exportTypeV2)
        .extension(ExportExtensionFileType.CSV_EXTENSION.getExtension())
        .systemDir(fileService.getDir())
        .build();
    return new UploadCsvFileTaskletV2(filePath);
  }
  // END: Upload Csv

  // BEGIN: Delete Csv
  @Bean
  public Step deleteLineCsvFileStep() {
    return new StepBuilder("deleteCsvFile", jobRepository)
        .tasklet(deleteLineCsvFileTasklet(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public FileDeletingTaskletV2 deleteLineCsvFileTasklet(
      @Value("#{jobExecutionContext[filePathV2]}") ExportFilePathV2 filePathV2
  ) {
    return new FileDeletingTaskletV2(filePathV2);
  }
  // END: Delete Csv

  // --- JSON ---
  @Bean
  @Qualifier(EXPORT_LINE_JSON_JOB_NAME)
  public Job exportLineJsonJob(ItemReader<Line> itemReader) {
    return new JobBuilder(EXPORT_LINE_JSON_JOB_NAME, jobRepository)
        .listener(jobCompletionListener)
        .incrementer(new RunIdIncrementer())
        .flow(exportLineJsonStep(itemReader))
        .next(uploadLineJsonFileStep())
        .next(deleteLineJsonFileStep())
        .end()
        .build();
  }

  @Bean
  public Step exportLineJsonStep(ItemReader<Line> itemReader) {
    final String stepName = "exportLineJsonStep";
    return new StepBuilder(stepName, jobRepository)
        .<Line, LineVersionModelV2>chunk(StepUtil.CHUNK_SIZE, transactionManager)
        .reader(itemReader)
        .processor(lineJsonProcessor())
        .writer(lineJsonFileItemWriter(null))
        .faultTolerant()
        .backOffPolicy(StepUtil.getBackOffPolicy(stepName))
        .retryPolicy(StepUtil.getRetryPolicy(stepName))
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  public LineJsonProcessor lineJsonProcessor() {
    return new LineJsonProcessor();
  }

  @Bean
  @StepScope
  public JsonFileItemWriter<LineVersionModelV2> lineJsonFileItemWriter(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2) {
    return jsonWriter.getWriter(ExportObjectV2.LINE, exportTypeV2);
  }

  // BEGIN: Upload Json
  @Bean
  public Step uploadLineJsonFileStep() {
    return new StepBuilder("uploadJsonFile", jobRepository)
        .tasklet(uploadLineJsonFileTasklet(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public UploadJsonFileTaskletV2 uploadLineJsonFileTasklet(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2) {
    final ExportFilePathV2 filePath = ExportFilePathV2.getV2Builder(ExportObjectV2.LINE, exportTypeV2)
        .extension(ExportExtensionFileType.JSON_EXTENSION.getExtension())
        .systemDir(fileService.getDir())
        .build();
    return new UploadJsonFileTaskletV2(filePath);
  }
  // END: Upload Json

  // BEGIN: Delete Json
  @Bean
  public Step deleteLineJsonFileStep() {
    return new StepBuilder("deleteJsonFile", jobRepository)
        .tasklet(deleteLineJsonFileTasklet(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public FileDeletingTaskletV2 deleteLineJsonFileTasklet(
      @Value("#{jobExecutionContext[filePathV2]}") ExportFilePathV2 filePathV2) {
    return new FileDeletingTaskletV2(filePathV2);
  }
  // END: Delete Json

}
