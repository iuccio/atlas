package ch.sbb.workflow.sepodi.hearing.model.sepodi;

import ch.sbb.atlas.api.AtlasCharacterSetsRegex;
import ch.sbb.atlas.api.AtlasFieldLengths;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.AccessMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
public abstract class BaseStopPointWorkflowModel {

  @Schema(description = "Workflow id", accessMode = AccessMode.READ_ONLY)
  private Long id;

  @Schema(description = "Service Point version id")
  @NotNull
  private Long versionId;

  @Size(min = 1, max = AtlasFieldLengths.LENGTH_500)
  @Schema(description = "Unique code for locations that is used in customer information. The structure is described in the "
      + "“Swiss Location ID” specification, chapter 4.2. The document is available here. "
      + "https://transportdatamanagement.ch/standards/", example = "ch:1:sloid:18771")
  @NotNull
  private String sloid;

  @Size(max = AtlasFieldLengths.LENGTH_10)
  @Schema(description = "List of cc emails for status of hearing")
  private List<@Pattern(regexp = AtlasCharacterSetsRegex.EMAIL_ADDRESS) @Size(max = AtlasFieldLengths.LENGTH_100) String> ccEmails;

  @NotNull
  @Size(min = 2, max = AtlasFieldLengths.LENGTH_1500)
  @Schema(description = "Hearing reasons")
  private String workflowComment;

  @Schema(description = "List hearing examinants")
  private List<@Valid StopPointClientPersonModel> examinants;

  public List<StopPointClientPersonModel> getExaminants() {
    if (this.examinants == null) {
      return new ArrayList<>();
    }
    return this.examinants;
  }

}
