---
title: "Service 08 — Governance & Security"
description: "Security review and governance setup for Power Platform: DLP policies, access reviews, and compliance documentation that make the tenant safe to scale."
category: service
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/ai-builder/endofaibcredits
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-dataverse-auditing
  - https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing
related:
  - ../playbooks/governance-audit.md
  - ../checklists/dlp-and-governance.md
  - ../checklists/dataverse-security.md
  - ../agents/security-governance-agent.md
  - ../docs/governance-and-coe.md
  - ../docs/security-and-privacy.md
---

# Service 08 — Governance & Security

We make your Power Platform tenant safe to scale: enforce data loss prevention, lock down access, and produce the compliance evidence your auditors and security team will ask for.

## Business Problem & Outcome

Most organisations adopt Power Platform faster than they govern it. Makers spin up apps and flows in the default environment, premium connectors leak corporate data to personal storage, and nobody can answer "who has access to what?" when the auditor calls. The result is shadow IT, failed audits, and a security team that wants to switch the whole platform off.

This service closes that gap. We design and implement a governance and security baseline so the platform stays open enough for makers to build, but controlled enough for risk and compliance to sleep at night.

**Measurable outcomes:**

- A tenant-wide DLP policy posture mapped to data-sensitivity tiers — every business connector explicitly classified Business / Non-Business / Blocked, with no unmanaged gaps.
- Environment strategy that removes uncontrolled building in the default environment (target: zero net-new production apps/flows in the default environment).
- Access reviews completed for all production environments and Dataverse security roles, with least-privilege confirmed and orphaned access removed.
- A compliance evidence pack (DLP register, environment register, security role matrix, audit-log configuration, data-residency statement) ready to hand to an internal or external auditor.
- A standing governance operating rhythm (CoE-aligned) so the baseline does not decay after we leave.

## Ideal Client Profile

This service fits organisations that already use Power Platform and now need to bring it under control, or regulated organisations that must demonstrate control before they expand.

**Who buys this:**

- IT / Platform owners, CISOs, security architects, compliance and risk leads.
- Organisations in regulated sectors (financial services, healthcare, government, energy) subject to GDPR, HIPAA, SOX, ISO 27001, APRA CPS 234, or similar.
- Mid-to-large enterprises with 100+ makers and multiple environments.

**Triggers and signals:**

- An audit, penetration test, or risk review flagged Power Platform.
- A data-leak incident or near-miss involving a connector (e.g. data pushed to personal OneDrive, Twitter/X, or a public endpoint).
- Rapid maker growth with everything in the default environment.
- A move from Power Platform "experimentation" to a sanctioned, enterprise-scale program.
- Microsoft 365 / Copilot rollout forcing a fresh look at data governance.
- Pending tenant or licensing migration where governance must be designed in, not bolted on.

## Scope & Deliverables

Concrete artifacts produced by this engagement:

- **Governance & Security Assessment Report** — current-state findings, risk register, and prioritised remediation roadmap (RAG-rated).
- **DLP Policy Design & Implementation** — connector classification matrix (Business / Non-Business / Blocked), environment-scoped policies, custom-connector and HTTP-connector handling, exemption/exception process.
- **Environment Strategy** — environment taxonomy (default lockdown, dev/test/prod, personal-productivity, security-group mapping), creation governance, and naming standards.
- **Access Review & Security Role Matrix** — Dataverse security roles, business units, teams, sharing posture, guest/external access review, and least-privilege remediation actions.
- **Service Account & Identity Standards** — service-principal / managed-identity guidance, connection-reference ownership, conditional-access alignment, and the removal of personal credentials from production connections.
- **Audit & Monitoring Configuration** — audit-log enablement, retention settings, and an inventory/telemetry approach (CoE Starter Kit-aligned where in use).
- **Compliance Documentation Pack** — DLP register, environment register, security role matrix, data-classification and data-residency statements, retention/disposal notes, and an evidence index aligned to the client's control framework.
- **Governance Operating Model** — CoE roles and responsibilities, maker onboarding standards, governance cadence (monthly/quarterly reviews), and policy change control.
- **Validated handover** — every deliverable run against the relevant repository checklists before sign-off.

## Out of Scope

To keep the engagement focused, the following are not included unless contracted separately:

