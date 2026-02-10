package ch.sbb.exportservice.integration;

import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_PLATFORM_CSV_JOB_NAME;
import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_PLATFORM_JSON_JOB_NAME;
import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.exportservice.integration.sql.BasePrmSqlIntegrationTest;
import ch.sbb.exportservice.job.BaseExportJobService;
import ch.sbb.exportservice.job.BaseExportJobService.JobParams;
import ch.sbb.exportservice.model.ExportTypeV2;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.JobInstance;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

@AutoConfigureMockMvc(addFilters = false)
class ExportPlatformIntegrationTest extends BasePrmSqlIntegrationTest {

  @Autowired
  private JobOperator jobOperator;

  @Autowired
  @Qualifier(EXPORT_PLATFORM_CSV_JOB_NAME)
  private Job exportPlatformCsvJob;

  @Autowired
  @Qualifier(EXPORT_PLATFORM_JSON_JOB_NAME)
  private Job exportPlatformJsonJob;

  @Test
  void shouldExecuteExportPlatformCsvJob() throws Exception {
    // given
    JobParameters jobParameters = BaseExportJobService.buildJobParameters(new JobParams(ExportTypeV2.FULL));
    // when
    JobExecution jobExecution = jobOperator.start(exportPlatformCsvJob, jobParameters);
    JobInstance actualJobInstance = jobExecution.getJobInstance();
    ExitStatus actualJobExitStatus = jobExecution.getExitStatus();

    // then
    assertThat(actualJobInstance.getJobName()).isEqualTo(EXPORT_PLATFORM_CSV_JOB_NAME);
    assertThat(actualJobExitStatus.getExitCode()).isEqualTo(ExitStatus.COMPLETED.getExitCode());
  }

  @Test
  void shouldExecuteExportPlatformJsonJob() throws Exception {
    // given
    JobParameters jobParameters = BaseExportJobService.buildJobParameters(new JobParams(ExportTypeV2.FULL));
    // when
    JobExecution jobExecution = jobOperator.start(exportPlatformJsonJob, jobParameters);
    JobInstance actualJobInstance = jobExecution.getJobInstance();
    ExitStatus actualJobExitStatus = jobExecution.getExitStatus();

    // then
    assertThat(actualJobInstance.getJobName()).isEqualTo(EXPORT_PLATFORM_JSON_JOB_NAME);
    assertThat(actualJobExitStatus.getExitCode()).isEqualTo(ExitStatus.COMPLETED.getExitCode());
  }

}
