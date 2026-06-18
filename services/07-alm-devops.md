---
title: "Service 07 — ALM & DevOps"
description: "Application lifecycle management for Power Platform: solution architecture, source-controlled pipelines, environment strategy, and automated deployment from dev through to production."
category: service
related:
  - ../playbooks/alm-pipeline.md
  - ../checklists/alm-solution-readiness.md
  - ../agents/alm-deployment-agent.md
  - ../docs/alm-and-solutions.md
  - ../power-platform/alm-devops-patterns.md
  - ../power-platform/environment-strategy.md
  - ../power-platform/solution-patterns.md
---

# Service 07 — ALM & DevOps

Turn ad-hoc, hand-deployed Power Platform apps into a versioned, gated, repeatable release process: source-controlled solutions, automated pipelines, and an environment strategy that protects production.

## Business Problem & Outcome

Most Power Platform estates start in a single environment, edited live, with no version history and no rollback. The first production incident — a flow deleted, a column renamed, an app overwritten — exposes the gap. This service installs the application lifecycle management (ALM) discipline that makes change safe and fast.

**Pain we solve:**

- Makers editing directly in production with no review or rollback path.
- Solutions that won't import cleanly between environments (missing connection references, hard-coded environment variables, unmanaged-layer drift).
- No audit trail of who changed what, when, or why — a blocker for regulated clients.
- Releases that take hours of manual clicking and break under pressure.
- Inability to run parallel feature work because everyone shares one environment.

**Measurable outcomes:**

- Deployment lead time reduced from hours of manual work to a single pipeline run.
- Zero direct edits in production (enforced by environment roles and managed solutions).
- Full change history in source control, with reviewable diffs per release.
- Repeatable dev → test → prod promotion with documented gates.
- Mean time to recovery (MTTR) improved via versioned, re-importable solution packages.

## Ideal Client Profile

Organisations running business-critical Power Platform workloads that have outgrown single-environment, manual delivery.

**Who buys this:**

- Internal Power Platform Centre of Excellence (CoE) or platform team standardising delivery.
- IT leadership after a production incident caused by an un-versioned change.
- Teams scaling from 1–2 makers to a delivery squad needing parallel work.

**Triggers / signals:**

- "We edit the app directly in production."
- A failed or painful manual go-live, or a change that couldn't be rolled back.
- Audit, ISO, or regulatory pressure for change-control evidence.
- Plans to onboard pro-dev developers alongside citizen makers.
- Existing Azure DevOps or GitHub footprint they want Power Platform to plug into.

## Scope & Deliverables

Concrete artifacts produced by this engagement:

- **Solution architecture** — solution segmentation strategy (one solution vs. multiple), publisher and prefix standard, dependency mapping.
- **Environment strategy document** — environment topology (dev / test / prod, plus optional QA/UAT and per-developer dev environments), naming, DLP alignment, and environment roles.
- **Source control setup** — repository structure for unpacked solutions, branching model (trunk-based or GitFlow-lite), and `.gitignore` for Power Platform artifacts.
- **Pipeline build** — automated export → unpack → commit and pack → import → deploy flow. Implemented via Power Platform Pipelines (in-product) and/or Azure DevOps / GitHub Actions with the Power Platform Build Tools / `pac cli`.
- **Connection references & environment variables** — all environment-specific config externalised so the same managed solution promotes across environments without edits.
- **Deployment settings files** — `deploymentSettings.json` templates per target environment.
- **Release runbook** — step-by-step promotion and rollback procedure.
- **Gated promotion** — approval gates between test and prod with documented sign-off.
- **Handover & enablement** — walkthrough so the client team can run releases independently.

## Out of Scope

- Building the apps, flows, or agents themselves (see Service 01 Power Apps Pro Dev, Service 04 Power Automate Enterprise).
- Tenant-wide governance, DLP authoring, and CoE Starter Kit rollout (see Service 08 Governance & Security).
- Data migration between environments (see Service 09 Migration & Upgrade).
- Azure infrastructure provisioning beyond the DevOps/Actions runner and service connections.
- Ongoing managed run of the pipeline post-handover (see Service 11 Managed Support).
- Licensing procurement — we advise on requirements; the client purchases.

## Engagement Model & Effort

Phased delivery. Effort is indicative and confirmed after discovery.

