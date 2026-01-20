package ch.sbb.workflow.module.lidi.tth.repository;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
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

  List<TthDossier> findByDossierStatus(DossierStatus dossierStatus);

  @Transactional
  @Modifying
  @Query("""
      update ch.sbb.workflow.module.lidi.tth.entity.TthDossier tthd
      set tthd.dossierStatus = ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.CANCELED
      where tthd.dossierStatus = ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.ADDED""")
  void updateDossierStatusFromAddedToCanceled();

  @Transactional
  @Modifying
  @Query("""
      update ch.sbb.workflow.module.lidi.tth.entity.TthDossier tthd
      set tthd.dossierStatus = ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.DISSOLVED
      where tthd.dossierStatus = ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.DOSSIER_BO_CHECK
          or tthd.dossierStatus = ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.DOSSIER_CANTON_CHECK
          or tthd.dossierStatus = ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.MOVED""")
  void updateDossierStatusFromCheckOrMovedToDissolved();
}