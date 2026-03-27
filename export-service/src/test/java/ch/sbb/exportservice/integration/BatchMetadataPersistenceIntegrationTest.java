package ch.sbb.exportservice.integration;

import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_SERVICE_POINT_CSV_JOB_NAME;
import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.model.controller.IntegrationTest;
import ch.sbb.exportservice.BatchDataSourceConfigTest;
import ch.sbb.exportservice.job.BaseExportJobService;
import ch.sbb.exportservice.job.BaseExportJobService.JobParams;
import ch.sbb.exportservice.model.ExportTypeV2;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.JobInstance;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;

@BatchDataSourceConfigTest
@IntegrationTest
@AutoConfigureMockMvc(addFilters = false)
class BatchMetadataPersistenceIntegrationTest {

  @Autowired
  private JobOperator jobOperator;

  @Autowired
  @Qualifier(EXPORT_SERVICE_POINT_CSV_JOB_NAME)
  private Job exportServicePointCsvJob;

  @Autowired
  @Qualifier("batchDataSource")
  private DataSource batchDataSource;

  @Test
  void shouldPersistBatchMetadataInBatchDatasource() throws Exception {
    JobExecution jobExecution = jobOperator.start(
        exportServicePointCsvJob,
        BaseExportJobService.buildJobParameters(new JobParams(ExportTypeV2.WORLD_FULL))
    );

    JobInstance jobInstance = jobExecution.getJobInstance();
    JdbcTemplate jdbcTemplate = new JdbcTemplate(batchDataSource);
    Integer executions = jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM BATCH_JOB_EXECUTION WHERE JOB_EXECUTION_ID = ?",
        Integer.class,
        jobExecution.getId()
    );

    assertThat(jobInstance.getJobName()).isEqualTo(EXPORT_SERVICE_POINT_CSV_JOB_NAME);
    assertThat(executions).isEqualTo(1);
  }
}

