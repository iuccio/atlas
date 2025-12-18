package ch.sbb.workflow.module.lidi.tth.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.client.user.administration.UserAdministrationClient;
import ch.sbb.atlas.api.user.administration.PermissionModel;
import ch.sbb.atlas.api.user.administration.TransportCompanyDossierAnswerPermissionRestrictionModel;
import ch.sbb.atlas.api.user.administration.UserModel;
import ch.sbb.atlas.kafka.model.user.admin.ApplicationType;
import ch.sbb.atlas.model.controller.IntegrationTest;
import ch.sbb.atlas.model.exception.SimpleAtlasException;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@IntegrationTest
class BoContactPermissionServiceTest {

  @MockitoBean
  private UserAdministrationClient userAdministrationClient;

  @Autowired
  private BoContactPermissionService boContactPermissionService;

  @Test
  void shouldNotThrowExceptionWhenPermissionIsValid() {
    when(userAdministrationClient.getUserByMail(any())).thenReturn(UserModel.builder()
        .permissions(Set.of(PermissionModel.builder()
            .application(ApplicationType.TIMETABLE_HEARING)
            .permissionRestrictions(List.of(new TransportCompanyDossierAnswerPermissionRestrictionModel(true)))
            .build()))
        .build());

    assertThatNoException().isThrownBy(
        () -> boContactPermissionService.checkPermissionForBoContactMail("john.doe@sbb.ch"));
  }

  @Test
  void shouldThrowExceptionWhenPermissionIsNotValid() {
    when(userAdministrationClient.getUserByMail(any())).thenReturn(UserModel.builder()
        .permissions(Set.of(PermissionModel.builder()
            .application(ApplicationType.TIMETABLE_HEARING)
            .permissionRestrictions(List.of(new TransportCompanyDossierAnswerPermissionRestrictionModel(false)))
            .build()))
        .build());

    assertThatExceptionOfType(SimpleAtlasException.class).isThrownBy(
        () -> boContactPermissionService.checkPermissionForBoContactMail("john.doe@sbb.ch"));
  }
}
