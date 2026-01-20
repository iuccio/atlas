package ch.sbb.workflow.module.lidi.tth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
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
}