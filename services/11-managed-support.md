---
title: "Service 11 — Managed Support"
description: "Ongoing support and maintenance for Power Platform solutions — SLA definitions, proactive monitoring, and structured incident response."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp
  - https://learn.microsoft.com/en-us/ai-builder/administer-licensing
  - https://learn.microsoft.com/en-us/ai-builder/endofaibcredits
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
related:
  - ../playbooks/production-support.md
  - ../checklists/support-handover.md
  - ../agents/support-runbook-agent.md
  - ../docs/support-and-runbooks.md
  - ../power-platform/monitoring-and-telemetry.md
  - ../templates/support-runbook-template.md
---

# Service 11 — Managed Support

Keep delivered Power Platform solutions healthy, observable, and fast to recover — through defined SLAs, proactive monitoring, and a disciplined incident-response practice.

## Business Problem & Outcome

Most Power Platform solutions are built once and then quietly degrade. Flows fail silently, connection references expire, license assignments drift, and the original builders move on. By the time the business notices, an approval process or a customer-facing app has been broken for days, and there is no runbook to recover it.

This service replaces "hope and ad-hoc heroics" with an operated solution: someone owns uptime, there is a known recovery path for every critical workflow, and incidents are detected before users report them.

Measurable outcomes:

- **Mean time to detect (MTTD)** for critical flow/app failures reduced to minutes via monitoring, not days via user complaints.
- **Mean time to recover (MTTR)** bounded by published SLA targets (e.g., P1 response within an agreed window).
- **Reduced recurring incidents** through root-cause analysis and runbook updates after each P1/P2.
- **Predictable run cost** via a fixed monthly retainer instead of unbudgeted emergency rework.
- **Audit-ready operations** — every incident, change, and access grant logged and reviewable.

## Ideal Client Profile

Buyers who already depend on Power Platform in production and feel the pain of unmanaged run:

- Organisations with **business-critical canvas/model-driven apps, Dataverse solutions, or Power Automate flows** that real users or customers rely on daily.
- Teams that **inherited a solution** from a previous vendor or a departed maker and have no documentation or recovery plan.
- Clients moving from a **build engagement** (e.g., Service 01 Power Apps Pro Dev, Service 04 Power Automate Enterprise) into steady-state operation.
- Regulated or audit-sensitive environments needing **logged, accountable support**.

Triggers and signals:

- A recent production outage with no clear owner or recovery steps.
- "We don't know what will break next, and no one here can fix it."
- Citizen-developer sprawl with no monitoring and unclear license/capacity headroom.
- An upcoming audit, compliance review, or board-level reliability expectation.
- Premium connectors, AI Builder, or Copilot Studio in production with no consumption monitoring.

## Scope & Deliverables

Concrete artifacts produced and operated under this service:

- **SLA definition document** — severity matrix (P1–P4), response/resolution targets, support hours, escalation path, and exclusions, captured before go-live.
- **Support runbooks** — one per critical app/flow/agent, authored from `../templates/support-runbook-template.md`: symptoms, diagnostics, recovery steps, owner, dependencies.
- **Monitoring configuration** — flow failure alerts, Dataverse/connector health signals, capacity and consumption dashboards (see `../power-platform/monitoring-and-telemetry.md`).
- **Incident-response process** — intake channel, triage rules, on-call/business-hours coverage, communication templates, and post-incident review format.
- **Incident log & change log** — structured record of every ticket, change, and access grant for audit traceability.
- **Health-check cadence** — scheduled reviews of solution health, license/capacity headroom, expiring secrets/connections, and CoE/DLP drift.
- **Monthly service report** — incidents by severity, SLA attainment, top recurring issues, consumption trend, and recommended remediations.
- **Handover package** — completed `../checklists/support-handover.md` capturing knowledge transfer from build team to support.

## Out of Scope

Clear boundaries to prevent retainer scope creep:

