package ch.sbb.atlas.api.client.line.workflow;

import ch.sbb.atlas.api.client.TokenPassingFeignClientConfig;
import ch.sbb.atlas.api.timetable.hearing.TimetableHearingYearApiInternal;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "timetableHearingYearClient", url = "${atlas.client.gateway.url}", path = "line-directory",
    configuration = TokenPassingFeignClientConfig.class)
public interface TimetableHearingYearApiInternalClient extends TimetableHearingYearApiInternal {

}