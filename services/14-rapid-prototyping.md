---
title: "Service 14 — Rapid Prototyping"
description: "Time-boxed proof-of-concept development to validate a Power Platform idea, de-risk an approach, and produce a working demo with an estimate for the full build."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types
  - https://learn.microsoft.com/en-us/ai-builder/endofaibcredits
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention
related:
  - ../playbooks/canvas-app.md
  - ../agents/power-apps-agent.md
  - ../agents/solution-architect.md
  - ../templates/prd-template.md
  - ../checklists/scope-validation.md
  - ../docs/power-apps-guide.md
---

# Service 14 — Rapid Prototyping

Build a working, demonstrable proof-of-concept in days — not months — so a stakeholder can see, click, and decide before committing budget to a full build.

## Business Problem & Outcome

Decisions stall when stakeholders cannot picture the solution. Slide decks and wireframes are easy to argue with; a clickable app that runs against real-ish data is not. Rapid Prototyping converts a vague idea into a tangible artifact that proves (or disproves) feasibility fast and gives the business something concrete to react to.

**Pain this solves**

- "We've been talking about this for months but nobody can agree what it actually is."
- Budget approval is blocked because the sponsor cannot visualize ROI.
- The team is unsure whether Power Platform can even do the thing (a tricky connector, an AI Builder model, a Copilot Studio agent, a complex Dataverse relationship).
- A vendor or internal team wants to compare a low-code build against a custom-code estimate.

**Measurable outcomes**

- A working prototype demonstrable in a single sitting (target: usable demo within 3–10 elapsed working days).
- A go / no-go feasibility verdict on the riskiest assumption, backed by something that actually runs.
- A directional estimate (effort band + license/capacity flags) for the production build, accurate enough to gate a budget decision.
- Reduced discovery churn — fewer rounds of "what did you mean by…" because the prototype anchors the conversation.

## Ideal Client Profile

**Who buys this**

- Product owners or business sponsors who need to sell an idea internally and want a demo to do it.
- Innovation / digital teams running a backlog of candidate ideas that need cheap, fast triage.
- Architects or IT leads who need to de-risk one specific technical unknown before committing to an SOW.
- Existing clients between phases who have a "could we also…" idea worth a quick spike.

**Triggers / signals**

- "Can you just show me something?" / "I need it for the steering committee on Thursday."
- A new platform capability (AI Builder, Copilot Studio, a premium connector) the client wants to test against their data.
- Competing build options where a low-code prototype settles the architecture debate.
- A grant, pilot, or innovation budget with a short window and a demo deliverable.

## Scope & Deliverables

- **Working prototype** — a runnable canvas app, model-driven app, flow, or Copilot Studio agent (whichever fits the idea) covering the one or two scenarios that matter most. Built in a non-production / sandbox environment.
- **Demo script** — a short, step-by-step walkthrough the sponsor can run themselves or present, including sample data, the happy path, and the "here's the wow" moment.
- **Indicative estimate** — effort band (T-shirt size) for the production build, a list of what's faked vs. real in the prototype, and the licensing / capacity flags that will affect production cost (see [licensing-and-capacity checklist](../checklists/licensing-and-capacity.md)).
- **Feasibility note** — a one-page verdict on the riskiest assumption: confirmed, confirmed-with-caveats, or not feasible as imagined (with the alternative).
- **PRD seed** — a lightweight requirements outline using the [PRD template](../templates/prd-template.md) so a follow-on engagement starts warm.

## Out of Scope

- Production-ready code, error handling, accessibility hardening, or performance tuning. Prototype code is throwaway by default — say so explicitly.
- Real integrations to production systems of record (use mock/sample data or read-only sandbox connections).
- Security, DLP, ALM pipelines, governance sign-off, and formal testing — these belong to the production build, not the spike.
- Data migration, user training, hypercare, or support.
- Any commitment that the prototype will be "promoted" to production. If the client wants production-grade from day one, route to the relevant build service (e.g. [01-power-apps-pro-dev](01-power-apps-pro-dev.md)).

## Engagement Model & Effort

Fixed time-box, single demo at the end. Effort is deliberately capped — the discipline is in saying "no" to everything outside the core scenario.

| Size | Indicative effort | Typical shape |
|------|-------------------|---------------|
| **S** | 2–3 days | One screen / one flow / one feasibility question. Sample data only. Single demo. |
| **M** | 4–7 days | 2–3 connected scenarios, light Dataverse model, one premium capability tested (connector, AI Builder, or Copilot Studio). |
| **L** | 8–12 days | Multi-component concept (app + flow + agent), realistic data shape, two integration spikes, exec-ready demo. |

**Phases**

