# Power Platform Dev Agency Toolkit

<p align="center">
  <strong>A production-grade agentic delivery framework for Microsoft Power Platform consultancies and enterprise development teams.</strong>
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square" alt="Build"></a>
  <a href="#documentation"><img src="https://img.shields.io/badge/Docs-Complete-blue?style=flat-square" alt="Docs"></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License"></a>
  <a href="#service-packages-overview"><img src="https://img.shields.io/badge/Packages-15%20Services-purple?style=flat-square" alt="Services"></a>
  <a href="#agents"><img src="https://img.shields.io/badge/Agents-16%20Agents-orange?style=flat-square" alt="Agents"></a>
  <img src="https://img.shields.io/badge/Node-%3E%3D%2018-339933?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Power%20Platform-Latest-742774?style=flat-square" alt="Power Platform">
</p>

---

## What This Repo Is

This repository is a **complete operating system** for a Power Platform development agency. It bundles agent definitions, prompt libraries, playbook workflows, checklists, reusable patterns, CLI tooling, and commercial service definitions into a single, version-controlled package that enables both human teams and AI coding agents to deliver client projects at scale. It codifies years of Power Platform delivery experience into repeatable, automatable patterns.

Everything is markdown-first: specifications, designs, and decisions live in version-controlled documents, and the [`pp-agency`](packages/cli/README.md) CLI generates project boilerplate, PRDs, solution-design documents, agent briefs, checklists, and licensing estimates from them.

## Who This Is For

| Role | How You Use This Repo |
|------|----------------------|
| **Business Owner / Agency Principal** | Browse [`services/`](services/) to see your 15 commercial offerings. Use [`playbooks/`](playbooks/) to standardize delivery. Review the commercial model in [`docs/commercial-offers.md`](docs/commercial-offers.md) and [`docs/delivery-model.md`](docs/delivery-model.md). |
| **AI Coding Agents (Claude, Kimi, Codex, Gemini)** | Read your agent definition in [`agents/`](agents/). Follow prompt templates in [`prompts/`](prompts/). Validate against [`checklists/`](checklists/). Generate project scaffolding with the CLI in [`packages/cli/`](packages/cli/README.md). |
| **Power Platform Developers** | Follow [`playbooks/`](playbooks/) for consistent delivery and reference the implementation patterns in [`power-platform/`](power-platform/). Use `pp-agency` to scaffold projects, generate documents, and validate them. Reuse the document templates in [`templates/`](templates/). |
| **Governance & Security Leads** | Review [`checklists/dlp-and-governance.md`](checklists/dlp-and-governance.md) and [`checklists/dataverse-security.md`](checklists/dataverse-security.md). Read [`docs/governance-and-coe.md`](docs/governance-and-coe.md) and [`docs/security-and-privacy.md`](docs/security-and-privacy.md). Enforce standards through automated validation in CI/CD. |
| **Delivery / Project Managers** | Use the delivery model in [`docs/delivery-model.md`](docs/delivery-model.md) and the phase checklists in [`checklists/`](checklists/). Coordinate handoffs between agents using [`AGENTS.md`](AGENTS.md). Track client work under [`projects/`](projects/README.md). |

## Problems This Solves

1. **Inconsistent Delivery** - Every project follows the same proven playbook, eliminating drift in quality.
2. **Agent Coordination** - 16 specialized agents hand off work with defined interfaces, preventing conflicts.
3. **Knowledge Silos** - All IP lives in version-controlled markdown, not in individual heads.
4. **Governance Gaps** - Every deliverable is validated against checklists before deployment.
5. **Slow Project Setup** - CLI tooling generates project boilerplate, PRDs, solution designs, and agent briefs in seconds.
6. **Pricing Guesswork** - Licensing and capacity costs are estimated up front with `pp-agency estimate-licensing`.
7. **Security Blind Spots** - DLP policies, security reviews, and governance checklists are baked into the delivery workflow.

---

## Quick Start

```bash
# 1. Clone the repository
git clone git@github.com:Jimmycarroll2021/power-platform-dev-agency-toolkit.git
cd power-platform-dev-agency-toolkit

# 2. Install dependencies and run the full verification gate
npm install
npm run verify

# 3. Link the CLI as a global `pp-agency` command
npm link -w packages/cli

# 4. Use it
pp-agency --help
pp-agency checklist --type qa -o ./qa-checklist.md
```

