import { getResourceTitle } from './pluginUtils/getResourceTitle.js';
import type { SiteActivityLog } from './collections/siteActivity.js';
import { formatUserDisplay } from './pluginUtils/formatUserDisplay.js';
import { getCollectionLabel } from './pluginUtils/getCollectionLabel.js';
import { payloadLoggsPlugin, siteActivity, siteActivityPlugin } from './plugin.js';
import { siteActivity as siteActivityCollection } from './collections/siteActivity.js';
import { SITE_ACTIVITY_SLUG, SiteActivityCollection } from './collections/SiteActivityCollection.js';

export type { SiteActivityLogData } from './collections/SiteActivityCollection.js';
export type { AutomationConfig, PluginConfig } from './types/config.js';
export type { SiteActivityLog };

export {
  formatUserDisplay,
  getCollectionLabel,
  getResourceTitle,
  payloadLoggsPlugin,
  SITE_ACTIVITY_SLUG,
  siteActivity,
  SiteActivityCollection,
  siteActivityCollection,
  siteActivityPlugin,
};

export default siteActivity;
