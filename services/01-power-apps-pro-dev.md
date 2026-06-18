---
title: "Service 01 — Power Apps Pro Dev"
description: "Professional canvas and model-driven Power Apps development delivered as a packaged, source-controlled, tested solution."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus
  - https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/ai-builder/endofaibcredits
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution
  - https://learn.microsoft.com/en-us/power-platform/alm/use-source-control-solution-files
  - https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview
  - https://learn.microsoft.com/en-us/power-platform/test-engine/overview
related:
  - ../playbooks/canvas-app.md
  - ../playbooks/model-driven-app.md
  - ../checklists/qa.md
  - ../checklists/deployment.md
  - ../agents/power-apps-agent.md
  - ../agents/solution-architect.md
  - ../docs/power-apps-guide.md
  - ../power-platform/dataverse-patterns.md
---

# Service 01 — Power Apps Pro Dev

Production-grade canvas and model-driven Power Apps, built to engineering standards and shipped as a versioned solution with a test suite — not a fragile single-maker prototype.

## Business Problem & Outcome

Most line-of-business apps start life as a citizen-developer prototype that proves value, then hits a wall: no source control, no environments, no tests, premium licensing surprises, and a single maker who becomes a bus-factor risk. This service takes that idea (or a greenfield requirement) and delivers an app that an agency or internal IT team can own, extend, and audit.

**Pain this solves**

- Prototype-to-production gap: a working demo that cannot be safely deployed, versioned, or handed over.
- Hidden licensing cost discovered only at go-live (premium connectors, Dataverse capacity).
- No ALM: changes made directly in production, no rollback, no traceability.
- Performance and accessibility issues that surface once real users and real data arrive.

**Measurable outcomes**

