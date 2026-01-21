package ch.sbb.workflow.module.lidi.tth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingYearApiInternalClient;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.kafka.model.SwissCanton;
import ch.sbb.atlas.model.controller.IntegrationTest;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import feign.FeignException;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@IntegrationTest
class TthYearServiceTest {

  @MockitoBean
  private TimetableHearingYearApiInternalClient timetableHearingYearApiInternalClient;

  private final TthYearService tthYearService;
  private final TthDossierRepository tthDossierRepository;

  @Autowired
  TthYearServiceTest(TthYearService tthYearService, TthDossierRepository tthDossierRepository) {
    this.tthYearService = tthYearService;
    this.tthDossierRepository = tthDossierRepository;
  }

  @AfterEach
  void tearDown() {
    tthDossierRepository.deleteAll();
  }

  @Test
  void shouldRollbackDossierChangesWhenCloseTimetableHearingInLidiFails() {
    // given
    long dossierId = tthDossierRepository.save(TthDossier.builder()
        .swissCanton(SwissCanton.BERN)
        .topic("topic")
        .dossierStatus(DossierStatus.ADDED)
        .statementIds(List.of(1L, 3L))
        .build()).getId();
    doThrow(FeignException.class).when(timetableHearingYearApiInternalClient).closeTimetableHearing(anyLong(), anyList());
    // when
    assertThrows(FeignException.class, () -> tthYearService.closeTimetableHearingYear(2026L));
    // then
    assertThat(tthDossierRepository.findById(dossierId).get().getDossierStatus()).isEqualTo(DossierStatus.ADDED);
  }
}