`npm run verify` runs typecheck, lint, build, tests, and docs validation in one
command. The CLI compiles to `packages/cli/dist/index.js` and can also be run
with `node packages/cli/dist/index.js <command>`.

> **Note:** `npm install` may print deprecation warnings for older transitive
> dev dependencies. These are non-fatal; `npm audit` reports **0 vulnerabilities**.

---

## Deploy

### Option 1: Clone and link (available now)

```bash
git clone git@github.com:Jimmycarroll2021/power-platform-dev-agency-toolkit.git
cd power-platform-dev-agency-toolkit
npm install
npm run verify
npm link -w packages/cli
pp-agency --help
```

### Option 2: Install from npm (after first release)

```bash
npm install -g @power-platform-agency/cli
pp-agency --help
```

> The `@power-platform-agency/cli` package is published automatically by the
> release workflow once a `v*.*.*` tag is pushed. Until the first release, use
> Option 1.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for release instructions, CI/CD pipelines,
and npm publishing setup.

---

## Repository Map

```
power-platform-dev-agency-toolkit/
|
|-- README.md              # You are here
|-- CLAUDE.md              # Claude Code agent instructions
|-- KIMI.md                # Kimi agent instructions
|-- CODEX.md               # Codex / VS Code agent instructions
|-- GEMINI.md              # Gemini CLI agent instructions
|-- AGENTS.md              # Multi-agent swarm orchestration guide
|-- CONTRIBUTING.md        # Contribution guidelines
|-- LICENSE                # MIT License
|-- .env.example           # Environment variable template
|-- package.json           # Root package manifest and npm scripts
|-- tsconfig.json          # TypeScript configuration
|-- docker-compose.yml     # Local dev container setup
|-- .eslintrc.json         # ESLint configuration
|-- .prettierrc.json       # Prettier configuration
|
|-- agents/                # 16 AI agent definitions (markdown)
|-- playbooks/             # 18 step-by-step delivery playbooks
|-- prompts/               # 16 reusable prompt templates (flat)
|-- checklists/            # 13 validation checklists
|-- docs/                  # 20 extended guides and reference docs
|-- power-platform/        # 16 implementation pattern libraries
|-- services/              # 15 commercial service offerings
|-- templates/             # 14 document templates
|-- mcp/                   # 4 MCP / external-agent integration notes
|-- examples/              # 4 worked example engagements
|-- scripts/               # 5 TypeScript automation scripts
|-- projects/              # Client project workspace (see projects/README.md)
|
|-- packages/
|   |-- cli/               # pp-agency CLI tool (TypeScript, ESM)
|       |-- src/           # CLI source
|       |-- dist/          # Build output (index.js entrypoint)
|       |-- README.md      # CLI usage and command reference
|       |-- package.json
|       |-- tsconfig.json
|
|-- .github/
    |-- workflows/         # lint.yml, docs-check.yml, repo-health.yml
    |-- ISSUE_TEMPLATE/    # bug_report.md, client-project.md, feature_request.md
    |-- PULL_REQUEST_TEMPLATE.md
```

### Directory Guide

