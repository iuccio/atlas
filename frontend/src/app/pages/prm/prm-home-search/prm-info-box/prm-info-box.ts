export interface PrmInfoBoxLink {
  label: string;
  url: string;
}

export const GUIDE_LINE: PrmInfoBoxLink = {
  label: 'PRM.INFO_BOX.GUIDE_LINE_LABEL',
  url: 'PRM.INFO_BOX.GUIDE_LINE_URL',
};
export const GUIDE_LINE_ATTACHMENT: PrmInfoBoxLink = {
  label: 'PRM.INFO_BOX.GUIDE_LINE_ATTACHMENT_LABEL',
  url: 'PRM.INFO_BOX.GUIDE_LINE_ATTACHMENT_URL',
};

export const EXTERNAL_LINK: PrmInfoBoxLink = {
  label: 'PRM.INFO_BOX.EXTERNAL_LINK_LABEL',
  url: 'PRM.INFO_BOX.EXTERNAL_LINK',
};
export const DDA: PrmInfoBoxLink = {
  label: 'PRM.INFO_BOX.DDA_LABEL',
  url: 'PRM.INFO_BOX.DDA_URL',
};
export const REGULATION: PrmInfoBoxLink = {
  label: 'PRM.INFO_BOX.REGULATION_LABEL',
  url: 'PRM.INFO_BOX.REGULATION_URL',
};

export const ATTACHMENTS = [GUIDE_LINE, GUIDE_LINE_ATTACHMENT];
export const LINKS = [EXTERNAL_LINK, DDA, REGULATION];
