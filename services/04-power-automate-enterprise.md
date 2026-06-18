---
title: "Service 04 — Power Automate Enterprise"
description: "Enterprise-grade cloud flow automation, custom connectors, and DLP-governed integration delivered to a production-ready, supportable standard."
category: service
related:
  - ../playbooks/power-automate-cloud-flow.md
  - ../playbooks/approval-workflows.md
  - ../playbooks/custom-connector.md
  - ../checklists/connectors-and-premium.md
  - ../checklists/dlp-and-governance.md
  - ../agents/power-automate-agent.md
  - ../docs/power-automate-guide.md
---

# Service 04 — Power Automate Enterprise

We design, build, and govern enterprise automation — cloud flows, approvals, and custom connectors — so that business processes run reliably, observably, and inside your DLP and licensing guardrails.

## Business Problem & Outcome

Most organisations arrive with the same pattern: dozens of personal flows scattered across maker accounts, brittle integrations held together by hard-coded credentials, and no way to know which flow touches which system. When a maker leaves, their flows orphan; when a connector hits a throttle limit, a process silently stalls; and when audit asks "what data leaves the tenant?", nobody can answer.

This service replaces that with managed, solution-aware automation:

- **Reliability** — flows built with retry policies, concurrency control, idempotency, and error handling instead of happy-path-only logic.
- **Observability** — run history, alerting on failure, and telemetry so failures are detected, not discovered weeks later.
- **Governance** — automation runs inside DLP policy boundaries with connection references and environment variables, not embedded secrets.
- **Supportability** — flows live in managed solutions with a documented owner, ALM pipeline, and runbook.

