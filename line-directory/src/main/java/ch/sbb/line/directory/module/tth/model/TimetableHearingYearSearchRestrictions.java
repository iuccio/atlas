package ch.sbb.line.directory.module.tth.model;

import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.atlas.searching.specification.EnumSpecification;
import ch.sbb.line.directory.module.tth.entity.TimetableHearingYear;
import ch.sbb.line.directory.module.tth.entity.TimetableHearingYear_;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Singular;
import lombok.ToString;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@Getter
@ToString
@Builder
public class TimetableHearingYearSearchRestrictions {

  private final Pageable pageable;

  @Singular(ignoreNullCollections = true)
  private List<HearingStatus> statusRestrictions;

  public Specification<TimetableHearingYear> getSpecification() {
    return new EnumSpecification<>(statusRestrictions, TimetableHearingYear_.hearingStatus);
  }

}
