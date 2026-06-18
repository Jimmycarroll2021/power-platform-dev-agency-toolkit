---
title: "Service 12 — Discovery & Assessment"
description: "Requirements gathering and feasibility study that produces a PRD, technical assessment, and project plan before any build commits."
category: service
related:
  - ../docs/client-discovery.md
  - ../checklists/project-intake.md
  - ../checklists/scope-validation.md
  - ../agents/solution-architect.md
  - ../templates/prd-template.md
  - ../templates/scope-of-work-template.md
---

# Service 12 — Discovery & Assessment

A fixed-fee, time-boxed engagement that turns a fuzzy "we want an app/agent/automation" into a costed, de-risked, buildable plan — the PRD, technical assessment, and project plan a client can fund with confidence.

## Business Problem & Outcome

Most failed or over-budget Power Platform projects fail in the first two weeks: requirements are vague, the wrong service is chosen (canvas app vs model-driven vs Power Pages vs Copilot Studio), premium licensing surprises surface late, and the integration/data model is hand-waved. Discovery & Assessment removes that risk before the client commits build budget.

**Pain this solves:**

- Stakeholders cannot agree on scope, so estimates swing 3-5x.
- No one has validated whether the platform can actually do what's asked (capacity, connectors, governance/DLP constraints).
- Licensing cost is unknown until it's a budget shock mid-build.
- Sponsors want a single fundable document, not a slide deck.

**Measurable outcomes:**

- A signed-off PRD with prioritised requirements (MoSCoW) and explicit success criteria.
- A technical assessment that names the recommended architecture and flags every premium/capacity dependency.
- A phased project plan with T-shirt-sized estimates the client can use to approve build funding.
- Estimate confidence improved from "guess" to a defensible +/- band (typically +/- 25% post-discovery vs +/- 100% before).

## Ideal Client Profile

Mid-market to enterprise teams (typically 100+ seats) already on Microsoft 365 who have a backlog of "we should automate / app-ify this" ideas but no validated plan.

**Buying triggers / signals:**

- A new internal sponsor has budget but needs a business case to release it.
- A previous citizen-developer build stalled, broke governance/DLP rules, or hit a licensing wall.
- An M&A, system retirement (e.g. retiring InfoPath, Access, legacy SharePoint workflows), or compliance deadline forces a decision.
- The client is comparing Power Platform against a custom build / SaaS and wants an objective feasibility read.
- Procurement requires a scoped statement of work before any delivery contract.

## Scope & Deliverables

- **Discovery report** — captured from structured stakeholder sessions (problem, current-state process, personas, data sources, constraints). Generated via the CLI `discovery` command and refined manually.
- **Product Requirements Document (PRD)** — based on [../templates/prd-template.md](../templates/prd-template.md); generated via `generate-prd` then edited with stakeholders.
- **Technical assessment** — recommended service/architecture (canvas / model-driven / Power Pages / Power Automate / Copilot Studio), data model sketch, integration map, and a platform-fit verdict. See [../docs/platform-map.md](../docs/platform-map.md).
- **High-level data model** — entity/table outline and ownership, aligned to [../power-platform/dataverse-patterns.md](../power-platform/dataverse-patterns.md).
- **Licensing & capacity estimate** — produced via `estimate-licensing`, listing every premium dependency and indicative per-user/per-app/credit cost.
- **Phased project plan** — milestones, dependencies, and S/M/L effort bands.
- **Scope of work** — based on [../templates/scope-of-work-template.md](../templates/scope-of-work-template.md), ready to convert into a delivery contract.
- **Risk register** — top risks with likelihood/impact and mitigations.

## Out of Scope

- Any production build, configuration, or solution development (that is delivery, scoped separately by Services 01-07).
- Pixel-level UI design or clickable prototypes — see Service 14 (Rapid Prototyping) when a proof is needed.
- Tenant administration, environment provisioning, or DLP policy changes.
- Data migration execution (Service 09) or formal security/compliance audit (Service 15).
- Binding fixed-price delivery quotes — discovery produces estimate *bands*, not delivery quotes.
- Procurement of Microsoft licences on the client's behalf.

## Engagement Model & Effort

Fixed-fee, time-boxed. Three phases run inside the box.

