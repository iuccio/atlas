import { TestBed } from '@angular/core/testing';

import { PrmVariantInfoService } from './prm-variant-info.service';
import {
  completeMeansOfTransport,
  reducedMeansOfTransport,
} from '../../util/prm-mean-of-transport-helper';
import { MeanOfTransport } from '../../../../api';
import { PermissionService } from '../../../../core/auth/permission/permission.service';

describe('PrmVariantInfoService', () => {
  let service: PrmVariantInfoService;

  const isAtLeastSupervisorMock: Partial<PermissionService> = {
    isAtLeastSupervisor(): boolean {
      return true;
    },
  };
  const isNotAtLeastSupervisorMock: Partial<PermissionService> = {
    isAtLeastSupervisor(): boolean {
      return false;
    },
  };

  describe('isAtLeastSupervisor', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PermissionService, useValue: isAtLeastSupervisorMock },
        ],
      });
      service = TestBed.inject(PrmVariantInfoService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return reduced meansOfTransportToShow', () => {
      //when
      const res = service.getPrmMeansOfTransportToShow(['BUS']);
      //then
      expect(res).toEqual(
        Object.values(MeanOfTransport).filter(
          (value) => value !== MeanOfTransport.Unknown
        )
      );
    });

    it('should return complete meansOfTransportToShow', () => {
      //when
      const res = service.getPrmMeansOfTransportToShow(['TRAIN']);
      //then
      expect(res).toEqual(
        Object.values(MeanOfTransport).filter(
          (value) => value !== MeanOfTransport.Unknown
        )
      );
    });
  });

  describe('isNotAtLeastSupervisorMock', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PermissionService, useValue: isNotAtLeastSupervisorMock },
        ],
      });
      service = TestBed.inject(PrmVariantInfoService);
    });

    it('should return reduced meansOfTransportToShow', () => {
      //when
      const res = service.getPrmMeansOfTransportToShow(['BUS']);
      //then
      expect(res).toEqual(reducedMeansOfTransport);
    });

    it('should return complete meansOfTransportToShow', () => {
      //when
      const res = service.getPrmMeansOfTransportToShow(['TRAIN']);
      //then
      expect(res).toEqual(completeMeansOfTransport);
    });
  });
});
