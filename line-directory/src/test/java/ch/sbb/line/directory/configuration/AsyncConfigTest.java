package ch.sbb.line.directory.configuration;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

// todo: remove after maintenance execution after prod release of ATLAS-3254
class AsyncConfigTest {

  @Test
  void shouldInitializeTaskExecutor() {
    assertThat(new AsyncConfig().taskExecutor()).isNotNull();
  }
}