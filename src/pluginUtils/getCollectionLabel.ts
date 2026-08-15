import type { CollectionConfig, GlobalConfig } from 'payload';

/**
 * Resolves a human-readable singular label for a collection or global.
 * Defaults to capitalizing the slug if labels are omitted.
 */
export const getCollectionLabel = (
  entity: CollectionConfig | GlobalConfig | { slug: string; labels?: any; label?: any },
): string => {
  if (!entity) {
    return 'Resource';
  }

  // Check collection singular label
  if ('labels' in entity && entity.labels) {
    const singular = typeof entity.labels === 'object' ? entity.labels.singular : entity.labels;
    if (typeof singular === 'string' && singular) {
      return singular;
    }
    if (typeof singular === 'object' && singular !== null) {
      const firstVal = Object.values(singular).find(v => typeof v === 'string' && v.trim() !== '');
      if (firstVal && typeof firstVal === 'string') {
        return firstVal;
      }
    }
  }

  // Check global label
  if ('label' in entity && entity.label) {
    if (typeof entity.label === 'string' && entity.label) {
      return entity.label;
    }
    if (typeof entity.label === 'object' && entity.label !== null) {
      const firstVal = Object.values(entity.label).find(v => typeof v === 'string' && v.trim() !== '');
      if (firstVal && typeof firstVal === 'string') {
        return firstVal;
      }
    }
  }

  // Fallback: capitalize slug
  const slug = entity.slug || '';
  if (!slug) {
    return 'Resource';
  }
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
