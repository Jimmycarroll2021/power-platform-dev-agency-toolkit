---
title: "Service 05 — Power Pages Portals"
description: "External-facing portal development on Power Pages — site configuration, Liquid templates, web roles, and Dataverse-backed authenticated experiences."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-pages/admin/capacity-management
  - https://learn.microsoft.com/en-us/power-pages/go-live/assign-licensing
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
  - https://learn.microsoft.com/en-us/entra/external-id/external-identities-pricing
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pages
related:
  - ../playbooks/power-pages-site.md
  - ../power-platform/power-pages-patterns.md
  - ../docs/power-pages-guide.md
  - ../agents/power-apps-agent.md
  - ../checklists/qa.md
---

# Service 05 — Power Pages Portals

Build secure, branded, externally-facing web portals on Power Pages that surface Dataverse data to authenticated and anonymous users — without standing up a bespoke web stack.

## Business Problem & Outcome

Organisations frequently need to expose a slice of internal business data and processes to people *outside* the tenant — customers, partners, citizens, applicants, members. The usual options are expensive custom web apps (long build, ongoing maintenance, separate auth and hosting) or insecure spreadsheet-and-email workflows.

Power Pages closes that gap: a low-code portal that reads and writes directly to Dataverse, enforces row-level security through web roles and table permissions, and ships with a CMS, templating engine (Liquid), and identity provider integration.

**Pain this solves:**
- No external-facing channel for case submission, applications, registrations, or self-service lookups.
- Manual intake (email, PDF, phone) that re-keys data into internal systems.
- Custom portals that are slow to change, costly to host, and hard to secure.
- Inconsistent branding and no governed publishing workflow.

**Measurable outcomes:**
- Reduced manual intake handling time (target: 40–70% fewer re-keyed records).
- Faster turnaround on external submissions (self-service replaces ticket queues).
- Auditable, permission-scoped data access for external users.
- A single source of truth — portal writes land directly in Dataverse, no integration middleware.

## Ideal Client Profile

Who buys this, and the signals that they need it:

- **Mid-market and enterprise** already on Dataverse / model-driven apps wanting to extend a process outward.
- **Public sector / not-for-profit** needing citizen- or member-facing self-service.
- **B2B services** with partner or supplier portals (order status, document exchange, onboarding).

**Triggers / signals:**
- "We need customers to submit X themselves instead of emailing us."
- An existing internal model-driven app whose data needs a controlled external view.
- A failed or stalled custom-portal project that is too costly to maintain.
- Compliance pressure to remove uncontrolled email/PDF intake.
- A requirement for authenticated external login (Azure AD B2C, local auth, or social providers).

## Scope & Deliverables

Concrete artifacts delivered in a typical engagement:

- **Power Pages site provisioned** in the target environment (template or blank starter) with the correct base configuration and bootstrap version recorded.
- **Information architecture:** sitemap, web pages, page hierarchy, navigation, and redirects.
- **Liquid templates** for web templates, page templates, and content snippets — branded to client style guide.
- **Web forms / multi-step forms** (or Power Pages basic/advanced forms) bound to Dataverse tables.
- **Lists / views** surfacing Dataverse records with search, filter, and pagination.
- **Web roles** defined for each external persona (e.g. Anonymous, Authenticated, Partner, Admin).
- **Table permissions** mapping each web role to row-level Dataverse access (Global / Contact / Account / Parent scope) — least privilege by default.
- **Authentication configuration** for the chosen identity provider(s), including registration/invite flow.
- **Site settings, content snippets, and environment-specific configuration** captured as code/configuration, not click-ops.
- **Theme and responsive styling** verified across breakpoints and major browsers.
- **Deployment package** — site configuration exported and moved through environments via the Power Platform CLI (`pac pages download` / `pac pages upload`, formerly `pac powerpages` / `pac paportal`) with deployment profiles, or packaged inside a managed solution. ([pac pages command reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pages))
- **Documentation:** solution design (see ../templates/solution-design-template.md), runbook, and handover notes.

