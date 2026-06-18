---
title: "Service 13 — Integration Platform"
description: "Third-party system integrations for Power Platform: custom connectors, API management, and middleware patterns that connect Dataverse, apps, and flows to external systems securely and at scale."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/ai-builder/endofaibcredits
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing
  - https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification
related:
  - ../playbooks/custom-connector.md
  - ../playbooks/azure-function-integration.md
  - ../playbooks/microsoft-graph-integration.md
  - ../checklists/connectors-and-premium.md
  - ../agents/connector-integration-agent.md
  - ../docs/integration-patterns.md
  - ../power-platform/custom-connectors-patterns.md
---

# Service 13 — Integration Platform

Connect Power Platform to the rest of the enterprise — custom connectors, managed APIs, and middleware that move data reliably between Dataverse, canvas/model-driven apps, cloud flows, and third-party systems.

## Business Problem & Outcome

Most Power Platform deployments stall the moment they need to talk to a system that does not have a ready-made connector: a legacy ERP, a partner REST API, an on-prem SQL database, a bespoke line-of-business service, or a SaaS product behind OAuth. Teams either copy-paste data manually, build brittle one-off HTTP actions inside individual flows, or stand up shadow integrations no one can support.

This service replaces those patterns with a governed integration layer:

- **Reusable custom connectors** instead of duplicated HTTP actions scattered across flows.
- **A consistent authentication and secrets model** (Azure AD app registrations, OAuth 2.0, certificates, Key Vault) instead of credentials embedded in flow steps.
- **Middleware for heavy lifting** (Azure Functions, API Management) where Power Automate alone is the wrong tool — batching, transformation, long-running calls, throttling control.

**Measurable outcomes:**

- Eliminate manual re-keying of data between systems (target: zero manual sync steps for the integrated process).
- Reduce integration build time for the next system by reusing connector + auth patterns (target: 40–60% faster second integration).
- Cut integration-related flow failures via retry, throttling, and error-handling patterns (target: < 1% sustained failure rate on the integration surface).
- Provide a single supportable place to monitor, version, and revoke integrations.

## Ideal Client Profile

Organisations already invested in Power Platform that have hit an integration wall. Typical buyers:

- IT / digital teams running Power Apps + Power Automate who need to reach systems with **no standard connector**.
- Businesses with a **legacy ERP, finance, HR, or LOB system** (on-prem or cloud) that must feed or consume Dataverse data.
- Teams that have built **fragile HTTP-in-flow integrations** and need to consolidate them into supportable connectors.
- Partners/ISVs wanting to expose their API to a customer's Power Platform tenant cleanly.

**Triggers / signals you'll hear:**

- "There's no connector for system X."
- "We're pasting data between two systems every morning."
- "Our flow keeps failing because the API throttles us / times out."
- "Security flagged that credentials are sitting inside a flow."
- "We need this to call an on-prem database."

## Scope & Deliverables

Concrete artifacts delivered:

- **Custom connector(s)** — OpenAPI (Swagger) definition, authentication configuration, actions/triggers, response schemas, custom code (where needed), tested in Power Automate and Power Apps.
- **Authentication design** — Azure AD app registration(s), OAuth 2.0 / client-credential / certificate setup, scopes/permissions, admin-consent documentation. Secrets stored in Azure Key Vault where applicable.
- **Middleware components** (when justified) — Azure Functions for transformation, batching, fan-out/fan-in, or long-running orchestration; optional Azure API Management facade for rate limiting, versioning, and policy.
- **Connection references & environment variables** — parameterised so the integration promotes cleanly across Dev → Test → Prod without rewiring.
- **Error handling & resilience patterns** — retry policies, throttling/back-off handling, dead-letter / failure-capture, alerting.
- **Microsoft Graph integration** (where in scope) — app-only or delegated Graph calls for users, groups, mail, calendar, Teams.
- **Integration runbook** — how to monitor, rotate secrets, version the connector, and revoke access.
- **Solution packaging** — connectors and references shipped inside a managed/unmanaged solution for ALM.

## Out of Scope

Unless explicitly added to the Statement of Work:

- Building or modifying the **external/third-party system** itself (we integrate with its API as-is).
- **Full iPaaS replacement** (Logic Apps enterprise integration, BizTalk migration, large-scale ESB) — referable but a separate engagement.
- **Data migration** between systems as a one-time bulk load — see Service 09 (Migration & Upgrade).
- **Net-new app or flow development** beyond what's needed to prove the integration — see Service 01 / Service 04.
- **Production 24×7 monitoring & on-call** — see Service 11 (Managed Support).
- Procurement of premium licenses, Azure subscriptions, or third-party API credentials (client-provided).

## Engagement Model & Effort

Phased delivery. Effort is indicative and depends on the number of systems, auth complexity, and whether middleware is required.

| Size | Indicative effort | Typical content |
|------|-------------------|-----------------|
| **S** | 3–6 days | One custom connector, standard OAuth/API-key auth, no middleware, tested in one app/flow. |
| **M** | 7–15 days | 1–3 connectors or Graph integration, Key Vault secrets, retry/throttling patterns, connection references for ALM, light Azure Function. |
| **L** | 16–35+ days | Multiple connectors plus middleware (Functions + optional API Management), on-prem gateway, complex auth/cert rotation, end-to-end resilience and runbook. |