| T-shirt | Indicative effort | Typical situation |
|---------|-------------------|-------------------|
| **S** | 5–8 days | Single solution, one app/flow set; Power Platform Pipelines (in-product) only; 3-environment topology. |
| **M** | 10–18 days | Multiple solutions with dependencies; Azure DevOps or GitHub Actions pipeline; connection references and environment variables externalised; UAT gate added. |
| **L** | 20–35+ days | Multi-team estate, per-developer dev environments, multiple pipelines, branching policy, automated solution checker, custom gates, and CoE integration. |

**Phases:**

1. **Discovery & assessment** — inventory current solutions, environments, and manual steps; map dependencies.
2. **Design** — solution segmentation, environment topology, branching model, pipeline architecture.
3. **Build** — stand up source control, configure pipelines, externalise environment-specific config.
4. **Validate** — dry-run promotions, rollback test, solution checker pass.
5. **Handover** — runbook walkthrough and team enablement.

**Team roles:**

- ALM / DevOps engineer — pipeline and environment build — see [../agents/alm-deployment-agent.md](../agents/alm-deployment-agent.md).
- Solution architect — segmentation and environment design — see [../agents/solution-architect.md](../agents/solution-architect.md).
- Licensing & capacity advisor — environment and storage sizing — see [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md).
- Security & governance reviewer — environment roles and DLP alignment — see [../agents/security-governance-agent.md](../agents/security-governance-agent.md).

## Indicative Pricing

All figures are **indicative planning ranges only — confirm current rates** before any proposal. Not a quote.

- **Day-rate band:** mid-market professional services band — typically USD 800–1,500 / day depending on seniority and region (indicative — confirm current rates).
- **S:** ~USD 4,000–12,000.
- **M:** ~USD 8,000–27,000.
- **L:** ~USD 16,000–50,000+.

**Pricing model:**

- **Fixed-price** suits S engagements with a well-bounded scope (single solution, in-product Pipelines).
- **Time & materials (T&M)** suits M/L engagements where discovery may reshape the environment topology or pipeline count.
- Generate a structured estimate with `node packages/cli/dist/index.js estimate-licensing` (use `-c gbp` or `-c eur` to switch currency) and capture the commercial proposal with the [../templates/client-proposal-template.md](../templates/client-proposal-template.md).

## Licensing & Capacity Considerations

ALM tooling itself is largely included, but the platform it deploys to often is not. Flag these early.

- **Power Platform Pipelines (in-product)** are available in the Power Platform admin experience; advanced/managed-environment features may require **Managed Environments**, which require **premium licensing** for users in those environments (Needs verification against current Microsoft docs).
- **Managed Environments** capabilities (including some pipeline governance features) require every user in the environment to hold a qualifying premium license — Power Apps Premium, Power Automate Premium, or equivalent (Needs verification against current Microsoft docs).
- **Premium connectors** in the solutions being deployed (SQL Server, custom connectors, HTTP, Dataverse-as-premium scenarios) require **Power Apps Premium** or **Per-App** plans for every user (Needs verification against current Microsoft docs).
- **Dataverse capacity** — each environment consumes Database, File, and Log capacity from the tenant pool. Standing up additional dev/test/UAT environments multiplies storage consumption (Needs verification against current Microsoft docs).
- **Environment count** — additional environments may require available capacity or add-on environment capacity (Needs verification against current Microsoft docs).
- **AI Builder credits** — if deployed solutions contain AI Builder models, credit consumption applies per environment and is **not** transferred by the pipeline; credits must be provisioned in the target tenant/environment (Needs verification against current Microsoft docs).
- **Copilot Studio** — agents have **message-based consumption**; promoting a Copilot Studio solution does not provision message capacity in the target environment (Needs verification against current Microsoft docs).
- **Azure DevOps / GitHub** — pipeline runners (Microsoft-hosted or self-hosted agents/runners) and parallel jobs may carry their own cost outside the Power Platform (Needs verification against current Microsoft docs).

Run the [../checklists/licensing-and-capacity.md](../checklists/licensing-and-capacity.md) and [../checklists/connectors-and-premium.md](../checklists/connectors-and-premium.md) before committing to a topology, and document findings with [../templates/licensing-estimate-template.md](../templates/licensing-estimate-template.md).

## Delivery Approach

