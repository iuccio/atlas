package ch.sbb.atlas.api.prm.model.contactpoint;

import ch.sbb.atlas.servicepoint.ServicePointNumber;
import ch.sbb.atlas.validation.DatesValidator;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
@Schema(name = "ReadContactPointVersion")
public class ReadContactPointVersionModel extends ContactPointVersionModel implements DatesValidator {

  @NotNull
  @Valid
  private ServicePointNumber number;

}
