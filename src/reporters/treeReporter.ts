import { Reporter, ScanResult } from '../types';

interface TreeNode {
  name: string;
  children: TreeNode[];
}

export class TreeReporter implements Reporter {
  report(scanResult: ScanResult): string {
    const { routes } = scanResult;

    // Build tree
    const root: TreeNode = { name: '', children: [] };

    for (const route of routes) {
      // Skip root for now
      if (route.path === '/') continue;

      const segments = route.path.split('/').filter(Boolean);
      let current = root;

      for (const segment of segments) {
        let child = current.children.find((c) => c.name === segment);
        if (!child) {
          child = { name: segment, children: [] };
          current.children.push(child);
        }
        current = child;
      }
    }

    // Build string
    let output = '/\n';

    // Sort children
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((n) => sortNodes(n.children));
    };
    sortNodes(root.children);

    const printNode = (node: TreeNode, prefix: string, isLast: boolean) => {
      const connector = isLast ? '└── ' : '├── ';
      output += prefix + connector + node.name + '\n';
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      for (let i = 0; i < node.children.length; i++) {
        printNode(node.children[i], newPrefix, i === node.children.length - 1);
      }
    };

    for (let i = 0; i < root.children.length; i++) {
      printNode(root.children[i], '', i === root.children.length - 1);
    }

    return output;
  }
}