| Directory | What's Inside |
|-----------|---------------|
| [`agents/`](agents/) | 16 agent role definitions, from [`solution-architect.md`](agents/solution-architect.md) and [`swarm-orchestrator.md`](agents/swarm-orchestrator.md) to specialist builders like [`power-apps-agent.md`](agents/power-apps-agent.md) and [`copilot-studio-agent.md`](agents/copilot-studio-agent.md). |
| [`playbooks/`](playbooks/) | 18 delivery workflows such as [`canvas-app.md`](playbooks/canvas-app.md), [`dataverse-solution.md`](playbooks/dataverse-solution.md), [`alm-pipeline.md`](playbooks/alm-pipeline.md), and [`governance-audit.md`](playbooks/governance-audit.md). |
| [`prompts/`](prompts/) | 16 flat prompt templates, e.g. [`client-discovery-prompt.md`](prompts/client-discovery-prompt.md), [`power-apps-prd-prompt.md`](prompts/power-apps-prd-prompt.md), [`code-review-prompt.md`](prompts/code-review-prompt.md). |
| [`checklists/`](checklists/) | 13 quality gates including [`project-intake.md`](checklists/project-intake.md), [`scope-validation.md`](checklists/scope-validation.md), [`deployment.md`](checklists/deployment.md), and [`qa.md`](checklists/qa.md). |
| [`docs/`](docs/) | 20 reference guides; start with the [`platform-map.md`](docs/platform-map.md) and [`delivery-model.md`](docs/delivery-model.md). |
| [`power-platform/`](power-platform/) | 16 implementation pattern libraries such as [`pac-cli-cheatsheet.md`](power-platform/pac-cli-cheatsheet.md), [`solution-patterns.md`](power-platform/solution-patterns.md), and [`environment-strategy.md`](power-platform/environment-strategy.md). |
| [`services/`](services/) | The 15 commercial offerings (see the table below). |
| [`templates/`](templates/) | 14 document templates including [`prd-template.md`](templates/prd-template.md), [`solution-design-template.md`](templates/solution-design-template.md), and [`client-proposal-template.md`](templates/client-proposal-template.md). |
| [`mcp/`](mcp/) | MCP and external-agent integration notes, e.g. [`external-agent-integration-template.md`](mcp/external-agent-integration-template.md). |
| [`examples/`](examples/) | 4 worked engagements (each with `README.md`, `architecture.md`, `prd.md`, `prompts.md`, `risks.md`). |
| [`scripts/`](scripts/) | TypeScript automation backing the npm scripts (`validate-docs`, `check-required-files`, `generate-project`, and more). |
| [`projects/`](projects/README.md) | Workspace for live client projects. |

---

## Agents

The toolkit ships **16 agent definitions** in [`agents/`](agents/), each a markdown brief describing the agent's role, responsibilities, inputs, outputs, and handoffs. The [`swarm-orchestrator.md`](agents/swarm-orchestrator.md) coordinates the others; the [`solution-architect.md`](agents/solution-architect.md) owns design; specialist agents cover Power Apps, Power Automate, Dataverse, Copilot Studio, AI Builder, connectors, desktop RPA, ALM, QA, security/governance, licensing, support, and commercial strategy.

See [`AGENTS.md`](AGENTS.md) for the full swarm orchestration model and handoff matrix.

---

## Agent Quick-Start

Each AI coding agent has a dedicated instruction file at the repo root. Read yours first, then your role definition in [`agents/`](agents/), then [`AGENTS.md`](AGENTS.md) to understand handoffs.

### For Claude Code
Claude reads [`CLAUDE.md`](CLAUDE.md) automatically on project load. You can also reference it explicitly:
```text
@CLAUDE.md Follow the client-discovery playbook for ACME Corp
```

### For Kimi
Load [`KIMI.md`](KIMI.md) as system context. Kimi reads agent definitions from [`agents/`](agents/) and follows the playbooks in [`playbooks/`](playbooks/).

### For Codex (VS Code Agent Mode)
Codex reads [`CODEX.md`](CODEX.md) on workspace open. Use the terminal for `pac` CLI operations and `node packages/cli/dist/index.js` commands.

### For Gemini CLI
Gemini reads [`GEMINI.md`](GEMINI.md) on session start. Follow the same agent definitions and playbooks as the other agents.

---

## CLI Quick-Start

The `pp-agency` CLI is a TypeScript (ESM) tool in [`packages/cli/`](packages/cli/README.md). Build it from the repo root, then run it via `node` or link it globally.

```bash
# From the repo root
npm install
npm run build

# Run directly
node packages/cli/dist/index.js --help

# Or link it as a global command
cd packages/cli && npm link
pp-agency --help
```

### Available CLI Commands

| Command | Description |
|---------|-------------|
| `new-project <name>` | Create a new Power Platform project with boilerplate docs. Options: `--client`, `--type`, `--output`. |
| `discovery` | Run an interactive discovery session and generate a report. |
| `generate-prd` | Generate a PRD. Options: `-p/--project`, `-o/--output`, `-c/--client`, `-t/--type`. |
| `generate-solution-design` | Generate a Solution Design Document (SDD). |
| `agent-brief` | Generate an AI agent brief. Options: `-a/--agent` (`architect`\|`data-modeler`\|`developer`\|`tester`\|`alm-engineer`\|`security-admin`), `-p/--project`, `-o/--output`, `-c/--context`. |
| `checklist` | Generate a phase checklist. Options: `-t/--type` (`project-intake`\|`scope-validation`\|`deployment`\|`qa`\|`governance`\|`support-handover`), `-o/--output`. |
| `validate` | Validate a project directory. Options: `-p/--project <path>`. |
| `estimate-licensing` | Estimate licensing costs. Options: `-o/--output`, `-c/--currency` (`usd`\|`gbp`\|`eur`). |

