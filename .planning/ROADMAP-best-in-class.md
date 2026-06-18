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

### Track A — Verify & date the corpus  *(fixes gaps 1 & 4)* ✅ COMPLETE
- Web-verified accuracy-critical docs against Microsoft Learn (licensing, capacity, AI Builder,
  Copilot Studio, ALM, connectors, governance + the 15 services).
- Added `verified_as_of` / `platform_state` / `sources` frontmatter to 33 docs.
- Replaced hedges with verified facts + citations, or honestly flagged `(unverified as of …)`.
- Produced [`VERIFICATION-LOG.md`](../VERIFICATION-LOG.md); logged deferred files.
- Anchor: [`docs/platform-state.md`](../docs/platform-state.md).

### Track B — Real CLI automation  *(fixes gap 2)* 🟡 PARTIAL
- ✅ [`packages/cli/src/lib/pac.ts`](../packages/cli/src/lib/pac.ts): typed wrapper over the `pac` CLI via `child_process`,
  graceful when `pac` is absent.
- ⬜ Register new commands: `solution export|import|publish`, `env list` (real Power Platform ops).
- ⬜ Enhance `validate` to optionally inspect an exported/unpacked solution.
- ✅ Degradation design: clear message when `pac`/auth is unavailable.

### Track C — Tests + CI teeth  *(fixes gap 3)* ✅ COMPLETE
- Node built-in test runner via `tsx` (no new deps). `npm test` runs unit + smoke tests.
- Unit tests: `markdown-utils`, `project-types`, `templates`, `file-utils`.
- Smoke test: scaffold a project to a temp dir and assert output.
- `npm run verify` = typecheck + lint + build + test + validate.

## Definition of done

- ✅ `npm run verify` green (typecheck, lint, build, **test**, validate).
- ✅ Accuracy-critical docs dated + cited; `VERIFICATION-LOG.md` lists status of all docs.
- 🟡 CLI `pac` wrapper built; top-level command registration remains for next pass.
- ✅ Test suite covers the CLI's pure logic + a scaffold smoke test.
- ✅ Committed; heartbeat updated.

## Verification results (commit 1ad3898 + 6fff85f)

| Gate | Result |
|------|--------|
| `npm run typecheck` | 0 errors |
| `npm run lint` | 0 errors |
| `npm run build` | CLI compiled |
| `npm run test` | 57 / 57 passed |
| `npm run validate` | Structure + docs links passed |

## Remaining work (next session)

1. Register `solution` and `env` CLI commands using `packages/cli/src/lib/pac.ts`.
2. Extend `validate-project.ts` with an optional `--solution <path>` flag.
3. Add unit tests for `pac.ts` (mock `spawnSync`).
4. Quarterly re-verification sweep for the 13 docs still carrying hedges.

## Heartbeat

Last updated: 2026-06-19  
Status: Track A & C complete; Track B wrapper complete, command registration pending.
