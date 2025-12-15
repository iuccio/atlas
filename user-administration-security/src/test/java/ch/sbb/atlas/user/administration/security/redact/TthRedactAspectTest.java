package ch.sbb.atlas.user.administration.security.redact;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.kafka.model.user.admin.ApplicationType;
import ch.sbb.atlas.user.administration.security.redact.entity.DummyTthDossier;
import ch.sbb.atlas.user.administration.security.service.CantonBasedUserAdministrationService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.jupiter.api.Test;

class TthRedactAspectTest {

  private final CantonBasedUserAdministrationService cantonBasedUserAdministrationService =
      mock(CantonBasedUserAdministrationService.class);

  private final TthRedactAspect aspect = new TthRedactAspect(cantonBasedUserAdministrationService);

  private final ProceedingJoinPoint joinPoint = mock(ProceedingJoinPoint.class);

  @Test
  void shouldRedactStatementCorrectly() {
    // given
    DummyTthDossier sensitiveDossier = DummyTthDossier.builder()
        .dossierStatus(DossierStatus.ADDED)
        .internalComment("empty")
        .build();

    DummyTthDossier redactedDossier = DummyTthDossier.builder()
        .dossierStatus(DossierStatus.ADDED)
        .internalComment("*****")
        .build();

    // when & then
    Object redactObject = TthRedactAspect.redactObject(sensitiveDossier);
    assertThat(redactObject).usingRecursiveComparison().isEqualTo(redactedDossier);
  }

  @Test
  void shouldReturnUnredactedResultWhenUserMayReadPrivateInfo() throws Throwable {
    // given
    DummyTthDossier sensitiveDossier = DummyTthDossier.builder()
        .dossierStatus(DossierStatus.ADDED)
        .internalComment("empty")
        .build();

    when(joinPoint.proceed()).thenReturn(sensitiveDossier);
    when(cantonBasedUserAdministrationService
        .isAtLeastExplicitReader(ApplicationType.TIMETABLE_HEARING))
        .thenReturn(true);

    // when
    Object result = aspect.redactSensitiveDataForTthReader(joinPoint);

    // then
    assertThat(result).isSameAs(sensitiveDossier);
    verify(cantonBasedUserAdministrationService)
        .isAtLeastExplicitReader(ApplicationType.TIMETABLE_HEARING);
  }
}
