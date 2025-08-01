package ch.sbb.importservice.controller;

import ch.sbb.atlas.imports.bulk.BulkImportRequest;
import ch.sbb.atlas.imports.bulk.model.BusinessObjectType;
import ch.sbb.atlas.imports.bulk.model.ImportType;
import ch.sbb.atlas.kafka.model.user.admin.ApplicationType;
import ch.sbb.importservice.model.BulkImportResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Bulk Import")
@RequestMapping("v1/import/bulk")
public interface BulkImportApiV1 {

  // ATLAS-2634: File-Upload with specific firewall rule. Be aware when changing the path!
  @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
  @ResponseStatus(HttpStatus.ACCEPTED)
  @ApiResponses(value = {
      @ApiResponse(responseCode = "202"),
  })
  @PreAuthorize("@bulkImportUserAdministrationService.hasPermissionsForBulkImport(#bulkImportRequest.importType, "
      + "#bulkImportRequest.applicationType)")
  void startBulkImport(
      @Parameter(description = "Bulk Import Request")
      @RequestPart("bulkImportRequest") @Valid BulkImportRequest bulkImportRequest,
      @Parameter(description = "File to upload") @RequestPart(value = "file")
      @Schema(type = "string", format = "binary") MultipartFile file);

  @GetMapping("template/{applicationType}/{objectType}/{importType}")
  @Operation(summary = "Download bulk import template",
      description = "Downloads a template file for the specified business object type and import type")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Template file successfully downloaded"),
      @ApiResponse(responseCode = "404", description = "Template not found"),
      @ApiResponse(responseCode = "500", description = "Internal server error")
  })
  ResponseEntity<Resource> downloadTemplate(@PathVariable ApplicationType applicationType,
      @PathVariable BusinessObjectType objectType,
      @PathVariable ImportType importType);

  @GetMapping("{id}")
  BulkImportResult getBulkImportResults(@PathVariable Long id);

}
