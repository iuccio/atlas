package ch.sbb.atlas.redact;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class IntegerRedactorTest {

  @Test
  void shouldRedactInteger() {
    //given
    Integer number = 79123;
    //when
    Integer result = IntegerRedactor.redactInteger(number);
    //then
    assertThat(result).isNotNull().isEqualTo(0);
  }
}
