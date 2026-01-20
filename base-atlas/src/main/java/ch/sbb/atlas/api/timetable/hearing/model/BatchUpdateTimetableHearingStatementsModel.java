package ch.sbb.atlas.api.timetable.hearing.model;

import ch.sbb.atlas.api.timetable.hearing.enumeration.StatementStatus;
import ch.sbb.atlas.kafka.model.SwissCanton;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldNameConstants
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(name = "BatchUpdateTimetableHearingStatements")
public class BatchUpdateTimetableHearingStatementsModel extends BaseUpdateHearingModel {

  private SwissCanton dossierCanton;

  private StatementStatus statementStatus;

  private Long dossierId;

  private String dossierContactMail;

  private String publicComment;

  private String internalComment;

  private String topic;

}