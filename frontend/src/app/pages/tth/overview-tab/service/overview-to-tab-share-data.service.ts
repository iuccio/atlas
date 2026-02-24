import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cantons } from '../../../../core/cantons/Cantons';
import { TimetableHearingYear } from '../../../../api';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class OverviewToTabShareDataService {
  private readonly cantonShort = new BehaviorSubject(Cantons.swiss.path);
  private readonly timetableHearingYearSubject =
    new BehaviorSubject<TimetableHearingYear>({
      timetableYear: moment().toDate().getFullYear() + 1,
      hearingFrom: moment().toDate(),
      hearingTo: moment().toDate(),
    });
  private readonly noTimetableHearingYearFoundSubject =
    new BehaviorSubject<boolean>(false);
  private readonly noPlannedTimetableHearingYearFoundSubject =
    new BehaviorSubject<boolean>(false);

  private readonly timetableHearingYearLoadingSubject =
    new BehaviorSubject<boolean>(false);

  cantonShort$ = this.cantonShort.asObservable();

  timetableHearingYear$: Observable<TimetableHearingYear> =
    this.timetableHearingYearSubject.asObservable();

  timetableHearingYearLoading$: Observable<boolean> =
    this.timetableHearingYearLoadingSubject.asObservable();

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

  setTimetableHearingYearLoading(loading: boolean): void {
    this.timetableHearingYearLoadingSubject.next(loading);
  }

  getCantonShort(): string {
    return this.cantonShort.getValue();
  }

  getTimetableHearingYear(): TimetableHearingYear {
    return this.timetableHearingYearSubject.getValue();
  }

  getNoTimetableHearingYearFound(): boolean {
    return this.noTimetableHearingYearFoundSubject.getValue();
  }
}