Global flags: `-v/--version`, `--verbose`, `-h/--help`. The full command reference also lives in [`packages/cli/README.md`](packages/cli/README.md).

### Example CLI Session

```bash
# Scaffold a new client project
node packages/cli/dist/index.js new-project acme-portal --client "ACME Corp" --type power-pages

# Generate a PRD for it
node packages/cli/dist/index.js generate-prd -p ./projects/acme-portal -c "ACME Corp" -t power-pages

# Produce a deployment checklist
node packages/cli/dist/index.js checklist -t deployment -o ./projects/acme-portal/deployment-checklist.md

# Estimate licensing in GBP
node packages/cli/dist/index.js estimate-licensing -c gbp

# Validate the project structure before handoff
node packages/cli/dist/index.js validate -p ./projects/acme-portal
```

### Repository Maintenance (npm scripts)

Run these from the repo root to keep the repository healthy:

| Script | Purpose |
|--------|---------|
| `npm run build` | Compile the CLI to `packages/cli/dist/`. |
| `npm run typecheck` | TypeScript type checking. |
| `npm run lint` / `npm run lint:fix` | Lint (and auto-fix) source. |
| `npm run lint:md` | Lint markdown. |
| `npm run format` / `npm run format:check` | Apply / verify Prettier formatting. |
| `npm run validate` | Run all repository validations. |
| `npm run validate:structure` | Verify required files and directory layout. |
| `npm run validate:project` | Validate a project directory. |
| `npm run docs:check` | Check documentation links and structure. |
| `npm run repo:health` | Aggregate repository health report. |
| `npm run setup` | One-shot install + build. |
| `npm run clean` | Remove build artifacts. |
| `npm test` | Run the test suite. |

---

## Service Packages Overview

This toolkit supports **15 commercial service offerings** that your agency can deliver. Each links to its full definition in [`services/`](services/) with positioning, deliverables, and references back into the playbooks.

| # | Service | Description | Key Deliverables |
|---|---------|-------------|------------------|
| 1 | [Power Apps Pro Dev](services/01-power-apps-pro-dev.md) | Canvas and model-driven app development | Solution package, source code, test suite |
| 2 | [Copilot Studio Agents](services/02-copilot-studio-agents.md) | AI agent and copilot implementation | Agent definitions, topics, knowledge sources |
| 3 | [Dataverse Advanced](services/03-dataverse-advanced.md) | Complex data modeling and relationships | Schema, business rules, plugins, workflows |
| 4 | [Power Automate Enterprise](services/04-power-automate-enterprise.md) | Enterprise automation and integration | Flows, custom connectors, DLP policies |
| 5 | [Power Pages Portals](services/05-power-pages-portals.md) | External-facing portal development | Site configuration, templates, web roles |
| 6 | [Power BI Embedded Analytics](services/06-pbi-embedded-analytics.md) | Reporting and dashboard integration | Reports, datasets, embedded configurations |
| 7 | [ALM & DevOps](services/07-alm-devops.md) | Application lifecycle management | Pipelines, environment strategy, branching |
| 8 | [Governance & Security](services/08-governance-security.md) | Security review and governance setup | DLP policies, access reviews, compliance docs |
| 9 | [Migration & Upgrade](services/09-migration-upgrade.md) | Legacy system migration to Power Platform | Migration plan, data mapping, cutover runbook |
| 10 | [Training & Enablement](services/10-training-enablement.md) | Team training and knowledge transfer | Training materials, runbooks, video guides |
| 11 | [Managed Support](services/11-managed-support.md) | Ongoing support and maintenance | SLA definitions, monitoring, incident response |
| 12 | [Discovery & Assessment](services/12-discovery-assessment.md) | Requirements gathering and feasibility study | PRD, technical assessment, project plan |
| 13 | [Integration Platform](services/13-integration-platform.md) | Third-party system integrations | Custom connectors, API management, middleware |
| 14 | [Rapid Prototyping](services/14-rapid-prototyping.md) | Quick proof-of-concept development | Working prototype, demo script, estimate |
| 15 | [Audit & Compliance](services/15-audit-compliance.md) | Security audit and compliance review | Audit report, remediation plan, evidence pack |

