---
title: "Service 15 — Audit & Compliance"
description: "Independent security audit and compliance review of a Power Platform tenant or solution, delivering an audit report, prioritised remediation plan, and an evidence pack."
category: service
related:
  - ../playbooks/governance-audit.md
  - ../checklists/dlp-and-governance.md
  - ../checklists/dataverse-security.md
  - ../checklists/licensing-and-capacity.md
  - ../agents/security-governance-agent.md
  - ../docs/governance-and-coe.md
  - ../docs/security-and-privacy.md
---

# Service 15 — Audit & Compliance

Independent, evidence-based audit of your Power Platform estate that tells you exactly where the security, governance, and compliance gaps are — and gives you a costed, sequenced plan to close them.

## Business Problem & Outcome

Power Platform spreads fast. Citizen developers ship apps, makers connect to SharePoint, Dataverse, and SQL, and flows quietly move data between systems. Within a year most organisations have no reliable answer to: *who can do what, with which data, and is any of it leaving the tenant?* Audit, risk, and security teams then ask for evidence that does not exist.

This service produces that answer and the proof to back it.

**Pain we solve**

- No clear inventory of environments, apps, flows, connectors, and the data they touch.
- Data Loss Prevention (DLP) policies absent, inconsistent, or unenforced across environments.
- Over-shared apps and over-privileged Dataverse security roles.
- Personal/default environment sprawl with production data in it.
- Connections using personal credentials, hard-coded secrets, or broad service accounts.
- Failed or anxious internal audit / ISO 27001 / SOC 2 / regulatory reviews because nobody can produce evidence.

**Measurable outcomes**

- A scored audit report mapping every finding to severity (Critical/High/Medium/Low) and to a control framework.
- A remediation plan with owners, effort estimates, and a 30/60/90-day sequence.
- An evidence pack (exports, screenshots, policy definitions, role matrices) suitable for internal or external auditors.
- Baseline metrics: % environments under DLP, count of cross-tenant connectors blocked, number of over-privileged roles reduced, sharing reduced.
- A repeatable audit method the customer's Centre of Excellence (CoE) can re-run.

## Ideal Client Profile

Organisations running Power Platform at meaningful scale who must now prove control.

**Who buys this**

- Heads of IT Security, GRC, Internal Audit, Data Protection Officers.
- CoE leads who inherited an ungoverned tenant.
- Platform owners preparing for an external certification or regulator review.

**Triggers / signals**

