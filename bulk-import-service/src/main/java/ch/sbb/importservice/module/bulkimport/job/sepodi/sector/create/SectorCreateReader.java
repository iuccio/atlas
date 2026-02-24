package ch.sbb.importservice.module.bulkimport.job.sepodi.sector.create;

import ch.sbb.atlas.imports.bulk.BulkImportUpdateContainer;
import ch.sbb.atlas.imports.model.create.SectorCreateCsvModel;
import ch.sbb.importservice.module.bulkimport.reader.BulkImportItemReader;
import ch.sbb.importservice.module.bulkimport.reader.ReaderUtil;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SectorCreateReader extends SectorCreate implements BulkImportItemReader {

  @Override
  public List<BulkImportUpdateContainer<?>> apply(File file) {
    List<BulkImportUpdateContainer<SectorCreateCsvModel>> sectorCreateCsvModels = ReaderUtil.readAndValidate(file,
        SectorCreateCsvModel.class);
    return new ArrayList<>(sectorCreateCsvModels);
  }

  @Override
  public Class<?> getCsvModelClass() {
    return SectorCreateCsvModel.class;
  }

}
