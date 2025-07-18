package ch.sbb.atlas.api.servicepoint;

import ch.sbb.atlas.api.AtlasFieldLengths;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
@Schema(name = "District")
public class DistrictModel {

  @Schema(description = "SwissDistrictNumber the location is in, based on FSO", example = "242")
  private Integer fsoNumber;

  @Schema(description = "SwissDistrictName the location is in", example = "Biel/Bienne")
  @Size(max = AtlasFieldLengths.LENGTH_255)
  private String districtName;

}