1. **Frame (0.5–1 day)** — lock the single riskiest assumption and the demo scenario. Anything not serving the demo is parked.
2. **Build (bulk of the time-box)** — iterative, daily check-ins; show progress, cut scope to protect the demo date.
3. **Demo & estimate (0.5–1 day)** — run the demo script, capture reactions, write the feasibility note and estimate.

**Team roles**

- [solution-architect](../agents/solution-architect.md) — frames the assumption, picks the minimum-viable architecture, sanity-checks the estimate.
- [power-apps-agent](../agents/power-apps-agent.md) — builds the canvas / model-driven prototype (see also [power-automate-agent](../agents/power-automate-agent.md), [copilot-studio-agent](../agents/copilot-studio-agent.md), or [ai-builder-agent](../agents/ai-builder-agent.md) depending on the idea).
- [licensing-capacity-agent](../agents/licensing-capacity-agent.md) — flags premium / capacity implications for the production estimate.

## Indicative Pricing

All figures are **indicative planning ranges, not quotes — confirm current rates** before sending anything to a client.

- **Day-rate band:** indicative blended rate in the region of the standard delivery band (confirm current agency rate card). Rapid Prototyping is usually billed at a single blended rate rather than split senior/junior, because it's a small, focused team.
- **S:** ~2–3 days. **M:** ~4–7 days. **L:** ~8–12 days. Multiply by the confirmed blended day rate for a planning figure.
- **Fixed-price vs T&M:** Rapid Prototyping suits **fixed-price** because the time-box *is* the scope guarantee — the client buys "a working demo by date X," and scope flexes to fit. Offer T&M only if the client insists on open-ended exploration, and cap it.
- Exclude license/capacity costs from the prototype fee — those land in the production estimate, not the spike (see licensing section below).

> Treat all of the above as planning ranges. Do not commit specific numbers to a client without confirming the current rate card and the exact scope.

## Licensing & Capacity Considerations

The prototype itself usually runs on sandbox / developer capacity, but the *production estimate* must surface every license trap the prototype touches. Flag these explicitly in the deliverable:

