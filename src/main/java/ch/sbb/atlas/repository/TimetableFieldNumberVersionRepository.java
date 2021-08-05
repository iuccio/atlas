package ch.sbb.atlas.repository;

import ch.sbb.atlas.entity.TimetableFieldNumberVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimetableFieldNumberVersionRepository extends JpaRepository<TimetableFieldNumberVersion,Long> {

}
