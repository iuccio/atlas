package ch.sbb.line.directory.module.line.entity;

import ch.sbb.atlas.versioning.annotation.AtlasVersionable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
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
@ToString(callSuper = true)
@SuperBuilder(toBuilder = true)
@FieldNameConstants
@Entity(name = "slnid_line_id")
@AtlasVersionable
public class SlnidLinenIdMapping {

  @Id
  private String slnid;

  @NotNull
  private String linenId;

}
