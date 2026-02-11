import { Component, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class OverviewTabComponent implements OnInit {
  TABS: HearingOverviewTab[] = [
    {
      link: Pages.TTH_ACTIVE.path,
      title: 'TTH.TAB.ACTUAL',
    },
    {
      link: Pages.TTH_DOSSIERS.path,
      title: 'DOSSIER',
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
      map((status) => status === HearingStatus.Active)
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
  }
}
