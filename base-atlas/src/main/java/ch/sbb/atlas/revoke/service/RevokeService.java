package ch.sbb.atlas.revoke.service;

import static java.util.Comparator.comparing;

import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.model.exception.Sid4ptNotFoundException;
import ch.sbb.atlas.revoke.Revokable;
import ch.sbb.atlas.revoke.exception.TerminationNotAllowedWhenVersionInReview;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public abstract class RevokeService<T extends Revokable> {

  protected List<T> revoke(String sid4pt) {
    List<T> versionRevokables = findBySid4ptOrderByValidFrom(sid4pt);
    if (versionRevokables.isEmpty()) {
      throw new Sid4ptNotFoundException(sid4pt);
    }
    checkIsInReview(sid4pt, versionRevokables);
    //make sure the versions are sorted by validity since we only need to shorten the validity of the latest version
    List<T> sortedRevokableVersions = versionRevokables.stream().sorted(comparing(Revokable::getValidFrom)).toList();
    sortedRevokableVersions.forEach(version -> version.setStatus(Status.REVOKED));
    Revokable lastVersions = sortedRevokableVersions.getLast();
    lastVersions.setValidTo(lastVersions.getValidFrom());

    saveAll(sortedRevokableVersions);
    return sortedRevokableVersions;
  }

  void checkIsInReview(String sid4pt, List<T> versionRevokables) {
    boolean isInReview = versionRevokables.stream().anyMatch(p -> p.getStatus() == Status.IN_REVIEW);
    if (isInReview) {
      throw new TerminationNotAllowedWhenVersionInReview(sid4pt);
    }
  }

  protected abstract List<T> findBySid4ptOrderByValidFrom(String sid4pt);

  protected abstract void saveAll(List<T> versionRevokables);

}
