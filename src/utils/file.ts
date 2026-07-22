import { existsSync, readFileSync } from 'fs';
import fg from 'fast-glob';

export async function globFiles(pattern: string | string[], cwd: string): Promise<string[]> {
  return fg(pattern, { cwd, absolute: true, onlyFiles: true });
}

export function readFileIfExists(path: string): string | null {
  if (existsSync(path)) {
    return readFileSync(path, 'utf-8');
  }
  return null;
}
