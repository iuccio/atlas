package ch.sbb.importservice.module.bulkimport.client;

import ch.sbb.atlas.api.client.TokenPassingFeignClientConfig;
import ch.sbb.atlas.api.servicepoint.SectorBulkImportApi;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "sectorBulkImportClient", url = "${atlas.client.gateway.url}", path = "service-point-directory",
    configuration = TokenPassingFeignClientConfig.class)
public interface SectorBulkImportClient extends SectorBulkImportApi {

}
