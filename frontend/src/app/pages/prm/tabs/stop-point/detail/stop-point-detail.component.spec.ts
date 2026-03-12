import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';

import { StopPointDetailComponent } from './stop-point-detail.component';
import { EMPTY, Observable, of } from 'rxjs';
import { AppTestingModule } from '../../../../../app.testing.module';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MockAtlasButtonComponent,
  MockAtlasFieldErrorComponent,
  MockNavigationSepodiPrmComponent,
  MockSelectComponent,
} from '../../../../../app.testing.mocks';
import { SwitchVersionComponent } from '../../../../../core/components/switch-version/switch-version.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UserDetailInfoComponent } from '../../../../../core/components/user-edit-info/user-detail-info.component';
import { StopPointCompleteFormComponent } from '../form/stop-point-complete-form/stop-point-complete-form.component';
import { StopPointReducedFormComponent } from '../form/stop-point-reduced-form/stop-point-reduced-form.component';
import { TextFieldComponent } from '../../../../../core/form-components/text-field/text-field.component';
import { AtlasLabelFieldComponent, InfoIconComponent } from '@atlas/form';
import { MeansOfTransportPickerComponent } from '../../../../../core/form-components/means-of-transport-picker/means-of-transport-picker.component';
import { AtlasSpacerComponent } from '../../../../../core/components/spacer/atlas-spacer.component';
import { StopPointFormGroupBuilder } from '../form/stop-point-detail-form-group';
import { MeanOfTransport, ReadStopPointVersion } from '../../../../../api';
import { NotificationService } from '../../../../../core/notification/notification.service';
import {
  STOP_POINT,
  STOP_POINT_COMPLETE,
} from '../../../util/stop-point-test-data';
import { BERN_WYLEREGG } from '../../../../../../test/data/service-point';
import { DetailFooterComponent } from '../../../../../core/components/detail-footer/detail-footer.component';
import { PrmVariantInfoService } from '../prm-variant-info.service';
import { ValidityService } from '../../../../sepodi/validity/validity.service';
import { StopPointService } from '../../../../../api/service/prm/stop-point/stop-point.service';

