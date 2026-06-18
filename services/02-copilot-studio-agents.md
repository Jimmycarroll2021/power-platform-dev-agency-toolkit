---
title: "Service 02 — Copilot Studio Agents"
description: "Design and delivery of Microsoft Copilot Studio agents: topics, knowledge sources, generative orchestration, and agent flows integrated into Power Platform."
category: service
related:
  - ../playbooks/copilot-studio-agent.md
  - ../playbooks/agent-flow-workflow.md
  - ../checklists/copilot-studio-readiness.md
  - ../agents/copilot-studio-agent.md
  - ../docs/copilot-studio-guide.md
  - ../power-platform/copilot-studio-patterns.md
---

# Service 02 — Copilot Studio Agents

We design, build, and harden Microsoft Copilot Studio agents that answer real questions, take real actions, and stay in scope — grounded in your data and integrated with Power Platform.

## Business Problem & Outcome

Teams are drowning in repetitive questions and manual lookups: HR policy queries, IT how-tos, order status checks, internal knowledge that lives in scattered SharePoint sites and PDFs. Generic chatbots hallucinate, can't take action, and erode trust on first contact.

This service delivers a **purpose-built Copilot Studio agent** that is grounded in your authoritative content, escalates cleanly to humans, and can act through Power Automate and connectors.

Measurable outcomes we target:

- **Deflection rate** — percentage of inbound queries fully resolved by the agent without human handoff (baseline vs. post-launch).
- **Containment & escalation quality** — clean handoff with full conversation context, not dead-ends.
- **Time-to-answer** — seconds instead of hours/days for the long tail of routine questions.
- **Grounding accuracy** — answers traceable to a citable source, with measured hallucination/incorrect-answer rate.
- **Cost per resolved conversation** — modelled against the per-message consumption (see Licensing below).

## Ideal Client Profile

Buyers and triggers/signals that indicate fit:

- A **service desk, HR shared-services, or contact-centre** team handling high volumes of repetitive, knowledge-based queries.
- Existing Microsoft 365 / Power Platform tenant, content already in **SharePoint, Dataverse, or public web** that can serve as knowledge sources.
- A failed or stalled **first-generation chatbot** (classic Power Virtual Agents, rule-only bot) that needs generative grounding and action-taking.
- Desire to surface the agent in **Microsoft Teams, a website, or as a custom-engine/declarative agent** in Microsoft 365 Copilot.
- A sponsor who can name a **measurable deflection or response-time KPI** and provide subject-matter access to validate answers.

Poor-fit signals: no curated/authoritative content to ground on; expectation of fully autonomous decision-making with no human-in-the-loop; hard real-time latency SLAs better served by a deterministic API.

## Scope & Deliverables

Concrete artifacts produced in this engagement:

- **Agent definition** — name, persona, scope statement, tone/guardrail instructions, and orchestration mode (generative vs. classic topic routing).
- **Topics** — authored and/or generative topics covering the prioritised intents, with trigger phrases, conditions, variables, and message nodes.
- **Knowledge sources** — configured and tested grounding: SharePoint sites/libraries, Dataverse tables, public websites, and/or uploaded documents, with citation behaviour validated.
- **Agent flows / actions** — Power Automate-backed actions and agent flows for read/write operations (e.g. lookup order status, log a ticket), built per the agent-flow playbook.
- **Authentication & channel setup** — end-user authentication configuration and publishing to the agreed channel(s): Teams, custom website, or M365 Copilot.
- **Escalation & fallback design** — human handoff path, "I don't know" fallback, and out-of-scope deflection.
- **Conversation transcripts & analytics baseline** — enabling Copilot Studio analytics and (optionally) Application Insights for monitoring.
- **Test pack & UAT script** — representative question set with expected-answer grading.
- **Handover documentation** — maker runbook, content-update process, and licensing/consumption notes.

## Out of Scope

Clear boundaries (each is available as a separate service or change request):

- Building the **underlying knowledge content** (writing the KB articles, restructuring SharePoint, data cleansing). We consume existing authoritative content; content authoring is a separate workstream.
- **Custom connector** development for non-standard back-end systems (see Service 13 — Integration Platform).
- **Dataverse data model** design beyond what the agent needs to read/write (see Service 03 — Dataverse Advanced).
- **AI Builder custom model** training (document extraction, classification) — separate AI Builder scope.
- **Voice / IVR / telephony** integration and full contact-centre platform (e.g. Dynamics 365 Customer Service) configuration.
- Ongoing **content moderation, retraining, and answer curation** post-launch (covered by Service 11 — Managed Support).