- **Premium connectors** — if the prototype uses any premium connector (e.g. SQL Server, HTTP, custom connectors, most third-party connectors), production users will need a **Power Apps Premium (per-user) or Per App Plan** license. Standard Microsoft 365 seeded licenses do **not** cover premium, on-premises, or custom connectors — a standalone Power Apps or Power Automate plan is required to access them. Confirmed against Microsoft Learn: [Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq).
- **Power Apps licensing** — confirm whether the production app needs Premium per-user vs Per App Plan, and how many seats. Both makers and end users who touch a premium connector need premium use rights. Exact per-user / per-app price points change — check the current [Power Apps pricing page](https://www.microsoft.com/en-us/power-platform/products/power-apps/pricing) and [licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq) before quoting.
- **AI Builder credits / Copilot Credits** — any AI Builder model (document processing, prediction, GPT prompts) consumes capacity. **The currency is changing:** AI Builder credits are being progressively retired and Copilot Credits become the go-forward currency. AI Builder Capacity Add-ons reached End of Sales on 2025-11-01 (only existing add-on customers can still buy/renew); seeded AI Builder credits in premium licenses end on 2026-11-01, after which Copilot Credits are required. AI Builder features in app/flow context consume AI Builder credits first, then fall back to Copilot Credits. Estimate monthly document/transaction volume and size the credit requirement accordingly. Confirmed against Microsoft Learn: [End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits) and [Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management). Exact rates per capability — see the [AI Builder capability rate table](https://learn.microsoft.com/en-us/ai-builder/administer-licensing).
- **Copilot Studio messages / credits** — Copilot Studio agents were metered by **messages**, but as of **2025-09-01 the common currency changed from messages to Copilot Credits** (no change to per-pack quantity or the pay-as-you-go rate). Capacity is sold as Copilot Credit capacity packs (25,000 credits/pack) or consumed pay-as-you-go via an Azure subscription. A prototype agent burns almost nothing; a deployed agent fielding real traffic needs a sized credit estimate. Confirmed against Microsoft Learn: [Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing) and [Manage Copilot Studio credits and capacity](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity). Pack price points change — confirm current rates before quoting.
- **Dataverse capacity** — Dataverse storage is metered across three types: **database**, **file**, and **log**. A prototype's tables are trivial, but flag expected production row counts and attachment volumes so storage capacity is in the production estimate. The first qualifying tenant gets a one-time default of 3 GB database, 3 GB file, and 1 GB log capacity; additional capacity accrues per qualifying license. Confirmed against Microsoft Learn: [Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage).
- **Power Automate** — premium / per-flow licensing applies if the production flows use premium connectors or run as standalone (non-app-triggered) flows. A standalone automated/scheduled flow using premium connectors needs either Power Automate Premium on the flow owner or a Power Automate **Process** (per-flow) license assigned to the flow itself; in-context flows associated with an app are covered by the app's license. Confirmed against Microsoft Learn: [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types).
- **Environment / DLP** — production will need a properly governed environment and a data policy (DLP); the prototype's sandbox almost certainly does not match it. Classic DLP policies classify connectors as **Business**, **Non-Business**, or **Blocked**, and resources can't mix connectors across groups. Note for 2026-H1: **Advanced Connector Policies (ACP)** are now generally available and replace the business/non-business model with a single allowlist policy per environment — factor the target tenant's policy model into the production design. Confirmed against Microsoft Learn: [Data policies overview](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention). Use [estimate-licensing](../docs/licensing-and-capacity.md) thinking and the CLI `estimate-licensing` command to produce a directional cost sheet.

Run the CLI to generate a starting estimate:

```bash
node packages/cli/dist/index.js estimate-licensing --currency usd --output ./licensing-estimate.md
```

> Every license/capacity number above is directional. Verify against the client's actual tenant entitlements and the current Microsoft licensing guide before quoting.

## Delivery Approach

Lean on the build playbooks, but stop at "demonstrable" — skip the production-hardening steps.

- For a canvas-app prototype, follow [../playbooks/canvas-app.md](../playbooks/canvas-app.md) through screen layout, data source binding, and a single end-to-end scenario. Skip the ALM, accessibility, and performance sections for the prototype.
- For a model-driven concept, see [../playbooks/model-driven-app.md](../playbooks/model-driven-app.md).
- For an automation spike, see [../playbooks/power-automate-cloud-flow.md](../playbooks/power-automate-cloud-flow.md).
- For a conversational-agent spike, see [../playbooks/copilot-studio-agent.md](../playbooks/copilot-studio-agent.md).
- For an AI document/prediction spike, see [../playbooks/document-processing-ai-builder.md](../playbooks/document-processing-ai-builder.md).

Daily check-in discipline: show working software every day, cut scope (not the date) when something runs long, and keep one screen "demo-perfect" rather than five screens half-done.

## Quality Gates

Rapid Prototyping has lighter gates than a production build, but two are non-negotiable:

- [scope-validation](../checklists/scope-validation.md) — confirm the single riskiest assumption and demo scenario are locked before the build starts, and that "out of scope" is written down and agreed.
- [licensing-and-capacity](../checklists/licensing-and-capacity.md) — before the estimate ships, walk the license/capacity flags so the production cost picture is honest.
- [qa](../checklists/qa.md) — apply a light pass: the demo path must run cleanly end-to-end on the demo machine. Full QA is explicitly deferred to the production build.

## Related Agents, Docs & Patterns

- **Agents:** [power-apps-agent](../agents/power-apps-agent.md), [solution-architect](../agents/solution-architect.md), [licensing-capacity-agent](../agents/licensing-capacity-agent.md), [copilot-studio-agent](../agents/copilot-studio-agent.md), [ai-builder-agent](../agents/ai-builder-agent.md)
- **Docs:** [power-apps-guide](../docs/power-apps-guide.md), [client-discovery](../docs/client-discovery.md), [delivery-model](../docs/delivery-model.md), [licensing-and-capacity](../docs/licensing-and-capacity.md)
- **Patterns:** [power-apps-patterns](../power-platform/power-apps-patterns.md), [dataverse-patterns](../power-platform/dataverse-patterns.md), [environment-strategy](../power-platform/environment-strategy.md)
- **Templates:** [prd-template](../templates/prd-template.md), [scope-of-work-template](../templates/scope-of-work-template.md), [client-proposal-template](../templates/client-proposal-template.md), [risk-register-template](../templates/risk-register-template.md)

## Risks & Assumptions

**Risks**

- **"Demo becomes production."** The single biggest risk. The prototype is throwaway by design; stakeholders will ask to "just go live with it." Mitigate by stating throwaway status in writing up front and pricing the real build separately.
- **Scope creep inside the time-box.** Each added "small" request erodes the demo date. The frame phase and a written out-of-scope list are the defence.
- **Hidden license cliff.** A capability that's free in the prototype (premium connector, AI Builder, Copilot Studio messages) can be a major recurring cost in production. The estimate must surface it — never let it be a post-build surprise.
- **Sample data masks real complexity.** Clean mock data hides messy production data, integration failures, and volume. Caveat the feasibility verdict accordingly.

**Assumptions**

- A sandbox / developer environment and the relevant trial or developer licenses are available for the build.
- One named sponsor can make the go / no-go decision and attend the demo.
- The riskiest assumption can be isolated and tested within the chosen time-box.
- The client accepts that prototype code, security, and ALM are out of scope and will be rebuilt for production.

> This is a feasibility-and-decision service, not a build service. If the client wants production from the outset, route to the matching build service and use this only to de-risk a specific unknown.
