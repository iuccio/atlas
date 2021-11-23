package ch.sbb.atlas.versioning.engine;

import static ch.sbb.atlas.versioning.version.VersioningHelper.areValidToAndValidFromNotEdited;

import ch.sbb.atlas.versioning.convert.ConverterHelper;
import ch.sbb.atlas.versioning.merge.MergeHelper;
import ch.sbb.atlas.versioning.model.Entity;
import ch.sbb.atlas.versioning.model.ToVersioning;
import ch.sbb.atlas.versioning.model.Versionable;
import ch.sbb.atlas.versioning.model.VersionableProperty;
import ch.sbb.atlas.versioning.model.VersionedObject;
import ch.sbb.atlas.versioning.version.Versioning;
import ch.sbb.atlas.versioning.version.VersioningWhenValidFromAndValidToAreNotEdited;
import ch.sbb.atlas.versioning.version.VersioningWhenValidToAndValidFromAreEdited;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class VersioningEngine {

  public <T extends Versionable> List<VersionedObject> applyVersioning(
      Versionable currentVersion, Versionable editedVersion,
      List<T> currentVersions, List<VersionableProperty> versionableProperties) {

    //2. get edited properties from editedVersion
    Entity editedEntity = ConverterHelper.convertToEditedEntity(currentVersion, editedVersion, versionableProperties
    );

    //3. collect all versions to versioning in ToVersioning object
    List<ToVersioning> objectsToVersioning = ConverterHelper.convertAllObjectsToVersioning(
        currentVersions, versionableProperties);
    //Temporal sort objects versioning
    objectsToVersioning.sort(Comparator.comparing(o -> o.getVersionable().getValidFrom()));

    Versioning versioning;
    List<VersionedObject> versionedObjects = new ArrayList<>();
    if (areValidToAndValidFromNotEdited(editedVersion, currentVersion)) {
      //update actual version
      log.info("ValidFrom and ValidTo are not edited.");
      versioning = new VersioningWhenValidFromAndValidToAreNotEdited();
      versionedObjects.addAll(versioning.applyVersioning(currentVersion,
          editedEntity, objectsToVersioning));
    } else {
      log.info("ValidFrom and/or ValidTo are edited.");
      versioning = new VersioningWhenValidToAndValidFromAreEdited();
      versionedObjects.addAll(versioning.applyVersioning(editedVersion,
          currentVersion, editedEntity, objectsToVersioning
      ));
    }
    return MergeHelper.mergeVersionedObject(versionedObjects);
  }


}
