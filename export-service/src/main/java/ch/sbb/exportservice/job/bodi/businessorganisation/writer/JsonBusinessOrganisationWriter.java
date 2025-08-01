package ch.sbb.exportservice.job.bodi.businessorganisation.writer;

import ch.sbb.atlas.amazon.service.FileService;
import ch.sbb.atlas.api.bodi.BusinessOrganisationVersionModel;
import ch.sbb.exportservice.job.BaseJsonWriter;
import org.springframework.stereotype.Component;

@Component
public class JsonBusinessOrganisationWriter extends BaseJsonWriter<BusinessOrganisationVersionModel> {

  JsonBusinessOrganisationWriter(FileService fileService) {
    super(fileService);
  }

}
