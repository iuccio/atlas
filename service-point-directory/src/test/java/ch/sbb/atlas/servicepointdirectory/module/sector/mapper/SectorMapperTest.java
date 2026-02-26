package ch.sbb.atlas.servicepointdirectory.module.sector.mapper;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatNoException;

import ch.sbb.atlas.api.servicepoint.SpatialReference;
import ch.sbb.atlas.servicepointdirectory.module.geodata.exception.CoordinatesNotTransformableException;
import ch.sbb.atlas.servicepointdirectory.module.sector.entity.SectorVersion;
import org.junit.jupiter.api.Test;

class SectorMapperTest {

  @Test
  void shouldThrowExceptionIfCoordinatesNotInRange() {
    SectorVersion sectorVersion = SectorVersion.builder()
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.WGS84)
        .build();

    assertThatExceptionOfType(CoordinatesNotTransformableException.class)
        .isThrownBy(() -> SectorMapper.toModel(sectorVersion));
  }

  @Test
  void shouldNotThrowExceptionIfCoordinatesInRange() {
    SectorVersion sectorVersion = SectorVersion.builder()
        .east(2600037.945)
        .north(1199749.812)
        .spatialReference(SpatialReference.LV95)
        .build();

    assertThatNoException().isThrownBy(() -> SectorMapper.toModel(sectorVersion));
  }
}