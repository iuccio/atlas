package ch.sbb.workflow.sepodi.termination.api;

import ch.sbb.workflow.sepodi.termination.model.StartTerminationStopPointWorkflowModel;
import ch.sbb.workflow.sepodi.termination.model.TerminationDecisionModel;
import ch.sbb.workflow.sepodi.termination.model.TerminationInfoModel;
import ch.sbb.workflow.sepodi.termination.model.TerminationStopPointWorkflowModel;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Tag(name = "TerminationStopPointWorkflow")
@RequestMapping("internal/termination-stop-point/workflows")
public interface TerminationStopPointWorkflowApi {

  @GetMapping("{id}")
  TerminationStopPointWorkflowModel getTerminationStopPointWorkflow(@PathVariable Long id);

  @GetMapping("/termination-info/{sloid}")
  TerminationInfoModel getTerminationInfoBySloid(@PathVariable String sloid);

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201")})
  TerminationStopPointWorkflowModel startTerminationStopPointWorkflow(
      @RequestBody @Valid StartTerminationStopPointWorkflowModel workflowModel);

  @PreAuthorize(
      "@servicePointTerminationBasedUserAdministrationService.hasUserInfoPlusTerminationVotePermission()")
  @PostMapping(path = "/decision/info-plus/{workflowId}")
  @ResponseStatus(HttpStatus.CREATED)
  TerminationStopPointWorkflowModel decisionInfoPlus(@RequestBody @Valid TerminationDecisionModel decisionModel,
      @PathVariable Long workflowId);

  @PreAuthorize(
      "@servicePointTerminationBasedUserAdministrationService.hasUserNovaTerminationVotePermission()")
  @PostMapping(path = "/decision/nova/{workflowId}")
  @ResponseStatus(HttpStatus.CREATED)
  TerminationStopPointWorkflowModel decisionNova(@RequestBody @Valid TerminationDecisionModel decisionModel,
      @PathVariable Long workflowId);

  //TODO: cancelTermination for each case
}
