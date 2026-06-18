# Platform State & Documentation Freshness

> **Power Platform changes constantly.** Licensing, AI Builder credits, Copilot Studio
> message packs, capacity entitlements, and feature GA/preview status are revised by
> Microsoft on a rolling basis. This file is the single freshness anchor for the
> toolkit: every reference doc declares the date its facts were last verified against
> Microsoft Learn.

## How freshness works

Each verified document carries a frontmatter block:

```yaml
---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/...
---
```

- **`verified_as_of`** — the date a human or agent last checked the doc's factual
  claims against primary Microsoft sources.
- **`platform_state`** — the Power Platform release wave the facts reflect.
- **`sources`** — the Microsoft Learn pages used to verify.

Anything not yet verified is marked inline with
**`(unverified as of <date> — confirm against Microsoft Learn)`** so readers never
mistake an unchecked claim for a confirmed one.

## Current platform state

| Field | Value |
|-------|-------|
| Documentation baseline | 2026-H1 |
| Last repository-wide verification sweep | 2026-06-19 |
| Primary source of truth | [Microsoft Learn — Power Platform](https://learn.microsoft.com/power-platform/) |
| Licensing source of truth | [Licensing Guide][licensing] *(verify current edition)* |

[licensing]: https://learn.microsoft.com/power-platform/admin/pricing-billing-skus

## Verification backlog

The verification sweep prioritises accuracy-critical documents (licensing, capacity,
AI Builder, Copilot Studio, ALM, connectors, governance, and the commercial service
definitions). Documents still pending a primary-source check are tracked in
[`VERIFICATION-LOG.md`](../VERIFICATION-LOG.md) at the repository root.

## Re-verification cadence

- **Licensing / capacity / AI credits:** re-verify quarterly (these change most often).
- **Feature guides (apps, automate, Dataverse, pages):** re-verify each major release
  wave.
- **Patterns / process docs:** re-verify annually or when a referenced feature changes.

> When you update a doc's facts, bump its `verified_as_of` date and add the Microsoft
> Learn URL(s) you used to `sources`. Run `npm run docs:check` to confirm links still
> resolve.
