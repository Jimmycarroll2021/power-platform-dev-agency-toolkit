---
title: "Service 10 — Training & Enablement"
description: "Team training and knowledge transfer for Power Platform — training materials, runbooks, and video guides that move makers, admins, and support staff from dependent to self-sufficient."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus
  - https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp
  - https://learn.microsoft.com/en-us/power-platform/developer/plan
  - https://learn.microsoft.com/en-us/power-platform/admin/automatic-environment-cleanup
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
related:
  - ../docs/delivery-model.md
  - ../docs/support-and-runbooks.md
  - ../agents/support-runbook-agent.md
  - ../templates/handover-document-template.md
  - ../checklists/support-handover.md
  - ../playbooks/production-support.md
---

# Service 10 — Training & Enablement

We turn a delivered solution into a capability your team owns — through role-targeted training, runbooks, and reusable video guides, so makers build safely, admins govern confidently, and support resolves incidents without us.

## Business Problem & Outcome

Most Power Platform engagements ship a working solution and then quietly leave the client dependent on the delivery partner for every change, incident, and new build. Knowledge lives in one or two heads, tribal habits diverge from governed practice, and the platform either stagnates (nobody dares touch it) or sprawls (everybody builds, nobody governs).

This service closes that gap. It transfers operational, build, and governance knowledge into the client's own people and durable artifacts.

**Pain signals this solves:**

- "Only the consultant knows how this flow works."
- Citizen makers building unsanctioned apps with premium connectors nobody approved.
- Support desk escalating every Power Automate failure because there is no runbook.
- Admins unsure how to manage environments, DLP policies, or capacity.
- Onboarding a new maker takes weeks of shoulder-surfing.

**Measurable outcomes:**

- Reduced mean-time-to-resolution (MTTR) on platform incidents because L1/L2 support has runbooks.
- Reduced dependency on external delivery for routine changes (target: client self-services tier-1 changes within 30 days).
- Faster maker onboarding (a documented onboarding path instead of ad-hoc shadowing).
- Demonstrable governance literacy — admins can explain and operate DLP, environment routing, and capacity monitoring.
- A defensible knowledge base (written + video) that survives staff turnover.

## Ideal Client Profile

Buyers who get the most value:

- **Mid-to-large organisations** standing up or scaling a Power Platform Center of Excellence (CoE) and needing their people enabled, not just tooled.
- **Teams inheriting a delivered solution** (post go-live) who must operate and extend it themselves.
- **IT/support functions** absorbing Power Platform into BAU service management.
- **Citizen-developer programs** that need guardrails plus skills so makers build safely.

**Triggers / signals:**

- A solution is about to go live and there is no handover plan.
- A key consultant or internal champion is leaving.
- An audit or governance review flagged "single point of knowledge" risk.
- The platform is growing faster than the team's ability to govern it.
- Leadership wants to reduce ongoing managed-service or contractor spend.

## Scope & Deliverables

Concrete artifacts produced:

- **Role-based training curriculum** — separate tracks for citizen makers, pro developers, environment/CoE admins, and L1/L2 support.
- **Live or virtual training sessions** — workshop-style, hands-on against a training environment, recorded for reuse.
- **Operational runbooks** — per-solution and per-incident playbooks (failure modes, diagnostic steps, escalation paths), built on the [support runbook template](../templates/support-runbook-template.md).
- **Handover document** — the formal knowledge-transfer artifact built from the [handover document template](../templates/handover-document-template.md), covering architecture, ownership, credentials/connection references, known issues, and contacts.
- **Video guides** — short, task-focused screen recordings (e.g. "how to rerun a failed flow", "how to add a column to the model-driven app", "how to check API request capacity").
- **Quick-reference cards / cheat sheets** — including a curated subset of the [PAC CLI cheat sheet](../power-platform/pac-cli-cheatsheet.md) for ALM-capable teams.
- **Governance briefing** — how DLP, environment strategy, and capacity work in *this* tenant (not generic).
- **Knowledge base structure** — a recommended home (SharePoint/Teams/wiki) with naming, ownership, and review cadence.
- **Train-the-trainer session** (optional) — so the client can deliver future onboarding internally.

## Out of Scope

