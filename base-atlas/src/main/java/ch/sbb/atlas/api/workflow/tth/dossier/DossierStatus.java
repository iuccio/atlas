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

  public static final Set<DossierStatus> ALLOWED_STATUSES_FOR_COMPLETE = Collections.unmodifiableSet(
      EnumSet.of(CANCELED, ACCEPTED, REJECTED, MOVED, DISSOLVED));
  public static final Set<DossierStatus> UNEDITABLE_STATEMENTS = Collections.unmodifiableSet(
      EnumSet.of(ADDED, DOSSIER_BO_CHECK, DOSSIER_CANTON_CHECK, ACCEPTED, REJECTED, MOVED));
  public static final Set<DossierStatus> UNEDITABLE_DOSSIERS = Collections.unmodifiableSet(
      EnumSet.of(DOSSIER_BO_CHECK, DISSOLVED, CANCELED));
}
