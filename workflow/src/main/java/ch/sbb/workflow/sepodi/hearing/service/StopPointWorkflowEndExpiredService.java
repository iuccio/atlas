package ch.sbb.workflow.sepodi.hearing.service;

import ch.sbb.atlas.api.servicepoint.ReadServicePointVersionModel;
import ch.sbb.atlas.workflow.model.WorkflowStatus;
import ch.sbb.workflow.entity.Person;
import ch.sbb.workflow.sepodi.hearing.enity.Decision;
import ch.sbb.workflow.sepodi.hearing.enity.StopPointWorkflow;
import ch.sbb.workflow.sepodi.hearing.mail.StopPointWorkflowNotificationService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class StopPointWorkflowEndExpiredService {

  private final DecisionService decisionService;
  private final SePoDiClientService sePoDiClientService;
  private final StopPointWorkflowNotificationService notificationService;
  private final StopPointWorkflowService stopPointWorkflowService;

  /**
   * Authorization for this method is delegated to ServicePointService#update()
   */
  public void endExpiredWorkflows() {
    log.info("###### Start close expired workflows in Hearing ######");
    List<StopPointWorkflow> expiredWorkflows = getExpiredWorkflows();
    expiredWorkflows.forEach(stopPointWorkflow -> {
      Set<Decision> decisions = new HashSet<>(decisionService.findDecisionByWorkflowId(stopPointWorkflow.getId()));
      if (decisions.stream().noneMatch(Decision::hasWeightedJudgementTypeNo)) {
        log.info("#### Found Expired workflow without JudgmentType.NO to close: [id:{},startDate:{},endDate:{},status:{}]",
            stopPointWorkflow.getId(), stopPointWorkflow.getStartDate(), stopPointWorkflow.getEndDate(),
            stopPointWorkflow.getStatus());
        ReadServicePointVersionModel readServicePointVersionModel =
            sePoDiClientService.updateStopPointStatusToValidatedAsAdminForJob(stopPointWorkflow);
        if (readServicePointVersionModel != null) {
          endExpiredWorkflow(stopPointWorkflow, decisions);
        }
      }
    });
    log.info("###### End close expired workflows in Hearing! ######");
  }

  private void endExpiredWorkflow(StopPointWorkflow stopPointWorkflow, Set<Decision> decisions) {
    List<Person> examiants = getExamiantsToVote(stopPointWorkflow, decisions);
    examiants.forEach(stopPointWorkflowService::voteExpiredWorkflowDecision);
    notificationService.sendApprovedStopPointWorkflowMail(stopPointWorkflow);
    stopPointWorkflow.setStatus(WorkflowStatus.APPROVED);
    if (stopPointWorkflow.getEndDate().plusDays(1).isBefore(LocalDate.now())) {
      stopPointWorkflow.setEndDate(LocalDate.now());
    }
    stopPointWorkflowService.save(stopPointWorkflow);
    log.info("#### Expired workflow without JudgmentType.NO successfully closed: [id:{},startDate:{},endDate:{},status:{}]",
        stopPointWorkflow.getId(), stopPointWorkflow.getStartDate(), stopPointWorkflow.getEndDate(),
        stopPointWorkflow.getStatus());
  }

  public List<StopPointWorkflow> getExpiredWorkflows() {
    List<StopPointWorkflow> workflowsInHearing = stopPointWorkflowService.findWorkflowsInHearing();
    log.info("## Found {} in Hearing...", workflowsInHearing.size());
    List<StopPointWorkflow> expiredWorkflows = workflowsInHearing.stream()
        .filter(stopPointWorkflow -> stopPointWorkflow.getEndDate().isBefore(LocalDate.now())).toList();
    log.info("## Found {} workflow(s) expired ...", expiredWorkflows.size());
    return expiredWorkflows;
  }

  private List<Person> getExamiantsToVote(StopPointWorkflow stopPointWorkflow, Set<Decision> decisions) {
    List<Person> examiants = new ArrayList<>(stopPointWorkflow.getExaminants().stream().toList());
    List<Person> examinantVotedPersonIds = new ArrayList<>(decisions.stream().map(Decision::getExaminant).toList());
    List<Person> overriderVotedPersonIds = new ArrayList<>(decisions.stream().map(Decision::getFotOverrider).toList());
    examiants.removeIf(examinantVotedPersonIds::contains);
    examiants.removeIf(overriderVotedPersonIds::contains);
    examiants.forEach(person ->
        log.info("### Found following examinant without vote: id:{}, mail:{}", person.getId(), person.getMail()));
    return examiants;
  }

}
