import type { Config, Plugin } from 'payload';

import type { PluginConfig } from './types/config.js';
import { onInitManager } from './pluginUtils/configHelpers.js';
import { cleanupLogsTask } from './core/automation/tasks/cleanup/cleanup.js';
import { SiteActivityCollection } from './collections/SiteActivityCollection.js';
import { attachGlobalConfig } from './pluginUtils/attachGlobalConfig/attachGlobalConfig.js';
import { attachCollectionConfig } from './pluginUtils/attachCollectionConfig/attachCollectionConfig.js';

export const siteActivity = (
  pluginConfig: PluginConfig = {},
): Plugin => {
  return async (payloadConfig: Config): Promise<Config> => {
    const config = { ...payloadConfig };

    const configuredCollection = pluginConfig.configureRootCollection?.(SiteActivityCollection) ?? SiteActivityCollection;

    const hasSiteActivityCollection = config.collections?.some(
      c => c.slug === configuredCollection.slug || c.slug === 'auditor-logs' || c.slug === 'Audit-log',
    );

    if (!hasSiteActivityCollection) {
      config.collections = [
        ...(config.collections ?? []),
        configuredCollection,
      ];
    }

    if (pluginConfig.disabled === true) {
      return config;
    }

    config.collections = attachCollectionConfig(config.collections, pluginConfig, config);
    config.globals = attachGlobalConfig(config.globals, pluginConfig, config);

    config.jobs = {
      ...config.jobs,
      tasks: [
        ...(config.jobs?.tasks ?? []),
        cleanupLogsTask({
          pluginConfig,
          internalCollectionConfig: configuredCollection,
        }),
      ],
    };

    config.onInit = onInitManager({
      payloadConfig: config,
      internalCollectionConfig: configuredCollection,
      pluginConfig,
    });

    return config;
  };
};

export const siteActivityPlugin = siteActivity;
export const payloadLoggsPlugin = siteActivity;

export default siteActivity;
