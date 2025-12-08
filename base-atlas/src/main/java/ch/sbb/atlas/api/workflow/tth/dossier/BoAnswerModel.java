package ch.sbb.atlas.api.workflow.tth.dossier;

import ch.sbb.atlas.api.AtlasFieldLengths;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode
@SuperBuilder
@Schema(name = "BoAnswer")
public class BoAnswerModel {

  @NotNull
  @Schema(description = "Answer from the BO to the canton", example = "Yes, the frequency on line S1 can be increased during "
      + "peak hours.")
  @Size(min = 1, max = AtlasFieldLengths.LENGTH_5000)
  private String answerToCanton;
}
