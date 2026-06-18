# Codex Agent Instructions

> **For use with VS Code Agent Mode (Codex) and GitHub Copilot.** This file defines how Codex interacts with the Power Platform Dev Agency Toolkit repository.

This is a **documentation-and-CLI** repository: it ships AI agent briefs, delivery playbooks, validation checklists, commercial service definitions, and a `pp-agency` scaffolding CLI. It is **not** a deployable Power Platform solution by itself — it is the toolkit you use to plan and document one. The `pac` CLI sections below are for the real Power Platform work that flows out of these documents.

## Table of Contents

1. [VS Code Workspace Setup](#vs-code-workspace-setup)
2. [Using the CLI](#using-the-cli)
3. [Terminal Commands for pac CLI](#pac-cli-commands)
4. [Documentation Workflow](#documentation-workflow)
5. [Git Commit Conventions](#git-commit-conventions)
6. [Agent Context](#agent-context)
7. [Validation Commands](#validation-commands)
8. [Example Session](#example-session)

---

## VS Code Workspace Setup

### Recommended Extensions

Install these extensions for optimal work in this repo:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "microsoft.powerplatform-vscode",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.powershell",
    "github.copilot",
    "github.copilot-chat",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

The Power Platform extension gives you `pac` CLI integration; the TypeScript, ESLint, and Prettier extensions cover the CLI package and the documentation tooling (`eslint`, `prettier`).

### Workspace Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

### Opening the Workspace

```bash
# Open VS Code in the repository root
code .

# Or from elsewhere, point at the repo folder
code power-platform-dev-agency-toolkit
```

---

## Using the CLI

The `pp-agency` CLI is the primary tool for scaffolding and validating project documentation. It is a TypeScript/ESM binary that lives in [`packages/cli`](packages/cli/README.md).

### Setup in VS Code Terminal

```bash
# Open the integrated terminal (Ctrl+`) at the repo root

# Install dependencies and build the whole workspace
npm install
npm run build

# The compiled entry point is now at packages/cli/dist/index.js
```

You can run the CLI two ways:

```bash
# Option A — run the built entry point directly (no global install)
node packages/cli/dist/index.js --help

# Option B — link it once, then call it by name
cd packages/cli && npm link
pp-agency --help
```

The examples below use `pp-agency <cmd>`; substitute `node packages/cli/dist/index.js <cmd>` if you have not linked the binary.

### CLI Commands Reference

These are the **only** commands the CLI provides. See [`packages/cli/README.md`](packages/cli/README.md) for full option details.

```bash
# Show help / version
pp-agency --help
pp-agency --version

# Scaffold a new project folder of boilerplate docs
pp-agency new-project "Contoso CRM" --type model-driven --client "Contoso Inc." --output ./projects

# Run an interactive discovery session -> discovery-report.md
pp-agency discovery

# Generate a Product Requirements Document
pp-agency generate-prd --project "Contoso CRM" --output ./projects/contoso-crm/prd.md

# Generate a Solution Design Document (SDD)
pp-agency generate-solution-design --project "Contoso CRM" --output ./projects/contoso-crm/solution-design.md

# Generate an AI agent brief
pp-agency agent-brief --agent architect --project "Contoso CRM" --output ./projects/contoso-crm/agents/architect-brief.md

# Generate a phase checklist
pp-agency checklist --type deployment --output ./projects/contoso-crm/checklists/deployment.md

# Validate a scaffolded project directory
pp-agency validate --project ./projects/contoso-crm

# Estimate licensing costs
pp-agency estimate-licensing --currency usd
```

Valid `--agent` values: `architect`, `data-modeler`, `developer`, `tester`, `alm-engineer`, `security-admin`.
Valid `--type` checklist values: `project-intake`, `scope-validation`, `deployment`, `qa`, `governance`, `support-handover`.

### Using the CLI in Codex Chat

When working in VS Code Agent Mode, you can ask Codex to:
- "Scaffold a new model-driven project with `pp-agency new-project`"
- "Generate a PRD for the Contoso CRM project"
- "Validate the `./projects/contoso-crm` directory with `pp-agency validate`"
- "Estimate licensing in GBP with `pp-agency estimate-licensing --currency gbp`"

Codex will execute these in the integrated terminal and interpret the results. Generated documents are written **inside the repo** (typically under [`projects/`](projects/README.md)), never to an external path.

---

## pac CLI Commands

The Microsoft `pac` CLI is what you use for the actual Power Platform work that the toolkit's documents describe (export/import solutions, build PCF, manage environments). Run these in the VS Code terminal. A maintained reference lives at [`power-platform/pac-cli-cheatsheet.md`](power-platform/pac-cli-cheatsheet.md).

### Authentication

```bash
# Authenticate with Power Platform
pac auth create --url https://org.crm.dynamics.com --name "OrgName"

# List authenticated profiles
pac auth list

# Select active profile
pac auth select --index 1

# Clear authentication
pac auth clear
```

### Solution Operations

```bash
# Export solution from environment
pac solution export --name SolutionName --path ./solutions --managed

# Import solution to environment
pac solution import --path ./solutions/SolutionName.zip

# Clone solution for source control
pac solution clone --name SolutionName --outputDirectory ./src

# Pack solution from source
pac solution pack --zipfile ./solutions/SolutionName.zip --folder ./src/SolutionName

# Unpack solution to source
pac solution unpack --zipfile ./solutions/SolutionName.zip --folder ./src/SolutionName

# List solutions in environment
pac solution list
```

Solution and ALM conventions are documented in [`power-platform/solution-patterns.md`](power-platform/solution-patterns.md) and [`power-platform/alm-devops-patterns.md`](power-platform/alm-devops-patterns.md).

### Canvas App Operations

```bash
# Pack canvas app
pac canvas pack --sources ./src/apps/AppName --msapp ./apps/AppName.msapp

# Unpack canvas app
pac canvas unpack --msapp ./apps/AppName.msapp --sources ./src/apps/AppName
```

See the [Canvas App playbook](playbooks/canvas-app.md) and [`power-platform/power-apps-patterns.md`](power-platform/power-apps-patterns.md).

### Dataverse Operations

```bash
# Create table
pac data create table --name "custom_TableName" --displayname "Table Display Name"

# List tables
pac data list tables

# Create column
pac data create column --entity "custom_TableName" --name "custom_Column" --datatype string

# Export data
pac data export --entity "custom_TableName" --file ./data/export.csv
```

See the [Dataverse Solution playbook](playbooks/dataverse-solution.md) and [`power-platform/dataverse-patterns.md`](power-platform/dataverse-patterns.md).

### Environment Operations

```bash
# List environments
pac admin list

# Create environment
pac admin create --name "NewEnv" --region unitedstates --type Sandbox

# Backup environment
pac admin backup --environment-url https://org.crm.dynamics.com --label "Pre-deployment"

# Copy environment
pac admin copy --source-url https://source.crm.dynamics.com --target-url https://target.crm.dynamics.com
```

Environment topology is covered in [`power-platform/environment-strategy.md`](power-platform/environment-strategy.md) and [`power-platform/environment-variables.md`](power-platform/environment-variables.md).

### PCF Component Operations

```bash
# Initialize PCF component
pac pcf init --namespace MyNamespace --name MyControl --template field

# Build PCF component
cd MyControl && npm run build

# Push to Dataverse
pac pcf push --publisher-prefix myprefix
```

See [`power-platform/pcf-patterns.md`](power-platform/pcf-patterns.md).

---

## Documentation Workflow

The standard loop in this repo is **document, validate, commit** — the `pac` work above happens in the client's environment, but the planning artifacts live here.

### Standard Process

```
1. Scaffold  -> pp-agency new-project (writes boilerplate into projects/)
2. Discover  -> pp-agency discovery / generate-prd
3. Design    -> pp-agency generate-solution-design + read services/ and power-platform/ patterns
4. Brief     -> pp-agency agent-brief for each role
5. Validate  -> pp-agency validate --project <dir>, then npm run validate
6. Commit    -> follow git conventions below
```

### Step-by-Step

```bash
# 1. Start from the repo root
cd power-platform-dev-agency-toolkit

# 2. Read the relevant agent brief and service definition for context
#    e.g. agents/solution-architect.md and services/01-power-apps-pro-dev.md

# 3. Scaffold the project folder
node packages/cli/dist/index.js new-project "ClientSolution" --type full-solution --client "Client Inc." --output ./projects

# 4. Generate planning docs
node packages/cli/dist/index.js generate-prd --project "ClientSolution" --output ./projects/clientsolution/prd.md
node packages/cli/dist/index.js generate-solution-design --project "ClientSolution" --output ./projects/clientsolution/solution-design.md

# 5. Generate phase checklists
node packages/cli/dist/index.js checklist --type project-intake --output ./projects/clientsolution/checklists/project-intake.md
node packages/cli/dist/index.js checklist --type deployment --output ./projects/clientsolution/checklists/deployment.md

# 6. Validate the scaffolded project
node packages/cli/dist/index.js validate --project ./projects/clientsolution

# 7. Validate repo structure and docs before committing
npm run validate

# 8. Commit
git add .
git commit -m "feat: scaffold ClientSolution planning docs

- Generated PRD and solution design
- Added project-intake and deployment checklists
- Validated project directory"
```

When the design calls for real Power Platform artifacts, follow the [ALM Pipeline playbook](playbooks/alm-pipeline.md) and use the `pac` commands above to export, unpack, pack, and import solutions.

---

## Git Commit Conventions

All commits must follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New features or new generated artifacts |
| `fix` | Bug fixes |
| `docs` | Documentation changes (agents, playbooks, checklists, docs, services) |
| `style` | Formatting, no content change |
| `refactor` | Code or document restructuring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests / validation |
| `chore` | Maintenance tasks |

### Scopes

| Scope | Description |
|-------|-------------|
| `cli` | `packages/cli` changes |
| `agents` | Agent brief changes under `agents/` |
| `playbooks` | Playbook changes under `playbooks/` |
| `checklists` | Checklist changes under `checklists/` |
| `prompts` | Prompt changes under `prompts/` |
| `docs` | Reference docs under `docs/` |
| `services` | Commercial service definitions under `services/` |
| `power-platform` | Pattern docs under `power-platform/` |
| `templates` | Template changes under `templates/` |
| `scripts` | Automation scripts under `scripts/` |

### Examples

```bash
# Feature commit
git commit -m "feat(cli): add --currency option to estimate-licensing

- Support usd, gbp, eur
- Default to usd"

# Documentation
git commit -m "docs(services): add managed support tiers to 11-managed-support

- Defined bronze/silver/gold response SLAs"

# Fix commit
git commit -m "fix(scripts): correct cross-reference check in validate-docs

- Resolve relative links from file location, not repo root

Closes: #42"
```

### Pre-Commit Checklist

Before every commit, run the real npm scripts:

```bash
# 1. Format
npm run format

# 2. Lint code and markdown
npm run lint
npm run lint:md

# 3. Typecheck the CLI
npm run typecheck

# 4. Validate repo structure and docs (cross-references, required files)
npm run validate

# 5. Full check (typecheck + validate)
npm test
```

---

## Agent Context

### Reading Your Role

Agent briefs live in [`agents/`](agents/solution-architect.md) as **markdown** files (16 of them). Read the brief that matches your task before doing anything:

```bash
# Read an agent brief (markdown, not YAML)
cat agents/solution-architect.md
cat agents/power-apps-agent.md
cat agents/alm-deployment-agent.md
```

Available briefs include `solution-architect`, `power-apps-agent`, `power-automate-agent`, `dataverse-agent`, `copilot-studio-agent`, `ai-builder-agent`, `connector-integration-agent`, `desktop-rpa-agent`, `alm-deployment-agent`, `security-governance-agent`, `qa-test-agent`, `licensing-capacity-agent`, `commercial-strategy-agent`, `support-runbook-agent`, `platform-cartographer`, and `swarm-orchestrator`.

### Understanding Handoffs

The agents form a delivery swarm coordinated by [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md). Typical flow:
- **`solution-architect`** produces the design that the build agents implement.
- **`power-apps-agent` / `power-automate-agent` / `dataverse-agent`** build the components.
- **`qa-test-agent`** validates the build.
- **`security-governance-agent`** reviews security and governance posture.
- **`alm-deployment-agent`** handles deployment and release.

The overall swarm model is described in [`AGENTS.md`](AGENTS.md) at the repo root.

### Generating a Brief for a Task

Rather than hand-writing a brief, generate one with the CLI:

```bash
node packages/cli/dist/index.js agent-brief --agent developer --project "ClientSolution" --output ./projects/clientsolution/agents/developer-brief.md
```

---

## Validation Commands

There are two layers of validation: **repo-level** (npm scripts) and **project-level** (the CLI's `validate` command).

### Repo-Level Validation

```bash
# Validate required files + docs cross-references
npm run validate

# Just the structural required-files check
npm run validate:structure

# Just the docs / link check
npm run docs:check

# Verbose required-files report
npm run repo:health
```

These run the TypeScript helpers in [`scripts/`](scripts/check-required-files.ts) — `check-required-files.ts` and `validate-docs.ts`.

### Project-Level Validation

```bash
# Validate a scaffolded project directory for required files, frontmatter, and cross-references
node packages/cli/dist/index.js validate --project ./projects/clientsolution

# Convenience npm wrapper (append the path)
npm run validate:project -- ./projects/clientsolution
```

Exit code `0` means all checks passed; `1` means there were failures. **All failures must be resolved or explicitly justified in the commit message.**

---

## Example Session

### Complete Codex Session for Planning a Solution

**User in VS Code Agent Mode**: "Plan a customer feedback solution with a canvas app and an approval flow."

**Codex executes:**

```bash
# Step 1: Read the relevant context
cat agents/solution-architect.md
cat services/01-power-apps-pro-dev.md
cat playbooks/canvas-app.md

# Step 2: Scaffold the project folder
node packages/cli/dist/index.js new-project "CustomerFeedback" --type full-solution --client "ACME Corp" --output ./projects

# Step 3: Generate the PRD and solution design
node packages/cli/dist/index.js generate-prd --project "CustomerFeedback" --output ./projects/customerfeedback/prd.md
node packages/cli/dist/index.js generate-solution-design --project "CustomerFeedback" --output ./projects/customerfeedback/solution-design.md

# Step 4: Generate agent briefs for the build roles
node packages/cli/dist/index.js agent-brief --agent data-modeler --project "CustomerFeedback" --output ./projects/customerfeedback/agents/data-modeler-brief.md
node packages/cli/dist/index.js agent-brief --agent developer --project "CustomerFeedback" --output ./projects/customerfeedback/agents/developer-brief.md

# Step 5: Generate phase checklists
node packages/cli/dist/index.js checklist --type scope-validation --output ./projects/customerfeedback/checklists/scope-validation.md
node packages/cli/dist/index.js checklist --type deployment --output ./projects/customerfeedback/checklists/deployment.md

# Step 6: Estimate licensing
node packages/cli/dist/index.js estimate-licensing --currency usd --output ./projects/customerfeedback/licensing-estimate.md

# Step 7: Validate the project directory
node packages/cli/dist/index.js validate --project ./projects/customerfeedback

# Step 8: Validate the repo before committing
npm run validate

# Step 9: Commit
git add .
git commit -m "feat: plan CustomerFeedback solution

- Scaffolded project, PRD, and solution design
- Generated data-modeler and developer briefs
- Added scope-validation and deployment checklists
- Added USD licensing estimate"
```

Once the plan is approved, the **build** happens in the client's environment using the `pac` CLI commands above, following the relevant playbooks (e.g. [Canvas App](playbooks/canvas-app.md), [Approval Workflows](playbooks/approval-workflows.md), [ALM Pipeline](playbooks/alm-pipeline.md)) and reference patterns in [`power-platform/`](power-platform/power-apps-patterns.md).

---

> **Rule of Thumb**: If it's not in source control, it doesn't exist. If it's not validated, it's not done. If it's not documented, it's not complete.
