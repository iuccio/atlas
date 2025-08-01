package ch.sbb.atlas.servicepointdirectory.controller;

import ch.sbb.atlas.api.servicepoint.TrafficPointBulkImportApiV1;
import ch.sbb.atlas.imports.BulkImportItemExecutionResult;
import ch.sbb.atlas.imports.bulk.BaseBulkImportControllerInternal;
import ch.sbb.atlas.imports.bulk.BulkImportUpdateContainer;
import ch.sbb.atlas.imports.model.TrafficPointUpdateCsvModel;
import ch.sbb.atlas.imports.model.create.TrafficPointCreateCsvModel;
import ch.sbb.atlas.servicepointdirectory.service.trafficpoint.bulk.TrafficPointElementBulkImportService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class TrafficPointElementBulkImportController extends BaseBulkImportControllerInternal implements
    TrafficPointBulkImportApiV1 {

  private final TrafficPointElementBulkImportService trafficPointElementBulkImportService;

  @Override
  @PreAuthorize("""
      @bulkImportUserAdministrationService.hasPermissionsForBulkImport(T(ch.sbb.atlas.imports.bulk.model.ImportType).CREATE,
      T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).SEPODI)""")
  public List<BulkImportItemExecutionResult> bulkImportCreate(
      List<BulkImportUpdateContainer<TrafficPointCreateCsvModel>> bulkImportCreateContainers) {
    return executeBulkImport(bulkImportCreateContainers,
        trafficPointElementBulkImportService::createTrafficPointByUserName,
        trafficPointElementBulkImportService::createTrafficPoint);
  }

  @Override
  @PreAuthorize("""
      @bulkImportUserAdministrationService.hasPermissionsForBulkImport(T(ch.sbb.atlas.imports.bulk.model.ImportType).UPDATE,
      T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).SEPODI)""")
  public List<BulkImportItemExecutionResult> bulkImportUpdate(
      List<BulkImportUpdateContainer<TrafficPointUpdateCsvModel>> bulkImportContainers) {
    return executeBulkImport(bulkImportContainers,
        trafficPointElementBulkImportService::updateTrafficPointByUserName,
        trafficPointElementBulkImportService::updateTrafficPoint);
  }

}
