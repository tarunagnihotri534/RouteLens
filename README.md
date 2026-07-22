<div align="center">
  <!-- Shield Logo -->
  <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20 L170 45 L170 90 C170 130 140 160 100 180 C60 160 30 130 30 90 L30 45 Z" fill="#2563eb" stroke="#1e40af"/>
    <text x="100" y="115" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="48">RL</text>
  </svg>
  <h1>RouteLens</h1>
  <p>Static analysis tool to catch React & Next.js routing issues before production</p>

  <div>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/ts--morph-3178C6?style=for-the-badge" alt="ts-morph">
    <img src="https://img.shields.io/badge/Commander.js-339933?style=for-the-badge" alt="Commander.js">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License">
  </div>
</div>

---

## Key Features
- 🔍 Detect broken links
- ⚠️ Find duplicate routes
- ❌ Catch invalid dynamic route syntax
- 📊 Multiple output formats (CLI, JSON, tree, stats)
- 🧠 Auto-detects React Router, Next.js App Router, Pages Router

---

## Quick Start

### Prerequisites
- Node.js 18+

### Installation & Run
```bash
# Clone repo
git clone https://github.com/tarunagnihotri534/RouteLens.git
cd RouteLens

# Install dependencies
npm install --no-bin-links

# Build
npm run build

# Scan your project
node dist/cli/index.js scan --path ./your-project
```

---

## Usage Flags
| Flag | Description |
|------|-------------|
| `--json` | Machine-readable JSON output |
| `--tree` | Hierarchical route tree |
| `--stats` | Statistics summary only |
| `--path <dir>` | Path to scan (default: `.`) |

---

## License
MIT
