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
import { ServicePointNavigationHelper } from './service-point-navigation.helper';

const MAX_PRM_COLON = 5;
const NOTFOUND_LABEL = 'COMMON.NODATAFOUND';
const NAVIGATION_PLACEHOLDER = 'SEPODI.SERVICE_POINTS.NAVIGATION_PLACEHOLDER';

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

  private _resultMsg = NAVIGATION_PLACEHOLDER;
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
    this.checkIsPrmSearchPossible();
    if (this.ngSelect().searchTerm) {
      this.locationService
        .getSloidLocationModel(this.ngSelect().searchTerm)
        .subscribe((sloidLocations) => {
          if (sloidLocations.length === 0 || sloidLocations.length > 1) {
            this.resultMsg = NOTFOUND_LABEL;
          } else {
            this.navigateTo(sloidLocations[0]);
          }
        });
    }
  }

  checkIsPrmSearchPossible() {
    const colonCount = Array.from(
      this.ngSelect().searchTerm.matchAll(/:/g)
    ).length;
    if (
      this.searchType() === ServicePointSearch.PRM &&
      colonCount > MAX_PRM_COLON
    ) {
      this.resultMsg = NOTFOUND_LABEL;
      return;
    }
  }

  navigateTo(sloidLocation: SloidLocationModel): void {
    if (this.searchType() === ServicePointSearch.PRM) {
      this.prmNavigateTo(sloidLocation);
    }
    if (this.searchType() === ServicePointSearch.SePoDi) {
      this.sepodiNavigateTo(sloidLocation);
    }
  }

  prmNavigateTo(model: SloidLocationModel) {
    const commands = ServicePointNavigationHelper.buildPrmNavigation(
      model,
      this.searchType().navigationPath
    );
    this.doNavigate(commands);
  }

  sepodiNavigateTo(model: SloidLocationModel) {
    const commands = ServicePointNavigationHelper.buildSepodiNavigation(
      model,
      this.searchType().navigationPath
    );
    this.doNavigate(commands);
  }

  private doNavigate(navigationCommands: string[]) {
    this.router
      .navigate(navigationCommands, { relativeTo: this.route })
      .then(() => {
        this.resultMsg = NAVIGATION_PLACEHOLDER;
        this.ngSelect().close();
      });
  }
}
