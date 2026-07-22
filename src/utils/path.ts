export function normalizeRoutePath(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  // Replace multiple slashes
  path = path.replace(/\/+/g, '/');
  // Remove trailing slash unless it's root
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

export function matchesRoute(pattern: string, path: string): boolean {
  // Convert route pattern to regex (simple matching for broken links check)
  // Handle dynamic segments and catch-alls
  const regexPattern = pattern
    .replace(/\[(\.\.\.)?([^\]]+)\]/g, (_match, catchAll, _name) => {
      return catchAll ? '(.*)' : '([^/]+)';
    })
    .replace(/:([^/]+)/g, '([^/]+)');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}
