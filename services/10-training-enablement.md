---
title: "Service 10 — Training & Enablement"
description: "Team training and knowledge transfer for Power Platform — training materials, runbooks, and video guides that move makers, admins, and support staff from dependent to self-sufficient."
category: service
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

- **Training environment licensing:** hands-on workshops need a sandbox/dev environment. Developer environments and trial capacity have limits and expiry (Needs verification against current Microsoft docs). Confirm the client has appropriate environments before scheduling hands-on sessions.
- **Premium connectors:** any runbook or guide that touches a premium connector (e.g. SQL Server, HTTP, custom connectors, Dataverse from outside its included context) must flag that running it requires a **Power Apps Premium** or **Power Automate Premium / per-flow** license. Makers trained on premium patterns must understand they cannot deploy them on Seeded/Office 365 plans (Needs verification against current Microsoft docs).
- **Power Apps Premium / Per-App:** clarify in training which apps require which plan. Teach makers to check entitlement *before* building, not after. Exact plan names and inclusions change — (Needs verification against current Microsoft docs).
- **AI Builder credits:** any AI Builder content (document processing, prediction, etc.) consumes credits from a capacity pool. Training must teach makers and admins to monitor credit consumption and avoid runaway batch processing. Credit allocations and per-action consumption are version-dependent — (Needs verification against current Microsoft docs).
- **Copilot Studio messages:** Copilot Studio agents are metered by message/session consumption against a capacity pack. Enablement for support staff must cover how to read message consumption and what happens at capacity exhaustion. Message definitions and pack sizes change frequently — (Needs verification against current Microsoft docs).
- **Dataverse capacity:** runbooks for admins must cover Dataverse database, file, and log capacity monitoring, and the consequences of exceeding entitlement. Storage entitlements and overage behaviour are tenant- and plan-specific — (Needs verification against current Microsoft docs).
- **API request limits / service protection:** teach makers that flows and apps operate under request-throttling limits; runbooks should include throttling as a diagnosed failure mode.

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
