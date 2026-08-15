import { describe, expect, it } from 'vitest';

import { getResourceTitle } from './getResourceTitle.js';

describe('getResourceTitle', () => {
  it('prefers title over other properties', () => {
    expect(getResourceTitle({ title: 'Therapy Care', name: 'Other Name', id: '123' })).toBe('Therapy Care');
  });

  it('falls back to name, label, slug, or document id', () => {
    expect(getResourceTitle({ name: 'Header V2', id: '456' })).toBe('Header V2');
    expect(getResourceTitle({ label: 'Main Nav', id: '789' })).toBe('Main Nav');
    expect(getResourceTitle({ slug: 'my-slug', id: '101' })).toBe('my-slug');
    expect(getResourceTitle({ id: 'doc-65f8a' })).toBe('doc-65f8a');
  });

  it('uses fallbackId if doc has no title attributes', () => {
    expect(getResourceTitle(null, 'fallback-id-123')).toBe('fallback-id-123');
    expect(getResourceTitle({}, 'fallback-id-456')).toBe('fallback-id-456');
  });
});
