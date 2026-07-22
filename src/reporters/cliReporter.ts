import chalk from 'chalk';
import { Reporter, ScanResult, FindingSeverity } from '../types';

export class CliReporter implements Reporter {
  report(scanResult: ScanResult): string {
    let output = '';

    // Route Summary
    const sortedRoutes = [...scanResult.routes].sort((a, b) => a.path.localeCompare(b.path));
    output += chalk.blue.bold('\nRoute Summary:\n');
    sortedRoutes.forEach((route) => {
      output += `  ${route.path}\n`;
    });

    // Findings
    output += chalk.blue.bold('\nFindings:\n');
    scanResult.findings.forEach((finding) => {
      let icon = '';
      let color: any;
      switch (finding.severity) {
        case FindingSeverity.Error:
          icon = '✗';
          color = chalk.red;
          break;
        case FindingSeverity.Warning:
          icon = '⚠';
          color = chalk.yellow;
          break;
        default:
          icon = '✓';
          color = chalk.green;
      }
      let line = `  ${color.bold(icon)} ${finding.message}`;
      if (finding.file) {
        line += `\n    at ${finding.file}${finding.line ? `:${finding.line}` : ''}`;
      }
      output += line + '\n';
    });

    // Stats
    const { stats } = scanResult;
    output += chalk.blue.bold('\nStatistics:\n');
    output += `  Total Routes:      ${stats.totalRoutes}\n`;
    output += `  Broken Links:       ${stats.brokenLinks}\n`;
    output += `  Duplicate Routes:   ${stats.duplicateRoutes}\n`;
    output += `  Dynamic Routes:     ${stats.dynamicRoutes}\n`;
    output += `  Unused Pages:       ${stats.unusedPages}\n`;

    return output;
  }
}
