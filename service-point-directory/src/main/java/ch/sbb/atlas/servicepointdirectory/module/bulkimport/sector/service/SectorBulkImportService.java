package ch.sbb.atlas.servicepointdirectory.module.bulkimport.sector.service;

import ch.sbb.atlas.api.servicepoint.sector.CreateSectorVersionModel;
import ch.sbb.atlas.imports.bulk.BulkImportUpdateContainer;
import ch.sbb.atlas.imports.model.create.SectorCreateCsvModel;
import ch.sbb.atlas.user.administration.security.aspect.RunAsUser;
import ch.sbb.atlas.user.administration.security.aspect.RunAsUserParameter;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Getter
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SectorBulkImportService {

  private final SectorApiClient sectorApiClient;

  @RunAsUser
  public void createSectorByUserName(@RunAsUserParameter String userName,
      BulkImportUpdateContainer<SectorCreateCsvModel> bulkImportContainer) {
    log.info("Create versions in name of the user: {}", userName);
    createSector(bulkImportContainer);
  }

  public void createSector(BulkImportUpdateContainer<SectorCreateCsvModel> bulkImportContainer) {
    CreateSectorVersionModel createModel = SectorBulkImportCreate.apply(bulkImportContainer);
    sectorApiClient.createTrafficPoint(createModel);
  }

}
