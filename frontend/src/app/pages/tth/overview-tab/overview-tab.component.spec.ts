import { OverviewTabComponent } from './overview-tab.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewToTabShareDataService } from './service/overview-to-tab-share-data.service';
import { HearingStatus } from '../../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Pages } from '../../pages';

describe('OverviewTabComponent', () => {
  let component: OverviewTabComponent;
  let fixture: ComponentFixture<OverviewTabComponent>;
  let routerEventsSubject: Subject<Event>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [OverviewTabComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { canton: 'ch' },
            },
            firstChild: {
              snapshot: {
                data: { hearingStatus: HearingStatus.Active },
              },
            },
          },
        },
        OverviewToTabShareDataService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewTabComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define two tabs with correct links and titles', () => {
    expect(component.TABS.length).toBe(2);

    expect(component.TABS[0]).toEqual({
      link: Pages.TTH_STATEMENTS.path,
      title: 'TTH.TAB.STATEMENTS',
    });

    expect(component.TABS[1]).toEqual({
      link: Pages.TTH_DOSSIERS.path,
      title: 'TTH.TAB.DOSSIERS',
    });
  });
});
