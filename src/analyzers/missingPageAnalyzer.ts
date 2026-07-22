import { Analyzer, Finding, Route } from '../types';

export class MissingPageAnalyzer implements Analyzer {
  analyze(_routes: Route[], _projectPath: string): Finding[] {
    // For now, returns empty array; can be enhanced to find pages not linked to
    return [];
  }
}