describe('StopPointDetailComponent', () => {
  let component: StopPointDetailComponent;
  let fixture: ComponentFixture<StopPointDetailComponent>;

  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let stopPointServiceSpy: Mocked<
    Pick<StopPointService, 'createStopPoint' | 'updateStopPoint'>
  >;
  let prmVariantInfoService: Mocked<
    Pick<PrmVariantInfoService, 'getPrmMeansOfTransportToShow'>
  >;
  let notificationService: Mocked<Pick<NotificationService, 'success'>>;

  const activatedRouteMock = {
    parent: {
      data: of({ stopPoints: [STOP_POINT], servicePoints: [BERN_WYLEREGG] }),
    },
  };

  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();

    routerSpy = {
      navigate: vi.fn(),
    };

    stopPointServiceSpy = {
      createStopPoint: vi.fn(),
      updateStopPoint: vi.fn(),
    };
    stopPointServiceSpy.createStopPoint.mockReturnValue(
      of(STOP_POINT) as Observable<ReadStopPointVersion>
    );
    stopPointServiceSpy.updateStopPoint.mockReturnValue(
      of(STOP_POINT) as Observable<ReadStopPointVersion>
    );

    prmVariantInfoService = {
      getPrmMeansOfTransportToShow: vi.fn(),
    };
    prmVariantInfoService.getPrmMeansOfTransportToShow.mockReturnValue(
      Object.values(MeanOfTransport)
    );

    notificationService = {
      success: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        StopPointDetailComponent,
        MockAtlasButtonComponent,
        SwitchVersionComponent,
        UserDetailInfoComponent,
        StopPointCompleteFormComponent,
        StopPointReducedFormComponent,
        MockSelectComponent,
        TextFieldComponent,
        InfoIconComponent,
        AtlasLabelFieldComponent,
        MockAtlasFieldErrorComponent,
        MeansOfTransportPickerComponent,
        AtlasSpacerComponent,
        DetailFooterComponent,
        MockNavigationSepodiPrmComponent,
      ],
      providers: [
        ValidityService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: StopPointService, useValue: stopPointServiceSpy },
        { provide: PrmVariantInfoService, useValue: prmVariantInfoService },
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: routerSpy },
        TranslatePipe,
      ],
    });

    fixture = TestBed.createComponent(StopPointDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    const initServicePointsDataSpy = vi
      .spyOn(component, 'initServicePointsData')
      .mockImplementation(() => {});
    const initStopPointSpy = vi
      .spyOn(component, 'initStopPoint')
      .mockImplementation(() => {});

    component.ngOnInit();

    expect(initServicePointsDataSpy).toHaveBeenCalled();
    expect(initStopPointSpy).toHaveBeenCalled();
    expect(component.stopPointVersions).toEqual([STOP_POINT]);
    expect(component.selectedVersion).toBeDefined();
    expect(component.servicePointVersion).toBeDefined();
  });

  it('should init when stop point exists', () => {
    component.stopPointVersions = [STOP_POINT];
    const initExistingStopPointSpy = vi
      .spyOn(component, 'initExistingStopPoint')
      .mockImplementation(() => {});
    const initNotExistingStopPointSpy = vi
      .spyOn(component, 'initNotExistingStopPoint')
      .mockImplementation(() => {});

    component.initStopPoint();

    expect(initExistingStopPointSpy).toHaveBeenCalled();
    expect(initNotExistingStopPointSpy).not.toHaveBeenCalled();
  });

  it('should init when stop point does exists', () => {
    component.stopPointVersions = [];
    const initExistingStopPointSpy = vi
      .spyOn(component, 'initExistingStopPoint')
      .mockImplementation(() => {});
    const initNotExistingStopPointSpy = vi
      .spyOn(component, 'initNotExistingStopPoint')
      .mockImplementation(() => {});

    component.initStopPoint();

    expect(initExistingStopPointSpy).not.toHaveBeenCalled();
    expect(initNotExistingStopPointSpy).toHaveBeenCalled();
  });

  it('should toggle edit when form is enabled', () => {
    component.form.enable();
    const showConfirmationDialogSpy = vi
      .spyOn(component, 'showConfirmationDialog')
      .mockImplementation(() => {});
    const enableFormSpy = vi
      .spyOn(component, 'enableForm')
      .mockImplementation(() => {});

    component.toggleEdit();

    expect(showConfirmationDialogSpy).toHaveBeenCalled();
    expect(enableFormSpy).not.toHaveBeenCalled();
  });

  it('should toggle edit when form is disable', () => {
    component.form.disable();
    const showConfirmationDialogSpy = vi
      .spyOn(component, 'showConfirmationDialog')
      .mockImplementation(() => {});
    const enableFormSpy = vi
      .spyOn(component, 'enableForm')
      .mockImplementation(() => {});

    component.toggleEdit();

    expect(showConfirmationDialogSpy).not.toHaveBeenCalled();
    expect(enableFormSpy).toHaveBeenCalled();
  });

  it('should showConfirmationDialog when is not new', () => {
    const backToSearchPrmSpy = vi
      .spyOn(component, 'backToSearchPrm')
      .mockImplementation(() => {});
    const initSelectedVersionSpy = vi
      .spyOn(component, 'initSelectedVersion')
      .mockImplementation(() => {});
    const disableFormSpy = vi
      .spyOn(component, 'disableForm')
      .mockImplementation(() => {});

    component.showConfirmationDialog();

    expect(backToSearchPrmSpy).not.toHaveBeenCalled();
    expect(initSelectedVersionSpy).toHaveBeenCalled();
    expect(disableFormSpy).toHaveBeenCalled();
  });

  it('should showConfirmationDialog when is new', () => {
    component.form = StopPointFormGroupBuilder.buildFormGroup(STOP_POINT);
    component.isNew = true;
    const navigateToPrmHomeSearchSpy = vi
      .spyOn(component, 'navigateToPrmHomeSearch')
      .mockImplementation(() => {});
    const initSelectedVersionSpy = vi
      .spyOn(component, 'initSelectedVersion')
      .mockImplementation(() => {});
    const disableFormSpy = vi
      .spyOn(component, 'disableForm')
      .mockImplementation(() => {});
    const resetSpy = vi
      .spyOn(component.form, 'reset')
      .mockImplementation(() => {});

    component.showConfirmationDialog();

    expect(navigateToPrmHomeSearchSpy).toHaveBeenCalled();
    expect(initSelectedVersionSpy).not.toHaveBeenCalled();
    expect(disableFormSpy).not.toHaveBeenCalled();
  });

  it('should save when stopPoint isNew', () => {
    routerSpy.navigate.mockResolvedValue(true);

    component.form = StopPointFormGroupBuilder.buildFormGroup(STOP_POINT);
    component.isNew = true;

    component.save();

    expect(stopPointServiceSpy.createStopPoint).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should save without prm variant change when stopPoint update ', () => {
    routerSpy.navigate.mockResolvedValue(true);
    const updateStopPointSpy = vi
      .spyOn(component, 'updateStopPoint')
      .mockImplementation(() => EMPTY);

    component.form = StopPointFormGroupBuilder.buildFormGroup(STOP_POINT);
    component.isNew = false;

    component.save();

    expect(updateStopPointSpy).toHaveBeenCalledTimes(1);
    expect(updateStopPointSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        creationDate: STOP_POINT.creationDate,
        creator: STOP_POINT.creator,
        editionDate: STOP_POINT.editionDate,
        editor: STOP_POINT.editor,
        sloid: STOP_POINT.sloid,
        validFrom: STOP_POINT.validFrom,
        validTo: STOP_POINT.validTo,
        meansOfTransport: STOP_POINT.meansOfTransport,
        numberWithoutCheckDigit: STOP_POINT.number.number,
      })
    );
  });

  it('should update stopPoint', () => {
    routerSpy.navigate.mockResolvedValue(true);
    component.form = StopPointFormGroupBuilder.buildFormGroup(STOP_POINT);
    component.isNew = false;

    component.doUpdateStopPoint(STOP_POINT).subscribe(() => {
      expect(stopPointServiceSpy.updateStopPoint).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalled();
    });
  });

  it('should update without prm variant change', () => {
    routerSpy.navigate.mockResolvedValue(true);
    const doUpdateStopPointSpy = vi
      .spyOn(component, 'doUpdateStopPoint')
      .mockReturnValue(of(STOP_POINT));

    component.form = StopPointFormGroupBuilder.buildFormGroup(STOP_POINT);
    component.selectedVersion = STOP_POINT;
    component.isNew = false;

    component.updateStopPoint(STOP_POINT);

    expect(doUpdateStopPointSpy).toHaveBeenCalledExactlyOnceWith(STOP_POINT);
  });

  it('should update with prm variant change', () => {
    routerSpy.navigate.mockResolvedValue(true);
    const showPrmChangeVariantConfirmationDialogSpy = vi
      .spyOn(component, 'showPrmChangeVariantConfirmationDialog')
      .mockReturnValue(EMPTY);

    component.form = StopPointFormGroupBuilder.buildFormGroup(STOP_POINT);
    component.selectedVersion = STOP_POINT;
    component.isNew = false;

    component.updateStopPoint(STOP_POINT_COMPLETE);

    expect(showPrmChangeVariantConfirmationDialogSpy).toHaveBeenCalled();
  });

  it('should initNotExistingStopPoint when user is authorized', () => {
    const hasPermissionToCreateNewStopPointSpy = vi
      .spyOn(component, 'hasPermissionToCreateNewStopPoint')
      .mockReturnValue(true);
    const initEmptyFormSpy = vi
      .spyOn(component, 'initEmptyForm')
      .mockImplementation(() => {});

    component.initNotExistingStopPoint();

    expect(component.isNew).toBeTruthy();
    expect(component.isAuthorizedToCreateStopPoint).toBeTruthy();
    expect(hasPermissionToCreateNewStopPointSpy).toHaveBeenCalled();
    expect(initEmptyFormSpy).toHaveBeenCalled();
  });

  it('should initNotExistingStopPoint when user is not authorized', () => {
    const hasPermissionToCreateNewStopPointSpy = vi
      .spyOn(component, 'hasPermissionToCreateNewStopPoint')
      .mockReturnValue(false);
    const initEmptyFormSpy = vi
      .spyOn(component, 'initEmptyForm')
      .mockImplementation(() => {});

    component.initNotExistingStopPoint();

    expect(component.isNew).toBeTruthy();
    expect(component.isAuthorizedToCreateStopPoint).toBeFalsy();
    expect(hasPermissionToCreateNewStopPointSpy).toHaveBeenCalled();
    expect(initEmptyFormSpy).not.toHaveBeenCalled();
  });

  it('should initEmptyForm', () => {
    component.servicePointVersion = BERN_WYLEREGG;
    const buildEmptyWithReducedValidationFormGroupSpy = vi.spyOn(
      StopPointFormGroupBuilder,
      'buildEmptyWithReducedValidationFormGroup'
    );

    component.initEmptyForm();

    expect(component.form.controls.number.value).toEqual(
      BERN_WYLEREGG.number.number
    );
    expect(component.form.controls.sloid.value).toEqual(BERN_WYLEREGG.sloid);
    expect(buildEmptyWithReducedValidationFormGroupSpy).toHaveBeenCalled();
  });
});
