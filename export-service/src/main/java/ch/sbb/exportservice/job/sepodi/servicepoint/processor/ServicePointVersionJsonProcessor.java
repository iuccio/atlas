package ch.sbb.exportservice.job.sepodi.servicepoint.processor;

import static ch.sbb.exportservice.util.MapperUtil.getMeansOfTransportSorted;

import ch.sbb.atlas.api.servicepoint.ReadServicePointVersionModel;
import ch.sbb.exportservice.job.sepodi.BaseSepodiProcessor;
import ch.sbb.exportservice.job.sepodi.servicepoint.entity.ServicePointVersion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;

@Slf4j
public class ServicePointVersionJsonProcessor extends BaseSepodiProcessor implements
    ItemProcessor<ServicePointVersion, ReadServicePointVersionModel> {

  @Override
  public ReadServicePointVersionModel process(ServicePointVersion servicePointVersion) {

    return ReadServicePointVersionModel.builder()
        .id(servicePointVersion.getId())
        .number(servicePointVersion.getNumber())
        .sloid(servicePointVersion.getSloid())
        .designationLong(servicePointVersion.getDesignationLong())
        .designationOfficial(servicePointVersion.getDesignationOfficial())
        .abbreviation(servicePointVersion.getAbbreviation())
        .operatingPoint(servicePointVersion.isOperatingPoint())
        .operatingPointWithTimetable(servicePointVersion.isOperatingPointWithTimetable())
        .freightServicePoint(servicePointVersion.isFreightServicePoint())
        .sortCodeOfDestinationStation(servicePointVersion.getSortCodeOfDestinationStation())
        .businessOrganisation(servicePointVersion.getSharedBusinessOrganisation().getBusinessOrganisation())
        .categories(getCategoriesSorted(servicePointVersion))
        .operatingPointType(servicePointVersion.getOperatingPointType())
        .operatingPointTechnicalTimetableType(servicePointVersion.getOperatingPointTechnicalTimetableType())
        .operatingPointRouteNetwork(servicePointVersion.isOperatingPointRouteNetwork())
        .operatingPointKilometerMaster(servicePointVersion.getOperatingPointKilometerMaster())
        .meansOfTransport(getMeansOfTransportSorted(servicePointVersion.getMeansOfTransport()))
        .stopPointType(servicePointVersion.getStopPointType())
        .servicePointGeolocation(servicePointVersion.getServicePointGeolocation() != null ?
            fromEntity(servicePointVersion.getServicePointGeolocation()) : null)
        .status(servicePointVersion.getStatus())
        .validFrom(servicePointVersion.getValidFrom())
        .validTo(servicePointVersion.getValidTo())
        .creationDate(servicePointVersion.getCreationDate())
        .creator(servicePointVersion.getCreator())
        .editionDate(servicePointVersion.getEditionDate())
        .editor(servicePointVersion.getEditor())
        .etagVersion(servicePointVersion.getVersion())
        .build();
  }

}
