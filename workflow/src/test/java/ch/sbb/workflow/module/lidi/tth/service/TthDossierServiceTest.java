package ch.sbb.workflow.module.lidi.tth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.model.controller.IntegrationTest;
import ch.sbb.atlas.model.exception.SimpleAtlasException;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import ch.sbb.workflow.module.lidi.tth.mail.TthDossierNotificationService;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
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

  @Captor
  private ArgumentCaptor<BatchUpdateTimetableHearingStatementsModel> batchUpdateCaptor;

  private TthDossier exampleDossier;
  private TthDossierQuestion question;

  @BeforeEach
  void setUp() {
    TthDossier dossier = TthDossier.builder()
        .topic("Bern, Salem - Takt")
        .internalComment("Noch mit Bernmobil abklären")
        .publicComment("In Abklärung mit GO")
        .boContactMail("bern@mobil.be")
        .dossierStatus(DossierStatus.ADDED)
        .statementIds(List.of(132L, 145L))
        .boDeadlineToAnswer(LocalDate.now().plusDays(7))
        .build();
    question = TthDossierQuestion.builder()
        .tthDossier(dossier)
        .question("Kann der Takt erhöht werden?")
        .build();
    dossier.setDossierQuestions(List.of(question));
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
    dossier.setDossierQuestions(List.of(TthDossierQuestion.builder()
        .tthDossier(dossier)
        .question("Kann der Takt erhöht werden?")
        .build()));

    assertThat(dossier.getId()).isNotNull();
    assertThat(dossier.getDossierQuestions()).hasSize(1);
    verify(timetableHearingStatementClient).updateStatements(any());
  }

  @Test
  void shouldCancelDossier() {
    // when
    tthDossierService.completeDossier(exampleDossier, DossierStatus.CANCELED);

    // then
    TthDossier canceledDossier = tthDossierService.getDossierById(exampleDossier.getId());
    assertThat(canceledDossier.getDossierStatus()).isEqualTo(DossierStatus.CANCELED);

    verify(timetableHearingStatementClient).updateStatements(any());
  }

  @Test
  void shouldDissolveDossier() {
    // when
    exampleDossier.setDossierStatus(DossierStatus.ACCEPTED);
    tthDossierService.completeDossier(exampleDossier, DossierStatus.DISSOLVED);

    // then
    TthDossier dissolvedDossier = tthDossierService.getDossierById(exampleDossier.getId());
    assertThat(dissolvedDossier.getDossierStatus()).isEqualTo(DossierStatus.DISSOLVED);

    verify(timetableHearingStatementClient).updateStatements(any());
  }

  @Test
  void shouldNotCompleteToAdded() {
    assertThatExceptionOfType(SimpleAtlasException.class).isThrownBy(
        () -> tthDossierService.completeDossier(exampleDossier, DossierStatus.ADDED));
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
    tthDossierService.sendDossierToBo(dossier.getId());

    // then
    verify(tthDossierNotificationService).notifyBoAboutNewQuestion(any());
  }

  @Test
  void shouldUpdateDossier() {
    // when
    String newPublicComment = "Wir haben uns geeinigt, den Takt zu erhöhen";
    TthDossier dossier = exampleDossier.toBuilder().publicComment(newPublicComment).build();
    TthDossier updatedDossier = tthDossierService.updateDossier(exampleDossier.getId(), dossier);

    // then
    assertThat(updatedDossier.getDossierStatus()).isEqualTo(DossierStatus.ADDED);
    assertThat(updatedDossier.getPublicComment()).isEqualTo(newPublicComment);

    verify(timetableHearingStatementClient).updateStatements(any());
  }

  @Test
  void shouldNotUpdateDossierInBoCheck() {
    exampleDossier.setDossierStatus(DossierStatus.DOSSIER_BO_CHECK);
    exampleDossier = tthDossierRepository.saveAndFlush(exampleDossier);

    Long dossierId = exampleDossier.getId();
    assertThatExceptionOfType(SimpleAtlasException.class).isThrownBy(
        () -> tthDossierService.updateDossier(dossierId, exampleDossier)
    );
  }

  @Test
  void shouldUpdateDossierRemovingStatement() {
    // when
    List<Long> statementIds = List.of(87L);
    TthDossier dossier = exampleDossier.toBuilder().statementIds(statementIds).build();
    TthDossier updatedDossier = tthDossierService.updateDossier(exampleDossier.getId(), dossier);

    // then
    assertThat(updatedDossier.getDossierStatus()).isEqualTo(DossierStatus.ADDED);
    assertThat(updatedDossier.getStatementIds()).hasSameElementsAs(statementIds);

    verify(timetableHearingStatementClient, times(2)).updateStatements(batchUpdateCaptor.capture());

    List<BatchUpdateTimetableHearingStatementsModel> expectedUpdates = List.of(
        // First update removing current statements by deleting dossierId and setting status back to RECEIVED
        BatchUpdateTimetableHearingStatementsModel.builder()
            .ids(List.of(132L, 145L))
            .statementStatus(StatementStatus.RECEIVED)
            .dossierId(null)
            .dossierContactMail(null)
            .publicComment(exampleDossier.getPublicComment())
            .internalComment(exampleDossier.getInternalComment())
            .topic(exampleDossier.getTopic())
            .build(),
        // Second update adding new statements by adding dossierId and setting status back to IN_REVIEW
        BatchUpdateTimetableHearingStatementsModel.builder()
            .ids(statementIds)
            .statementStatus(StatementStatus.IN_REVIEW)
            .dossierId(updatedDossier.getId())
            .dossierContactMail("bern@mobil.be")
            .publicComment(exampleDossier.getPublicComment())
            .internalComment(exampleDossier.getInternalComment())
            .topic(exampleDossier.getTopic())
            .build()
    );
    assertThat(batchUpdateCaptor.getAllValues()).usingRecursiveComparison().isEqualTo(expectedUpdates);
  }

  @Test
  void shouldAnswerQuestionAsBo() {
    tthDossierService.sendDossierToBo(exampleDossier.getId());

    // when
    String boAnswer = "Joa das geht schon.";
    tthDossierService.answerQuestion(question.getId(), boAnswer);

    // then
    TthDossier tthDossier = tthDossierService.getDossierById(exampleDossier.getId());

    assertThat(tthDossier.getDossierStatus()).isEqualTo(DossierStatus.DOSSIER_CANTON_CHECK);

    assertThat(tthDossier.getDossierQuestions()).hasSize(1);
    assertThat(tthDossier.getDossierQuestions().getFirst().getAnswerToCanton()).isEqualTo(boAnswer);

    verifyNoInteractions(timetableHearingStatementClient);
  }

  @Test
  void shouldNotBeAbleToAnswerQuestionInOtherStatus() {
    Long questionId = question.getId();
    assertThatExceptionOfType(SimpleAtlasException.class)
        .isThrownBy(() -> tthDossierService.answerQuestion(questionId, "Joa das geht schon."))
        .withMessage("Dossier is not in status DOSSIER_BO_CHECK");
  }
}