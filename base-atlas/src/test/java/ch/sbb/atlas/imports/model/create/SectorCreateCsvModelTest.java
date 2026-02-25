package ch.sbb.atlas.imports.model.create;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.servicepoint.SpatialReference;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class SectorCreateCsvModelTest {

  @Test
  void shouldBeValidSectorCreateCsvModel() {
    SectorCreateCsvModel sector = SectorCreateCsvModel.builder()
        .trafficPointSloid("ch:1:sloid:7000")
        .validFrom(LocalDate.of(2021, 4, 1))
        .validTo(LocalDate.of(2099, 12, 31))
        .designation("A")
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.LV95)
        .height(540.2)
        .length(1.0)
        .edgeHeight(60.4)
        .build();
    assertThat(sector.validate()).isEmpty();
  }

  @Test
  void shouldBeValidMinimalSectorCreateCsvModel() {
    SectorCreateCsvModel sector = SectorCreateCsvModel.builder()
        .trafficPointSloid("ch:1:sloid:7000")
        .validFrom(LocalDate.of(2021, 4, 1))
        .validTo(LocalDate.of(2099, 12, 31))
        .designation("A")
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.LV95)
        .build();
    assertThat(sector.validate()).isEmpty();
  }

  @Test
  void shouldReportMissingTrafficPointSloid() {
    SectorCreateCsvModel sector = SectorCreateCsvModel.builder()
        .validFrom(LocalDate.of(2021, 4, 1))
        .validTo(LocalDate.of(2099, 12, 31))
        .designation("A")
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.LV95)
        .build();
    assertThat(sector.validate()).hasSize(1);
  }

  @Test
  void shouldReportMissingValidFrom() {
    SectorCreateCsvModel sector = SectorCreateCsvModel.builder()
        .trafficPointSloid("ch:1:sloid:7000")
        .validTo(LocalDate.of(2099, 12, 31))
        .designation("A")
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.LV95)
        .build();
    assertThat(sector.validate()).hasSize(1);
  }

  @Test
  void shouldReportMissingValidTo() {
    SectorCreateCsvModel sector = SectorCreateCsvModel.builder()
        .trafficPointSloid("ch:1:sloid:7000")
        .validFrom(LocalDate.of(2021, 4, 1))
        .designation("A")
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.LV95)
        .build();
    assertThat(sector.validate()).hasSize(1);
  }

  @Test
  void shouldReportMissingDesignation() {
    SectorCreateCsvModel sector = SectorCreateCsvModel.builder()
        .trafficPointSloid("ch:1:sloid:7000")
        .validFrom(LocalDate.of(2021, 4, 1))
        .validTo(LocalDate.of(2099, 12, 31))
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.LV95)
        .build();
    assertThat(sector.validate()).hasSize(1);
  }

  @Test
  void shouldReportMissingGeolocation() {
    SectorCreateCsvModel sector = SectorCreateCsvModel.builder()
        .trafficPointSloid("ch:1:sloid:7000")
        .validFrom(LocalDate.of(2021, 4, 1))
        .validTo(LocalDate.of(2099, 12, 31))
        .designation("A")
        .build();
    assertThat(sector.validate()).hasSize(3);
  }
}