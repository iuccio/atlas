package ch.sbb.workflow.module.lidi.tth.repository;

import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierYear;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TthDossierYearRepository extends JpaRepository<TthDossierYear, Long> {

  TthDossierYear findTthDossierYearByHearingStatus(HearingStatus hearingStatus);
}
