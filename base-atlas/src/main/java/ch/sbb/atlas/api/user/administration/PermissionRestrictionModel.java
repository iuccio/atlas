package ch.sbb.atlas.api.user.administration;

import ch.sbb.atlas.api.user.administration.workflow.InfoPlusTerminationVotePermissionRestrictionModel;
import ch.sbb.atlas.api.user.administration.workflow.NovaTerminationVotePermissionRestrictionModel;
import ch.sbb.atlas.kafka.model.user.admin.PermissionRestrictionType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@RequiredArgsConstructor
@SuperBuilder
@Schema(name = "PermissionRestriction")
@JsonTypeInfo(
    use = Id.NAME,
    include = As.EXISTING_PROPERTY,
    property = "type")
@JsonSubTypes({
    @Type(value = SboidPermissionRestrictionModel.class, name = "BUSINESS_ORGANISATION"),
    @Type(value = CantonPermissionRestrictionModel.class, name = "CANTON"),
    @Type(value = CountryPermissionRestrictionModel.class, name = "COUNTRY"),
    @Type(value = BulkImportPermissionRestrictionModel.class, name = "BULK_IMPORT"),
    @Type(value = NovaTerminationVotePermissionRestrictionModel.class, name = "NOVA_TERMINATION_VOTE"),
    @Type(value = InfoPlusTerminationVotePermissionRestrictionModel.class, name = "INFO_PLUS_TERMINATION_VOTE")
})
public abstract class PermissionRestrictionModel<T> {

  protected final PermissionRestrictionType type;

  @JsonIgnore
  public abstract T getValue();

  public abstract String getValueAsString();

  public abstract void setValueAsString(String value);

}
