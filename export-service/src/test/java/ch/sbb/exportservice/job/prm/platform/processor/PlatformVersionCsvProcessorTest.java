package ch.sbb.exportservice.job.prm.platform.processor;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.prm.enumeration.BasicAttributeType;
import ch.sbb.atlas.api.prm.enumeration.BoardingDeviceAttributeType;
import ch.sbb.atlas.api.prm.enumeration.BooleanOptionalAttributeType;
import ch.sbb.atlas.api.prm.enumeration.InfoOpportunityAttributeType;
import ch.sbb.atlas.api.prm.enumeration.VehicleAccessAttributeType;
import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.servicepoint.ServicePointNumber;
import ch.sbb.exportservice.job.prm.platform.entity.PlatformVersion;
import ch.sbb.exportservice.job.prm.platform.model.PlatformVersionCsvModel;
import ch.sbb.exportservice.util.MapperUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import org.junit.jupiter.api.Test;

public class PlatformVersionCsvProcessorTest {

  private final PlatformVersionCsvProcessor processor = new PlatformVersionCsvProcessor();

  @Test
  void shouldMapToCsvModel() {
    LocalDateTime creationDate = LocalDateTime.now();
    LocalDateTime editionDate = LocalDateTime.now();
    PlatformVersion entity = PlatformVersion.builder()
        .id(1L)
        .sloid("ch:1:sloid:112:23")
        .parentServicePointSloid("ch:1:sloid:112")
        .parentNumberServicePoint(ServicePointNumber.ofNumberWithoutCheckDigit(8500112))
        .boardingDevice(BoardingDeviceAttributeType.LIFTS)
        .adviceAccessInfo("[Shuttle]")
        .additionalInformation("Somit ist ein Niveaugleicher Einstieg gesichert.")
        .contrastingAreas(BooleanOptionalAttributeType.YES)
        .dynamicAudio(BasicAttributeType.YES)
        .dynamicVisual(BasicAttributeType.YES)
        .height(2.000)
        .inclination(2.000)
        .inclinationLongitudinal(2.000)
        .inclinationWidth(0.000)
        .infoOpportunities(Collections.singleton(InfoOpportunityAttributeType.TO_BE_COMPLETED))
        .infoOpportunitiesPipeList("infoOpportunitiesPipeList")
        .levelAccessWheelchair(BasicAttributeType.YES)
        .partialElevation(false)
        .superElevation(0.000)
        .tactileSystems(BooleanOptionalAttributeType.YES)
        .vehicleAccess(VehicleAccessAttributeType.TO_BE_COMPLETED)
        .wheelchairAreaLength(0.000)
        .wheelchairAreaWidth(0.000)
        .vehicleAccess(VehicleAccessAttributeType.TO_BE_COMPLETED)
        .validFrom(LocalDate.of(2020, 1, 1))
        .validTo(LocalDate.of(2020, 12, 31))
        .creationDate(creationDate)
        .editionDate(editionDate)
        .status(Status.VALIDATED)
        .build();

    PlatformVersionCsvModel expected = PlatformVersionCsvModel.builder()
        .sloid("ch:1:sloid:112:23")
        .parentSloidServicePoint("ch:1:sloid:112")
        .parentNumberServicePoint(8500112)
        .boardingDevice(BoardingDeviceAttributeType.LIFTS.toString())
        .adviceAccessInfo("[Shuttle]")
        .additionalInformation("Somit ist ein Niveaugleicher Einstieg gesichert.")
        .contrastingAreas(BooleanOptionalAttributeType.YES.toString())
        .dynamicAudio(BasicAttributeType.YES.toString())
        .dynamicVisual(BasicAttributeType.YES.toString())
        .height(2.000)
        .inclination(2.000)
        .inclinationLongitudinal(2.000)
        .inclinationWidth(0.000)
        .infoOpportunities("infoOpportunitiesPipeList")
        .levelAccessWheelchair(BasicAttributeType.YES.toString())
        .partialElevation(false)
        .superElevation(0.000)
        .tactileSystems(BooleanOptionalAttributeType.YES.toString())
        .vehicleAccess(VehicleAccessAttributeType.TO_BE_COMPLETED.toString())
        .wheelChairAreaLength(0.000)
        .wheelChairAreaWidth(0.000)
        .vehicleAccess(VehicleAccessAttributeType.TO_BE_COMPLETED.toString())
        .validFrom(MapperUtil.DATE_FORMATTER.format(LocalDate.of(2020, 1, 1)))
        .validTo(MapperUtil.DATE_FORMATTER.format(LocalDate.of(2020, 12, 31)))
        .creationDate(MapperUtil.LOCAL_DATE_FORMATTER.format(creationDate))
        .editionDate(MapperUtil.LOCAL_DATE_FORMATTER.format(editionDate))
        .status(Status.VALIDATED)
        .build();

    PlatformVersionCsvModel result = processor.process(entity);

    assertThat(result).isEqualTo(expected);
  }

}