Clear boundaries to prevent scope creep:

- **New feature development or solution changes** — that belongs to Service 01 (Power Apps Pro Dev) and related build services.
- **Ongoing managed support / SLA-backed monitoring** — that is Service 11 (Managed Support). This service *enables* the client to support themselves or hands off cleanly to a support service.
- **Microsoft Learn / formal certification delivery** — we prepare and orient toward MS Learn paths but do not deliver or proctor Microsoft certifications.
- **Licensing procurement or tenant administration changes** — we advise; we do not purchase licenses or make irreversible tenant changes on the client's behalf.
- **Translation/localisation of materials** into non-English languages (available as a priced add-on).
- **Indefinite content maintenance** — materials are accurate as of delivery; ongoing upkeep is a separate retainer.

## Engagement Model & Effort

Delivery follows the standard phasing in the [delivery model](../docs/delivery-model.md):

1. **Discover** — audience analysis, skills baseline, existing-artifact audit, environment readiness.
2. **Design** — curriculum, runbook inventory, video shot-list, handover outline.
3. **Produce** — author materials, record sessions/videos, draft runbooks and handover.
4. **Deliver** — run training, walk through runbooks, validate via knowledge checks.
5. **Embed** — handover sign-off, knowledge-base setup, train-the-trainer, feedback loop.

**T-shirt sizing (indicative effort):**

| Size | Scope | Indicative effort |
|------|-------|-------------------|
| **S** | Single solution handover + core runbooks + 3–5 video guides; one role track. | ~4–7 days |
| **M** | Two-to-three role tracks, full runbook set, ~10 video guides, live workshops, handover doc. | ~8–15 days |
| **L** | Org-wide enablement program: all role tracks, CoE governance briefing, train-the-trainer, knowledge-base build-out, recurring cohorts. | ~16–30+ days |

Day ranges are planning estimates only and depend on audience size, solution complexity, and how much usable documentation already exists.

**Team roles (link to agent briefs):**

- [Support Runbook Agent](../agents/support-runbook-agent.md) — authors and validates incident runbooks and handover content.
- [Commercial Strategy Agent](../agents/commercial-strategy-agent.md) — scopes the engagement, sizing, and pricing posture.
- [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md) — produces the tenant-specific governance/capacity briefing.
- [Solution Architect](../agents/solution-architect.md) — supplies architecture context for the handover document.
- [Security & Governance Agent](../agents/security-governance-agent.md) — validates the governance and DLP briefing content.

## Indicative Pricing

> All figures are **indicative planning ranges, not quotes**. Confirm current rates with the commercial team before committing to any client.

- **Day-rate band:** senior enablement/consulting rates apply (indicative — confirm current rates). Mixed teams blend an architect/lead rate with a producer/documenter rate.
- **S engagements** are typically delivered **fixed-price** (well-bounded scope, predictable artifact count).
- **M engagements** can be fixed-price when the artifact inventory is agreed up front, or **time-and-materials (T&M)** if audience size and runbook count are still firming up.
- **L / program-style** engagements are usually **T&M or retainer**, because cohort count and content maintenance vary over time.
- **Add-ons** (localisation, additional video volume, recurring cohorts, ongoing content upkeep) are priced separately and noted as recurring vs one-off.

Use the [client proposal template](../templates/client-proposal-template.md) and [scope of work template](../templates/scope-of-work-template.md) to translate sizing into a commercial offer. See also [commercial offers](../docs/commercial-offers.md).

## Licensing & Capacity Considerations

Training must teach the client to *recognise and respect* licensing boundaries — and the materials themselves must not assume entitlements the client lacks.

