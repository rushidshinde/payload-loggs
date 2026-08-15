import type { Config } from 'payload';
import { describe, expect, it } from 'vitest';

import { SITE_ACTIVITY_SLUG } from './collections/SiteActivityCollection.js';
import { payloadLoggsPlugin, siteActivity, siteActivityPlugin } from './plugin.js';

describe('siteActivity plugin', () => {
  const baseConfig = {
    collections: [
      {
        slug: 'pages',
        labels: { singular: 'Page', plural: 'Pages' },
        fields: [{ name: 'title', type: 'text' }],
      },
      {
        slug: 'posts',
        labels: { singular: 'Post', plural: 'Posts' },
        fields: [{ name: 'content', type: 'text' }],
      },
    ],
    globals: [
      {
        slug: 'header',
        label: 'Header V2',
        fields: [{ name: 'nav', type: 'text' }],
      },
    ],
    secret: 'test-secret',
  } as unknown as Config;

  it('exports aliases correctly', () => {
    expect(siteActivity).toBe(siteActivityPlugin);
    expect(siteActivity).toBe(payloadLoggsPlugin);
  });

  it('registers site-activity collection with strict read-only access control', async () => {
    const plugin = siteActivity();
    const resultConfig = await plugin({ ...baseConfig });

    const activityCollection = resultConfig.collections?.find(c => c.slug === SITE_ACTIVITY_SLUG);
    expect(activityCollection).toBeDefined();
    expect(activityCollection?.slug).toBe('site-activity');

    // Access control verification
    const access = activityCollection?.access;
    expect(access?.create?.({} as any)).toBe(false);
    expect(access?.update?.({} as any)).toBe(false);
    expect(access?.delete?.({} as any)).toBe(false);

    expect(access?.read?.({ req: { user: { id: 'user-1' } } } as any)).toBe(true);
    expect(access?.read?.({ req: {} } as any)).toBe(false);
  });

  it('zero-config mode automatically tracks all collections and globals by default', async () => {
    const plugin = siteActivity();
    const resultConfig = await plugin({ ...baseConfig });

    const pages = resultConfig.collections?.find(c => c.slug === 'pages');
    const posts = resultConfig.collections?.find(c => c.slug === 'posts');
    const activityCol = resultConfig.collections?.find(c => c.slug === SITE_ACTIVITY_SLUG);
    const header = resultConfig.globals?.find(g => g.slug === 'header');

    expect(pages?.hooks?.afterChange?.length).toBeGreaterThan(0);
    expect(pages?.hooks?.afterDelete?.length).toBeGreaterThan(0);

    expect(posts?.hooks?.afterChange?.length).toBeGreaterThan(0);
    expect(posts?.hooks?.afterDelete?.length).toBeGreaterThan(0);

    expect(header?.hooks?.afterChange?.length).toBeGreaterThan(0);

    // Site activity collection itself should NOT have audit hooks attached
    expect(activityCol?.hooks?.afterChange).toBeUndefined();
  });

  it('respects selective granular configuration when track is explicitly defined', async () => {
    const plugin = siteActivity({
      collections: {
        track: [
          { slug: 'pages' as any },
        ],
      },
      globals: {
        track: [],
      },
    });

    const resultConfig = await plugin({ ...baseConfig });

    const pages = resultConfig.collections?.find(c => c.slug === 'pages');
    const posts = resultConfig.collections?.find(c => c.slug === 'posts');
    const header = resultConfig.globals?.find(g => g.slug === 'header');

    expect(pages?.hooks?.afterChange?.length).toBeGreaterThan(0);
    expect(posts?.hooks?.afterChange).toBeUndefined();
    expect(header?.hooks?.afterChange).toBeUndefined();
  });
});
