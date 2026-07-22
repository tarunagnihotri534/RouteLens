import {
  SyntaxKind,
  JsxOpeningElement,
  JsxAttribute,
  JsxExpression,
  CallExpression,
  StringLiteral,
} from 'ts-morph';
import { Analyzer, Finding, FindingSeverity, FindingType, Route } from '../types';
import { globFiles, getSourceFile, normalizeRoutePath, matchesRoute } from '../utils';

export class BrokenRouteAnalyzer implements Analyzer {
  async analyze(routes: Route[], projectPath: string): Promise<Finding[]> {
    const findings: Finding[] = [];
    const tsFiles = await globFiles('**/*.{ts,tsx,js,jsx}', projectPath);
    const internalLinks: { href: string; file: string; line: number }[] = [];

    for (const file of tsFiles) {
      const sf = getSourceFile(file);
      if (!sf) continue;

      // Check <Link href="..."> and <a href="...">
      sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement).forEach((jsx) => {
        const jsxEl = jsx as JsxOpeningElement;
        const tagName = jsxEl.getTagNameNode().getText();
        if (tagName !== 'Link' && tagName !== 'a') return;

        const hrefAttr = jsxEl.getAttribute('href');
        if (!hrefAttr || !(hrefAttr as JsxAttribute).isKind(SyntaxKind.JsxAttribute)) return;

        const initializer = (hrefAttr as JsxAttribute).getInitializer();
        let href: string | undefined;
        if (initializer?.isKind(SyntaxKind.StringLiteral)) {
          href = (initializer as StringLiteral).getLiteralText();
        } else if (initializer?.isKind(SyntaxKind.JsxExpression)) {
          const expr = (initializer as JsxExpression).getExpression();
          if (expr?.isKind(SyntaxKind.StringLiteral)) {
            href = (expr as StringLiteral).getLiteralText();
          }
        }

        if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
          internalLinks.push({
            href: normalizeRoutePath(href),
            file,
            line: jsxEl.getStartLineNumber(),
          });
        }
      });

      // Check navigate(...) and router.push(...)
      sf.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
        const callExpr = call as CallExpression;
        const exprText = callExpr.getExpression().getText();
        if (!exprText.includes('navigate') && !exprText.includes('push')) return;
        const args = callExpr.getArguments();
        if (args.length === 0) return;
        const firstArg = args[0];
        if (firstArg.isKind(SyntaxKind.StringLiteral)) {
          const href = (firstArg as StringLiteral).getLiteralText();
          if (!href.startsWith('http')) {
            internalLinks.push({
              href: normalizeRoutePath(href),
              file,
              line: callExpr.getStartLineNumber(),
            });
          }
        }
      });
    }

    // Check each internal link against known routes
    for (const link of internalLinks) {
      let matched = false;
      for (const route of routes) {
        if (matchesRoute(route.path, link.href)) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        findings.push({
          type: FindingType.BrokenRoute,
          severity: FindingSeverity.Error,
          message: `${link.href} does not exist`,
          file: link.file,
          line: link.line,
        });
      }
    }

    return findings;
  }
}
