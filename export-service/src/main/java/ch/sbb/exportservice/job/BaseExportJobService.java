package ch.sbb.exportservice.job;

import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_TYPE_JOB_PARAMETER;

import ch.sbb.atlas.batch.exception.JobExecutionException;
import ch.sbb.exportservice.model.ExportObjectV2;
import ch.sbb.exportservice.model.ExportTypeV2;
import ch.sbb.exportservice.util.JobDescriptionConstant;
import java.util.List;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.parameters.InvalidJobParametersException;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.launch.JobRestartException;

@Slf4j
public abstract class BaseExportJobService {

  private final JobOperator jobOperator;

  @Getter
  private Job exportCsvJob;
  private final Job exportJsonJob;

  protected BaseExportJobService(JobOperator jobOperator, Job exportCsvJob, Job exportJsonJob) {
    this.jobOperator = jobOperator;
    this.exportCsvJob = exportCsvJob;
    this.exportJsonJob = exportJsonJob;
  }

  protected BaseExportJobService(JobOperator jobOperator, Job exportJsonJob) {
    this.jobOperator = jobOperator;
    this.exportJsonJob = exportJsonJob;
  }

  protected abstract List<JobParams> getExportTypes();

  public abstract ExportObjectV2 getExportObject();

  public static JobParameters buildJobParameters(JobParams jobParams) {
    final JobParametersBuilder jobParametersBuilder = new JobParametersBuilder()
        .addString(JobDescriptionConstant.EXECUTION_TYPE_PARAMETER, JobDescriptionConstant.EXECUTION_BATCH_PARAMETER)
        .addString(EXPORT_TYPE_JOB_PARAMETER, jobParams.exportTypeV2.toString())
        .addLong(JobDescriptionConstant.START_AT_JOB_PARAMETER, System.currentTimeMillis());

    return jobParametersBuilder.toJobParameters();
  }

  public void startExportJobs() {
    log.info("CSV and JSON export execution started...");
    for (JobParams jobParams : getExportTypes()) {
      if (exportCsvJob != null) {
        startExportJob(jobParams, exportCsvJob);
      }
      if (exportJsonJob != null) {
        startExportJob(jobParams, exportJsonJob);
      }
    }
    log.info("CSV and JSON export execution finished");
  }

  protected void startExportJob(JobParams jobParams, Job job) {
    try {
      final JobExecution execution = jobOperator.start(job, buildJobParameters(jobParams));
      log.info("Job executed with status: {}", execution.getExitStatus().getExitCode());
    } catch (JobExecutionAlreadyRunningException | JobRestartException | JobInstanceAlreadyCompleteException |
             InvalidJobParametersException e) {
      throw new JobExecutionException(job.getName(), e);
    }
  }

  @Getter
  public static class JobParams {

    private final ExportTypeV2 exportTypeV2;

    public JobParams(ExportTypeV2 exportTypeV2) {
      this.exportTypeV2 = exportTypeV2;
    }

  }

}
