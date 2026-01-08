import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  NavigateServicePointComponent,
  NOTFOUND_LABEL,
} from './navigate-service-point.component';
import { provideHttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { translateServiceProvider } from '../../app.testing.mocks';
import { inputBinding, signal } from '@angular/core';
import { ServicePointSearch } from '../search-service-point/service-point-search';
import { LocationService } from '../../api/service/location/location.service';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('NavigateServicePoint', () => {
  let component: NavigateServicePointComponent;
  let fixture: ComponentFixture<NavigateServicePointComponent>;
  let locationServiceSpy: SpyObj<LocationService>;
  let router: Router;
  const searchType = signal(ServicePointSearch.PRM);

  beforeEach(async () => {
    locationServiceSpy = jasmine.createSpyObj<LocationService>(
      'locationService',
      ['getSloidLocationModel']
    );

    await TestBed.configureTestingModule({
      imports: [NavigateServicePointComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(),
        translateServiceProvider,
        { provide: LocationService, useValue: locationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigateServicePointComponent, {
      bindings: [inputBinding('searchType', searchType)],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be possible search on PRM', () => {
    //when
    const result = component.checkIsNotPrmSearchPossible('ch:1:sloid:12:0:1');
    //then
    expect(result).toBeFalse();
  });

  it('should not be possible search on PRM', () => {
    //when
    const result = component.checkIsNotPrmSearchPossible('ch:1:sloid:12:0:1:1');
    //then
    expect(result).toBeTrue();
  });

  it('should find and navigate PRM', () => {
    //given
    locationServiceSpy.getSloidLocationModel.and.returnValue(
      of([{ sloid: 'ch:1:sloid:12:0:1:1', sloidType: 'REFERENCE_POINT' }])
    );

    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    //when
    component.doSearch('ch:1:sloid:12:0:1');
    //then
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should not find and no navigate PRM', () => {
    //given
    locationServiceSpy.getSloidLocationModel.and.returnValue(of([]));

    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    //when
    component.doSearch('ch:1:sloid:12:0:1:1');
    //then
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.resultMsg).toBe(NOTFOUND_LABEL);
  });
});