- **Training environment licensing:** hands-on workshops need a sandbox/dev environment. The free Power Apps Developer Plan gives a personal developer environment with access to premium connectors and Dataverse for build/learning, but it cannot be used in production ([Power Apps Developer Plan](https://learn.microsoft.com/en-us/power-platform/developer/plan)). Developer environments expire on inactivity: Power Platform disables a developer environment after 30 days of inactivity (60 days for a Managed Environment), deletes it 15 days after that if not re-enabled, and then allows a 7-day recovery window ([automatic deletion of inactive environments](https://learn.microsoft.com/en-us/power-platform/admin/automatic-environment-cleanup)). Confirm the client has appropriate, non-expiring environments before scheduling hands-on sessions.
- **Premium connectors:** any runbook or guide that touches a premium connector (e.g. SQL Server, HTTP, custom connectors, on-premises data gateway) must flag that running it requires a standalone Power Apps or Power Automate plan — Microsoft 365 "seeded" rights alone do not grant access to premium, custom, or on-premises connectors ([Power Platform licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq)). Every user who runs the app — not just the maker — needs the premium entitlement. Makers trained on premium patterns must understand they cannot deploy them on Office 365 / seeded plans.
- **Power Apps Premium / Per-App:** the former "Power Apps per user" plan is now named **Power Apps Premium** (per-user, list price USD $20/user/month), and the **Power Apps per app** plan is licensed per user, per app, per environment (list price USD $5/user/app/month and stackable) ([licensing overview](https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus), [about Power Apps per app plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp)). Clarify in training which apps require which plan; teach makers to check entitlement *before* building, not after. Note that a per-app license does not grant rights to create or own Power Automate flows that use premium features — that needs a Power Apps Premium or Power Automate premium license. Exact list prices and channel availability change; confirm current figures on the Microsoft pricing page before quoting.
- **AI Builder credits:** any AI Builder content (document processing, prediction, etc.) consumes credits from a tenant-level capacity pool on a consumption basis; building and testing models is free, but running them in apps, flows, or agents consumes credits, and consumption is computed regularly (typically daily) and resets monthly with no rollover ([AI Builder credit management](https://learn.microsoft.com/en-us/ai-builder/credit-management)). Two 2025-2026 changes to teach admins: since November 1, 2025, AI Builder actions in Power Apps/Power Automate consume AI Builder credits first and fall back to Copilot Credits when exhausted; and seeded AI Builder credits from licenses are scheduled to be removed on November 1, 2026. Training must teach makers and admins to monitor credit consumption (Power Platform admin center Licensing > Capacity, plus the downloadable consumption report) and avoid runaway batch processing.
- **Copilot Studio capacity:** Copilot Studio agents are metered by consumption against prepaid capacity packs or a pay-as-you-go meter. Note the terminology change: since September 1, 2025 the unit of consumption is **Copilot Credits** (formerly "messages"), with prepaid capacity packs providing 25,000 credits per pack per month that replenish at the start of each billing period and do not roll over ([billing rates and management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management), [manage Copilot Studio credits and capacity](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity)). Enablement for support staff must cover how to read consumption (Power Platform admin center Licensing > Copilot Studio) and what happens at exhaustion — when prepaid credits run out, agents switch to pay-as-you-go billing against the connected Azure subscription. Credit rates per feature change frequently; confirm current rates on the billing-rates page.
- **Dataverse capacity:** Dataverse storage is tracked as three separate, independently-metered types — database, file, and log — each purchasable in 1-GB add-on increments, with a tenant default entitlement plus per-license accruals ([Dataverse capacity-based storage](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage)). Runbooks for admins must cover monitoring all three and the consequences of exceeding entitlement: a low-capacity banner appears below 15% remaining, admin operations (create/copy/restore/recover environments) are restricted during overage, and Microsoft may suspend the service after reasonable notice. Admins can request a 45-day capacity extension at 80% consumption (max three times per 365 days) or move the environment to pay-as-you-go. Exact entitlements are tenant- and plan-specific — anchor numbers in the client's actual agreement.
- **API request limits / service protection:** teach makers that flows and apps operate under two distinct controls. Daily Power Platform request limits are entitlement-based and allocated per licensed user ([requests limits and allocations](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations)). Separately, Dataverse service protection limits throttle on a per-user, per-server basis to protect platform stability — the Web API returns a `429 Too Many Requests` (the SDK returns an `OrganizationServiceFault`) and resilient clients must honour the `Retry-After` interval ([service protection API limits](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits)). Runbooks should include throttling as a diagnosed failure mode.

Always anchor the tenant-specific numbers in the client's actual agreement. See [licensing & capacity](../docs/licensing-and-capacity.md) and the [licensing & capacity checklist](../checklists/licensing-and-capacity.md). The CLI's `estimate-licensing` command can seed a planning conversation (figures indicative, not authoritative).

## Delivery Approach

The enablement content is built on top of the same playbooks the delivery team uses, so what we teach matches how the platform is actually run:

- **Operational support & incident handling** — [production support playbook](../playbooks/production-support.md) is the backbone of L1/L2 runbook content.
- **Governance & audit literacy** — [governance audit playbook](../playbooks/governance-audit.md) drives the admin/CoE governance briefing.
- **Build-track enablement** — point maker tracks at the relevant build playbooks, e.g. [canvas app](../playbooks/canvas-app.md), [model-driven app](../playbooks/model-driven-app.md), [Power Automate cloud flow](../playbooks/power-automate-cloud-flow.md), and [Copilot Studio agent](../playbooks/copilot-studio-agent.md), so makers learn governed patterns rather than improvising.
- **ALM literacy** — for pro-dev and admin tracks, walk through the [ALM pipeline](../playbooks/alm-pipeline.md) so the client can promote solutions safely.

Each training artifact is mapped back to a source playbook so it can be refreshed when the underlying practice changes.

## Quality Gates

Before sign-off, the engagement passes these checklists:

- [Support handover checklist](../checklists/support-handover.md) — confirms the handover document, runbooks, contacts, and ownership are complete and accepted.
- [QA checklist](../checklists/qa.md) — validates that materials are accurate, runnable, and free of errors.
- [Scope validation checklist](../checklists/scope-validation.md) — confirms delivered artifacts match the agreed scope.
- [Licensing & capacity checklist](../checklists/licensing-and-capacity.md) — confirms licensing caveats are correctly represented in all materials.

A knowledge-check (short assessment or live walkthrough) per role track is a required exit gate — enablement is only "done" when trainees can demonstrate the target tasks.

## Related Agents, Docs & Patterns

**Agents:**

- [Support Runbook Agent](../agents/support-runbook-agent.md)
- [Commercial Strategy Agent](../agents/commercial-strategy-agent.md)
- [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md)
- [Security & Governance Agent](../agents/security-governance-agent.md)
- [Solution Architect](../agents/solution-architect.md)

**Docs:**

- [Delivery model](../docs/delivery-model.md)
- [Support and runbooks](../docs/support-and-runbooks.md)
- [Governance and CoE](../docs/governance-and-coe.md)
- [Licensing and capacity](../docs/licensing-and-capacity.md)
- [Commercial offers](../docs/commercial-offers.md)
- [Glossary](../docs/glossary.md)

**Patterns:**

- [Monitoring and telemetry](../power-platform/monitoring-and-telemetry.md)
- [Environment strategy](../power-platform/environment-strategy.md)
- [PAC CLI cheat sheet](../power-platform/pac-cli-cheatsheet.md)

**Templates:**

- [Handover document template](../templates/handover-document-template.md)
- [Support runbook template](../templates/support-runbook-template.md)
- [Client proposal template](../templates/client-proposal-template.md)
- [Scope of work template](../templates/scope-of-work-template.md)

## Risks & Assumptions

**Assumptions:**

- The solution being handed over is stable and documented enough to teach from; major churn during the engagement will inflate effort.
- The client provides a training environment and learner access in time for hands-on sessions.
- Trainee availability is confirmed; cohort attendance is the client's responsibility.
- Subject-matter experts (original builders, admins) are available for knowledge extraction during the Discover and Produce phases.

**Risks:**

- **Knowledge gaps in the source team** — if the original builders have already left, extracting accurate runbook content takes longer and may surface undocumented behaviour.
- **Materials drift** — Power Platform and licensing change frequently; any specific platform fact in delivered materials carries a "verify against current Microsoft docs" caveat and a documented review cadence.
- **Over-enablement risk** — teaching makers premium patterns they aren't licensed to use can drive shadow-IT and unexpected cost; governance briefing must be paired with build enablement, never delivered alone.
- **Low adoption** — training without a knowledge-base home and a review owner decays quickly; the Embed phase and knowledge-check gates mitigate this.
- **Scope confusion with managed support** — clients may expect ongoing fixes; the Out of Scope section and a clean handover to Service 11 must be set early.
