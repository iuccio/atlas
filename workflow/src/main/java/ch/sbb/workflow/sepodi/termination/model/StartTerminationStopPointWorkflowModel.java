package ch.sbb.workflow.sepodi.termination.model;

import ch.sbb.atlas.api.AtlasCharacterSetsRegex;
import ch.sbb.atlas.api.AtlasFieldLengths;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@Data
@SuperBuilder
@NoArgsConstructor
@Schema(name = "StartTerminationStopPointAddWorkflow")
public class StartTerminationStopPointWorkflowModel {

  @Schema(description = "Service Point version id")
  @NotNull
  private Long versionId;

  @Size(min = 1, max = AtlasFieldLengths.LENGTH_500)
  @Schema(description = "Unique code for locations that is used in customer information. The structure is described in the "
      + "“Swiss Location ID” specification, chapter 4.2. The document is available here. "
      + "https://transportdatamanagement.ch/standards/", example = "ch:1:sloid:18771")
  @NotNull
  private String sloid;

  @Schema(description = "Applicant mail", example = "me@you.ch")
  @Size(min = 1, max = AtlasFieldLengths.LENGTH_255)
  @Pattern(regexp = AtlasCharacterSetsRegex.EMAIL_ADDRESS)
  @NotEmpty
  private String applicantMail;

  @Schema(description = "Termination Date defined by Business Organisation managing the Stop Point")
  private LocalDate boTerminationDate;

  @Schema(description = "Workflow comment")
  @Pattern(regexp = AtlasCharacterSetsRegex.ISO_8859_1)
  @Size(max = AtlasFieldLengths.LENGTH_1500)
  private String workflowComment;

}
