package ch.sbb.workflow.module.lidi.tth.mapper;

import static ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus.UNEDITABLE_STATEMENTS;

import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.api.workflow.tth.dossier.TthDossierModel;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TthDossierMapper {

  public static TthDossier toEntity(TthDossierModel model) {
    return TthDossier.builder()
        .id(model.getId())
        .topic(model.getTopic())
        .internalComment(model.getInternalComment())
        .publicComment(model.getPublicComment())
        .statementIds(model.getStatementIds())
        .boContactMail(model.getBoContactMail())
        .boDeadlineToAnswer(model.getBoDeadlineToAnswer())
        .build();
  }

  public static TthDossierModel toModel(TthDossier entity) {
    return TthDossierModel.builder()
        .id(entity.getId())
        .topic(entity.getTopic())
        .dossierStatus(entity.getDossierStatus())
        .internalComment(entity.getInternalComment())
        .publicComment(entity.getPublicComment())
        .statementIds(entity.getStatementIds())
        .boContactMail(entity.getBoContactMail())
        .boDeadlineToAnswer(entity.getBoDeadlineToAnswer())
        .questions(entity.getDossierQuestions()
            .stream()
            .map(TthDossierQuestionMapper::toModel)
            .toList())
        .creationDate(entity.getCreationDate())
        .creator(entity.getCreator())
        .editionDate(entity.getEditionDate())
        .editor(entity.getEditor())
        .build();
  }

  public static BatchUpdateTimetableHearingStatementsModel toBatchUpdateModel(TthDossier dossier) {
    return toBatchUpdateModel(dossier, dossier.getDossierStatus());
  }

  public static BatchUpdateTimetableHearingStatementsModel toBatchUpdateModel(TthDossier dossier, DossierStatus newStatus) {
    BatchUpdateTimetableHearingStatementsModel batchUpdate = BatchUpdateTimetableHearingStatementsModel.builder()
        .ids(dossier.getStatementIds())
        .publicComment(dossier.getPublicComment())
        .internalComment(dossier.getInternalComment())
        .topic(dossier.getTopic())
        .statementStatus(mapDossierStatusToStatementStatus(dossier, newStatus))
        .build();
    if (UNEDITABLE_STATEMENTS.contains(newStatus)) {
      batchUpdate.setDossierId(dossier.getId());
      batchUpdate.setDossierContactMail(dossier.getBoContactMail());
    }
    return batchUpdate;
  }

  private static StatementStatus mapDossierStatusToStatementStatus(TthDossier dossier, DossierStatus newStatus) {
    return switch (newStatus) {
      case ADDED -> StatementStatus.IN_REVIEW;
      case CANCELED -> StatementStatus.RECEIVED;
      case ACCEPTED -> StatementStatus.ACCEPTED;
      case REJECTED -> StatementStatus.REJECTED;
      case MOVED -> StatementStatus.MOVED;
      case DISSOLVED -> mapDossierStatusToStatementStatus(dossier, dossier.getDossierStatus());
      default -> throw new IllegalArgumentException("Unsupported DossierStatus " + newStatus);
    };
  }

}
