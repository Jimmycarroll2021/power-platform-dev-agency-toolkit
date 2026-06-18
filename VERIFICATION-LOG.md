# Verification Log

**Sweep date:** 2026-06-19  
**Platform state:** 2026-H1  
**Primary source:** [Microsoft Learn — Power Platform](https://learn.microsoft.com/power-platform/)  
**Method:** Parallel agent verification against current Microsoft Learn, plus
local build/test/validation gate.

## Sweep summary

| Metric | Count |
|--------|-------|
| Markdown files in repo | 154 |
| Files with `verified_as_of` frontmatter | 33 |
| Files citing `sources:` | 40 |
| Files with explicit `(unverified as of ...)` hedges | 15 |
| Microsoft Learn links cited | 100+ |
| CLI test cases passing | 57 / 57 |
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

## Documents still carrying hedges

These files contain explicit `(unverified as of <date>)` markers and need a
future primary-source pass:

- [checklists/connectors-and-premium.md](checklists/connectors-and-premium.md)
- [docs/connectors-guide.md](docs/connectors-guide.md)
- [docs/copilot-studio-guide.md](docs/copilot-studio-guide.md)
- [docs/dataverse-guide.md](docs/dataverse-guide.md)
- [docs/governance-and-coe.md](docs/governance-and-coe.md)
- [docs/power-apps-guide.md](docs/power-apps-guide.md)
- [docs/power-automate-guide.md](docs/power-automate-guide.md)
- [docs/power-platform-tool-catalogue.md](docs/power-platform-tool-catalogue.md)
- [services/01-power-apps-pro-dev.md](services/01-power-apps-pro-dev.md)
- [services/07-alm-devops.md](services/07-alm-devops.md)
- [services/08-governance-security.md](services/08-governance-security.md)
- [services/09-migration-upgrade.md](services/09-migration-upgrade.md)
- [services/13-integration-platform.md](services/13-integration-platform.md)

Hedges are intentional honesty flags, not errors. They keep the toolkit from
presenting unchecked claims as fact.

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

All 57 tests pass.

## Build gate results

The full `npm run verify` gate was run after the parallel workflow completed:

| Gate | Result |
|------|--------|
| `npm run typecheck` | 0 errors |
| `npm run lint` | 0 errors |
| `npm run build` | CLI compiled to `packages/cli/dist/` |
| `npm run test` | 57 / 57 passed |
| `npm run validate` | Structure check passed; docs validation passed |

## Known limitations / next pass

1. **Pac command registration.** The `pac.ts` wrapper is built but not yet
   registered as top-level CLI commands. Next iteration: add `solution`, `env`,
   and `--solution` validation flags.
2. **Remaining hedges.** 13 docs still carry explicit unverified markers. These
   should be checked against Microsoft Learn in the next quarterly sweep.
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
