# agentic-magician

Install curated AI agent configurations for **Claude Code** and **Cursor** in one command. Powered by agents from [wshobson/agents](https://github.com/wshobson/agents).

## Quick Start

```bash
npx github:mrsollis/agentic-magician
```

That's it. No install needed. The interactive wizard walks you through everything.

## What It Does

Agentic Magician installs pre-configured AI agents, commands, and skills into your project based on your platform and project type:

- **Claude Code** — installs agents, commands, and skills to `.claude/agents/`, `.claude/commands/`, `.claude/skills/`
- **Cursor** — converts agents to `.cursor/rules/*.mdc` format with appropriate glob patterns and `alwaysApply` settings

## Interactive Flow

```
$ npx github:mrsollis/agentic-magician

┌  agentic-magician
│
◆  Which AI platform are you configuring?
│  ○ Claude Code (.claude/)
│  ○ Cursor (.cursor/rules/)
│
◆  What type of project is this?
│  ○ Next.js
│  ○ React SPA
│  ○ Flutter
│  ○ Serverless Python
│  ○ Serverless Node
│
◇  Default plugins (14):
│    + javascript-typescript
│    + frontend-mobile-development
│    + ui-design
│    + ...
│
◆  Would you like to add additional plugins? (y/N)
│  → multiselect from 72 available plugins
│
◆  Proceed with installation? (Y/n)
│
◇  Installing... ✓
│
└  Done! Your AI agents are ready.
```

## Project Types & Default Plugins

### Next.js (14 plugins — 39 agents, 23 commands, 29 skills)

Full-stack SSR + API routes + React

| Plugin | What it covers |
|--------|----------------|
| `javascript-typescript` | JS/TS language expertise |
| `frontend-mobile-development` | React components, frontend patterns |
| `backend-development` | API routes, server-side logic |
| `api-scaffolding` | API endpoint design |
| `ui-design` | Component design, layout systems |
| `accessibility-compliance` | WCAG compliance, a11y auditing |
| `seo-technical-optimization` | Meta tags, structured data, Core Web Vitals |
| `unit-testing` | Jest, React Testing Library |
| `tdd-workflows` | Test-driven development orchestration |
| `performance-testing-review` | Load testing, performance profiling |
| `frontend-mobile-security` | XSS prevention, CSP, client-side security |
| `application-performance` | Core Web Vitals, rendering optimization |
| `code-refactoring` | Code quality, modernization |
| `git-pr-workflows` | PR reviews, git best practices |

### React SPA (12 plugins — 24 agents, 23 commands, 19 skills)

Client-side React application

| Plugin | What it covers |
|--------|----------------|
| `javascript-typescript` | JS/TS language expertise |
| `frontend-mobile-development` | React components, SPA architecture |
| `ui-design` | Component design, design systems |
| `accessibility-compliance` | WCAG compliance |
| `unit-testing` | Jest, React Testing Library |
| `tdd-workflows` | Test-driven development |
| `performance-testing-review` | Bundle analysis, rendering performance |
| `frontend-mobile-security` | XSS, CSP, client security |
| `application-performance` | Runtime performance optimization |
| `code-refactoring` | Component refactoring |
| `git-pr-workflows` | PR workflow |
| `dependency-management` | Package management, updates |

### Flutter (11 plugins — 27 agents, 23 commands, 15 skills)

Cross-platform mobile (Dart)

| Plugin | What it covers |
|--------|----------------|
| `multi-platform-apps` | Flutter/Dart expertise, cross-platform |
| `frontend-mobile-development` | Mobile UI patterns |
| `ui-design` | UI/UX design, component architecture |
| `accessibility-compliance` | Mobile accessibility |
| `unit-testing` | Widget testing, integration testing |
| `tdd-workflows` | Test-driven development |
| `frontend-mobile-security` | Mobile security, secure storage |
| `application-performance` | Frame performance, memory profiling |
| `code-refactoring` | Code quality |
| `git-pr-workflows` | PR workflow |
| `error-debugging` | Crash debugging, error tracing |

### Serverless Python (13 plugins — 36 agents, 18 commands, 30 skills)

Python + AWS/GCP functions

| Plugin | What it covers |
|--------|----------------|
| `python-development` | Python 3.12+, Django, FastAPI |
| `cloud-infrastructure` | AWS/GCP/Azure, Terraform, serverless |
| `api-scaffolding` | REST/GraphQL API design |
| `backend-api-security` | API auth, input validation |
| `database-design` | Schema design, SQL optimization |
| `database-migrations` | Migration strategies |
| `unit-testing` | pytest, test automation |
| `tdd-workflows` | Test-driven development |
| `cicd-automation` | GitHub Actions, deployment pipelines |
| `deployment-strategies` | Blue/green, canary, serverless deploy |
| `error-diagnostics` | Error tracking, debugging |
| `code-refactoring` | Code quality |
| `git-pr-workflows` | PR workflow |

### Serverless Node (13 plugins — 41 agents, 16 commands, 27 skills)

Node.js/TS + AWS/GCP functions

| Plugin | What it covers |
|--------|----------------|
| `javascript-typescript` | JS/TS language expertise |
| `cloud-infrastructure` | AWS/GCP/Azure, Terraform, serverless |
| `api-scaffolding` | REST/GraphQL API design |
| `backend-api-security` | API auth, input validation |
| `backend-development` | Server-side architecture, event sourcing |
| `database-design` | Schema design, SQL optimization |
| `database-migrations` | Migration strategies |
| `unit-testing` | Jest, testing patterns |
| `tdd-workflows` | Test-driven development |
| `cicd-automation` | GitHub Actions, deployment pipelines |
| `deployment-strategies` | Blue/green, canary, serverless deploy |
| `error-diagnostics` | Error tracking, debugging |
| `git-pr-workflows` | PR workflow |

## Additional Plugins

Beyond the defaults, you can cherry-pick from **72 total plugins** during setup. Some popular extras:

- `security-compliance` — Security auditing and compliance
- `observability-monitoring` — Logging, metrics, tracing
- `kubernetes-operations` — K8s architecture and operations
- `llm-application-dev` — AI/ML application development
- `data-engineering` — Data pipelines and ETL
- `payment-processing` — Payment integration patterns
- `content-marketing` — Content strategy and SEO
- `hr-legal-compliance` — HR and legal compliance

## Platform Details

### Claude Code Output

```
.claude/
├── agents/           # Agent .md files (flat directory)
│   ├── typescript-pro.md
│   ├── frontend-developer.md
│   └── ...
├── commands/         # Command .md files
│   ├── typescript-scaffold.md
│   └── ...
└── skills/           # Skill directories with SKILL.md
    ├── javascript-testing-patterns/
    ├── python-design-patterns/
    └── ...
```

### Cursor Output

```
.cursor/
└── rules/            # Converted .mdc rule files
    ├── typescript-pro.mdc
    ├── frontend-developer.mdc
    └── ...
```

Each `.mdc` file includes:
- `description` — extracted from the agent's purpose
- `globs` — file patterns matched to the agent's domain (e.g., `["**/*.ts", "**/*.tsx"]`)
- `alwaysApply` — `true` for general rules (code review, git), `false` for language/domain-specific

> **Note:** Commands and skills are Claude Code-specific concepts. Only agent files are converted for Cursor.

## Conflict Handling

If you run agentic-magician in a project that already has agent files, it will prompt you per-conflict:

- **Overwrite** — replace with the new version
- **Skip** — keep your existing file
- **Overwrite all** — replace all remaining conflicts
- **Skip all** — keep all existing files

## Development

### Prerequisites

- Node.js >= 18

### Setup

```bash
git clone https://github.com/mrsollis/agentic-magician.git
cd agentic-magician
npm install
```

### Build

```bash
npm run build
```

### Run locally

```bash
node dist/index.js
```

### Update agent templates

Pull the latest agents from [wshobson/agents](https://github.com/wshobson/agents):

```bash
npm run populate
```

This shallow-clones the source repo, copies all plugin content to `templates/`, and regenerates the `templates/plugins.json` manifest. Review the changes with `git diff` before committing.

### Type check

```bash
npm run typecheck
```

## How It Works

1. **Templates are bundled** — Agent files from wshobson/agents are committed in `templates/plugins/`. No runtime fetching.
2. **`prepare` script builds on install** — When `npx` downloads from GitHub, it runs `npm install` which triggers the `prepare` script to build via tsup.
3. **Single-file bundle** — tsup compiles all TypeScript into one `dist/index.js` with a node shebang.
4. **Platform-aware installers** — Claude gets direct file copies; Cursor gets markdown-to-mdc conversion with appropriate glob patterns.

## License

MIT

## Credits

Agent content sourced from [wshobson/agents](https://github.com/wshobson/agents) (MIT license).