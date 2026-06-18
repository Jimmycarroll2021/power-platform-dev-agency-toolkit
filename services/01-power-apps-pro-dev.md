---
title: "Service 01 — Power Apps Pro Dev"
description: "Professional canvas and model-driven Power Apps development delivered as a packaged, source-controlled, tested solution."
category: service
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
- A regression test suite (Test Studio and/or Power Apps Test Engine) that gates future change.
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
- **Source-controlled app** unpacked via `pac` (Power Platform CLI) into the repo for diffable code review.
- **Canvas app** (responsive layout, named formulas, components, reusable component library) and/or **model-driven app** (forms, views, dashboards, site map, business rules, business process flows).
- **Connection references and environment variables** parameterised so nothing is hard-coded across environments.
- **Test suite** — Test Studio cases and/or Power Apps Test Engine YAML, plus a documented manual UAT script.
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

Licensing is the most common source of go-live surprises. Flag every premium dependency in design, not at deployment. (All specific figures below: **Needs verification against current Microsoft docs**.)

- **Premium connectors** (e.g. SQL Server, custom connectors, HTTP, Dataverse via certain paths) require a **Power Apps Premium per-user** or **per-app** plan — standard/seeded Microsoft 365 licensing will not cover them. Confirm each connector's tier in the design phase.
- **Power Apps Per-App vs Per-User:** per-app is cheaper for narrow rollouts but caps the user to a fixed number of apps; per-user suits power users. Model both before recommending.
- **Dataverse capacity:** database, file, and log storage are metered and consume tenant capacity. Large tables, attachments, or audit logging can exceed entitlements (**Needs verification against current Microsoft docs**).
- **AI Builder credits:** any AI Builder model (form processing, prediction, GPT prompts) consumes credits from a metered pool — budget separately and warn the client (**Needs verification against current Microsoft docs**). Out of scope here unless named; see Service 02.
- **Copilot Studio messages:** if the app embeds or links to a Copilot Studio agent, message consumption is billed against a separate message capacity (**Needs verification against current Microsoft docs**) — see Service 02.
- **Environments:** dedicated dev/test environments may need Dataverse and could draw on capacity or sandbox entitlements.

Always validate the final footprint against `../checklists/connectors-and-premium.md` and `../checklists/licensing-and-capacity.md`, and produce an estimate with `../templates/licensing-estimate-template.md`.

## Delivery Approach

Follow the relevant playbooks step-by-step; do not freelance the build sequence:

- **Canvas apps:** `../playbooks/canvas-app.md` — layout, named formulas, components, delegation-safe data access, theming, App Checker.
- **Model-driven apps:** `../playbooks/model-driven-app.md` — forms, views, business rules, business process flows, site map, security roles.
- **Solution structure:** `../playbooks/dataverse-solution.md` for publisher prefixes, layering, and packaging discipline.

Source control and parameterisation are non-negotiable from day one: unpack with `pac`, use connection references and environment variables, never hard-code IDs or URLs.

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
- **Delegation limits** — large Dataverse/SharePoint tables exceed delegable query limits, causing silent data truncation. Mitigation: delegation review in the QA gate; restructure queries or move logic server-side.
- **Scope drift** — "while you're in there" requests inflate effort. Mitigation: change log against the scope gate; re-estimate before accepting.
- **Tenant/environment dependencies** — DLP policies or missing capacity block deployment. Mitigation: validate environment readiness early via `../checklists/power-platform-environment.md`.
- **Platform change** — Microsoft preview features and capacity rules shift. Mitigation: avoid preview features in production deliverables; re-verify all licensing facts at proposal time.

Track all of the above in `../templates/risk-register-template.md`.
