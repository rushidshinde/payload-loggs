import { describe, expect, it } from 'vitest';

import { getCollectionLabel } from './getCollectionLabel.js';

describe('getCollectionLabel', () => {
  it('extracts singular label from collection config', () => {
    expect(getCollectionLabel({ slug: 'pages', labels: { singular: 'Page', plural: 'Pages' } })).toBe('Page');
  });

  it('extracts label from global config', () => {
    expect(getCollectionLabel({ slug: 'header', label: 'Header Navigation' })).toBe('Header Navigation');
  });

  it('falls back to capitalized slug if labels are omitted', () => {
    expect(getCollectionLabel({ slug: 'user-profiles' })).toBe('User Profiles');
    expect(getCollectionLabel({ slug: 'posts' })).toBe('Posts');
  });
});
