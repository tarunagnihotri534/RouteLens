# RouteLens (formerly RouteGuard)

<div align="center">
  <h3>Static Analysis Tool for React & Next.js Routing Issues</h3>
  <p>Catch broken links, duplicate routes, invalid syntax, and more — before they hit production!</p>
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</div>

---

## Table of Contents
- [Why RouteLens?](#why-routelens)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Why RouteLens?
Routing issues are one of the most common causes of bad UX, 404 errors, and SEO problems in React/Next.js apps. RouteLens uses **static analysis** to catch these issues early in your development workflow — no runtime required!

### Common Issues Detected
- 😱 Broken internal links
- ⚠️ Duplicate route definitions
- ❌ Invalid dynamic route syntax
- 📂 Missing pages

---

## Features
| Feature | Description |
|---------|-------------|
| 🧠 **Automatic Framework Detection** | Detects React Router, Next.js App Router, and Next.js Pages Router automatically |
| 🔍 **Deep Source Scanning** | Uses `ts-morph` to parse your actual source code, not just filenames |
| 📊 **Multiple Output Formats** | Human-readable CLI, JSON for machines, route tree, and stats summary |
| 📝 **Actionable Feedback** | Every finding includes file path + line number |
| 🚀 **Extensible Architecture** | Easy to add new analyzers and reporters |

---

## Architecture Overview
```mermaid
flowchart TD
    A[CLI Entrypoint<br>src/cli/index.ts] --> B[Framework Detection<br>src/utils/detectFramework.ts]
    B --> C{Which Framework?}
    C -->|React Router| D[React Router Scanner<br>src/scanner/reactRouterScanner.ts]
    C -->|Next.js App Router| E[App Router Scanner<br>src/scanner/appRouterScanner.ts]
    C -->|Next.js Pages Router| F[Pages Router Scanner<br>src/scanner/pagesRouterScanner.ts]
    D & E & F --> G[Analyzers<br>src/analyzers/*]
    G --> H[Reporters<br>src/reporters/*]
    H --> I[Output<br>CLI / JSON / Tree / Stats]
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation
```bash
# Clone the repo
git clone https://github.com/tarunagnihotri534/RouteLens.git
cd RouteLens

# Install dependencies
npm install --no-bin-links

# Build the TypeScript code
npm run build
```

---

## Usage

### Basic Scan
Scan the current directory for routing issues:
```bash
node dist/cli/index.js scan
```

### Scan a Specific Directory
```bash
node dist/cli/index.js scan --path ./my-react-app
```

### Output Options
| Flag | Description |
|------|-------------|
| `--json` | Output machine-readable JSON |
| `--tree` | Show a hierarchical route tree |
| `--stats` | Show only statistics |
| `--path <dir>` | Path to project to scan (default: `.`) |

### Example Output
```
Route Summary:
  /
  /about
  /blog/[slug]

Findings:
  ✗ Broken Route
    /blog/123 does not exist
    at components/Navbar.tsx:12

Statistics:
  Total Routes:      3
  Broken Links:       1
  Duplicate Routes:   0
  Dynamic Routes:     1
  Unused Pages:       0
```

---

## CI/CD Integration

### GitHub Actions
Create a `.github/workflows/routelens.yml` file:
```yaml
name: RouteLens Scan
on: [pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install RouteLens
        run: npm ci
      - name: Build RouteLens
        run: npm run build
      - name: Run RouteLens Scan
        run: node dist/cli/index.js scan --json > scan-results.json
      # Optional: Add step to parse scan-results.json and fail PR on errors
```

---

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests!

---

## Roadmap
- [ ] VS Code Extension
- [ ] GitHub Action
- [ ] Support for Remix
- [ ] More analyzers (unused pages, nested route issues)
- [ ] Custom configuration file

---

## License
MIT
