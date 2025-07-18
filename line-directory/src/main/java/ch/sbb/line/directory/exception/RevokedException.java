package ch.sbb.line.directory.exception;

import static ch.sbb.atlas.api.model.ErrorResponse.DisplayInfo.builder;

import ch.sbb.atlas.api.model.ErrorResponse;
import ch.sbb.atlas.api.model.ErrorResponse.Detail;
import ch.sbb.atlas.model.exception.AtlasException;
import ch.sbb.line.directory.entity.SublineVersion.Fields;
import java.util.Set;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
public class RevokedException extends AtlasException {

  private static final String CODE = "LIDI.ERROR.REVOKED";
  private static final String MESSAGE = "Object with slnid is REVOKED. Operation not allowed.";

  private final String slnid;

  @Override
  public ErrorResponse getErrorResponse() {
    return ErrorResponse.builder()
        .status(HttpStatus.FORBIDDEN.value())
        .message(MESSAGE)
        .error(MESSAGE)
        .details(new TreeSet<>(getErrorDetails()))
        .build();
  }

  private Set<Detail> getErrorDetails() {
    return Set.of(Detail.builder()
        .field(Fields.sublineType)
        .message(MESSAGE)
        .displayInfo(builder()
            .code(CODE)
            .with(Fields.slnid, slnid)
            .build()).build());
  }

}
