package ch.sbb.atlas.imports.model.create;

import ch.sbb.atlas.api.servicepoint.SpatialReference;
import ch.sbb.atlas.deserializer.LocalDateDeserializer;
import ch.sbb.atlas.imports.annotation.DefaultMapping;
import ch.sbb.atlas.imports.bulk.BulkImportErrors;
import ch.sbb.atlas.imports.bulk.BulkImportLogEntry.BulkImportError;
import ch.sbb.atlas.imports.bulk.UpdateGeolocationModel;
import ch.sbb.atlas.imports.bulk.Validatable;
import ch.sbb.atlas.imports.model.create.SectorCreateCsvModel.Fields;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@FieldNameConstants
@EqualsAndHashCode
@JsonPropertyOrder({Fields.trafficPointSloid, Fields.validFrom, Fields.validTo,
    Fields.designation, Fields.east, Fields.north, Fields.spatialReference, Fields.height,
    Fields.length, Fields.edgeHeight})
public class SectorCreateCsvModel implements Validatable<SectorCreateCsvModel>, UpdateGeolocationModel {

  @DefaultMapping
  private String trafficPointSloid;

  @DefaultMapping
  @JsonDeserialize(using = LocalDateDeserializer.class)
  private LocalDate validFrom;

  @DefaultMapping
  @JsonDeserialize(using = LocalDateDeserializer.class)
  private LocalDate validTo;

  @DefaultMapping
  private String designation;

  @DefaultMapping
  private Double length;

  private Double east;

  private Double north;

  private SpatialReference spatialReference;

  private Double height;

  @DefaultMapping
  private Double edgeHeight;

  @Override
  public List<BulkImportError> validate() {
    return BulkImportErrors.notNullForFields(this,
        List.of(Fields.trafficPointSloid, Fields.validFrom, Fields.validTo,
            Fields.designation, Fields.north, Fields.east, Fields.spatialReference));
  }

  @Override
  public List<UniqueField<SectorCreateCsvModel>> uniqueFields() {
    return List.of();
  }

}
