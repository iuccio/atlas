import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchServicePointComponent } from './search-service-point.component';
import { AppTestingModule } from '../../app.testing.module';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ServicePointSearchResult } from '../../api';
import { SearchSelectComponent } from '../form-components/search-select/search-select.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ServicePointSearch } from './service-point-search';
import { BERN_WYLEREGG } from '../../../test/data/service-point';
import { ServicePointInternalService } from '../../api/service/sepodi/service-point-internal.service';
import { tickAsync } from '../../../test/tick-async';
import SpyObj = jasmine.SpyObj;

describe('SearchServicePointComponent', () => {
  let component: SearchServicePointComponent;
  let fixture: ComponentFixture<SearchServicePointComponent>;
  let servicePointInternalService: SpyObj<ServicePointInternalService>;
  let router: Router;

  const activatedRouteMock = { data: of({ servicePoint: [BERN_WYLEREGG] }) };

  beforeEach(() => {
    servicePointInternalService =
      jasmine.createSpyObj<ServicePointInternalService>(
        'servicePointsService',
        ['searchServicePoints']
      );
    servicePointInternalService.searchServicePoints
      .withArgs({ value: 'be' })
      .and.returnValue(of());

    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        SearchServicePointComponent,
        SearchSelectComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        {
          provide: ServicePointInternalService,
          useValue: servicePointInternalService,
        },
        { provide: TranslatePipe },
      ],
    });
    fixture = TestBed.createComponent(SearchServicePointComponent);
    component = fixture.componentInstance;
    fixture.componentInstance.searchType = ServicePointSearch.SePoDi;
    component._DEBOUNCE_TIME = 0;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to servicePoint details', () => {
    //given
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const searchResult: ServicePointSearchResult = {
      number: 8507000,
      designationOfficial: 'Bern',
    };
    //when
    component.navigateTo(searchResult);
    //then
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should load result', async () => {
    //when
    component._DEBOUNCE_TIME = 0;
    fixture.componentInstance.searchInput$.next('be');
    fixture.detectChanges();
    await tickAsync(component._DEBOUNCE_TIME + 100);
    //then
    expect(component.searchValue).toEqual('be');
    expect(servicePointInternalService.searchServicePoints).toHaveBeenCalled();
  });

  it('should not load result when search input length is smaller than 2', async () => {
    //when
    component._DEBOUNCE_TIME = 0;
    fixture.componentInstance.searchInput$.next('b');
    fixture.detectChanges();
    await tickAsync(component._DEBOUNCE_TIME + 100);
    //then
    expect(component.searchValue).toEqual('b');
    expect(
      servicePointInternalService.searchServicePoints
    ).not.toHaveBeenCalled();
  });

  it('should init search value', () => {
    //when
    component.initSearchValue('be ');
    //then
    expect(component.searchValue).toEqual('be');
  });

  it('should get placeholder label when searchInput < 2', async () => {
    //when
    component._DEBOUNCE_TIME = 0;

    fixture.componentInstance.searchInput$.next('b');
    fixture.detectChanges();
    await tickAsync(component._DEBOUNCE_TIME + 100);
    //then
    expect(component.minThermLongText).toEqual('COMMON.TYPE_TO_SEARCH_SHORT');
    expect(component.notFoundText).toEqual('COMMON.TYPE_TO_SEARCH_SHORT');
  });

  it('should get placeholder label when searchInput >= 2', async () => {
    //when
    component._DEBOUNCE_TIME = 0;

    fixture.componentInstance.searchInput$.next('be');
    fixture.detectChanges();
    await tickAsync(component._DEBOUNCE_TIME + 100);
    //then
    expect(component.minThermLongText).toEqual('COMMON.NODATAFOUND');
    expect(component.notFoundText).toEqual('COMMON.NODATAFOUND');
  });
});
