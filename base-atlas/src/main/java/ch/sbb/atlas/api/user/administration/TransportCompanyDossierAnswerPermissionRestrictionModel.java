package ch.sbb.atlas.api.user.administration;

import ch.sbb.atlas.kafka.model.user.admin.PermissionRestrictionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
public class TransportCompanyDossierAnswerPermissionRestrictionModel extends PermissionRestrictionModel {

  public TransportCompanyDossierAnswerPermissionRestrictionModel() {
    super(PermissionRestrictionType.TRANSPORT_COMPANY_DOSSIER_ANSWER);
  }

  public TransportCompanyDossierAnswerPermissionRestrictionModel(Boolean value) {
    super(PermissionRestrictionType.TRANSPORT_COMPANY_DOSSIER_ANSWER);
    this.value = value;
  }

  @NotNull
  private Boolean value;

  @Override
  public String getValueAsString() {
    return String.valueOf(getValue());
  }

  @Override
  public void setValueAsString(String value) {
    setValue(Boolean.valueOf(value));
  }
}
