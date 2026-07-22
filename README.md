# RouteGuard

RouteGuard is a static analysis CLI tool that scans React and Next.js codebases for routing issues like broken links, duplicate routes, invalid dynamic route syntax, and more!

## Features

- **Automatic Framework Detection**: Detects React Router, Next.js App Router, and Next.js Pages Router
- **Broken Link Detection**: Finds internal links that don't resolve to any route
- **Duplicate Route Detection**: Flags multiple definitions of the same route
- **Invalid Dynamic Route Syntax**: Catches React Router-style parameters in Next.js projects
- **Route Summary & Tree View**: Visualizes all your routes in a flat list or hierarchical tree
- **Stats Overview**: Shows total routes, broken links, duplicates, dynamic routes, and unused pages
- **JSON Output**: Machine-readable format for CI integration

## Installation

```bash
npm install -g routeguard
```

## Usage

### Basic Scan

```bash
routeguard scan
```

### Scan a Specific Directory

```bash
routeguard scan --path ./my-app
```

### Output JSON

```bash
routeguard scan --json
```

### Show Route Tree

```bash
routeguard scan --tree
```

### Show Only Stats

```bash
routeguard scan --stats
```

## Supported Frameworks

- React Router (v5/v6)
- Next.js App Router
- Next.js Pages Router

## Roadmap

- VS Code extension
- GitHub Action
- CI/CD integration with GitHub Actions, GitLab CI, etc.

## License

MIT
