/**
 * Extracts a shortened display name from an email address (everything before '@').
 * Example: "rushikesh.s@brandlift.com" -> "rushikesh.s"
 */
export const formatUserDisplay = (email?: string | null): string | undefined => {
  if (!email || typeof email !== 'string') {
    return undefined;
  }
  const trimmed = email.trim();
  if (!trimmed) {
    return undefined;
  }
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0) {
    return trimmed;
  }
  return trimmed.substring(0, atIndex);
};
