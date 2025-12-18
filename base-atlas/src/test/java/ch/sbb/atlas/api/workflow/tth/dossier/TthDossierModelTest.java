package ch.sbb.atlas.api.workflow.tth.dossier;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.kafka.model.SwissCanton;
import ch.sbb.atlas.model.BaseValidatorTest;
import jakarta.validation.ConstraintViolation;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TthDossierModelTest extends BaseValidatorTest {

  @Test
  void shouldAllowMinimalDossier() {
    TthDossierModel tthDossierModel = TthDossierModel.builder()
        .statementIds(List.of(1L, 2L))
        .swissCanton(SwissCanton.BERN)
        .topic("Längere Anbindung am Abend")
        .boContactMail("urs@bernmobil.be")
        .boDeadlineToAnswer(LocalDate.now().plusDays(1))
        .questions(List.of(TthDossierQuestionModel.builder().question("Ist das möglich?").build()))
        .build();
    Set<ConstraintViolation<TthDossierModel>> constraintViolations = validator.validate(tthDossierModel);
    assertThat(constraintViolations).isEmpty();
  }

  @Test
  void shouldNotAllowDossierWithoutQuestion() {
    TthDossierModel tthDossierModel = TthDossierModel.builder()
        .statementIds(List.of(1L, 2L))
        .swissCanton(SwissCanton.BERN)
        .topic("Längere Anbindung am Abend")
        .boContactMail("urs@bernmobil.be")
        .boDeadlineToAnswer(LocalDate.now().plusDays(1))
        .questions(Collections.emptyList())
        .build();
    Set<ConstraintViolation<TthDossierModel>> constraintViolations = validator.validate(tthDossierModel);
    assertThat(constraintViolations).hasSize(1);
  }

  @Test
  void shouldNotAllowDossierWithoutStatement() {
    TthDossierModel tthDossierModel = TthDossierModel.builder()
        .topic("Längere Anbindung am Abend")
        .swissCanton(SwissCanton.BERN)
        .boContactMail("urs@bernmobil.be")
        .boDeadlineToAnswer(LocalDate.now().plusDays(1))
        .questions(List.of(TthDossierQuestionModel.builder().question("Ist das möglich?").build()))
        .build();
    Set<ConstraintViolation<TthDossierModel>> constraintViolations = validator.validate(tthDossierModel);
    assertThat(constraintViolations).hasSize(1);
  }

  @Test
  void shouldValidateMail() {
    TthDossierModel tthDossierModel = TthDossierModel.builder()
        .topic("Längere Anbindung am Abend")
        .swissCanton(SwissCanton.BERN)
        .statementIds(List.of(1L, 2L))
        .dossierStatus(DossierStatus.DOSSIER_BO_CHECK)
        .boContactMail("urs@bernmobil")
        .boDeadlineToAnswer(LocalDate.now().plusDays(1))
        .questions(List.of(TthDossierQuestionModel.builder().question("Ist das möglich?").build()))
        .build();
    Set<ConstraintViolation<TthDossierModel>> constraintViolations = validator.validate(tthDossierModel);
    assertThat(constraintViolations).hasSize(1);
  }
}