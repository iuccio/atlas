package ch.sbb.atlas.revoke.exception;

import ch.sbb.atlas.api.model.ErrorResponse;
import ch.sbb.atlas.api.model.ErrorResponse.Detail;
import ch.sbb.atlas.api.model.ErrorResponse.DisplayInfo;
import ch.sbb.atlas.model.exception.AtlasException;
import java.util.SortedSet;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
public class TerminationNotAllowedWhenVersionInReview extends AtlasException {

  public static final String CODE_TERMINATION_IN_REVIEW = "ERROR.TERMINATION_NOT_ALLOWED_WITH_VERSION_IN_REVIEW";
  public static final String TERMINATION_NOT_ALLOWED_WHEN_A_VERSION_IS_IN_REVIEW = "Termination not allowed when a version is "
      + "in REVIEW ";

  private final transient String sid4pt;

  @Override
  public ErrorResponse getErrorResponse() {
    return ErrorResponse.builder()
        .status(HttpStatus.FORBIDDEN.value())
        .message(TERMINATION_NOT_ALLOWED_WHEN_A_VERSION_IS_IN_REVIEW)
        .error("Termination not allowed")
        .details(getErrorDetails())
        .build();
  }

  private SortedSet<Detail> getErrorDetails() {
    TreeSet<Detail> errorDetails = new TreeSet<>();
    errorDetails.add(Detail.builder()
        .field("termination")
        .message(TERMINATION_NOT_ALLOWED_WHEN_A_VERSION_IS_IN_REVIEW)
        .displayInfo(DisplayInfo.builder()
            .code(CODE_TERMINATION_IN_REVIEW)
            .with("sid4pt", String.valueOf(sid4pt))
            .build())
        .build());
    return errorDetails;
  }

}
