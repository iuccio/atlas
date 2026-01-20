package ch.sbb.workflow.module.lidi.tth.api;

import ch.sbb.atlas.api.AtlasApiConstants;
import ch.sbb.atlas.api.model.Container;
import ch.sbb.atlas.api.timetable.hearing.model.BatchUpdateTimetableHearingStatementsModel;
import ch.sbb.atlas.api.workflow.tth.dossier.BoAnswerModel;
import ch.sbb.atlas.api.workflow.tth.dossier.DossierStatus;
import ch.sbb.atlas.api.workflow.tth.dossier.TthDossierModel;
import ch.sbb.atlas.configuration.Role;
import ch.sbb.workflow.module.lidi.tth.entity.TthDossier;
import ch.sbb.workflow.module.lidi.tth.search.TthDossierRequestParams;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springdoc.core.converters.models.PageableAsQueryParam;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import java.util.List;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = AtlasApiConstants.INTERNAL_API_TAG_PREFIX + "TTH Dossier")
@RequestMapping(TthDossierApiInternal.BASE_PATH)
public interface TthDossierApiInternal {

  String BASE_PATH = "/internal/tth/dossier";

  @GetMapping
  @PageableAsQueryParam
  Container<TthDossierModel> getDossiers(@Parameter(hidden = true) @PageableDefault(sort = {TthDossier.Fields.id,
      TthDossier.Fields.topic}) Pageable pageable, @ParameterObject TthDossierRequestParams requestParams);

  @GetMapping("{dossierId}")
  TthDossierModel getDossier(@PathVariable Long dossierId);

  @PostMapping
  TthDossierModel createDossier(@Valid @RequestBody TthDossierModel dossierModel);

  @PostMapping("{dossierId}/send-to-bo")
  void sendDossierToBo(@PathVariable Long dossierId);

  @PostMapping("/answer/{questionId}")
  void answerQuestion(@PathVariable Long questionId, @Valid @RequestBody BoAnswerModel boAnswer);

  @PostMapping("{dossierId}/complete/{status}")
  void completeDossier(@PathVariable Long dossierId, @PathVariable DossierStatus status);

  @PutMapping("{dossierId}")
  TthDossierModel updateDossier(@PathVariable Long dossierId, @Valid @RequestBody TthDossierModel dossierModel);

  @Secured(Role.SECURED_FOR_ATLAS_ADMIN)
  @GetMapping("statementIdsFromStatus")
  List<Long> getStatementIdsFromStatus(@RequestParam List<DossierStatus> dossierStatus);

  @Secured(Role.SECURED_FOR_ATLAS_ADMIN)
  @GetMapping("statementBatchUpdateFromAddedDossiers")
  List<BatchUpdateTimetableHearingStatementsModel> getBatchUpdateOfAddedDossiersForStatements();

  @Secured(Role.SECURED_FOR_ATLAS_ADMIN)
  @PostMapping("closing-year-status")
  void patchDossierStatusClosingYear();
}