**Phases:**

1. **Discovery & integration mapping** — endpoints, auth model, data contracts, volumes, throttling limits, error semantics.
2. **Auth & connectivity foundation** — app registrations, Key Vault, on-prem data gateway (if needed), connectivity smoke test.
3. **Build** — connector definition(s), middleware, error handling, connection references / environment variables.
4. **Test & harden** — functional + failure-mode testing, throttling/back-off validation, security review.
5. **Package & handover** — solution packaging, runbook, monitoring setup.

**Team roles (link to agent briefs):**

- [Connector / integration specialist](../agents/connector-integration-agent.md) — lead build of connectors and middleware.
- [Solution architect](../agents/solution-architect.md) — integration architecture, contracts, and ALM fit.
- [Dataverse specialist](../agents/dataverse-agent.md) — where the integration reads/writes Dataverse.
- [Security & governance](../agents/security-governance-agent.md) — auth model, secrets, DLP, least privilege.
- [Licensing & capacity](../agents/licensing-capacity-agent.md) — premium connector and capacity implications.
- [QA / test](../agents/qa-test-agent.md) — functional and failure-mode verification.

## Indicative Pricing

> Planning ranges only — **indicative, confirm current rates** at proposal time. Not a quote and not a client commitment.

- **Day-rate band:** specialist integration engineering typically falls in a **mid-to-senior consulting day-rate band**; confirm the current agency rate card before quoting. This is an internal agency rate, not a Microsoft-published figure, so it can only be confirmed against the live rate card.
- **S (3–6 days):** small fixed-price package suits a single, well-understood connector.
- **M (7–15 days):** fixed-price if the API contract and auth model are confirmed in discovery; otherwise **T&M** with a capped estimate.
- **L (16–35+ days):** **T&M recommended** — middleware, on-prem gateway, and cert/secret rotation carry discovery risk that fixed-price tends to over-price or under-deliver.

**Pricing model guidance:** prefer fixed-price only after discovery has nailed down the external system's API, throttling limits, and auth. Where the third-party API is undocumented, unstable, or rate-limited in unknown ways, quote T&M with a not-to-exceed ceiling. Use [estimate-licensing](../templates/licensing-estimate-template.md) outputs and the `pp-agency estimate-licensing` command to model recurring license/Azure cost separately from build cost.

## Licensing & Capacity Considerations

> Integration work almost always crosses into **premium** territory. The lines below are verified against current Microsoft licensing as of 2026-06-19 (platform state 2026-H1); re-confirm at proposal time as Microsoft revises licensing periodically.

- **Premium connectors:** custom connectors, HTTP, Azure-based, and most non-Microsoft connectors are **premium**. A standalone Power Apps or Power Automate plan license is required to access all premium, on-premises, and custom connectors — every user who runs an app/flow using them needs **Power Apps Premium (per-user)** or **Power Apps Per-App** licensing, or the flow needs an appropriate **Power Automate Premium / Process** license. In-product licensing enforcement for these connectors began **April 1, 2025**. ([Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq))
- **Custom connectors are premium by definition** — even if the underlying API is free, the connector triggers premium licensing requirements for end users. ([Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq))
- **On-premises data gateway:** required for on-prem systems (SQL, file shares, legacy DBs). Microsoft confirms gateways "were a premium capability before the transition and they continue to be a premium capability" — size the gateway host and plan for HA if production-critical. ([Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq))
- **Power Platform request limits / API entitlements:** each license tier carries daily Power Platform request (PPR) limits — e.g. **40,000 requests/24h** for a Power Apps Premium / Power Automate Premium / Dynamics 365 enterprise user, **6,000** for Power Apps Per-App and Microsoft 365–seeded users, and **250,000** for a Power Automate Process / per-flow license. High-volume integrations can exhaust them; the **Power Platform Request capacity add-on** raises a user's or flow's limit by **+50,000 requests/24h** per add-on (stackable). Note all tenants are currently in a more-generous **transition period** until reporting reaches GA. Model expected call volume early. ([Requests limits and allocations](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations))
- **Azure costs (separate from Power Platform):** Azure Functions, API Management, Key Vault, and storage are billed on Azure consumption — **not** covered by Power Platform licenses. Budget these as recurring run-cost.
- **Dataverse capacity:** integrations that write to Dataverse consume **database, file, and log capacity** (the three Dataverse capacity-based storage types); high-volume sync can grow storage fast, and audit/plug-in-trace logs count against log capacity. Microsoft may suspend the service if entitlements are exceeded, so monitor usage and plan capacity (add-ons are sold per storage type). ([Dataverse capacity-based storage](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage))
- **AI Builder credits / Copilot Studio currency:** if the integration feeds AI Builder models or a Copilot Studio agent, those consume capacity that you must budget separately. **Note the late-2025 currency change:** Copilot Studio moved from "messages" to **Copilot Credits** on **September 1, 2025**, and Microsoft began a **progressive end of AI Builder credits** from **October 2025** — AI Builder features in apps/flows now consume remaining AI Builder credits first and then fall back to **Copilot Credits**, while agents and agent flows consume Copilot Credits only. Existing seeded AI Builder credit entitlements run until **November 1, 2026** (or contract term). Budget in Copilot Credits going forward. ([Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management), [End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits), [Copilot Studio billing and licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing))
- **DLP policies:** custom and premium connectors can be classified into Business / Non-Business / **Blocked** data groups by tenant Data Loss Prevention policy; a blocked connector cannot be saved in an app or flow. All Microsoft-owned premium connectors and third-party connectors can be blocked (core connectors like Dataverse cannot). Confirm the connector is allowed in the target environment before build. ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification))

