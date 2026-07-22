import { Reporter, ScanResult } from '../types';

export class JsonReporter implements Reporter {
  report(scanResult: ScanResult): string {
    return JSON.stringify(scanResult, null, 2);
  }
}
