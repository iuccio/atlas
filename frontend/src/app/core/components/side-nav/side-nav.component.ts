import { Component } from '@angular/core';
import {
  buildSubpageLink,
  NavigationParam,
  Page,
  SubPage,
} from '../../model/page';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageService } from '../../pages/page.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatListItem } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';
import { OverviewToTabShareDataService } from '../../../pages/tth/overview-tab/service/overview-to-tab-share-data.service';
import { Cantons } from '../../cantons/Cantons';

@Component({
  selector: 'atlas-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  imports: [MatListItem, RouterLink, NgClass, AsyncPipe, TranslatePipe],
  providers: [TranslatePipe],
})
export class SideNavComponent {
  activePageIndex: number | null = 0;
  activeSubPageIndex = 0;
  selectedPage: Page | null = null;
  navParam!: NavigationParam;

  constructor(
    private readonly router: Router,
    protected readonly pageService: PageService,
    private readonly overviewToTabService: OverviewToTabShareDataService
  ) {
    this.overviewToTabService.cantonShort$.subscribe((canton) => {
      this.navParam = { canton: canton || Cantons.swiss.path };
    });

    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
        switchMap((event) => {
          return pageService.enabledPages.pipe(
            map((pages) => [event, pages] as [NavigationEnd, Page[]])
          );
        })
      )
      .subscribe(([event, pages]) => {
        this.setActivePage(event.url, pages);
      });
  }

  private setActivePage(currentUrl: string, pages: Page[]): void {
    pages.forEach((page, index) => {
      if (currentUrl.includes(page.path)) {
        this.activePageIndex = index;
        this.selectedPage = page;
        if (page.subpages) {
          page.subpages.forEach((subPage, index) => {
            if (currentUrl.includes(subPage.path)) {
              this.activeSubPageIndex = index;
              this.activePageIndex = null;
            }
          });
        }
      }
    });
  }

  linkForSubPage(page: Page, subPage: SubPage) {
    return buildSubpageLink(page, subPage, this.navParam);
  }
}
