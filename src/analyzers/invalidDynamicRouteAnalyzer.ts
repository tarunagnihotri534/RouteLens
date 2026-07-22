import { Analyzer, Finding, FindingSeverity, FindingType, Framework, Route } from '../types';

export class InvalidDynamicRouteAnalyzer implements Analyzer {
  analyze(routes: Route[]): Finding[] {
    const findings: Finding[] = [];

    for (const route of routes) {
      if (
        route.framework === Framework.NextAppRouter ||
        route.framework === Framework.NextPagesRouter
      ) {
        // Check for React Router style segments (:slug)
        if (route.path.includes(':')) {
          // Suggest Next.js style
          const suggestedPath = route.path.replace(/:([^/]+)/g, '[$1]');
          findings.push({
            type: FindingType.InvalidDynamicRoute,
            severity: FindingSeverity.Error,
            message: `${route.path} → did you mean ${suggestedPath}?`,
            file: route.file,
            line: route.line,
            suggestion: suggestedPath,
          });
        }
      }
    }

    return findings;
  }
}
