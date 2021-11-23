package ch.sbb.atlas.versioning.service;

import ch.sbb.atlas.versioning.model.Versionable;
import ch.sbb.atlas.versioning.model.VersionedObject;
import java.util.List;

public interface VersionableService {

  <T extends Versionable> List<VersionedObject> versioningObjects(Versionable current,
      Versionable edited,
      List<T> currentVersions);

}