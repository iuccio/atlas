package ch.sbb.workflow.module.lidi.tth.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.sbb.atlas.api.client.line.workflow.TimetableHearingStatementClient;
import ch.sbb.atlas.api.timetable.hearing.enumeration.HearingStatus;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.kafka.model.SwissCanton;
import ch.sbb.atlas.model.controller.BaseControllerApiTest;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossierYear;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierRepository;
import ch.sbb.workflow.module.lidi.tth.repository.TthDossierYearRepository;
import ch.sbb.workflow.module.lidi.tth.service.BoContactPermissionService;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

class TthDossierApiInternalControllerTest extends BaseControllerApiTest {

  private final TthDossierRepository tthDossierRepository;
  private final TthDossierYearRepository tthDossierYearRepository;

  @MockitoBean
  private BoContactPermissionService boContactPermissionService;

  @MockitoBean
  private TimetableHearingStatementClient TimetableHearingStatementClient;

  @Autowired
  TthDossierApiInternalControllerTest(TthDossierRepository tthDossierRepository,
      TthDossierYearRepository tthDossierYearRepository) {
    this.tthDossierRepository = tthDossierRepository;
    this.tthDossierYearRepository = tthDossierYearRepository;
  }

  @BeforeEach
  void setUp() {
    TthDossierYear tthDossierYear = TthDossierYear.builder()
        .timetableYear(2024L)
        .hearingStatus(HearingStatus.ACTIVE)
        .build();
    tthDossierYearRepository.save(tthDossierYear);
    TthDossier tthDossier =
        TthDossier.builder().topic("TOPIC").statementIds(List.of(1001L)).swissCanton(SwissCanton.AARGAU).dossierStatus(
            DossierStatus.ADDED).tthDossierYear(tthDossierYear).build();
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

  @Test
  void shouldAllowCreationWithoutQuestion() throws Exception {
    //when
    mvc.perform(post("/internal/tth/dossier")
            .contentType("application/json")
            .content("""
                {
                  "topic": "no question",
                  "statementIds": [123],
                  "swissCanton": "BERN",
                  "questions": []
                }
                """))
        .andExpect(status().isOk());
  }
}
