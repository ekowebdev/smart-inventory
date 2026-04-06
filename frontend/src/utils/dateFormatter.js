/**
 * Helper utility to format raw ISO date strings into human-readable formats.
 * It automatically uses the user's localized browser timezone.
 */

export const formatReadableDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Example Output: 06 Apr 2026, 16:40
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
};

/**
 * Format a date just for the time portion.
 */
export const formatTimeOnly = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};
