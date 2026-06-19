# @power-platform-agency/cli

Power Platform Dev Agency Toolkit CLI - A command-line interface for scaffolding, documenting, and managing Power Platform projects.

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
# Global installation from a GitHub Release
npm install -g https://github.com/Jimmycarroll2021/power-platform-dev-agency-toolkit/releases/download/v1.0.0/power-platform-agency-cli-1.0.0.tgz

# Local usage after cloning the repo
npx pp-agency --help
```

Replace `v1.0.0` with the latest release tag.

## Commands

### `pp-agency new-project <name>`

Create a new Power Platform project with boilerplate documentation.

**Options:**
- `--type <type>` - Project type: `canvas-app`, `model-driven`, `power-pages`, `integration`, `copilot`, `full-solution`
- `--client <client>` - Client/organization name
- `--output <dir>` - Output directory (default: current directory)

**Example:**
```bash
pp-agency new-project "Contoso CRM" --type model-driven --client "Contoso Inc."
```

---

### `pp-agency discovery`

Run an interactive discovery session to gather client requirements.

Generates a `discovery-report.md` with scoring matrix and recommendations.

**Example:**
```bash
pp-agency discovery
# Follow interactive prompts...
```

---

### `pp-agency generate-prd`

Generate a Product Requirements Document (PRD) for a project.

**Options:**
- `--project <name>` - Project name
- `--output <file>` - Output file path

**Example:**
```bash
pp-agency generate-prd --project "Contoso CRM" --output "./prd.md"
```

---

### `pp-agency generate-solution-design`

Generate a Solution Design Document (SDD) with architecture, data model, security, and ALM sections.

**Options:**
- `--project <name>` - Project name
- `--output <file>` - Output file path

**Example:**
```bash
pp-agency generate-solution-design --project "Contoso CRM" --output "./solution-design.md"
```

---

### `pp-agency agent-brief`

Generate a task-specific brief for an AI agent.

**Options:**
- `--agent <type>` - Agent type: `architect`, `data-modeler`, `developer`, `tester`, `alm-engineer`, `security-admin`
- `--project <name>` - Project name

**Example:**
```bash
pp-agency agent-brief --agent architect --project "Contoso CRM"
```

---

### `pp-agency checklist`

Generate a markdown checklist for various project phases.

**Options:**
- `--type <type>` - Checklist type: `project-intake`, `scope-validation`, `deployment`, `qa`, `governance`, `support-handover`
- `--output <file>` - Output file path

**Example:**
```bash
pp-agency checklist --type deployment --output "./deployment-checklist.md"
```

---

### `pp-agency validate`

Validate a project directory for required files, frontmatter, and cross-references.

**Options:**
- `--project <path>` - Path to project directory

**Example:**
```bash
pp-agency validate --project ./projects/contoso-crm
# Exit code 0 if all checks pass, 1 if failures
```

---

### `pp-agency estimate-licensing`

Estimate monthly licensing costs for Power Platform.

**Example:**
```bash
pp-agency estimate-licensing
# Follow interactive prompts for user counts, app types, etc.
```

---

## Global Options

- `--verbose` - Enable verbose logging
- `--help` - Show help for any command
- `--version` - Show CLI version

---

## Configuration via `.env`

Create a `.env` file in your working directory:

```env
# Default client name for projects
PPAGENCY_DEFAULT_CLIENT=My Organization

# Default output directory
PPAGENCY_OUTPUT_DIR=./projects

# Default project type
PPAGENCY_DEFAULT_TYPE=canvas-app

# License pricing tier (usd, gbp, eur)
PPAGENCY_CURRENCY=usd
```

## Output Format

All generated documents use **Markdown** format with YAML frontmatter:

```markdown
---
title: "Document Title"
project: "Project Name"
client: "Client Name"
date: "2024-01-15"
version: "1.0.0"
---

# Document Title

Content follows...
```

## Project Structure

A scaffolded project looks like:

```
project-name/
├── project-brief.md
├── discovery-notes.md
├── prd.md
├── solution-design.md
├── checklists/
│   ├── project-intake.md
│   ├── scope-validation.md
│   └── deployment.md
└── agents/
    ├── architect-brief.md
    └── developer-brief.md
```

## License

MIT
