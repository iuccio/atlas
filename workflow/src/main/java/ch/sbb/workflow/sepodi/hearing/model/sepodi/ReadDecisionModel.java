package ch.sbb.workflow.sepodi.hearing.model.sepodi;

import ch.sbb.workflow.sepodi.hearing.enity.DecisionType;
import ch.sbb.workflow.sepodi.hearing.enity.JudgementType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
@Schema(name = "ReadDecision")
public class ReadDecisionModel {

  @Schema(description = "Judgement")
  private JudgementType judgement;

  @Schema(description = "Motivation", example = "I agree")
  private String motivation;

  private StopPointClientPersonModel examinant;

  @Schema(description = "FoT Judgement")
  private JudgementType fotJudgement;

  @Schema(description = "Motivation", example = "I agree")
  private String fotMotivation;

  private StopPointClientPersonModel fotOverrider;

  private DecisionType decisionType;

}
