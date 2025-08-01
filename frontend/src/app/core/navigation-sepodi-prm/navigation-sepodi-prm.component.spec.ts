import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSepodiPrmComponent } from './navigation-sepodi-prm.component';
import { AppTestingModule } from '../../app.testing.module';
import { Router } from '@angular/router';
import {
  PersonWithReducedMobilityService,
  ReadServicePointVersion,
  ReadStopPointVersion,
  ServicePointsService,
} from '../../api';
import { BERN_WYLEREGG } from '../../../test/data/service-point';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import { STOP_POINT } from '../../pages/prm/util/stop-point-test-data.spec';

describe('NavigationSepodiPrmComponent', () => {
  let component: NavigationSepodiPrmComponent;
  let fixture: ComponentFixture<NavigationSepodiPrmComponent>;
  let routerSpy: SpyObj<Router>;
  const personWithReducedMobilityServiceSpy = jasmine.createSpyObj(
    'personWithReducedMobilityService',
    ['getStopPointVersions']
  );
  const servicePointsServiceSpy = jasmine.createSpyObj('servicePointsService', [
    'getServicePointVersions',
  ]);

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj(['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [AppTestingModule, NavigationSepodiPrmComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: PersonWithReducedMobilityService,
          useValue: personWithReducedMobilityServiceSpy,
        },
        { provide: ServicePointsService, useValue: servicePointsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationSepodiPrmComponent);
    component = fixture.componentInstance;
    component.targetPage = 'stop-point';
    servicePointsServiceSpy.getServicePointVersions.and.returnValue(
      of([BERN_WYLEREGG])
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct URL when targetPage is stop point', () => {
    personWithReducedMobilityServiceSpy.getStopPointVersions.and.returnValue(
      of([STOP_POINT])
    );
    component.sloid = 'ch:1:sloid:89008';

    component.init();
    component.navigate();
    expect(component.isTargetViewSepodi).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      `/prm-directory/stop-points/${component.sloid}/stop-point`
    );
  });

  it('should navigate to the correct URL when targetPage is service point', () => {
    personWithReducedMobilityServiceSpy.getStopPointVersions.and.returnValue(
      of([STOP_POINT])
    );
    component.number = 8589008;
    component.targetPage = 'service-point';

    component.init();
    component.navigate();
    expect(component.isTargetViewSepodi).toBeTrue();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      `/service-point-directory/service-points/${component.number}/service-point`
    );
  });

  it('should navigate to the correct URL when targetPage is traffic point table', () => {
    personWithReducedMobilityServiceSpy.getStopPointVersions.and.returnValue(
      of([STOP_POINT])
    );
    component.number = 8589008;
    component.targetPage = 'traffic-point-table';

    component.init();
    component.navigate();
    expect(component.isTargetViewSepodi).toBeTrue();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      `/service-point-directory/service-points/${component.number}/traffic-point-elements`
    );
  });

  it('should navigate to the correct URL when targetPage is traffic point detail', () => {
    personWithReducedMobilityServiceSpy.getStopPointVersions.and.returnValue(
      of([STOP_POINT])
    );
    component.sloid = 'ch:1:sloid:89008';
    component.targetPage = 'traffic-point-detail';

    component.init();
    component.navigate();
    expect(component.isTargetViewSepodi).toBeTrue();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      `/service-point-directory/traffic-point-elements/${component.sloid}`
    );
  });

  it('should navigate to the correct URL when targetPage is platform table', () => {
    personWithReducedMobilityServiceSpy.getStopPointVersions.and.returnValue(
      of([STOP_POINT])
    );
    component.sloid = 'ch:1:sloid:89008';
    component.targetPage = 'platform-table';

    component.init();
    component.navigate();
    expect(component.isTargetViewSepodi).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      `/prm-directory/stop-points/${component.sloid}/platforms`
    );
  });

  it('should navigate to the correct URL when targetPage is platform detail', () => {
    personWithReducedMobilityServiceSpy.getStopPointVersions.and.returnValue(
      of([STOP_POINT])
    );
    component.parentSloid = 'ch:1:sloid:89008';
    component.sloid = 'ch:1:sloid:89008:0:1';
    component.targetPage = 'platform-detail';

    component.init();
    component.navigate();
    expect(component.isTargetViewSepodi).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      `/prm-directory/stop-points/${component.parentSloid}/platforms/${component.sloid}/detail`
    );
  });

  it('should navigate to create stop point when the stop point returns an empty array', () => {
    const sloid = BERN_WYLEREGG.sloid!;
    const mockResponse: ReadStopPointVersion[] = [];

    personWithReducedMobilityServiceSpy.getStopPointVersions.and.returnValue(
      of(mockResponse)
    );

    component.checkStopPointExists(sloid);

    expect(
      personWithReducedMobilityServiceSpy.getStopPointVersions
    ).toHaveBeenCalledWith(sloid);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      `/prm-directory/stop-points/${sloid}/stop-point`
    );
  });

  it('should set isSwissServicePoint to true when the service point is in Switzerland', () => {
    //Bern Wyleregg number
    const number = 8589008;
    const mockResponse: ReadServicePointVersion[] = [BERN_WYLEREGG];

    servicePointsServiceSpy.getServicePointVersions.and.returnValue(
      of(mockResponse)
    );

    component.checkServicePointIsLocatedInSwitzerland(number);

    expect(
      servicePointsServiceSpy.getServicePointVersions
    ).toHaveBeenCalledWith(number);
    expect(component.isSwissServicePoint).toBeTrue();
  });

  it('should set isStopPoint to true when the service point has version with stopPoint true', () => {
    //Bern Wyleregg number
    const number = 8589008;
    const mockResponse: ReadServicePointVersion[] = [BERN_WYLEREGG];

    servicePointsServiceSpy.getServicePointVersions.and.returnValue(
      of(mockResponse)
    );

    component.checkServicePointIsLocatedInSwitzerland(number);

    expect(
      servicePointsServiceSpy.getServicePointVersions
    ).toHaveBeenCalledWith(number);
    expect(component.isSwissServicePoint).toBeTrue();
    expect(component.isStopPoint).toBeTrue();
  });
});
