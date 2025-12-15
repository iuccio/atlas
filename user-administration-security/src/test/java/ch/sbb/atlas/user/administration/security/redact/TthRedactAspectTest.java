package ch.sbb.atlas.user.administration.security.redact;

import static org.assertj.core.api.Assertions.assertThat;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.user.administration.security.redact.entity.DummyTthDossier;
import org.junit.jupiter.api.Test;

class TthRedactAspectTest {

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
}
