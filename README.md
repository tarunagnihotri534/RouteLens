<div align="center">
  <!-- Custom Shield Logo -->
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20 L170 45 L170 90 C170 130 140 160 100 180 C60 160 30 130 30 90 L30 45 Z" fill="#2563eb" stroke="#1e40af"/>
    <text x="100" y="115" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="48">RL</text>
  </svg>

  <h1>RouteLens</h1>
  <h3>Static Analysis Tool for React & Next.js Routing Issues</h3>

  <!-- Tech Stack -->
  <div>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/ts--morph-3178C6?style=for-the-badge" alt="ts-morph">
    <img src="https://img.shields.io/badge/Commander.js-339933?style=for-the-badge" alt="Commander.js">
    <img src="https://img.shields.io/badge/Chalk-000000?style=for-the-badge&logo=npm" alt="Chalk">
    <img src="https://img.shields.io/badge/fast--glob-339933?style=for-the-badge" alt="fast-glob">
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier">
    <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest">
  </div>
</div>

---

## How to Run This Project

### Prerequisites
- Node.js 18+ installed on your machine

### Step-by-Step Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/tarunagnihotri534/RouteLens.git
cd RouteLens
```

2. **Install Dependencies**
```bash
npm install --no-bin-links
```

3. **Build the Project**
```bash
npm run build
```

4. **Run RouteLens**
```bash
# Scan current directory
node dist/cli/index.js scan

# Scan a specific directory
node dist/cli/index.js scan --path ./my-react-app
```

---

## Usage Options
| Flag | Description |
|------|-------------|
| `--json` | Output JSON |
| `--tree` | Show route tree |
| `--stats` | Show only stats |
| `--path <dir>` | Path to scan (default: `.`) |
