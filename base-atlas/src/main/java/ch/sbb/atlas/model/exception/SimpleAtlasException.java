package ch.sbb.atlas.model.exception;

import ch.sbb.atlas.api.model.ErrorResponse;
import ch.sbb.atlas.api.model.ErrorResponse.Detail;
import ch.sbb.atlas.api.model.ErrorResponse.DisplayInfo;
import ch.sbb.atlas.api.model.ErrorResponse.Parameter;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class SimpleAtlasException extends AtlasException {

  private ErrorResponse errorResponse;

  public static SimpleAtlasException build(HttpStatus httpStatus, String message) {
    return build(httpStatus.value(), message);
  }

  public static SimpleAtlasException build(int httpStatus, String message) {
    return new SimpleAtlasException(ErrorResponse.builder()
        .status(httpStatus)
        .message(message)
        .error(message)
        .details(new TreeSet<>())
        .build());
  }

  public SimpleAtlasException withDisplayCode(String displayCode) {
    return withDisplayCode(displayCode, Collections.emptyList());
  }

  public SimpleAtlasException withDisplayCode(String displayCode, List<Parameter> parameters) {
    errorResponse.setDetails(new TreeSet<>(Set.of(Detail.builder()
        .message(errorResponse.getMessage())
        .displayInfo(DisplayInfo.builder()
            .code(displayCode)
            .with(parameters)
            .build())
        .build())));
    return this;
  }

}
