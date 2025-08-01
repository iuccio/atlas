package ch.sbb.exportservice.job.prm.platform.writer;

import ch.sbb.atlas.amazon.service.FileService;
import ch.sbb.atlas.api.prm.model.platform.ReadPlatformVersionModel;
import ch.sbb.exportservice.job.BaseJsonWriter;
import org.springframework.stereotype.Component;

@Component
public class JsonPlatformVersionWriter extends BaseJsonWriter<ReadPlatformVersionModel> {

  JsonPlatformVersionWriter(FileService fileService) {
    super(fileService);
  }

}