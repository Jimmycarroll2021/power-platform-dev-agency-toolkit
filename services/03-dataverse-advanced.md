---
title: "Service 03 — Dataverse Advanced"
description: "Complex Dataverse data modeling, relationships, business rules, plug-ins, and classic workflows engineered for scale, integrity, and maintainability."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-entity-licenses
  - https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-restricted-entities
  - https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
  - https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits
  - https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing
  - https://learn.microsoft.com/en-us/power-platform/admin/environments-overview
  - https://learn.microsoft.com/en-us/troubleshoot/sharepoint/lists-and-libraries/items-exceeds-list-view-threshold
related:
  - ../playbooks/dataverse-solution.md
  - ../checklists/dataverse-security.md
  - ../agents/dataverse-agent.md
  - ../docs/dataverse-guide.md
  - ../power-platform/dataverse-patterns.md
---

# Service 03 — Dataverse Advanced

Turn a tangle of spreadsheets, SharePoint lists, and accidental data into a governed, relational Dataverse model with enforced business logic, server-side extensibility, and a security model that holds up under audit.

## Business Problem & Outcome

Teams that outgrow flat lists hit the same walls: duplicated records, no referential integrity, validation that lives only in one app's UI, and "logic" copied across five flows that drift apart. As soon as a second app or an integration touches the data, inconsistency becomes incident.

This service delivers a Dataverse layer where the rules live with the data, not the UI — so every Canvas app, Model-Driven app, flow, and API call sees the same enforced model.

Measurable outcomes we target:

- **Single source of truth** — one normalized model replacing N disconnected lists/sheets; duplicate rate driven toward zero via alternate keys and duplicate-detection rules.
- **Logic enforced server-side** — validation and calculations defined once (business rules / calculated / rollup columns / plug-ins) instead of per-app, removing UI-bypass data corruption.
- **Faster, safer change** — schema and logic shipped as managed solution components through ALM, so changes are reviewable, testable, and reversible.
- **Performant at scale** — relationship and indexing design that keeps key views and queries responsive as row counts grow (target: defined high-traffic views return within an agreed SLA on representative data volumes).
- **Audit-ready** — auditing, security roles, and column-level security configured to match the data-sensitivity policy.

## Ideal Client Profile

Buyers who get the most value:

- Organizations standardizing on the Power Platform / Dynamics 365 ecosystem and needing a serious data backbone, not just a form-over-list app.
- Teams whose Canvas or Model-Driven app already exists but is "slow / buggy / inconsistent" because the underlying data model was never designed.
- Projects with **multiple consumers** of the same data (apps + flows + Power BI + external integration) where logic must be centralized.

Triggers and signals to listen for:

