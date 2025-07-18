package ch.sbb.workflow.sepodi.hearing.api;

import ch.sbb.atlas.api.model.Container;
import ch.sbb.atlas.configuration.Role;
import ch.sbb.workflow.sepodi.hearing.enity.StopPointWorkflow;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.AddExaminantsModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.DecisionModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.EditStopPointWorkflowModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.OtpRequestModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.OtpVerificationModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.OverrideDecisionModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.ReadDecisionModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.ReadStopPointWorkflowModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.StopPointAddWorkflowModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.StopPointClientPersonModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.StopPointRejectWorkflowModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.StopPointRestartWorkflowModel;
import ch.sbb.workflow.sepodi.hearing.model.sepodi.StopPointWorkflowRequestParams;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springdoc.core.converters.models.PageableAsQueryParam;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Tag(name = "StopPointWorkflow")
@RequestMapping("v1/stop-point/workflows")
public interface StopPointWorkflowApiV1 {

  @GetMapping("{servicePointVersionId}/examinants")
  List<StopPointClientPersonModel> getExaminants(@PathVariable Long servicePointVersionId);

  @GetMapping("{id}")
  ReadStopPointWorkflowModel getStopPointWorkflow(@PathVariable Long id);

  @GetMapping
  @PageableAsQueryParam
  Container<ReadStopPointWorkflowModel> getStopPointWorkflows(
      @Parameter(hidden = true) @PageableDefault(sort = {StopPointWorkflow.Fields.sloid,
          StopPointWorkflow.Fields.versionValidFrom}) Pageable pageable,
      @ParameterObject StopPointWorkflowRequestParams stopPointWorkflowRequestParams);

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201")})
  ReadStopPointWorkflowModel addStopPointWorkflow(@RequestBody @Valid StopPointAddWorkflowModel workflowModel);

  @PostMapping(path = "/start/{id}")
  ReadStopPointWorkflowModel startStopPointWorkflow(@PathVariable Long id);

  @PostMapping(path = "/edit/{id}")
  ReadStopPointWorkflowModel editStopPointWorkflow(@PathVariable Long id,
      @RequestBody @Valid EditStopPointWorkflowModel workflowModel);

  @PostMapping(path = "/add-examinants/{id}")
  void addExaminantsToStopPointWorkflow(@PathVariable Long id, @RequestBody @Valid AddExaminantsModel addExaminantsModel);

  @PostMapping(path = "/reject/{id}")
  ReadStopPointWorkflowModel rejectStopPointWorkflow(@PathVariable Long id,
      @RequestBody @Valid StopPointRejectWorkflowModel workflowModel);

  @ResponseStatus(HttpStatus.ACCEPTED)
  @ApiResponses(value = {@ApiResponse(responseCode = "202")})
  @PostMapping(path = "/obtain-otp/{id}")
  void obtainOtp(@PathVariable Long id, @RequestBody @Valid OtpRequestModel otpRequest);

  @PostMapping(path = "/verify-otp/{id}")
  StopPointClientPersonModel verifyOtp(@PathVariable Long id, @RequestBody @Valid OtpVerificationModel otpVerification);

  @PostMapping(path = "/decisions/{personId}")
  ReadDecisionModel getDecision(@PathVariable Long personId);

  @PostMapping(path = "/vote/{id}/{personId}")
  void voteWorkflow(@PathVariable Long id, @PathVariable Long personId, @RequestBody @Valid DecisionModel decisionModel);

  @PostMapping(path = "/override-vote/{id}/{personId}")
  void overrideVoteWorkflow(@PathVariable Long id, @PathVariable Long personId,
      @RequestBody @Valid OverrideDecisionModel decisionModel);

  @PostMapping(path = "/restart/{id}")
  ReadStopPointWorkflowModel restartStopPointWorkflow(@PathVariable Long id,
      @RequestBody @Valid StopPointRestartWorkflowModel restartWorkflowModel);

  @PostMapping(path = "/cancel/{id}")
  ReadStopPointWorkflowModel cancelStopPointWorkflow(@PathVariable Long id,
      @RequestBody @Valid StopPointRejectWorkflowModel stopPointCancelWorkflowModel);

  @PostMapping(path = "/end-expired")
  @Secured(Role.SECURED_FOR_ATLAS_ADMIN)
  @Operation(description = "End all expired workflow")
  void endExpiredWorkflows();

}