- Building or remediating individual apps, flows, or Copilot agents (see Service 01 Power Apps Pro Dev, Service 04 Power Automate Enterprise, Service 02 Copilot Studio Agents).
- Full Microsoft Purview / Microsoft 365 information-protection program design beyond its interaction with Power Platform DLP.
- Azure AD / Entra ID tenant-wide identity redesign (we align to it; we do not re-architect it).
- ALM / DevOps pipeline build-out (see Service 07 ALM & DevOps).
- Penetration testing and formal certification audits (we prepare evidence; we are not the certifying body).
- Ongoing managed governance operations after handover (see Service 11 Managed Support).
- Remediation labour for findings beyond the agreed remediation window — surfaced as a follow-on statement of work.

## Engagement Model & Effort

Phased delivery. Effort scales with tenant size, number of environments, regulatory load, and how much remediation (versus design only) is in scope.

| Size | Indicative effort | Typical situation |
|------|-------------------|-------------------|
| **S** | 5–10 days | Single tenant, few environments, design + baseline DLP, light remediation. Assessment and policy design, minimal hands-on cleanup. |
| **M** | 12–20 days | Multiple environments, regulated workload, DLP + environment strategy + access review with meaningful remediation. |
| **L** | 25–45+ days | Large/regulated estate, multi-region/data-residency concerns, full compliance evidence pack, CoE operating model stand-up, and phased remediation. |

**Phases:**

1. **Assess** — discovery, current-state inventory, risk register (S: ~30%, M/L: ~25% of effort).
2. **Design** — DLP, environment strategy, security role matrix, identity standards.
3. **Implement** — apply policies, configure audit/monitoring, execute access remediation.
4. **Document & Handover** — compliance pack, operating model, knowledge transfer, validated sign-off.

**Team roles:**

- [Security & Governance Agent](../agents/security-governance-agent.md) — lead: DLP, environment strategy, access reviews, compliance documentation.
- [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md) — premium-connector and licensing implications of connector classification.
- [Dataverse Agent](../agents/dataverse-agent.md) — Dataverse security roles, business units, and row/field-level security.
- [Solution Architect](../agents/solution-architect.md) — alignment of the governance baseline with target solution architecture.
- [ALM & Deployment Agent](../agents/alm-deployment-agent.md) — connection-reference ownership and environment-variable handling across the pipeline.

## Indicative Pricing

> All figures below are **indicative planning ranges, not quotes**. Confirm current rates before committing to any client. Never present these as a fixed commitment.

- **Day-rate band:** indicative senior-consultant day rate in the broad professional-services range (e.g. AUD/USD ~1,200–2,200 per day depending on region and seniority — **indicative — confirm current rates**).
- **S engagement:** indicative 5–10 days.
- **M engagement:** indicative 12–20 days.
- **L engagement:** indicative 25–45+ days.

**Pricing model guidance:**

- **Fixed-price** suits the Assess and Design phases, where scope is well-bounded (assessment report + DLP design + environment strategy).
- **Time & materials (T&M)** suits the Implement and remediation phases, where the volume of cleanup is unknown until discovery completes.
- A common structure is fixed-price assessment/design, then a T&M remediation block with a not-to-exceed ceiling agreed up front.

Use the CLI to produce a structured planning estimate rather than quoting from memory:

```bash
node packages/cli/dist/index.js estimate-licensing --currency usd --output ./estimates/08-governance-security.md
```

(After `cd packages/cli && npm link`, run as `pp-agency estimate-licensing ...`.)

## Licensing & Capacity Considerations

Governance design directly drives licensing exposure — every connector you classify as Business and every premium feature you sanction has a cost and entitlement implication. Verify all of the following against current Microsoft licensing documentation before advising a client.

