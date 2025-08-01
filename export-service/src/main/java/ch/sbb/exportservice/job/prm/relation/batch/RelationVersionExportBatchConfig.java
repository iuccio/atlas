package ch.sbb.exportservice.job.prm.relation.batch;

import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_RELATION_CSV_JOB_NAME;
import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_RELATION_JSON_JOB_NAME;

import ch.sbb.atlas.amazon.service.FileService;
import ch.sbb.atlas.api.prm.model.relation.ReadRelationVersionModel;
import ch.sbb.exportservice.job.prm.relation.model.RelationVersionCsvModel;
import ch.sbb.exportservice.job.prm.relation.sql.RelationVersionRowMapper;
import ch.sbb.exportservice.job.prm.relation.sql.RelationVersionSqlQueryUtil;
import ch.sbb.exportservice.job.prm.relation.entity.RelationVersion;
import ch.sbb.exportservice.job.prm.relation.processor.RelationVersionCsvProcessor;
import ch.sbb.exportservice.job.prm.relation.processor.RelationVersionJsonProcessor;
import ch.sbb.exportservice.job.prm.relation.writer.CsvRelationVersionWriter;
import ch.sbb.exportservice.job.prm.relation.writer.JsonRelationVersionWriter;
import ch.sbb.exportservice.listener.JobCompletionListener;
import ch.sbb.exportservice.listener.StepTracerListener;
import ch.sbb.exportservice.model.ExportExtensionFileType;
import ch.sbb.exportservice.model.ExportFilePathV2;
import ch.sbb.exportservice.model.ExportObjectV2;
import ch.sbb.exportservice.model.ExportTypeV2;
import ch.sbb.exportservice.model.PrmBatchExportFileName;
import ch.sbb.exportservice.model.PrmExportType;
import ch.sbb.exportservice.tasklet.delete.FileDeletingTaskletV2;
import ch.sbb.exportservice.tasklet.upload.UploadCsvFileTasklet;
import ch.sbb.exportservice.tasklet.upload.UploadCsvFileTaskletV2;
import ch.sbb.exportservice.tasklet.upload.UploadJsonFileTasklet;
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
public class RelationVersionExportBatchConfig {

  private final JobRepository jobRepository;
  private final PlatformTransactionManager transactionManager;
  private final JobCompletionListener jobCompletionListener;
  private final StepTracerListener stepTracerListener;
  private final CsvRelationVersionWriter csvRelationVersionWriter;
  private final JsonRelationVersionWriter jsonRelationVersionWriter;

  private final FileService fileService;

  @Bean
  @StepScope
  public JdbcCursorItemReader<RelationVersion> relationReader(
      @Autowired @Qualifier("prmDataSource") DataSource dataSource,
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2
  ) {
    JdbcCursorItemReader<RelationVersion> itemReader = new JdbcCursorItemReader<>();
    itemReader.setDataSource(dataSource);
    itemReader.setSql(RelationVersionSqlQueryUtil.getSqlQuery(exportTypeV2));
    itemReader.setFetchSize(StepUtil.FETCH_SIZE);
    itemReader.setRowMapper(new RelationVersionRowMapper());
    return itemReader;
  }

  // --- CSV ---
  @Bean
  @Qualifier(EXPORT_RELATION_CSV_JOB_NAME)
  public Job exportRelationCsvJob(ItemReader<RelationVersion> itemReader) {
    return new JobBuilder(EXPORT_RELATION_CSV_JOB_NAME, jobRepository)
        .listener(jobCompletionListener)
        .incrementer(new RunIdIncrementer())
        .flow(exportRelationCsvStep(itemReader))
        .next(uploadRelationCsvFileStepV2())
        .next(uploadRelationCsvFileStepV1())
        .next(deleteRelationCsvFileStepV2())
        .end()
        .build();
  }

