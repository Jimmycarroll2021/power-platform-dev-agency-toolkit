---
title: "Service 06 — Power BI Embedded Analytics"
description: "Reporting and dashboard integration: semantic models, paginated and interactive reports, and embedded analytics surfaced inside Power Apps, Power Pages, and external portals."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-bi/developer/embedded/embedded-capacity
  - https://learn.microsoft.com/en-us/power-bi/developer/embedded/embedded-analytics-power-bi
  - https://learn.microsoft.com/en-us/power-bi/guidance/powerbi-implementation-planning-usage-scenario-embed-for-your-customers
  - https://learn.microsoft.com/en-us/fabric/enterprise/licenses
  - https://learn.microsoft.com/en-us/power-bi/paginated-reports/paginated-reports-faq
  - https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web
  - https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction
  - https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-power-bi-tile
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-onprem
related:
  - ../docs/power-bi-handoff-guide.md
  - ../agents/solution-architect.md
  - ../playbooks/canvas-app.md
  - ../checklists/qa.md
  - ../power-platform/dataverse-patterns.md
---

# Service 06 — Power BI Embedded Analytics

Turn raw Dataverse and line-of-business data into governed, embedded reporting that lives where users already work — inside canvas apps, model-driven apps, Power Pages, and external web portals.

## Business Problem & Outcome

Most Power Platform solutions accumulate data faster than the business can read it. Operational users bounce between an app and a separate BI tool, leadership relies on stale spreadsheet exports, and "analytics" becomes a manual end-of-month chore. This service closes that gap by designing trustworthy semantic models and embedding the resulting reports directly into the apps and portals users already use.

Measurable outcomes we target:

- **Single pane of glass** — reports embedded in the operational app, eliminating context switching and duplicate data exports.
- **Reduced reporting toil** — replace recurring manual spreadsheet refreshes (often several hours/week) with scheduled, governed dataset refreshes.
- **Faster decisions** — near-real-time or scheduled dashboards replace month-old PDFs; row-level security ensures each user sees only their slice.
- **Trustworthy numbers** — one certified semantic model becomes the source of truth, ending "my number doesn't match yours" disputes.
- **Self-service within guardrails** — business users explore data through curated reports without direct database access.

## Ideal Client Profile

This service fits organisations that have **already shipped or are shipping a Power Platform solution** and now need to surface insight from it.

Buying triggers and signals:

- A Dataverse or SharePoint-backed app is live and users are asking "can we get a report on this?"
- Leadership is making decisions off manual Excel exports that are out of date.
- An existing Power BI estate exists but reports are siloed in the Power BI service and never reach front-line users.
- A new Power Pages or external portal needs customer/partner-facing dashboards.
- Compliance or audit requires consistent, governed reporting with clear data lineage and row-level access control.
- A merger, system migration, or new ERP/CRM rollout has fragmented reporting across tools.

Less suitable: organisations with no existing data platform foundation (start with Service 03 — Dataverse Advanced, or Service 12 — Discovery & Assessment), or pure enterprise data-warehouse / Fabric lakehouse builds that exceed Power Platform scope.

## Scope & Deliverables

Concrete artifacts produced by this engagement:

