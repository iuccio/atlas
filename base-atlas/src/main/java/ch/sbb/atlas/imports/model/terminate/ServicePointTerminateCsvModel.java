package ch.sbb.atlas.imports.model.terminate;

import ch.sbb.atlas.deserializer.LocalDateDeserializer;
import ch.sbb.atlas.imports.annotation.DefaultMapping;
import ch.sbb.atlas.imports.bulk.BulkImportErrors;
import ch.sbb.atlas.imports.bulk.BulkImportLogEntry.BulkImportError;
import ch.sbb.atlas.imports.bulk.Validatable;
import ch.sbb.atlas.imports.model.ServicePointUpdateCsvModel.Fields;
import ch.sbb.atlas.imports.model.base.BulkImportValidationHelper;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.time.LocalDate;
import java.util.ArrayList;
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
@JsonPropertyOrder({Fields.sloid, Fields.number, Fields.validTo})
public class ServicePointTerminateCsvModel implements Validatable<ServicePointTerminateCsvModel> {

  private String sloid;

  private Integer number;

  @DefaultMapping
  @JsonDeserialize(using = LocalDateDeserializer.class)
  private LocalDate validTo;

  @Override
  public List<BulkImportError> validate() {
    List<BulkImportError> errors = new ArrayList<>();

    if ((sloid == null) == (number == null)) {
      errors.add(BulkImportErrors.sloidXorNumber());
    }

    errors.addAll(BulkImportValidationHelper.validateServicePointNumber(number));

    if (validTo == null) {
      errors.add(BulkImportErrors.notNull(ServicePointTerminateCsvModel.Fields.validTo));
    }
    return errors;
  }

  @Override
  public List<UniqueField<ServicePointTerminateCsvModel>> uniqueFields() {
    return List.of(new UniqueField<>(ServicePointTerminateCsvModel.Fields.sloid, ServicePointTerminateCsvModel::getSloid),
        new UniqueField<>(ServicePointTerminateCsvModel.Fields.number, ServicePointTerminateCsvModel::getNumber));
  }
}
