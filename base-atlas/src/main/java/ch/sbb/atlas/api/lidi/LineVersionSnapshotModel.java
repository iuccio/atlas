package ch.sbb.atlas.api.lidi;

import ch.sbb.atlas.api.AtlasCharacterSetsRegex;
import ch.sbb.atlas.api.AtlasFieldLengths;
import ch.sbb.atlas.api.lidi.enumaration.LineConcessionType;
import ch.sbb.atlas.api.lidi.enumaration.LineType;
import ch.sbb.atlas.api.lidi.enumaration.OfferCategory;
import ch.sbb.atlas.api.lidi.enumaration.PaymentType;
import ch.sbb.atlas.api.model.BaseVersionModel;
import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.workflow.model.WorkflowStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.AccessMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@FieldNameConstants
@Schema(name = "LineVersionSnapshot")
public class LineVersionSnapshotModel extends BaseVersionModel {

  @Schema(description = """
      This ID helps identify versions of a line point in the use case front end and/or update.
      This ID can be deleted if the version is no longer present. Do not use this ID to map your object to a line.
      To do this, use the slnid or number in combination with the data range (valid from/valid until).
      """,
      accessMode = AccessMode.READ_ONLY, example = "1")
  private Long id;

  @Schema(description = "Workflow Technical identifier", accessMode = AccessMode.READ_ONLY)
  @NotNull
  private Long workflowId;

  @Schema(description = "Workflow Status", accessMode = AccessMode.READ_ONLY)
  @NotNull
  private WorkflowStatus workflowStatus;

  @Schema(description = "Parent Object identifier", example = "Technical Parent Object identifier", accessMode =
      AccessMode.READ_ONLY)
  @NotNull
  private Long parentObjectId;

  @Schema(description = "Status", accessMode = AccessMode.READ_ONLY)
  private Status status;

  @Schema(description = "LineType", accessMode = AccessMode.READ_ONLY)
  @NotNull
  private LineType lineType;

  @Schema(description = "SLNID", accessMode = AccessMode.READ_ONLY, example = "ch:1:slnid:10001234")
  private String slnid;

  @Schema(description = "PaymentType", accessMode = AccessMode.READ_ONLY)
  @NotNull
  private PaymentType paymentType;

  @Schema(description = "Number", example = "L1", accessMode = AccessMode.READ_ONLY)
  private String number;

  @Schema(description = "LongName", example = "Spiseggfräser; Talstation - Bergstation; Ersatzbus", accessMode =
      AccessMode.READ_ONLY)
  private String longName;

  @Schema(description = "Description", example = "Meiringen - Innertkirchen", accessMode = AccessMode.READ_ONLY)
  private String description;

  @Schema(description = "Valid from", accessMode = AccessMode.READ_ONLY)
  @NotNull
  private LocalDate validFrom;

  @Schema(description = "Valid to", accessMode = AccessMode.READ_ONLY)
  @NotNull
  private LocalDate validTo;

  @Schema(description = "ConcessionType")
  private LineConcessionType lineConcessionType;

  @Schema(description = "ShortNumber", example = "61")
  @Size(max = AtlasFieldLengths.LENGTH_10)
  @Pattern(regexp = AtlasCharacterSetsRegex.ISO_8859_1)
  private String shortNumber;

  @Schema(description = "offerCategory")
  @NotNull
  private OfferCategory offerCategory;

  @Schema(description = "BusinessOrganisation SBOID", example = "ch:1:sboid:100001", accessMode = AccessMode.READ_ONLY)
  @NotNull
  private String businessOrganisation;

  @Schema(description = "Comment", example = "Comment regarding the line", accessMode = AccessMode.READ_ONLY)
  private String comment;

  @Schema(description = "Optimistic locking version - instead of ETag HTTP Header (see RFC7232:Section 2.3)", example = "5",
      accessMode = AccessMode.READ_ONLY)
  private Integer etagVersion;

}
