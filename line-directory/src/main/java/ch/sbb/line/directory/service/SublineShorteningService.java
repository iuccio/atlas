package ch.sbb.line.directory.service;

import ch.sbb.atlas.api.lidi.AffectedSublinesModel;
import ch.sbb.atlas.model.DateRange;
import ch.sbb.line.directory.entity.LineVersion;
import ch.sbb.line.directory.entity.SublineVersion;
import ch.sbb.line.directory.model.AffectedSublinesData;
import ch.sbb.line.directory.model.LineVersionRange;
import ch.sbb.line.directory.model.SublineVersionRange;
import ch.sbb.line.directory.repository.LineVersionRepository;
import ch.sbb.line.directory.repository.SublineVersionRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SublineShorteningService {

  private final SublineVersionRepository sublineVersionRepository;
  private final LineVersionRepository lineVersionRepository;

  public AffectedSublinesModel checkAffectedSublines(LineVersion lineVersion, LineVersion editedVersion) {
    List<String> allowedSublines = new ArrayList<>();
    List<String> notAllowedSublines = new ArrayList<>();

    if (isOnlyValidityChanged(lineVersion, editedVersion) && isShortening(lineVersion, editedVersion)) {

      List<LineVersion> lineVersions = getAllLineVersionsBySlnid(lineVersion.getSlnid());
      LineVersionRange lineVersionRange = getOldestAndLatestLineVersion(lineVersion.getSlnid());

      Map<String, List<SublineVersion>> sublineVersions = getAllSublinesByMainlineSlnid(lineVersion.getSlnid());

      AffectedSublinesData data = AffectedSublinesData.builder()
          .lineVersion(lineVersion)
          .editedVersion(editedVersion)
          .lineVersionRange(lineVersionRange)
          .sublineVersions(sublineVersions)
          .allowedSublines(allowedSublines)
          .notAllowedSublines(notAllowedSublines)
          .build();

      if (!isSublineVersionsEmpty(sublineVersions)) {
        if (lineVersions.size() > 1) {
          processLineVersion(data);
        } else if (lineVersions.size() == 1) {
          processSingleLineVersion(data);
        }
      }
    }

    boolean isAffectedSublinesEmpty = isAffectedSublinesEmpty(allowedSublines, notAllowedSublines);
    boolean hasAllowedSublinesOnly = hasAllowedSublinesOnly(allowedSublines);
    boolean hasNotAllowedSublinesOnly = hasNotAllowedSublinesOnly(notAllowedSublines);

    return AffectedSublinesModel.builder()
        .allowedSublines(allowedSublines)
        .notAllowedSublines(notAllowedSublines)
        .isAffectedSublinesEmpty(isAffectedSublinesEmpty)
        .hasAllowedSublinesOnly(hasAllowedSublinesOnly)
        .hasNotAllowedSublinesOnly(hasNotAllowedSublinesOnly)
        .build();
  }

  private void processLineVersion(AffectedSublinesData data) {
    boolean isOnlyValidToChanged = isOnlyValidToChanged(data.getLineVersion(), data.getEditedVersion());
    boolean isOnlyValidFromChanged = isOnlyValidFromChanged(data.getLineVersion(), data.getEditedVersion());

    if (isOnlyValidFromChanged && !isOnlyValidToChanged &&
        isMatchingVersion(data.getLineVersion(), data.getLineVersionRange().getOldestVersion())) {
      processSublineVersionsValidFrom(data);
    } else if (!isOnlyValidFromChanged && isOnlyValidToChanged &&
        isMatchingVersion(data.getLineVersion(), data.getLineVersionRange().getLatestVersion())) {
      processSublineVersionsValidTo(data);
    }
  }

  private boolean isSublineShorteningAllowed(LineVersion editedVersion, SublineVersionRange range, int versionCount) {
    if (versionCount == 1) {
      return true;
    }
    return isShorteningAllowedValidFrom(editedVersion, range) && isShorteningAllowedValidTo(editedVersion, range);
  }

  private boolean isMatchingVersion(LineVersion currentLineVersion, LineVersion lineVersionFromRange) {
    return Objects.equals(currentLineVersion.getId(), lineVersionFromRange.getId());
  }

  private void processSingleLineVersion(AffectedSublinesData data) {
    for (List<SublineVersion> sublineVersions : data.getSublineVersions().values()) {
      String slnid = getSlnidSubline(sublineVersions);
      SublineVersionRange range = getOldestAndLatestSublineVersion(slnid);
      if (isSublineValidityAffectedByUpdatedMainline(data.getEditedVersion().getValidFrom(),
          data.getEditedVersion().getValidTo(), range)) {
        if (isSublineShorteningAllowed(data.getEditedVersion(), range, sublineVersions.size())) {
          data.getAllowedSublines().add(slnid);
        } else {
          data.getNotAllowedSublines().add(slnid);
        }
      }
    }
  }

  private void processSublineVersionsValidFrom(AffectedSublinesData data) {
    for (List<SublineVersion> sublineVersions : data.getSublineVersions().values()) {
      String slnid = getSlnidSubline(sublineVersions);
      SublineVersionRange sublineVersionRange = getOldestAndLatestSublineVersion(slnid);

      if (isSublineValidityAffectedByUpdatedMainline(data.getEditedVersion().getValidFrom(),
          data.getEditedVersion().getValidTo(), sublineVersionRange)) {
        if (isShorteningAllowedValidFrom(data.getEditedVersion(), sublineVersionRange)) {
          data.getAllowedSublines().add(sublineVersionRange.getLatestVersion().getSlnid());
        } else {
          data.getNotAllowedSublines().add(sublineVersionRange.getLatestVersion().getSlnid());
        }
      }
    }
  }

  private void processSublineVersionsValidTo(AffectedSublinesData data) {
    for (List<SublineVersion> sublineVersions : data.getSublineVersions().values()) {
      String slnid = getSlnidSubline(sublineVersions);

      SublineVersionRange range = getOldestAndLatestSublineVersion(slnid);
      if (isSublineValidityAffectedByUpdatedMainline(data.getEditedVersion().getValidFrom(), data.getEditedVersion().getValidTo(),
          range)) {
        if (isShorteningAllowedValidTo(data.getEditedVersion(), range)) {
          data.getAllowedSublines().add(range.getLatestVersion().getSlnid());
        } else {
          data.getNotAllowedSublines().add(range.getLatestVersion().getSlnid());
        }
      }
    }
  }

  private List<SublineVersionRange> prepareSublinesToShort(LineVersion lineVersion, LineVersion editedVersion,
      List<String> sublinesToShort) {

    List<SublineVersionRange> sublinesToUpdate = new ArrayList<>();
    List<LineVersion> lineVersions = getAllLineVersionsBySlnid(lineVersion.getSlnid());
    LineVersionRange lineVersionRange = getOldestAndLatestLineVersion(lineVersion.getSlnid());

    boolean isOnlyValidToChanged = isOnlyValidToChanged(lineVersion, editedVersion);
    boolean isOnlyValidFromChanged = isOnlyValidFromChanged(lineVersion, editedVersion);

    if (lineVersions.size() == 1 && isBothValidityChanged(lineVersion, editedVersion)) {
      for (String sublineSlnid : sublinesToShort) {
        processBothValidityChanged(sublineSlnid, lineVersion, editedVersion, sublinesToUpdate);
      }
    }

    if (isMatchingVersion(lineVersion, lineVersionRange.getOldestVersion()) && isOnlyValidFromChanged) {
      for (String sublineSlnid : sublinesToShort) {
        processOnlyValidFromChanged(sublineSlnid, editedVersion, sublinesToUpdate);
      }
    }

    if (isMatchingVersion(lineVersion, lineVersionRange.getLatestVersion()) && isOnlyValidToChanged) {
      for (String sublineSlnid : sublinesToShort) {
        processOnlyValidToChanged(sublineSlnid, editedVersion, sublinesToUpdate);
      }
    }

    return sublinesToUpdate;
  }

  private void processBothValidityChanged(String sublineSlnid, LineVersion lineVersion, LineVersion editedVersion,
      List<SublineVersionRange> sublinesToUpdate) {

    List<SublineVersion> sublineVersions = findAllSublineVersionsBySlnid(sublineSlnid);
    SublineVersionRange sublineVersionRange = getOldestAndLatestSublineVersion(sublineSlnid);

    if (sublineVersions.size() > 1) {
      if (isShorteningValidFrom(lineVersion, editedVersion)) {
        SublineVersion oldVersion = cloneSublineVersion(sublineVersionRange.getOldestVersion());
        SublineVersion oldVersionEdit = cloneSublineVersion(sublineVersionRange.getOldestVersion());
        oldVersionEdit.setValidFrom(editedVersion.getValidFrom());
        sublinesToUpdate.add(new SublineVersionRange(oldVersion, oldVersionEdit));
      }
      if (isShorteningValidTo(lineVersion, editedVersion)) {
        SublineVersion latestVersion = cloneSublineVersion(sublineVersionRange.getLatestVersion());
        SublineVersion latestVersionEdit = cloneSublineVersion(sublineVersionRange.getLatestVersion());
        latestVersionEdit.setValidTo(editedVersion.getValidTo());
        sublinesToUpdate.add(new SublineVersionRange(latestVersion, latestVersionEdit));
      }
    } else {
      SublineVersion sublineVersion = cloneSublineVersion(sublineVersionRange.getOldestVersion());
      SublineVersion editedSublineVersion = cloneSublineVersion(sublineVersionRange.getOldestVersion());
      if (isShorteningValidFrom(lineVersion, editedVersion)) {
        editedSublineVersion.setValidFrom(editedVersion.getValidFrom());
      }
      if (isShorteningValidTo(lineVersion, editedVersion)) {
        editedSublineVersion.setValidTo(editedVersion.getValidTo());
      }
      sublinesToUpdate.add(new SublineVersionRange(sublineVersion, editedSublineVersion));
    }
  }

  private void processOnlyValidFromChanged(String sublineSlnid, LineVersion editedVersion,
      List<SublineVersionRange> sublinesToUpdate) {
    SublineVersionRange sublineVersionRange = getOldestAndLatestSublineVersion(sublineSlnid);

    SublineVersion oldVersion = cloneSublineVersion(sublineVersionRange.getOldestVersion());
    SublineVersion editedSublineVersion = cloneSublineVersion(sublineVersionRange.getOldestVersion());

    editedSublineVersion.setValidFrom(editedVersion.getValidFrom());

    sublinesToUpdate.add(new SublineVersionRange(oldVersion, editedSublineVersion));
  }

  private void processOnlyValidToChanged(String sublineSlnid, LineVersion editedVersion,
      List<SublineVersionRange> sublinesToUpdate) {
    SublineVersionRange sublineVersionRange = getOldestAndLatestSublineVersion(sublineSlnid);

    SublineVersion latestVersion = cloneSublineVersion(sublineVersionRange.getLatestVersion());
    SublineVersion editedSublineVersion = cloneSublineVersion(sublineVersionRange.getLatestVersion());

    editedSublineVersion.setValidTo(editedVersion.getValidTo());
    sublinesToUpdate.add(new SublineVersionRange(latestVersion, editedSublineVersion));
  }

  public List<SublineVersionRange> checkAndPrepareToShortSublines(LineVersion currentVersion, LineVersion editedVersion) {
    boolean isOnlyValidityChanged = isOnlyValidityChanged(currentVersion, editedVersion);
    List<SublineVersionRange> sublinesToShort = new ArrayList<>();

    if (isOnlyValidityChanged) {
      AffectedSublinesModel affectedSublinesModel = checkAffectedSublines(currentVersion, editedVersion);

      if (!affectedSublinesModel.getAllowedSublines().isEmpty()) {
        sublinesToShort = prepareSublinesToShort(currentVersion, editedVersion, affectedSublinesModel.getAllowedSublines());
      }
    }
    return sublinesToShort;
  }

  public boolean isShortening(LineVersion currentVersion, LineVersion editedVersion) {
    return (editedVersion.getValidFrom().isAfter(currentVersion.getValidFrom()) || editedVersion.getValidTo()
        .isBefore(currentVersion.getValidTo()));
  }

  private static boolean isShorteningValidFrom(LineVersion currentVersion, LineVersion editedVersion) {
    return editedVersion.getValidFrom().isAfter(currentVersion.getValidFrom());
  }

  private static boolean isShorteningValidTo(LineVersion currentVersion, LineVersion editedVersion) {
    return editedVersion.getValidTo().isBefore(currentVersion.getValidTo());
  }

  private boolean isShorteningAllowedValidTo(LineVersion editedVersion, SublineVersionRange sublineVersionRange) {
    return (editedVersion.getValidTo().isAfter(sublineVersionRange.getLatestVersion().getValidFrom())
        || editedVersion.getValidTo()
        .isEqual(sublineVersionRange
            .getLatestVersion().getValidFrom()));
  }

  private boolean isShorteningAllowedValidFrom(LineVersion editedVersion, SublineVersionRange sublineVersionRange) {
    return (editedVersion.getValidFrom().isBefore(sublineVersionRange.getOldestVersion().getValidTo())
        || editedVersion.getValidFrom().isEqual(
        sublineVersionRange.getOldestVersion().getValidTo()));
  }

  public Map<String, List<SublineVersion>> getAllSublinesByMainlineSlnid(String mainlineSlnid) {
    List<SublineVersion> sublineVersions = findAllSublineVersionsByMainlineSlnid(mainlineSlnid);
    return sublineVersions.stream()
        .collect(Collectors.groupingBy(SublineVersion::getSlnid));
  }

  private static boolean areNonValidityFieldsEqual(LineVersion current, LineVersion edited) {
    return Objects.equals(edited.getSwissLineNumber(), current.getSwissLineNumber())
        && Objects.equals(edited.getBusinessOrganisation(), current.getBusinessOrganisation())
        && Objects.equals(edited.getComment(), current.getComment())
        && Objects.equals(edited.getConcessionType(), current.getConcessionType())
        && Objects.equals(edited.getOfferCategory(), current.getOfferCategory())
        && Objects.equals(edited.getShortNumber(), current.getShortNumber())
        && Objects.equals(edited.getDescription(), current.getDescription())
        && Objects.equals(edited.getLongName(), current.getLongName())
        && Objects.equals(edited.getNumber(), current.getNumber());
  }

  public boolean isOnlyValidityChanged(LineVersion current, LineVersion edited) {
    boolean validToChanged = !Objects.equals(edited.getValidTo(), current.getValidTo());
    boolean validFromChanged = !Objects.equals(edited.getValidFrom(), current.getValidFrom());
    return (validToChanged || validFromChanged) && areNonValidityFieldsEqual(current, edited);
  }

  private static boolean isBothValidityChanged(LineVersion current, LineVersion edited) {
    boolean validToChanged = !Objects.equals(edited.getValidTo(), current.getValidTo());
    boolean validFromChanged = !Objects.equals(edited.getValidFrom(), current.getValidFrom());
    return (validToChanged && validFromChanged) && areNonValidityFieldsEqual(current, edited);
  }

  private static boolean isOnlyValidToChanged(LineVersion current, LineVersion edited) {
    boolean validToChanged = !Objects.equals(edited.getValidTo(), current.getValidTo());
    boolean validFromUnchanged = Objects.equals(edited.getValidFrom(), current.getValidFrom());
    return validToChanged && validFromUnchanged && areNonValidityFieldsEqual(current, edited);
  }

  private static boolean isOnlyValidFromChanged(LineVersion current, LineVersion edited) {
    boolean validFromChanged = !Objects.equals(edited.getValidFrom(), current.getValidFrom());
    boolean validToUnchanged = Objects.equals(edited.getValidTo(), current.getValidTo());
    return validFromChanged && validToUnchanged && areNonValidityFieldsEqual(current, edited);
  }

  private SublineVersionRange getOldestAndLatestSublineVersion(String slnid) {
    SublineVersion oldestVersion = sublineVersionRepository.findAllBySlnidOrderByValidFrom(slnid).getFirst();
    SublineVersion latestVersion = sublineVersionRepository.findAllBySlnidOrderByValidFrom(slnid).getLast();
    return new SublineVersionRange(oldestVersion, latestVersion);
  }

  private LineVersionRange getOldestAndLatestLineVersion(String slnid) {
    LineVersion oldestVersion = lineVersionRepository.findAllBySlnidOrderByValidFrom(slnid).getFirst();
    LineVersion latestVersion = lineVersionRepository.findAllBySlnidOrderByValidFrom(slnid).getLast();
    return new LineVersionRange(oldestVersion, latestVersion);
  }

  private boolean isSublineVersionsEmpty(Map<String, List<SublineVersion>> sublineVersions) {
    return sublineVersions.isEmpty();
  }

  private boolean isAffectedSublinesEmpty(List<String> allowedSublines, List<String> notAllowedSublines) {
    return allowedSublines.isEmpty() && notAllowedSublines.isEmpty();
  }

  private boolean hasAllowedSublinesOnly(List<String> allowedSublines) {
    return !allowedSublines.isEmpty();
  }

  private boolean hasNotAllowedSublinesOnly(List<String> notAllowedSublines) {
    return !notAllowedSublines.isEmpty();
  }

  private List<LineVersion> getAllLineVersionsBySlnid(String slnid) {
    return lineVersionRepository.findAllBySlnidOrderByValidFrom(slnid);
  }

  private List<SublineVersion> findAllSublineVersionsByMainlineSlnid(String slnid) {
    return sublineVersionRepository.getSublineVersionByMainlineSlnid(slnid);
  }

  private List<SublineVersion> findAllSublineVersionsBySlnid(String slnid) {
    return sublineVersionRepository.findAllBySlnidOrderByValidFrom(slnid);
  }

  private String getSlnidSubline(List<SublineVersion> sublineVersions) {
    return sublineVersions.getFirst().getSlnid();
  }

  private boolean isSublineValidityAffectedByUpdatedMainline(LocalDate validFrom, LocalDate validTo,
      SublineVersionRange sublineVersionRange) {

    DateRange dateRangeSubline = new DateRange(sublineVersionRange.getOldestVersion().getValidFrom(),
        sublineVersionRange.getLatestVersion().getValidTo());
    DateRange dateRangeMainline = new DateRange(validFrom, validTo);

    return !dateRangeSubline.isDateRangeContainedIn(dateRangeMainline);
  }

  private static SublineVersion cloneSublineVersion(SublineVersion sublineVersion) {
    return SublineVersion.builder()
        .slnid(sublineVersion.getSlnid())
        .mainlineSlnid(sublineVersion.getMainlineSlnid())
        .id(sublineVersion.getId())
        .businessOrganisation(sublineVersion.getBusinessOrganisation())
        .longName(sublineVersion.getLongName())
        .sublineType(sublineVersion.getSublineType())
        .concessionType(sublineVersion.getConcessionType())
        .description(sublineVersion.getDescription())
        .swissSublineNumber(sublineVersion.getSwissSublineNumber())
        .validFrom(sublineVersion.getValidFrom())
        .validTo(sublineVersion.getValidTo())
        .creationDate(sublineVersion.getCreationDate())
        .creator(sublineVersion.getCreator())
        .editionDate(sublineVersion.getEditionDate())
        .editor(sublineVersion.getEditor())
        .status(sublineVersion.getStatus())
        .version(sublineVersion.getVersion())
        .build();
  }
}
