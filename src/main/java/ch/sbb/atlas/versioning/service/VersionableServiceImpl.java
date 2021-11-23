package ch.sbb.atlas.versioning.service;

import ch.sbb.atlas.versioning.model.Versionable;
import ch.sbb.atlas.versioning.model.VersionableProperty;
import ch.sbb.atlas.versioning.model.VersionedObject;
import ch.sbb.atlas.versioning.annotation.AtlasAnnotationProcessor;
import ch.sbb.atlas.versioning.engine.VersioningEngine;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class VersionableServiceImpl implements VersionableService {

  private final VersioningEngine versioningEngine;
  private final AtlasAnnotationProcessor atlasAnnotationProcessor;

  public VersionableServiceImpl() {
    this.versioningEngine = new VersioningEngine();
    this.atlasAnnotationProcessor = new AtlasAnnotationProcessor();
  }

  @Override
  public <T extends Versionable> List<VersionedObject> versioningObjects(Versionable current,
      Versionable editedVersion,
      List<T> currentVersions) {

    List<VersionableProperty> versionableProperties = atlasAnnotationProcessor.getVersionableProperties(
        current);

    logStarting(current, editedVersion, currentVersions);
    List<VersionedObject> versionedObjects = versioningEngine.applyVersioning(current,
        editedVersion, currentVersions, versionableProperties
    );

    logDone(versionedObjects);
    return versionedObjects;
  }

  private <T extends Versionable> void logStarting(Versionable current, Versionable edited,
      List<T> currentVersions) {
    log.info("Versioning start...");
    log.info("Current version: {}", current);
    log.info("Edited version: {}", edited);
    log.info("Got {} versions to process: {}", currentVersions.size(), currentVersions);
  }

  private void logDone(
      List<VersionedObject> versionedObjects) {
    log.info("Got {} Versioned objects: {}", versionedObjects.size(), versionedObjects);
    log.info("Versioning done.");
  }
}
