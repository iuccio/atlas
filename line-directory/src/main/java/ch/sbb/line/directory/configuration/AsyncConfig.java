package ch.sbb.line.directory.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;

// todo: remove after maintenance execution after prod release of ATLAS-3254
@Profile("!integration-test")
@EnableAsync
@Configuration
public class AsyncConfig {

  @Bean
  public DelegatingSecurityContextAsyncTaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setThreadNamePrefix("async-");
    executor.setMaxPoolSize(5);
    executor.setQueueCapacity(2);
    executor.setCorePoolSize(5);
    executor.initialize();
    return new DelegatingSecurityContextAsyncTaskExecutor(executor);
  }
}