The commercial model behind these offerings is described in [`docs/commercial-offers.md`](docs/commercial-offers.md) and [`docs/delivery-model.md`](docs/delivery-model.md).

---

## Documentation

The [`docs/`](docs/) directory contains 20 reference guides. Good entry points:

- [`docs/platform-map.md`](docs/platform-map.md) - How the Power Platform fits together.
- [`docs/delivery-model.md`](docs/delivery-model.md) - The agency's end-to-end delivery model.
- [`docs/client-discovery.md`](docs/client-discovery.md) - Running a discovery engagement.
- [`docs/alm-and-solutions.md`](docs/alm-and-solutions.md) - ALM and solution strategy.
- [`docs/governance-and-coe.md`](docs/governance-and-coe.md) - Governance and Center of Excellence setup.
- [`docs/licensing-and-capacity.md`](docs/licensing-and-capacity.md) - Licensing and capacity planning.
- [`docs/glossary.md`](docs/glossary.md) - Terminology reference.

Implementation-level patterns (PAC CLI, solutions, environment strategy, PCF, connection references, and more) live in [`power-platform/`](power-platform/).

---

## Contributing

We welcome contributions from both humans and agents. In short:

1. **Validate before submitting** - Run `npm run validate` and `npm run repo:health` from the repo root.
2. **Conventional commits** - Follow the commit format described in [`CONTRIBUTING.md`](CONTRIBUTING.md).
3. **Pull requests** - All PRs must pass the workflows in [`.github/workflows/`](.github/workflows/) (`lint.yml`, `docs-check.yml`, `repo-health.yml`) and use the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
4. **Documentation** - Every new feature must include updated documentation; run `npm run docs:check`.
5. **Checklists** - New playbooks should ship with corresponding checklists in [`checklists/`](checklists/).

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for detailed guidelines.

---

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.

Copyright (c) 2026. All rights reserved.

---

## Next Steps for Coding Agents

> **If you are an AI coding agent reading this file, here is your immediate action plan:**

1. **Read your agent instructions** - Open the root file for your runtime: [`CLAUDE.md`](CLAUDE.md), [`KIMI.md`](KIMI.md), [`CODEX.md`](CODEX.md), or [`GEMINI.md`](GEMINI.md).

2. **Read your agent definition** - Find your role in [`agents/`](agents/) (for example [`agents/solution-architect.md`](agents/solution-architect.md) or [`agents/power-apps-agent.md`](agents/power-apps-agent.md)). It defines your responsibilities, inputs, outputs, and handoffs.

3. **Read the multi-agent guide** - [`AGENTS.md`](AGENTS.md) explains how you fit into the swarm and who you hand off to.

4. **Build the CLI** (from the repo root):
   ```bash
   npm install && npm run build
   ```

5. **Scaffold a project**:
   ```bash
   node packages/cli/dist/index.js new-project <name> --client "<Client>" --type <type>
   ```

6. **Follow the right playbook** from [`playbooks/`](playbooks/) for the engagement type, for example:
   - Discovery & PRD: [`prompts/client-discovery-prompt.md`](prompts/client-discovery-prompt.md) then [`playbooks/canvas-app.md`](playbooks/canvas-app.md)
   - Dataverse modeling: [`playbooks/dataverse-solution.md`](playbooks/dataverse-solution.md)
   - Copilot Studio: [`playbooks/copilot-studio-agent.md`](playbooks/copilot-studio-agent.md)
   - ALM and deployment: [`playbooks/alm-pipeline.md`](playbooks/alm-pipeline.md)

7. **Validate before finishing**:
   ```bash
   node packages/cli/dist/index.js validate -p ./projects/<name>
   npm run validate
   ```

---

<p align="center">
  <strong>Built for agents. Proven for production.</strong>
</p>