- **Premium connectors:** Classifying premium connectors (e.g. HTTP, custom connectors, SQL Server, Azure-hosted endpoints) as Business in DLP does **not** grant the right to use them — users still need **Power Apps Premium** and/or **Power Automate Premium** plans. DLP controls *whether* a connector can be used with business data (its Business / Non-Business / Blocked data group governs only data-sharing, not entitlement); licensing controls *who is entitled* to use it. Confirmed: premium, on-premises, custom-API and HTTP connectors require a premium entitlement independent of DLP classification ([DLP connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification), [Power Apps licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq)). Note: tenants can now also use **advanced connector policies (ACP)** — a strict allowlist model (all connectors blocked unless explicitly allowed, certified connectors only as of 2026-H1) — alongside classic Business/Non-Business/Blocked policies.
- **Power Apps Premium vs Per-App:** Per-user **Power Apps Premium** and the **Per App** plan are both current, distinct entitlement options (Per App capacity is purchased then *allocated to an environment* before it takes effect); governance decisions that route apps into premium-requiring environments can trigger unbudgeted licensing. Confirmed against the [Power Apps licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq) and [Power Platform licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq).
- **AI Builder credits / Copilot Credits (2026-H1 transition):** AI Builder consumption is metered against a capacity that must be allocated to an environment. The currency is changing: as of October 2025 Microsoft began the **progressive end of AI Builder credits** — new customers can no longer buy the AI Builder capacity add-on and must use **Copilot Credits**, while existing seeded AI Builder credits (from Power Apps/Power Automate Premium, Dynamics 365, etc.) remain usable until **November 1, 2026**. A dual-mode model applies: in Power Apps / cloud flows, AI Builder features consume AI Builder credits first then fall back to Copilot Credits; in Copilot Studio agents and agent flows they always consume Copilot Credits. Document which currency, ownership and limits apply before sanctioning AI Builder usage ([Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management), [End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits)).
- **Copilot Studio capacity (now Copilot Credits, not messages):** Copilot Studio was historically metered in **messages**, but as of **September 1, 2025** the common currency for agents changed from messages to **Copilot Credits** (the per-pack quantity and pay-as-you-go rate were unchanged at the switch). Capacity is bought either as prepaid capacity packs or consumed pay-as-you-go via a linked Azure subscription (billing policy in the Power Platform admin center); unused prepaid credits do not roll over month to month. Governance over which agents are sanctioned must account for Copilot Credit consumption and pack/meter entitlements ([Copilot Studio billing rates and management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management), [Manage Copilot Studio credits and capacity](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity)). Confirm current per-pack quantities and rates on the Microsoft pricing/licensing guide before quoting figures.
- **Dataverse capacity:** Security and audit configuration interacts with **Dataverse capacity**, which is split into three storage types — **database**, **file**, and **log**. Audit logs are stored in Dataverse and consume **log** storage capacity (system-generated logs, including audit and plug-in trace logs, are counted against the customer's storage entitlement and can drive overage charges). Confirm entitlements and overage costs, and plan a retention/export strategy (e.g. Azure Synapse Link), before turning on broad auditing ([Manage Dataverse auditing](https://learn.microsoft.com/en-us/power-platform/admin/manage-dataverse-auditing), [Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage)).
- **Managed Environments:** Some governance controls (e.g. sharing limits, weekly digests, and other admin-at-scale features) require **Managed Environments**. When an environment is enabled as Managed, **all active users** (makers and consumers) in it need at least one premium Power Platform license per user (Power Apps Premium, Power Automate Premium, Copilot Studio, Power Pages, qualifying Dynamics 365 licences) or a qualifying capacity add-on — even for apps/flows that would otherwise run on Office-seeded licensing. Confirmed against [Managed Environments licensing](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing). Note: Microsoft is rolling out licence-compliance notifications for Managed Environments (admin notices from March 2026, in-app end-user notices from June 2026).
- **Data residency / sovereignty:** Multi-region tenants may have geo and data-residency constraints affecting where environments and Dataverse data can live. Confirm against the current Microsoft data-residency and sovereign-cloud guidance (unverified as of 2026-06-19 — confirm against Microsoft Learn).

Run the licensing and capacity quality gate before finalising any governance recommendation: [Licensing & Capacity checklist](../checklists/licensing-and-capacity.md).

## Delivery Approach

Delivery follows the governance audit playbook end to end, adapted to engagement size.

- Primary workflow: [Governance Audit Playbook](../playbooks/governance-audit.md) — DLP review, environment review, security/access review, licensing utilisation, data-compliance review, maker and CoE governance.
- Reference architecture and operating model: [Governance & CoE guide](../docs/governance-and-coe.md).
- Security/privacy controls and data-protection posture: [Security & Privacy guide](../docs/security-and-privacy.md).
- Dataverse-level security design (roles, business units, row/field security): [Dataverse patterns](../power-platform/dataverse-patterns.md).
- Environment taxonomy and isolation: [Environment strategy](../power-platform/environment-strategy.md).
- Identity and connection ownership: [Connection references](../power-platform/connection-references.md) and [Environment variables](../power-platform/environment-variables.md).

Phase sequence: discovery/inventory → DLP and environment design → security role matrix and access review → implementation and audit configuration → compliance documentation → validated handover.

## Quality Gates

No deliverable is signed off until it passes the relevant checklists:

- [DLP & Governance checklist](../checklists/dlp-and-governance.md) — DLP coverage, environment governance, connector classification, exemption process.
- [Dataverse Security checklist](../checklists/dataverse-security.md) — security roles, business units, teams, row/field-level security, sharing posture.
- [Power Platform Environment checklist](../checklists/power-platform-environment.md) — environment strategy, isolation, and default-environment lockdown.
- [Licensing & Capacity checklist](../checklists/licensing-and-capacity.md) — entitlement verification for every sanctioned premium feature.
- [Connectors & Premium checklist](../checklists/connectors-and-premium.md) — premium and custom-connector handling.

Generate a governance phase checklist artifact for the engagement:

```bash
node packages/cli/dist/index.js checklist --type governance --output ./checklists/08-governance-engagement.md
```

Validate the project directory before handover:

```bash
node packages/cli/dist/index.js validate --project ./projects/<client-name>
```

## Related Agents, Docs & Patterns

**Agents:**

- [Security & Governance Agent](../agents/security-governance-agent.md)
- [Licensing & Capacity Agent](../agents/licensing-capacity-agent.md)
- [Dataverse Agent](../agents/dataverse-agent.md)
- [Solution Architect](../agents/solution-architect.md)
- [ALM & Deployment Agent](../agents/alm-deployment-agent.md)

Generate an agent brief for the lead role:

```bash
node packages/cli/dist/index.js agent-brief --agent security-admin --project ./projects/<client-name> --output ./briefs/08-security-admin.md
```

**Docs:**

- [Governance & CoE guide](../docs/governance-and-coe.md)
- [Security & Privacy guide](../docs/security-and-privacy.md)
- [Licensing & Capacity guide](../docs/licensing-and-capacity.md)
- [Platform map](../docs/platform-map.md)

**Patterns:**

- [Dataverse patterns](../power-platform/dataverse-patterns.md)
- [Environment strategy](../power-platform/environment-strategy.md)
- [Connection references](../power-platform/connection-references.md)
- [Environment variables](../power-platform/environment-variables.md)
- [Monitoring & telemetry](../power-platform/monitoring-and-telemetry.md)

**Templates:**

- [Risk register template](../templates/risk-register-template.md)
- [Governance checklist template](../templates/governance-checklist.md)
- [Scope of work template](../templates/scope-of-work-template.md)
- [Handover document template](../templates/handover-document-template.md)

## Risks & Assumptions

**Assumptions:**

- The client has Power Platform admin access and can grant (or sponsor) the access needed to inventory environments, DLP policies, and Dataverse security.
- A named client owner exists for governance decisions (connector classification trade-offs, environment lockdown) — these are business decisions, not purely technical ones.
- Existing Azure AD / Entra ID identity, conditional access, and data-classification schemes are in place and authoritative; this service aligns to them rather than rebuilding them.
- The client's control framework (ISO 27001, SOC 2, GDPR, HIPAA, etc.) is identified at kickoff so the compliance pack maps to the right controls.

**Risks:**

- **Disruption from lockdown** — tightening the default environment or blocking connectors can break existing apps/flows. Mitigation: discovery-first, phased rollout, and a documented exemption process before enforcement.
- **Licensing surprises** — connector classification may reveal that sanctioned usage is not licensed. Mitigation: pair every governance decision with the [Licensing & Capacity checklist](../checklists/licensing-and-capacity.md) and verify entitlements against current Microsoft docs.
- **Platform feature drift** — Microsoft licensing, DLP capabilities, Managed Environments, and capacity models change frequently. The licensing/capacity claims in this document were verified against Microsoft Learn as of 2026-06-19 (platform state 2026-H1) with inline citations; any claim still carrying an "(unverified as of 2026-06-19 — confirm against Microsoft Learn)" marker, and any specific price or capacity number, must be re-confirmed at delivery time.
- **Governance decay** — a baseline implemented once will erode without an operating rhythm. Mitigation: stand up the governance cadence and CoE roles, or contract ongoing operations under Service 11 Managed Support.
- **Scope creep into remediation** — assessments routinely surface more cleanup than expected. Mitigation: fixed-price assess/design, then a T&M remediation block with a not-to-exceed ceiling.
