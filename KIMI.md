# Kimi Agent Instructions

> **When working in this repository, follow these instructions.** This guide is tailored for the Kimi interface and optimized for Power Platform delivery workflows in the `power-platform-dev-agency-toolkit` repo.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Repository Structure](#repository-structure)
3. [Running the CLI](#running-the-cli)
4. [Following Agent Briefs](#following-agent-briefs)
5. [Using Prompts](#using-prompts)
6. [Power Platform Rules](#power-platform-rules)
7. [Uncertainty and Verification](#uncertainty-and-verification)
8. [Microsoft Learn References](#microsoft-learn-references)
9. [Workflow Example](#workflow-example)
10. [Kimi-Specific Tips](#kimi-specific-tips)

---

## Getting Started

Welcome to the Power Platform Dev Agency Toolkit. As a Kimi agent, you are part of a multi-agent delivery model. Your output should be precise, well-documented, and validated against the checklists in `checklists/`.

This repo is **documentation-as-product**: agent briefs, playbooks, prompts, checklists, service definitions, and templates are all Markdown, plus one TypeScript CLI (`pp-agency`) that scaffolds and validates project docs. There is no application to deploy from here — the toolkit *produces* the artifacts a Power Platform engagement needs.

**First steps on every session:**

1. Read the repo overview: [`README.md`](README.md).
2. Read the multi-agent guide: [`AGENTS.md`](AGENTS.md).
3. Identify your role by reading the relevant agent brief in `agents/` — for example [`agents/solution-architect.md`](agents/solution-architect.md) or [`agents/power-apps-agent.md`](agents/power-apps-agent.md).
4. If a delivery workflow is in flight, read the matching playbook in `playbooks/`, e.g. [`playbooks/canvas-app.md`](playbooks/canvas-app.md).

---

## Repository Structure

```
power-platform-dev-agency-toolkit/
|-- agents/          # 16 agent role briefs (Markdown)
|-- playbooks/       # 18 step-by-step delivery workflows (Markdown)
|-- prompts/         # 16 reusable prompt templates (flat .md files)
|-- checklists/      # 13 validation checklists (Markdown)
|-- docs/            # 20 extended reference guides (Markdown)
|-- power-platform/  # 16 platform pattern references (Markdown)
|-- mcp/             # 4 MCP / external-agent integration notes
|-- templates/       # 14 deliverable templates (Markdown)
|-- services/        # 15 commercial service definitions (Markdown)
|-- examples/        # 4 worked example engagements (each a dir of .md)
|-- projects/        # Scaffolded project workspaces (README placeholder)
|-- scripts/         # 5 TypeScript automation scripts
`-- packages/cli/    # The pp-agency CLI (TypeScript, ESM)
```

**Key principle:** everything is a Markdown file. Specifications, designs, decisions, and validations all live in version-controlled Markdown. The CLI generates and checks those files — it does not replace them.

**Useful anchors:**

- Platform overview: [`docs/platform-map.md`](docs/platform-map.md)
- Delivery model: [`docs/delivery-model.md`](docs/delivery-model.md)
- Commercial services index: [`services/README.md`](services/README.md)
- `pac` CLI cheatsheet: [`power-platform/pac-cli-cheatsheet.md`](power-platform/pac-cli-cheatsheet.md)

---

## Running the CLI

The `pp-agency` CLI is written in TypeScript (ESM) and runs on Node.js 18+. Its source lives in [`packages/cli`](packages/cli/README.md).

### Setup (from the repo root)

```bash
npm install
npm run build
```

This produces `packages/cli/dist/index.js`. Run the CLI one of two ways:

```bash
# Direct, no install step
node packages/cli/dist/index.js --help

# Or link it onto your PATH once
cd packages/cli && npm link
pp-agency --help
```

### The commands that actually exist

The CLI scaffolds and validates Markdown deliverables. These are the **only** subcommands:

```bash
# Scaffold a new project workspace with boilerplate docs
pp-agency new-project "Contoso CRM" --type model-driven --client "Contoso Inc." --output ./projects

# Run an interactive discovery session -> discovery-report.md
pp-agency discovery

# Generate a Product Requirements Document
pp-agency generate-prd --project "Contoso CRM" --output ./prd.md --client "Contoso Inc." --type model-driven

# Generate a Solution Design Document (SDD)
pp-agency generate-solution-design --project "Contoso CRM" --output ./solution-design.md

# Generate an AI agent brief (architect|data-modeler|developer|tester|alm-engineer|security-admin)
pp-agency agent-brief --agent architect --project "Contoso CRM" --output ./architect-brief.md

# Generate a phase checklist
#   types: project-intake|scope-validation|deployment|qa|governance|support-handover
pp-agency checklist --type deployment --output ./deployment-checklist.md

# Validate a project directory (frontmatter, required files, cross-references)
pp-agency validate --project ./projects/contoso-crm

# Estimate licensing costs (currency: usd|gbp|eur)
pp-agency estimate-licensing --currency gbp --output ./licensing-estimate.md
```

Global flags: `-v`/`--version`, `--verbose`, `-h`/`--help`.

> Note: `pp-agency` has **no** `playbook`, `agent`, `deploy`, `solution`, `check`, `docs serve`, `repo health`, or `prompt run` subcommands. Playbooks, agent briefs, and prompts are Markdown you read and apply directly — they are not driven by the CLI.

### Repo-level npm scripts (run from the root)

| Task | Command |
|------|---------|
| Build the CLI | `npm run build` |
| Type-check | `npm run typecheck` |
| Lint TS/JS | `npm run lint` (auto-fix: `npm run lint:fix`) |
| Lint Markdown docs | `npm run lint:md` |
| Format | `npm run format` (check only: `npm run format:check`) |
| Validate repo structure + docs | `npm run validate` |
| Structure-only check | `npm run validate:structure` |
| Validate a generated project | `npm run validate:project <path>` |
| Docs cross-reference check | `npm run docs:check` |
| Repo health (verbose structure) | `npm run repo:health` |
| First-time setup | `npm run setup` |
| Test (typecheck + validate) | `npm run test` |

The underlying automation lives in `scripts/` (`check-required-files.ts`, `validate-docs.ts`, `generate-project.ts`, `create-agent-brief.ts`, `estimate-credits.ts`).

### Using the CLI in Kimi sessions

When Kimi suggests a CLI command, it will be formatted as a code block. You can:

1. Copy the command and run it in your terminal.
2. Ask Kimi to explain what the command does before running it.
3. Request modifications to the options (all are listed above).

Never suggest a command or subcommand that is not in the lists above. If a workflow needs something the CLI does not do, do the work in Markdown by hand using the templates in `templates/`.

---

## Following Agent Briefs

Agent roles live in `agents/` as Markdown briefs (not YAML). There are 16:

- Orchestration: [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md), [`agents/solution-architect.md`](agents/solution-architect.md), [`agents/platform-cartographer.md`](agents/platform-cartographer.md)
- Build specialists: [`agents/power-apps-agent.md`](agents/power-apps-agent.md), [`agents/power-automate-agent.md`](agents/power-automate-agent.md), [`agents/dataverse-agent.md`](agents/dataverse-agent.md), [`agents/copilot-studio-agent.md`](agents/copilot-studio-agent.md), [`agents/ai-builder-agent.md`](agents/ai-builder-agent.md), [`agents/desktop-rpa-agent.md`](agents/desktop-rpa-agent.md), [`agents/connector-integration-agent.md`](agents/connector-integration-agent.md)
- Quality and operations: [`agents/qa-test-agent.md`](agents/qa-test-agent.md), [`agents/alm-deployment-agent.md`](agents/alm-deployment-agent.md), [`agents/security-governance-agent.md`](agents/security-governance-agent.md), [`agents/support-runbook-agent.md`](agents/support-runbook-agent.md)
- Commercial: [`agents/licensing-capacity-agent.md`](agents/licensing-capacity-agent.md), [`agents/commercial-strategy-agent.md`](agents/commercial-strategy-agent.md)

When you pick up a task, **read your own agent brief first** to understand scope, inputs, outputs, and hand-offs, then read the briefs of agents you will hand off to. The repository-level coordination rules are in [`AGENTS.md`](AGENTS.md).

The CLI can also generate a fresh, project-scoped brief for any of six engagement roles:

```bash
pp-agency agent-brief --agent developer --project "Contoso CRM" --output ./developer-brief.md
```

---

## Using Prompts

Reusable prompt templates live in `prompts/` as **flat Markdown files** (there are no `system/`, `tasks/`, or `snippets/` subfolders). Reference them by path and apply them to the task at hand. The 16 prompts include:

- Discovery and requirements: [`prompts/client-discovery-prompt.md`](prompts/client-discovery-prompt.md), [`prompts/power-apps-prd-prompt.md`](prompts/power-apps-prd-prompt.md), [`prompts/automation-prd-prompt.md`](prompts/automation-prd-prompt.md), [`prompts/copilot-agent-prd-prompt.md`](prompts/copilot-agent-prd-prompt.md)
- Design and build: [`prompts/dataverse-design-prompt.md`](prompts/dataverse-design-prompt.md), [`prompts/custom-connector-prompt.md`](prompts/custom-connector-prompt.md), [`prompts/ai-builder-document-processing-prompt.md`](prompts/ai-builder-document-processing-prompt.md), [`prompts/rpa-assessment-prompt.md`](prompts/rpa-assessment-prompt.md)
- Quality, governance, ops: [`prompts/code-review-prompt.md`](prompts/code-review-prompt.md), [`prompts/qa-test-plan-prompt.md`](prompts/qa-test-plan-prompt.md), [`prompts/governance-audit-prompt.md`](prompts/governance-audit-prompt.md), [`prompts/alm-deployment-prompt.md`](prompts/alm-deployment-prompt.md), [`prompts/support-runbook-prompt.md`](prompts/support-runbook-prompt.md), [`prompts/licensing-estimate-prompt.md`](prompts/licensing-estimate-prompt.md)
- Toolkit maintenance: [`prompts/repo-build-master-prompt.md`](prompts/repo-build-master-prompt.md), [`prompts/docs-watch-prompt.md`](prompts/docs-watch-prompt.md)

### How to use prompts in Kimi

1. **Reference by path**: "Use [`prompts/power-apps-prd-prompt.md`](prompts/power-apps-prd-prompt.md) to draft a PRD for the onboarding app."
2. **Combine with a template**: read the prompt, then write the output into the matching file in `templates/` (e.g. [`templates/prd-template.md`](templates/prd-template.md)).
3. **Prefer the CLI for the structured deliverables it covers** (PRD, SDD, agent brief, checklist, discovery) and use the prompts for everything else, or to enrich CLI output.

---

## Power Platform Rules

### Architecture Rules

1. **Always use managed solutions** — unmanaged changes in production are not allowed.
2. **Never hardcode connections** — use connection references and environment variables (see [`power-platform/connection-references.md`](power-platform/connection-references.md) and [`power-platform/environment-variables.md`](power-platform/environment-variables.md)).
3. **Use configuration data, not code** — store environment-specific values in Dataverse, not in logic.
4. **Implement proper error handling** — all cloud flows must use scope-based try/catch patterns (see [`power-platform/power-automate-patterns.md`](power-platform/power-automate-patterns.md)).
5. **Follow naming conventions** — consistent prefixes for tables, flows, and solutions (see [`power-platform/solution-patterns.md`](power-platform/solution-patterns.md)).

### Security Rules

1. **Apply DLP policies** — validate against [`checklists/dlp-and-governance.md`](checklists/dlp-and-governance.md).
2. **Use service principals** — never personal credentials for automated processes.
3. **Implement least privilege** — grant the minimum necessary permissions (see [`checklists/dataverse-security.md`](checklists/dataverse-security.md)).
4. **Protect secrets** — use Azure Key Vault; reference [`docs/security-and-privacy.md`](docs/security-and-privacy.md).
5. **Enable auditing** — Dataverse tables holding sensitive data must have auditing enabled.

### Development Rules

1. **Version control everything** — all solution components are source-controlled.
2. **Use solution layers** — understand and document layering (see [`power-platform/alm-devops-patterns.md`](power-platform/alm-devops-patterns.md)).
3. **Test in isolation** — use separate development environments (see [`power-platform/environment-strategy.md`](power-platform/environment-strategy.md)).
4. **Document dependencies** — all external dependencies must be recorded.
5. **Follow ALM practices** — Dev → Test → UAT → Prod; reference [`docs/alm-and-solutions.md`](docs/alm-and-solutions.md) and [`playbooks/alm-pipeline.md`](playbooks/alm-pipeline.md).

### Copilot Studio Rules

1. **Version and manage topics** — keep topics in the managed solution.
2. **Implement fallback handling** — every agent needs a fallback topic.
3. **Test with real utterances** — validate against actual user phrases.
4. **Monitor analytics** — plan for conversation analytics from day one (see [`power-platform/monitoring-and-telemetry.md`](power-platform/monitoring-and-telemetry.md)).
5. **Secure knowledge sources** — control access to connected knowledge bases. See [`docs/copilot-studio-guide.md`](docs/copilot-studio-guide.md) and [`playbooks/copilot-studio-agent.md`](playbooks/copilot-studio-agent.md).

---

## Uncertainty and Verification

### Marking uncertain claims

When you are uncertain about a claim, you **must** mark it:

- **[VERIFY]** — needs verification against Microsoft documentation.
- **[ASSUMPTION]** — based on an assumption, confirm with the client.
- **[CONTEXT-DEPENDENT]** — answer depends on the specific client context.
- **[AGENT-HANDOFF]** — better answered by another agent.

### Example

```markdown
The Dataverse API request limit for a standard license is a per-user, per-24-hour figure [VERIFY].
For this project, we assume the client holds Power Apps Premium (Per User) licenses [ASSUMPTION].
The optimal integration approach depends on the client's existing Azure footprint [CONTEXT-DEPENDENT].
Licensing sign-off belongs to the licensing-capacity-agent [AGENT-HANDOFF].
```

### Always verify against sources

Before presenting technical claims as fact:

1. Check `docs/` for internal reference material (start at [`docs/platform-map.md`](docs/platform-map.md)).
2. Reference Microsoft Learn URLs for official guidance (see the table below).
3. Validate against `checklists/` for compliance requirements.
4. Consult the relevant playbook in `playbooks/` for the established pattern.

---

## Microsoft Learn References

Use these official Microsoft Learn resources to verify technical details:

| Topic | Microsoft Learn URL |
|-------|---------------------|
| Power Apps | https://learn.microsoft.com/en-us/power-apps/ |
| Power Automate | https://learn.microsoft.com/en-us/power-automate/ |
| Copilot Studio | https://learn.microsoft.com/en-us/microsoft-copilot-studio/ |
| Dataverse | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/ |
| Power Pages | https://learn.microsoft.com/en-us/power-pages/ |
| ALM | https://learn.microsoft.com/en-us/power-platform/alm/ |
| Security | https://learn.microsoft.com/en-us/power-platform/admin/security/ |
| Licensing | https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus/ |
| pac CLI | https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction |

### How to cite in output

```markdown
According to Microsoft Learn [1], the managed-solution export process...

[1]: https://learn.microsoft.com/en-us/power-platform/alm/
```

For a quick internal cross-walk of which tool does what, use [`docs/power-platform-tool-catalogue.md`](docs/power-platform-tool-catalogue.md).

---

## Workflow Example

### Complete Kimi session workflow

**User:** "Design a customer onboarding solution for ACME Corp using Power Platform."

**Kimi's internal process:**

1. **Identify role** — read [`AGENTS.md`](AGENTS.md); this maps to the [`agents/solution-architect.md`](agents/solution-architect.md) role.
2. **Read the agent brief** — open `agents/solution-architect.md` for scope and hand-offs.
3. **Scaffold the project** — create the workspace under `projects/`:
   ```bash
   pp-agency new-project "ACME Onboarding" --type model-driven --client "ACME Corp" --output ./projects
   ```
4. **Run discovery** — capture requirements:
   ```bash
   pp-agency discovery
   ```
5. **Generate the PRD** — use the CLI, then enrich with [`prompts/power-apps-prd-prompt.md`](prompts/power-apps-prd-prompt.md):
   ```bash
   pp-agency generate-prd --project "ACME Onboarding" --client "ACME Corp" --type model-driven --output ./projects/acme-onboarding/prd.md
   ```
6. **Design the solution** — follow [`playbooks/dataverse-solution.md`](playbooks/dataverse-solution.md) and [`playbooks/model-driven-app.md`](playbooks/model-driven-app.md); generate the SDD:
   ```bash
   pp-agency generate-solution-design --project "ACME Onboarding" --output ./projects/acme-onboarding/solution-design.md
   ```
7. **Brief the build agents** — produce role briefs:
   ```bash
   pp-agency agent-brief --agent data-modeler --project "ACME Onboarding" --output ./projects/acme-onboarding/agents/data-modeler-brief.md
   pp-agency agent-brief --agent developer    --project "ACME Onboarding" --output ./projects/acme-onboarding/agents/developer-brief.md
   ```
8. **Add gate checklists** — for example the deployment gate:
   ```bash
   pp-agency checklist --type deployment --output ./projects/acme-onboarding/checklists/deployment.md
   ```
9. **Validate the project** — confirm structure, frontmatter, and cross-references:
   ```bash
   pp-agency validate --project ./projects/acme-onboarding
   ```
10. **Hand off** — note in your output which agent takes over next (e.g. `power-apps-agent`, then `qa-test-agent`).

### Output format

Every Kimi response should follow this structure:

```markdown
## Action Taken
[Brief description of what was done]

## Files Created/Modified
- projects/acme-onboarding/prd.md - Product requirements
- projects/acme-onboarding/solution-design.md - Solution design

## Validation Status
- [x] `pp-agency validate --project ./projects/acme-onboarding` passed
- [ ] Premium licensing still to confirm [VERIFY]

## Next Steps
[Hand off to the next agent or continuation]

## References
- Playbook: playbooks/model-driven-app.md
- Checklist: checklists/deployment.md
- Service: services/01-power-apps-pro-dev.md
```

For end-to-end worked references, read the `examples/` engagements (each has `README.md`, `architecture.md`, `prd.md`, `prompts.md`, `risks.md`), e.g. the document-intake AI Builder example or the Copilot Studio service-agent example.

---

## Kimi-Specific Tips

1. **Long-context handling** — when reading large files, focus on the sections relevant to the current task; the docs and playbooks are self-contained per topic.
2. **Multi-turn workflows** — maintain context across turns by referencing files you created under `projects/`.
3. **File operations** — always use repo-relative paths from the repo root (e.g. `services/07-alm-devops.md`); confirm paths before creating files.
4. **Command safety** — only ever suggest the eight `pp-agency` subcommands and the root npm scripts documented above; explain what a command does before suggesting it.
5. **Map commercial scope to delivery** — when a request is about *what we sell*, point at the matching file in `services/` (15 service definitions, indexed in [`services/README.md`](services/README.md)); when it is about *how we build*, point at `playbooks/` and `power-platform/`.
6. **Error handling** — if `pp-agency validate` or `npm run validate` fails, read the reported item, fix it, and re-run; document any intentional waiver.

---

> **Quality Principle:** every deliverable must be verifiable, documented, and validated. When uncertain, mark it. When confident, validate anyway.
