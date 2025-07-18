package ch.sbb.atlas.api.lidi;

import ch.sbb.atlas.api.AtlasApiConstants;
import ch.sbb.atlas.api.model.Container;
import ch.sbb.atlas.model.Status;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URL;
import java.time.LocalDate;
import java.util.List;
import org.springdoc.core.converters.models.PageableAsQueryParam;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "[INTERNAL] Timetable Field Numbers")
@RequestMapping("internal/field-numbers")
public interface TimetableFieldNumberApiInternal {

  @GetMapping
  @PageableAsQueryParam
  Container<TimetableFieldNumberModel> getOverview(
      @Parameter(hidden = true) Pageable pageable,
      @Parameter @RequestParam(required = false) List<String> searchCriteria,
      @Parameter @RequestParam(required = false) String number,
      @RequestParam(required = false) String businessOrganisation,
      @Parameter @RequestParam(required = false) @DateTimeFormat(pattern = AtlasApiConstants.DATE_FORMAT_PATTERN) LocalDate validOn,
      @Parameter @RequestParam(required = false) List<Status> statusChoices);

  @PostMapping("/{ttfnId}/revoke")
  @PreAuthorize("@businessOrganisationBasedUserAdministrationService.isAtLeastSupervisor(T(ch.sbb.atlas.kafka.model.user.admin"
      + ".ApplicationType).TTFN)")
  List<TimetableFieldNumberVersionModel> revokeTimetableFieldNumber(@PathVariable String ttfnId);

  @DeleteMapping("/{ttfnid}")
  void deleteVersions(@PathVariable String ttfnid);

  @Deprecated(forRemoval = true)
  @Operation(description = "Export all Timetable Field Number versions as csv and zip file to the ATLAS Amazon S3 Bucket")
  @PostMapping(path = "/export-csv/full", produces = MediaType.APPLICATION_JSON_VALUE)
  List<URL> exportFullTimetableFieldNumberVersions();

  @Deprecated(forRemoval = true)
  @Operation(description = "Export all actual Timetable Field Number versions as csv and zip file to the ATLAS Amazon S3 Bucket")
  @PostMapping(path = "/export-csv/actual", produces = MediaType.APPLICATION_JSON_VALUE)
  List<URL> exportActualTimetableFieldNumberVersions();

  @Deprecated(forRemoval = true)
  @Operation(description = "Export all Timetable Field Number versions for the current timetable year change as csv and zip "
      + "file to the ATLAS Amazon S3 Bucket")
  @PostMapping(path = "/export-csv/timetable-year-change", produces = MediaType.APPLICATION_JSON_VALUE)
  List<URL> exportTimetableYearChangeTimetableFieldNumberVersions();

}
