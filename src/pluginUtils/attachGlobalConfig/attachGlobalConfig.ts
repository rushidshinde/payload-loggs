import type { Config } from 'payload';

import type { PluginConfig } from '../../types/config.js';
import type { GlobalHooksKeys } from '../../types/global.js';
import { createGlobalAfterChangeHook } from '../../hooks/globalHooks.js';
import { logBuilderManager } from '../../core/log-builders/logBuilderManager/logBuilderManager.js';

export const attachGlobalConfig = (
  userGlobals: Config['globals'],
  pluginOpts: PluginConfig,
  payloadConfig: Config,
): Config['globals'] => {
  if (!userGlobals || !Array.isArray(userGlobals)) {
    return userGlobals;
  }

  const globalsTrackConfig = pluginOpts.globals;
  const isZeroConfig = !globalsTrackConfig || !globalsTrackConfig.track;
  const trackedList = globalsTrackConfig?.track ?? [];

  return userGlobals.map((globalConfig) => {
    const tracked = trackedList.find(tg => tg.slug === globalConfig.slug);
    const shouldTrack = isZeroConfig || Boolean(tracked);

    if (!shouldTrack) {
      return globalConfig;
    }

    const updatedGlobal = { ...globalConfig };
    updatedGlobal.hooks = { ...updatedGlobal.hooks };

    // Attach high-level activity feed hook for global change
    const globalAfterChangeHook = createGlobalAfterChangeHook(updatedGlobal, payloadConfig, pluginOpts);

    updatedGlobal.hooks.afterChange = [
      ...(updatedGlobal.hooks.afterChange || []),
      globalAfterChangeHook,
    ];

    // Preserve legacy / granular custom hook configs if provided (filtering out read-only hooks)
    if (tracked?.hooks) {
      for (const hookName in tracked.hooks) {
        const typedHookName = hookName as GlobalHooksKeys;

        // Skip read operations and afterChange (already attached)
        if (typedHookName === 'afterChange' || typedHookName === 'beforeRead' || typedHookName === 'afterRead' || typedHookName === 'beforeValidate') {
          continue;
        }

        const existingHooks = (updatedGlobal.hooks as any)[typedHookName] || [];
        (updatedGlobal.hooks as any)[typedHookName] = [
          ...existingHooks,
          async (args: any) => logBuilderManager({
            scopeSlug: 'global',
            hookArgs: args,
            pluginConfig: pluginOpts,
            targetHookLevelConfig: tracked.hooks?.[typedHookName],
            targetHookName: typedHookName,
            identifier: globalConfig.slug,
          }),
        ];
      }
    }

    return updatedGlobal;
  });
};
