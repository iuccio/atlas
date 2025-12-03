package ch.sbb.atlas.model.exception;

import ch.sbb.atlas.api.model.ErrorResponse;
import ch.sbb.atlas.api.model.ErrorResponse.Detail;
import ch.sbb.atlas.api.model.ErrorResponse.DisplayInfo;
import ch.sbb.atlas.api.model.ErrorResponse.Parameter;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
@Builder
public class SimpleAtlasException extends AtlasException {

  private final ErrorResponse errorResponse;

  public static ExceptionBuilder builder() {
    return new ExceptionBuilder();
  }

  public static class ExceptionBuilder {

    private Integer status;
    private String message;
    private String error;
    private final Set<Detail> details = new TreeSet<>();

    public ExceptionBuilder status(HttpStatus httpStatus) {
      this.status = httpStatus.value();
      return this;
    }

    public ExceptionBuilder status(int status) {
      this.status = status;
      return this;
    }

    public ExceptionBuilder messageAndError(String message) {
      this.message = message;
      this.error = message;
      return this;
    }

    public ExceptionBuilder message(String message) {
      this.message = message;
      return this;
    }

    public ExceptionBuilder error(String error) {
      this.error = error;
      return this;
    }

    public ExceptionBuilder addDetail(Detail detail) {
      this.details.add(detail);
      return this;
    }

    public ExceptionBuilder displayCode(String displayCode) {
      return displayCode(displayCode, Collections.emptyList());
    }

    public ExceptionBuilder displayCode(String displayCode, List<Parameter> parameters) {
      this.details.add(Detail.builder()
          .message(this.message)
          .displayInfo(DisplayInfo.builder()
              .code(displayCode)
              .with(parameters)
              .build())
          .build());
      return this;
    }

    public SimpleAtlasException build() {
      return new SimpleAtlasException(ErrorResponse.builder()
          .status(Objects.requireNonNull(status))
          .message(Objects.requireNonNull(message))
          .error(Objects.requireNonNull(error))
          .details(new TreeSet<>(details))
          .build());
    }
  }

}
