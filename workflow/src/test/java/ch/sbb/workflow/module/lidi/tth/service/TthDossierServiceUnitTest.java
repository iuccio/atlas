package ch.sbb.workflow.module.lidi.tth.service;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.workflow.module.lidi.tth.mail.TthDossierNotificationService;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierQuestionRepository;
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
  @Mock
  private TthDossierQuestionRepository questionRepository;
  @Mock
  private TimetableHearingStatementClient timetableHearingStatementClient;
  @Mock
  private TthDossierNotificationService notificationService;
  @Mock
  private BoContactPermissionService boContactPermissionService;

  @InjectMocks
  private TthDossierService tthDossierService;

  @Test
  void shouldGetStatementIdsFromDossierStatus() {
    // given
    when(dossierRepository.findStatementIdsByDossierStatusIn(anyList())).thenReturn(null);
    // when
    tthDossierService.getStatementIdsFromDossierStatus(List.of(DossierStatus.ADDED, DossierStatus.DOSSIER_CANTON_CHECK));
    // then
    verify(dossierRepository).findStatementIdsByDossierStatusIn(List.of(DossierStatus.ADDED, DossierStatus.DOSSIER_CANTON_CHECK));
  }

  @Test
  void shouldUpdateDossierStatusClosingYear() {
    // given
    doNothing().when(dossierRepository).updateDossierStatusFromAddedToCanceled();
    doNothing().when(dossierRepository).updateDossierStatusFromCheckToDissolved();
    // when
    tthDossierService.updateDossierStatusClosingYear();
    // then
    verify(dossierRepository).updateDossierStatusFromAddedToCanceled();
    verify(dossierRepository).updateDossierStatusFromCheckToDissolved();
  }
}