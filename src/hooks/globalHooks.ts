import type { Config, GlobalAfterChangeHook, GlobalConfig } from 'payload';

import type { PluginConfig } from '../types/config.js';
import { getResourceTitle } from '../pluginUtils/getResourceTitle.js';
import { formatUserDisplay } from '../pluginUtils/formatUserDisplay.js';
import { getCollectionLabel } from '../pluginUtils/getCollectionLabel.js';
import { SITE_ACTIVITY_SLUG } from '../collections/SiteActivityCollection.js';

export const createGlobalAfterChangeHook = (
  globalConfig: GlobalConfig,
  payloadConfig: Config,
  _pluginConfig?: PluginConfig,
): GlobalAfterChangeHook => {
  return async ({ doc, req }) => {
    if (!req || req.context?.skipLogs || req.context?.skipAuditorLogs) {
      return doc;
    }

    try {
      const label = getCollectionLabel(globalConfig);
      const title = `Global ${label} updated`;

      const resourceName = getResourceTitle(doc) || label;
      const isLocalizationEnabled = Boolean(payloadConfig.localization);
      const locale = isLocalizationEnabled ? req.locale : undefined;

      const userEmail = req.user?.email;
      const userDisplay = formatUserDisplay(userEmail);
      const userId = req.user?.id;

      await req.payload.create({
        collection: SITE_ACTIVITY_SLUG,
        data: {
          title,
          operation: 'update',
          resourceName,
          resourceType: 'global',
          collectionLabel: label,
          slug: globalConfig.slug,
          ...(locale ? { locale } : {}),
          ...(userId !== undefined && userId !== null ? { user: userId } : {}),
          ...(userEmail ? { userEmail } : {}),
          ...(userDisplay ? { userDisplay } : {}),
        },
        req,
        overrideAccess: true,
        context: {
          ...req.context,
          skipLogs: true,
          skipAuditorLogs: true,
        },
      });
    }
    catch (error) {
      req.payload?.logger?.error?.(`[payload-loggs] Error logging global afterChange for ${globalConfig.slug}: ${error}`);
    }

    return doc;
  };
};