- A solution that deploys cleanly dev → test → prod via a documented, repeatable pipeline.
- App-load and screen-transition performance validated against agreed targets (e.g. first meaningful screen < 3s on representative data — confirm targets per engagement).
- Accessibility checks passed (App Checker + manual keyboard/screen-reader pass).
- A regression test suite that gates future change. Note the tooling has shifted: the standalone [Power Apps Test Engine is deprecated](https://learn.microsoft.com/en-us/power-platform/test-engine/overview) and Microsoft now directs automated UI/integration testing to the [Power Platform Playwright samples](https://learn.microsoft.com/en-us/power-platform/developer/playwright-samples/overview); [Test Studio](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/test-studio) remains available for in-Studio canvas-app test cases.
- Documented licensing footprint so per-user cost is known before rollout, not after.

## Ideal Client Profile

Buyers are typically IT/digital leads, operations managers, or transformation teams who already believe in the Power Platform but need professional delivery.

**Who buys this**

- Mid-market and enterprise teams replacing a spreadsheet, Access database, or legacy InfoPath/Lotus form.
- Organisations standardising on Dataverse and wanting model-driven apps over scattered SharePoint lists.
- Agencies and SIs needing pro-dev capacity to finish or harden an app a citizen developer started.

**Triggers / signals**

- "Our maker left and nobody can change the app."
- "The pilot works but IT won't let us put it in production."
- A licensing or security review blocked a go-live.
- Growth in record volume is causing delegation warnings and timeouts.
- An audit or compliance requirement now applies to a previously informal app.

## Scope & Deliverables

Headline deliverables: **Solution package, source code, and test suite.**

Concrete artifacts:

- **Unmanaged + managed solution packages** (`.zip`) with a clean publisher prefix and solution layering.
- **Source-controlled app** unpacked via the `pac solution` commands of the [Power Platform CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution) into the repo for diffable code review (`pac solution unpack`/`pack`/`clone`/`sync`; the standalone SolutionPackager is no longer the recommended path — its capabilities are now in `pac`, per [source control with solution files](https://learn.microsoft.com/en-us/power-platform/alm/use-source-control-solution-files)).
- **Canvas app** (responsive layout, named formulas, components, reusable component library) and/or **model-driven app** (forms, views, dashboards, site map, business rules, business process flows).
- **Connection references and environment variables** parameterised so nothing is hard-coded across environments.
- **Test suite** — [Test Studio](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/test-studio) cases and/or YAML/Power Fx automated tests, plus a documented manual UAT script. (The former Power Apps Test Engine is [deprecated](https://learn.microsoft.com/en-us/power-platform/test-engine/overview); new automated-test work should target the [Power Platform Playwright samples](https://learn.microsoft.com/en-us/power-platform/developer/playwright-samples/overview).)
- **Performance pass** — App Checker results, delegation review, image/data optimisation.
- **Accessibility pass** — App Checker accessibility findings remediated; manual keyboard and contrast checks.
- **Deployment runbook** and rollback notes (see `../checklists/deployment.md`).
- **Handover pack** — architecture notes, known limitations, and an extension guide.

## Out of Scope

Unless explicitly added to the statement of work:

- Dataverse data model design beyond the tables this app needs — see Service 03 (`03-dataverse-advanced.md`).
- Complex cloud or desktop automation — see Service 04 (`04-power-automate-enterprise.md`).
- External/anonymous portals — see Service 05 (`05-power-pages-portals.md`).
- Power BI report authoring and embedding — see Service 06 (`06-pbi-embedded-analytics.md`).
- Full ALM pipeline / Azure DevOps or GitHub Actions setup beyond a single documented promotion path — see Service 07 (`07-alm-devops.md`).
- Tenant-wide governance, DLP, and CoE configuration — see Service 08 (`08-governance-security.md`).
- Data migration from legacy systems — see Service 09 (`09-migration-upgrade.md`).
- Custom PCF control development unless named as a deliverable.

## Engagement Model & Effort

Effort is sized after discovery. Indicative T-shirt sizing (refine per engagement):

| Size | Typical shape | Indicative effort |
|------|---------------|-------------------|
| **S** | Single canvas app, 1–2 data sources, light logic, no new tables | ~5–10 delivery days |
| **M** | Canvas + model-driven, several tables, business rules, basic tests, one integration | ~10–25 delivery days |
| **L** | Multi-app solution, reusable component library, full test suite, multiple integrations, performance hardening | ~25–50+ delivery days |

**Phases**

1. **Discovery & scope** — confirm users, data, and success criteria; run intake and scope validation.
2. **Solution design** — data touchpoints, screens/forms, integration and licensing footprint.
3. **Build** — iterative, demo-driven; source-controlled from day one.
4. **Test & harden** — automated + UAT, performance, accessibility, security.
5. **Deploy & handover** — managed solution promotion, runbook, knowledge transfer.

**Team roles** (brief each via `pp-agency agent-brief`):

- Lead developer — see `../agents/power-apps-agent.md`.
- Solution architect (design review, integration, licensing sign-off) — see `../agents/solution-architect.md`.
- QA/test owner — see `../agents/qa-test-agent.md`.
- ALM/deployment engineer for promotion path — see `../agents/alm-deployment-agent.md`.

## Indicative Pricing

All figures are **indicative planning ranges, not quotes — confirm current rates** before committing to a client.

- **Day-rate band:** roughly the agency's standard senior pro-dev band (e.g. mid-to-upper consulting day rate; set per region/currency). Generate a per-currency licensing companion via `pp-agency estimate-licensing -c usd|gbp|eur`.
- **S engagement:** small fixed-price package once scope is locked.
- **M / L engagements:** prefer **fixed-price per phase** where scope is well-defined; use **time & materials** for discovery, integration spikes, and any externally dependent work.
- Recommend a **fixed-price discovery + design** stage, then fix or T&M the build once requirements are confirmed.
- Exclude Microsoft licensing and Azure consumption from the day-rate — these are client-borne and estimated separately (see below).

Use `../templates/client-proposal-template.md` and `../templates/scope-of-work-template.md` to turn an estimate into a commercial offer.

## Licensing & Capacity Considerations

Licensing is the most common source of go-live surprises. Flag every premium dependency in design, not at deployment. Specific figures and plan names below are verified against Microsoft Learn as of 2026-06-19; always re-confirm at proposal time because Microsoft revises these continuously.

- **Premium connectors** (e.g. SQL Server, custom connectors, HTTP) require a standalone **Power Apps Premium** (per-user) or **Power Apps per app** plan — standard/seeded Microsoft 365 licensing does **not** cover premium, on-premises, or custom connectors, and every user who runs the app needs the entitlement, not just the maker ([Power Apps for Microsoft 365 capabilities table](https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus), [licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq)). Confirm each connector's tier in the design phase. Note: in a [Managed Environment](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing) even standard-connector apps require a premium license to run.
- **Power Apps per app vs per-user (Power Apps Premium):** the per app plan entitles a user to run **one app (or one portal) in one environment** and is allocated to environments rather than assigned to users; **Power Apps Premium** (formerly the per-user plan) entitles a user to run **unlimited apps** and is assigned per user ([About Power Apps per app plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp)). Per app suits narrow rollouts; Premium suits power users. Pay-as-you-go metering is also available. Model the options before recommending; current per-seat list prices change frequently, so pull live figures from the [Power Platform pricing page](https://www.microsoft.com/en-us/power-platform/products/power-apps/pricing) at proposal time (specific dollar figures unverified as of 2026-06-19 — confirm against Microsoft pricing).
- **Dataverse capacity:** database, file, and log storage are metered separately and consume tenant capacity; entitlement accrues from active qualifying licenses plus a one-time per-tenant default (the default environment includes 3 GB database, 3 GB file, 1 GB log), and exceeding entitlement triggers admin-center warnings (banner under 15% remaining) and can ultimately suspend the service ([Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage)). Large tables, attachments, or audit logging can exceed entitlements — size them in design.
- **AI Builder / Copilot Credits:** any AI Builder capability (form processing, prediction, GPT/prompt actions) consumes credits at a per-capability rate from a metered pool. **Important 2025 change:** from 1 November 2025 AI Builder features consume **AI Builder credits or Copilot Credits**, AI Builder add-ons are renewal/true-up only for existing customers (new customers buy Copilot Credits), and AI Builder credits seeded in Power Platform/Dynamics licenses are being removed in November 2026 ([Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management), [End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits)). Budget separately and warn the client. Out of scope here unless named; see Service 02.
- **Copilot Studio (Copilot Credits, not "messages"):** as of 1 September 2025 the consumption currency for Copilot Studio shifted from *messages* to **Copilot Credits**, billed via prepaid capacity packs (25,000 credits/pack/month, non-rolling) and/or pay-as-you-go Azure meters, with credit consumption varying by task complexity ([Billing rates and management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management), [Manage Copilot Studio credits and capacity](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity)). If the app embeds or links to a Copilot Studio agent, budget this separately — see Service 02.
- **Environments:** dedicated dev/test environments with Dataverse draw on tenant database/file/log capacity and (for sandbox/production beyond the default) require the appropriate Power Platform licensing or capacity (unverified specifics as of 2026-06-19 — confirm against Microsoft Learn).

Always validate the final footprint against `../checklists/connectors-and-premium.md` and `../checklists/licensing-and-capacity.md`, and produce an estimate with `../templates/licensing-estimate-template.md`.

## Delivery Approach

Follow the relevant playbooks step-by-step; do not freelance the build sequence:

- **Canvas apps:** `../playbooks/canvas-app.md` — layout, named formulas, components, delegation-safe data access, theming, App Checker.
- **Model-driven apps:** `../playbooks/model-driven-app.md` — forms, views, business rules, business process flows, site map, security roles.
- **Solution structure:** `../playbooks/dataverse-solution.md` for publisher prefixes, layering, and packaging discipline.

Source control and parameterisation are non-negotiable from day one: unpack with [`pac solution`](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution), use connection references and environment variables, never hard-code IDs or URLs.

## Quality Gates

No phase advances without passing the relevant gate:

- **QA gate:** `../checklists/qa.md` — functional tests, delegation review, performance, accessibility, error handling.
- **Scope gate:** `../checklists/scope-validation.md` — built matches agreed scope; change requests logged.
- **Deployment gate:** `../checklists/deployment.md` — managed solution, connection references mapped, rollback verified.

Generate any of these on demand: `pp-agency checklist -t qa` / `-t deployment` / `-t scope-validation`. Validate the project structure with `pp-agency validate -p <path>`.

## Related Agents, Docs & Patterns

- **Agents:** `../agents/power-apps-agent.md`, `../agents/solution-architect.md`, `../agents/qa-test-agent.md`, `../agents/alm-deployment-agent.md`, `../agents/licensing-capacity-agent.md`.
- **Docs:** `../docs/power-apps-guide.md`, `../docs/delivery-model.md`, `../docs/licensing-and-capacity.md`.
- **Patterns:** `../power-platform/power-apps-patterns.md`, `../power-platform/dataverse-patterns.md`, `../power-platform/environment-variables.md`, `../power-platform/connection-references.md`, `../power-platform/pcf-patterns.md`.
- **Templates:** `../templates/prd-template.md`, `../templates/solution-design-template.md`, `../templates/scope-of-work-template.md`, `../templates/client-proposal-template.md`.

Kick off with `pp-agency new-project <name> --type power-apps`, then `pp-agency generate-prd` and `pp-agency generate-solution-design`.

## Risks & Assumptions

**Assumptions**

- The client owns a Power Platform tenant with environments we can use, or will provision them.
- Required data sources are reachable and the client can grant the necessary connections/service accounts.
- Licensing for premium dependencies will be procured by the client before go-live.
- A named business owner is available for UAT and sign-off.

**Risks**

- **Licensing creep** — a connector or AI feature pulls the app into a premium tier mid-build. Mitigation: lock the licensing footprint in design; flag any change immediately.
- **Delegation limits** — non-delegable queries against large Dataverse/SharePoint/SQL tables return only the local row cap (500 by default, raisable to a maximum of 2,000 in app settings), causing silent data truncation rather than a hard error ([Understand delegation in a canvas app](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview)). Mitigation: delegation review in the QA gate; use delegable functions/data sources or move logic server-side.
- **Scope drift** — "while you're in there" requests inflate effort. Mitigation: change log against the scope gate; re-estimate before accepting.
- **Tenant/environment dependencies** — DLP policies or missing capacity block deployment. Mitigation: validate environment readiness early via `../checklists/power-platform-environment.md`.
- **Platform change** — Microsoft preview features and capacity rules shift. Mitigation: avoid preview features in production deliverables; re-verify all licensing facts at proposal time.

Track all of the above in `../templates/risk-register-template.md`.