## Engagement Model & Effort

Indicative effort by T-shirt size (assumes a single tenant, content already exists, and one primary channel):

| Size | Indicative effort | Typical scope |
|------|-------------------|---------------|
| **S** | 5–10 days | Single-purpose FAQ/knowledge agent, 1–2 knowledge sources, no write actions, one channel. |
| **M** | 12–25 days | Multi-topic agent, 3–5 knowledge sources, 2–4 agent flow actions, authentication, Teams + web channels, analytics. |
| **L** | 30–60+ days | Multi-agent or multi-domain solution, generative orchestration with many actions, complex auth, write-back to line-of-business systems, full monitoring and ALM. |

Day ranges are indicative planning bands only — confirm against actual scope and complexity.

**Phases:**

1. **Discovery & framing** — intents, content audit, KPI definition, guardrails. (See `../templates/prd-template.md`.)
2. **Design** — agent definition, topic/orchestration approach, knowledge-source map, action design.
3. **Build & ground** — author topics, wire knowledge sources, build agent flows, configure auth/channels.
4. **Test & UAT** — run the test pack, measure grounding accuracy and deflection, tune instructions.
5. **Publish & handover** — production publish, analytics baseline, runbook, enablement.

**Team roles** (link to agent briefs):

- `../agents/copilot-studio-agent.md` — lead agent designer/builder.
- `../agents/power-automate-agent.md` — agent flow and action automation.
- `../agents/solution-architect.md` — orchestration approach, integration design, ALM fit.
- `../agents/licensing-capacity-agent.md` — message-pack sizing and consumption modelling.
- `../agents/security-governance-agent.md` — DLP, auth, data-residency, and grounding-source governance.
- `../agents/qa-test-agent.md` — test pack authoring and UAT grading.

## Indicative Pricing

Planning ranges only — **indicative; confirm current rates** before any commitment. These are not quotes and do not represent a client commitment.

- **Day-rate band:** mid-market Power Platform specialist day rate (indicative — confirm current rates). Use `node packages/cli/dist/index.js estimate-licensing` to model platform consumption alongside delivery effort.
- **S engagement:** fixed-price preferred — well-bounded, low variability.
- **M engagement:** fixed-price for a defined topic/action set; change requests for added topics or actions.
- **L engagement:** time-and-materials (T&M) or phased fixed-price by milestone, given orchestration and integration variability.

Recommendation: **fixed-price** where scope (topics, knowledge sources, actions, channels) is firmly bounded; **T&M** where generative orchestration scope or back-end integration is exploratory. Platform consumption (Copilot Studio messages) is a **separate run-cost line item** the client owns — never roll it into the build price.

## Licensing & Capacity Considerations

Verify all figures against current Microsoft licensing documentation — these change frequently. Each item below is a planning warning, not a confirmed price.

- **Copilot Studio messages / capacity packs** — Copilot Studio is consumption-based: each interaction consumes "messages" from a tenant message pack (or pay-as-you-go via Azure). Generative answers, knowledge lookups, and agent actions consume **different message quantities** per the published consumption rate card. *(Needs verification against current Microsoft docs — message multipliers and pack sizes change.)* Model expected volume × consumption rate before quoting any run cost.
- **Generative orchestration & knowledge** — answers grounded on knowledge sources and generative actions typically consume **more messages per turn** than a simple authored-topic response. *(Needs verification against current Microsoft docs.)*
- **Premium connectors** — any agent flow that uses a **premium connector** (e.g. custom connector, HTTP, many LOB connectors) requires appropriate Power Platform / premium licensing for the flow's run context. *(Needs verification — confirm which connectors are premium for the target tenant.)*
- **Power Automate / agent flows** — agent flows run as cloud flows and are subject to **Power Platform request limits and flow licensing**; high-frequency actions may need Power Automate Premium or per-flow capacity. *(Needs verification against current Microsoft docs.)*
- **AI Builder credits** — if the agent triggers AI Builder models (e.g. document processing), those consume **AI Builder credits** separately from Copilot Studio messages. *(Needs verification.)*
- **Dataverse capacity** — storing conversation transcripts, custom tables, or write-back data consumes **Dataverse database/file/log capacity**. Confirm available tenant capacity. *(Needs verification.)*
- **Microsoft 365 Copilot publishing** — publishing as a declarative/custom-engine agent into M365 Copilot may have **separate licensing prerequisites** for end users. *(Needs verification against current Microsoft docs.)*
- **Authentication** — end-user authentication options (no auth / Microsoft / manual OAuth) affect both security posture and which data the agent can ground on. Confirm with the client's identity team.

