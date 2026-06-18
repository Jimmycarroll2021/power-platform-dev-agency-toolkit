# Roadmap — Make It Best In Class

**Goal:** Elevate `power-platform-dev-agency-toolkit` from a working, internally-consistent
scaffold to a genuinely best-in-class, trustworthy Power Platform delivery toolkit.

**Premise (Q1):** Internal Solstice IT delivery accelerator **and** public flagship/open-source asset.
**Wedge (Q2):** All four fronts, in parallel.
**Week-1 validator (Q3):** Our AI coding agents (the toolkit's primary consumers).
**Started:** 2026-06-19 · **Mode:** autonomous parallel build (ultracode).

## Baseline (pre-milestone, commit a983fc0)

Works end-to-end: install/build/typecheck/lint/validate green; 8-command CLI runs.
Gaps that block "best in class":
1. **Accuracy** — 67/170 md files carry "Needs verification" hedges; undated; 2024-anchored.
2. **Tooling depth** — CLI is a markdown generator; 0 real `pac`/Dataverse/deployment work.
3. **Tests** — 0 test files for 3.1k LOC of CLI.
4. **Freshness** — content undated; no platform-state anchor.

## Tracks (parallel)

### Track A — Verify & date the corpus  *(fixes gaps 1 & 4)*
- Web-verify accuracy-critical docs against Microsoft Learn (licensing, capacity, AI Builder,
  Copilot Studio, ALM, connectors, governance + the 15 services).
- Add `verified_as_of` / `platform_state` / `sources` frontmatter per verified doc.
- Replace hedges with verified facts + citations, or honestly flag `(unverified as of …)`.
- Produce `VERIFICATION-LOG.md`; log deferred files (no silent truncation).
- Anchor: [`docs/platform-state.md`](../docs/platform-state.md).

### Track B — Real CLI automation  *(fixes gap 2)*
- `packages/cli/src/lib/pac.ts`: typed wrapper over the `pac` CLI via `child_process`,
  graceful when `pac` is absent.
- New commands: `solution export|import|publish`, `env list` (real Power Platform ops).
- Enhance `validate` to optionally inspect an exported/unpacked solution.
- Everything degrades cleanly (clear message) when `pac`/auth is unavailable.

### Track C — Tests + CI teeth  *(fixes gap 3)*
- Node built-in test runner via `tsx` (no new deps). `npm test` runs unit + smoke tests.
- Unit tests: `markdown-utils`, `project-types`, `templates`, `file-utils`.
- Smoke test: scaffold a project to a temp dir and assert output.
- `npm run verify` = typecheck + lint + build + test + validate. Make CI gates hard.

## Definition of done

- `npm run verify` green (typecheck, lint, build, **test**, validate).
- Accuracy-critical docs dated + cited; `VERIFICATION-LOG.md` lists status of all docs.
- CLI performs at least one real `pac`-backed operation (graceful without `pac`).
- Test suite covers the CLI's pure logic + a scaffold smoke test.
- Committed; heartbeat updated.

## Heartbeat

`~/.claude/projects/.../memory/heartbeat-power-platform-dev-agency-toolkit.md`
