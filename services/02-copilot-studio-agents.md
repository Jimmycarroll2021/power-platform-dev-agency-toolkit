---
title: "Service 02 — Copilot Studio Agents"
description: "Design and delivery of Microsoft Copilot Studio agents: topics, knowledge sources, generative orchestration, and agent flows integrated into Power Platform."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity
  - https://learn.microsoft.com/en-us/ai-builder/endofaibcredits
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/faq
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication
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
- **Cost per resolved conversation** — modelled against Copilot Studio consumption (billed in **Copilot Credits** since 1 Sept 2025, replacing the former "messages" unit; see Licensing below) ([Copilot Studio billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).

## Ideal Client Profile

Buyers and triggers/signals that indicate fit:

- A **service desk, HR shared-services, or contact-centre** team handling high volumes of repetitive, knowledge-based queries.
- Existing Microsoft 365 / Power Platform tenant, content already in **SharePoint, Dataverse, or public web** that can serve as knowledge sources.
- A failed or stalled **first-generation chatbot** (classic Power Virtual Agents — now termed "classic chatbots," the predecessor to Copilot Studio and without generative AI support; rule-only bot) that needs generative grounding and action-taking ([Upgrade to Copilot Studio unified authoring](https://learn.microsoft.com/en-us/microsoft-copilot-studio/unified-authoring-conversion)).
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

Recommendation: **fixed-price** where scope (topics, knowledge sources, actions, channels) is firmly bounded; **T&M** where generative orchestration scope or back-end integration is exploratory. Platform consumption (Copilot Studio Copilot Credits) is a **separate run-cost line item** the client owns — never roll it into the build price ([Copilot Studio billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).

## Licensing & Capacity Considerations

Verify all figures against current Microsoft licensing documentation — these change frequently. Figures below are verified as of 2026-06-19 against Microsoft Learn (2026-H1 platform state); treat them as planning inputs, not quotes.

- **Copilot Studio Copilot Credits / capacity packs** — Copilot Studio is consumption-based. **As of 1 September 2025 the billing unit changed from "messages" to "Copilot Credits"** — the common currency across Copilot Studio capabilities. Capacity is sold as **tenant-wide Copilot Credit capacity packs of 25,000 credits at US$200/pack/month**, or via **pay-as-you-go** by linking an Azure subscription billing policy in the Power Platform admin center (≈ US$0.01 per Copilot Credit on PAYG). Capacity is pooled across the tenant and resets monthly (no roll-over) ([Copilot Studio billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management); [Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing); [Manage Copilot Studio credits and capacity](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity)). Model expected volume × consumption rate before quoting any run cost.
- **Consumption rates by feature** — different feature types consume different credit quantities per the published rate card: **classic answer = 1, generative answer = 2, agent action = 5, tenant graph grounding = 10, agent flow actions = 13 per 100 actions**; AI/prompt tools bill per 1,000 tokens (basic/standard/premium tiers). A single interaction can combine several feature types — e.g. a tenant-graph-grounded generative reply ≈ 12 credits (10 grounding + 2 generative). Grounded/generative turns therefore cost materially more than a static authored-topic answer ([Copilot Studio billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).
- **Microsoft 365 Copilot included usage** — for employee-facing (B2E) scenarios, agents invoked by a user **licensed with Microsoft 365 Copilot** do not draw down the Copilot Studio pack/meter for classic answers, generative answers, or tenant-graph grounding (subject to fair-use limits) ([Copilot Studio billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).
- **Premium connectors** — using **premium, on-premises, or custom connectors** (e.g. SQL Server, Azure, HTTP, Dynamics 365, many LOB connectors) requires a standalone Power Apps/Power Automate plan; standard Microsoft 365 (E3/E5) licences do not cover them. Within an app context, a Power Apps licence covers premium/custom connectors for in-context flows; isolated flows need a standalone Power Automate Premium or process licence. Confirm which connectors are premium for the target tenant against the connector reference ([Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq); [List of premium connectors](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors)).
- **Agent flows vs. Power Automate cloud flows** — **agent flows created natively in Copilot Studio are billed through Copilot Studio consumption (Copilot Credits) and do not require an individual Power Automate licence** — this differs from classic Power Automate cloud flows, which do require Power Automate licensing. When prepaid Copilot Credits are exhausted, **agent-flow enforcement blocks new flow runs** (the rest of the agent keeps working). Converting a cloud flow to an agent flow is a one-way change that moves billing to Copilot Credits ([Agent flows overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview); [Copilot Studio billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).
- **AI Builder credits** — **AI Builder credits are being progressively retired (announced Oct 2025) and replaced by Copilot Credits.** AI Builder features are unaffected and continue to run on Copilot Credits. In apps/flows a dual-mode model applies (AI Builder credits consumed first, then Copilot Credits); within Copilot Studio agents and agent flows, AI Builder actions consume Copilot Credits only. Seeded AI Builder credits are honoured through 1 Nov 2026 (or the contract term) ([End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits); [AI Builder licensing and Copilot Credits](https://learn.microsoft.com/en-us/ai-builder/message-management)).
- **Dataverse capacity** — storing conversation transcripts, custom tables, or write-back data consumes **Dataverse database / file / log capacity**, tracked separately under the capacity-based storage model (database and file entitlements pool across Dataverse and finance-and-operations; log is Dataverse-only). The default environment includes 3 GB database, 3 GB file, and 1 GB log. Audit and plug-in trace logs count against log capacity. Confirm available tenant capacity in the admin center before storing transcripts ([Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage)).
- **Microsoft 365 Copilot publishing** — to **ground an agent in organizational data**, the tenant needs either Microsoft 365 Copilot licences or Copilot Studio pay-as-you-go (Copilot Credits) enabled; a Copilot Studio trial can build/test but cannot publish. End users consuming a declarative agent need a Microsoft 365 Copilot add-on or Copilot Chat access via an eligible Microsoft 365 plan ([Microsoft 365 Copilot extensibility FAQ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/faq); [Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)).
- **Authentication** — end-user authentication offers three options: **No authentication, Authenticate with Microsoft (Entra ID, auto-configured, supports SSO), or Authenticate manually (Entra ID or generic OAuth2)**. Teams and Microsoft 365 Copilot channels require an authenticated option (anonymous is not allowed); a DLP policy can force authentication and disable the "No authentication" option. Auth mode affects both security posture and which data the agent can ground on — confirm with the client's identity team ([Configure user authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication)).

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
- The target tenant has — or will procure — sufficient Copilot Studio Copilot Credit capacity and any required premium/Power Automate licensing.
- One primary channel is in scope per size band; additional channels are change requests.

**Risks:**

- **Grounding quality** — poor or contradictory source content produces wrong/low-confidence answers. Mitigation: content audit in discovery; restrict knowledge sources to curated material.
- **Consumption cost overrun** — generative + action-heavy conversations consume more Copilot Credits than forecast (and at 125% of prepaid capacity, custom agents are disabled until capacity is increased). Mitigation: volume modelling, analytics baseline, per-turn consumption monitoring, per-agent monthly caps in the admin center, and pay-as-you-go as overage safety net; treat run cost as a client-owned line item ([Copilot Studio billing rates — overage enforcement](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).
- **Hallucination / trust** — generative answers may invent details. Mitigation: instruction guardrails, citation-required configuration, fallback-to-human, and measured accuracy gating in QA. Generative-feature behaviour evolves; confirm current guidance against [Configure high-quality instructions for generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-mode-guidance).
- **Licensing/preview drift** — credit consumption rates, pack sizes, and feature availability change (e.g. the 2025 move from "messages" to Copilot Credits and the retirement of AI Builder credits). Mitigation: verify against current Microsoft docs before quoting; document the verification date (this file: verified 2026-06-19, 2026-H1) ([Copilot Studio billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).
- **Scope creep via topics** — "just one more intent" expands effort. Mitigation: scope validation gate and a defined topic/action count per size band.
- **Authentication & data exposure** — misconfigured auth can expose grounded data. Mitigation: security-governance review of auth mode, DLP, and grounding-source permissions before publish.