- Upcoming ISO 27001, SOC 2, Essential Eight, APRA CPS 234, or HIPAA/GDPR-style assessment (verify exact framework applicability with the client's compliance team).
- A near-miss or actual data exposure incident involving a Power App or flow.
- A "we have 600 flows and no idea what they do" moment.
- Board/audit-committee request for assurance over low-code estate.
- M&A due diligence, or a new CISO doing a 90-day review.

## Scope & Deliverables

Concrete artifacts the client receives:

- **Estate inventory** — environments, apps (canvas/model-driven), cloud flows, desktop flows, custom connectors, Power Pages sites, Copilot Studio agents, and their owners.
- **DLP & governance assessment** — current policy coverage, connector classification gaps, default-environment exposure, tenant isolation status.
- **Dataverse security review** — environment access, security roles, column/table-level security, field security profiles, sharing, service-account usage.
- **Connector & integration risk map** — premium connectors in use, cross-tenant data movement, credential patterns, secret handling.
- **Audit report** — executive summary, scored findings, framework mapping, heat map.
- **Remediation plan** — prioritised backlog with owners, effort (days), dependencies, and 30/60/90-day sequencing.
- **Evidence pack** — exported policy definitions, role matrices, sharing reports, screenshots, and CoE/analytics extracts, packaged for auditors.
- **Read-out workshop** — findings presentation to stakeholders plus Q&A.

## Out of Scope

To keep the engagement clean and fixed-effort, the following are explicitly excluded unless added as a separate statement of work:

- Hands-on remediation / implementation of fixes (this is an assessment; remediation is delivered under Service 08 — Governance & Security).
- Penetration testing of underlying Azure / M365 / network infrastructure.
- Source-code review or refactoring of app/flow logic for functional bugs.
- Formal certification audit (we prepare evidence; the certifying body issues the certificate).
- Microsoft 365, Entra ID, or Azure-wide security posture beyond the Power Platform boundary.
- Legal interpretation of regulations — we map technical controls; the client's legal/compliance function owns interpretation.

## Engagement Model & Effort

Phased, time-boxed assessment. Sizes below are indicative planning ranges, not commitments.

| Size | Indicative effort | Typical scope |
|------|-------------------|---------------|
| **S** | ~5–8 days | Single production environment, focused DLP + Dataverse security review, summary report. |
| **M** | ~10–15 days | Multi-environment tenant, full estate inventory, connector risk map, framework mapping, full evidence pack. |
| **L** | ~18–30+ days | Large/regulated tenant, multiple business units, control-framework alignment, CoE method handover, repeat-cadence setup. |

**Phases**

1. **Mobilise** — access, scoping, framework selection, stakeholder map (~10%).
2. **Discover** — automated + manual inventory and evidence gathering (~30%).
3. **Assess** — score findings, map to controls, build heat map (~30%).
4. **Plan** — remediation backlog, sequencing, effort (~20%).
5. **Report & read-out** — executive report, evidence pack, workshop (~10%).

**Team roles**

- Lead — see [../agents/security-governance-agent.md](../agents/security-governance-agent.md) (governance, DLP, Dataverse security, audit method).
- Licensing & capacity input — see [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md) (premium usage, capacity exposure surfaced during audit).

## Indicative Pricing

All figures are **indicative planning ranges — confirm current rates** with the commercial team before quoting. Nothing here is a client commitment.

- **Day-rate band:** indicative senior consultant rate band (confirm current rates). Use the toolkit estimator as a starting point: `node packages/cli/dist/index.js estimate-licensing -c gbp` (after `npm install && npm run build`).
- **S:** indicative fixed price derived from ~5–8 days × day-rate band.
- **M:** indicative fixed price derived from ~10–15 days × day-rate band.
- **L:** typically **T&M** with a not-to-exceed cap, given variable estate size.

**Pricing model guidance**

- Prefer **fixed-price** for S and M where scope (environment count, framework) is known up front — predictable for the buyer.
- Prefer **T&M with a cap** for L or when estate size is unknown until Discovery completes.
- Re-run cadence (quarterly/annual re-audit) is best sold as a separate retainer, not bundled.

## Licensing & Capacity Considerations

An audit frequently surfaces licensing and capacity exposure. Flag these explicitly; verify every number against current Microsoft licensing docs before advising the client.

- **Premium connectors** — connectors such as SQL Server, Azure-hosted services, HTTP, and custom connectors require **Power Apps / Power Automate premium** entitlements. Apps/flows running on seeded licences that use premium connectors are a compliance and licensing risk. (Needs verification against current Microsoft docs.)
- **Power Apps Premium vs Per-App** — confirm whether makers/users are correctly licensed for the apps they run; per-app plans are scoped per app/environment. (Needs verification against current Microsoft docs.)
- **AI Builder credits** — document processing, prediction, and GPT-prompt actions consume AI Builder credits drawn from a tenant capacity pool; audit whether consumption is metered and within purchased capacity. (Needs verification against current Microsoft docs.)
- **Copilot Studio messages** — Copilot Studio agents consume a metered message/credit allowance; surface any agents and their consumption model during inventory. (Needs verification against current Microsoft docs.)
- **Dataverse capacity** — database, file, and log storage are tenant-pooled and chargeable past entitlement; over-capacity is both a cost and a continuity risk. Check current usage vs entitlement. (Needs verification against current Microsoft docs.)
- **Default environment** — typically has no DLP and is broadly accessible; production data here is a recurring finding.

See [../docs/licensing-and-capacity.md](../docs/licensing-and-capacity.md) and the checklist [../checklists/licensing-and-capacity.md](../checklists/licensing-and-capacity.md) for the verification routine.

## Delivery Approach

Follow the governance audit playbook end-to-end: [../playbooks/governance-audit.md](../playbooks/governance-audit.md).

1. **Mobilise** — confirm tenant/environment scope and the target control framework; obtain least-privilege audit access.
2. **Discover** — build the estate inventory and pull evidence (policy exports, role exports, sharing/analytics extracts).
3. **Assess** — score each finding against the playbook's control catalogue and produce the heat map.
4. **Plan** — translate findings into a sequenced remediation backlog with owners and effort.
5. **Report** — assemble the audit report and evidence pack, then run the read-out workshop.

Generate the matching audit checklist artifact for the engagement:

```bash
node packages/cli/dist/index.js checklist -t governance -o ./audit-checklist.md
```

## Quality Gates

The audit is not "done" until these checklists pass and are attached as evidence:

- [../checklists/dlp-and-governance.md](../checklists/dlp-and-governance.md) — DLP coverage, connector classification, tenant isolation.
- [../checklists/dataverse-security.md](../checklists/dataverse-security.md) — roles, sharing, column security, service accounts.
- [../checklists/licensing-and-capacity.md](../checklists/licensing-and-capacity.md) — premium usage, credit/message consumption, Dataverse capacity.

Validate the assembled deliverable directory before hand-off:

```bash
node packages/cli/dist/index.js validate -p ./audit-engagement
```

## Related Agents, Docs & Patterns

**Agents**

- [../agents/security-governance-agent.md](../agents/security-governance-agent.md) — lead audit and governance specialist.
- [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md) — licensing and capacity exposure input.

**Docs**

- [../docs/governance-and-coe.md](../docs/governance-and-coe.md) — CoE model, DLP strategy, tenant governance.
- [../docs/security-and-privacy.md](../docs/security-and-privacy.md) — security and data-handling reference.
- [../docs/licensing-and-capacity.md](../docs/licensing-and-capacity.md) — licensing and capacity reference.

**Patterns**

- [../power-platform/dataverse-patterns.md](../power-platform/dataverse-patterns.md) — Dataverse security and modelling patterns referenced during the review.
- [../power-platform/environment-strategy.md](../power-platform/environment-strategy.md) — environment design and isolation patterns.

**Templates**

- [../templates/risk-register-template.md](../templates/risk-register-template.md) — capture findings as tracked risks.
- [../templates/scope-of-work-template.md](../templates/scope-of-work-template.md) — scope the engagement and any remediation follow-on.

## Risks & Assumptions

**Assumptions**

- The client grants timely least-privilege audit access (Power Platform admin / CoE analytics read) to in-scope environments.
- A target control framework (or "general best practice") is agreed during Mobilise.
- Stakeholders are available for the kick-off and read-out workshops.
- Inventory tooling (e.g. CoE Starter Kit / admin analytics) is available or can be stood up; if not, manual discovery extends Discovery effort.

**Risks**

- **Scope creep** — larger estate than expected at Discovery; mitigated by T&M-with-cap for L and a scope re-confirmation gate after Discovery.
- **Access delays** — slow provisioning of audit access compresses the timeline; mitigated by front-loading access requests in Mobilise.
- **Stale platform facts** — Microsoft licensing, capacity, and preview features change frequently; all such facts are marked "(Needs verification against current Microsoft docs)" and re-checked before report sign-off.
- **Remediation expectation** — this engagement assesses and plans; the client may expect fixes. Set expectations early and route remediation to Service 08 — Governance & Security.
- **Compliance interpretation** — technical control mapping is not a legal opinion; the client's compliance/legal function owns regulatory interpretation.