Run `node packages/cli/dist/index.js estimate-licensing -c usd` (or `gbp`/`eur`) to produce a planning estimate; treat its output as indicative and reconcile against current Microsoft pricing.

## Delivery Approach

Follow the documented playbooks step-by-step:

- **`../playbooks/copilot-studio-agent.md`** — primary playbook: agent definition, topic authoring, knowledge-source configuration, orchestration mode, channel publishing, and analytics.
- **`../playbooks/agent-flow-workflow.md`** — building agent flows and Power Automate-backed actions the agent invokes, including input/output binding and error handling.

Reusable design patterns are catalogued in **`../power-platform/copilot-studio-patterns.md`** — grounding strategies, topic vs. generative orchestration trade-offs, fallback design, and conversation-state handling.

ALM note: build agents inside a Dataverse solution where possible so they can be exported and promoted through environments — see `../power-platform/copilot-studio-patterns.md` for solution-aware authoring guidance.

## Quality Gates

Each gate must pass before the next phase. Use the checklists:

- **`../checklists/copilot-studio-readiness.md`** — primary gate: agent scope, grounding sources validated, escalation path tested, authentication configured, analytics enabled, and consumption modelled.
- **`../checklists/qa.md`** — test-pack execution, expected-answer grading, regression on topics and actions.
- **`../checklists/scope-validation.md`** — confirm delivered topics/actions match the agreed scope before UAT sign-off.
- **`../checklists/deployment.md`** — production publish and channel cut-over checks.

## Related Agents, Docs & Patterns

- **Agents:** `../agents/copilot-studio-agent.md`, `../agents/power-automate-agent.md`, `../agents/solution-architect.md`, `../agents/licensing-capacity-agent.md`, `../agents/security-governance-agent.md`, `../agents/qa-test-agent.md`
- **Docs:** `../docs/copilot-studio-guide.md`, `../docs/power-automate-guide.md`, `../docs/licensing-and-capacity.md`, `../docs/governance-and-coe.md`
- **Patterns:** `../power-platform/copilot-studio-patterns.md`, `../power-platform/power-automate-patterns.md`, `../power-platform/solution-patterns.md`
- **Templates:** `../templates/prd-template.md`, `../templates/solution-design-template.md`, `../templates/scope-of-work-template.md`, `../templates/risk-register-template.md`

## Risks & Assumptions

**Assumptions:**

- The client owns authoritative, reasonably structured content suitable for grounding (SharePoint/Dataverse/web/docs).
- A subject-matter expert is available to validate answer correctness during UAT.
- The target tenant has — or will procure — sufficient Copilot Studio message capacity and any required premium/Power Automate licensing.
- One primary channel is in scope per size band; additional channels are change requests.

**Risks:**

- **Grounding quality** — poor or contradictory source content produces wrong/low-confidence answers. Mitigation: content audit in discovery; restrict knowledge sources to curated material.
- **Consumption cost overrun** — generative + action-heavy conversations consume more messages than forecast. Mitigation: volume modelling, analytics baseline, and per-turn consumption monitoring; treat run cost as a client-owned line item.
- **Hallucination / trust** — generative answers may invent details. Mitigation: instruction guardrails, citation-required configuration, fallback-to-human, and measured accuracy gating in QA. *(Behaviour of generative features evolves — needs verification against current Microsoft docs.)*
- **Licensing/preview drift** — message multipliers, pack sizes, and feature availability change. Mitigation: verify against current Microsoft docs before quoting; document the verification date.
- **Scope creep via topics** — "just one more intent" expands effort. Mitigation: scope validation gate and a defined topic/action count per size band.
- **Authentication & data exposure** — misconfigured auth can expose grounded data. Mitigation: security-governance review of auth mode, DLP, and grounding-source permissions before publish.
