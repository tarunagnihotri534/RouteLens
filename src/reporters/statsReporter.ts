import { Reporter, ScanResult } from '../types';

export class StatsReporter implements Reporter {
  report(scanResult: ScanResult): string {
    const { stats } = scanResult;
    return `Total Routes:      ${stats.totalRoutes}
Broken Links:       ${stats.brokenLinks}
Duplicate Routes:   ${stats.duplicateRoutes}
Dynamic Routes:     ${stats.dynamicRoutes}
Unused Pages:       ${stats.unusedPages}`;
  }
}
