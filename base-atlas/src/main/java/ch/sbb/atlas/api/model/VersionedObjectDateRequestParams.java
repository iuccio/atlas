package ch.sbb.atlas.api.model;

import ch.sbb.atlas.api.AtlasApiConstants;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
@ToString
@SuperBuilder
@NoArgsConstructor
public class VersionedObjectDateRequestParams {

  @Parameter(description = "ValidOn. Date format: " + AtlasApiConstants.DATE_FORMAT_PATTERN)
  @DateTimeFormat(pattern = AtlasApiConstants.DATE_FORMAT_PATTERN)
  private LocalDate validOn;

  @Parameter(description = "[fromDate] <= validFrom. Filters for all versions where validFrom is bigger or equal than fromDate"
      + ". Date format: " + AtlasApiConstants.DATE_FORMAT_PATTERN)
  @DateTimeFormat(pattern = AtlasApiConstants.DATE_FORMAT_PATTERN)
  private LocalDate fromDate;

  @Parameter(description = "[toDate] >= validTo. Filters for all versions where validTo is smaller or equal than toDate"
      + ". Date format: " + AtlasApiConstants.DATE_FORMAT_PATTERN)
  @DateTimeFormat(pattern = AtlasApiConstants.DATE_FORMAT_PATTERN)
  private LocalDate toDate;

  @Parameter(description = "[validToFromDate] <= validTo. Filters for all versions where validTo is greater than "
          + "or equal to validToFromDate. "
          + "Example: If validToFromDate is set to '2020-01-01', only versions where validTo is on "
          + "or after '2020-01-01' will be included. "
          + "Date format: " + AtlasApiConstants.DATE_FORMAT_PATTERN)
  @DateTimeFormat(pattern = AtlasApiConstants.DATE_FORMAT_PATTERN)
  private LocalDate validToFromDate;

  @Parameter(description = "creationDate >= [createdAfter]. DateTime format: " + AtlasApiConstants.DATE_TIME_FORMAT_PATTERN + ", " + AtlasApiConstants.DATE_TIME_FORMAT_PATTERN_WITH_T + ", " + AtlasApiConstants.ISO_DATE_TIME_FORMAT_PATTERN)
  @DateTimeFormat(pattern = AtlasApiConstants.DATE_TIME_FORMAT_PATTERN, fallbackPatterns = { AtlasApiConstants.DATE_TIME_FORMAT_PATTERN_WITH_T, AtlasApiConstants.ISO_DATE_TIME_FORMAT_PATTERN })
  private LocalDateTime createdAfter;

  @Parameter(description = "editionDate >= [modifiedAfter]. DateTime format: " + AtlasApiConstants.DATE_TIME_FORMAT_PATTERN + ", " + AtlasApiConstants.DATE_TIME_FORMAT_PATTERN_WITH_T + ", " + AtlasApiConstants.ISO_DATE_TIME_FORMAT_PATTERN)
  @DateTimeFormat(pattern = AtlasApiConstants.DATE_TIME_FORMAT_PATTERN, fallbackPatterns = {  AtlasApiConstants.DATE_TIME_FORMAT_PATTERN_WITH_T, AtlasApiConstants.ISO_DATE_TIME_FORMAT_PATTERN })
  private LocalDateTime modifiedAfter;
}
