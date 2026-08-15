import type { Config } from 'payload';

import type { PluginConfig } from '../../types/config.js';
import type { CollectionHooksKeys } from '../../types/collection.js';
import { SITE_ACTIVITY_SLUG } from '../../collections/SiteActivityCollection.js';
import { logBuilderManager } from '../../core/log-builders/logBuilderManager/logBuilderManager.js';
import {
  createCollectionAfterChangeHook,
  createCollectionAfterDeleteHook,
  createCollectionAfterLoginHook,
  createCollectionAfterLogoutHook,
} from '../../hooks/collectionHooks.js';

export const attachCollectionConfig = (
  userCollections: Config['collections'],
  pluginOpts: PluginConfig,
  payloadConfig: Config,
): Config['collections'] => {
  if (!userCollections || !Array.isArray(userCollections)) {
    return userCollections;
  }

  const collectionsTrackConfig = pluginOpts.collections;
  const isZeroConfig = !collectionsTrackConfig || !collectionsTrackConfig.track;
  const trackedList = collectionsTrackConfig?.track ?? [];

  return userCollections.map((collection) => {
    // Never attach auditor hooks to the site-activity collection itself to prevent infinite loops
    if (collection.slug === SITE_ACTIVITY_SLUG || collection.slug === 'auditor-logs' || collection.slug === 'Audit-log') {
      return collection;
    }

    const trackedConfig = trackedList.find(tc => tc.slug === collection.slug);
    const shouldTrack = isZeroConfig || Boolean(trackedConfig);

    if (!shouldTrack) {
      return collection;
    }

    const updatedCollection = { ...collection };
    updatedCollection.hooks = { ...updatedCollection.hooks };

    // Attach high-level activity feed hooks
    const afterChangeHook = createCollectionAfterChangeHook(updatedCollection, payloadConfig, pluginOpts);
    const afterDeleteHook = createCollectionAfterDeleteHook(updatedCollection, payloadConfig, pluginOpts);

    updatedCollection.hooks.afterChange = [
      ...(updatedCollection.hooks.afterChange || []),
      afterChangeHook,
    ];

    updatedCollection.hooks.afterDelete = [
      ...(updatedCollection.hooks.afterDelete || []),
      afterDeleteHook,
    ];

    // Attach auth hooks for auth-enabled collections (e.g. users)
    if (collection.auth) {
      const afterLoginHook = createCollectionAfterLoginHook(updatedCollection, payloadConfig, pluginOpts);
      const afterLogoutHook = createCollectionAfterLogoutHook(updatedCollection, payloadConfig, pluginOpts);

      updatedCollection.hooks.afterLogin = [
        ...(updatedCollection.hooks.afterLogin || []),
        afterLoginHook,
      ];

      updatedCollection.hooks.afterLogout = [
        ...(updatedCollection.hooks.afterLogout || []),
        afterLogoutHook,
      ];
    }

    // Preserve legacy / granular custom hook configs if provided (filtering out read-only hooks)
    if (trackedConfig?.hooks) {
      for (const hookName in trackedConfig.hooks) {
        const typedHookName = hookName as CollectionHooksKeys;

        // Skip read operations and hooks already attached
        if (
          typedHookName === 'afterChange'
          || typedHookName === 'afterDelete'
          || typedHookName === 'afterLogin'
          || typedHookName === 'afterLogout'
          || typedHookName === 'beforeRead'
          || typedHookName === 'afterRead'
          || typedHookName === 'beforeValidate'
        ) {
          continue;
        }

        const existingHooks = (updatedCollection.hooks as any)[typedHookName] || [];
        (updatedCollection.hooks as any)[typedHookName] = [
          ...existingHooks,
          async (args: any) => logBuilderManager({
            scopeSlug: 'collection',
            hookArgs: args,
            pluginConfig: pluginOpts,
            targetHookLevelConfig: trackedConfig.hooks?.[typedHookName],
            targetHookName: typedHookName,
            identifier: collection.slug,
          }),
        ];
      }
    }

    return updatedCollection;
  });
};
