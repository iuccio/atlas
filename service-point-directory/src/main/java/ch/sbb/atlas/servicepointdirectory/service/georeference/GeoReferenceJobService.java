package ch.sbb.atlas.servicepointdirectory.service.georeference;

import static ch.sbb.atlas.servicepointdirectory.model.UpdateGeoLocationResultContainer.mapToCurrentVersionDataRages;
import static ch.sbb.atlas.servicepointdirectory.model.UpdateGeoLocationResultContainer.mapToUpdatedVersionDataRages;
import static ch.sbb.atlas.servicepointdirectory.service.georeference.ServicePointGeoLocationUtils.hasDiffServicePointGeolocation;

import ch.sbb.atlas.api.servicepoint.GeoReference;
import ch.sbb.atlas.api.servicepoint.ReadServicePointVersionModel;
import ch.sbb.atlas.servicepointdirectory.entity.ServicePointVersion;
import ch.sbb.atlas.servicepointdirectory.entity.geolocation.ServicePointGeolocation;
import ch.sbb.atlas.servicepointdirectory.model.UpdateGeoLocationResultContainer;
import ch.sbb.atlas.servicepointdirectory.service.servicepoint.ServicePointService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeoReferenceJobService {

  private final GeoReferenceService geoReferenceService;
  private final ServicePointService servicePointService;

  public UpdateGeoLocationResultContainer updateGeoLocation(Long id) {
    ServicePointVersion servicePointVersionToUpdate = servicePointService.getServicePointVersionById(id);
    ServicePointGeolocation currentServicePointGeolocation = servicePointVersionToUpdate.getServicePointGeolocation();
    ServicePointGeolocation updatedServicePointGeolocation = getGeoReferenceInformation(currentServicePointGeolocation);

    if (hasDiffServicePointGeolocation(currentServicePointGeolocation, updatedServicePointGeolocation)) {

      List<ServicePointVersion> currentVersions = servicePointService.findAllByNumberOrderByValidFrom(
          servicePointVersionToUpdate.getNumber());
      ServicePointVersion editedVersion = servicePointVersionToUpdate.toBuilder()
          .servicePointGeolocation(updatedServicePointGeolocation)
          .validFrom(LocalDate.now())
          .build();
      List<ReadServicePointVersionModel> updatedServicePointVersionModels =
          servicePointService.updateAndPublish(servicePointVersionToUpdate, editedVersion, currentVersions);

      return UpdateGeoLocationResultContainer.builder()
          .currentServicePointGeolocation(currentServicePointGeolocation)
          .updatedServicePointGeolocation(updatedServicePointGeolocation)
          .id(servicePointVersionToUpdate.getId())
          .sloid(servicePointVersionToUpdate.getSloid())
          .updatedVersionsDataRange(mapToUpdatedVersionDataRages(updatedServicePointVersionModels))
          .currentVersionsDataRange(mapToCurrentVersionDataRages(currentVersions))
          .build();
    }
    return null;
  }

  private ServicePointGeolocation getGeoReferenceInformation(ServicePointGeolocation servicePointGeolocationToUpdate) {
    GeoReference geoReference = geoReferenceService.getGeoReference(servicePointGeolocationToUpdate.asCoordinatePair(),
        servicePointGeolocationToUpdate.getHeight() == null);
    return servicePointGeolocationToUpdate
        .toBuilder()
        .height(geoReference.getHeight() != null ? geoReference.getHeight() : servicePointGeolocationToUpdate.getHeight())
        .country(geoReference.getCountry())
        .swissCanton(geoReference.getSwissCanton())
        .swissDistrictNumber(geoReference.getSwissDistrictNumber())
        .swissDistrictName(geoReference.getSwissDistrictName())
        .swissMunicipalityNumber(geoReference.getSwissMunicipalityNumber())
        .swissMunicipalityName(geoReference.getSwissMunicipalityName())
        .swissLocalityName(geoReference.getSwissLocalityName())
        .build();
  }

}