Run `pp-agency estimate-licensing -c gbp` (or `usd`/`eur`) to produce a planning estimate, and treat all figures as indicative pending Microsoft confirmation.

## Delivery Approach

Follow the integration playbooks in order, picking the path that matches the target system:

1. **[Custom connector playbook](../playbooks/custom-connector.md)** — primary path: define OpenAPI, configure auth, build actions/triggers, test, and package.
2. **[Azure Function integration playbook](../playbooks/azure-function-integration.md)** — when middleware is needed for transformation, batching, long-running calls, or throttling control.
3. **[Microsoft Graph integration playbook](../playbooks/microsoft-graph-integration.md)** — for users, groups, mail, calendar, and Teams scenarios via Graph.

Parameterise connections so the integration promotes across environments — see [connection-references](../power-platform/connection-references.md) and [environment-variables](../power-platform/environment-variables.md). Package everything inside a solution per [dataverse-solution](../playbooks/dataverse-solution.md) and the [ALM pipeline](../playbooks/alm-pipeline.md).

## Quality Gates

Do not hand over until these pass:

- **[Connectors & premium checklist](../checklists/connectors-and-premium.md)** — connector definition, auth, premium/licensing impact, DLP allow-listing.
- **[QA checklist](../checklists/qa.md)** — functional and failure-mode testing (including throttling and timeout paths).
- **[Licensing & capacity checklist](../checklists/licensing-and-capacity.md)** — premium license counts, request limits, Azure run-cost, Dataverse capacity.
- **[DLP & governance checklist](../checklists/dlp-and-governance.md)** — connector classification and policy alignment.
- **[Deployment checklist](../checklists/deployment.md)** — promotion across environments with connection references intact.

## Related Agents, Docs & Patterns

**Agents**

- [connector-integration-agent](../agents/connector-integration-agent.md) — build lead for connectors and middleware.
- [solution-architect](../agents/solution-architect.md) — integration architecture and contracts.
- [security-governance-agent](../agents/security-governance-agent.md) — auth, secrets, DLP.
- [licensing-capacity-agent](../agents/licensing-capacity-agent.md) — premium and capacity modelling.

**Docs**

- [integration-patterns](../docs/integration-patterns.md) — patterns for Graph, REST, polling vs webhook, error handling.
- [connectors-guide](../docs/connectors-guide.md) — connector types, premium boundaries, and selection guidance.

**Power Platform patterns**

- [custom-connectors-patterns](../power-platform/custom-connectors-patterns.md) — connector definition, auth, and policy templates.
- [connection-references](../power-platform/connection-references.md) — environment-independent connections.
- [environment-variables](../power-platform/environment-variables.md) — parameterising endpoints and keys.
- [monitoring-and-telemetry](../power-platform/monitoring-and-telemetry.md) — observability for the integration surface.

**Templates**

- [solution-design-template](../templates/solution-design-template.md) — capture the integration SDD.
- [technical-design-template](../templates/technical-design-template.md) — connector and middleware design detail.
- [risk-register-template](../templates/risk-register-template.md) — track integration risks.
- [scope-of-work-template](../templates/scope-of-work-template.md) — lock scope and out-of-scope boundaries.

## Risks & Assumptions

**Risks:**

- **Third-party API instability** — undocumented behaviour, breaking changes, or unannounced throttling can blow the estimate. Mitigate with discovery spikes and T&M ceilings.
- **Premium licensing surprise** — clients underestimate that custom/premium connectors require per-user or per-app licensing for everyone who touches the integration. Surface cost early.
- **Throttling & request limits** — high-volume integrations can hit Power Platform request entitlements or the external API's rate limits; design back-off and consider middleware batching.
- **Secret/credential lifecycle** — expiring secrets or certificates cause silent production failures; enforce Key Vault + rotation runbook.
- **On-prem gateway as single point of failure** — plan HA for production-critical on-prem connectivity.
- **DLP blocks** — tenant DLP policy may prohibit the connector in the target environment; confirm before build.

**Assumptions:**

- The client provides API documentation, sandbox/test credentials, and any required Azure subscription and admin consent.
- The external system exposes a usable API (REST/SOAP/Graph) or supported data source; no changes to that system are required from us.
- Required premium Power Platform licenses and Azure capacity are procured by the client.
- A non-production environment is available for build and test before any production promotion.
- Network access (firewall rules, gateway, IP allow-listing) to the external system can be arranged within the engagement window.
