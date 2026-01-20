package ch.sbb.line.directory.module.tth.client;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.line.directory.configuration.OAuthFeignConfig;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "workflowClient", url = "${atlas.client.gateway.url}", path = "workflow", configuration =
    OAuthFeignConfig.class)
public interface WorkflowClient {

  String DOSSIER_API = "internal/tth/dossier";

  @GetMapping(DOSSIER_API + "/statementIdsFromStatus")
  List<Long> getStatementIdsFromDossierStatus(@RequestParam List<DossierStatus> dossierStatus);

  @PostMapping(DOSSIER_API + "/closing-year-status")
  void patchDossierStatusClosingYear();
}