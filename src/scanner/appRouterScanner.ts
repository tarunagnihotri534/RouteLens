import { relative, sep } from 'path';
import { Framework, Route } from '../types';
import { globFiles, normalizeRoutePath } from '../utils';

export async function scanAppRouter(projectPath: string): Promise<Route[]> {
  const routes: Route[] = [];
  const pageFiles = await globFiles('app/**/page.{ts,tsx,js,jsx}', projectPath);

  for (const file of pageFiles) {
    // Compute relative path
    const relPath = relative(projectPath, file);
    // Split into segments: app/[group]/blog/[slug]/page.tsx
    const segments = relPath.split(sep);
    // Remove 'app'
    segments.shift();
    // Remove 'page.*'
    segments.pop();

    // Filter out route groups (segments in parentheses)
    const filteredSegments = segments.filter((seg) => !seg.startsWith('(') && !seg.endsWith(')'));

    let path = '/' + filteredSegments.join('/');
    path = normalizeRoutePath(path);

    // Check if dynamic or catch-all
    const isDynamic = filteredSegments.some((seg) => seg.startsWith('[') && seg.endsWith(']'));
    const isCatchAll = filteredSegments.some((seg) => seg.startsWith('[...') && seg.endsWith(']'));

    routes.push({
      path,
      framework: Framework.NextAppRouter,
      file,
      isDynamic,
      isCatchAll,
    });
  }

  return routes;
}
