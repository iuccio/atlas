import { TestBed } from '@angular/core/testing';
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
      expect(service.getCantonShort()).toBe('ch');
    });

    it('should update canton short', () => {
      service.changeData('zh');

      expect(service.getCantonShort()).toBe('zh');
    });

    it('should emit canton change via observable', (done) => {
      let emissionCount = 0;

      service.cantonShort$.subscribe((canton) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(canton).toBe('be');
          done();
        }
      });

      service.changeData('be');
    });

    it('should handle multiple canton changes', () => {
      service.changeData('zh');
      expect(service.getCantonShort()).toBe('zh');

      service.changeData('ag');
      expect(service.getCantonShort()).toBe('ag');

      service.changeData('ch');
      expect(service.getCantonShort()).toBe('ch');
    });
  });

  describe('Timetable Hearing Year Management', () => {
    it('should have default year as next year', () => {
      const expectedYear = moment().toDate().getFullYear() + 1;

      expect(service.getTimetableHearingYear().timetableYear).toBe(
        expectedYear
      );
    });

    it('should update timetable hearing year', () => {
      const testYear: TimetableHearingYear = {
        timetableYear: 2025,
        hearingFrom: new Date('2025-01-01'),
        hearingTo: new Date('2025-12-31'),
      };

      service.setTimetableHearingYear(testYear);

      expect(service.getTimetableHearingYear()).toEqual(testYear);
    });

    it('should emit year change via observable', (done) => {
      const testYear: TimetableHearingYear = {
        timetableYear: 2026,
        hearingFrom: new Date('2026-01-01'),
        hearingTo: new Date('2026-12-31'),
      };

      let emissionCount = 0;
      service.timetableHearingYear$.subscribe((year) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(year).toEqual(testYear);
          done();
        }
      });

      service.setTimetableHearingYear(testYear);
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
      expect(service.getTimetableHearingYear().timetableYear).toBe(2025);

      service.setTimetableHearingYear(year2026);
      expect(service.getTimetableHearingYear().timetableYear).toBe(2026);
    });
  });

  describe('Loading State Management', () => {
    it('should have default loading state as false', (done) => {
      service.timetableHearingYearLoading$.subscribe((loading) => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should update loading state to true', (done) => {
      let emissionCount = 0;

      service.timetableHearingYearLoading$.subscribe((loading) => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(loading).toBe(true);
          done();
        }
      });

      service.setTimetableHearingYearLoading(true);
    });

    it('should toggle loading state multiple times', (done) => {
      const emissions: boolean[] = [];

      service.timetableHearingYearLoading$.subscribe((loading) => {
        emissions.push(loading);
        if (emissions.length === 4) {
          expect(emissions).toEqual([false, true, false, true]);
          done();
        }
      });

      service.setTimetableHearingYearLoading(true);
      service.setTimetableHearingYearLoading(false);
      service.setTimetableHearingYearLoading(true);
    });
  });

  describe('No Timetable Hearing Year Found Flag', () => {
    it('should have default value as false', () => {
      expect(service.getNoTimetableHearingYearFound()).toBe(false);
    });

    it('should update no timetable hearing year found flag to true', () => {
      service.setNoTimetableHearingYearFound(true);

      expect(service.getNoTimetableHearingYearFound()).toBe(true);
    });

    it('should update no timetable hearing year found flag to false', () => {
      service.setNoTimetableHearingYearFound(true);
      expect(service.getNoTimetableHearingYearFound()).toBe(true);

      service.setNoTimetableHearingYearFound(false);
      expect(service.getNoTimetableHearingYearFound()).toBe(false);
    });

    it('should toggle flag multiple times', () => {
      service.setNoTimetableHearingYearFound(true);
      expect(service.getNoTimetableHearingYearFound()).toBe(true);

      service.setNoTimetableHearingYearFound(false);
      expect(service.getNoTimetableHearingYearFound()).toBe(false);

      service.setNoTimetableHearingYearFound(true);
      expect(service.getNoTimetableHearingYearFound()).toBe(true);
    });
  });

  describe('No Planned Timetable Hearing Year Found Flag', () => {
    it('should set no planned timetable hearing year found flag', () => {
      expect(() => {
        service.setNoPlannedTimetableHearingYearFound(true);
      }).not.toThrow();

      expect(() => {
        service.setNoPlannedTimetableHearingYearFound(false);
      }).not.toThrow();
    });

    it('should call setNoPlannedTimetableHearingYearFound multiple times', () => {
      service.setNoPlannedTimetableHearingYearFound(true);
      service.setNoPlannedTimetableHearingYearFound(false);
      service.setNoPlannedTimetableHearingYearFound(true);

      expect(service.setNoPlannedTimetableHearingYearFound).toBeDefined();
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

      service.changeData('zh');

      service.setTimetableHearingYear(testYear);

      service.setNoTimetableHearingYearFound(false);
      service.setNoPlannedTimetableHearingYearFound(false);

      service.setTimetableHearingYearLoading(false);

      expect(service.getCantonShort()).toBe('zh');
      expect(service.getTimetableHearingYear()).toEqual(testYear);
      expect(service.getNoTimetableHearingYearFound()).toBe(false);
    });

    it('should handle error scenario workflow', () => {
      service.setTimetableHearingYearLoading(true);

      service.changeData('invalid');

      service.setNoTimetableHearingYearFound(true);
      service.setNoPlannedTimetableHearingYearFound(true);

      service.setTimetableHearingYearLoading(false);

      expect(service.getCantonShort()).toBe('invalid');
      expect(service.getNoTimetableHearingYearFound()).toBe(true);
    });
  });

  describe('Observable Streams', () => {
    it('should provide observable for canton changes', () => {
      expect(service.cantonShort$).toBeDefined();
    });

    it('should provide observable for year changes', () => {
      expect(service.timetableHearingYear$).toBeDefined();
    });

    it('should provide observable for loading state', () => {
      expect(service.timetableHearingYearLoading$).toBeDefined();
    });

    it('should emit initial values on subscription', (done) => {
      const initialYear = moment().toDate().getFullYear() + 1;

      service.timetableHearingYear$.subscribe((year) => {
        expect(year.timetableYear).toBe(initialYear);
        done();
      });
    });
  });
});
