import { relative, sep } from 'path';
import { Framework, Route } from '../types';
import { globFiles, normalizeRoutePath } from '../utils';

export async function scanPagesRouter(projectPath: string): Promise<Route[]> {
  const routes: Route[] = [];
  const pageFiles = await globFiles('pages/**/*.{ts,tsx,js,jsx}', projectPath);

  for (const file of pageFiles) {
    const relPath = relative(projectPath, file);
    const segments = relPath.split(sep);
    segments.shift(); // Remove 'pages'

    // Skip api directory
    if (segments[0] === 'api') continue;

    // Remove extension and handle index
    let lastSegment = segments[segments.length - 1];
    lastSegment = lastSegment.replace(/\.(ts|tsx|js|jsx)$/, '');
    if (lastSegment === 'index') {
      segments.pop();
    } else {
      segments[segments.length - 1] = lastSegment;
    }

    let path = '/' + segments.join('/');
    path = normalizeRoutePath(path);

    // Check for dynamic routes (Next.js Pages Router uses [slug])
    const isDynamic = segments.some((seg) => seg.startsWith('[') && seg.endsWith(']'));
    const isCatchAll = segments.some((seg) => seg.startsWith('[...') && seg.endsWith(']'));

    routes.push({
      path,
      framework: Framework.NextPagesRouter,
      file,
      isDynamic,
      isCatchAll,
    });
  }

  return routes;
}
