---
title: "Service 09 — Migration & Upgrade"
description: "Legacy system migration to Power Platform: migration plan, data mapping, and cutover runbook delivered with low downtime and verified data integrity."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/troubleshoot/sharepoint/lists-and-libraries/items-exceeds-list-view-threshold
  - https://learn.microsoft.com/en-us/microsoft-365/community/large-lists-large-libraries-in-sharepoint
  - https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-entity-licenses
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/add-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
  - https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
  - https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/data
related:
  - "../playbooks/sharepoint-to-dataverse-migration.md"
  - "../checklists/scope-validation.md"
  - "../agents/solution-architect.md"
  - "../agents/dataverse-agent.md"
  - "../docs/integration-patterns.md"
  - "../power-platform/dataverse-patterns.md"
  - "../templates/prd-template.md"
---

# Service 09 — Migration & Upgrade

Move legacy systems — SharePoint lists, Access databases, spreadsheets, classic workflows, or end-of-life line-of-business apps — onto Power Platform with a planned migration, a verified data mapping, and a rehearsed cutover that protects business continuity.

## Business Problem & Outcome

Legacy systems accumulate hidden risk: unsupported platforms, brittle integrations, no audit trail, list-size and view-threshold limits, and key-person dependency on undocumented logic. Replacing them ad hoc usually fails on the data, not the build — bad mappings, duplicate keys, lost relationships, and a cutover nobody rehearsed.

This service de-risks the move by treating data and cutover as first-class deliverables.

Measurable outcomes:

- **Data integrity verified** — row counts, key uniqueness, relationship integrity, and reconciliation reports reconcile source-to-target before go-live (target: 100% of in-scope records accounted for, reconciled or explicitly quarantined).
- **Low / planned downtime** — cutover window agreed and rehearsed; rollback path tested. Typical target: cutover inside a single agreed maintenance window.
- **Eliminated platform risk** — retire unsupported / end-of-life systems and consolidate onto a governed Power Platform environment.
- **Documented logic** — undocumented legacy business rules captured as Dataverse business rules, flows, or solution components.
- **Auditable trail** — migration log, reconciliation evidence, and a signed cutover decision record.

## Ideal Client Profile

Who buys this:

