import { Component, Input } from '@angular/core';
import { HearingStatus, TimetableHearingYear } from '../../../../api';
import { Pages } from '../../../pages';
import { DisplayDatePipe } from '../../../../core/pipe/display-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'atlas-timetable-hearing-overview-tab-heading',
  templateUrl: './overview-tab-heading.component.html',
  styleUrls: ['./overview-tab-heading.component.scss'],
  imports: [DisplayDatePipe, TranslatePipe, NgOptimizedImage],
})
export class OverviewTabHeadingComponent {
  @Input() cantonShort!: string;
  @Input() foundTimetableHearingYear!: TimetableHearingYear;
  @Input() hearingStatus!: HearingStatus;
  @Input() noTimetableHearingYearFound!: boolean;
  @Input() noPlannedTimetableHearingYearFound!: boolean;

  get isHearingStatusActive() {
    return this.hearingStatus.toLowerCase() === Pages.TTH_STATEMENTS.path;
  }

  get isHearingStatusPlanned() {
    return this.hearingStatus.toLowerCase() === Pages.TTH_PLANNED.path;
  }

  get isHearingStatusArchived() {
    return this.hearingStatus.toLowerCase() === Pages.TTH_ARCHIVED.path;
  }
}