- "We have the same customer/account in three places."
- "The app validates it but the flow / import doesn't."
- "Our SharePoint list hit the 5,000-item view threshold / delegation limits." (The SharePoint Online list view threshold is 5,000 items and can't be changed in SharePoint Online; lists can still *store* up to 30 million items — the limit is on rows scanned per view query, mitigated via indexed columns/filtered views — see [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/lists-and-libraries/items-exceeds-list-view-threshold).)
- Compliance or audit requirement for who-changed-what tracking.
- A planned integration (ERP, finance, identity) that needs a clean, keyed model to map to.
- Performance complaints on views/searches as data grew.

## Scope & Deliverables

Concrete artifacts produced:

- **Logical & physical data model** — entity relationship diagram, table inventory, column dictionary (data types, formats, required level, max length), and naming/prefix standard.
- **Relationships** — 1:N, N:N (native and manual-junction where reporting needs it), hierarchical/self-referential, cascade behavior matrix (assign / share / delete / reparent).
- **Keys & integrity** — primary name column strategy, **alternate keys** for upsert and dedupe, duplicate-detection rules.
- **Server-side logic**:
  - **Business rules** (validation, conditional visibility/requirement, simple set-value).
  - **Calculated and rollup columns** with recalculation-behavior notes.
  - **Plug-ins** (C#) for logic beyond declarative reach — registered on appropriate messages/stages, with proper transaction and error handling.
  - **Classic Dataverse workflows** where real-time/synchronous or background server logic is the right fit. (Note: Power Automate cloud flows are usually preferred for new automation — we recommend the right tool per case; see Out of Scope and Service 04.)
- **Security model** — security roles, business units / teams, ownership model (user vs team), field/column-level security profiles, hierarchical security if applicable.
- **Performance design** — indexing recommendations, view/query design, relationship-load considerations.
- **Solution packaging** — all components delivered in a **managed** solution with publisher prefix, environment variables, and connection references parameterized for ALM.
- **Documentation** — data dictionary, plug-in registration map, security role matrix, and a Solution Design Document.

## Out of Scope

- App UX build (Canvas / Model-Driven screen design) beyond what is needed to demonstrate the model — that is Service 01 / model-driven work.
- New automation orchestration / approvals as a primary deliverable — that is Service 04 (Power Automate Enterprise). We will build classic workflows / plug-ins where server-side logic belongs, but broad business-process automation is a separate engagement.
- Power BI report/dashboard build — handoff only (semantic model guidance, not report authoring).
- Data migration as a standalone program — light reference/seed data loads are included; large-volume ETL/migration is Service 09.
- Tenant-wide governance, DLP, and CoE rollout — that is Service 08; we will conform to existing policies.
- Custom PCF controls and pro-code UI components.

## Engagement Model & Effort

Phased delivery:

1. **Discover & model** — domain interviews, current-state data audit, draft ERD and column dictionary.
2. **Design & review** — finalize relationships, keys, security model; Solution Design Document sign-off.
3. **Build** — schema, declarative logic, plug-ins/workflows, security roles, packaging.
4. **Validate** — data-integrity tests, security-role testing, performance checks on representative volumes.
5. **Handover** — documentation, ALM pipeline integration, knowledge transfer.

T-shirt sizing (indicative day ranges — confirm against actual complexity):

| Size | Profile | Indicative effort |
|------|---------|-------------------|
| **S** | ~5–10 tables, mostly declarative logic, single business unit, no plug-ins | ~5–10 days |
| **M** | ~10–25 tables, N:N + hierarchy, 1–3 plug-ins, multi-role security, alternate keys | ~12–25 days |
| **L** | 25+ tables, complex security (column-level + hierarchical), multiple plug-ins, performance tuning, integration-ready keys | ~30–60+ days |

Team roles (link to the relevant agent briefs):

- **Solution architect** — model integrity, ALM fit, cross-service tradeoffs — see [../agents/solution-architect.md](../agents/solution-architect.md).
- **Dataverse specialist** — schema, relationships, keys, plug-ins, security — see [../agents/dataverse-agent.md](../agents/dataverse-agent.md).
- **Security & governance** — role design, column-level security, audit — see [../agents/security-governance-agent.md](../agents/security-governance-agent.md).
- **ALM/deployment** — solution packaging and pipeline — see [../agents/alm-deployment-agent.md](../agents/alm-deployment-agent.md).
- **QA/test** — integrity and security-role test design — see [../agents/qa-test-agent.md](../agents/qa-test-agent.md).
- **Licensing & capacity** — Dataverse capacity and license sizing — see [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md).

## Indicative Pricing

> Planning ranges only — **indicative, confirm current rates** before quoting. These are not commitments to any client.

- **Day-rate band:** specialist Dataverse / Power Platform engineering typically sits in a senior-consultant band; apply your agency's current published day rate. (Indicative — confirm current rates.)
- **Fixed-price vs T&M:**
  - **S** engagements suit **fixed-price** once scope is locked at design sign-off.
  - **M** suits **fixed-price per phase** (design fixed, build fixed against the signed model).
  - **L** suits **T&M or capped T&M** because plug-in complexity, performance tuning, and integration coupling are discovered during build.
- Estimate the licensing/capacity line separately using `pp-agency estimate-licensing` and the licensing-estimate template; never fold platform licensing into the day-rate quote.

## Licensing & Capacity Considerations

Dataverse usage drives Microsoft cost and access requirements that sit **on top of** professional-services fees. Confirm every figure below against current Microsoft licensing docs — these change.

- **Premium licensing required.** Custom Dataverse tables and apps built directly on Dataverse are **premium** — every interactive user generally needs a qualifying license (Power Apps Premium per-user, Power Apps per-app, or an entitling Dynamics 365 license). Standard Microsoft 365 licenses (E3/E5) include only standard connectors and do **not** grant rights to build/use custom apps on Dataverse. Confirmed against [License requirements for tables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-entity-licenses). Note the *read-only* nuance and the *restricted-table* rule: a small set of Dynamics 365-tied tables require a matching Dynamics 365 app license to create/update/delete rows, but read-only access needs only a Power Apps/Power Automate license — see [Restricted tables requiring Dynamics 365 licenses](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-restricted-entities). Per-app plans are allocated to environments in the Power Platform admin center, not assigned per user in the M365 admin center — see [About Power Apps per app plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp). In-product license enforcement began April 1, 2025.
- **Dataverse database capacity.** Tables consume **Database** capacity; logs/audit data (audit logs and plug-in trace logs) consume **Log** capacity; files/images consume **File** capacity. Each is metered as a tenant-wide entitlement and billable beyond the default allowance (additional capacity is purchased in 1-GB increments per type). High auditing and large file columns can consume capacity fast. The default environment includes 3 GB Database, 3 GB File, and 1 GB Log capacity; a banner warns at <15% remaining and Microsoft may suspend the service on sustained overage. Confirmed against [Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage).
- **API request limits / service protection.** Two distinct limits apply and are evaluated separately. (1) **Entitlement limits** — each licensed user is entitled to a daily request allowance based on their license (e.g. a Power Apps per-user license and a Dynamics 365 Customer Service Enterprise base license each carry 40,000 requests/24h, and multiple paid licenses sum); extra capacity is sold as a 10,000-request/24h add-on. See [Requests limits and allocations](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations). (2) **Service-protection limits** — per-server throttling (concurrent connections, requests per connection, execution time over a 5-minute sliding window) that returns HTTP 429; heavy/bulk clients must implement retry-with-backoff. See [Service protection API limits](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits). Heavy synchronous plug-ins can throttle — size request volume against both.
- **Premium connectors.** Any flow/app pattern that calls premium connectors (SQL Server, HTTP, custom connectors, etc.) requires premium licensing on the relevant principal/user — M365 E3/E5 includes only standard connectors, and all custom/certified connectors are released as Premium. Confirmed against the [List of all Premium tier connectors](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors) and the [custom connector FAQ](https://learn.microsoft.com/en-us/connectors/custom-connectors/faq). (Exception: a cloud flow that is *in-context* and associated with the app from which a seeded license is inherited can use premium/custom connectors; an isolated flow needs a standalone Power Automate Premium license.)
- **AI Builder credits / Copilot Credits.** If the model feeds AI Builder (e.g., prediction on Dataverse rows), that consumes capacity bought as a separate add-on — AI Builder is a premium feature and an AI Builder action makes an app a premium app. **The purchasing model is changing:** new customers can no longer buy the AI Builder credit add-on and must purchase **Copilot Credits**; existing customers can renew the AI Builder add-on only up to **November 1, 2026**, and the seeded AI Builder credits bundled in premium licenses (e.g. Power Apps Premium = 500, Power Automate Premium = 5,000) are also removed on that date. Capacity is enforced monthly and does not roll over. Confirmed against [Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management).
- **Copilot Studio Copilot Credits (formerly "messages").** If a Copilot Studio agent reads/writes this Dataverse model, it consumes Copilot Studio capacity, billed separately via prepaid packs, a prepurchase plan, or pay-as-you-go (Azure-metered). **Terminology change:** as of **September 1, 2025** the common currency for agents changed from *messages* to **Copilot Credits** (no change to per-pack quantity or the PAYG rate). Capacity is enforced monthly and unused credits don't carry over. Confirmed against [Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing).
- **Environment strategy affects cost.** Separate Dev/Test/Prod environments each carry capacity implications; sandbox vs production environment types differ (only **sandbox** environments can be reset/reprovisioned, and a sandbox can be converted to production when work goes live; both need at least 1 GB of Dataverse database capacity). Confirmed against the [Power Platform environments overview](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview). Plan environment topology before building (see governance/ALM services).

Run an explicit estimate and review it with the client before commitment:

```bash
node packages/cli/dist/index.js estimate-licensing --output ./licensing/dataverse-advanced.md --currency usd
# or, after `cd packages/cli && npm link`:
pp-agency estimate-licensing -o ./licensing/dataverse-advanced.md -c gbp
```

## Delivery Approach

Follow the Dataverse solution playbook end to end — it covers solution setup, schema build, logic, security, and packaging steps in order: see [../playbooks/dataverse-solution.md](../playbooks/dataverse-solution.md).

Reference the canonical modeling and extensibility patterns while building (relationship choices, keys, plug-in stages, rollup behavior, column-level security): see [../power-platform/dataverse-patterns.md](../power-platform/dataverse-patterns.md).

Recommended build order:

1. Create the **managed-bound** solution with a publisher prefix; parameterize environment variables and connection references first.
2. Build tables, columns, and the **column dictionary** in lockstep — document as you go.
3. Add relationships and set cascade behavior deliberately (never accept defaults blindly).
4. Add declarative logic first (business rules, calculated/rollup), then plug-ins/workflows only where declarative falls short.
5. Configure security roles, teams/business units, and column-level security; test with a non-admin test user.
6. Add alternate keys and duplicate-detection rules.
7. Export as **managed** for downstream environments via the ALM pipeline.

Generate the supporting design artifact with the CLI:

```bash
node packages/cli/dist/index.js generate-solution-design
node packages/cli/dist/index.js agent-brief --agent data-modeler --project ./
```

## Quality Gates

Do not sign off without passing the relevant checklists:

- **Dataverse security** — roles, ownership, column-level security, audit, and least-privilege verification: see [../checklists/dataverse-security.md](../checklists/dataverse-security.md).
- **General QA** — functional and integrity testing: see [../checklists/qa.md](../checklists/qa.md).
- **Scope validation** — confirm the built model matches the signed design: see [../checklists/scope-validation.md](../checklists/scope-validation.md).
- **Licensing & capacity** — confirm capacity headroom and license coverage before go-live: see [../checklists/licensing-and-capacity.md](../checklists/licensing-and-capacity.md).
- **ALM solution readiness** — managed packaging and pipeline checks: see [../checklists/alm-solution-readiness.md](../checklists/alm-solution-readiness.md).

Validate the project directory before handover:

```bash
node packages/cli/dist/index.js validate --project ./
```

## Related Agents, Docs & Patterns

**Agents**
- [../agents/dataverse-agent.md](../agents/dataverse-agent.md) — primary build specialist.
- [../agents/solution-architect.md](../agents/solution-architect.md) — model and ALM oversight.
- [../agents/security-governance-agent.md](../agents/security-governance-agent.md) — security/role design.
- [../agents/alm-deployment-agent.md](../agents/alm-deployment-agent.md) — solution packaging/pipeline.
- [../agents/qa-test-agent.md](../agents/qa-test-agent.md) — test design.
- [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md) — capacity/license sizing.

**Docs**
- [../docs/dataverse-guide.md](../docs/dataverse-guide.md) — Dataverse fundamentals and conventions.
- [../docs/security-and-privacy.md](../docs/security-and-privacy.md) — security and privacy posture.
- [../docs/alm-and-solutions.md](../docs/alm-and-solutions.md) — solution/ALM practice.
- [../docs/licensing-and-capacity.md](../docs/licensing-and-capacity.md) — licensing and capacity reference.

**Patterns**
- [../power-platform/dataverse-patterns.md](../power-platform/dataverse-patterns.md) — modeling/extensibility patterns.
- [../power-platform/solution-patterns.md](../power-platform/solution-patterns.md) — solution structuring.
- [../power-platform/environment-variables.md](../power-platform/environment-variables.md) — environment-variable usage.
- [../power-platform/connection-references.md](../power-platform/connection-references.md) — connection-reference parameterization.

**Templates**
- [../templates/solution-design-template.md](../templates/solution-design-template.md) — SDD scaffold.
- [../templates/prd-template.md](../templates/prd-template.md) — requirements scaffold.
- [../templates/technical-design-template.md](../templates/technical-design-template.md) — technical design.
- [../templates/risk-register-template.md](../templates/risk-register-template.md) — risk tracking.

## Risks & Assumptions

**Assumptions**
- Client has (or will procure) a Dataverse-enabled environment with sufficient database/log/file capacity and the required premium licenses.
- Source data is accessible and a domain owner is available to validate the model and business rules.
- Separate Dev/Test/Prod environments exist or can be provisioned for ALM.
- Reference/seed data volume is modest; large migration is a separate engagement.

**Risks & mitigations**
- **Capacity overrun** — auditing, large file columns, and verbose logs consume capacity faster than expected. *Mitigation:* size capacity in the licensing estimate up front and review headroom at the licensing-and-capacity gate.
- **Plug-in performance / throttling** — heavy synchronous plug-ins can hit service-protection limits and slow the UI. *Mitigation:* prefer declarative logic; move heavy work to async stages; load-test on representative volumes.
- **Over-modeling** — gold-plated normalization that the app layer cannot use efficiently. *Mitigation:* model to actual query/reporting needs, validated against scope.
- **Security-model drift** — roles widened during build "to get it working." *Mitigation:* test as a non-admin user and pass the dataverse-security checklist before sign-off.
- **License gaps at go-live** — users blocked because premium licensing was assumed, not confirmed. In-product license enforcement is live (enforcement began April 1, 2025), so unlicensed users are actively blocked from premium apps/flows — see [License requirements for tables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-entity-licenses). *Mitigation:* verify license coverage against current Microsoft docs and the licensing checklist before deployment.
- **Tooling pivot** — classic workflows chosen where a cloud flow would be more maintainable, or vice versa. *Mitigation:* document the tool-choice rationale in the SDD and confirm with the architect.
