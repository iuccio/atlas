package ch.sbb.importservice.utils;

import feign.FeignException;
import feign.RetryableException;
import java.util.HashSet;
import java.util.Set;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.retry.RetryPolicy;

@Slf4j
@UtilityClass
public class StepUtils {

  private static final int MAX_ATTEMPTS = 4;

  public static RetryPolicy getRetryPolicy(String stepName) {
    Set<Class<? extends Throwable>> exceptionsToRetry = new HashSet<>();
    exceptionsToRetry.add(FeignException.InternalServerError.class);
    exceptionsToRetry.add(RetryableException.class);

    log.info("Configuring Retry policy for step [{}] ", stepName);
    log.info("Set max attemps to retry: {}", MAX_ATTEMPTS);
    log.info("Set exceptions to retry: {}", exceptionsToRetry);

    return RetryPolicy.builder()
        .includes(exceptionsToRetry)
        .maxRetries(MAX_ATTEMPTS)
        .build();
  }

}
