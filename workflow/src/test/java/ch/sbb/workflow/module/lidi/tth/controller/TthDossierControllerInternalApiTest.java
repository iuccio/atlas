package ch.sbb.workflow.module.lidi.tth.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.kafka.model.SwissCanton;
import ch.sbb.atlas.model.controller.BaseControllerApiTest;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class TthDossierControllerInternalApiTest extends BaseControllerApiTest {

  private final TthDossierRepository tthDossierRepository;

  @Autowired
  public TthDossierControllerInternalApiTest(
      TthDossierRepository tthDossierRepository) {
    this.tthDossierRepository = tthDossierRepository;
  }

  @BeforeEach
  void setUp() {
    TthDossier tthDossier =
        TthDossier.builder().topic("TOPIC").statementIds(List.of(1001L)).swissCanton(SwissCanton.AARGAU).dossierStatus(
            DossierStatus.ADDED).build();
    tthDossierRepository.saveAndFlush(tthDossier);
  }

  @AfterEach
  void tearDown() {
    tthDossierRepository.deleteAll();
  }

  @Test
  void shouldGetTthDossierOverview() throws Exception {
    //when
    mvc.perform(get("/internal/tth/dossier")
            .queryParam("page", "0")
            .queryParam("size", "5")
            .queryParam("sort", "id,asc"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalCount").value(1))
        .andExpect(jsonPath("$.objects", hasSize(1)));
  }
}