| Phase | Activities | Primary roles |
| --- | --- | --- |
| 1. Intake & alignment | Kickoff, stakeholder mapping, current-state capture, run [../checklists/project-intake.md](../checklists/project-intake.md) | Solution architect, BA |
| 2. Feasibility & design sketch | Platform-fit analysis, data model outline, integration & licensing assessment | [../agents/solution-architect.md](../agents/solution-architect.md), [../agents/platform-cartographer.md](../agents/platform-cartographer.md) |
| 3. Synthesis & sign-off | PRD, technical assessment, project plan, SoW; scope validation walkthrough | Solution architect, engagement lead |

**T-shirt sizes (indicative effort):**

| Size | Profile | Indicative effort |
| --- | --- | --- |
| **S** | Single app/flow, one team, few integrations | 3-5 days |
| **M** | Multi-module solution or 2-3 integrations, Dataverse-backed | 6-12 days |
| **L** | Cross-department program, multiple environments, complex integrations, Copilot Studio / AI Builder | 13-25 days |

Team draws on these agents as needed: [../agents/solution-architect.md](../agents/solution-architect.md), [../agents/platform-cartographer.md](../agents/platform-cartographer.md), [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md), [../agents/commercial-strategy-agent.md](../agents/commercial-strategy-agent.md).

## Indicative Pricing

All figures are **indicative planning ranges — confirm current rates** with the commercial team; they are not quotes or client commitments.

- **Model:** fixed-price preferred (discovery has a defined deliverable set and time box). T&M offered only where scope itself is unknown — in which case run a 1-2 day "discovery-of-discovery" first.
- **Day-rate band (blended):** indicative AUD ~1,400-2,200 / day depending on seniority mix (confirm current rates).
- **Fixed-fee bands** (derived from the effort table above, indicative only):
  - S: ~AUD 4,000-11,000
  - M: ~AUD 8,000-26,000
  - L: ~AUD 18,000-55,000
- Discovery fee is frequently credited against the subsequent delivery engagement — confirm commercial policy.

See [../docs/commercial-offers.md](../docs/commercial-offers.md) and [../agents/commercial-strategy-agent.md](../agents/commercial-strategy-agent.md) for packaging.

## Licensing & Capacity Considerations

Discovery's job is to surface licensing/capacity cost *before* the client funds a build. Flag every one of these in the assessment, each with the caveat "(Needs verification against current Microsoft docs)":

- **Premium connectors** (SQL, HTTP, custom connectors, most non-Microsoft data sources) require a **Power Apps Premium** or **Power Automate Premium** licence per user — standard M365-seeded licences do not cover them. (Needs verification against current Microsoft docs)
- **Power Apps Per-App vs Premium (per-user):** Per-App plans are cheaper per app but cap usage; Premium per-user suits heavy multi-app users. Choosing wrong inflates run-rate. Indicative pricing (Needs verification against current Microsoft docs).
- **AI Builder** consumes a **credit** pool; document processing, prediction, and GPT actions draw credits. Estimate volume early — credits are bought in packs. (Needs verification against current Microsoft docs)
- **Copilot Studio** is billed on a **message** consumption model (packs or pay-as-you-go); generative answers and actions consume messages at differing rates. (Needs verification against current Microsoft docs)
- **Dataverse capacity** — database, file, and log storage are tenant-pooled with per-licence accruals; large data models or migrations can exceed the pool and need add-on capacity. (Needs verification against current Microsoft docs)
- **Power Pages** is licensed per authenticated user or per anonymous-visitor capacity pack — public portals can be a significant run-rate line. (Needs verification against current Microsoft docs)
- **Governance/DLP constraints** can block the recommended connector mix entirely; check tenant DLP policy during discovery.

Run `estimate-licensing` to produce the first-pass cost sheet and cross-check against [../docs/licensing-and-capacity.md](../docs/licensing-and-capacity.md) and [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md). All tool output is an estimate to be verified against current Microsoft pricing.

```bash
# Generate licensing estimate (currency: usd|gbp|eur)
node packages/cli/dist/index.js estimate-licensing -c usd -o ./discovery/licensing-estimate.md
```

## Delivery Approach

There is no single build playbook for discovery — the engagement is CLI-driven scaffolding plus structured workshops, then the relevant *build* playbook is selected as an output of the assessment. Typical flow:

```bash
# 1. Scaffold the engagement workspace + boilerplate docs
node packages/cli/dist/index.js new-project "Acme Discovery" --client "Acme" --type discovery --output ./engagements

# 2. Run the interactive discovery session -> report
node packages/cli/dist/index.js discovery

# 3. Generate the PRD from captured context
node packages/cli/dist/index.js generate-prd -c "Acme" -p ./engagements/acme-discovery -o ./engagements/acme-discovery/prd.md

# 4. Generate the solution design / technical assessment
node packages/cli/dist/index.js generate-solution-design

# 5. Validate the assembled project directory before sign-off
node packages/cli/dist/index.js validate -p ./engagements/acme-discovery
```

