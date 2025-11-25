package ch.sbb.atlas.revoke;

import static java.util.Comparator.comparing;

import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.model.exception.Sid4ptNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public abstract class RevokeService<T extends Revokable> {

  protected List<T> revoke(String sid4pt) {
    List<T> versionRevokables = findBySid4ptOrderByValidFrom(sid4pt);
    if (versionRevokables.isEmpty()) {
      throw new Sid4ptNotFoundException(sid4pt);
    }
    //make sure the versions are sorted by validity since we only need to shorten the validity of the latest version
    List<T> sortedRevokableVersions = versionRevokables.stream().sorted(comparing(Revokable::getValidFrom)).toList();
    sortedRevokableVersions.forEach(version -> version.setStatus(Status.REVOKED));
    Revokable lastVersions = sortedRevokableVersions.getLast();
    lastVersions.setValidTo(lastVersions.getValidFrom());

    saveAll(sortedRevokableVersions);
    return sortedRevokableVersions;
  }

  protected abstract List<T> findBySid4ptOrderByValidFrom(String sloid);

  protected abstract void saveAll(List<T> versionRevokables);

}
