package ch.sbb.atlas.model.exception;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.model.ErrorResponse;
import ch.sbb.atlas.api.model.ErrorResponse.Detail;
import ch.sbb.atlas.api.model.ErrorResponse.DisplayInfo;
import java.util.Collections;
import java.util.Set;
import java.util.TreeSet;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class SimpleAtlasExceptionTest {

  @Test
  void shouldBuildSimpleExceptionWithMessage() {
    String message = "Some error";
    SimpleAtlasException someError = SimpleAtlasException.builder()
        .status(HttpStatus.BAD_REQUEST)
        .message(message).error(message)
        .build();

    ErrorResponse expected = ErrorResponse.builder()
        .status(400)
        .message(message)
        .error(message)
        .details(new TreeSet<>())
        .build();

    assertThat(someError.getErrorResponse()).isEqualTo(expected);
  }

  @Test
  void shouldBuildSimpleExceptionWithMessageAndDisplayCode() {
    String message = "Some error";
    String displayCode = "TTH.DOSSIER_NOT_EDITABLE";
    SimpleAtlasException someError = SimpleAtlasException.builder()
        .status(HttpStatus.BAD_REQUEST)
        .message(message)
        .error(message)
        .displayCode(displayCode)
        .build();

    ErrorResponse expected = ErrorResponse.builder()
        .status(400)
        .message(message)
        .error(message)
        .details(new TreeSet<>(Set.of(Detail.builder()
            .displayInfo(DisplayInfo.builder()
                .code(displayCode)
                .with(Collections.emptyList())
                .build())
            .message(message)
            .build())))
        .build();

    assertThat(someError.getErrorResponse()).usingRecursiveComparison().isEqualTo(expected);
  }
}