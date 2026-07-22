import {
  SyntaxKind,
  JsxOpeningElement,
  JsxAttribute,
  JsxExpression,
  CallExpression,
  ObjectLiteralExpression,
  ArrayLiteralExpression,
  PropertyAssignment,
  StringLiteral,
} from 'ts-morph';
import { Framework, Route } from '../types';
import { globFiles, getSourceFile, normalizeRoutePath } from '../utils';

export async function scanReactRouter(projectPath: string): Promise<Route[]> {
  const routes: Route[] = [];
  const tsFiles = await globFiles('**/*.{ts,tsx,js,jsx}', projectPath);

  for (const file of tsFiles) {
    const sf = getSourceFile(file);
    if (!sf) continue;

    // 1. Find <Route path="..." /> elements
    sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement).forEach((jsx) => {
      const jsxEl = jsx as JsxOpeningElement;
      const tagName = jsxEl.getTagNameNode().getText();
      if (tagName !== 'Route') return;

      const pathAttr = jsxEl.getAttribute('path');
      if (!pathAttr || !(pathAttr as JsxAttribute).isKind(SyntaxKind.JsxAttribute)) return;

      const initializer = (pathAttr as JsxAttribute).getInitializer();
      if (!initializer) return;

      let path: string | undefined;
      if (initializer.isKind(SyntaxKind.StringLiteral)) {
        path = (initializer as StringLiteral).getLiteralText();
      } else if (initializer.isKind(SyntaxKind.JsxExpression)) {
        const expr = (initializer as JsxExpression).getExpression();
        if (expr && expr.isKind(SyntaxKind.StringLiteral)) {
          path = (expr as StringLiteral).getLiteralText();
        }
      }

      if (path) {
        path = normalizeRoutePath(path);
        const isDynamic = path.includes(':');
        routes.push({
          path,
          framework: Framework.ReactRouter,
          file,
          line: jsxEl.getStartLineNumber(),
          isDynamic,
        });
      }
    });

    // 2. Find createBrowserRouter calls
    sf.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
      const callExpr = call as CallExpression;
      const expr = callExpr.getExpression();
      const text = expr.getText();
      if (!text.includes('createBrowserRouter') && !text.includes('createRoutesFromElements'))
        return;

      // Traverse arguments to find route objects
      const args = callExpr.getArguments();
      for (const arg of args) {
        extractRoutesFromObject(arg, file, routes);
      }
    });
  }

  return routes;
}

function extractRoutesFromObject(
  node: any,
  file: string,
  routes: Route[],
  parentPath: string = ''
) {
  if (node.isKind(SyntaxKind.ObjectLiteralExpression)) {
    const obj = node as ObjectLiteralExpression;
    const pathProp = obj.getProperty('path');
    if (!pathProp || !(pathProp as PropertyAssignment).isKind(SyntaxKind.PropertyAssignment))
      return;

    const initializer = (pathProp as PropertyAssignment).getInitializer();
    let path: string | undefined;
    if (initializer && initializer.isKind(SyntaxKind.StringLiteral)) {
      path = (initializer as StringLiteral).getLiteralText();
    }

    if (!path) return;

    const fullPath = normalizeRoutePath(parentPath + (path.startsWith('/') ? path : '/' + path));
    const isDynamic = fullPath.includes(':');
    routes.push({
      path: fullPath,
      framework: Framework.ReactRouter,
      file,
      line: obj.getStartLineNumber(),
      isDynamic,
    });

    // Check for children
    const childrenProp = obj.getProperty('children');
    if (
      childrenProp &&
      (childrenProp as PropertyAssignment).isKind(SyntaxKind.PropertyAssignment)
    ) {
      const childrenInit = (childrenProp as PropertyAssignment).getInitializer();
      if (childrenInit) {
        extractRoutesFromObject(childrenInit, file, routes, fullPath);
      }
    }
  } else if (node.isKind(SyntaxKind.ArrayLiteralExpression)) {
    const arr = node as ArrayLiteralExpression;
    arr.getElements().forEach((el) => extractRoutesFromObject(el, file, routes, parentPath));
  }
}
