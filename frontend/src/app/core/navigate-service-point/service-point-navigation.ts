import { Pages } from '../../pages/pages';
import { PRM_DETAIL_TAB_LINK } from '../../pages/prm/tabs/relation/tab/detail-with-relation-tab.component';

export interface Navigation {
  rootPath: string;
  path: string;
}

export interface PrmNavigation extends Navigation {
  suffixDetail?: string;
}

export interface SepodiNavigation extends Navigation {
  parentPath?: string;
}

export interface SloidContainer {
  rootSloid: string;
  parentSloid?: string;
  sloid: string;
}

export const PRM_NAVIGATION = new Map<string, PrmNavigation>();
PRM_NAVIGATION.set('PLATFORM', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.PLATFORMS.path,
  suffixDetail: PRM_DETAIL_TAB_LINK,
});
PRM_NAVIGATION.set('REFERENCE_POINT', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.REFERENCE_POINT.path,
});
PRM_NAVIGATION.set('CONTACT_POINT', {
  path: Pages.CONTACT_POINT.path,
  rootPath: Pages.STOP_POINTS.path,
  suffixDetail: PRM_DETAIL_TAB_LINK,
});
PRM_NAVIGATION.set('TOILET', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.TOILET.path,
  suffixDetail: PRM_DETAIL_TAB_LINK,
});
PRM_NAVIGATION.set('PARKING_LOT', {
  rootPath: Pages.STOP_POINTS.path,
  path: Pages.PARKING_LOT.path,
  suffixDetail: PRM_DETAIL_TAB_LINK,
});

export const SEPODI_NAVIAGATION = new Map<string, SepodiNavigation>();
SEPODI_NAVIAGATION.set('AREA', {
  rootPath: Pages.SERVICE_POINTS.path,
  path: Pages.TRAFFIC_POINT_ELEMENTS_AREA.path,
});
SEPODI_NAVIAGATION.set('PLATFORM', {
  rootPath: Pages.SERVICE_POINTS.path,
  path: Pages.TRAFFIC_POINT_ELEMENTS_PLATFORM.path,
});
SEPODI_NAVIAGATION.set('SECTOR', {
  rootPath: Pages.SERVICE_POINTS.path,
  parentPath: Pages.TRAFFIC_POINT_ELEMENTS_PLATFORM.path,
  path: Pages.SECTORS.path,
});
SEPODI_NAVIAGATION.set('SECTOR_GROUP', {
  rootPath: Pages.SERVICE_POINTS.path,
  parentPath: Pages.TRAFFIC_POINT_ELEMENTS_PLATFORM.path,
  path: Pages.SECTOR_GROUPS.path,
});
