package ch.sbb.atlas.servicepointdirectory.module.bulkimport.sector.service;

import ch.sbb.atlas.api.servicepoint.sector.CreateSectorVersionModel;
import ch.sbb.atlas.servicepointdirectory.module.sector.api.SectorApiV1;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class SectorApiClient {

  private final SectorApiV1 sectorApiV1;

  public void createSectorVersion(CreateSectorVersionModel createSectorVersionModel) {
    sectorApiV1.createSectorVersion(createSectorVersionModel);
  }

}