- **New feature development** and enhancement projects — quoted separately as project work or via a change request.
- **Major version upgrades / re-platforming** — covered by Service 09 Migration & Upgrade.
- **Net-new solution architecture** — covered by Service 01–05 build services.
- **Tenant-wide governance redesign** — covered by Service 08 Governance & Security (this service operates within existing governance).
- **Third-party / non-Power-Platform systems** — only the integration touch-points we own are in scope; upstream system fixes are the client's responsibility.
- **License procurement and tenant administration** — we advise and monitor; the client owns purchasing and tenant admin actions unless explicitly delegated.
- **24×7 cover** unless contracted at the L tier (default is business-hours support).

## Engagement Model & Effort

Delivered as a **recurring monthly retainer** following an initial onboarding sprint. Effort below is indicative onboarding/transition effort plus monthly run capacity.

| Tier | Profile | Onboarding (days) | Monthly run capacity (days) |
|------|---------|-------------------|------------------------------|
| **S** | 1–3 low-complexity solutions, business-hours, P3/P4 typical | 3–6 | 1–3 |
| **M** | Several business-critical solutions, premium connectors, monthly reporting | 6–12 | 3–8 |
| **L** | Mission-critical estate, extended/near-24×7 cover, AI Builder/Copilot Studio in prod, formal audit reporting | 12–20+ | 8–15+ |

Phases:

1. **Onboarding & discovery** — inventory solutions, dependencies, owners, license/capacity baseline; complete `../checklists/support-handover.md`.
2. **Instrumentation** — stand up monitoring, alerts, and dashboards per `../power-platform/monitoring-and-telemetry.md`.
3. **Runbook authoring** — produce runbooks for each critical asset.
4. **Steady-state operations** — monitor, respond, report, and continuously improve runbooks.

Team roles (link to agent briefs):

- **Support / runbook lead** — `../agents/support-runbook-agent.md` (owns runbooks, incident process, health checks).
- **Licensing & capacity advisor** — `../agents/licensing-capacity-agent.md` (consumption monitoring, headroom warnings).
- **Governance & security reviewer** — `../agents/security-governance-agent.md` (DLP/access drift, audit reporting).
- **QA / regression support** — `../agents/qa-test-agent.md` (validation after any recovery change).

## Indicative Pricing

All figures are **indicative planning ranges only — confirm current rates** with the commercial team (see `../agents/commercial-strategy-agent.md`). These are not quotes and create no client commitment.

- **Day-rate band:** senior Power Platform support engineer day rate within the standard agency band — **indicative, confirm current rates**.
- **Onboarding (one-off, T&M or fixed):** S ≈ 3–6 days, M ≈ 6–12 days, L ≈ 12–20+ days.
- **Monthly retainer (recurring):** priced on committed monthly run capacity (see tier table), typically billed as a fixed monthly fee with a capped overage rate for excess incident hours.
- **Pricing model guidance:**
  - **Fixed monthly retainer** for predictable run/monitoring/reporting — preferred for budgeting.
  - **T&M** for onboarding, root-cause deep-dives, and out-of-scope incident remediation beyond the retainer cap.
- Generate a structured licensing/cost view with `pp-agency estimate-licensing` (e.g. `node packages/cli/dist/index.js estimate-licensing -c gbp`) — output is a planning aid, not a price list.

## Licensing & Capacity Considerations

Support must continuously watch licensing and capacity, because run-time consumption — not build — is where most surprise costs and outages originate. The platform specifics below were verified against Microsoft Learn as of 2026-06-19 (platform state 2026-H1); always re-confirm exact prices, capacity numbers, and preview/GA status against current Microsoft docs before advising the client, as these change frequently.

