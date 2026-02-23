import { OverviewTabComponent } from './overview-tab.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewToTabShareDataService } from './service/overview-to-tab-share-data.service';
import { HearingStatus } from '../../../api';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

describe('OverviewTabComponent', () => {
  let component: OverviewTabComponent;
  let fixture: ComponentFixture<OverviewTabComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let overviewToTabService: OverviewToTabShareDataService;
  let routerEventsSubject: Subject<any>;

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
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    overviewToTabService = TestBed.inject(OverviewToTabShareDataService);
  });

  describe('Canton Subscription', () => {
    it('should update cantonShort when service emits new value', () => {
      fixture.detectChanges();

      expect(component.cantonShort).toBe('ch');

      overviewToTabService.changeData('be');

      expect(component.cantonShort).toBe('be');
    });

    it('should react to multiple canton changes', () => {
      fixture.detectChanges();

      overviewToTabService.changeData('ag');
      expect(component.cantonShort).toBe('ag');

      overviewToTabService.changeData('zh');
      expect(component.cantonShort).toBe('zh');

      overviewToTabService.changeData('ch');
      expect(component.cantonShort).toBe('ch');
    });

    it('should have initial canton from route on init', () => {
      route.snapshot.params = { canton: 'bl' };

      fixture.detectChanges();

      expect(component.cantonShort).toBe('bl');
    });

    it('should sync with service after external change', () => {
      fixture.detectChanges();

      overviewToTabService.changeData('gr');

      expect(component.cantonShort).toBe('gr');
    });
  });
});
