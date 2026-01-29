package ch.sbb.exportservice.service;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

import ch.sbb.exportservice.util.JobDescriptionConstant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.JobInstance;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.repository.JobRepository;

class JobHelperServiceTest {

  @Mock
  private JobRepository jobRepository;

  @Mock
  private JobInstance jobInstance;

  @Mock
  private JobExecution jobExecution;

  private JobHelperService jobHelperService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    jobHelperService = new JobHelperService(jobRepository);
  }

  @Test
  void shouldReturnMinDateWhenNoJobExecutionWasFound() {
    //when
    LocalDate result = jobHelperService.getDateForImportFileToDownload("myJob");
    //then
    assertThat(result).isEqualTo(JobHelperService.MIN_LOCAL_DATE);
  }

  @Test
  void shouldReturnDateWhenJobExecutionWasFound() {
    //given
    JobParameters jobParameters = new JobParametersBuilder()
        .addString(JobDescriptionConstant.EXECUTION_TYPE_PARAMETER, "BATCH")
        .toJobParameters();
    when(jobRepository.getJobInstances(any(), anyInt(), anyInt())).thenReturn(List.of(jobInstance));
    when(jobRepository.getLastJobExecution(jobInstance)).thenReturn(jobExecution);
    when(jobExecution.getJobParameters()).thenReturn(jobParameters);
    when(jobExecution.getStatus()).thenReturn(BatchStatus.COMPLETED);

    LocalDate successfullyJobExecutionLocalDate = LocalDate.of(2000, 1, 1);

    when(jobExecution.getCreateTime()).thenReturn(successfullyJobExecutionLocalDate.atStartOfDay());
    //when
    LocalDate result = jobHelperService.getDateForImportFileToDownload("myJob");
    //then
    assertThat(result).isEqualTo(successfullyJobExecutionLocalDate);
  }

  @Test
  void shouldReturnTrueWhenMatchedDateIsBetweenTodayAndMatchingDate() {
    //given
    LocalDate matchingDate = LocalDate.now();
    LocalDate lastEditionDate = LocalDate.now();
    //when
    boolean result = jobHelperService.isDateMatchedBetweenTodayAndMatchingDate(matchingDate,
        lastEditionDate);

    //then
    assertThat(result).isTrue();
  }

  @Test
  void shouldReturnTrueWhenLastEditionDateIsBetweenTodayAndMatchingDate() {
    //given
    LocalDate now = LocalDate.now();
    LocalDate matchingDate = now.minusDays(2);
    LocalDate lastEditionDate = now.minusDays(1);
    //when
    boolean result = jobHelperService.isDateMatchedBetweenTodayAndMatchingDate(matchingDate,
        lastEditionDate);

    //then
    assertThat(result).isTrue();
  }

  @Test
  void shouldReturnFalseWhenLastEditionDateIsNotBetweenTodayAndMatchingDate() {
    //given
    LocalDate now = LocalDate.now();
    LocalDate lastEditionDate = now.minusDays(1);
    //when
    boolean result = jobHelperService.isDateMatchedBetweenTodayAndMatchingDate(now,
        lastEditionDate);

    //then
    assertThat(result).isFalse();
  }

}
