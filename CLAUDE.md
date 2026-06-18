# Claude Code Agent Instructions

> **When working in this repo, follow these rules.** This file is your primary instruction set for all Claude Code operations within the `power-platform-dev-agency-toolkit` repository.

This toolkit is a **documentation-and-tooling framework** for Microsoft Power Platform delivery work. It is markdown-first: agents, playbooks, prompts, checklists, services, templates, and reference docs are all `.md` files. The only executable code is the `pp-agency` CLI (TypeScript/ESM) in `packages/cli` plus a few `.ts` automation scripts in `scripts/`.

## Table of Contents

1. [Core Operating Principles](#core-operating-principles)
2. [Repository Navigation](#repository-navigation)
3. [Using the CLI (`pp-agency`)](#using-the-cli)
4. [Reading Agent Definitions](#reading-agent-definitions)
5. [Using Prompts](#using-prompts)
6. [Following Playbooks](#following-playbooks)
7. [Validation & Checklists](#validation--checklists)
8. [File Creation Conventions](#file-creation-conventions)
9. [Pre-Commit Validation](#pre-commit-validation)
10. [Example Workflow](#example-workflow)

---

## Core Operating Principles

1. **Solutions, Never Hardcodes** - Always design around managed solutions. Never hardcode connection references, environment URLs, or credentials in source files. Use environment variables and configuration records. See [`power-platform/connection-references.md`](power-platform/connection-references.md) and [`power-platform/environment-variables.md`](power-platform/environment-variables.md).

2. **Check Licensing First** - Before any implementation, verify the client has appropriate licenses. Reference [`checklists/licensing-and-capacity.md`](checklists/licensing-and-capacity.md) and [`docs/licensing-and-capacity.md`](docs/licensing-and-capacity.md) before building features that require Premium, Per App, or Per User plans. Use `pp-agency estimate-licensing` to model costs.

3. **Validate Before You Finish** - Every deliverable must pass its corresponding checklist. Run `pp-agency validate --project <path>` (or `npm run validate`) before marking any task complete.

4. **Cross-Reference Everything** - When creating files, link to related playbooks, checklists, services, and agent definitions. Use repo-relative paths so links resolve from this file's location at the repo root.

5. **Markdown is the Source of Truth** - All specifications, designs, and decisions live in markdown. The CLI and scripts generate markdown deliverables from these specifications, not the other way around.

6. **Security by Default** - Apply least-privilege access. Use service principals, never personal credentials. Reference [`checklists/dataverse-security.md`](checklists/dataverse-security.md), [`checklists/dlp-and-governance.md`](checklists/dlp-and-governance.md), and [`docs/security-and-privacy.md`](docs/security-and-privacy.md) for every deliverable.

7. **Testability** - Every solution component must be testable. Include test plans in your deliverables. See [`checklists/qa.md`](checklists/qa.md) and [`templates/qa-checklist.md`](templates/qa-checklist.md).

---

## Repository Navigation

```
agents/          -> 16 AI agent role definitions (.md)
playbooks/       -> 18 step-by-step delivery workflows (.md)
prompts/         -> 16 reusable prompt templates (.md, FLAT — no subfolders)
checklists/      -> 13 validation criteria documents (.md)
services/        -> 15 commercial service definitions (01-..15-..) + README
docs/            -> 20 extended reference guides (.md)
power-platform/  -> 16 implementation pattern references (.md)
mcp/             -> 4 MCP / external-agent integration notes (.md)
templates/       -> 14 deliverable templates (.md)
examples/        -> 4 worked end-to-end examples (each a dir of .md files)
projects/        -> Where scaffolded client projects live (see projects/README.md)
scripts/         -> 5 TypeScript automation utilities (.ts)
packages/cli/    -> The pp-agency CLI (TypeScript, ESM)
.github/         -> CI workflows, issue templates, PR template
```

**Key files you should read for context:**
- [`README.md`](README.md) - Overall repo structure and quick start
- [`AGENTS.md`](AGENTS.md) - How the agents fit into the multi-agent swarm
- Your agent definition in [`agents/`](agents/) - Your specific responsibilities (e.g. [`agents/solution-architect.md`](agents/solution-architect.md))
- [`docs/platform-map.md`](docs/platform-map.md) - The big-picture map of the Power Platform surface area
- [`docs/delivery-model.md`](docs/delivery-model.md) - How engagements flow end to end
- The relevant service definition in [`services/`](services/) - The commercial shape of the work (e.g. [`services/01-power-apps-pro-dev.md`](services/01-power-apps-pro-dev.md))

There is **no** `packages/core`; the CLI is the only package. Agent files are `.md`, not `.yaml`. The `prompts/` directory is flat — there are no `system/`, `tasks/`, or `snippets/` subfolders.

---

## Using the CLI

The `pp-agency` CLI is your primary tool for scaffolding and generating markdown deliverables.

### Installation

Build once from the repo root:
```bash
npm install && npm run build
```
This compiles the CLI to `packages/cli/dist/index.js`. You can then run it either directly:
```bash
node packages/cli/dist/index.js --help
```
or link it globally so `pp-agency` is on your PATH:
```bash
cd packages/cli && npm link
pp-agency --help
```

### Core Commands

These are the **only** commands the CLI exposes. Each generates or validates markdown.

```bash
# Create a new Power Platform project with boilerplate docs
pp-agency new-project "Contoso CRM" --client "Contoso Inc." --type model-driven --output ./projects

# Run an interactive discovery session and generate a report
pp-agency discovery

# Generate a PRD
pp-agency generate-prd --project "Contoso CRM" --client "Contoso Inc." --type model-driven --output ./prd.md

# Generate a Solution Design Document (SDD)
pp-agency generate-solution-design --project "Contoso CRM" --output ./solution-design.md

# Generate an AI agent brief
pp-agency agent-brief --agent architect --project "Contoso CRM" --output ./architect-brief.md

# Generate a phase checklist
pp-agency checklist --type deployment --output ./deployment-checklist.md

# Validate a project directory
pp-agency validate --project ./projects/contoso-crm

# Estimate licensing costs
pp-agency estimate-licensing --currency gbp --output ./licensing-estimate.md
```

### Command Reference

| Command | Purpose | Key options |
|---------|---------|-------------|
| `new-project <name>` | Scaffold a project with boilerplate docs | `--client`, `--type`, `--output` |
| `discovery` | Interactive discovery session + report | (interactive) |
| `generate-prd` | Generate a PRD | `-p/--project`, `-o/--output`, `-c/--client`, `-t/--type` |
| `generate-solution-design` | Generate a Solution Design Document | `-p/--project`, `-o/--output` |
| `agent-brief` | Generate an AI agent brief | `-a/--agent`, `-p/--project`, `-o/--output`, `-c/--context` |
| `checklist` | Generate a phase checklist | `-t/--type`, `-o/--output` |
| `validate` | Validate a project directory | `-p/--project <path>` |
| `estimate-licensing` | Estimate licensing costs | `-o/--output`, `-c/--currency` |

**Global options:** `-v/--version`, `--verbose`, `-h/--help`.

**`--agent` values:** `architect`, `data-modeler`, `developer`, `tester`, `alm-engineer`, `security-admin`.
**`--type` (project) values:** `canvas-app`, `model-driven`, `power-pages`, `integration`, `copilot`, `full-solution`.
**`--type` (checklist) values:** `project-intake`, `scope-validation`, `deployment`, `qa`, `governance`, `support-handover`.
**`--currency` values:** `usd`, `gbp`, `eur`.

There is no `playbook`, `agent`, `deploy`, `solution`, `check`, `prompt`, `docs`, or `repo` subcommand. Playbooks, prompts, and full checklists are markdown you **read and follow** — see the sections below. Repo-wide validation lives in the npm scripts (see [Pre-Commit Validation](#pre-commit-validation)). Full CLI docs: [`packages/cli/README.md`](packages/cli/README.md).

---

## Reading Agent Definitions

Agent definitions live in [`agents/`](agents/) as **markdown** files. Each describes a role's mission, responsibilities, inputs, outputs, tools, and handoffs. Read your own agent definition first to understand your scope, then read the definitions of the agents you'll hand off to.

The 16 agents:

| Agent file | Role |
|------------|------|
| [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md) | Coordinates the multi-agent delivery swarm |
| [`agents/solution-architect.md`](agents/solution-architect.md) | Overall solution architecture and design |
| [`agents/platform-cartographer.md`](agents/platform-cartographer.md) | Maps the platform surface and integration points |
| [`agents/commercial-strategy-agent.md`](agents/commercial-strategy-agent.md) | Scoping, pricing, and commercial offers |
| [`agents/licensing-capacity-agent.md`](agents/licensing-capacity-agent.md) | Licensing and capacity planning |
| [`agents/power-apps-agent.md`](agents/power-apps-agent.md) | Canvas and model-driven app build |
| [`agents/power-automate-agent.md`](agents/power-automate-agent.md) | Cloud flows and automation |
| [`agents/desktop-rpa-agent.md`](agents/desktop-rpa-agent.md) | Power Automate Desktop / RPA |
| [`agents/dataverse-agent.md`](agents/dataverse-agent.md) | Dataverse data modeling and security |
| [`agents/copilot-studio-agent.md`](agents/copilot-studio-agent.md) | Copilot Studio agents and topics |
| [`agents/ai-builder-agent.md`](agents/ai-builder-agent.md) | AI Builder models and document processing |
| [`agents/connector-integration-agent.md`](agents/connector-integration-agent.md) | Connectors and integration |
| [`agents/alm-deployment-agent.md`](agents/alm-deployment-agent.md) | ALM pipelines and deployment |
| [`agents/security-governance-agent.md`](agents/security-governance-agent.md) | Security, DLP, and governance |
| [`agents/qa-test-agent.md`](agents/qa-test-agent.md) | QA and test planning |
| [`agents/support-runbook-agent.md`](agents/support-runbook-agent.md) | Support handover and runbooks |

When you receive a task, read your own agent definition, then the playbook and checklists it references, then the relevant pattern docs in [`power-platform/`](power-platform/) and reference guides in [`docs/`](docs/).

---

## Using Prompts

Prompts are reusable templates in [`prompts/`](prompts/). The directory is **flat** — every prompt is a single `.md` file at the top level (no `system/`, `tasks/`, or `snippets/` subfolders). Read a prompt and adapt it to the task at hand; several are also wired into CLI commands (e.g. PRD and discovery generation).

The 16 prompts:

| Prompt | Use it for |
|--------|------------|
| [`prompts/repo-build-master-prompt.md`](prompts/repo-build-master-prompt.md) | Master prompt for building/extending this repo |
| [`prompts/client-discovery-prompt.md`](prompts/client-discovery-prompt.md) | Running a discovery session |
| [`prompts/power-apps-prd-prompt.md`](prompts/power-apps-prd-prompt.md) | PRD for a Power Apps build |
| [`prompts/automation-prd-prompt.md`](prompts/automation-prd-prompt.md) | PRD for a Power Automate build |
| [`prompts/copilot-agent-prd-prompt.md`](prompts/copilot-agent-prd-prompt.md) | PRD for a Copilot Studio agent |
| [`prompts/dataverse-design-prompt.md`](prompts/dataverse-design-prompt.md) | Dataverse data model design |
| [`prompts/custom-connector-prompt.md`](prompts/custom-connector-prompt.md) | Designing a custom connector |
| [`prompts/ai-builder-document-processing-prompt.md`](prompts/ai-builder-document-processing-prompt.md) | AI Builder document processing |
| [`prompts/rpa-assessment-prompt.md`](prompts/rpa-assessment-prompt.md) | Assessing an RPA candidate process |
| [`prompts/alm-deployment-prompt.md`](prompts/alm-deployment-prompt.md) | ALM / deployment planning |
| [`prompts/governance-audit-prompt.md`](prompts/governance-audit-prompt.md) | Governance / CoE audit |
| [`prompts/licensing-estimate-prompt.md`](prompts/licensing-estimate-prompt.md) | Licensing estimate |
| [`prompts/qa-test-plan-prompt.md`](prompts/qa-test-plan-prompt.md) | QA test plan |
| [`prompts/code-review-prompt.md`](prompts/code-review-prompt.md) | Reviewing solution code/config |
| [`prompts/support-runbook-prompt.md`](prompts/support-runbook-prompt.md) | Writing a support runbook |
| [`prompts/docs-watch-prompt.md`](prompts/docs-watch-prompt.md) | Keeping docs current/consistent |

### Composing prompts

These are plain markdown, so compose them by hand when a task needs more than one. For example, pair the solution architecture context with a PRD prompt:
```bash
cat prompts/repo-build-master-prompt.md prompts/power-apps-prd-prompt.md > /tmp/composed-prompt.md
echo "Client: ACME Corp. Requirements: ..." >> /tmp/composed-prompt.md
```
Then feed the composed file into your working context. For PRD generation specifically, prefer the CLI: `pp-agency generate-prd`.

---

## Following Playbooks

Playbooks are in [`playbooks/`](playbooks/) and define end-to-end delivery workflows. Read the playbook, execute each stage in order, validate at each gate against the referenced checklist, and document decisions and deviations.

### Available Playbooks

| Playbook | When to use |
|----------|-------------|
| [`playbooks/canvas-app.md`](playbooks/canvas-app.md) | Building a canvas app |
| [`playbooks/model-driven-app.md`](playbooks/model-driven-app.md) | Building a model-driven app |
| [`playbooks/power-pages-site.md`](playbooks/power-pages-site.md) | Building a Power Pages site |
| [`playbooks/dataverse-solution.md`](playbooks/dataverse-solution.md) | Designing a Dataverse solution |
| [`playbooks/power-automate-cloud-flow.md`](playbooks/power-automate-cloud-flow.md) | Building cloud flows |
| [`playbooks/power-automate-desktop-rpa.md`](playbooks/power-automate-desktop-rpa.md) | Building desktop / RPA flows |
| [`playbooks/agent-flow-workflow.md`](playbooks/agent-flow-workflow.md) | Agent-driven flow workflows |
| [`playbooks/approval-workflows.md`](playbooks/approval-workflows.md) | Approval-centric automation |
| [`playbooks/copilot-studio-agent.md`](playbooks/copilot-studio-agent.md) | Building a Copilot Studio agent |
| [`playbooks/ai-builder-gpt-prompts.md`](playbooks/ai-builder-gpt-prompts.md) | AI Builder GPT prompt work |
| [`playbooks/document-processing-ai-builder.md`](playbooks/document-processing-ai-builder.md) | AI Builder document processing |
| [`playbooks/custom-connector.md`](playbooks/custom-connector.md) | Building a custom connector |
| [`playbooks/azure-function-integration.md`](playbooks/azure-function-integration.md) | Azure Function integration |
| [`playbooks/microsoft-graph-integration.md`](playbooks/microsoft-graph-integration.md) | Microsoft Graph integration |
| [`playbooks/sharepoint-to-dataverse-migration.md`](playbooks/sharepoint-to-dataverse-migration.md) | SharePoint -> Dataverse migration |
| [`playbooks/alm-pipeline.md`](playbooks/alm-pipeline.md) | ALM / deployment pipeline |
| [`playbooks/governance-audit.md`](playbooks/governance-audit.md) | Governance / CoE audit |
| [`playbooks/production-support.md`](playbooks/production-support.md) | Production support and ops |

### How to Follow a Playbook

1. Read the playbook markdown file.
2. Execute each stage in order.
3. Validate at each gate using the referenced checklist (see below).
4. Document decisions and deviations in the project's docs.
5. Hand off to the next agent at stage boundaries.

---

## Validation & Checklists

Full checklists live in [`checklists/`](checklists/) and are your quality gates. The CLI can also **generate** a fresh phase checklist into a project with `pp-agency checklist --type <type>`.

### Available Checklists

| Checklist | Validates | When to run |
|-----------|-----------|-------------|
| [`checklists/project-intake.md`](checklists/project-intake.md) | Engagement readiness | Project kickoff |
| [`checklists/scope-validation.md`](checklists/scope-validation.md) | Scope completeness | After discovery |
| [`checklists/power-platform-environment.md`](checklists/power-platform-environment.md) | Environment setup | Environment provisioning |
| [`checklists/dataverse-security.md`](checklists/dataverse-security.md) | Dataverse security model | After schema/security design |
| [`checklists/connectors-and-premium.md`](checklists/connectors-and-premium.md) | Connector + premium usage | Before build |
| [`checklists/licensing-and-capacity.md`](checklists/licensing-and-capacity.md) | License/capacity requirements | Before build |
| [`checklists/ai-builder-readiness.md`](checklists/ai-builder-readiness.md) | AI Builder readiness | AI Builder projects |
| [`checklists/copilot-studio-readiness.md`](checklists/copilot-studio-readiness.md) | Copilot Studio readiness | Copilot projects |
| [`checklists/dlp-and-governance.md`](checklists/dlp-and-governance.md) | DLP and governance posture | Environment setup |
| [`checklists/alm-solution-readiness.md`](checklists/alm-solution-readiness.md) | Solution/ALM readiness | Before deployment |
| [`checklists/deployment.md`](checklists/deployment.md) | Go-live readiness | Deployment day |
| [`checklists/qa.md`](checklists/qa.md) | QA coverage and results | Before UAT |
| [`checklists/support-handover.md`](checklists/support-handover.md) | Support handover completeness | Project closeout |

### Running Validation

Use the CLI to validate a scaffolded project directory:
```bash
# Validate a single project directory (required files, frontmatter, cross-references)
pp-agency validate --project ./projects/contoso-crm
# Exit code 0 if all checks pass, 1 if failures
```
For repo-wide validation, use the npm scripts:
```bash
npm run validate            # structure check + docs check
npm run validate:structure  # required-files check (scripts/check-required-files.ts)
npm run docs:check          # markdown / cross-reference check (scripts/validate-docs.ts)
npm run repo:health         # required-files check, verbose
```

**All failures must be resolved or explicitly waived with documented justification.**

---

## File Creation Conventions

### Markdown Files

All markdown deliverables should include YAML frontmatter:
```markdown
---
title: "File Title"
description: "Brief description"
author: "[agent-name]"
date: "2026-01-15"
tags: ["tag1", "tag2"]
playbook: "playbook-name"
checklist: "checklist-name"
related:
  - "../path/to/related-file.md"
  - "../path/to/other-file.md"
---

# Content starts here
```

### Cross-References

Always link to related files using repo-relative paths:
```markdown
For the canvas-app workflow, see [Canvas App Playbook](playbooks/canvas-app.md).
Validated against [ALM Solution Readiness](checklists/alm-solution-readiness.md).
```

### Directory Structure for Projects

Scaffolded client projects live under [`projects/`](projects/) (see [`projects/README.md`](projects/README.md)). `pp-agency new-project` produces a structure like:

```
projects/
  <client-name>/
    project-brief.md
    discovery-notes.md
    prd.md
    solution-design.md
    checklists/
      project-intake.md
      scope-validation.md
      deployment.md
    agents/
      architect-brief.md
      developer-brief.md
```

### Naming Conventions

- Files: `kebab-case.md`
- Directories: `kebab-case/`
- Solutions: `PascalCase`
- Tables: `prefix_tablename` (where prefix is the client publisher prefix)
- Flows: `SolutionName - Flow Purpose`
- Apps: `SolutionName - App Purpose`

---

## Pre-Commit Validation

Before any commit, run these from the repo root:

```bash
# 1. Lint TypeScript / JS
npm run lint

# 2. Type-check the CLI
npm run typecheck

# 3. Repo structure + docs validation
npm run validate

# 4. Docs / cross-reference check (subset of validate)
npm run docs:check
```

To validate a specific scaffolded project as well:
```bash
pp-agency validate --project ./projects/<client-name>
```

All checks must pass before committing. If a check fails:
1. Read the error message.
2. Fix the issue (`npm run lint:fix` and `npm run format` can auto-correct many problems).
3. Re-run the check.
4. Document any intentional exceptions in the commit message.

CI mirrors this: see [`.github/workflows/lint.yml`](.github/workflows/lint.yml), [`.github/workflows/docs-check.yml`](.github/workflows/docs-check.yml), and [`.github/workflows/repo-health.yml`](.github/workflows/repo-health.yml).

---

## Example Workflow

A complete example from discovery to deployment. Note that **build and deploy happen in the target Power Platform tenant** (via the Power Platform admin tools and `pac` CLI documented in [`power-platform/pac-cli-cheatsheet.md`](power-platform/pac-cli-cheatsheet.md)); this repo's CLI scaffolds and documents the work, it does not deploy.

### Phase 1: Discovery

```bash
# Read the orchestrator + discovery context
cat agents/swarm-orchestrator.md
cat prompts/client-discovery-prompt.md

# Scaffold the project
pp-agency new-project "Contoso CRM" --client "Contoso Inc." --type model-driven --output ./projects

# Run discovery
pp-agency discovery

# Follow the discovery doc
cat docs/client-discovery.md
```
Handoff: orchestrator -> [`agents/solution-architect.md`](agents/solution-architect.md).

### Phase 2: Solution Design

```bash
# Architect reads the platform map and design references
cat docs/platform-map.md
cat docs/integration-patterns.md

# Generate the PRD and SDD
pp-agency generate-prd --project "Contoso CRM" --output ./projects/contoso-crm/prd.md
pp-agency generate-solution-design --project "Contoso CRM" --output ./projects/contoso-crm/solution-design.md

# Generate the data-modeler brief
pp-agency agent-brief --agent data-modeler --project "Contoso CRM" --output ./projects/contoso-crm/agents/data-modeler-brief.md

# Validate against the Dataverse security checklist while modeling
cat checklists/dataverse-security.md
```
Handoff: solution-architect -> [`agents/dataverse-agent.md`](agents/dataverse-agent.md) and [`agents/power-apps-agent.md`](agents/power-apps-agent.md).

### Phase 3: Build

```bash
# Developer follows the relevant playbook + patterns
cat playbooks/model-driven-app.md
cat power-platform/dataverse-patterns.md
cat power-platform/solution-patterns.md

# Generate the developer brief
pp-agency agent-brief --agent developer --project "Contoso CRM" --output ./projects/contoso-crm/agents/developer-brief.md
```
Handoff: power-apps-agent -> [`agents/qa-test-agent.md`](agents/qa-test-agent.md).

### Phase 4: QA & Validation

```bash
# Generate a QA checklist into the project
pp-agency checklist --type qa --output ./projects/contoso-crm/checklists/qa.md

# Follow the QA prompt + reference checklist
cat prompts/qa-test-plan-prompt.md
cat checklists/qa.md

# Validate the whole project directory
pp-agency validate --project ./projects/contoso-crm
```
Handoff: qa-test-agent -> [`agents/alm-deployment-agent.md`](agents/alm-deployment-agent.md).

### Phase 5: Deployment & Handover

```bash
# ALM engineer follows the pipeline playbook + pac CLI cheatsheet
cat playbooks/alm-pipeline.md
cat power-platform/pac-cli-cheatsheet.md
cat power-platform/alm-devops-patterns.md

# Generate the deployment checklist
pp-agency checklist --type deployment --output ./projects/contoso-crm/checklists/deployment.md

# Generate the support handover checklist
pp-agency checklist --type support-handover --output ./projects/contoso-crm/checklists/support-handover.md
```
Handoff: alm-deployment-agent -> [`agents/security-governance-agent.md`](agents/security-governance-agent.md) and [`agents/support-runbook-agent.md`](agents/support-runbook-agent.md).

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Build the CLI | `npm install && npm run build` |
| Show CLI help | `pp-agency --help` (or `node packages/cli/dist/index.js --help`) |
| Scaffold a project | `pp-agency new-project "<name>" --client "<client>" --type <type>` |
| Run discovery | `pp-agency discovery` |
| Generate a PRD | `pp-agency generate-prd --project "<name>" --output ./prd.md` |
| Generate an SDD | `pp-agency generate-solution-design --project "<name>"` |
| Generate an agent brief | `pp-agency agent-brief --agent <type> --project "<name>"` |
| Generate a checklist | `pp-agency checklist --type <type> --output <file>` |
| Estimate licensing | `pp-agency estimate-licensing --currency <ccy>` |
| Validate a project | `pp-agency validate --project <path>` |
| Lint | `npm run lint` |
| Type-check | `npm run typecheck` |
| Repo validate | `npm run validate` |
| Docs check | `npm run docs:check` |

---

> **Remember**: When in doubt, validate. When confident, validate anyway. Quality is not an accident.
