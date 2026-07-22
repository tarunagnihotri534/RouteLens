#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'path';
import {
  detectFramework,
  scanAppRouter,
  scanPagesRouter,
  scanReactRouter,
  BrokenRouteAnalyzer,
  DuplicateRouteAnalyzer,
  InvalidDynamicRouteAnalyzer,
  MissingPageAnalyzer,
  CliReporter,
  JsonReporter,
  TreeReporter,
  StatsReporter,
  Framework,
  Route,
  Finding,
  FindingType,
  ScanResult,
} from '..';

const program = new Command();
program
  .name('routeguard')
  .description('Static analysis tool for React/Next.js routing issues')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan a project for routing issues')
  .option('-p, --path <path>', 'Path to project', '.')
  .option('-j, --json', 'Output JSON')
  .option('-t, --tree', 'Show route tree')
  .option('-s, --stats', 'Show only stats')
  .action(async (options) => {
    const projectPath = resolve(options.path);
    const framework = detectFramework(projectPath);

    let routes: Route[] = [];

    switch (framework) {
      case Framework.NextAppRouter:
        routes = await scanAppRouter(projectPath);
        break;
      case Framework.NextPagesRouter:
        routes = await scanPagesRouter(projectPath);
        break;
      case Framework.ReactRouter:
        routes = await scanReactRouter(projectPath);
        break;
      default: {
        console.log('Unknown framework, trying all scanners...');
        const [appRoutes, pagesRoutes, rrRoutes] = await Promise.all([
          scanAppRouter(projectPath),
          scanPagesRouter(projectPath),
          scanReactRouter(projectPath),
        ]);
        routes = [...appRoutes, ...pagesRoutes, ...rrRoutes];
        break;
      }
    }

    // Run analyzers
    const duplicateAnalyzer = new DuplicateRouteAnalyzer();
    const invalidAnalyzer = new InvalidDynamicRouteAnalyzer();
    const brokenAnalyzer = new BrokenRouteAnalyzer();
    const missingAnalyzer = new MissingPageAnalyzer();

    const duplicateFindings = duplicateAnalyzer.analyze(routes);
    const invalidFindings = invalidAnalyzer.analyze(routes);
    const brokenFindings = await brokenAnalyzer.analyze(routes, projectPath);
    const missingFindings = missingAnalyzer.analyze(routes, projectPath);
    const findings: Finding[] = [
      ...duplicateFindings,
      ...invalidFindings,
      ...brokenFindings,
      ...missingFindings,
    ];

    // Compute stats
    const totalRoutes = routes.length;
    const brokenLinks = findings.filter((f) => f.type === FindingType.BrokenRoute).length;
    const duplicateRoutes = findings.filter(
      (f) => f.type === FindingType.DuplicateRoute && !f.message.startsWith('  -')
    ).length;
    const dynamicRoutes = routes.filter((r) => r.isDynamic).length;
    const unusedPages = 0; // TODO: implement

    const scanResult: ScanResult = {
      framework,
      routes,
      findings,
      stats: {
        totalRoutes,
        brokenLinks,
        duplicateRoutes,
        dynamicRoutes,
        unusedPages,
      },
    };

    if (options.json) {
      const reporter = new JsonReporter();
      console.log(reporter.report(scanResult));
    } else if (options.tree) {
      const reporter = new TreeReporter();
      console.log(reporter.report(scanResult));
    } else if (options.stats) {
      const reporter = new StatsReporter();
      console.log(reporter.report(scanResult));
    } else {
      const reporter = new CliReporter();
      console.log(reporter.report(scanResult));
    }
  });

program.parse();
