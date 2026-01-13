package ch.sbb.line.directory.module.tth.client;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.line.directory.configuration.OAuthFeignConfig;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;

@FeignClient(name = "workflowClient", url = "${atlas.client.gateway.url}", path = "workflow", configuration =
    OAuthFeignConfig.class)
public interface WorkflowClient {

  @GetMapping("internal/tth/dossier/statementIdsFromStatus")
  List<Long> getStatementIdsFromStatus(List<DossierStatus> dossierStatus);

  @PatchMapping("internal/tth/dossier/closing-year-status")
  void patchDossierStatusClosingYear();

}