## Out of Scope

Clear boundaries to prevent scope creep:

- Net-new Dataverse data model design beyond what the portal needs — that is Service 03 (Dataverse Advanced). Minor table/column additions for portal-only fields are in scope.
- Complex back-office automation triggered by portal writes — handled as Power Automate work (Service 04).
- Bespoke front-end frameworks (full React/Angular SPA) hosted outside Power Pages.
- Payment processing / e-commerce checkout beyond a basic redirect to an external gateway (the gateway integration is a separate workstream).
- Penetration testing and formal security certification (can be added as a separate engagement; see Service 15 — Audit & Compliance).
- Content authoring / copywriting and translation — client supplies copy unless contracted separately.
- Power BI report embedding beyond a standard embed component (deeper analytics is Service 06).

## Engagement Model & Effort

Phased delivery. Effort given as indicative T-shirt sizes — confirm against discovery findings.

| Size | Indicative effort | Typical shape |
|------|-------------------|---------------|
| **S** | ~5–10 days | Single-persona portal, one or two forms, anonymous + one authenticated role, light branding. |
| **M** | ~12–25 days | Multiple personas, several forms/lists, custom Liquid templates, IdP integration, multi-step workflows. |
| **L** | ~30–60+ days | Multi-portal or multi-region, complex web-role matrix, deep integrations, custom components, full ALM pipeline. |

*(Indicative planning ranges only — scope and team seniority change these materially.)*

**Phases:**
1. **Discovery & design** — personas, data exposure model, IA, auth strategy, security model. Use the discovery and PRD tooling (`pp-agency discovery`, `pp-agency generate-prd`).
2. **Build** — site config, templates, forms, lists, web roles, table permissions.
3. **Integrate & secure** — IdP wiring, table-permission hardening, DLP review.
4. **QA & UAT** — cross-browser, responsive, security/permission testing, accessibility.
5. **Deploy & handover** — environment promotion, go-live, runbook, support transition.

**Team roles** (link to agent briefs — generate with `pp-agency agent-brief`):
- Lead build / portal developer → ../agents/power-apps-agent.md
- Data model & permission scoping → ../agents/dataverse-agent.md
- Security & identity → ../agents/security-governance-agent.md
- Licensing & capacity sizing → ../agents/licensing-capacity-agent.md
- Deployment / ALM → ../agents/alm-deployment-agent.md
- QA → ../agents/qa-test-agent.md

## Indicative Pricing

> These are **indicative planning ranges, not quotes or commitments**. Confirm current day rates and the final fixed price after discovery.

- **Day-rate band:** senior Power Platform consultant day rate applies — use your current agency rate card. *(Indicative — confirm current rates.)*
- **S engagement:** ~5–10 days of effort.
- **M engagement:** ~12–25 days of effort.
- **L engagement:** ~30–60+ days of effort.

**Commercial model:**
- **Fixed price** suits S/M engagements with a tight, validated scope (see ../checklists/scope-validation.md). Carry a contingency for IdP and permission-model complexity.
- **Time & materials** suits L engagements, evolving scope, or where the data model is still in flux.

Run `pp-agency estimate-licensing` and produce a client proposal from ../templates/client-proposal-template.md. The platform/licence cost is **separate** from professional services and is the client's ongoing run cost.

## Licensing & Capacity Considerations

Power Pages licensing is distinct from Power Apps and changes regularly — **verify everything below against current Microsoft licensing docs before quoting.** (Verified 2026-06-19 against Microsoft Learn; platform state 2026-H1.)

