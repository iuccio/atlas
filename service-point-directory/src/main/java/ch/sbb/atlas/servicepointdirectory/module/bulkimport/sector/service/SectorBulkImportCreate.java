package ch.sbb.atlas.servicepointdirectory.module.bulkimport.sector.service;

import ch.sbb.atlas.api.servicepoint.sector.CreateSectorVersionModel;
import ch.sbb.atlas.imports.bulk.BulkImportUpdateContainer;
import ch.sbb.atlas.imports.model.create.SectorCreateCsvModel;
import ch.sbb.atlas.servicepointdirectory.module.bulkimport.servicepoint.mapper.GeolocationBulkImportCreateDataMapper;

public class SectorBulkImportCreate extends
    GeolocationBulkImportCreateDataMapper<SectorCreateCsvModel, CreateSectorVersionModel> {

  public static CreateSectorVersionModel apply(
      BulkImportUpdateContainer<SectorCreateCsvModel> bulkImportContainer) {
    return new SectorBulkImportCreate().applyCreate(bulkImportContainer,
        new CreateSectorVersionModel());
  }

  @Override
  protected void applySpecificCreate(SectorCreateCsvModel create,
      CreateSectorVersionModel createModel) {
    createModel.setSectorGeolocation(applyGeolocationUpdate(create));
  }
}
