package ch.sbb.atlas.user.administration.security.redact.entity;

import ch.sbb.atlas.api.AtlasFieldLengths;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.redact.Redacted;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@SuperBuilder(toBuilder = true)
@FieldNameConstants
@Redacted
public class DummyTthDossier {

  @NotNull
  @Enumerated(EnumType.STRING)
  private DossierStatus dossierStatus;

  @Redacted
  private int numberOfQuestions;

  @Size(min = 1, max = AtlasFieldLengths.LENGTH_5000)
  @Redacted
  private String internalComment;

}
