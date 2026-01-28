package ch.sbb.exportservice.job;

import ch.sbb.exportservice.model.ExportObjectV2;
import ch.sbb.exportservice.model.ExportTypeV2;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.parameters.InvalidJobParametersException;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.launch.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.launch.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.JobRestartException;

class BaseExportJobServiceTest {

  private BaseExportJobService baseExportJobService;
  private JobLauncher jobLauncherMock;
  private Job jobMock;

  @BeforeEach
  void setUp() {
    jobLauncherMock = Mockito.mock(JobLauncher.class);
    jobMock = Mockito.mock(Job.class);
    baseExportJobService = new BaseExportJobService(jobLauncherMock, jobMock, jobMock) {
      @Override
      protected List<JobParams> getExportTypes() {
        return List.of(new JobParams(ExportTypeV2.FULL));
      }

      @Override
      public ExportObjectV2 getExportObject() {
        return ExportObjectV2.TRANSPORT_COMPANY;
      }
    };
  }

  @Test
  void startExportJobs()
      throws JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobRestartException, InvalidJobParametersException {
    // given
    final JobExecution jobExecutionMock = Mockito.mock(JobExecution.class);
    Mockito.when(jobExecutionMock.getExitStatus()).thenReturn(ExitStatus.COMPLETED);
    Mockito.when(jobLauncherMock.run(Mockito.same(jobMock), Mockito.any(JobParameters.class))).thenReturn(jobExecutionMock);

    // when
    baseExportJobService.startExportJobs();

    // then
    Mockito.verify(jobLauncherMock, Mockito.times(2)).run(Mockito.same(jobMock), Mockito.any(JobParameters.class));
  }

}