Follow the ALM pipeline playbook end to end: [../playbooks/alm-pipeline.md](../playbooks/alm-pipeline.md).

Key steps:

1. Define solution segmentation and publisher per [../power-platform/solution-patterns.md](../power-platform/solution-patterns.md).
2. Externalise environment-specific config using [../power-platform/connection-references.md](../power-platform/connection-references.md) and [../power-platform/environment-variables.md](../power-platform/environment-variables.md).
3. Design the environment topology with [../power-platform/environment-strategy.md](../power-platform/environment-strategy.md).
4. Build export/unpack/pack/import automation following [../power-platform/alm-devops-patterns.md](../power-platform/alm-devops-patterns.md), using `pac cli` commands from [../power-platform/pac-cli-cheatsheet.md](../power-platform/pac-cli-cheatsheet.md).
5. Validate promotions and rollback against test before enabling the production gate.

Reference guidance: [../docs/alm-and-solutions.md](../docs/alm-and-solutions.md).

## Quality Gates

Sign off each gate before advancing.

- **Solution readiness** — [../checklists/alm-solution-readiness.md](../checklists/alm-solution-readiness.md) (segmentation, connection references, environment variables, solution checker pass).
- **Environment readiness** — [../checklists/power-platform-environment.md](../checklists/power-platform-environment.md).
- **Deployment** — [../checklists/deployment.md](../checklists/deployment.md) (dry run, rollback verified, approvals captured).
- **DLP & governance alignment** — [../checklists/dlp-and-governance.md](../checklists/dlp-and-governance.md).

## Related Agents, Docs & Patterns

**Agents:**

- [../agents/alm-deployment-agent.md](../agents/alm-deployment-agent.md) — pipeline and deployment specialist.
- [../agents/solution-architect.md](../agents/solution-architect.md) — solution and environment design.
- [../agents/licensing-capacity-agent.md](../agents/licensing-capacity-agent.md) — capacity and licensing sizing.
- [../agents/security-governance-agent.md](../agents/security-governance-agent.md) — environment roles and DLP.

**Docs:**

- [../docs/alm-and-solutions.md](../docs/alm-and-solutions.md) — ALM concepts and solution model.
- [../docs/delivery-model.md](../docs/delivery-model.md) — how engagements run.

**Patterns:**

- [../power-platform/alm-devops-patterns.md](../power-platform/alm-devops-patterns.md)
- [../power-platform/environment-strategy.md](../power-platform/environment-strategy.md)
- [../power-platform/solution-patterns.md](../power-platform/solution-patterns.md)
- [../power-platform/connection-references.md](../power-platform/connection-references.md)
- [../power-platform/environment-variables.md](../power-platform/environment-variables.md)
- [../power-platform/pac-cli-cheatsheet.md](../power-platform/pac-cli-cheatsheet.md)

**Templates:**

- [../templates/delivery-plan-template.md](../templates/delivery-plan-template.md)
- [../templates/deployment-checklist.md](../templates/deployment-checklist.md)
- [../templates/risk-register-template.md](../templates/risk-register-template.md)

## Risks & Assumptions

**Assumptions:**

- Client has tenant admin or Power Platform admin access to create environments and configure pipelines, plus rights in Azure DevOps / GitHub if used.
- Existing solutions can be segmented into managed solutions without major refactoring; significant unmanaged-layer drift is treated as additional scope.
- Required premium licences and Dataverse capacity for additional environments are available or will be procured by the client.
- One nominated client owner will run releases after handover.

**Risks:**

- **Unmanaged customisations in production** — un-layering existing unmanaged solutions can be time-consuming and may surface hidden dependencies. Mitigate with the assessment phase and [../templates/risk-register-template.md](../templates/risk-register-template.md).
- **Capacity exhaustion** — adding dev/test/UAT environments may exceed available Dataverse capacity. Mitigate by sizing up front via the licensing checklist (Needs verification against current Microsoft docs).
- **Connection/auth drift** — connection references not externalised cause import failures. Mitigate per the solution-readiness gate.
- **Org change resistance** — makers used to editing production may resist the gated process. Mitigate with enablement and clear environment roles.
- **Tooling cost** — Microsoft-hosted runner minutes and parallel jobs in DevOps/GitHub can carry separate cost (Needs verification against current Microsoft docs).
