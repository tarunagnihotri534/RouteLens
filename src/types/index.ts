export enum Framework {
  ReactRouter = 'react-router',
  NextAppRouter = 'next-app-router',
  NextPagesRouter = 'next-pages-router',
  Unknown = 'unknown',
}

export interface Route {
  path: string;
  framework: Framework;
  file: string;
  line?: number;
  isDynamic?: boolean;
  isCatchAll?: boolean;
}

export enum FindingType {
  BrokenRoute = 'broken-route',
  DuplicateRoute = 'duplicate-route',
  MissingPage = 'missing-page',
  InvalidDynamicRoute = 'invalid-dynamic-route',
}

export enum FindingSeverity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export interface Finding {
  type: FindingType;
  severity: FindingSeverity;
  message: string;
  file?: string;
  line?: number;
  suggestion?: string;
}

export interface ScanResult {
  framework: Framework;
  routes: Route[];
  findings: Finding[];
  stats: {
    totalRoutes: number;
    brokenLinks: number;
    duplicateRoutes: number;
    dynamicRoutes: number;
    unusedPages: number;
  };
}

export interface Analyzer {
  analyze(routes: Route[], projectPath: string): Finding[] | Promise<Finding[]>;
}

export interface Reporter {
  report(scanResult: ScanResult): string;
}
