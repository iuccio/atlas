package ch.sbb.workflow.module.lidi.tth.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

class TthDossierMapperTest {

  private static final TthDossier DOSSIER = TthDossier.builder()
      .id(1L)
      .topic("Bern, Salem - Takt")
      .internalComment("Noch mit Bernmobil abklären")
      .publicComment("In Abklärung mit GO")
      .boContactMail("bern@mobil.be")
      .statementIds(List.of(132L, 145L))
      .boDeadlineToAnswer(LocalDate.now().plusDays(7))
      .dossierStatus(DossierStatus.REJECTED)
      .build();

  @Test
  void shouldUpdateStatementForCancelCorrectly() {
    BatchUpdateTimetableHearingStatementsModel batchUpdateModel = TthDossierMapper.toBatchUpdateModel(DOSSIER,
        DossierStatus.CANCELED);

    BatchUpdateTimetableHearingStatementsModel expected = BatchUpdateTimetableHearingStatementsModel.builder()
        .ids(DOSSIER.getStatementIds())
        .topic(DOSSIER.getTopic())
        .internalComment(DOSSIER.getInternalComment())
        .publicComment(DOSSIER.getPublicComment())
        .statementStatus(StatementStatus.RECEIVED)
        .dossierId(null)
        .dossierContactMail(null)
        .build();
    assertThat(batchUpdateModel).isEqualTo(expected);
  }

  @Test
  void shouldUpdateStatementForAcceptedCorrectly() {
    BatchUpdateTimetableHearingStatementsModel batchUpdateModel = TthDossierMapper.toBatchUpdateModel(DOSSIER,
        DossierStatus.ACCEPTED);

    BatchUpdateTimetableHearingStatementsModel expected = BatchUpdateTimetableHearingStatementsModel.builder()
        .ids(DOSSIER.getStatementIds())
        .topic(DOSSIER.getTopic())
        .internalComment(DOSSIER.getInternalComment())
        .publicComment(DOSSIER.getPublicComment())
        .statementStatus(StatementStatus.ACCEPTED)
        .dossierId(DOSSIER.getId())
        .dossierContactMail(DOSSIER.getBoContactMail())
        .build();
    assertThat(batchUpdateModel).isEqualTo(expected);
  }

  @Test
  void shouldUpdateStatementForRejectedCorrectly() {
    BatchUpdateTimetableHearingStatementsModel batchUpdateModel = TthDossierMapper.toBatchUpdateModel(DOSSIER,
        DossierStatus.REJECTED);

    BatchUpdateTimetableHearingStatementsModel expected = BatchUpdateTimetableHearingStatementsModel.builder()
        .ids(DOSSIER.getStatementIds())
        .topic(DOSSIER.getTopic())
        .internalComment(DOSSIER.getInternalComment())
        .publicComment(DOSSIER.getPublicComment())
        .statementStatus(StatementStatus.REJECTED)
        .dossierId(DOSSIER.getId())
        .dossierContactMail(DOSSIER.getBoContactMail())
        .build();
    assertThat(batchUpdateModel).isEqualTo(expected);
  }

  @Test
  void shouldUpdateStatementForMovedCorrectly() {
    BatchUpdateTimetableHearingStatementsModel batchUpdateModel = TthDossierMapper.toBatchUpdateModel(DOSSIER,
        DossierStatus.MOVED);

    BatchUpdateTimetableHearingStatementsModel expected = BatchUpdateTimetableHearingStatementsModel.builder()
        .ids(DOSSIER.getStatementIds())
        .topic(DOSSIER.getTopic())
        .internalComment(DOSSIER.getInternalComment())
        .publicComment(DOSSIER.getPublicComment())
        .statementStatus(StatementStatus.MOVED)
        .dossierId(DOSSIER.getId())
        .dossierContactMail(DOSSIER.getBoContactMail())
        .build();
    assertThat(batchUpdateModel).isEqualTo(expected);
  }

  @Test
  void shouldUpdateStatementForDissolvedCorrectly() {
    BatchUpdateTimetableHearingStatementsModel batchUpdateModel = TthDossierMapper.toBatchUpdateModel(DOSSIER,
        DossierStatus.DISSOLVED);

    BatchUpdateTimetableHearingStatementsModel expected = BatchUpdateTimetableHearingStatementsModel.builder()
        .ids(DOSSIER.getStatementIds())
        .topic(DOSSIER.getTopic())
        .internalComment(DOSSIER.getInternalComment())
        .publicComment(DOSSIER.getPublicComment())
        .statementStatus(StatementStatus.REJECTED)
        .dossierId(null)
        .dossierContactMail(null)
        .build();
    assertThat(batchUpdateModel).isEqualTo(expected);
  }
}