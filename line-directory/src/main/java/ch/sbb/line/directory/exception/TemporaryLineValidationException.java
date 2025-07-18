package ch.sbb.line.directory.exception;

import static ch.sbb.atlas.api.model.ErrorResponse.DisplayInfo.builder;

import ch.sbb.atlas.api.model.ErrorResponse;
import ch.sbb.atlas.api.model.ErrorResponse.Detail;
import ch.sbb.atlas.api.model.ErrorResponse.ValidFromDetail;
import ch.sbb.atlas.model.exception.AtlasException;
import ch.sbb.line.directory.entity.LineVersion.Fields;
import java.time.LocalDate;
import java.util.List;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
public class TemporaryLineValidationException extends AtlasException {

  private final LocalDate minValidFrom;
  private final LocalDate maxValidTo;

  @Override
  public ErrorResponse getErrorResponse() {
    return ErrorResponse.builder()
        .status(HttpStatus.UNPROCESSABLE_ENTITY.value())
        .message("Business rule validation failed")
        .error("Temporary line validation")
        .details(new TreeSet<>(getErrorDetails()))
        .build();
  }

  private List<Detail> getErrorDetails() {
    return List.of(
        ValidFromDetail.builder()
            .field(Fields.validTo)
            .message("Temporary line from {0} to {1} exceeds maximum validity of 14 days")
            .displayInfo(builder()
                .code("LIDI.LINE.TEMPORARY_VERSION_EXCEEDS_MAX_VALIDITY")
                .with(Fields.validFrom, minValidFrom)
                .with(Fields.validTo, maxValidTo)
                .build()).build()
    );
  }

}
