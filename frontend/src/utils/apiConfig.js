/**
 * Resolves API URL dynamically for development (port 3000 -> 5000)
 * and production (relative path on Render).
 */
export function getApiUrl(endpoint) {
  if (!endpoint) return '';
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (
    typeof window !== 'undefined' &&
    window.location.hostname === 'localhost' &&
    window.location.port === '3000'
  ) {
    return `http://localhost:5000${clean}`;
  }
  return clean;
}
