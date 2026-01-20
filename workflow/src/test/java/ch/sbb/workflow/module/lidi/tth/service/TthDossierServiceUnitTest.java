package ch.sbb.workflow.module.lidi.tth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.kafka.model.SwissCanton;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TthDossierServiceUnitTest {

  @Mock
  private TthDossierRepository dossierRepository;

  @InjectMocks
  private TthDossierService tthDossierService;

  @Test
  void shouldGetStatementIdsFromDossierStatus() {
    // given
    when(dossierRepository.findStatementIdsByDossierStatusIn(
        List.of(DossierStatus.ADDED, DossierStatus.DOSSIER_CANTON_CHECK))).thenReturn(List.of(2L));
    // when & then
    assertThat(tthDossierService.getStatementIdsFromDossierStatus(List.of(DossierStatus.ADDED,
        DossierStatus.DOSSIER_CANTON_CHECK))).containsExactly(2L);
  }

  @Test
  void shouldUpdateDossierStatusClosingYear() {
    // given
    doNothing().when(dossierRepository).updateDossierStatusFromAddedToCanceled();
    doNothing().when(dossierRepository).updateDossierStatusFromCheckOrMovedToDissolved();
    // when
    tthDossierService.updateDossierStatusClosingYear();
    // then
    verify(dossierRepository).updateDossierStatusFromAddedToCanceled();
    verify(dossierRepository).updateDossierStatusFromCheckOrMovedToDissolved();
  }

  @Test
  void shouldGetBatchUpdateOfClosingAddedDossiersForStatements() {
    // given
    when(dossierRepository.findByDossierStatus(DossierStatus.ADDED)).thenReturn(List.of(
        TthDossier.builder()
            .statementIds(List.of(2L, 3L))
            .swissCanton(SwissCanton.BERN)
            .publicComment("Public comment")
            .internalComment("Internal comment")
            .topic("topic")
            .build()));
    // when
    var batchUpdateOfClosingAddedDossiersForStatements = tthDossierService.getBatchUpdateOfClosingAddedDossiersForStatements();
    // then
    assertThat(batchUpdateOfClosingAddedDossiersForStatements).hasSize(1);
    assertThat(batchUpdateOfClosingAddedDossiersForStatements.getFirst())
        .returns(List.of(2L, 3L), BatchUpdateTimetableHearingStatementsModel::getIds)
        .returns(SwissCanton.BERN, BatchUpdateTimetableHearingStatementsModel::getDossierCanton)
        .returns(StatementStatus.RECEIVED, BatchUpdateTimetableHearingStatementsModel::getStatementStatus)
        .returns("Public comment", BatchUpdateTimetableHearingStatementsModel::getPublicComment)
        .returns("Internal comment", BatchUpdateTimetableHearingStatementsModel::getInternalComment)
        .returns("topic", BatchUpdateTimetableHearingStatementsModel::getTopic);

  }
}