Measurable outcomes we target (baseline against the client's current state):

- Reduction in manual process handling time (often 40–70% for high-volume approval/data-entry processes — confirm against the specific process baseline).
- Mean time to detect (MTTD) flow failures cut from "days/never" to minutes via alerting.
- Elimination of hard-coded secrets and personal-account ownership across in-scope flows.
- A single inventory of in-scope automations with owner, trigger, and connector mapping.

## Ideal Client Profile

Buyers are typically IT/automation leads, COE owners, or process owners in mid-to-large organisations already on Microsoft 365 / Power Platform.

Triggers and signals that this service fits:

- A "flow sprawl" problem — hundreds of ungoverned personal flows and no inventory.
- A high-volume manual process (invoice routing, onboarding, approvals, data sync) that is a clear automation candidate.
- A need to integrate Power Platform with a line-of-business system that has no first-party connector (drives custom connector work).
- A failed or fragile automation that needs to be re-platformed to a supportable standard.
- A governance or audit driver: DLP policy rollout, secrets remediation, or a CoE establishing standards.
- An upcoming licensing decision — they are unsure whether premium connectors or per-flow/per-user plans are required.

## Scope & Deliverables

Concrete artifacts produced in a typical engagement:

- **Automation inventory & assessment** — catalogue of in-scope processes with trigger, connectors used (standard vs premium), data sensitivity, and owner.
- **Cloud flows** — production-grade automated, instant, and scheduled flows built in a managed solution, with:
  - Trigger conditions and concurrency/degree-of-parallelism settings.
  - Retry policies, `Scope`-based try/catch/finally error handling, and termination with meaningful status.
  - Idempotency and de-duplication where the trigger can fire repeatedly.
- **Approval workflows** — modern approval flows (sequential, parallel, custom responses) with reassignment, escalation/timeout, and audit trail.
- **Custom connectors** — for in-scope LOB or REST APIs without a first-party connector, including OpenAPI definition, authentication configuration, policy templates, and a connection reference.
- **Connection references & environment variables** — all connections and environment-specific config externalised for clean ALM promotion.
- **DLP policy recommendations** — connector classification (Business / Non-Business / Blocked) for in-scope connectors, with rationale.
- **Monitoring & alerting** — failure notifications and run-history review approach; optional Application Insights / telemetry hook-up.
- **ALM packaging** — flows delivered in a managed solution promotable across Dev → Test → Prod.
- **Handover artifacts** — runbook, owner assignment, and operational notes.

## Out of Scope

To keep boundaries clear, the following are explicitly NOT included unless added as a separate line item:

- Power Apps canvas/model-driven app build (see Service 01) — this service automates processes, it does not build the front-end app.
- Desktop / attended-unattended RPA (Power Automate Desktop) — that is a distinct capability with its own licensing and machine/gateway requirements.
- Net-new Dataverse data model design beyond tables directly required by in-scope flows (see Service 03).
- Building the upstream/downstream LOB system's API itself — we consume an existing API; we do not author the source system.
- Production hyper-care/managed support beyond the agreed handover window (see Service 11).
- Tenant-wide CoE establishment and full governance programme (see Service 08) — we apply governance to in-scope automation, not the whole estate.

## Engagement Model & Effort

Phases follow our standard delivery shape: **Discover → Design → Build → Test → Deploy → Handover.**

| Size | Indicative effort | Typical content |
|------|-------------------|-----------------|
| **S** | ~5–10 days | 1–3 flows, standard connectors only, one approval pattern, no custom connector. |
| **M** | ~10–25 days | Several flows, one approval workflow, one custom connector, DLP recommendations, ALM packaging. |
| **L** | ~25–50+ days | Process suite, multiple custom connectors, escalation logic, telemetry, full ALM pipeline, governance integration. |

Day ranges are planning estimates and depend on number of integration points, API complexity, and approval/data-quality readiness. (Effort confirmed after Discovery.)

Team roles (composition scales with size):

- **[Power Automate engineer](../agents/power-automate-agent.md)** — primary builder of flows, approvals, and error handling.
- **[Connector / integration specialist](../agents/connector-integration-agent.md)** — custom connector design, auth, and API integration patterns.
- **[Solution architect](../agents/solution-architect.md)** — end-to-end design, ALM strategy, and integration architecture (M/L).
- **[Licensing & capacity advisor](../agents/licensing-capacity-agent.md)** — premium connector / plan and capacity sizing.
- **[Security & governance advisor](../agents/security-governance-agent.md)** — DLP policy classification and secrets remediation.
- **[QA / test engineer](../agents/qa-test-agent.md)** — test plan, run validation, regression.

## Indicative Pricing

All figures are **indicative planning ranges only — confirm current rates** before quoting. They are not commitments.

- **Day-rate band:** mid-senior Power Platform consultant day rate applies. Use your standard regional consulting band; do not infer a specific figure from this document.
- **S engagement:** ~5–10 days of effort.
- **M engagement:** ~10–25 days of effort.
- **L engagement:** ~25–50+ days of effort.
- **Custom connector add-on:** budget incremental days per non-trivial API (auth complexity, pagination, throttling, and policy templates drive the number).

Commercial model:

- **Fixed-price** is appropriate where scope is well-bounded after Discovery (defined flow count, known connectors, stable API). Best for S and tightly-scoped M.
- **Time & materials** is appropriate where API behaviour, data quality, or approval rules are uncertain — common for L and multi-connector work. Use a not-to-exceed cap.
- Discovery itself is best run as a small fixed-price or capped T&M unit so scope can be priced with evidence.

Licensing and capacity costs are a separate, client-borne line — see below.

## Licensing & Capacity Considerations

Licensing is the single biggest source of surprise cost in automation projects. Flag these early and **verify against current Microsoft licensing documentation** — terms and limits change frequently.

- **Premium connectors.** Any flow that uses a premium connector (e.g. HTTP, custom connectors, SQL Server, Azure, most third-party LOB connectors) requires a premium Power Automate plan for the licensed entity. Standard M365 seeded use rights do not cover premium connectors. *(Needs verification against current Microsoft docs.)*
- **Per-user vs per-flow plans.** Power Automate licensing is generally per-user (with attended/unattended variants) or per-flow/per-process. Per-flow plans license a specific flow for unlimited users — economical for shared, high-throughput processes. Choose deliberately based on user count vs flow count. *(Needs verification against current Microsoft docs — plan names and entitlements change.)*
- **API request limits / throttling.** Power Platform enforces daily API request limits per user/flow and service-protection throttling on connectors. High-volume flows can exhaust limits or be throttled; design for batching and back-off. Exact request allowances are licence- and time-dependent. *(Needs verification against current Microsoft docs.)*
- **Custom connectors.** Calling a custom connector is itself a premium operation — licensing the flow/user accordingly is required even though you built the connector. *(Needs verification against current Microsoft docs.)*
- **AI Builder credits.** If a flow invokes AI Builder (e.g. document processing, prediction), it consumes AI Builder credits, which are a separate capacity purchase/allocation. Estimate volume × credit cost before committing. *(Needs verification against current Microsoft docs.)*
- **Copilot Studio messages.** If automation triggers or is triggered by a Copilot Studio agent, that consumes Copilot Studio message capacity — a distinct meter. *(Needs verification against current Microsoft docs.)*
- **Dataverse capacity.** Flows that read/write Dataverse contribute to database, file, and log capacity consumption; high-volume logging or large attachments can move the capacity needle. *(Needs verification against current Microsoft docs.)*

Run `node packages/cli/dist/index.js estimate-licensing` (or `pp-agency estimate-licensing` after linking) to produce a structured first-pass estimate, and treat its output as a planning artifact pending confirmation against live Microsoft pricing.

## Delivery Approach

Delivery follows the relevant playbooks step-by-step:

- **[Cloud flow build](../playbooks/power-automate-cloud-flow.md)** — trigger selection, error handling, concurrency, retry, and solution packaging for the core flows.
- **[Approval workflows](../playbooks/approval-workflows.md)** — designing sequential/parallel approvals, escalation, reassignment, and audit trail.
- **[Custom connector](../playbooks/custom-connector.md)** — OpenAPI definition, authentication, policy templates, and connection-reference wiring for LOB API integration.

These are executed inside the standard ALM and environment discipline already established for the platform, with environment variables and connection references externalised for promotion.

## Quality Gates

No automation ships to production without passing these gates:

- **[Connectors & premium readiness checklist](../checklists/connectors-and-premium.md)** — confirms premium connector usage is identified, licensed, and intentional; connections use connection references.
- **[DLP & governance checklist](../checklists/dlp-and-governance.md)** — confirms in-scope connectors are classified correctly and the flow does not violate DLP policy or leak data across boundaries.
- **[QA checklist](../checklists/qa.md)** — functional test of flow paths (happy + error), idempotency, and run-history verification.
- **[Deployment checklist](../checklists/deployment.md)** — managed solution promotion, environment variable/connection binding, and post-deploy smoke test.

Generate a phase checklist via `node packages/cli/dist/index.js checklist --type qa` (also supports `deployment`, `governance`, `scope-validation`).

## Related Agents, Docs & Patterns

**Agents**
- [Power Automate agent](../agents/power-automate-agent.md) — flow build and error-handling expertise.
- [Connector / integration agent](../agents/connector-integration-agent.md) — custom connector and API integration.
- [Licensing & capacity agent](../agents/licensing-capacity-agent.md) — plan and capacity sizing.
- [Security & governance agent](../agents/security-governance-agent.md) — DLP and secrets posture.
- [QA / test agent](../agents/qa-test-agent.md) — test planning and validation.

**Docs**
- [Power Automate guide](../docs/power-automate-guide.md) — core concepts and conventions.
- [Connectors guide](../docs/connectors-guide.md) — standard vs premium and connector strategy.
- [Integration patterns](../docs/integration-patterns.md) — choosing flows vs functions vs Graph.
- [Governance and CoE](../docs/governance-and-coe.md) — where automation governance fits.
- [Licensing and capacity](../docs/licensing-and-capacity.md) — entitlement and capacity reference.

**Patterns**
- [Power Automate patterns](../power-platform/power-automate-patterns.md) — reusable flow design patterns.
- [Custom connectors patterns](../power-platform/custom-connectors-patterns.md) — connector authoring patterns.
- [Connection references](../power-platform/connection-references.md) — externalising connections for ALM.
- [Environment variables](../power-platform/environment-variables.md) — environment-specific config.
- [Monitoring and telemetry](../power-platform/monitoring-and-telemetry.md) — observability for flows.

**Templates**
- [PRD template](../templates/prd-template.md) — capture automation requirements.
- [Scope of work template](../templates/scope-of-work-template.md) — bound the engagement.
- [Solution design template](../templates/solution-design-template.md) — document the integration design.
- [Risk register template](../templates/risk-register-template.md) — track the risks below.

## Risks & Assumptions

**Risks**

- **Licensing surprise.** Premium connector or AI Builder usage discovered mid-build can change the licensing model and client cost. Mitigation: run licensing estimation in Discovery and gate on the connectors-and-premium checklist.
- **API instability.** A custom-connector target API with poor docs, unstable auth, or aggressive throttling can blow the effort estimate. Mitigation: a spike against the API during Discovery; T&M or NTE cap for connector work.
- **Throttling / API request limits.** High-volume flows may hit daily request limits or service-protection throttling in production that did not appear in low-volume test. Mitigation: batching, concurrency limits, and back-off in design; load-aware testing.
- **DLP blocking at deploy.** A flow may use a connector combination the tenant DLP policy blocks, surfacing only at promotion. Mitigation: classify connectors against policy early (dlp-and-governance checklist).
- **Orphaned ownership.** Flows owned by a personal account become orphaned when that person leaves. Mitigation: solution-aware, service-account/connection-reference ownership.

**Assumptions**

- The client provides timely access to source/target systems, test data, and API credentials.
- Required environments (Dev/Test/Prod) exist or can be provisioned, with appropriate maker access.
- The client owns and funds all platform licences, premium connectors, AI Builder credits, and Dataverse capacity.
- A named business owner is available to validate approval rules and accept the automation.
- The target LOB API exists and is documented; we integrate with it rather than build it.
