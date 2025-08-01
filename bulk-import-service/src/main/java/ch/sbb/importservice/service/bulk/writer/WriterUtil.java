package ch.sbb.importservice.service.bulk.writer;

import ch.sbb.atlas.imports.BulkImportItemExecutionResult;
import ch.sbb.atlas.imports.bulk.BulkImportLogEntry;
import ch.sbb.atlas.imports.bulk.BulkImportLogEntry.BulkImportStatus;
import ch.sbb.atlas.imports.bulk.BulkImportUpdateContainer;
import ch.sbb.importservice.entity.BulkImport;
import java.util.List;
import lombok.experimental.UtilityClass;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.item.Chunk;

@UtilityClass
public class WriterUtil {

  public static <T> List<BulkImportUpdateContainer<T>> getContainersWithoutDataValidationErrors(
      Chunk<? extends BulkImportUpdateContainer<?>> items) {
    return items.getItems().stream()
        .map(i -> (BulkImportUpdateContainer<T>) i)
        .filter(i -> !i.hasDataValidationErrors())
        .toList();
  }

  public static <T> void mapExecutionResultToLogEntry(List<BulkImportItemExecutionResult> executionResults,
      List<BulkImportUpdateContainer<T>> containers) {
    containers.forEach(updateContainer -> {
      BulkImportItemExecutionResult correspondingResult = executionResults.stream()
          .filter(i -> i.getLineNumber() == updateContainer.getLineNumber()).findFirst().orElseThrow();
      updateContainer.setBulkImportLogEntry(BulkImportLogEntry.builder()
          .lineNumber(updateContainer.getLineNumber())
          .status(correspondingResult.isSuccess() ? BulkImportStatus.SUCCESS :
              correspondingResult.isInfo() ? BulkImportStatus.INFO : BulkImportStatus.DATA_EXECUTION_ERROR)
          .errors(correspondingResult.getErrors())
          .build());
    });
  }

  public static <T> void addInNameOfTo(StepExecution stepExecution, List<BulkImportUpdateContainer<T>> updateContainers) {
    String inNameOf = stepExecution.getJobExecution().getJobParameters().getString(BulkImport.Fields.inNameOf);
    updateContainers.forEach(updateContainer -> updateContainer.setInNameOf(inNameOf));
  }
}
