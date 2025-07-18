package ch.sbb.atlas.user.administration.mapper;

import ch.sbb.atlas.api.user.administration.ClientCredentialModel;
import ch.sbb.atlas.api.user.administration.ClientCredentialPermissionCreateModel;
import ch.sbb.atlas.api.user.administration.PermissionModel;
import ch.sbb.atlas.user.administration.entity.ClientCredentialPermission;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ClientCredentialMapper {

  public static List<ClientCredentialModel> toModel(List<ClientCredentialPermission> clientCredentialPermission) {
    Map<String, List<ClientCredentialPermission>> groupedClients = clientCredentialPermission.stream()
        .collect(Collectors.groupingBy(ClientCredentialPermission::getClientCredentialId));

    return groupedClients.entrySet().stream().map(client -> ClientCredentialModel.builder()
        .clientCredentialId(client.getKey())
        .alias(client.getValue().getFirst().getAlias())
        .comment(client.getValue().getFirst().getComment())
        .permissions(client.getValue().stream().map(permission -> PermissionModel.builder()
            .role(permission.getRole())
            .application(permission.getApplication())
            .permissionRestrictions(
                permission.getPermissionRestrictions().stream().map(PermissionRestrictionMapper::toModel).toList())
            .creationDate(permission.getCreationDate())
            .creator(permission.getCreator())
            .editionDate(permission.getEditionDate())
            .editor(permission.getEditor())
            .build()).collect(Collectors.toSet())
        )
        .build()).toList();
  }

  public static ClientCredentialModel toSingleModel(List<ClientCredentialPermission> clientCredentialPermission) {
    List<ClientCredentialModel> clientCredentialModels = toModel(clientCredentialPermission);
    if (clientCredentialModels.size() != 1) {
      throw new IllegalStateException();
    }
    return clientCredentialModels.getFirst();
  }

  public static ClientCredentialPermission toEntity(PermissionModel permissionModel,
      ClientCredentialPermissionCreateModel editedPermissions) {
    ClientCredentialPermission clientCredentialPermission = ClientCredentialPermission.builder()
        .clientCredentialId(editedPermissions.getClientCredentialId())
        .alias(editedPermissions.getAlias())
        .comment(editedPermissions.getComment())
        .role(permissionModel.getRole())
        .application(permissionModel.getApplication())
        .build();
    clientCredentialPermission.setPermissionRestrictions(
        permissionModel.getPermissionRestrictions().stream()
            .map(restriction -> PermissionRestrictionMapper.toEntity(clientCredentialPermission, restriction))
            .collect(Collectors.toSet()));
    return clientCredentialPermission;
  }

}
