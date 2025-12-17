package ch.sbb.atlas.redact;

import lombok.experimental.UtilityClass;

@UtilityClass
public class IntegerRedactor {

  private static final Integer REPLACEMENT = 0;

  public static Integer redactInteger(Integer number) {
    if (number == null) {
      return null;
    }
    return REPLACEMENT;
  }

}
