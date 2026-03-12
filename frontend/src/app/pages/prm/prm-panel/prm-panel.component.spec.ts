import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrmPanelComponent } from './prm-panel.component';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { PRM_REDUCED_TABS, PRM_TABS, PrmTabs } from './prm-tabs';
import { STOP_POINT, STOP_POINT_COMPLETE } from '../util/stop-point-test-data';
import { BERN_WYLEREGG } from '../../../../test/data/service-point';
import { BusinessOrganisationService } from '../../../api/service/bodi/business-organisation.service';
import { PrmRecordingObligationComponent } from '../../../core/prm-recording-obligation/prm-recording-obligation.component';
import { MockPrmRecordingObligationComponent } from '../../../app.testing.mocks';
import { AppTestingModule } from '../../../app.testing.module';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';

const activatedRouteMock = {
  data: of({ stopPoints: [STOP_POINT], servicePoints: [BERN_WYLEREGG] }),
};

describe('PrmPanelComponent', () => {
  let component: PrmPanelComponent;
  let fixture: ComponentFixture<PrmPanelComponent>;
  let boService: Mocked<Pick<BusinessOrganisationService, 'getVersions'>>;

  beforeEach(() => {
    boService = {
      getVersions: vi.fn(),
    };
    boService.getVersions.mockReturnValue(EMPTY);

    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BusinessOrganisationService, useValue: boService },
      ],
    }).overrideComponent(PrmPanelComponent, {
      remove: {
        imports: [PrmRecordingObligationComponent],
      },
      add: {
        imports: [MockPrmRecordingObligationComponent],
      },
    });

    fixture = TestBed.createComponent(PrmPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initTabs when stopPoint does not exists', () => {
    component.initTabs([]);

    expect(component.disableTabNavigation).toBeTruthy();
    expect(component.tabs).toEqual([PrmTabs.STOP_POINT]);
  });

  it('should initTabs when stopPoint isReduced', () => {
    component.tabs = PRM_TABS;
    component.initTabs([STOP_POINT]);

    expect(component.disableTabNavigation).toBeFalsy();
    expect(component.tabs).toEqual(PRM_REDUCED_TABS);
  });

  it('should initTabs when stopPoint isComplete', () => {
    component.tabs = PRM_TABS;
    component.initTabs([STOP_POINT_COMPLETE]);

    expect(component.disableTabNavigation).toBeFalsy();
    expect(component.tabs).toEqual(PRM_TABS);
  });
});
