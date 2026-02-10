package ch.sbb.exportservice.job.sepodi.trafficpoint.service;

import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_TRAFFIC_POINT_ELEMENT_CSV_JOB_NAME;
import static ch.sbb.exportservice.util.JobDescriptionConstant.EXPORT_TRAFFIC_POINT_ELEMENT_JSON_JOB_NAME;

import ch.sbb.exportservice.job.BaseExportJobService;
import ch.sbb.exportservice.job.BaseExportType;
import ch.sbb.exportservice.model.ExportObjectV2;
import java.util.List;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class ExportTrafficPointElementJobService extends BaseExportJobService {

  public ExportTrafficPointElementJobService(
      JobOperator jobOperator,
      @Qualifier(EXPORT_TRAFFIC_POINT_ELEMENT_CSV_JOB_NAME) Job exportTrafficPointElementCsvJob,
      @Qualifier(EXPORT_TRAFFIC_POINT_ELEMENT_JSON_JOB_NAME) Job exportTrafficPointElementJsonJob) {
    super(jobOperator, exportTrafficPointElementCsvJob, exportTrafficPointElementJsonJob);
  }

  @Override
  protected List<JobParams> getExportTypes() {
    return BaseExportType.WORLD;
  }

  @Override
  public ExportObjectV2 getExportObject() {
    return ExportObjectV2.TRAFFIC_POINT;
  }

}
