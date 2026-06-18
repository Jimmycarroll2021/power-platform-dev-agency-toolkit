# Gemini CLI Agent Instructions

> **When working in the power-platform-dev-agency-toolkit repository, follow these instructions.** This guide is tailored for the Gemini CLI interface.

## Table of Contents

1. [Getting Started with Gemini](#getting-started)
2. [Repository Structure](#repository-structure)
3. [Using the CLI](#using-the-cli)
4. [Agent Roles for Gemini](#agent-roles)
5. [Power Platform Development Rules](#power-platform-rules)
6. [Validation Workflows](#validation-workflows)
7. [Session Management](#session-management)
8. [Example Workflow](#example-workflow)

---

## Getting Started

Welcome to the Power Platform Dev Agency Toolkit. As a Gemini agent, you operate within the Gemini CLI environment and interact with this repository to deliver Power Platform solutions.

This is a **documentation-and-scaffolding** repository. Everything is Markdown — agent role definitions, delivery playbooks, prompt templates, validation checklists, commercial service definitions, and reference docs. The only code is the `pp-agency` CLI under `packages/cli/` and a handful of TypeScript automation scripts under `scripts/`.

**Initial Setup:**

```bash
# Read your agent role (Markdown, not YAML)
cat agents/solution-architect.md

# Read multi-agent coordination
cat AGENTS.md

# Build the CLI tool (from the repo root)
npm install && npm run build
```

The build compiles the CLI to `packages/cli/dist/index.js`. After building you can run it as `node packages/cli/dist/index.js <cmd>`, or link it for a shorter invocation:

```bash
cd packages/cli && npm link   # makes `pp-agency` available on your PATH
pp-agency --help
```

**Key Principle**: You are part of a 16-agent swarm. Your actions should be coordinated, documented, and validated. Always check which agent role you are performing before starting work — see [AGENTS.md](AGENTS.md) and your role file in [agents/](agents/).

---

## Repository Structure

```
power-platform-dev-agency-toolkit/
|-- README.md              # Main repository documentation
|-- AGENTS.md              # Multi-agent swarm guide
|-- GEMINI.md              # This file - your instructions
|-- agents/                # 16 agent role definitions (Markdown)
|-- playbooks/             # 18 delivery playbooks (Markdown)
|-- prompts/               # 16 reusable prompt templates (flat, Markdown)
|-- checklists/            # 13 validation checklists (Markdown)
|-- docs/                  # 20 extended reference docs (Markdown)
|-- power-platform/        # 16 platform pattern guides (Markdown)
|-- mcp/                   # 4 MCP / agent-tooling notes (Markdown)
|-- templates/             # 14 deliverable templates (Markdown)
|-- services/              # 15 commercial service definitions + README
|-- examples/              # 4 worked example projects
|-- projects/              # Where generated client projects land
|-- packages/cli/          # The pp-agency CLI tool (TypeScript, ESM)
|-- scripts/               # 5 TypeScript automation scripts
```

**Navigation Tips:**
- Browse role files: `ls agents/` (every agent is a `.md` file)
- Read a playbook: `cat playbooks/canvas-app.md`
- Read a service definition: `cat services/01-power-apps-pro-dev.md`
- Use `pp-agency` for structured generation and validation
- Use `pac` for live Power Platform CLI operations against an environment

For an orientation map of the whole platform, start with [docs/platform-map.md](docs/platform-map.md).

---

## Using the CLI

### Building pp-agency

```bash
# From the repo root
npm install
npm run build

# Optional: link for a short `pp-agency` command
cd packages/cli && npm link
```

### The Actual Commands

The CLI generates and validates Markdown deliverables. These are the **only** commands it supports — invoke them as `pp-agency <cmd>` (after linking) or `node packages/cli/dist/index.js <cmd>`.

```bash
# Show all commands and global options
pp-agency --help

# Scaffold a new project with boilerplate docs
pp-agency new-project "Contoso CRM" --type model-driven --client "Contoso Inc."

# Run an interactive discovery session -> discovery report
pp-agency discovery

# Generate a Product Requirements Document
pp-agency generate-prd --project "Contoso CRM" --output ./prd.md

# Generate a Solution Design Document (SDD)
pp-agency generate-solution-design --project "Contoso CRM" --output ./solution-design.md

# Generate a task-specific brief for an AI agent
pp-agency agent-brief --agent architect --project "Contoso CRM"

# Generate a phase checklist
pp-agency checklist --type deployment --output ./deployment-checklist.md

# Validate a project directory (exit 0 = pass, 1 = failures)
pp-agency validate --project ./projects/contoso-crm

# Estimate monthly licensing costs
pp-agency estimate-licensing --currency usd
```

**Command option reference:**

| Command | Key options |
|---------|-------------|
| `new-project <name>` | `--client`, `--type`, `--output` |
| `discovery` | (interactive) |
| `generate-prd` | `-p/--project`, `-o/--output`, `-c/--client`, `-t/--type` |
| `generate-solution-design` | `-p/--project`, `-o/--output`, `-c/--client`, `-t/--type` |
| `agent-brief` | `-a/--agent`, `-p/--project`, `-o/--output`, `-c/--context` |
| `checklist` | `-t/--type`, `-o/--output` |
| `validate` | `-p/--project <path>` |
| `estimate-licensing` | `-o/--output`, `-c/--currency` |

Global flags: `-v/--version`, `--verbose`, `-h/--help`.

Valid `--agent` values: `architect`, `data-modeler`, `developer`, `tester`, `alm-engineer`, `security-admin`.
Valid `checklist --type` values: `project-intake`, `scope-validation`, `deployment`, `qa`, `governance`, `support-handover`.

> There is **no** `playbook`, `agent run`, `solution`, `deploy`, `check`, `repo health`, `docs serve`, or `prompt run` command. Playbooks, agent roles, and prompts are Markdown files you read — not subcommands. For repo-wide quality, use the npm scripts below.

### Repo-Level npm Scripts

Run these from the repo root for build, lint, and validation tasks:

```bash
npm run build              # Compile the CLI
npm run typecheck          # tsc --noEmit
npm run lint               # ESLint over .ts / .js
npm run lint:fix           # ESLint with --fix
npm run lint:md            # Validate Markdown docs (scripts/validate-docs.ts)
npm run format             # Prettier write
npm run format:check       # Prettier check
npm run validate           # Structure + docs checks
npm run validate:structure # Required-files check (scripts/check-required-files.ts)
npm run validate:project   # Validate a project dir via the CLI
npm run docs:check         # Markdown docs validation
npm run repo:health        # Required-files check, verbose
npm run clean              # Remove dist / node_modules in packages
npm run setup              # install + build
npm run test               # typecheck + validate
```

### Gemini CLI Integration

When using Gemini CLI you can invoke any of these directly and interpret the results in the chat. For example, ask Gemini to run `npm run validate` after editing docs, or `pp-agency validate --project ./projects/contoso-crm` after scaffolding a project, and read back the report.

### Working with Files

```bash
# Read an agent role definition (Markdown)
cat agents/solution-architect.md

# Read a delivery playbook
cat playbooks/dataverse-solution.md

# Read a prompt template (prompts/ is a flat directory of .md files)
cat prompts/client-discovery-prompt.md

# Read a validation checklist
cat checklists/deployment.md

# Read a commercial service definition
cat services/07-alm-devops.md
```

---

## Agent Roles

Agent roles live in [agents/](agents/) as **Markdown** files (one `.md` per agent). The full swarm catalog, handoff protocol, activation rules, and validation gates are defined in [AGENTS.md](AGENTS.md).

### The 16 Agents

| Agent file | Focus |
|------------|-------|
| [agents/swarm-orchestrator.md](agents/swarm-orchestrator.md) | Coordinates the swarm, routes handoffs |
| [agents/platform-cartographer.md](agents/platform-cartographer.md) | Maps the platform / produces the platform map |
| [agents/solution-architect.md](agents/solution-architect.md) | Overall solution architecture and tech specs |
| [agents/dataverse-agent.md](agents/dataverse-agent.md) | Dataverse schema, security model, business rules |
| [agents/power-apps-agent.md](agents/power-apps-agent.md) | Canvas and model-driven app development |
| [agents/power-automate-agent.md](agents/power-automate-agent.md) | Cloud flows, approvals, integrations |
| [agents/copilot-studio-agent.md](agents/copilot-studio-agent.md) | Copilot Studio agents and topics |
| [agents/ai-builder-agent.md](agents/ai-builder-agent.md) | AI Builder models and document processing |
| [agents/connector-integration-agent.md](agents/connector-integration-agent.md) | Custom connectors and integration patterns |
| [agents/desktop-rpa-agent.md](agents/desktop-rpa-agent.md) | Power Automate Desktop / RPA |
| [agents/alm-deployment-agent.md](agents/alm-deployment-agent.md) | ALM pipelines, environment promotion, deployment |
| [agents/security-governance-agent.md](agents/security-governance-agent.md) | Security review, DLP, governance |
| [agents/qa-test-agent.md](agents/qa-test-agent.md) | Test plans, validation, defect tracking |
| [agents/licensing-capacity-agent.md](agents/licensing-capacity-agent.md) | Licensing and capacity planning |
| [agents/support-runbook-agent.md](agents/support-runbook-agent.md) | Production support and runbooks |
| [agents/commercial-strategy-agent.md](agents/commercial-strategy-agent.md) | Service packaging, proposals, commercials |

### How to Use a Role

When starting a task, tell Gemini:
1. Which agent role to assume (read the matching file in [agents/](agents/))
2. Which playbook to follow (from [playbooks/](playbooks/))
3. Which checklist to validate against (from [checklists/](checklists/))

You can also generate a focused, task-specific brief with the CLI rather than copy-pasting a role:

```bash
pp-agency agent-brief --agent architect --project "Contoso CRM" --output ./architect-brief.md
```

Example prompt to Gemini:

```
Assume the solution-architect role (agents/solution-architect.md). Follow the
dataverse-solution playbook (playbooks/dataverse-solution.md). Validate the
result against the deployment checklist (checklists/deployment.md). Design a
customer onboarding solution backed by a Dataverse table.
```

---

## Power Platform Rules

### Core Development Rules

1. **Managed Solutions Only** - Never deploy unmanaged solutions to production
2. **No Hardcoded Values** - Use environment variables and configuration tables
3. **Connection References** - Always use connection references, never direct connections
4. **Error Handling** - All flows must have proper error handling and notifications
5. **Naming Conventions** - Follow consistent naming for all components

Reference patterns in [power-platform/](power-platform/), e.g. [power-platform/connection-references.md](power-platform/connection-references.md), [power-platform/environment-variables.md](power-platform/environment-variables.md), and [power-platform/solution-patterns.md](power-platform/solution-patterns.md).

### Security Rules

1. **DLP Policies** - Apply Data Loss Prevention policies to all environments
2. **Service Principals** - Use service principals for automated operations
3. **Least Privilege** - Grant minimum necessary permissions
4. **Audit Logging** - Enable auditing on all Dataverse tables
5. **Secret Management** - Use Azure Key Vault for secrets

See [docs/security-and-privacy.md](docs/security-and-privacy.md) and [docs/governance-and-coe.md](docs/governance-and-coe.md).

### ALM Rules

1. **Environment Strategy** - Use Dev -> Test -> UAT -> Production
2. **Source Control** - All components in version control
3. **Branching** - Use feature branches, pull requests required
4. **Validation Gates** - Checklists must pass before stage advancement
5. **Documentation** - Every change must be documented

See [docs/alm-and-solutions.md](docs/alm-and-solutions.md), [power-platform/alm-devops-patterns.md](power-platform/alm-devops-patterns.md), and the [playbooks/alm-pipeline.md](playbooks/alm-pipeline.md) playbook.

### Copilot Studio Rules

1. **Managed Topics** - All topics must be managed
2. **Fallback Handling** - Implement fallback for unrecognized inputs
3. **Testing** - Test with real user utterances
4. **Analytics** - Monitor conversation metrics
5. **Knowledge Security** - Control access to knowledge bases

See [docs/copilot-studio-guide.md](docs/copilot-studio-guide.md) and [power-platform/copilot-studio-patterns.md](power-platform/copilot-studio-patterns.md).

---

## Validation Workflows

There is no `pp-agency validate --checklist` command. Validation happens two ways: (1) run the repo-level npm scripts, and (2) run `pp-agency validate --project <path>` against a generated project. The Markdown files in [checklists/](checklists/) are the human/agent checklists you work through manually at each gate.

### Pre-Development Validation

```bash
# Review licensing and capacity requirements
cat checklists/licensing-and-capacity.md
pp-agency estimate-licensing --currency usd --output ./licensing-estimate.md

# Review the project-intake and security checklists
cat checklists/project-intake.md
cat checklists/dataverse-security.md
```

### During Development Validation

```bash
# Validate repo structure and Markdown docs while you edit
npm run validate

# Work through the data model and governance checklists
cat checklists/power-platform-environment.md
cat checklists/dlp-and-governance.md
```

### Pre-Deployment Validation

```bash
# Validate the generated project directory
pp-agency validate --project ./projects/contoso-crm

# Full repo health + typecheck
npm run test
npm run repo:health

# Work through the deployment and QA checklists
cat checklists/deployment.md
cat checklists/qa.md
```

### Validation Report Format

`pp-agency validate --project` prints a structured report and sets its exit code (0 = pass, 1 = failures). It checks required files, frontmatter, and cross-references in the target project directory. A typical run looks like:

```
VALIDATION REPORT
================
Project: ./projects/contoso-crm
Date: 2026-06-18

SUMMARY
-------
Total: 12 checks
Passed: 11
Failed: 1

FAILED CHECKS
-------------
1. Missing required file: solution-design.md
   Remediation: run `pp-agency generate-solution-design --project "Contoso CRM"`

PASSED CHECKS
-------------
1. project-brief.md present with valid frontmatter
2. prd.md cross-references resolve
...
```

---

## Session Management

### Starting a Session

```bash
# 1. Read the repo overview
cat README.md

# 2. Determine your role
cat agents/<your-role>.md

# 3. Review the swarm coordination model
cat AGENTS.md

# 4. Pick the playbook for the current stage
cat playbooks/<playbook-name>.md

# 5. Build the CLI if you haven't already
npm install && npm run build
```

### During a Session

1. **Follow playbooks** - Reference [playbooks/](playbooks/) for the current stage
2. **Use prompts** - Load relevant templates from [prompts/](prompts/) (flat directory of `.md` files)
3. **Validate often** - Run `npm run validate` after doc edits and `pp-agency validate --project` after scaffolding
4. **Document decisions** - Capture decisions in Markdown (use [templates/architecture-decision-record.md](templates/architecture-decision-record.md))
5. **Track handoffs** - Note when work should transfer to another agent (handoff format in [AGENTS.md](AGENTS.md))

### Ending a Session

```bash
# Validate the project you produced
pp-agency validate --project ./projects/<client-name>

# Repo-wide checks
npm run test
npm run repo:health

# Note next steps and handoffs in your output
```

---

## Example Workflow

### Building a Customer Portal with Gemini

**User**: "Build a customer self-service portal using Power Pages."

**Gemini's workflow:**

```bash
# Step 1: Identify roles - read architect and app-dev roles
cat agents/solution-architect.md
cat agents/power-apps-agent.md

# Step 2: Scaffold the project
pp-agency new-project "Acme Portal" --type power-pages --client "Acme Corp" --output ./projects/

# Step 3: Review the relevant playbook and service definition
cat playbooks/power-pages-site.md
cat services/05-power-pages-portals.md

# Step 4: Review licensing before committing to premium features
cat checklists/licensing-and-capacity.md
pp-agency estimate-licensing --currency usd --output ./projects/acme-portal/licensing-estimate.md

# Step 5: Generate the solution design
pp-agency generate-solution-design --project "Acme Portal" \
  --output ./projects/acme-portal/solution-design.md

# Step 6: Generate a developer brief for implementation
pp-agency agent-brief --agent developer --project "Acme Portal" \
  --output ./projects/acme-portal/developer-brief.md

# Step 7: Implement components following the Power Pages playbook
#         (apply patterns from power-platform/power-pages-patterns.md)

# Step 8: Validate the project directory and the repo
pp-agency validate --project ./projects/acme-portal
npm run validate

# Step 9: Work through the deployment and QA checklists
cat checklists/deployment.md
cat checklists/qa.md

# Step 10: Document and hand off to the alm-deployment-agent
```

### Session Output Format

Each Gemini session should produce:

```markdown
# Session Report

## Role
[Agent role used, e.g. solution-architect]

## Playbook
[Playbook followed, e.g. playbooks/power-pages-site.md]

## Actions Taken
1. [Action 1]
2. [Action 2]

## Files Created
- `./projects/acme-portal/solution-design.md` - Description
- `./projects/acme-portal/developer-brief.md` - Description

## Validation Results
- `pp-agency validate --project`: PASS
- `npm run validate`: PASS

## Decisions Made
- Decision 1: Rationale...

## Next Steps
- Handoff to: [agent name, e.g. alm-deployment-agent]
- Next task: [description]
```

---

## Quick Command Reference

| Task | Command |
|------|---------|
| Read agent role | `cat agents/<name>.md` |
| Read playbook | `cat playbooks/<name>.md` |
| Read prompt template | `cat prompts/<name>.md` |
| Read checklist | `cat checklists/<name>.md` |
| Read service definition | `cat services/<nn-name>.md` |
| Scaffold project | `pp-agency new-project <name>` |
| Generate PRD | `pp-agency generate-prd --project <name>` |
| Generate SDD | `pp-agency generate-solution-design --project <name>` |
| Generate agent brief | `pp-agency agent-brief --agent <type> --project <name>` |
| Generate checklist | `pp-agency checklist --type <type>` |
| Estimate licensing | `pp-agency estimate-licensing` |
| Validate project | `pp-agency validate --project <path>` |
| Validate repo | `npm run validate` |
| Repo health | `npm run repo:health` |

---

> **Core Principle**: Validate early, validate often. Every deliverable must pass its checklist. Every decision must be documented. Every handoff must be explicit.
