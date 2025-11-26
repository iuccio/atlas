package ch.sbb.workflow.module.lidi.tth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.model.controller.IntegrationTest;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import ch.sbb.workflow.module.lidi.tth.mail.TthDossierNotificationService;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@IntegrationTest
class TthDossierServiceTest {

  @Autowired
  private TthDossierService tthDossierService;

  @Autowired
  private TthDossierRepository tthDossierRepository;

  @MockitoBean
  private TimetableHearingStatementClient timetableHearingStatementClient;

  @MockitoBean
  private TthDossierNotificationService tthDossierNotificationService;

  private TthDossier exampleDossier;

  @BeforeEach
  void setUp() {
    TthDossier dossier = TthDossier.builder()
        .topic("Bern, Salem - Takt")
        .internalComment("Noch mit Bernmobil abklären")
        .publicComment("In Abklärung mit GO")
        .boContactMail("bern@mobil.be")
        .dossierStatus(DossierStatus.DOSSIER_BO_CHECK)
        .statementIds(List.of(132L, 145L))
        .boDeadlineToAnswer(LocalDate.now().plusDays(7))
        .dossierStatus(DossierStatus.ADDED)
        .build();
    exampleDossier = tthDossierRepository.saveAndFlush(dossier);
  }

  @AfterEach
  void tearDown() {
    tthDossierRepository.deleteAll();
  }

  @Test
  void shouldGetDossier() {
    // when
    TthDossier dossier = tthDossierService.getDossierById(exampleDossier.getId());

    // then
    assertThat(dossier.getId()).isNotNull();
  }

  @Test
  void shouldSaveDossier() {
    TthDossier dossier = tthDossierService.createDossier(TthDossier.builder()
        .topic("Bern, Salem - Takt")
        .internalComment("Noch mit Bernmobil abklären")
        .publicComment("In Abklärung mit GO")
        .statementIds(List.of(132L, 145L))
        .boContactMail("bern@mobil.be")
        .dossierStatus(DossierStatus.ADDED)
        .boDeadlineToAnswer(LocalDate.now().plusDays(7))
        .build());

    assertThat(dossier.getId()).isNotNull();
    verify(timetableHearingStatementClient).updateStatements(any());
  }

  @Test
  void shouldCancelDossier() {
    // when
    tthDossierService.cancelDossier(exampleDossier);

    // then
    TthDossier canceledDossier = tthDossierService.getDossierById(exampleDossier.getId());
    assertThat(canceledDossier.getDossierStatus()).isEqualTo(DossierStatus.CANCELED);

    verify(timetableHearingStatementClient).updateStatements(any());
  }

  @Test
  void shouldSendQuestionToBo() {
    // given
    TthDossier dossier = TthDossier.builder()
        .topic("Bern, Salem - Takt")
        .internalComment("Noch mit Bernmobil abklären")
        .publicComment("In Abklärung mit GO")
        .boContactMail("bern@mobil.be")
        .dossierStatus(DossierStatus.DOSSIER_BO_CHECK)
        .statementIds(List.of(132L, 145L))
        .boDeadlineToAnswer(LocalDate.now().plusDays(7))
        .build();
    dossier = tthDossierService.createDossier(dossier);
    assertThat(dossier.getId()).isNotNull();

    // when
    TthDossierQuestion question = TthDossierQuestion.builder()
        .question("Wie soll mit dem Takt verfahren werden?")
        .build();
    TthDossier tthDossier = tthDossierService.sendDossierToBo(dossier.getId(), question);

    // then
    verify(tthDossierNotificationService).notifyBoAboutNewQuestion(any());
    assertThat(tthDossier.getDossierQuestions()).hasSize(1);
  }
}