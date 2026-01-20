package ch.sbb.workflow.module.lidi.tth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.client.user.administration.UserAdministrationClient;
import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.user.administration.PermissionModel;
import ch.sbb.atlas.api.user.administration.TransportCompanyDossierAnswerPermissionRestrictionModel;
import ch.sbb.atlas.api.user.administration.UserModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.kafka.model.SwissCanton;
import ch.sbb.atlas.kafka.model.user.admin.ApplicationType;
import ch.sbb.atlas.model.controller.IntegrationTest;
import ch.sbb.atlas.model.exception.SimpleAtlasException;
import ch.sbb.atlas.user.administration.security.service.BoUserMailCheckService;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierQuestion;
import ch.sbb.workflow.module.lidi.tth.mail.TthDossierNotificationService;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import ch.sbb.workflow.module.lidi.tth.search.TthDossierRequestParams;
import ch.sbb.workflow.module.lidi.tth.search.TthDossierSearchRestrictions;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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

  @MockitoBean
  private UserAdministrationClient userAdministrationClient;

  @MockitoBean
  private BoUserMailCheckService boUserMailCheckService;

  @Captor
  private ArgumentCaptor<BatchUpdateTimetableHearingStatementsModel> batchUpdateCaptor;

  private TthDossier exampleDossier;
  private TthDossierQuestion question;

  @BeforeEach
  void setUp() {
    when(userAdministrationClient.getUserByMail(any())).thenReturn(UserModel.builder()
        .permissions(Set.of(PermissionModel.builder()
            .application(ApplicationType.TIMETABLE_HEARING)
            .permissionRestrictions(List.of(new TransportCompanyDossierAnswerPermissionRestrictionModel(true)))
            .build()))
        .build());

    when(boUserMailCheckService.isCurrentUserMailAssignedTo(any())).thenReturn(true);

    TthDossier dossier = TthDossier.builder()
        .swissCanton(SwissCanton.BERN)
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
        .swissCanton(SwissCanton.BERN)
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
        .swissCanton(SwissCanton.BERN)
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
    tthDossierService.sendDossierToBo(dossier);

    // then
    TthDossier updatedDossier = tthDossierService.getDossierById(dossier.getId());
    assertThat(updatedDossier.getDossierStatus()).isEqualTo(DossierStatus.DOSSIER_BO_CHECK);
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
            .dossierCanton(SwissCanton.BERN)
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
            .dossierCanton(SwissCanton.BERN)
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
    tthDossierService.sendDossierToBo(exampleDossier);

    // when
    String boAnswer = "Joa das geht schon.";
    assertThat(exampleDossier.getDossierStatus()).isEqualTo(DossierStatus.DOSSIER_BO_CHECK);

    tthDossierService.answerQuestion(question.getId(), boAnswer, exampleDossier);
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
        .isThrownBy(() -> tthDossierService.answerQuestion(questionId, "Joa das geht schon.", exampleDossier))
        .withMessage("Dossier is not in status DOSSIER_BO_CHECK");
  }

  @Test
  void shouldGetDossierByQuestionId() {
    Long questionId = exampleDossier.getDossierQuestions().getFirst().getId();
    TthDossier foundDossier = tthDossierService.getDossierByQuestionId(questionId);
    assertThat(foundDossier).usingRecursiveComparison().isEqualTo(exampleDossier);
  }

  @Test
  void shouldFindDossiersBySearchCriteria() {
    List<TthDossier> dossiers =
        tthDossierService.getDossiers(TthDossierSearchRestrictions.builder()
            .requestParams(TthDossierRequestParams.builder()
                .searchCriteria("Bern")
                .build())
            .pageable(Pageable.unpaged())
            .build()).getContent();
    assertThat(dossiers).hasSize(1);

    dossiers =
        tthDossierService.getDossiers(TthDossierSearchRestrictions.builder()
            .requestParams(TthDossierRequestParams.builder()
                .searchCriteria("Zürich")
                .build())
            .pageable(Pageable.unpaged())
            .build()).getContent();
    assertThat(dossiers).isEmpty();
  }

  @Test
  void shouldFindDossiersByCanton() {
    List<TthDossier> dossiers =
        tthDossierService.getDossiers(TthDossierSearchRestrictions.builder()
            .requestParams(TthDossierRequestParams.builder()
                .canton(SwissCanton.BERN)
                .build())
            .pageable(Pageable.unpaged())
            .build()).getContent();
    assertThat(dossiers).hasSize(1);

    dossiers =
        tthDossierService.getDossiers(TthDossierSearchRestrictions.builder()
            .requestParams(TthDossierRequestParams.builder()
                .canton(SwissCanton.ZUG)
                .build())
            .pageable(Pageable.unpaged())
            .build()).getContent();
    assertThat(dossiers).isEmpty();
  }

  @Test
  void shouldFindDossiersByStatus() {
    List<TthDossier> dossiers =
        tthDossierService.getDossiers(TthDossierSearchRestrictions.builder()
            .requestParams(TthDossierRequestParams.builder()
                .statusRestriction(DossierStatus.ADDED)
                .build())
            .pageable(Pageable.unpaged())
            .build()).getContent();
    assertThat(dossiers).hasSize(1);

    dossiers =
        tthDossierService.getDossiers(TthDossierSearchRestrictions.builder()
            .requestParams(TthDossierRequestParams.builder()
                .statusRestriction(DossierStatus.DOSSIER_BO_CHECK)
                .build())
            .pageable(Pageable.unpaged())
            .build()).getContent();
    assertThat(dossiers).isEmpty();
  }
}