- **Semantic model (dataset)** — a tabular model with a documented star schema, well-named measures (DAX), calculation groups where appropriate, and a clear refresh strategy (Import, DirectQuery, or Composite — selected per requirement).
- **Interactive reports** — one or more multi-page Power BI reports with consistent theming, bookmarks/navigation, and drill-through.
- **Paginated reports** *(where pixel-perfect / print output is required)* — invoice-style or operational list outputs. Authoring and publishing a paginated report needs a Power BI Pro or PPU license; dedicated Premium/Fabric capacity is **not** mandatory to use them. Premium/Fabric capacity (F64+/P1+) only changes who can *view*: on such capacity free-licensed users can view, otherwise each viewer needs Pro/PPU ([paginated reports FAQ](https://learn.microsoft.com/en-us/power-bi/paginated-reports/paginated-reports-faq)). In an embedded ("App Owns Data") context, paginated reports must be backed by EM, P, or F capacity ([embed paginated reports](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-paginated-reports)).
- **Embedded configurations** — Power BI embedded into:
  - Canvas apps via the native Power BI component or tile.
  - Model-driven apps via embedded Power BI dashboards / charts.
  - Power Pages / external sites via secure embed (App Owns Data or Publish-to-web for non-sensitive public data only).
- **Row-Level Security (RLS) / Object-Level Security (OLS)** roles mapped to user identity (Dataverse business units, Entra groups, or portal contact records).
- **Refresh and gateway configuration** — scheduled refresh, on-premises data gateway setup if needed, and incremental refresh policy for large fact tables.
- **Workspace and deployment structure** — Dev/Test/Prod workspace separation aligned to ALM, with deployment pipeline configuration where capacity permits.
- **Handover pack** — measure dictionary, data lineage diagram, refresh runbook, RLS test matrix, and an admin guide (see ../docs/power-bi-handoff-guide.md).

## Out of Scope

- Building the underlying Dataverse data model or app (covered by Service 01 / Service 03).
- Enterprise data warehouse, Microsoft Fabric lakehouse, or large-scale data engineering pipelines.
- Source-system data quality remediation (we report on data as it exists; cleansing is a separate workstream).
- Ongoing report authoring as a managed service (see Service 11 — Managed Support).
- Procurement of Power BI / Fabric capacity or licences (advisory only — client purchases through their own tenant).
- Real-time streaming dashboards requiring custom streaming endpoints (scoped separately if required).

## Engagement Model & Effort

Phased delivery; team roles link to the relevant agent briefs.

**Phases**

1. **Discovery & requirements** — report inventory, KPI definitions, audience mapping, refresh/latency needs.
2. **Semantic model design** — schema, measures, RLS/OLS, refresh strategy.
3. **Report build** — interactive (and paginated where needed) reports with agreed theming.
4. **Embedding & security** — embed into app/portal, wire identity to RLS, configure gateway/refresh.
5. **QA, UAT & handover** — validation against quality gates, user acceptance, knowledge transfer.

**T-shirt sizing (indicative day ranges)**

| Size | Typical scope | Indicative effort |
|------|---------------|-------------------|
| **S** | One semantic model, 1–2 reports, embed into a single canvas/model-driven app, basic RLS | ~5–10 days |
| **M** | Multi-source model, 3–6 reports, paginated output, RLS by business unit, embed in app + portal | ~12–25 days |
| **L** | Multiple models, portal/external embed (App Owns Data), incremental refresh, deployment pipelines, certified dataset programme | ~30–55 days |

Ranges are planning aids, not commitments — confirm after discovery.

**Team roles**

- [Solution Architect](../agents/solution-architect.md) — semantic model architecture, embedding pattern, capacity/licensing fit.
- [Dataverse Agent](../agents/dataverse-agent.md) — source schema, security model alignment for RLS.
- [Power Apps Agent](../agents/power-apps-agent.md) — embedding into canvas / model-driven apps.
- [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md) — Premium/PPU/embedded capacity sizing.
- [QA / Test Agent](../agents/qa-test-agent.md) — report accuracy, RLS, and refresh validation.
- [Security & Governance Agent](../agents/security-governance-agent.md) — RLS/OLS, data exposure, tenant settings.

## Indicative Pricing

All figures are **indicative planning ranges only — confirm current rates**; they are not quotes or client commitments.

- **Day-rate band:** senior Power Platform / BI consultant typically in the region of a professional day-rate band (regional and seniority dependent). Mixed-team blended rates apply where architect + developer + QA are involved.
- **Fixed-price** is offered for well-bounded **S** and many **M** engagements once discovery has fixed the report list, data sources, and RLS rules.
- **Time & Materials (T&M)** is recommended for **L** engagements, evolving requirements, multi-source models, or external-portal embedding where data-source behaviour is uncertain.
- Use the `estimate-licensing` CLI command and ../templates/licensing-estimate-template.md to produce a per-engagement licensing line item; report-build effort is estimated separately from platform/capacity licence cost.

Indicative envelope (effort only, excludes licences/capacity): S ≈ 5–10 days, M ≈ 12–25 days, L ≈ 30–55 days at the agreed day-rate band.

## Licensing & Capacity Considerations

Power BI licensing is a frequent source of nasty surprises. Verify every point below against current Microsoft licensing documentation before committing — figures and entitlements change.

- **Pro vs Premium Per User (PPU) vs Premium/Fabric capacity** — Pro is a per-user licence that lets users create, publish, share, and consume content; sharing/collaboration generally requires the other party to also hold Pro (or PPU), unless the content lives in Premium/Fabric capacity. PPU includes all Pro capabilities plus features previously exclusive to Premium capacity. Confirmed against [Power BI service features by license type](https://learn.microsoft.com/en-us/power-bi/fundamentals/service-features-license-type) and the [PPU FAQ](https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-premium-per-user-faq).
- **Embedding into external portals (Power Pages / public web)** uses the **App Owns Data** ("embed for your customers") scenario, which **cannot** run in production on Fabric (free), Power BI Pro, or PPU licences — it requires a capacity: **Power BI Embedded (A-SKU)**, **Premium (P/EM-SKU)**, or **Microsoft Fabric (F-SKU)**. Budget for capacity as a recurring cost. Confirmed against [Embed for your customers usage scenario](https://learn.microsoft.com/en-us/power-bi/guidance/powerbi-implementation-planning-usage-scenario-embed-for-your-customers) and [Capacity and SKUs in Power BI embedded analytics](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embedded-capacity).
- **Microsoft Fabric capacity (F-SKUs)** is now the route for Premium-class features: P-SKUs are **no longer available for purchase** (renewal only), and buying an F-SKU also includes Power BI Embedded. Confirm the client's current capacity SKU and whether autoscale/pause is available to manage cost. Confirmed against [Understand Microsoft Fabric licenses](https://learn.microsoft.com/en-us/fabric/enterprise/licenses).
- **Publish-to-web** is *anonymous public exposure* — anyone on the internet can view the report with no authentication, **including the underlying detail-level data in the semantic model**, and it is not available for reports that rely on row-level security. Never use it for any sensitive, internal, or customer-identifiable data. Confirmed against [Publish to web from Power BI](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web).
- **Paginated reports** do **not** require Premium/PPU to author or use — a Pro (or PPU) licence is sufficient. Premium/Fabric capacity (F64+/P1+) only lets free-licensed users *view* them; in an embedded context they must be backed by EM/P/F capacity. Confirmed against the [paginated reports FAQ](https://learn.microsoft.com/en-us/power-bi/paginated-reports/paginated-reports-faq).
- **Power BI tiles/components inside Power Apps** require each viewing user to hold a Power BI Pro (or PPU) licence, **unless** the underlying content is hosted in Premium/Fabric capacity (F64+ allows free-licensed viewers); you must also separately share the source dashboard with app users. Confirmed against [Power BI tile control in Power Apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-power-bi-tile).
- **On-premises data gateway** is required to securely bridge on-prem (or VNet-isolated, via the virtual network data gateway) sources to Power BI for scheduled refresh and DirectQuery; size and host it for availability. Confirmed against [On-premises data gateway](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-onprem).
- **Dataverse capacity** — Dataverse storage is metered per tenant across database, file, and log capacity, accrued from a base org allowance plus per-user-licence entitlements, with weekly admin notifications and overage enforcement (e.g., environment creation blocked when in deficit). Large fact extracts and frequent refresh increase consumption, so check the client's Dataverse capacity allocation. Confirmed against [Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage).
- **Copilot in Power BI** requires paid Fabric capacity (F2+) or Power BI Premium capacity (P1+) with the tenant Copilot setting enabled — a Pro or PPU licence alone is **not** sufficient — and it consumes that Fabric capacity, so manage usage to avoid throttling. Confirmed against [Copilot for Power BI overview](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction) and [Enable Fabric Copilot for Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-enable-power-bi). AI Builder is a separate Power Platform capacity (credits/per-app billing) and is not bundled with Power BI — treat any AI Builder use as a distinct line item (unverified specifics as of 2026-06-19 — confirm against Microsoft Learn).
- **Premium connectors** used to source data into the model (e.g., SQL Server, non-standard SaaS connectors via dataflows) require a Power Apps/Power Automate **premium** entitlement; in an app/flow context **every** user interacting with the app must be licensed via a Power Apps per-user plan, per-app plan, pay-as-you-go, or a qualifying Dynamics 365 licence. Confirmed against [Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq).

See ../checklists/licensing-and-capacity.md and ../docs/licensing-and-capacity.md for the full verification routine, and engage the [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md).

## Delivery Approach

Embedding lands inside the host application, so delivery follows the host-app playbook plus the data layer:

- **Canvas-app embedding** — follow ../playbooks/canvas-app.md for the host app, then add the Power BI component, pass context/filters, and wire user identity to RLS.
- **Model-driven embedding** — follow ../playbooks/model-driven-app.md to place embedded dashboards/charts on forms and dashboards.
- **Portal / external embedding** — follow ../playbooks/power-pages-site.md for the host site, using App Owns Data with embedded/Premium capacity.
- **Data foundation** — align the semantic model to source schema using ../power-platform/dataverse-patterns.md (star-schema-friendly relationships, security alignment).
- **ALM** — manage workspaces and deployment pipelines per ../playbooks/alm-pipeline.md and ../power-platform/alm-devops-patterns.md.
- **Governance** — confirm tenant settings (embed, publish-to-web, export) against ../playbooks/governance-audit.md before go-live.

## Quality Gates

Validate before sign-off:

- ../checklists/qa.md — report accuracy vs source, visual/UX consistency, performance.
- ../checklists/scope-validation.md — every agreed report/KPI delivered, nothing scope-crept.
- ../checklists/licensing-and-capacity.md — capacity sized, licences confirmed, no Publish-to-web on sensitive data.
- ../checklists/dataverse-security.md — RLS/OLS roles map correctly to identity; tested per-persona.
- ../checklists/deployment.md — workspace promotion, gateway, and refresh schedules verified in Prod.
- ../checklists/support-handover.md — runbook, measure dictionary, and lineage handed over.

Run the CLI gate generators as needed: `checklist --type qa`, `checklist --type scope-validation`, `checklist --type deployment`, `checklist --type governance`.

## Related Agents, Docs & Patterns

**Agents**

- [Solution Architect](../agents/solution-architect.md)
- [Dataverse Agent](../agents/dataverse-agent.md)
- [Power Apps Agent](../agents/power-apps-agent.md)
- [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md)
- [Security & Governance Agent](../agents/security-governance-agent.md)
- [QA / Test Agent](../agents/qa-test-agent.md)

**Docs**

- [Power BI Handoff Guide](../docs/power-bi-handoff-guide.md) — primary delivery reference for this service.
- [Integration Patterns](../docs/integration-patterns.md)
- [Licensing & Capacity](../docs/licensing-and-capacity.md)
- [Power Apps Guide](../docs/power-apps-guide.md)
- [Governance & CoE](../docs/governance-and-coe.md)

**Patterns**

- [Dataverse Patterns](../power-platform/dataverse-patterns.md)
- [ALM / DevOps Patterns](../power-platform/alm-devops-patterns.md)
- [Monitoring & Telemetry](../power-platform/monitoring-and-telemetry.md)
- [Environment Strategy](../power-platform/environment-strategy.md)

**Templates**

- [Solution Design Template](../templates/solution-design-template.md)
- [PRD Template](../templates/prd-template.md)
- [Licensing Estimate Template](../templates/licensing-estimate-template.md)
- [Handover Document Template](../templates/handover-document-template.md)

## Risks & Assumptions

**Assumptions**

- A stable, query-able data source (Dataverse, SQL, SharePoint, or supported connector) already exists.
- The client holds, or will procure, the appropriate Power BI / Fabric licences and capacity before go-live.
- Source data is sufficiently clean to report on as-is; quality remediation is a separate workstream.
- User identity for RLS can be resolved from Entra groups, Dataverse business units, or portal contacts.

**Risks**

- **Licensing/capacity mismatch** — external ("App Owns Data") embedding requires A/EM/P/F capacity the client may not have budgeted for, and free-licensed viewers need F64+/P1+ capacity (otherwise per-user Pro/PPU). Mitigate via early licensing review. Confirmed against [Capacity and SKUs in Power BI embedded analytics](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embedded-capacity).
- **RLS gaps** — misconfigured roles can leak data across users/tenants. Mitigate with a per-persona RLS test matrix.
- **Performance** — DirectQuery over large/slow sources can produce sluggish reports; Import + incremental refresh is preferred where freshness allows.
- **Publish-to-web exposure** — accidental anonymous publication of sensitive data; mitigate by disabling the tenant setting and gating go-live on the governance checklist.
- **Platform change** — Power BI / Fabric SKUs and feature entitlements evolve; treat all licensing facts here as needing re-verification at engagement start.
- **Refresh fragility** — gateway outages or credential expiry break scheduled refresh; include monitoring and an owner in the handover runbook.
