# Contributing to the Power Platform Dev Agency Toolkit

Thank you for contributing. This repository is a hybrid knowledge base + tooling
monorepo for a Microsoft Power Platform delivery practice: a large body of
markdown (services, playbooks, checklists, agent briefs, platform patterns) plus
a TypeScript CLI (`pp-agency`) that scaffolds and validates client engagements.

This guide tells you how to set up, what to run before opening a pull request,
and how to add new content the right way. It applies to **both human and
AI-agent contributors** — see [AI-agent contributors](#ai-agent-contributors).

For doc-specific style notes, see [docs/contributing.md](docs/contributing.md).

---

## Table of contents

1. [Project layout](#project-layout)
2. [Development setup](#development-setup)
3. [Quality gates (run before every PR)](#quality-gates-run-before-every-pr)
4. [Markdown conventions](#markdown-conventions)
5. [How to add content](#how-to-add-content)
6. [Commit and PR conventions](#commit-and-pr-conventions)
7. [AI-agent contributors](#ai-agent-contributors)
8. [Power Platform licensing warnings](#power-platform-licensing-warnings)

---

## Project layout

This is an npm workspaces monorepo. The markdown knowledge base lives at the repo
root; the only compiled code lives in `packages/cli`.

| Path              | What lives here                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `services/`       | Commercial service definitions (numbered: `NN-slug.md`).                                                                    |
| `playbooks/`      | Step-by-step delivery workflows (e.g. [playbooks/canvas-app.md](playbooks/canvas-app.md)).                                  |
| `checklists/`     | Phase quality gates (e.g. [checklists/deployment.md](checklists/deployment.md)).                                            |
| `agents/`         | AI agent role briefs (e.g. [agents/solution-architect.md](agents/solution-architect.md)).                                   |
| `prompts/`        | Reusable prompt templates (e.g. [prompts/client-discovery-prompt.md](prompts/client-discovery-prompt.md)).                  |
| `power-platform/` | Platform implementation patterns (e.g. [power-platform/alm-devops-patterns.md](power-platform/alm-devops-patterns.md)).     |
| `docs/`           | Extended reference docs (e.g. [docs/licensing-and-capacity.md](docs/licensing-and-capacity.md)).                            |
| `templates/`      | Document scaffolding templates (e.g. [templates/prd-template.md](templates/prd-template.md)).                               |
| `examples/`       | Worked end-to-end example projects (e.g. [examples/approval-automation/README.md](examples/approval-automation/README.md)). |
| `mcp/`            | Model Context Protocol / external-agent integration notes.                                                                  |
| `projects/`       | Generated client project workspaces (see [projects/README.md](projects/README.md)).                                         |
| `scripts/`        | Repo automation in TypeScript, run with `tsx` (e.g. [scripts/validate-docs.ts](scripts/validate-docs.ts)).                  |
| `packages/cli/`   | The `pp-agency` TypeScript CLI (ESM). Source in `packages/cli/src`.                                                         |

The CLI entry point is [packages/cli/src/index.ts](packages/cli/src/index.ts);
individual commands live in `packages/cli/src/commands`. Repo structure is
enforced by [scripts/check-required-files.ts](scripts/check-required-files.ts)
and documentation integrity by [scripts/validate-docs.ts](scripts/validate-docs.ts).

---

## Development setup

**Requirements**

- Node.js **>= 18** (CI uses Node 20). The CLI is published as ESM (`"type": "module"`).
- npm **>= 9** (workspaces support).

**Install and build**

```bash
# From the repo root
npm install        # installs root + packages/cli (workspaces)
npm run build      # builds packages/cli via tsc -> packages/cli/dist/index.js
```

`npm run setup` is a convenience alias for `npm install && npm run build`.

**Run the CLI**

After building, run it directly:

```bash
node packages/cli/dist/index.js --help
```

Or link it so the `pp-agency` binary is on your PATH:

```bash
cd packages/cli
npm link
pp-agency --help
```

### Available CLI commands

These are the **only** commands the CLI exposes. Do not document or reference
commands that are not in this list.

| Command                    | Purpose                                                      | Key options                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new-project <name>`       | Scaffold a new Power Platform project with boilerplate docs. | `-c, --client`, `-t, --type` (`canvas-app`, `model-driven`, `power-pages`, `integration`, `copilot`, `full-solution`), `-o, --output`                  |
| `discovery`                | Run an interactive discovery session and generate a report.  |                                                                                                                                                        |
| `generate-prd`             | Generate a Product Requirements Document.                    | `-p, --project`, `-o, --output`, `-c, --client`, `-t, --type`                                                                                          |
| `generate-solution-design` | Generate a Solution Design Document (SDD).                   |                                                                                                                                                        |
| `agent-brief`              | Generate an AI agent brief.                                  | `-a, --agent` (`architect`, `data-modeler`, `developer`, `tester`, `alm-engineer`, `security-admin`), `-p, --project`, `-o, --output`, `-c, --context` |
| `checklist`                | Generate a phase checklist.                                  | `-t, --type` (`project-intake`, `scope-validation`, `deployment`, `qa`, `governance`, `support-handover`), `-o, --output`                              |
| `validate`                 | Validate a project directory.                                | `-p, --project <path>`                                                                                                                                 |
| `estimate-licensing`       | Estimate licensing costs.                                    | `-o, --output`, `-c, --currency` (`usd`, `gbp`, `eur`)                                                                                                 |

Global flags: `-v, --version`, `--verbose`, `-h, --help`.

Example:

```bash
node packages/cli/dist/index.js new-project acme-onboarding \
  --client "Acme Corp" --type canvas-app --output ./projects
node packages/cli/dist/index.js validate --project ./projects/acme-onboarding
```

---

## Quality gates (run before every PR)

Run all of these from the repo root and make sure they pass before you open a PR:

```bash
npm run lint           # ESLint over .ts/.js
npm run typecheck      # tsc --noEmit
npm run validate       # structure check + docs check (see below)
npm run format:check   # Prettier in check mode
```

What they do:

- **`npm run lint`** — ESLint across the repo (`.ts`, `.js`). Fix automatically
  with `npm run lint:fix`.
- **`npm run typecheck`** — `tsc --noEmit`; the CLI and scripts must type-check
  cleanly.
- **`npm run validate`** — runs `npm run validate:structure`
  ([scripts/check-required-files.ts](scripts/check-required-files.ts)) **then**
  `npm run docs:check` ([scripts/validate-docs.ts](scripts/validate-docs.ts)).
  The structure check fails if a required directory or file is missing or too
  small; the docs check fails on broken cross-references, unclosed code fences,
  or files under the minimum size.
- **`npm run format:check`** — Prettier in check mode over
  `**/*.{ts,js,json,md,yaml,yml}`. Auto-format with `npm run format`.
- **`npm run lint:md`** — runs the same docs validator as `docs:check`
  (markdown integrity). Useful to run on its own while editing docs.
- **`npm test`** — runs `typecheck` then `validate`; a good single command to
  confirm the repo is green.

### Continuous integration

Three GitHub Actions workflows gate the repo. Match them locally before pushing:

| Workflow                                                               | Trigger                                          | Runs                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| [.github/workflows/lint.yml](.github/workflows/lint.yml)               | push / PR to `main`, `develop`                   | `npm run lint`, `npm run typecheck`, `npm run lint:md`                    |
| [.github/workflows/docs-check.yml](.github/workflows/docs-check.yml)   | push / PR touching `**.md` or the docs validator | `scripts/validate-docs.ts` + external link check                          |
| [.github/workflows/repo-health.yml](.github/workflows/repo-health.yml) | weekly schedule + manual dispatch                | structure check + docs validation; opens a `repo-health` issue on failure |

`lint.yml` and `docs-check.yml` are the PR-blocking gates. `repo-health.yml`
runs on a schedule, so a green local `npm run validate` keeps it happy too.

---

## Markdown conventions

The docs validator ([scripts/validate-docs.ts](scripts/validate-docs.ts))
enforces most of these mechanically. Following them keeps CI green.

- **Filenames are `kebab-case.md`** (e.g. `client-discovery.md`). Service files
  are the exception: they are prefixed with a two-digit number, `NN-slug.md`
  (e.g. `services/01-power-apps-pro-dev.md`).
- **Use GitHub-Flavored Markdown (GFM).** Tables, fenced code blocks, task
  lists, and reference links are all fine.
- **No unclosed code fences.** Every triple-backtick opening fence must have a
  matching close — the validator counts fence markers and fails on an odd number.
- **Cross-references must resolve.** Every relative link `[text](path)` in prose
  must point to a file that actually exists, using a path relative to the file
  you are editing. The validator skips links inside code fences, external
  (`http`/`mailto`) links, pure `#anchor` links, and placeholder targets
  containing `< > { } $ *` or `...`. Do **not** link to files that do not exist
  yet — add the target first, or use a placeholder token.
- **No `TODO`, `FIXME`, `HACK`, or `XXX` markers** in committed prose. These are
  flagged (currently as warnings) and must not be left behind in delivered docs.
- **Keep files substantive.** Files under 50 bytes fail the docs check; the
  structure check sets higher minimums for specific files (for example,
  `power-platform/*.md` patterns must be at least 200 bytes). New **service**
  files should be genuinely complete — aim for **at least 80 lines** of real,
  practical content.
- **Prefer lines under ~120 characters.** Longer lines are reported as warnings,
  not failures, but keeping prose wrapped keeps diffs readable.
- **Frontmatter for content files.** Most knowledge-base files carry a YAML
  frontmatter block with `title`, `description`, an optional `category`, and a
  `related:` list of relative paths. See
  [services/01-power-apps-pro-dev.md](services/01-power-apps-pro-dev.md) for the
  canonical shape. Doc-specific frontmatter rules are in
  [docs/contributing.md](docs/contributing.md).

---

## How to add content

### Add a new service

1. Create `services/NN-slug.md` using the next free two-digit number and a
   `kebab-case` slug. Use [services/01-power-apps-pro-dev.md](services/01-power-apps-pro-dev.md)
   as the template — copy its frontmatter shape and section structure
   (business problem & outcome, ideal client profile, scope, deliverables,
   licensing footprint, risks, pricing as an indicative range).
2. Write **at least 80 lines** of substantive, practical content. Treat any
   prices, rates, capacity numbers, or credit costs as **indicative planning
   ranges**, never as a client quote (see
   [licensing warnings](#power-platform-licensing-warnings)).
3. Add the service to the services index. If a `services/README.md` index exists
   in your working tree, add a row there; otherwise add it to the relevant
   listing in the root [README.md](README.md). Keep the numbering contiguous.
4. Cross-link the service to the playbooks, checklists, and agents it relies on
   via the frontmatter `related:` list and inline links — every target must
   already exist.

### Add a new playbook, checklist, or agent brief

1. Create the file in `playbooks/`, `checklists/`, or `agents/` respectively,
   `kebab-case.md`, following the structure of a neighbouring file in the same
   directory (e.g. [playbooks/alm-pipeline.md](playbooks/alm-pipeline.md),
   [checklists/qa.md](checklists/qa.md),
   [agents/qa-test-agent.md](agents/qa-test-agent.md)).
2. **Cross-link both ways.** Reference the related playbook/checklist/agent from
   the new file, and add a back-link from the files it relates to (for example a
   new checklist should be referenced from the playbook whose gate it enforces).
3. If the new content corresponds to a CLI-generatable artifact (a `checklist`
   `--type` or an `agent-brief` `--agent`), make sure the slug matches the CLI's
   accepted values listed in [Available CLI commands](#available-cli-commands).

### Add a new CLI command

1. Create the command module under `packages/cli/src/commands/` (one file per
   command), exporting a `register<Name>Command(program)` function that calls
   `program.command('<name>')` and wires its options — follow the existing
   modules such as [packages/cli/src/commands/checklist.ts](packages/cli/src/commands/checklist.ts).
2. **Register it** by importing and calling that function in
   [packages/cli/src/index.ts](packages/cli/src/index.ts) alongside the existing
   `register...` calls. A command that is not registered there will not exist.
3. Reuse shared helpers from `packages/cli/src/lib` (file, markdown, and
   project-type utilities) rather than re-implementing them.
4. Run `npm run build` and exercise the command via
   `node packages/cli/dist/index.js <name> --help`, then update the command
   table in this guide and in [packages/cli/README.md](packages/cli/README.md).
5. Add or update a test path covered by `npm test` where practical.

---

## Commit and PR conventions

- **Conventional Commits.** Use `type(scope): summary`, e.g.
  `feat(cli): add estimate-licensing currency flag`,
  `docs(services): add 15-managed-data-platform`,
  `fix(scripts): resolve broken cross-ref in validate-docs`.
  Common types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `ci`.
- **Keep PRs small and focused.** One logical change per PR. Splitting docs
  changes from CLI changes makes review and the path-filtered CI faster.
- **Fill in the PR template.** Complete
  [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md):
  description, type of change, the checklist (tests, typecheck, lint, docs
  validated), files changed, and testing notes.
- **All checks must pass.** Before requesting review, confirm `npm run lint`,
  `npm run typecheck`, `npm run validate`, and `npm run format:check` are green
  locally. PRs that fail `lint.yml` or `docs-check.yml` will not be merged.
- **Link the issue** if one exists (use the issue templates under
  `.github/ISSUE_TEMPLATE/`).

---

## AI-agent contributors

This repo is designed to be edited by autonomous AI agents as well as humans.
Per-tool instruction files at the repo root tell each agent how to operate here:

- [CLAUDE.md](CLAUDE.md) — Claude Code
- [KIMI.md](KIMI.md) — Kimi
- [CODEX.md](CODEX.md) — Codex
- [GEMINI.md](GEMINI.md) — Gemini
- [AGENTS.md](AGENTS.md) — generic / multi-agent swarm conventions

If you are an AI agent contributing here:

- Read your instruction file first, then the file(s) you intend to change.
- The **only** valid CLI commands are the eight listed in
  [Available CLI commands](#available-cli-commands). Do not invent commands
  (there is no `playbook`, `agent`, `deploy`, `solution`, `docs serve`,
  `repo health`, `check`, or `prompt run` command). If an instruction file
  references a command not in that list, treat the command list in this guide
  and in [packages/cli/src/index.ts](packages/cli/src/index.ts) as authoritative.
- Run the full [quality gates](#quality-gates-run-before-every-pr) before
  handing work back. Only cross-reference files that exist.
- If you change the instruction files themselves, keep them consistent with each
  other and with this guide.

---

## Power Platform licensing warnings

The toolkit produces licensing and capacity estimates (for example via
`estimate-licensing` and [docs/licensing-and-capacity.md](docs/licensing-and-capacity.md)).
When you author or update any content that mentions cost, capacity, or
entitlement, follow these rules:

- **Always mark uncertain platform facts.** Any specific price, capacity number,
  rate, or preview/GA status must be tagged
  `(Needs verification against current Microsoft docs)` unless you have just
  confirmed it against current official Microsoft documentation. Microsoft
  changes pricing, capacity allowances, and feature availability frequently.
- **Treat all figures as indicative planning ranges, not quotes.** Never write a
  number as a committed client price. Estimates are for internal planning and
  must be re-validated per engagement.
- **Call out premium licensing explicitly** whenever a feature requires it:
  - **Premium connectors** (and HTTP/custom connectors) require Power Apps
    Premium / Power Automate Premium entitlements — standard seeded licenses do
    not cover them.
    _(Needs verification against current Microsoft docs.)_
  - **Power Apps Premium (per-user) and Per-App** plans have different cost and
    coverage models; state which one an app assumes and flag the per-user impact.
    _(Needs verification against current Microsoft docs.)_
  - **AI Builder** consumes a credit pool; usage beyond the entitlement requires
    purchased AI Builder credit add-ons. State expected consumption as a range.
    _(Needs verification against current Microsoft docs.)_
  - **Copilot Studio** is metered by messages/sessions against a capacity pack;
    flag message-volume assumptions and overage risk.
    _(Needs verification against current Microsoft docs.)_
  - **Dataverse capacity** (database, file, and log storage) is a paid,
    consumable resource with a default tenant allotment plus per-license accrual;
    flag any design that will grow storage materially.
    _(Needs verification against current Microsoft docs.)_

When in doubt, under-promise on entitlement coverage and surface the licensing
risk early — a hidden premium dependency discovered at go-live is the most common
and most expensive delivery failure this toolkit exists to prevent.
