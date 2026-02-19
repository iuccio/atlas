import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cantons } from '../../../../core/cantons/Cantons';
import { TimetableHearingYear } from '../../../../api';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class OverviewToTabShareDataService {
  private cantonShort = new BehaviorSubject(Cantons.swiss.path);
  private timetableHearingYearSubject =
    new BehaviorSubject<TimetableHearingYear>({
      timetableYear: moment().toDate().getFullYear() + 1,
      hearingFrom: moment().toDate(),
      hearingTo: moment().toDate(),
    });
  private noTimetableHearingYearFoundSubject = new BehaviorSubject<boolean>(
    false
  );
  private noPlannedTimetableHearingYearFoundSubject =
    new BehaviorSubject<boolean>(false);

  cantonShort$ = this.cantonShort.asObservable();

  timetableHearingYear$: Observable<TimetableHearingYear> =
    this.timetableHearingYearSubject.asObservable();

  noTimetableHearingYearFound$: Observable<boolean> =
    this.noTimetableHearingYearFoundSubject.asObservable();

  noPlannedTimetableHearingYearFound$: Observable<boolean> =
    this.noPlannedTimetableHearingYearFoundSubject.asObservable();

  changeData(cantonShort: string) {
    this.cantonShort.next(cantonShort);
  }

  setNoPlannedTimetableHearingYearFound(notFound: boolean): void {
    this.noPlannedTimetableHearingYearFoundSubject.next(notFound);
  }
  setTimetableHearingYear(year: TimetableHearingYear): void {
    this.timetableHearingYearSubject.next(year);
  }

  setNoTimetableHearingYearFound(notFound: boolean): void {
    this.noTimetableHearingYearFoundSubject.next(notFound);
  }

  getCantonShort(): string {
    return this.cantonShort.getValue();
  }

  getTimetableHearingYear(): TimetableHearingYear {
    return this.timetableHearingYearSubject.getValue();
  }
}
