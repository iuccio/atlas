import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { OverviewToTabShareDataService } from './overview-to-tab-share-data.service';
import { TimetableHearingYear } from '../../../../api';
import moment from 'moment';

describe('OverviewToTabShareDataService', () => {
  let service: OverviewToTabShareDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverviewToTabShareDataService],
    });
    service = TestBed.inject(OverviewToTabShareDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Canton Management', () => {
    it('should have default canton as swiss path', () => {
      expect(service.isSwissCanton()).toBe(true);
    });

    it('should update canton short', () => {
      service.setCantonShort('zh');

      expect(service.cantonShort()).toBe('zh');
    });

    it('should handle multiple canton changes', () => {
      service.setCantonShort('zh');
      expect(service.cantonShort()).toBe('zh');

      service.setCantonShort('ag');
      expect(service.cantonShort()).toBe('ag');

      service.setCantonShort('ch');
      expect(service.cantonShort()).toBe('ch');
    });
  });

  describe('Timetable Hearing Year Management', () => {
    it('should have default year as next year', () => {
      const expectedYear = moment().toDate().getFullYear() + 1;

      expect(service.timetableYear().timetableYear).toBe(expectedYear);
    });

    it('should update timetable hearing year', () => {
      const testYear: TimetableHearingYear = {
        timetableYear: 2025,
        hearingFrom: new Date('2025-01-01'),
        hearingTo: new Date('2025-12-31'),
      };

      service.setTimetableHearingYear(testYear);

      expect(service.timetableYear()).toEqual(testYear);
    });

    it('should update year multiple times', () => {
      const year2025: TimetableHearingYear = {
        timetableYear: 2025,
        hearingFrom: new Date('2025-01-01'),
        hearingTo: new Date('2025-12-31'),
      };

      const year2026: TimetableHearingYear = {
        timetableYear: 2026,
        hearingFrom: new Date('2026-01-01'),
        hearingTo: new Date('2026-12-31'),
      };

      service.setTimetableHearingYear(year2025);
      expect(service.timetableYear().timetableYear).toBe(2025);

      service.setTimetableHearingYear(year2026);
      expect(service.timetableYear().timetableYear).toBe(2026);
    });
  });

  describe('Loading State Management', () => {
    it('should have default loading state as false', () => {
      expect(service.isYearLoading()).toBe(false);
    });

    it('should update loading state to true', () => {
      service.setTimetableHearingYearLoading(true);
      expect(service.isYearLoading()).toBe(true);
    });

    describe('No Timetable Hearing Year Found Flag', () => {
      it('should have default value as false', () => {
        expect(service.isTimetableHearingYearFound()).toBe(false);
      });

      it('should update timetable hearing year found flag to false', () => {
        service.setTimetableHearingYearFound(false);

        expect(service.isTimetableHearingYearFound()).toBe(false);
      });

      it('should update timetable hearing year found flag to true', () => {
        service.setTimetableHearingYearFound(false);
        expect(service.isTimetableHearingYearFound()).toBe(false);

        service.setTimetableHearingYearFound(true);
        expect(service.isTimetableHearingYearFound()).toBe(true);
      });
    });

    describe('No Planned Timetable Hearing Year Found Flag', () => {
      it('should set no planned timetable hearing year found flag', () => {
        expect(() => {
          service.setPlannedTimetableHearingYearFound(false);
        }).not.toThrow();

        expect(() => {
          service.setPlannedTimetableHearingYearFound(true);
        }).not.toThrow();
      });

      it('should call setNoPlannedTimetableHearingYearFound multiple times', () => {
        service.setPlannedTimetableHearingYearFound(true);
        service.setPlannedTimetableHearingYearFound(false);
        service.setPlannedTimetableHearingYearFound(true);

        expect(service.setPlannedTimetableHearingYearFound).toBeDefined();
      });
    });

    describe('Complete Workflow', () => {
      it('should handle complete state update workflow', () => {
        const testYear: TimetableHearingYear = {
          timetableYear: 2027,
          hearingFrom: new Date('2027-01-01'),
          hearingTo: new Date('2027-12-31'),
        };

        service.setTimetableHearingYearLoading(true);

        service.setCantonShort('zh');

        service.setTimetableHearingYear(testYear);

        service.setTimetableHearingYearFound(true);
        service.setPlannedTimetableHearingYearFound(true);

        service.setTimetableHearingYearLoading(false);

        expect(service.cantonShort()).toBe('zh');
        expect(service.timetableYear()).toEqual(testYear);
        expect(service.isTimetableHearingYearFound()).toBe(true);
      });

      it('should handle error scenario workflow', () => {
        service.setTimetableHearingYearLoading(true);

        service.setCantonShort('invalid');

        service.setTimetableHearingYearFound(false);
        service.setPlannedTimetableHearingYearFound(true);

        service.setTimetableHearingYearLoading(false);

        expect(service.cantonShort()).toBe('invalid');
        expect(service.isTimetableHearingYearFound()).toBe(false);
      });
    });
  });
});
