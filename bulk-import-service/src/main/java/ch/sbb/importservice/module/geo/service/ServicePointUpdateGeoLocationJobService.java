package ch.sbb.importservice.module.geo.service;

import static ch.sbb.importservice.module.geo.job.ServicePointGeoLocationUpdateConfig.UPDATE_SERVICE_POINT_GEO_JOB;
import static ch.sbb.importservice.utils.JobDescriptionConstants.START_AT_JOB_PARAMETER;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.JobExecutionException;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.launch.JobRestartException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServicePointUpdateGeoLocationJobService {

  private final JobOperator jobOperator;

  @Qualifier(UPDATE_SERVICE_POINT_GEO_JOB)
  private final Job updateServicePointGeoJob;

  @Async
  public void runGeoLocationUpdateJob() throws JobExecutionException {
    JobParameters jobParameters = new JobParametersBuilder()
        .addLong(START_AT_JOB_PARAMETER, System.currentTimeMillis()).toJobParameters();
    try {
      JobExecution execution = jobOperator.start(updateServicePointGeoJob, jobParameters);
      log.info("Job executed with status: {}", execution.getExitStatus().getExitCode());
    } catch (JobExecutionAlreadyRunningException | JobRestartException | JobInstanceAlreadyCompleteException | IllegalArgumentException e) {
      throw new JobExecutionException(UPDATE_SERVICE_POINT_GEO_JOB, e);
    }
  }
}
