import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { LineRecord } from './model/line-record';
import {
  LineVersionWorkflow,
  WorkflowProcessingStatus,
} from '../../api';
import { WorkflowDialogService } from './dialog/workflow-dialog.service';
import { LineInternalService } from '../../api/service/lidi/line-internal.service';
import { NgIf } from '@angular/common';
import { AtlasButtonComponent } from '../components/button/atlas-button.component';

@Component({
  selector: 'app-workflow [lineRecord]',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
  imports: [NgIf, AtlasButtonComponent],
})
export class WorkflowComponent implements OnInit, OnChanges {
  @Input() lineRecord!: LineRecord;
  @Input() descriptionForWorkflow!: string;

  @Output() workflowEvent = new EventEmitter<void>();

  workflowInProgress = false;
  workflowId: number | undefined;

  constructor(
    private readonly lineInternalService: LineInternalService,
    private readonly workflowDialogService: WorkflowDialogService
  ) {}

  ngOnInit(): void {
    this.initWorkflowButtons();
  }

  ngOnChanges() {
    this.initWorkflowButtons();
  }

  initWorkflowButtons() {
    const workflowsInProgress = this.filterWorkflowsInProgress();
    if (workflowsInProgress.length === 0) {
      this.workflowInProgress = false;
    } else if (workflowsInProgress.length === 1) {
      const workflowId = workflowsInProgress[0].workflowId;
      if (workflowId) {
        this.workflowInProgress = true;
      }
    }
  }

  private filterWorkflowsInProgress() {
    const lineVersionWorkflows: LineVersionWorkflow[] = [];
    this.lineRecord.lineVersionWorkflows?.forEach((lvw) =>
      lineVersionWorkflows.push(lvw)
    );
    return lineVersionWorkflows.filter(
      (lvw) =>
        lvw.workflowProcessingStatus === WorkflowProcessingStatus.InProgress
    );
  }

  newWorkflow() {
    this.workflowDialogService
      .openNew(this.lineRecord, this.descriptionForWorkflow)
      .subscribe((workflowEvent) => {
        if (workflowEvent) {
          this.workflowEvent.emit();
        }
      });
  }

  openWorkflow() {
    this.workflowDialogService
      .openExisting(this.lineRecord, this.descriptionForWorkflow)
      .subscribe((workflowEvent) => {
        if (workflowEvent) {
          this.workflowEvent.emit();
        }
      });
  }

  skipWorkflow() {
    this.lineInternalService
      .skipWorkflow(this.lineRecord.id!)
      .subscribe(() => this.workflowEvent.emit());
  }
}
