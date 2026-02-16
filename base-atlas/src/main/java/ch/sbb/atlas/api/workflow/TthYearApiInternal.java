package ch.sbb.atlas.api.workflow;

import ch.sbb.atlas.api.AtlasApiConstants;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = AtlasApiConstants.INTERNAL_API_TAG_PREFIX + "TTH Year")
public interface TthYearApiInternal {

  String BASE_PATH = "internal/tth/year";

  @PostMapping(BASE_PATH)
  @PreAuthorize("@cantonBasedUserAdministrationService.isAtLeastSupervisor(T(ch.sbb.atlas.kafka.model.user.admin"
      + ".ApplicationType).TIMETABLE_HEARING)")
  void addTimetableHearingYear(@RequestBody @Valid TimetableHearingYearModel timetableHearingYearModel);

  @PostMapping(BASE_PATH + "/{year}/close")
  @PreAuthorize("@cantonBasedUserAdministrationService.isAtLeastSupervisor(T(ch.sbb.atlas.kafka.model.user.admin"
      + ".ApplicationType).TIMETABLE_HEARING)")
  TimetableHearingYearModel closeTimetableHearingYear(@PathVariable Long year);
}
