import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Framework } from '../types';

export function detectFramework(projectPath: string): Framework {
  // Check for Next.js
  const packageJsonPath = join(projectPath, 'package.json');
  let hasNext = false;
  let hasReactRouter = false;

  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      hasNext = 'next' in deps;
      hasReactRouter = 'react-router' in deps || 'react-router-dom' in deps;
    } catch {
      // ignore parse errors
    }
  }

  // Check for App Router
  const appDir = join(projectPath, 'app');
  const hasAppDir = existsSync(appDir);

  // Check for Pages Router
  const pagesDir = join(projectPath, 'pages');
  const hasPagesDir = existsSync(pagesDir);

  if (hasNext) {
    if (hasAppDir) {
      return Framework.NextAppRouter;
    }
    if (hasPagesDir) {
      return Framework.NextPagesRouter;
    }
  }

  if (hasReactRouter) {
    return Framework.ReactRouter;
  }

  // Fallback checks
  if (hasAppDir) return Framework.NextAppRouter;
  if (hasPagesDir) return Framework.NextPagesRouter;

  return Framework.Unknown;
}
