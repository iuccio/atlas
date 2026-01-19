package ch.sbb.atlas.api.workflow.tth.dossier;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

@Schema(enumAsRef = true)
public enum DossierStatus {
  ADDED,
  CANCELED,
  DOSSIER_BO_CHECK,
  DOSSIER_CANTON_CHECK,
  ACCEPTED,
  REJECTED,
  MOVED,
  DISSOLVED,

  ;

  private static final Set<DossierStatus> UNEDITABLE_STATEMENTS = Collections.unmodifiableSet(
      EnumSet.of(ADDED, DOSSIER_BO_CHECK, DOSSIER_CANTON_CHECK, ACCEPTED, REJECTED, MOVED));
  private static final Set<DossierStatus> ALLOWED_STATUSES_FOR_COMPLETE = Collections.unmodifiableSet(
      EnumSet.of(CANCELED, ACCEPTED, REJECTED, MOVED, DISSOLVED));
  private static final Set<DossierStatus> ALLOWED_STATUSES_FOR_UPDATE = Collections.unmodifiableSet(
      EnumSet.of(ACCEPTED, REJECTED, MOVED));
  private static final Set<DossierStatus> EDITABLE_DOSSIERS = Collections.unmodifiableSet(
      EnumSet.of(ADDED, DOSSIER_CANTON_CHECK, ACCEPTED, REJECTED, MOVED));

  public boolean isAllowedForCompleteTransition() {
    return ALLOWED_STATUSES_FOR_COMPLETE.contains(this);
  }

  public boolean isAllowedForUpdate() {
    return ALLOWED_STATUSES_FOR_UPDATE.contains(this);
  }

  public boolean isDossierEditable() {
    return EDITABLE_DOSSIERS.contains(this);
  }

  public boolean forbidsUpdatesOnStatements() {
    return UNEDITABLE_STATEMENTS.contains(this);
  }
}
