package ch.sbb.atlas.servicepointdirectory.module.bulkimport.sector.service;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.servicepoint.GeolocationBaseCreateModel;
import ch.sbb.atlas.api.servicepoint.SpatialReference;
import ch.sbb.atlas.api.servicepoint.sector.CreateSectorVersionModel;
import ch.sbb.atlas.imports.bulk.BulkImportUpdateContainer;
import ch.sbb.atlas.imports.model.create.SectorCreateCsvModel;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class SectorBulkImportCreateTest {

  @Test
  void shouldMapFromCsvToCreateModel() {
    BulkImportUpdateContainer<SectorCreateCsvModel> container =
        BulkImportUpdateContainer.<SectorCreateCsvModel>builder()
            .object(SectorCreateCsvModel.builder()
                .trafficPointSloid("ch:1:sloid:7000:1:2")
                .validFrom(LocalDate.of(2021, 4, 1))
                .validTo(LocalDate.of(2099, 12, 31))
                .designation("Perron 3")
                .length(12.0)
                .east(2600037.945)
                .north(1199749.812)
                .spatialReference(SpatialReference.LV95)
                .height(540.2)
                .edgeHeight(11.0)
                .build())
            .build();

    CreateSectorVersionModel expected = CreateSectorVersionModel.builder()
        .trafficPointSloid("ch:1:sloid:7000:1:2")
        .validFrom(LocalDate.of(2021, 4, 1))
        .validTo(LocalDate.of(2099, 12, 31))
        .designation("Perron 3")
        .length(12.0)
        .edgeHeight(11.0)
        .sectorGeolocation(GeolocationBaseCreateModel.builder()
            .east(2600037.945)
            .north(1199749.812)
            .spatialReference(SpatialReference.LV95)
            .height(540.2)
            .build())
        .build();

    CreateSectorVersionModel result = SectorBulkImportCreate.apply(container);
    assertThat(result).usingRecursiveComparison().isEqualTo(expected);
  }

}