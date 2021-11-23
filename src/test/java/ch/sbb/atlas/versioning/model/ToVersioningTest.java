package ch.sbb.atlas.versioning.model;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import ch.sbb.atlas.versioning.exception.VersioningException;
import org.junit.jupiter.api.Test;

public class ToVersioningTest {

  @Test
  public void shouldThrowVersioningExceptionWhenCallGetValidFromAndVersionableIsNull() {
    //given
    ToVersioning toVersioning = ToVersioning.builder().build();
    //then
    assertThatThrownBy(toVersioning::getValidFrom).isInstanceOf(VersioningException.class)
                                                  .hasMessageContaining(
                                                      "Versionable object is null.");
  }

  @Test
  public void shouldThrowVersioningExceptionWhenCallGetValidToAndVersionableIsNull() {
    //given
    ToVersioning toVersioning = ToVersioning.builder().build();
    //then
    assertThatThrownBy(toVersioning::getValidTo).isInstanceOf(VersioningException.class)
                                                  .hasMessageContaining(
                                                      "Versionable object is null.");
  }


}