  @Bean
  public Step exportRelationCsvStep(ItemReader<RelationVersion> itemReader) {
    final String stepName = "exportRelationCsvStep";
    return new StepBuilder(stepName, jobRepository)
        .<RelationVersion, RelationVersionCsvModel>chunk(StepUtil.CHUNK_SIZE, transactionManager)
        .reader(itemReader)
        .processor(relationVersionCsvProcessor())
        .writer(relationCsvWriter(null))
        .faultTolerant()
        .backOffPolicy(StepUtil.getBackOffPolicy(stepName))
        .retryPolicy(StepUtil.getRetryPolicy(stepName))
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  public RelationVersionCsvProcessor relationVersionCsvProcessor() {
    return new RelationVersionCsvProcessor();
  }

  @Bean
  @StepScope
  public FlatFileItemWriter<RelationVersionCsvModel> relationCsvWriter(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2
  ) {
    return csvRelationVersionWriter.csvWriter(ExportObjectV2.RELATION, exportTypeV2);
  }

  // BEGIN: Upload Csv V2
  @Bean
  public Step uploadRelationCsvFileStepV2() {
    return new StepBuilder("uploadCsvFileV2", jobRepository)
        .tasklet(uploadRelationCsvFileTaskletV2(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public UploadCsvFileTaskletV2 uploadRelationCsvFileTaskletV2(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2) {
    final ExportFilePathV2 filePath = ExportFilePathV2.getV2Builder(ExportObjectV2.RELATION, exportTypeV2)
        .extension(ExportExtensionFileType.CSV_EXTENSION.getExtension())
        .systemDir(fileService.getDir())
        .build();
    return new UploadCsvFileTaskletV2(filePath);
  }
  // END: Upload Csv V2

  // BEGIN: Upload Csv V1
  @Deprecated(forRemoval = true)
  @Bean
  public Step uploadRelationCsvFileStepV1() {
    return new StepBuilder("uploadCsvFileV1", jobRepository)
        .tasklet(uploadRelationCsvFileTaskletV1(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Deprecated(forRemoval = true)
  @Bean
  @StepScope
  public UploadCsvFileTasklet uploadRelationCsvFileTaskletV1(
      @Value("#{jobParameters[exportTypeV1]}") PrmExportType exportTypeV1
  ) {
    return new UploadCsvFileTasklet(exportTypeV1, PrmBatchExportFileName.RELATION_VERSION);
  }
  // END: Upload Csv V1

  // BEGIN: Delete Csv V2
  @Bean
  public Step deleteRelationCsvFileStepV2() {
    return new StepBuilder("deleteCsvV2", jobRepository)
        .tasklet(deleteRelationCsvFileTaskletV2(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public FileDeletingTaskletV2 deleteRelationCsvFileTaskletV2(
      @Value("#{jobExecutionContext[filePathV2]}") ExportFilePathV2 filePathV2) {
    return new FileDeletingTaskletV2(filePathV2);
  }
  // END: Delete Csv V2

  // --- JSON ---
  @Bean
  @Qualifier(EXPORT_RELATION_JSON_JOB_NAME)
  public Job exportRelationJsonJob(ItemReader<RelationVersion> itemReader) {
    return new JobBuilder(EXPORT_RELATION_JSON_JOB_NAME, jobRepository)
        .listener(jobCompletionListener)
        .incrementer(new RunIdIncrementer())
        .flow(exportRelationJsonStep(itemReader))
        .next(uploadRelationJsonFileStepV2())
        .next(uploadRelationJsonFileStepV1())
        .next(deleteRelationJsonFileStepV2())
        .end()
        .build();
  }

  @Bean
  public Step exportRelationJsonStep(ItemReader<RelationVersion> itemReader) {
    String stepName = "exportRelationJsonStep";
    return new StepBuilder(stepName, jobRepository)
        .<RelationVersion, ReadRelationVersionModel>chunk(StepUtil.CHUNK_SIZE, transactionManager)
        .reader(itemReader)
        .processor(relationVersionJsonProcessor())
        .writer(relationJsonFileItemWriter(null))
        .faultTolerant()
        .backOffPolicy(StepUtil.getBackOffPolicy(stepName))
        .retryPolicy(StepUtil.getRetryPolicy(stepName))
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  public RelationVersionJsonProcessor relationVersionJsonProcessor() {
    return new RelationVersionJsonProcessor();
  }

  @Bean
  @StepScope
  public JsonFileItemWriter<ReadRelationVersionModel> relationJsonFileItemWriter(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2) {
    return jsonRelationVersionWriter.getWriter(ExportObjectV2.RELATION, exportTypeV2);
  }

  // BEGIN: Upload Json V2
  @Bean
  public Step uploadRelationJsonFileStepV2() {
    return new StepBuilder("uploadJsonFileV2", jobRepository)
        .tasklet(uploadRelationJsonFileTaskletV2(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public UploadJsonFileTaskletV2 uploadRelationJsonFileTaskletV2(
      @Value("#{jobParameters[exportTypeV2]}") ExportTypeV2 exportTypeV2) {
    final ExportFilePathV2 filePath = ExportFilePathV2.getV2Builder(ExportObjectV2.RELATION, exportTypeV2)
        .extension(ExportExtensionFileType.JSON_EXTENSION.getExtension())
        .systemDir(fileService.getDir())
        .build();
    return new UploadJsonFileTaskletV2(filePath);
  }
  // END: Upload Json V2

  // BEGIN: Upload Json V1
  @Deprecated(forRemoval = true)
  @Bean
  public Step uploadRelationJsonFileStepV1() {
    return new StepBuilder("uploadJsonFileV1", jobRepository)
        .tasklet(uploadRelationJsonFileTaskletV1(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Deprecated(forRemoval = true)
  @Bean
  @StepScope
  public UploadJsonFileTasklet uploadRelationJsonFileTaskletV1(
      @Value("#{jobParameters[exportTypeV1]}") PrmExportType exportTypeV1
  ) {
    return new UploadJsonFileTasklet(exportTypeV1, PrmBatchExportFileName.RELATION_VERSION);
  }
  // END: Upload Json V1

  // BEGIN: Delete Json V2
  @Bean
  public Step deleteRelationJsonFileStepV2() {
    return new StepBuilder("deleteJsonFileV2", jobRepository)
        .tasklet(deleteRelationJsonFileTaskletV2(null), transactionManager)
        .listener(stepTracerListener)
        .build();
  }

  @Bean
  @StepScope
  public FileDeletingTaskletV2 deleteRelationJsonFileTaskletV2(
      @Value("#{jobExecutionContext[filePathV2]}") ExportFilePathV2 filePathV2) {
    return new FileDeletingTaskletV2(filePathV2);
  }
  // END: Delete Json V2

}
