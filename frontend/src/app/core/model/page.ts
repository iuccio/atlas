export interface Page {
  title: string;
  titleMenu?: string;
  headerTitle?: string;
  path: string;
  pathText?: string;
  description?: string;
  subpages?: SubPage[];
}

export interface SubPage extends Page {
  params?: string[];
}

export type NavigationParam = Record<string, string>;

export function buildSubpageLink(
  page: Page,
  subPage: SubPage,
  navParam: NavigationParam
) {
  if (subPage.params?.length) {
    const values = subPage.params
      .map((param) => navParam[param])
      .filter(Boolean);
    return ['/', page.path, ...values, subPage.path];
  }

  return ['/', page.path, subPage.path];
}
