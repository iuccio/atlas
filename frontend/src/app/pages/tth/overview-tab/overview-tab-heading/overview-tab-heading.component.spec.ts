import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewTabHeadingComponent } from './overview-tab-heading.component';
import { AppTestingModule } from '../../../../app.testing.module';
import { HearingStatus } from '../../../../api';
import moment from 'moment';
import { DisplayDatePipe } from '../../../../core/pipe/display-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';

describe('TimetableHearingOverviewTabHeadingComponent', () => {
  let component: OverviewTabHeadingComponent;
  let fixture: ComponentFixture<OverviewTabHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, OverviewTabHeadingComponent, DisplayDatePipe],
      providers: [{ provide: TranslatePipe }],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewTabHeadingComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.cantonShort = 'BE';
    fixture.componentInstance.hearingStatus = HearingStatus.Active;
    fixture.componentInstance.foundTimetableHearingYear = {
      timetableYear: 2000,
      hearingFrom: moment().toDate(),
      hearingTo: moment().toDate(),
    };
    fixture.detectChanges();
  });

  it('should return when hearingStatus is Active', () => {
    component.hearingStatus = HearingStatus.Active;

    expect(component.isHearingStatusActive).toBeTruthy();
  });

  it('should return when hearingStatus is Planned', () => {
    component.hearingStatus = HearingStatus.Planned;

    expect(component.isHearingStatusPlanned).toBeTruthy();
  });

  it('should return when hearingStatus is Archived', () => {
    component.hearingStatus = HearingStatus.Archived;

    expect(component.isHearingStatusArchived).toBeTruthy();
  });
});
