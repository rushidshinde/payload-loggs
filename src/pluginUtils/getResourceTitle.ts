/**
 * Extracts a human-readable resource title from a document or global data object,
 * falling back to document ID if title attributes are missing.
 */
export const getResourceTitle = (
  doc?: Record<string, any> | null,
  fallbackId?: string | number | null,
): string | undefined => {
  if (!doc && fallbackId !== undefined && fallbackId !== null) {
    return String(fallbackId);
  }
  if (!doc) {
    return undefined;
  }

  const titleCandidate = doc.title || doc.name || doc.label || doc.slug;
  if (titleCandidate && typeof titleCandidate === 'string') {
    return titleCandidate;
  }
  if (titleCandidate && typeof titleCandidate === 'object' && titleCandidate !== null) {
    // Handling localized fields if title/name is an object
    const firstVal = Object.values(titleCandidate).find(v => typeof v === 'string' && v.trim() !== '');
    if (firstVal && typeof firstVal === 'string') {
      return firstVal;
    }
  }

  if (doc.id !== undefined && doc.id !== null) {
    return String(doc.id);
  }

  if (fallbackId !== undefined && fallbackId !== null) {
    return String(fallbackId);
  }

  return undefined;
};
