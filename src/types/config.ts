import type {
  CollectionConfig,
} from 'payload';

import type { GlobalsTrackConfig } from './global.js';
import type { BufferConfig } from '../core/buffer/types.js';
import type { CollectionsTrackConfig } from './collection.js';
import type { siteActivity } from '../collections/siteActivity.js';

export interface AutomationConfig {
  logCleanup?: {
    /**
     * @default 2592000000 // 30 days
     */
    olderThan?: number;
    /**
     * @default "payload-loggs-queue"
     */
    queueName?: string;
    /**
     * The cron for scheduling the job.
     *
     * @default '1 0 * * *' // At 00:01 AM daily
     *
     * @example
     *     ┌───────────── (optional) second (0 - 59)
     *     │ ┌───────────── minute (0 - 59)
     *     │ │ ┌───────────── hour (0 - 23)
     *     │ │ │ ┌───────────── day of the month (1 - 31)
     *     │ │ │ │ ┌───────────── month (1 - 12)
     *     │ │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
     *     │ │ │ │ │ │
     *     │ │ │ │ │ │
     *  - '* 0 * * * *' every hour at minute 0
     *  - '* 0 0 * * *' daily at midnight
     *  - '* 0 0 * * 0' weekly at midnight on Sundays
     *  - '* 0 0 1 * *' monthly at midnight on the 1st day of the month
     *  - '* 0/5 * * * *' every 5 minutes
     *  - '* * * * * *' every second
     */
    cronTime?: string;
  };
}

export interface PluginConfig {
  /**
   * @see {@link https://github.com/rushidshinde/payload-loggs#automation}
   */
  automation?: AutomationConfig;
  /**
   * @see {@link https://github.com/rushidshinde/payload-loggs#collectionsglobals}
   */
  collections?: CollectionsTrackConfig;

  /**
   * @see {@link https://github.com/rushidshinde/payload-loggs#buffer}
   */
  buffer?: BufferConfig;

  /**
   * @see {@link https://github.com/rushidshinde/payload-loggs#configurerootcollection}
   */
  configureRootCollection?: (defaults: typeof siteActivity) => CollectionConfig;

  /**
   * @see {@link https://github.com/rushidshinde/payload-loggs#collectionsglobals}
   */
  globals?: GlobalsTrackConfig;
  disabled?: boolean;
}
