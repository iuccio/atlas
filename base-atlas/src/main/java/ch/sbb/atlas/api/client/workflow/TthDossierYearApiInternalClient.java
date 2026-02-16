package ch.sbb.atlas.api.client.workflow;

import ch.sbb.atlas.api.client.TokenPassingFeignClientConfig;
import ch.sbb.atlas.api.workflow.TthYearApiInternal;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "tthDossierYearClient", url = "${atlas.client.gateway.url}", path = "workflow",
    configuration = TokenPassingFeignClientConfig.class)
public interface TthDossierYearApiInternalClient extends TthYearApiInternal {

}
