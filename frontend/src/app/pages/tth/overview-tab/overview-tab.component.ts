import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pages } from '../../pages';
import {
  ActivatedRoute,
  NavigationEnd,
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
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HearingStatus } from '../../../api';
import { AsyncPipe } from '@angular/common';

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
  ],
})
export class OverviewTabComponent implements OnInit, OnDestroy {
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
  readonly isHearingStatusActive$: Observable<boolean>;

  constructor(
    public readonly route: ActivatedRoute,
    private readonly router: Router,
    private overviewToTabService: OverviewToTabShareDataService
  ) {
    this.isHearingStatusActive$ = this.router.events.pipe(
      map(() => this.route.firstChild?.snapshot.data?.['hearingStatus']),
      map(
        (status) =>
          status === HearingStatus.Active || status === HearingStatus.Archived
      )
    );
  }

  clickOnTab() {
    this.cantonShort = this.route.snapshot.params['canton'];
    this.overviewToTabService.changeData(this.cantonShort);
  }

  ngOnInit(): void {
    this.overviewToTabService.cantonShort$.subscribe(
      (res) => (this.cantonShort = res)
    );
    this.cantonShort = this.route.snapshot.params['canton'];
    this.overviewToTabService.changeData(this.cantonShort);

    this.subscription.add(
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
          ),
          map(
            () =>
              this.route.firstChild?.snapshot.data?.[
                'hearingStatus'
              ].toLowerCase() ?? 'active'
          ),
          distinctUntilChanged()
        )
        .subscribe((section) => {
          this.section = section;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  tabLink(tab: HearingOverviewTab): any[] {
    return [this.section, tab.link];
  }
}
