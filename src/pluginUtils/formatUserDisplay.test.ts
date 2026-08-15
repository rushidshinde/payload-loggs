import { describe, expect, it } from 'vitest';

import { formatUserDisplay } from './formatUserDisplay.js';

describe('formatUserDisplay', () => {
  it('extracts prefix before @ from email', () => {
    expect(formatUserDisplay('admin@brandlift.com')).toBe('admin');
    expect(formatUserDisplay('rushikesh.s@brandlift.com')).toBe('rushikesh.s');
    expect(formatUserDisplay('john.doe+test@example.co.uk')).toBe('john.doe+test');
  });

  it('handles invalid or empty email inputs gracefully', () => {
    expect(formatUserDisplay(undefined)).toBeUndefined();
    expect(formatUserDisplay(null)).toBeUndefined();
    expect(formatUserDisplay('')).toBeUndefined();
    expect(formatUserDisplay('  ')).toBeUndefined();
    expect(formatUserDisplay('plainname')).toBe('plainname');
  });
});