- Organisations on **SharePoint lists hitting the 5,000-item list view threshold** ([SharePoint Online enforces a 5,000-item view threshold that cannot be raised; mitigate with column indexing and filtered views](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/lists-and-libraries/items-exceeds-list-view-threshold)), approaching the [~30-million-item list/library ceiling](https://learn.microsoft.com/en-us/microsoft-365/community/large-lists-large-libraries-in-sharepoint), or needing relational integrity SharePoint cannot provide.
- Teams running **Access / Excel "shadow IT"** apps that have outgrown the desktop and need governed, multi-user, web-based replacements.
- Clients on **end-of-life or unsupported platforms** (classic SharePoint workflows being retired, InfoPath, legacy on-prem LOB apps).
- Existing Power Platform tenants doing an **upgrade / consolidation** — merging environments, modernising canvas to model-driven, or moving from a Default-environment sprawl to a governed ALM landscape.

Triggers / signals:

- "Our list is too slow / we get the 5,000-item error."
- "The person who built the Access database left."
- Vendor end-of-support notice for the current platform.
- Audit or compliance finding against an ungoverned data store.
- M&A or reorg requiring data consolidation across environments.

## Scope & Deliverables

Concrete artifacts produced by this engagement:

- **Migration Plan** — source inventory, target architecture, migration strategy (big-bang vs phased vs parallel-run), sequencing, and timeline. Built from the [PRD template](../templates/prd-template.md) and detailed in the [Solution Design template](../templates/solution-design-template.md).
- **Data Mapping Specification** — field-by-field source-to-target map: data types, transformations, lookups/relationship resolution, choice/option-set mapping, default values, and handling for nulls, duplicates, and orphaned references.
- **Cutover Runbook** — minute-by-minute go-live sequence: freeze window, final delta load, validation gates, switchover, smoke tests, comms, and rollback triggers. Based on the [support runbook template](../templates/support-runbook-template.md).
- **Reconciliation & Validation Report** — pre/post row counts, key-uniqueness checks, relationship-integrity checks, sample record comparison, and a quarantine list for records that fail validation.
- **Target Dataverse schema** — tables, columns, relationships, keys, and security model, following [Dataverse patterns](../power-platform/dataverse-patterns.md).
- **Migration tooling assets** — configuration packages / scripts (Dataverse data import, Power Query / dataflows, or `pac` CLI data export-import), parameterised per environment.
- **Rollback plan** — documented and rehearsed path to restore the legacy system or revert the load.
- **Decommissioning checklist** — steps and sign-off to retire the legacy system after a stabilisation period.

## Out of Scope

Clear boundaries — these are separate engagements or change requests:

- New feature development beyond like-for-like replacement of legacy capability (net-new functionality is a build engagement; see Service 01 / Service 03).
- Long-term application support and SLAs (see Service 11 — Managed Support).
- Source-system remediation: fixing data quality *inside* the legacy system before extract is a discrete data-cleansing workstream, scoped separately if required.
- Integration build for downstream systems not part of the agreed migration footprint (see Service 13 — Integration Platform).
- Power BI report rebuilds on the new data model (handoff only; see Service 06).
- Tenant-wide governance / CoE rollout (see Service 08 — Governance & Security).
- Historical data older than the agreed retention boundary, unless explicitly included.

## Engagement Model & Effort

Phased delivery with a verified data gate before any cutover:

1. **Assess & Inventory** — catalogue sources, data volumes, relationships, and undocumented logic; confirm scope. Gate: [scope validation](../checklists/scope-validation.md).
2. **Design & Map** — target schema, data mapping spec, migration strategy, and rollback design.
3. **Build & Trial-Migrate** — build target schema and migration assets; run repeatable trial loads into a non-production environment.
4. **Reconcile & Validate** — run reconciliation reports; resolve or quarantine failures until the data gate passes.
5. **Cutover & Stabilise** — execute the rehearsed runbook in the agreed window; hypercare; decommission sign-off.

Indicative T-shirt sizing (calendar effort varies with data volume and source complexity):

| Size | Profile | Indicative effort |
|------|---------|-------------------|
| **S** | Single SharePoint list / spreadsheet, simple mapping, < ~10k rows, no complex relationships | ~5–10 delivery days |
| **M** | Several related lists or one moderate LOB source, lookup resolution, ~10k–250k rows, one rehearsed cutover | ~15–30 delivery days |
| **L** | Multi-source consolidation, complex relationship/duplicate handling, large volumes, phased or parallel-run cutover, environment consolidation | ~40–80+ delivery days |

(Day ranges are indicative planning bands only — confirm against agreed statement of work.)

Team roles (link to agent briefs):

- [Solution Architect](../agents/solution-architect.md) — migration strategy, target architecture, cutover and rollback design.
- [Dataverse Agent](../agents/dataverse-agent.md) — target schema, keys/relationships, data mapping and load.
- [Connector & Integration Agent](../agents/connector-integration-agent.md) — extract from source systems and any interim integration.
- [ALM & Deployment Agent](../agents/alm-deployment-agent.md) — solution packaging and environment promotion of schema/components.
- [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md) — license and Dataverse capacity verification before build.
- [QA & Test Agent](../agents/qa-test-agent.md) — reconciliation validation and post-cutover smoke testing.

## Indicative Pricing

Planning ranges only — **indicative; confirm current rates** at proposal time. Not a quote and not a client commitment.

- **Day-rate band:** senior Power Platform consulting typically falls in an indicative band of roughly **AUD 1,200–2,200 / day** depending on seniority and role mix. (Commercial rate card — not a Microsoft-published figure; unverified as of 2026-06-19 — confirm against current commercial rate card.)
- **Indicative engagement totals** (derive from T-shirt size × blended day rate):
  - S: low single-digit-thousands to ~AUD 15k.
  - M: ~AUD 25k–60k.
  - L: AUD 80k+ (often phased with milestone billing).
- **Commercial model:** prefer **fixed-price** for S and well-bounded M engagements where scope and data are known; use **T&M (capped)** where source data quality, volumes, or undocumented logic are uncertain. Migrations carry data-discovery risk — recommend a small paid Assess phase before committing to a fixed price for the full migration.
- Excludes Microsoft licensing, Dataverse capacity, and any third-party migration tooling — see below.

## Licensing & Capacity Considerations

Verify all of the following with the client and against current Microsoft documentation **before build**. Run the [licensing & capacity checklist](../checklists/licensing-and-capacity.md) and [connectors & premium checklist](../checklists/connectors-and-premium.md).

- **Dataverse premium entitlement** — building model-driven apps and creating/using standard Dataverse tables on the target requires a **Power Apps Premium** (per-user) or qualifying Dynamics 365 license, or a **Power Apps Per App** plan scoped to the app/environment. Creating and using custom tables in a standard (non-default, non-Teams) Dataverse environment is a premium feature ([License requirements for tables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-entity-licenses); [Power Apps Per App plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp)). SharePoint-only solutions may have run on Microsoft 365 seeded entitlements; migrating *into* Dataverse changes the licensing footprint and adds premium cost.
- **Dataverse capacity (storage)** — Dataverse uses a capacity-based model with three separately tracked storage types: **Database**, **File**, and **Log** ([Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage)). Migrated rows, attachments, and audit data consume these respectively. Large migrations can exceed the per-tenant default/seeded allocation; estimate target storage from source row counts and attachment volumes, and budget for capacity add-ons (purchasable in 1-GB increments as Database/File/Log add-ons) if required ([Add more Dataverse capacity](https://learn.microsoft.com/en-us/power-platform/admin/add-storage)). Use `estimate-licensing` to produce an indicative cost sheet (treat its figures as planning estimates only).
- **Premium connectors** — extracting from legacy SQL, on-prem sources (via the on-premises data gateway), or third-party systems typically requires **premium connectors**, which require a standalone (premium) Power Apps or Power Automate license; Microsoft 365 seeded licenses do not cover premium/on-prem/custom connectors, and the on-premises data gateway is itself a premium capability ([Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq)). Confirm before designing the extract path.
- **API request limits / service protection** — bulk migration loads are subject to two distinct controls: short-window **service-protection API limits** (evaluated per user; exceeding them returns HTTP 429 / `TooManyRequests`) ([Service protection API limits](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits)) and per-license **daily (24-hour) API request entitlements** that vary by license type and stack across multiple paid licenses ([Requests limits and allocations](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations)). High-volume loads may need throttling, batching, or staged windows. Confirm the specific per-license daily figures against the Requests limits and allocations page at proposal time, as Microsoft updates these tables.
- **AI Builder capacity** — if the migration includes document/data extraction via AI Builder (e.g., OCR of legacy attachments), this consumes **AI Builder credits**. Note the model has shifted: **new customers can no longer buy the AI Builder capacity add-on and must purchase Copilot Credits instead**; existing customers may renew/true-up AI Builder add-ons only up to **1 November 2026**, and seeded AI Builder credits in premium licenses are removed on that date ([Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management)). Budget AI features as Copilot Credits for any new engagement.
- **Copilot Studio / Copilot Credits** — out of scope for pure migration; flag only if a conversational front-end is added. As of **1 September 2025** the billing currency moved from "messages" to **Copilot Credits**, obtained via prepaid **capacity packs** (each Copilot Studio capacity pack = 25,000 Copilot Credits/month, tenant-wide) or **pay-as-you-go** Azure meters ([Copilot Studio billing rates and management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).
- **Environment & ALM** — production migrations should target a dedicated, governed environment (not the Default environment). Confirm available environments and the **Managed Environments** premium requirement: when an environment is managed, every active user (makers and consumers, not just admins) must hold a qualifying premium license such as Power Apps Premium, Power Automate Premium, or an equivalent Dynamics 365 license ([Managed Environments licensing](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing)).

> Estimate command: `node packages/cli/dist/index.js estimate-licensing --currency aud` (or `pp-agency estimate-licensing` after `npm link`). Treat all output as indicative planning figures requiring verification.

## Delivery Approach

Follow the [SharePoint-to-Dataverse migration playbook](../playbooks/sharepoint-to-dataverse-migration.md) as the primary delivery workflow. Key steps:

1. **Assess sources** — inventory lists/tables, volumes, relationships, and the decision matrix for stay-vs-migrate (per the playbook's decision matrix).
2. **Design target schema** — model tables, alternate keys, and relationships using [Dataverse patterns](../power-platform/dataverse-patterns.md); resolve SharePoint lookups to Dataverse relationships.
3. **Author the data mapping** — field-level mapping with transformation rules; identify and plan duplicate, null, and orphan handling.
4. **Trial-migrate** — repeatable loads into a non-production environment; iterate the mapping until reconciliation passes.
5. **Reconcile** — produce row-count, key-uniqueness, and relationship-integrity reports; quarantine and triage failures.
6. **Rehearse cutover** — dry-run the runbook end to end including rollback before the live window.
7. **Cut over & stabilise** — execute in the agreed window, smoke-test, hypercare, then decommission.

For source extract and any interim sync, apply the relevant [integration patterns](../docs/integration-patterns.md) (batch export, gateway-backed pulls, or staged dataflows). Generate the migration PRD with `generate-prd` and the target schema design with `generate-solution-design`.

## Quality Gates

Each gate must pass (or be explicitly waived with documented justification) before advancing:

- [Scope validation checklist](../checklists/scope-validation.md) — sources, volumes, and boundaries confirmed before design.
- [Project intake checklist](../checklists/project-intake.md) — engagement prerequisites captured.
- [Dataverse security checklist](../checklists/dataverse-security.md) — target security model verified before load.
- [Licensing & capacity checklist](../checklists/licensing-and-capacity.md) and [connectors & premium checklist](../checklists/connectors-and-premium.md) — entitlements and capacity confirmed before build.
- [QA checklist](../checklists/qa.md) — reconciliation evidence and post-cutover smoke tests pass.
- [Deployment checklist](../checklists/deployment.md) — cutover readiness and rollback validated.

Validate the project directory with `node packages/cli/dist/index.js validate -p <project-path>` before sign-off.

## Related Agents, Docs & Patterns

- **Agents:** [Solution Architect](../agents/solution-architect.md), [Dataverse Agent](../agents/dataverse-agent.md), [Connector & Integration Agent](../agents/connector-integration-agent.md), [ALM & Deployment Agent](../agents/alm-deployment-agent.md), [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md), [QA & Test Agent](../agents/qa-test-agent.md).
- **Docs:** [Integration Patterns](../docs/integration-patterns.md), [Dataverse Guide](../docs/dataverse-guide.md), [Licensing & Capacity](../docs/licensing-and-capacity.md), [ALM & Solutions](../docs/alm-and-solutions.md).
- **Power Platform patterns:** [Dataverse Patterns](../power-platform/dataverse-patterns.md), [Solution Patterns](../power-platform/solution-patterns.md), [Environment Strategy](../power-platform/environment-strategy.md), [pac CLI Cheatsheet](../power-platform/pac-cli-cheatsheet.md).
- **Templates:** [PRD Template](../templates/prd-template.md), [Solution Design Template](../templates/solution-design-template.md), [Support Runbook Template](../templates/support-runbook-template.md), [Risk Register Template](../templates/risk-register-template.md).

## Risks & Assumptions

**Risks:**

- **Source data quality** — the single biggest schedule risk. Duplicates, nulls, inconsistent keys, and orphaned references inflate mapping and reconciliation effort. Mitigation: paid Assess phase and trial loads before committing to a fixed price.
- **Hidden / undocumented logic** — legacy business rules buried in macros, calculated columns, or classic workflows. Mitigation: discovery interviews and source inspection during Assess.
- **Volume / capacity / API limits** — large loads can exceed Dataverse capacity or hit service-protection limits, extending the cutover window. Mitigation: capacity estimate up front; batched, throttled loads.
- **Licensing change** — moving into Dataverse may introduce premium licensing costs the client did not previously incur. Mitigation: verify entitlements before build and surface cost in the proposal.
- **Cutover failure** — a load failing in the live window. Mitigation: rehearsed runbook, tested rollback, and a defined go/no-go decision point.

**Assumptions:**

- The client provides timely, complete access to source systems and a non-production target environment for trials.
- A retention boundary for historical data is agreed during Assess.
- Required Microsoft licenses and Dataverse capacity will be procured before build, per verified estimates.
- Source-system data cleansing, if needed, is a separate workstream unless explicitly included.
- A stabilisation/hypercare window precedes legacy decommissioning sign-off.

> All Microsoft platform facts above marked "(Needs verification ...)" must be checked against current Microsoft documentation at proposal time. Pricing figures are indicative planning ranges, not quotes.
