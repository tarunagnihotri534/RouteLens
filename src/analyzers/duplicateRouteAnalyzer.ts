import { Analyzer, Finding, FindingSeverity, FindingType, Route } from '../types';

export class DuplicateRouteAnalyzer implements Analyzer {
  analyze(routes: Route[]): Finding[] {
    const findings: Finding[] = [];
    const pathMap = new Map<string, Route[]>();

    for (const route of routes) {
      if (!pathMap.has(route.path)) {
        pathMap.set(route.path, []);
      }
      pathMap.get(route.path)!.push(route);
    }

    for (const [path, routeList] of pathMap.entries()) {
      if (routeList.length > 1) {
        findings.push({
          type: FindingType.DuplicateRoute,
          severity: FindingSeverity.Warning,
          message: `Duplicate route detected: ${path}`,
        });
        for (const route of routeList) {
          findings.push({
            type: FindingType.DuplicateRoute,
            severity: FindingSeverity.Warning,
            message: `  - ${route.file}${route.line ? `:${route.line}` : ''}`,
            file: route.file,
            line: route.line,
          });
        }
      }
    }

    return findings;
  }
}
