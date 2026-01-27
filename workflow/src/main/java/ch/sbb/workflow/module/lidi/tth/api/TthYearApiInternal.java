package ch.sbb.workflow.module.lidi.tth.api;

import ch.sbb.atlas.api.AtlasApiConstants;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearModel;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = AtlasApiConstants.INTERNAL_API_TAG_PREFIX + "TTH Year")
@RequestMapping("internal/tth/year")
public interface TthYearApiInternal {

  @PostMapping("close/{year}")
  @PreAuthorize("@cantonBasedUserAdministrationService.isAtLeastSupervisor(T(ch.sbb.atlas.kafka.model.user.admin"
      + ".ApplicationType).TIMETABLE_HEARING)")
  TimetableHearingYearModel closeTimetableHearing(@PathVariable Long year);

}