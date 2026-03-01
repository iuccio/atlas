import { Component, OnInit } from '@angular/core';
import { Pages } from '../../pages';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { OverviewToTabShareDataService } from './service/overview-to-tab-share-data.service';
import { HearingOverviewTab } from './model/hearing-overview-tab';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

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
    NgClass,
  ],
})
export class OverviewTabComponent implements OnInit {
  protected readonly isHearingYearPlanned =
    this.overviewToTabService.isHearingYearPlanned;

  protected readonly hearingStatus = this.overviewToTabService.hearingStatus;

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

  constructor(
    public readonly route: ActivatedRoute,
    private readonly overviewToTabService: OverviewToTabShareDataService
  ) {}

  ngOnInit(): void {
    console.log('call');
    this.overviewToTabService.setCantonShort(
      this.route.snapshot.params['canton']
    );
  }
}
