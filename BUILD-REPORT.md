# Build Report

This report records how the `power-platform-dev-agency-toolkit` repository was
assembled, hardened, and verified into a working end-to-end project.

## Summary

The repository was delivered as an archive of ~180 markdown/TypeScript files with a
`pp-agency` CLI. It did **not** build or install as-is, and its top-level documentation
described an aspirational structure that did not match the files actually present. This
build made the repository install, build, lint, validate, and run end-to-end, and brought
the documentation into agreement with the real structure.

Final state: **install ✓ · build ✓ · typecheck ✓ · lint ✓ · structure check ✓ · docs validation ✓ · CLI runs ✓**

## What was fixed

### Toolchain / build
- Removed the phantom `packages/core` workspace from [`package.json`](package.json) (it did not exist and broke `npm install`).
- Deleted a stale, partial lockfile that pointed at an internal mirror; regenerated a clean workspace-aware `package-lock.json` against the public npm registry.
- Added `tsx` so the `scripts/*.ts` utilities (which use a `tsx` shebang) run.
- Fixed 9 dead-code errors (unused locals/imports/params) that failed the strict root `tsc --noEmit`.
- Result: `npm install` (clean), `npm run build` (CLI compiles to `packages/cli/dist/`), and `npm run typecheck` all pass.

### Correctness bugs
- [`scripts/estimate-credits.ts`](scripts/estimate-credits.ts): a `${currency}` placeholder inside a double-quoted string never interpolated — switched to a template literal.
- [`prompts/automation-prd-prompt.md`](prompts/automation-prd-prompt.md): a duplicate code fence left a code block unclosed — removed the stray fence.
- [`scripts/generate-project.ts`](scripts/generate-project.ts): unnecessary regex escape (`\-` in a character class).

### Lint / formatting
- Added [`.eslintrc.json`](.eslintrc.json), [`.prettierrc.json`](.prettierrc.json), and `.prettierignore`. The `lint` CI job (`continue-on-error: false`) had no ESLint config to run.
- Cleared all ESLint errors (`prefer-const`, `no-useless-escape`).

### Validators
- Rewrote [`scripts/validate-docs.ts`](scripts/validate-docs.ts) into a meaningful gate: broken relative cross-references, unclosed code fences, and undersized files are **errors**; TODO/FIXME markers are **warnings**. Example links inside code fences and placeholder tokens are skipped, and `.planning/`, `dist/`, and `node_modules/` are ignored.
- Created [`projects/`](projects/README.md) so the structure required by both validators is satisfied.

### CI / scripts
- [`.gitignore`](.gitignore): stopped ignoring `package-lock.json` (CI uses `npm ci`, which requires the committed lockfile).
- [`package.json`](package.json): repointed broken npm scripts (`validate`, `docs:check`, `repo:health`, `test`, …) off non-existent `pp-agency` subcommands and onto the real scripts/CLI; added `lint:md`.
- [`docker-compose.yml`](docker-compose.yml): removed the `packages/core` volume mount and the dead `docs:serve` command.
- [`.env.example`](.env.example): replaced a fictional default checklist name with a real one.

### Documentation reconciliation
The overview/instruction files described a fictional structure (a `packages/core`
package, a `/services/` directory, `.yaml` agents, `prompts/system|tasks|snippets`
subfolders, `/mnt/agents/output/...` paths, and CLI commands such as `playbook`,
`agent`, `deploy`, `solution`, `docs serve`, `repo health`). All were corrected to the
real structure and the eight real CLI commands across
[`README.md`](README.md), [`CLAUDE.md`](CLAUDE.md), [`KIMI.md`](KIMI.md),
[`CODEX.md`](CODEX.md), [`GEMINI.md`](GEMINI.md), and [`AGENTS.md`](AGENTS.md).

### New content
- [`services/`](services/README.md): authored the 15 commercial service definitions referenced by the README and the package description, plus a catalogue index. Each links into the real playbooks, checklists, agents, docs, patterns, and templates.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/contributing.md`](docs/contributing.md): contribution guidelines accurate to this repo.

## Verification

| Gate | Command | Result |
|------|---------|--------|
| Install | `npm install` | clean |
| Build | `npm run build` | CLI compiles to `packages/cli/dist/` |
| Typecheck | `npm run typecheck` | 0 errors |
| Lint | `npm run lint` | 0 errors |
| Structure | `npm run validate:structure` | passed (0 critical missing) |
| Docs | `npm run docs:check` | 167 files, 0 errors |
| CLI | `node packages/cli/dist/index.js --help` + scaffold/validate | runs end-to-end |

The eight CLI commands (`new-project`, `discovery`, `generate-prd`,
`generate-solution-design`, `agent-brief`, `checklist`, `validate`,
`estimate-licensing`) were exercised: scaffolding a project and generating
checklists/documents works as documented.

## Notes & follow-ups

- The CLI's `discovery` and `estimate-licensing` commands are interactive (they prompt
  via `inquirer`) and require a TTY.
- `pp-agency validate` reports a freshly scaffolded project as incomplete until its
  recommended deliverables (`prd.md`, `solution-design.md`) are generated — this is by design.
- Microsoft-specific facts (pricing, capacity numbers, preview status) in the service and
  guide docs are marked where they should be re-verified against current Microsoft documentation.
- The original build spec and plan are preserved under [`.planning/`](.planning/) for provenance.
