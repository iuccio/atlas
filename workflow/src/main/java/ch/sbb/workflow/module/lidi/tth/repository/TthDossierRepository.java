package ch.sbb.workflow.module.lidi.tth.repository;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TthDossierRepository extends JpaRepository<TthDossier, Long>, JpaSpecificationExecutor<TthDossier> {

  @Query("""
      select sIds from ch.sbb.workflow.module.lidi.tth.entity.TthDossier tthd
      join tthd.statementIds sIds
      where tthd.dossierStatus in :dossierStatus""")
  List<Long> findStatementIdsByDossierStatusIn(List<DossierStatus> dossierStatus);

  @Transactional
  @Query(value = """
      with updated as (
            update tth_dossier
                set dossier_status = 'CANCELED'
                where dossier_status = 'ADDED'
            returning *
            )
      select * from updated
      """, nativeQuery = true)
  List<TthDossier> updateDossierStatusFromAddedToCanceled();

  @Transactional
  @Query(value = """
      with updated as (
            update tth_dossier
                set dossier_status = 'DISSOLVED'
                where dossier_status = 'DOSSIER_BO_CHECK'
                    or dossier_status = 'DOSSIER_CANTON_CHECK'
                    or dossier_status = 'MOVED'
            returning id
            )
      select id from updated
      """, nativeQuery = true)
  List<Long> updateDossierStatusFromCheckOrMovedToDissolved();

  @Transactional
  @Query(value = """
      with deleted as (
            delete from tth_dossier_statement_ids
                where tth_dossier_id in :dossierIds
            returning statement_ids
            )
      select statement_ids from deleted
      """, nativeQuery = true)
  List<Long> deleteDossierStatementRelationsFor(List<Long> dossierIds);
}