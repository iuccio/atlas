package ch.sbb.line.directory.module.ttfn.service;

import ch.sbb.atlas.model.Status;
import ch.sbb.atlas.revoke.service.RevokeService;
import ch.sbb.atlas.versioning.exception.VersioningNoChangesException;
import ch.sbb.atlas.versioning.model.VersionedObject;
import ch.sbb.atlas.versioning.service.VersionableService;
import ch.sbb.line.directory.module.ttfn.entity.TimetableFieldNumber;
import ch.sbb.line.directory.module.ttfn.entity.TimetableFieldNumberVersion;
import ch.sbb.line.directory.module.ttfn.repository.TimetableFieldNumberRepository;
import ch.sbb.line.directory.module.ttfn.repository.TimetableFieldNumberVersionRepository;
import ch.sbb.line.directory.module.ttfn.search.TimetableFieldNumberSearchRestrictions;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.StaleObjectStateException;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class TimetableFieldNumberService extends RevokeService<TimetableFieldNumberVersion> {

  private final TimetableFieldNumberVersionRepository versionRepository;
  private final TimetableFieldNumberRepository timetableFieldNumberRepository;
  private final TimetableFieldNumberValidationService timetableFieldNumberValidationService;
  private final VersionableService versionableService;

  // todo: remove after maintenance execution after prod release of ATLAS-3254
  public int mergeAllVersions() {
    List<TimetableFieldNumberVersion> allVersions = versionRepository.findAll();
    Map<String, List<TimetableFieldNumberVersion>> versionsGroupedByTtfnId = allVersions.stream()
        .sorted(Comparator.comparing(TimetableFieldNumberVersion::getValidFrom))
        .collect(Collectors.groupingBy(TimetableFieldNumberVersion::getTtfnid));
    AtomicInteger mergedElements = new AtomicInteger();
    versionsGroupedByTtfnId.forEach((ttfnid, versionsOfTtfnId) -> {
      if (versionsOfTtfnId.size() == 1) {
        log.info("No merging of versions necessary for element: {}", ttfnid);
        return;
      }
      try {
        List<VersionedObject> versionedObjects = versionableService.versioningObjectsDeletingNullProperties(
            versionsOfTtfnId.getFirst(),
            versionsOfTtfnId.getFirst(),
            versionsOfTtfnId);

        versionableService.applyVersioning(TimetableFieldNumberVersion.class, versionedObjects, this::save, this::deleteById);

        mergedElements.getAndIncrement();
        log.info("Merging of versions done for element: {}", ttfnid);
      } catch (VersioningNoChangesException e) {
        log.info("No merging of versions necessary for element: {}", ttfnid);
      }
    });
    return mergedElements.get();
  }

  public List<TimetableFieldNumberVersion> getAllVersionsVersioned(String ttfnId) {
    return findBySid4ptOrderByValidFrom(ttfnId);
  }

  public List<TimetableFieldNumberVersion> revokeTimetableFieldNumber(String ttfnId) {
    return revoke(ttfnId);
  }

  @Override
  protected List<TimetableFieldNumberVersion> findBySid4ptOrderByValidFrom(String ttfnId) {
    return versionRepository.findBySid4ptOrderByValidFrom(ttfnId);
  }

  @Override
  protected void saveAll(List<TimetableFieldNumberVersion> versionRevokables) {
    versionRepository.saveAll(versionRevokables);
  }

  public Optional<TimetableFieldNumberVersion> findById(Long id) {
    return versionRepository.findById(id);
  }

  @PreAuthorize(
      "@businessOrganisationBasedUserAdministrationService.hasUserPermissionsToCreate(#businessObject, T(ch.sbb.atlas.kafka"
          + ".model.user.admin"
          + ".ApplicationType).TTFN)")
  public TimetableFieldNumberVersion create(TimetableFieldNumberVersion businessObject) {
    return save(businessObject);
  }

  @PreAuthorize(
      "@businessOrganisationBasedUserAdministrationService.hasUserPermissionsToUpdate(#editedVersion, #currentVersions, T(ch"
          + ".sbb.atlas.kafka"
          + ".model.user.admin.ApplicationType).TTFN)")
  public void update(TimetableFieldNumberVersion currentVersion, TimetableFieldNumberVersion editedVersion,
      List<TimetableFieldNumberVersion> currentVersions) {
    editedVersion.setTtfnid(currentVersion.getTtfnid());
    updateVersion(currentVersion, editedVersion);
  }

  public TimetableFieldNumberVersion save(TimetableFieldNumberVersion newVersion) {
    newVersion.setStatus(Status.VALIDATED);
    timetableFieldNumberValidationService.validatePreSave(newVersion);
    return versionRepository.saveAndFlush(newVersion);
  }

  public Page<TimetableFieldNumber> getVersionsSearched(TimetableFieldNumberSearchRestrictions searchRestrictions) {
    log.info("Loading TimetableFieldNumbers with searchRestrictions={}", searchRestrictions);
    return timetableFieldNumberRepository.findAll(searchRestrictions.getSpecification(), searchRestrictions.getPageable());
  }

  public List<TimetableFieldNumberVersion> getVersionsValidAt(Set<String> ttfids, LocalDate validAt) {
    return versionRepository.getVersionsValidAt(ttfids, validAt);
  }

  public void deleteById(Long id) {
    versionRepository.deleteById(id);
  }

  public void updateVersion(TimetableFieldNumberVersion currentVersion,
      TimetableFieldNumberVersion editedVersion) {
    versionRepository.incrementVersion(currentVersion.getTtfnid());
    if (!currentVersion.getVersion().equals(editedVersion.getVersion())) {
      throw new StaleObjectStateException(TimetableFieldNumberVersion.class.getSimpleName(), "version");
    }

    List<TimetableFieldNumberVersion> currentVersions = getAllVersionsVersioned(
        currentVersion.getTtfnid());

    List<VersionedObject> versionedObjects = versionableService.versioningObjectsDeletingNullProperties(currentVersion,
        editedVersion, currentVersions);

    versionableService.applyVersioning(TimetableFieldNumberVersion.class, versionedObjects,
        this::save,
        this::deleteById);
  }

  public void deleteAll(List<TimetableFieldNumberVersion> allVersionsVersioned) {
    versionRepository.deleteAll(allVersionsVersioned);
  }
}
