import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionAfterLoginHook, CollectionAfterLogoutHook, CollectionConfig, Config } from 'payload';

import type { PluginConfig } from '../types/config.js';
import { getResourceTitle } from '../pluginUtils/getResourceTitle.js';
import { formatUserDisplay } from '../pluginUtils/formatUserDisplay.js';
import { getCollectionLabel } from '../pluginUtils/getCollectionLabel.js';
import { SITE_ACTIVITY_SLUG } from '../collections/SiteActivityCollection.js';

export const createCollectionAfterChangeHook = (
  collection: CollectionConfig,
  payloadConfig: Config,
  _pluginConfig?: PluginConfig,
): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, operation, req }) => {
    if (!req || req.context?.skipLogs || req.context?.skipAuditorLogs) {
      return doc;
    }

    try {
      const isCreate = operation === 'create' || !previousDoc;
      const opType = isCreate ? 'create' : 'update';
      const label = getCollectionLabel(collection);
      const title = isCreate ? `${label} created` : `${label} modified`;

      const resourceName = getResourceTitle(doc, doc?.id);
      const isLocalizationEnabled = Boolean(payloadConfig.localization);
      const locale = isLocalizationEnabled ? req.locale : undefined;

      const userEmail = req.user?.email || (doc && typeof doc === 'object' && 'email' in doc && typeof doc.email === 'string' ? doc.email : undefined);
      const userDisplay = formatUserDisplay(userEmail);
      const userId = req.user?.id || (doc && typeof doc === 'object' && 'id' in doc ? doc.id : undefined);

      await req.payload.create({
        collection: SITE_ACTIVITY_SLUG,
        data: {
          title,
          operation: opType,
          resourceName,
          resourceType: 'collection',
          collectionLabel: label,
          slug: collection.slug,
          documentId: doc?.id ? String(doc.id) : undefined,
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
      req.payload?.logger?.error?.(`[payload-loggs] Error logging collection afterChange for ${collection.slug}: ${error}`);
    }

    return doc;
  };
};

export const createCollectionAfterDeleteHook = (
  collection: CollectionConfig,
  payloadConfig: Config,
  _pluginConfig?: PluginConfig,
): CollectionAfterDeleteHook => {
  return async ({ doc, id, req }) => {
    if (!req || req.context?.skipLogs || req.context?.skipAuditorLogs) {
      return doc;
    }

    try {
      const label = getCollectionLabel(collection);
      const title = `${label} deleted`;

      const resourceName = getResourceTitle(doc, id);
      const isLocalizationEnabled = Boolean(payloadConfig.localization);
      const locale = isLocalizationEnabled ? req.locale : undefined;

      const userEmail = req.user?.email || (doc && typeof doc === 'object' && 'email' in doc && typeof doc.email === 'string' ? doc.email : undefined);
      const userDisplay = formatUserDisplay(userEmail);
      const userId = req.user?.id || (doc && typeof doc === 'object' && 'id' in doc ? doc.id : undefined);

      await req.payload.create({
        collection: SITE_ACTIVITY_SLUG,
        data: {
          title,
          operation: 'delete',
          resourceName,
          resourceType: 'collection',
          collectionLabel: label,
          slug: collection.slug,
          documentId: id ? String(id) : undefined,
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
      req.payload?.logger?.error?.(`[payload-loggs] Error logging collection afterDelete for ${collection.slug}: ${error}`);
    }

    return doc;
  };
};

export const createCollectionAfterLoginHook = (
  collection: CollectionConfig,
  _payloadConfig: Config,
  _pluginConfig?: PluginConfig,
): CollectionAfterLoginHook => {
  return async ({ user, req }) => {
    if (!req || req.context?.skipLogs || req.context?.skipAuditorLogs) {
      return user;
    }

    try {
      const label = getCollectionLabel(collection);
      const userEmail = user?.email || req.user?.email;
      const userDisplay = formatUserDisplay(userEmail);
      const title = userDisplay ? `User ${userDisplay} logged in` : `${label} logged in`;

      await req.payload.create({
        collection: SITE_ACTIVITY_SLUG,
        data: {
          title,
          operation: 'login',
          resourceName: userEmail || String(user?.id || 'User'),
          resourceType: 'collection',
          collectionLabel: label,
          slug: collection.slug,
          documentId: user?.id ? String(user.id) : undefined,
          ...(user?.id !== undefined && user?.id !== null ? { user: user.id } : {}),
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
      req.payload?.logger?.error?.(`[payload-loggs] Error logging afterLogin for ${collection.slug}: ${error}`);
    }

    return user;
  };
};

export const createCollectionAfterLogoutHook = (
  collection: CollectionConfig,
  _payloadConfig: Config,
  _pluginConfig?: PluginConfig,
): CollectionAfterLogoutHook => {
  return async ({ req }) => {
    if (!req || req.context?.skipLogs || req.context?.skipAuditorLogs) {
      return;
    }

    try {
      const label = getCollectionLabel(collection);
      const userEmail = req.user?.email;
      const userDisplay = formatUserDisplay(userEmail);
      const title = userDisplay ? `User ${userDisplay} logged out` : `${label} logged out`;

      await req.payload.create({
        collection: SITE_ACTIVITY_SLUG,
        data: {
          title,
          operation: 'logout',
          resourceName: userEmail || String(req.user?.id || 'User'),
          resourceType: 'collection',
          collectionLabel: label,
          slug: collection.slug,
          documentId: req.user?.id ? String(req.user.id) : undefined,
          ...(req.user?.id !== undefined && req.user?.id !== null ? { user: req.user.id } : {}),
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
      req.payload?.logger?.error?.(`[payload-loggs] Error logging afterLogout for ${collection.slug}: ${error}`);
    }
  };
};
