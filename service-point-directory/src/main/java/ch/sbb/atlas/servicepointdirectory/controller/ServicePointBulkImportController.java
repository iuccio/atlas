package ch.sbb.atlas.servicepointdirectory.controller;

import ch.sbb.atlas.api.servicepoint.ServicePointBulkImportApiV1;
import ch.sbb.atlas.imports.BulkImportItemExecutionResult;
import ch.sbb.atlas.imports.bulk.BaseBulkImportControllerInternal;
import ch.sbb.atlas.imports.bulk.BulkImportUpdateContainer;
import ch.sbb.atlas.imports.model.ServicePointUpdateCsvModel;
import ch.sbb.atlas.imports.model.create.ServicePointCreateCsvModel;
import ch.sbb.atlas.imports.model.terminate.ServicePointTerminateCsvModel;
import ch.sbb.atlas.servicepointdirectory.service.servicepoint.bulk.ServicePointBulkImportService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ServicePointBulkImportController extends BaseBulkImportControllerInternal implements ServicePointBulkImportApiV1 {

  private final ServicePointBulkImportService servicePointBulkImportService;

  @Override
  @PreAuthorize("""
      @bulkImportUserAdministrationService.hasPermissionsForBulkImport(T(ch.sbb.atlas.imports.bulk.model.ImportType).UPDATE,
      T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).SEPODI)""")
  public List<BulkImportItemExecutionResult> bulkImportUpdate(
      List<BulkImportUpdateContainer<ServicePointUpdateCsvModel>> bulkImportContainers) {
    return executeBulkImport(bulkImportContainers,
        servicePointBulkImportService::updateServicePointByUserName,
        servicePointBulkImportService::updateServicePoint);
  }

  @Override
  @PreAuthorize("""
      @bulkImportUserAdministrationService.hasPermissionsForBulkImport(T(ch.sbb.atlas.imports.bulk.model.ImportType).CREATE,
      T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).SEPODI)""")
  public List<BulkImportItemExecutionResult> bulkImportCreate(
      List<BulkImportUpdateContainer<ServicePointCreateCsvModel>> bulkImportContainers) {
    return executeBulkImport(bulkImportContainers,
        servicePointBulkImportService::createServicePointByUserName,
        servicePointBulkImportService::createServicePoint);
  }

  @Override
  @PreAuthorize("""
      @bulkImportUserAdministrationService.hasPermissionsForBulkImport(T(ch.sbb.atlas.imports.bulk.model.ImportType).TERMINATE,
      T(ch.sbb.atlas.kafka.model.user.admin.ApplicationType).SEPODI)""")
  public List<BulkImportItemExecutionResult> bulkImportTerminate(
      List<BulkImportUpdateContainer<ServicePointTerminateCsvModel>> bulkImportContainers) {
    return executeBulkImport(bulkImportContainers,
        servicePointBulkImportService::terminateServicePointByUserName,
        servicePointBulkImportService::terminateServicePoint);
  }
}
