package ch.sbb.atlas.servicepointdirectory.exception;

import ch.sbb.atlas.api.model.ErrorResponse;
import ch.sbb.atlas.api.model.ErrorResponse.Detail;
import ch.sbb.atlas.api.model.ErrorResponse.DisplayInfo;
import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.model.exception.AtlasException;
import ch.sbb.atlas.versioning.model.Versionable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
public class UpdateAffectsInReviewVersionException extends AtlasException {

  private final LocalDate updateFrom;
  private final LocalDate updateTo;
  private final List<? extends Versionable> affectedVersions;

  @Override
  public ErrorResponse getErrorResponse() {
    return ErrorResponse.builder()
        .status(HttpStatus.CONFLICT.value())
        .error("Update affects one or more versions that have status: " + Status.IN_REVIEW + ".")
        .message("Update from " + updateFrom.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")) + " to " + updateTo.format(
            DateTimeFormatter.ofPattern("dd.MM.yyyy")) + " affects "
            + affectedVersions.size() + " version/s that have status: " + Status.IN_REVIEW + ".")
        .details(getErrorDetails())
        .build();
  }

  private SortedSet<Detail> getErrorDetails() {
    TreeSet<Detail> details = new TreeSet<>();
    affectedVersions.forEach(version -> details.add(
        Detail.builder()
            .message("Update affects version from {0} to {1} that has currently the status: " + Status.IN_REVIEW + ".")
            .displayInfo(DisplayInfo.builder()
                .code("SEPODI.SERVICE_POINTS.UPDATE_AFFECTS_VERSION_IN_REVIEW")
                .with("validFrom", version.getValidFrom())
                .with("validTo", version.getValidTo())
                .build())
            .build()
    ));
    return details;
  }

}