- **Power Pages is licensed by usage, not by maker seat.** The current model is **per-website capacity** metered as **authenticated MAU (monthly active users) per site/month** and **anonymous MAU per site/month** — i.e. unique users, *not* logins or page views (the old logins/page-views metric is the now-retired **legacy** model and is no longer available for purchase). Authenticated capacity is sold in packs of **100 users**; anonymous capacity in packs of **500 users**. A pay-as-you-go (Azure-metered) option also exists, but you cannot mix subscription and pay-as-you-go in the same environment. ([Power Platform licensing FAQs — Power Pages](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq#power-pages), [Manage and monitor capacity](https://learn.microsoft.com/en-us/power-pages/admin/capacity-management))
- **Authenticated vs anonymous** capacity is metered separately and managed/assigned at the environment level — sizing depends on your real persona mix. Over-provisioning wastes spend; under-provisioning leads to overage. Note: if an anonymous user signs in within the same UTC day they are counted only as authenticated (not double-counted), and bot/crawler hits on anonymous pages aren't counted. ([Power Platform licensing FAQs — Power Pages](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq#power-pages))
- **Dataverse capacity:** every portal record write/read consumes Dataverse **database, file, and log** storage from the tenant capacity entitlement (database and file are pooled at tenant level; log is tracked separately). External-facing portals can grow storage fast — size and monitor. Power Pages capacity packs *do* include some Dataverse allowance accrued to the tenant (per Microsoft's licensing FAQ, each authenticated-user pack and each anonymous-user pack carries an included Dataverse database/file allotment), so check the FAQ before buying standalone Dataverse add-ons. ([Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage), [Power Platform licensing FAQs — Power Pages](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq#power-pages))
- **Premium connectors / Power Automate:** any flow triggered by portal activity that touches a premium connector requires appropriate Power Automate licensing. For automated/scheduled flows the **flow owner's** license context applies (Power Automate Premium per-user), or the flow can carry a **Process / per-flow** license that lets anyone use it regardless of their own licence. Portal end users do **not** carry Power Apps Premium / Per-App licences, but the back-office automation must be licensed. ([Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types))
- **AI Builder:** if the portal triggers AI Builder (e.g. form/document processing on submitted files), that consumes capacity from the tenant pool. As of the November 2025 transition, AI Builder in Power Apps / cloud flows consumes **AI Builder credits first, then Copilot Credits** when AI Builder credits are absent or exhausted (in a Copilot Studio agent context it always consumes Copilot Credits). Credits don't roll over month to month — budget and monitor separately. ([Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management))
- **Copilot Studio:** if a Copilot Studio agent is embedded in the portal, consumption is billed in **Copilot Credits** — as of 1 September 2025 the common currency changed from "messages" to Copilot Credits, available via prepaid capacity packs or pay-as-you-go Azure meters, separate from Power Pages capacity and not rolled over month to month. ([Billing rates and management — Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management))
- **Identity provider costs:** the current CIAM provider is **Microsoft Entra External ID** (Azure AD B2C is the legacy predecessor and is being superseded). Entra External ID is billed by **monthly active users (MAU)** outside Power Platform, with the first **50,000 MAU free** and additional MAU charged per user; premium add-ons (e.g. SMS authentication) are charged separately. Confirm the current per-MAU rate on the official pricing page before quoting. ([Microsoft Entra External ID pricing](https://learn.microsoft.com/en-us/entra/external-id/external-identities-pricing))

Always run `pp-agency estimate-licensing` and walk the client through ../checklists/licensing-and-capacity.md and ../checklists/connectors-and-premium.md before commitment.

## Delivery Approach

Follow the playbook end-to-end:

- **Primary playbook:** ../playbooks/power-pages-site.md — site provisioning, IA, templates, web roles, table permissions, deployment.
- **Data model support:** ../playbooks/dataverse-solution.md when portal-specific tables/columns are needed.
- **Back-office automation** triggered by portal writes: ../playbooks/power-automate-cloud-flow.md.
- **Promotion through environments:** ../playbooks/alm-pipeline.md for the deployment/release flow.

Reference patterns while building: ../power-platform/power-pages-patterns.md (Liquid, web templates, FetchXML in lists, table-permission scoping) and ../power-platform/dataverse-patterns.md for the underlying data model. Capture environment-specific values via ../power-platform/environment-variables.md rather than hard-coding.

## Quality Gates

No portal goes live without passing these gates:

- **Scope validation:** ../checklists/scope-validation.md (before build).
- **QA:** ../checklists/qa.md — functional, cross-browser, responsive, form submission and validation.
- **Dataverse security:** ../checklists/dataverse-security.md — confirm table permissions enforce least privilege per web role.
- **Connectors & premium:** ../checklists/connectors-and-premium.md — any premium/flow dependency identified and licensed.
- **DLP & governance:** ../checklists/dlp-and-governance.md — portal does not violate tenant DLP policy.
- **Deployment:** ../checklists/deployment.md — environment promotion verified.
- **Support handover:** ../checklists/support-handover.md — runbook and ownership transferred.

Generate gate checklists on demand: `pp-agency checklist -t qa`, `pp-agency checklist -t scope-validation`, `pp-agency checklist -t deployment`. Validate the project directory with `pp-agency validate -p <path>`.

## Related Agents, Docs & Patterns

**Agents:**
- ../agents/power-apps-agent.md — lead portal build
- ../agents/dataverse-agent.md — data model and permission scoping
- ../agents/security-governance-agent.md — identity, web roles, table permissions
- ../agents/licensing-capacity-agent.md — capacity pack and Dataverse sizing
- ../agents/alm-deployment-agent.md — environment promotion
- ../agents/qa-test-agent.md — QA and UAT
- ../agents/solution-architect.md — overall solution shape

**Docs:**
- ../docs/power-pages-guide.md — primary reference
- ../docs/security-and-privacy.md — external-facing data handling
- ../docs/licensing-and-capacity.md — capacity model
- ../docs/integration-patterns.md — portal-to-back-office integration
- ../docs/delivery-model.md — phased delivery standard

**Patterns:**
- ../power-platform/power-pages-patterns.md
- ../power-platform/dataverse-patterns.md
- ../power-platform/environment-variables.md
- ../power-platform/solution-patterns.md

**Templates:**
- ../templates/prd-template.md
- ../templates/solution-design-template.md
- ../templates/client-proposal-template.md
- ../templates/scope-of-work-template.md
- ../templates/risk-register-template.md
- ../templates/support-runbook-template.md

## Risks & Assumptions

**Risks:**
- **Permission model leakage** — misconfigured table permissions are the top external-portal security risk. Mandatory peer review and explicit anonymous-access testing.
- **Capacity surprise** — anonymous page views and authenticated logins can spike; unmonitored capacity packs cause throttling or overage cost. Set up monitoring (../power-platform/monitoring-and-telemetry.md).
- **Identity provider complexity** — B2C / Entra External ID configuration, custom policies, and invite flows are common schedule risks; spike early.
- **Licensing model drift** — Power Pages capacity pricing has changed multiple times (the old logins/page-views metric was retired in favour of authenticated/anonymous MAU, and AI Builder + Copilot Studio moved to Copilot Credits during 2025); any quote must be re-verified against current Microsoft docs (see the cited Licensing & Capacity section above). The figures above were verified against Microsoft Learn on 2026-06-19.
- **Accessibility / compliance** — public-sector portals may carry WCAG obligations not covered by default themes; confirm requirements in discovery.
- **Branding scope creep** — pixel-perfect custom design can exceed low-code effort; agree fidelity up front.

**Assumptions:**
- Client owns or will procure the target environment and the required Power Pages capacity and Dataverse entitlement.
- A working Dataverse data model exists or is delivered alongside (Service 03 dependency).
- Client supplies content, copy, branding assets, and any legal/privacy notices.
- Chosen identity provider is available and the client controls its configuration.
- Production go-live, DNS/custom domain, and any pen-test sign-off are client-side approvals (track in ../templates/risk-register-template.md).

Record all assumptions and open decisions in the risk register and the PRD (../templates/prd-template.md) before build begins.
