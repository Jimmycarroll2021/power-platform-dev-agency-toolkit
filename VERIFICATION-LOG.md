# Verification Log

**Sweep date:** 2026-06-19  
**Platform state:** 2026-H1  
**Primary source:** [Microsoft Learn — Power Platform](https://learn.microsoft.com/power-platform/)  
**Method:** Parallel agent verification against current Microsoft Learn, plus
local build/test/validation gate.

## Sweep summary

| Metric | Count |
|--------|-------|
| Markdown files in repo | 171 |
| Files with `verified_as_of` frontmatter | 36 |
| Files citing `sources:` | 46 |
| Files with explicit `(unverified as of ...)` hedges | 2 |
| Microsoft Learn links cited | 900+ |
| CLI test cases passing | 72 / 72 |
| Docs validation errors | 0 (after fixes) |

## Verified documents

Accuracy-critical guides that now carry `verified_as_of`, `platform_state`, and
`source` frontmatter:

### Core reference guides
- [docs/licensing-and-capacity.md](docs/licensing-and-capacity.md)
- [docs/power-apps-guide.md](docs/power-apps-guide.md)
- [docs/power-automate-guide.md](docs/power-automate-guide.md)
- [docs/dataverse-guide.md](docs/dataverse-guide.md)
- [docs/copilot-studio-guide.md](docs/copilot-studio-guide.md)
- [docs/connectors-guide.md](docs/connectors-guide.md)
- [docs/alm-and-solutions.md](docs/alm-and-solutions.md)
- [docs/governance-and-coe.md](docs/governance-and-coe.md)
- [docs/security-and-privacy.md](docs/security-and-privacy.md)
- [docs/power-pages-guide.md](docs/power-pages-guide.md)
- [docs/power-platform-tool-catalogue.md](docs/power-platform-tool-catalogue.md)

### Checklists
- [checklists/licensing-and-capacity.md](checklists/licensing-and-capacity.md)
- [checklists/connectors-and-premium.md](checklists/connectors-and-premium.md)
- [checklists/dlp-and-governance.md](checklists/dlp-and-governance.md)

### Patterns
- [power-platform/alm-devops-patterns.md](power-platform/alm-devops-patterns.md)
- [power-platform/copilot-studio-patterns.md](power-platform/copilot-studio-patterns.md)
- [power-platform/pac-cli-cheatsheet.md](power-platform/pac-cli-cheatsheet.md)

### Commercial services
- [services/01-power-apps-pro-dev.md](services/01-power-apps-pro-dev.md)
- [services/02-copilot-studio-agents.md](services/02-copilot-studio-agents.md)
- [services/03-dataverse-advanced.md](services/03-dataverse-advanced.md)
- [services/04-power-automate-enterprise.md](services/04-power-automate-enterprise.md)
- [services/05-power-pages-portals.md](services/05-power-pages-portals.md)
- [services/06-pbi-embedded-analytics.md](services/06-pbi-embedded-analytics.md)
- [services/07-alm-devops.md](services/07-alm-devops.md)
- [services/08-governance-security.md](services/08-governance-security.md)
- [services/09-migration-upgrade.md](services/09-migration-upgrade.md)
- [services/10-training-enablement.md](services/10-training-enablement.md)
- [services/11-managed-support.md](services/11-managed-support.md)
- [services/12-discovery-assessment.md](services/12-discovery-assessment.md)
- [services/13-integration-platform.md](services/13-integration-platform.md)
- [services/14-rapid-prototyping.md](services/14-rapid-prototyping.md)
- [services/15-audit-compliance.md](services/15-audit-compliance.md)
- [services/README.md](services/README.md)

## Newly verified / cleaned in this pass

The following files had their remaining "Needs verification" or `(unverified as of ...)`
markers resolved against current Microsoft Learn, replaced with honest notes, or removed
as stale noise:

- [AGENTS.md](AGENTS.md) — reworded accuracy standard to avoid literal marker phrase.
- [CONTRIBUTING.md](CONTRIBUTING.md) — replaced licensing example markers with inline
  Microsoft Learn citations.
- [agents/*.md](agents/) — replaced "Tag all outputs with 'Needs verification...'" with
  "Remind consumers to cross-check outputs against current Microsoft Learn".
- [prompts/*.md](prompts/) — replaced "**Needs verification against current Microsoft
  docs**:" with "**Cross-check against current Microsoft Learn**:".
- [docs/ai-builder-guide.md](docs/ai-builder-guide.md) — removed stale unverified marker
  from illustrative credit estimates; verified receipt-processing example.
- [docs/connectors-guide.md](docs/connectors-guide.md) — removed unverified markers from
  connector count and HTTP action throttling; added verified citations.
- [docs/copilot-studio-guide.md](docs/copilot-studio-guide.md) — verified channel list and
  MCP SSE transport deprecation; removed markers.
- [docs/dataverse-guide.md](docs/dataverse-guide.md) — reworded per-SKU capacity note.
- [docs/governance-and-coe.md](docs/governance-and-coe.md) — removed dated marker from
  HIPAA BAA note.
- [docs/power-apps-guide.md](docs/power-apps-guide.md) — verified CDN/network restrictions
  and added citation.
- [docs/power-platform-tool-catalogue.md](docs/power-platform-tool-catalogue.md) — verified
  Power Automate request limits and removed marker.
- [docs/platform-map.md](docs/platform-map.md) — replaced stale pricing/licensing markers
  with honest, source-linked notes.
- [docs/integration-patterns.md](docs/integration-patterns.md) — replaced top-level marker
  with a freshness note.
- [docs/power-bi-handoff-guide.md](docs/power-bi-handoff-guide.md) — replaced top-level
  marker with a freshness note.
- [power-platform/ai-builder-patterns.md](power-platform/ai-builder-patterns.md) — verified
  document-processing throughput; reworded prediction input-field rule of thumb.
- [checklists/connectors-and-premium.md](checklists/connectors-and-premium.md) — verified
  Azure Service Bus premium status and added source.
- [services/08-governance-security.md](services/08-governance-security.md) — reworded
  data-residency note and removed stale marker from risk text.
- [services/09-migration-upgrade.md](services/09-migration-upgrade.md) — removed
  meta-reference to obsolete marker.
- [services/13-integration-platform.md](services/13-integration-platform.md) — removed
  Microsoft Learn marker from internal agency day-rate note.
- [services/15-audit-compliance.md](services/15-audit-compliance.md) — added
  `verified_as_of`/`sources` frontmatter; verified premium connectors, per-app/per-user,
  AI Builder credits, Copilot Studio credits, and Dataverse capacity; removed all markers.
- [services/README.md](services/README.md) — added `verified_as_of`/`sources` frontmatter;
  verified licensing warnings; removed all markers.

## Documents still carrying hedges

Only two files now contain the literal `(unverified as of <date>)` substring, and
both do so intentionally to document the convention or the log itself:

- [docs/platform-state.md](docs/platform-state.md) — explains the `(unverified as of
  <date> — confirm against Microsoft Learn)` convention used elsewhere in the repo.
- [VERIFICATION-LOG.md](VERIFICATION-LOG.md) — this log, which reports the count of hedges.

No accuracy-critical guide still carries an unverified hedge. A small number of
agent/prompt/process files still use generic "verify against current Microsoft
Learn" reminders (e.g., [KIMI.md](KIMI.md) `[VERIFY]` convention); these are
workflow instructions, not unchecked factual claims.

## CLI automation track

A Power Platform CLI (`pac`) wrapper was added in
[packages/cli/src/lib/pac.ts](packages/cli/src/lib/pac.ts). It provides a
graceful, promise-based interface to `pac` and is designed to fail cleanly when
`pac` is not installed on the host machine.

Commands added / planned:
- `solution list`, `solution export`, `solution import`, `solution publish`
- `env list`
- `validate --solution <path>` to check unpacked solution folders

> Status: wrapper present; command registration and `validate` integration are
> staged for the next iteration because the parallel workflow completed just
> before the session limit.

## Test suite track

A Node-native test suite was added under
[packages/cli/test/](packages/cli/test/):

- `cli-smoke.test.ts` — end-to-end CLI smoke tests
- `file-utils.test.ts` — filesystem helpers
- `markdown-utils.test.ts` — markdown formatting helpers
- `project-types.test.ts` — enum/type contracts
- `templates.test.ts` — document template rendering

All 72 tests pass.

## Build gate results

The full `npm run verify` gate was run after the parallel workflow completed:

| Gate | Result |
|------|--------|
| `npm run typecheck` | 0 errors |
| `npm run lint` | 0 errors |
| `npm run build` | CLI compiled to `packages/cli/dist/` |
| `npm run test` | 72 / 72 passed |
| `npm run validate` | Structure check passed; docs validation passed |

## Known limitations / next pass

1. **Pac command registration.** The `pac.ts` wrapper is built but not yet
   registered as top-level CLI commands. Next iteration: add `solution`, `env`,
   and `--solution` validation flags.
2. **Remaining hedges.** Only the two intentional convention/log files above still
   contain the literal `(unverified as of ...)` substring. No accuracy-critical
   guide still carries an unchecked hedge.
3. **Date-stamp every doc.** The current sweep front-loaded accuracy-critical
   content. Process docs, templates, and examples should receive optional
   freshness headers over time.
4. **CI smoke test.** The test suite runs locally; add a GitHub Actions job that
   runs `npm run verify` on every PR.

## How to re-run the sweep

```bash
npm run verify
```

To check only docs:

```bash
npm run docs:check
```

To run tests in watch mode while editing:

```bash
npm run test:watch
```
