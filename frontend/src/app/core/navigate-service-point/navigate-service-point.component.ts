import { Component, inject, input, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from 'src/app/api/service/location/location.service';
import { SloidLocationModel } from '../../api/model/sloidLocationModel';
import { NgSelectComponent } from '@ng-select/ng-select';
import { InfoIconComponent } from '@atlas/form';
import { SearchNavigationType } from '../search-service-point-panel/search-service-point-panel.component';
import {
  ServicePointSearch,
  ServicePointSearchType,
} from '../search-service-point/service-point-search';
import { ActivatedRoute, Router } from '@angular/router';
import { Pages } from '../../pages/pages';
import { SloidHelper } from '../util/sloidHelper';

interface Navigation {
  rootPath: string;
  path: string;
}

interface PrmNavigation extends Navigation {
  suffixDetail?: string;
}

interface SepodiNavigation extends Navigation {
  parentPath?: string;
}

const prmNavigationMap = new Map<string, PrmNavigation>();
prmNavigationMap.set('PLATFORM', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.PLATFORMS.path,
  suffixDetail: 'detail',
});
prmNavigationMap.set('REFERENCE_POINT', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.REFERENCE_POINT.path,
});
prmNavigationMap.set('CONTACT_POINT', {
  path: Pages.CONTACT_POINT.path,
  rootPath: Pages.STOP_POINTS.path,
  suffixDetail: 'detail',
});
prmNavigationMap.set('TOILET', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.TOILET.path,
  suffixDetail: 'detail',
});
prmNavigationMap.set('PARKING_LOT', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.PARKING_LOT.path,
  suffixDetail: 'detail',
});

const sepodiNavigationMap = new Map<string, SepodiNavigation>();
sepodiNavigationMap.set('AREA', {
  rootPath: Pages.SERVICE_POINTS.path,
  path: Pages.TRAFFIC_POINT_ELEMENTS_AREA.path,
});
sepodiNavigationMap.set('PLATFORM', {
  rootPath: Pages.SERVICE_POINTS.path,
  path: Pages.TRAFFIC_POINT_ELEMENTS_PLATFORM.path,
});
sepodiNavigationMap.set('SECTOR', {
  rootPath: Pages.SERVICE_POINTS.path,
  parentPath: Pages.TRAFFIC_POINT_ELEMENTS_PLATFORM.path,
  path: Pages.SECTORS.path,
});
sepodiNavigationMap.set('SECTOR_GROUP', {
  rootPath: Pages.SERVICE_POINTS.path,
  parentPath: Pages.TRAFFIC_POINT_ELEMENTS_PLATFORM.path,
  path: Pages.SECTOR_GROUPS.path,
});

@Component({
  selector: 'atlas-navigate-service-point',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    FormsModule,
    NgSelectComponent,
    InfoIconComponent,
  ],
  providers: [TranslatePipe],
  templateUrl: './navigate-service-point.component.html',
  styleUrls: ['./navigate-service-point.component.scss'],
})
export class NavigateServicePointComponent {
  searchNavigationType = input.required<SearchNavigationType>();
  searchType = input.required<ServicePointSearchType>();
  ngSelect = viewChild.required(NgSelectComponent);

  private _resultMsg = 'SEPODI.SERVICE_POINTS.NAVIGATION_PLACEHOLDER';
  items: SloidLocationModel[] = [];

  get resultMsg(): string {
    return this._resultMsg;
  }
  set resultMsg(value: string) {
    this._resultMsg = value;
  }

  private locationService = inject(LocationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  onSearch(): void {
    if (this.ngSelect().searchTerm) {
      this.locationService
        .getSloidLocationModel(this.ngSelect().searchTerm)
        .subscribe((sloidLocations) => {
          if (sloidLocations.length === 0 || sloidLocations.length > 1) {
            this.resultMsg = 'COMMON.NODATAFOUND';
          } else {
            this.navigateTo(sloidLocations[0]);
          }
        });
    }
  }

  navigateTo(sloidLocation: SloidLocationModel): void {
    if (this.searchType() === ServicePointSearch.PRM) {
      this.prmNavigateTo(sloidLocation);
    }
    if (this.searchType() === ServicePointSearch.SePoDi) {
      this.sepodiNavigateTo(sloidLocation);
    }
    this.resultMsg = 'SEPODI.SERVICE_POINTS.NAVIGATION_PLACEHOLDER';
    this.ngSelect().close();
  }

  prmNavigateTo(sloidLocationModel: SloidLocationModel) {
    const navigationCommands: string[] = [];
    const prmNavigation = prmNavigationMap.get(sloidLocationModel.sloidType!);
    if (!prmNavigation && sloidLocationModel.sloidType === 'SERVICE_POINT') {
      navigationCommands.push(this.searchType().navigationPath);
      navigationCommands.push(sloidLocationModel.sloid!);
    } else {
      const rootSloid = this.getRootSloid(sloidLocationModel);
      navigationCommands.push(prmNavigation!.rootPath!);
      navigationCommands.push(rootSloid);
      navigationCommands.push(prmNavigation!.path);
      navigationCommands.push(sloidLocationModel.sloid!);
      if (prmNavigation?.suffixDetail) {
        navigationCommands.push(prmNavigation.suffixDetail);
      }
    }
    this.doNavigate(navigationCommands);
  }

  sepodiNavigateTo(sloidLocationModel: SloidLocationModel) {
    const navigationCommands: string[] = [];
    const sepodiNavigation = sepodiNavigationMap.get(
      sloidLocationModel.sloidType!
    );
    if (!sepodiNavigation && sloidLocationModel.sloidType === 'SERVICE_POINT') {
      navigationCommands.push(this.searchType().navigationPath);
      navigationCommands.push(
        SloidHelper.servicePointSloidToNumber(
          sloidLocationModel.sloid!
        ).toString()
      );
    } else {
      const rootSloid = this.getRootSloid(sloidLocationModel);
      const rootServicePointNumber =
        SloidHelper.servicePointSloidToNumber(rootSloid).toString();
      if (
        sloidLocationModel.sloidType === 'PLATFORM' ||
        sloidLocationModel.sloidType === 'AREA'
      ) {
        navigationCommands.push(sepodiNavigation!.rootPath!);
        navigationCommands.push(rootServicePointNumber);
        navigationCommands.push(sepodiNavigation!.path);
        navigationCommands.push(sloidLocationModel.sloid!);
      }
      if (
        sloidLocationModel.sloidType === 'SECTOR' ||
        sloidLocationModel.sloidType === 'SECTOR_GROUP'
      ) {
        navigationCommands.push(sepodiNavigation!.rootPath!);
        navigationCommands.push(rootServicePointNumber);
        const parentSloid = this.getParentSloid(sloidLocationModel);
        navigationCommands.push(sepodiNavigation!.parentPath!);
        navigationCommands.push(parentSloid);
        navigationCommands.push(sepodiNavigation!.path);
        navigationCommands.push(sloidLocationModel.sloid!);
      }
    }
    this.doNavigate(navigationCommands);
  }

  private getRootSloid(sloidLocationModel: SloidLocationModel) {
    return sloidLocationModel.sloid!.split(':').slice(0, 4).join(':');
  }
  private getParentSloid(sloidLocationModel: SloidLocationModel) {
    return sloidLocationModel.sloid!.split(':').slice(0, 6).join(':');
  }

  private doNavigate(navigationCommands: string[]) {
    this.router.navigate(navigationCommands, { relativeTo: this.route }).then();
  }
}
