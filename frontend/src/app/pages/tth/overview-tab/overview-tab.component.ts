import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Pages } from '../../pages';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { OverviewToTabShareDataService } from './service/overview-to-tab-share-data.service';
import { Cantons } from '../../../core/cantons/Cantons';
import { HearingOverviewTab } from './model/hearing-overview-tab';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HearingStatus } from '../../../api';
import { AsyncPipe, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './overview-tab.component.html',
  imports: [
    MatTabNav,
    RouterLinkActive,
    MatTabLink,
    RouterLink,
    MatTabNavPanel,
    RouterOutlet,
    TranslatePipe,
    AsyncPipe,
    NgClass,
  ],
})
export class OverviewTabComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  section: string = 'active';
  subscription = new Subscription();

  TABS: HearingOverviewTab[] = [
    {
      link: Pages.TTH_STATEMENTS.path,
      title: 'TTH.TAB.STATEMENTS',
    },
    {
      link: Pages.TTH_DOSSIERS.path,
      title: 'TTH.TAB.DOSSIERS',
    },
  ];
  cantonShort = Cantons.swiss.path;
  isHearingStatusPlanned = false;
  isHearingStatusActive$!: Observable<boolean>;

  constructor(
    public readonly route: ActivatedRoute,
    private readonly router: Router,
    private overviewToTabService: OverviewToTabShareDataService
  ) {}

  clickOnTab() {
    this.cantonShort = this.route.snapshot.params['canton'];
    this.overviewToTabService.changeData(this.cantonShort);
  }

  ngOnInit(): void {
    this.isHearingStatusActive$ = this.router.events.pipe(
      map(() => this.route.firstChild?.snapshot.data?.['hearingStatus']),
      map((status) => {
        this.section = status?.toLowerCase() || 'active';
        return (
          status === HearingStatus.Active || status === HearingStatus.Archived
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    );

    this.overviewToTabService.cantonShort$.subscribe(
      (res) => (this.cantonShort = res)
    );
    this.cantonShort = this.route.snapshot.params['canton'];
    this.overviewToTabService.changeData(this.cantonShort);

    this.overviewToTabService.cantonShort$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((canton) => {
        this.cantonShort = canton;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  tabLink(tab: HearingOverviewTab): any[] {
    return [this.section, tab.link];
  }
}
