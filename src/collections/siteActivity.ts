import type { GlobalHooksKeys } from '../types/global.js';
import { SiteActivityCollection } from './SiteActivityCollection.js';
import type { SiteActivityLogData } from './SiteActivityCollection.js';
import type { CollectionHooksKeys, CollectionHooksOperation } from '../types/collection.js';

export interface SiteActivityLog extends Omit<Partial<SiteActivityLogData>, 'operation'> {
  scope?: 'collection' | 'global' | 'field';
  hook?: CollectionHooksKeys | GlobalHooksKeys | string;
  operation: CollectionHooksOperation;
  timestamp?: Date;
  userAgent?: string;
  identifier?: string;
}

export type { SiteActivityLogData };
export type TypedRootCollection = typeof SiteActivityCollection;
export const siteActivity = SiteActivityCollection;
export const siteActivityCollection = SiteActivityCollection;

export default siteActivity;