- **Premium connectors** (e.g., SQL Server, HTTP, custom connectors, on-premises data gateway, most Azure/3rd-party connectors) require a standalone **Power Apps Premium** or **Power Automate Premium** per-user plan, or a per-app / per-flow plan — and *every end user* who runs a premium app needs that entitlement, not just the maker. A lapsed or unassigned premium license will break apps/flows in production. Monitor assignment drift. ([Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq))
- **Power Apps Premium (per-user) vs Per-App** — confirm the entitlement model for each app and that seat counts match active users. Per-app plans are allocated to an environment in the Power Platform admin center and assigned when an app is shared; per-app plans purchased after October 1, 2021 grant one app pass per license (one app or one Power Pages portal per user). Pay-as-you-go is an alternative to per-app/per-user for premium usage. ([About Power Apps per app plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp))
- **AI Builder credits** are capacity-based and consumed per prediction/document/page/transaction (e.g. ~1 credit per page for OCR, higher rates for document/invoice processing — see the rate card), reset monthly with no rollover. Monitor consumption to avoid mid-month exhaustion that silently stops document-processing flows. **Important 2025–2026 change:** since November 1, 2025 AI Builder features in Power Apps/Power Automate consume AI Builder credits first and then fall back to **Copilot Credits** when AI Builder credits are absent or exhausted; AI Builder capacity add-ons are renewal/true-up only for existing customers (new customers buy Copilot Credits), and AI Builder credits seeded in Power Platform/Dynamics licenses will be removed in November 2026. Track which currency each environment is drawing down. ([AI Builder licensing overview](https://learn.microsoft.com/en-us/ai-builder/administer-licensing), [End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits))
- **Copilot Studio** is billed on a **consumption** model, but the currency changed from *messages* to **Copilot Credits** on September 1, 2025 (no change to per-pack quantity or the pay-as-you-go rate of ~$0.01 per unit). Capacity comes from prepaid Copilot Credit packs (prepaid capacity is consumed first) or pay-as-you-go via an Azure subscription; capacity is enforced monthly with no rollover, and a production agent can exhaust credits unexpectedly. Track Copilot Credit volume in the monthly report. ([Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing))
- **Dataverse capacity** (database, file, log storage) accrues over time; growing tables, audit logs, and attachments can exceed entitlement. Note: exceeding storage does *not* currently block writes — Microsoft sends email notifications and shows an in-app banner when any of the three capacities drops below 15% remaining or goes over allocation, certain admin operations (e.g. creating environments) are blocked while over capacity, and Microsoft may suspend the service with reasonable notice. Include storage trend in health checks. ([Dataverse capacity-based storage](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage))
- **Power Automate per-flow vs per-user** licensing and **Power Platform request (API) limits** apply: daily request entitlements vary by license (e.g. 40,000/day for most paid Power Platform/Dynamics 365 users, 6,000/day for Power Apps per-app, 250,000/day for a Power Automate per-flow plan), and up to 10 Process licenses can be stacked on one flow (+250,000 actions/day each). Overages currently cause throttling (delayed runs) rather than hard blocks during the enforcement transition period; pay-as-you-go removes high-usage throttling. ([Requests limits and allocations](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations))
- **Expiring secrets / OAuth connections** — service-principal secrets and delegated connections expire and break flows; track expiry dates as a monitored signal.

Always validate exact prices, capacity numbers, entitlement rules, and preview/GA status against current Microsoft licensing and documentation before advising the client. Use `../agents/licensing-capacity-agent.md` and `../checklists/licensing-and-capacity.md` to structure the review.

## Delivery Approach

Operate the engagement against the production-support playbook and supporting steps:

- **`../playbooks/production-support.md`** — the primary playbook: SLA setup, monitoring, incident triage, recovery, and post-incident review.
- **`../playbooks/governance-audit.md`** — periodic DLP/governance drift checks folded into health-check cadence.
- **`../playbooks/alm-pipeline.md`** — apply controlled, source-controlled changes when a recovery requires a solution deployment rather than an in-place edit.

Operating rhythm:

1. **Detect** — monitoring/alerts surface an issue (preferred) or intake channel receives a ticket.
2. **Triage** — classify severity against the SLA matrix; assign owner.
3. **Recover** — execute the runbook; if no runbook exists, recover, then author one.
4. **Review** — root-cause P1/P2 incidents; update runbooks and monitoring to prevent recurrence.
5. **Report** — roll incidents, SLA attainment, and consumption into the monthly service report.

## Quality Gates

Each gate is enforced before exiting onboarding and reviewed during steady-state:

- **`../checklists/support-handover.md`** — knowledge transfer complete, owners assigned, runbooks exist for all critical assets.
- **`../checklists/power-platform-environment.md`** — environments, connection references, and environment variables verified for the supported estate.
- **`../checklists/licensing-and-capacity.md`** — license assignments and capacity headroom validated and monitored.
- **`../checklists/dlp-and-governance.md`** — DLP policies and governance posture confirmed for supported solutions.
- **`../checklists/qa.md`** — regression validation gate applied after any recovery change touching app/flow logic.

Validate the project artifact set with `pp-agency validate` (e.g. `node packages/cli/dist/index.js validate -p <project-path>`) and generate the handover checklist via `pp-agency checklist -t support-handover`.

## Related Agents, Docs & Patterns

**Agents:**

- `../agents/support-runbook-agent.md` — runbook authoring, incident process, health checks.
- `../agents/licensing-capacity-agent.md` — consumption and capacity monitoring.
- `../agents/security-governance-agent.md` — governance/DLP drift and audit reporting.
- `../agents/qa-test-agent.md` — post-recovery regression validation.
- `../agents/commercial-strategy-agent.md` — retainer pricing and tier selection.

**Docs:**

- `../docs/support-and-runbooks.md` — support model, runbook standards, incident-handling guidance.
- `../docs/delivery-model.md` — how build engagements transition into managed support.
- `../docs/governance-and-coe.md` — CoE context for governance drift monitoring.
- `../docs/licensing-and-capacity.md` — licensing/capacity reference for the run-time warnings above.

**Patterns:**

- `../power-platform/monitoring-and-telemetry.md` — monitoring signals, alerting, and telemetry patterns.
- `../power-platform/environment-variables.md` — managing environment-specific config under support.
- `../power-platform/connection-references.md` — connection references and credential/secret lifecycle.
- `../power-platform/solution-patterns.md` — applying solution-based changes during recovery.

**Templates:**

- `../templates/support-runbook-template.md` — runbook structure per critical asset.
- `../templates/handover-document-template.md` — build-to-support handover record.
- `../templates/risk-register-template.md` — tracking known run-time risks.

## Risks & Assumptions

**Assumptions:**

- The client provides timely access to environments, the relevant tenant/admin contacts, and a single business owner for prioritisation.
- Supported solutions are reasonably documented at onboarding, or onboarding effort is increased to reverse-engineer them.
- The client owns and funds license/capacity procurement; this service monitors and advises but does not purchase.
- Support operates within existing governance/DLP guardrails; redesigning those is a separate engagement.

**Risks:**

- **Undocumented inherited solutions** inflate onboarding effort and delay runbook coverage — mitigate with a discovery sprint and a risk register entry.
- **Consumption blowouts** (AI Builder credits / Copilot Credits, Copilot Studio Copilot Credits, Dataverse storage, Power Platform request limits) cause silent outages — note that AI Builder model runs and Copilot Studio agents *are* blocked once credits are exhausted, whereas Dataverse storage overages and request-limit overages currently throttle/notify rather than hard-block. Mitigate with monitoring and the monthly consumption report. ([AI Builder licensing overview](https://learn.microsoft.com/en-us/ai-builder/administer-licensing), [Requests limits and allocations](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations))
- **Single-point-of-knowledge** — over-reliance on one maker or engineer; mitigate by enforcing runbook authoring and the handover checklist.
- **Expiring credentials/secrets** break flows without warning — mitigate by tracking expiry as a monitored signal.
- **Microsoft platform change** (deprecations, licensing model changes, preview-to-GA shifts) can alter behaviour — the 2025–2026 move from Copilot Studio *messages* to Copilot Credits and the November 2026 removal of seeded AI Builder credits are live examples. Mitigate by validating against current Microsoft docs and flagging changes in monthly reporting. ([Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing), [End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits))
- **Scope creep** of feature requests into the run retainer — mitigate with a clear out-of-scope boundary and change-request routing to build services.