After `cd packages/cli && npm link`, the same commands run as `pp-agency <cmd>`.

The technical assessment then points to the right delivery playbook, e.g. [../playbooks/canvas-app.md](../playbooks/canvas-app.md), [../playbooks/model-driven-app.md](../playbooks/model-driven-app.md), [../playbooks/dataverse-solution.md](../playbooks/dataverse-solution.md), [../playbooks/power-automate-cloud-flow.md](../playbooks/power-automate-cloud-flow.md), or [../playbooks/copilot-studio-agent.md](../playbooks/copilot-studio-agent.md).

## Quality Gates

- **Intake gate** — [../checklists/project-intake.md](../checklists/project-intake.md): sponsor, success criteria, stakeholders, and data sources captured.
- **Scope validation gate** — [../checklists/scope-validation.md](../checklists/scope-validation.md): every requirement traces to a deliverable; out-of-scope items explicitly listed.
- **Licensing & capacity gate** — [../checklists/licensing-and-capacity.md](../checklists/licensing-and-capacity.md): all premium/credit/message/capacity dependencies named and estimated.
- **Connectors & premium gate** — [../checklists/connectors-and-premium.md](../checklists/connectors-and-premium.md): each connector classified standard/premium/custom and DLP-checked.
- **Environment readiness** — [../checklists/power-platform-environment.md](../checklists/power-platform-environment.md): target environment strategy noted for the build phase.

Generate any checklist with the CLI:

```bash
node packages/cli/dist/index.js checklist -t project-intake -o ./discovery/intake-checklist.md
node packages/cli/dist/index.js checklist -t scope-validation -o ./discovery/scope-checklist.md
```

## Related Agents, Docs & Patterns

**Agents**

- [../agents/solution-architect.md](../agents/solution-architect.md) — platform-fit decision and architecture sketch.
- [../agents/platform-cartographer.md](../agents/platform-cartographer.md) — maps tenant/environment landscape and existing assets.
- [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md) — licensing/credit/capacity estimation.
- [../agents/commercial-strategy-agent.md](../agents/commercial-strategy-agent.md) — packaging, pricing, and SoW shaping.

**Docs**

- [../docs/client-discovery.md](../docs/client-discovery.md) — discovery method and question banks.
- [../docs/platform-map.md](../docs/platform-map.md) — choosing the right Power Platform service.
- [../docs/licensing-and-capacity.md](../docs/licensing-and-capacity.md) — licensing reference.
- [../docs/commercial-offers.md](../docs/commercial-offers.md) — how this service is sold.

**Patterns**

- [../power-platform/dataverse-patterns.md](../power-platform/dataverse-patterns.md) — data model patterns for the assessment.
- [../power-platform/environment-strategy.md](../power-platform/environment-strategy.md) — environment planning for the build phase.

**Templates & prompts**

- [../templates/prd-template.md](../templates/prd-template.md) — PRD structure.
- [../templates/scope-of-work-template.md](../templates/scope-of-work-template.md) — SoW structure.
- [../templates/risk-register-template.md](../templates/risk-register-template.md) — risk capture.
- [../prompts/client-discovery-prompt.md](../prompts/client-discovery-prompt.md) — AI-assisted discovery interviewing.

## Risks & Assumptions

**Assumptions**

- The client can make 2-4 stakeholders available for workshops inside the time box.
- The client tenant is M365-based and someone with admin visibility can confirm environment and DLP posture.
- Discovery outputs are estimate bands; final fixed-price delivery quotes follow a separate scoping pass.

**Risks**

- **Stakeholder unavailability** delays sign-off — mitigate with a fixed workshop schedule agreed at kickoff.
- **Scope creep during discovery** — mitigate with the scope-validation gate and an explicit out-of-scope list.
- **Licensing surprises** — every premium/credit/capacity number is marked for verification against current Microsoft docs; never present platform pricing as final.
- **Platform-fit reversal** — if feasibility shows Power Platform is the wrong tool, say so; an honest "don't build it here" is a valid, defensible outcome of discovery.
- **Tenant access blockers** — DLP or admin restrictions may prevent full assessment; document any unverifiable items as open risks for the build phase.
