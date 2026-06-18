---
title: "Service Catalogue"
description: "Index of the 15 commercial Power Platform service offerings an agency can scope, sell, and deliver with this toolkit."
category: service-index
related:
  - ../docs/commercial-offers.md
  - ../docs/delivery-model.md
---

# Service Catalogue

This directory defines **15 commercial service offerings** an agency can package, price, and deliver on the Microsoft Power Platform. Each offering is a self-contained service definition: the business problem it solves, the ideal client profile, scope and deliverables, what is explicitly out of scope, engagement model and effort sizing, **indicative** pricing guidance, licensing and capacity warnings, the playbooks that drive delivery, the quality gates that gate it, and the agents that staff it.

The catalogue is designed so that any single service can be sold standalone or composed with others into a larger engagement. Services cross-reference each other where work naturally hands off (for example, an app build that needs a data model, automation, or a portal). Use the table below as the entry point, then open the individual service file for full scope and pricing detail.

> **Pricing note.** Every figure in these files is an **indicative planning range, not a quote**. Confirm current day-rates, Microsoft licensing, and Azure consumption per engagement before committing anything to a client. Never present a number from this repo as a firm price.

## The 15 Services

| # | Service | One-line description | Link |
|---|---------|----------------------|------|
| 01 | Power Apps Pro Dev | Canvas and model-driven app development | [./01-power-apps-pro-dev.md](./01-power-apps-pro-dev.md) |
| 02 | Copilot Studio Agents | AI agent and copilot implementation | [./02-copilot-studio-agents.md](./02-copilot-studio-agents.md) |
| 03 | Dataverse Advanced | Complex data modeling and relationships | [./03-dataverse-advanced.md](./03-dataverse-advanced.md) |
| 04 | Power Automate Enterprise | Enterprise automation and integration | [./04-power-automate-enterprise.md](./04-power-automate-enterprise.md) |
| 05 | Power Pages Portals | External-facing portal development | [./05-power-pages-portals.md](./05-power-pages-portals.md) |
| 06 | Power BI Embedded Analytics | Reporting and dashboard integration | [./06-pbi-embedded-analytics.md](./06-pbi-embedded-analytics.md) |
| 07 | ALM & DevOps | Application lifecycle management | [./07-alm-devops.md](./07-alm-devops.md) |
| 08 | Governance & Security | Security review and governance setup | [./08-governance-security.md](./08-governance-security.md) |
| 09 | Migration & Upgrade | Legacy system migration to Power Platform | [./09-migration-upgrade.md](./09-migration-upgrade.md) |
| 10 | Training & Enablement | Team training and knowledge transfer | [./10-training-enablement.md](./10-training-enablement.md) |
| 11 | Managed Support | Ongoing support and maintenance | [./11-managed-support.md](./11-managed-support.md) |
| 12 | Discovery & Assessment | Requirements gathering and feasibility study | [./12-discovery-assessment.md](./12-discovery-assessment.md) |
| 13 | Integration Platform | Third-party system integrations | [./13-integration-platform.md](./13-integration-platform.md) |
| 14 | Rapid Prototyping | Quick proof-of-concept development | [./14-rapid-prototyping.md](./14-rapid-prototyping.md) |
| 15 | Audit & Compliance | Security audit and compliance review | [./15-audit-compliance.md](./15-audit-compliance.md) |

## How to Use This Catalogue

Each service is the **commercial wrapper**. Delivery is driven by three operational asset types, all linked from the individual service files using relative paths:

1. **Playbooks (`../playbooks/`)** — the step-by-step delivery workflow. A service tells you *what* you are selling; a playbook tells you *how* to build it. Follow the playbook in order; do not freelance the build sequence.
2. **Checklists (`../checklists/`)** — the quality gates. No phase advances until the relevant checklist passes. Licensing, scope, security, and deployment all have dedicated checklists.
3. **Agents (`../agents/`)** — the roles that staff the engagement. Each service names the agents that lead, architect, build, and QA the work, plus the licensing/capacity reviewer that signs off cost.

### Typical service-to-asset mapping

| Service | Primary playbooks | Key checklists | Lead agents |
|---------|-------------------|----------------|-------------|
| 01 Power Apps Pro Dev | [canvas-app](../playbooks/canvas-app.md), [model-driven-app](../playbooks/model-driven-app.md) | [qa](../checklists/qa.md), [deployment](../checklists/deployment.md) | [power-apps-agent](../agents/power-apps-agent.md), [solution-architect](../agents/solution-architect.md) |
| 02 Copilot Studio Agents | [copilot-studio-agent](../playbooks/copilot-studio-agent.md), [ai-builder-gpt-prompts](../playbooks/ai-builder-gpt-prompts.md) | [copilot-studio-readiness](../checklists/copilot-studio-readiness.md), [ai-builder-readiness](../checklists/ai-builder-readiness.md) | [copilot-studio-agent](../agents/copilot-studio-agent.md), [ai-builder-agent](../agents/ai-builder-agent.md) |
| 03 Dataverse Advanced | [dataverse-solution](../playbooks/dataverse-solution.md) | [dataverse-security](../checklists/dataverse-security.md) | [dataverse-agent](../agents/dataverse-agent.md), [solution-architect](../agents/solution-architect.md) |
| 04 Power Automate Enterprise | [power-automate-cloud-flow](../playbooks/power-automate-cloud-flow.md), [power-automate-desktop-rpa](../playbooks/power-automate-desktop-rpa.md), [approval-workflows](../playbooks/approval-workflows.md) | [connectors-and-premium](../checklists/connectors-and-premium.md), [qa](../checklists/qa.md) | [power-automate-agent](../agents/power-automate-agent.md), [desktop-rpa-agent](../agents/desktop-rpa-agent.md) |
| 05 Power Pages Portals | [power-pages-site](../playbooks/power-pages-site.md) | [dataverse-security](../checklists/dataverse-security.md), [deployment](../checklists/deployment.md) | [solution-architect](../agents/solution-architect.md), [security-governance-agent](../agents/security-governance-agent.md) |
| 06 Power BI Embedded Analytics | [dataverse-solution](../playbooks/dataverse-solution.md) | [qa](../checklists/qa.md), [licensing-and-capacity](../checklists/licensing-and-capacity.md) | [solution-architect](../agents/solution-architect.md), [qa-test-agent](../agents/qa-test-agent.md) |
| 07 ALM & DevOps | [alm-pipeline](../playbooks/alm-pipeline.md) | [alm-solution-readiness](../checklists/alm-solution-readiness.md), [deployment](../checklists/deployment.md) | [alm-deployment-agent](../agents/alm-deployment-agent.md), [solution-architect](../agents/solution-architect.md) |
| 08 Governance & Security | [governance-audit](../playbooks/governance-audit.md) | [dlp-and-governance](../checklists/dlp-and-governance.md), [dataverse-security](../checklists/dataverse-security.md) | [security-governance-agent](../agents/security-governance-agent.md) |
| 09 Migration & Upgrade | [sharepoint-to-dataverse-migration](../playbooks/sharepoint-to-dataverse-migration.md), [dataverse-solution](../playbooks/dataverse-solution.md) | [dataverse-security](../checklists/dataverse-security.md), [deployment](../checklists/deployment.md) | [dataverse-agent](../agents/dataverse-agent.md), [solution-architect](../agents/solution-architect.md) |
| 10 Training & Enablement | [governance-audit](../playbooks/governance-audit.md) | [support-handover](../checklists/support-handover.md) | [support-runbook-agent](../agents/support-runbook-agent.md), [commercial-strategy-agent](../agents/commercial-strategy-agent.md) |
| 11 Managed Support | [production-support](../playbooks/production-support.md) | [support-handover](../checklists/support-handover.md) | [support-runbook-agent](../agents/support-runbook-agent.md), [qa-test-agent](../agents/qa-test-agent.md) |
| 12 Discovery & Assessment | [governance-audit](../playbooks/governance-audit.md) | [project-intake](../checklists/project-intake.md), [scope-validation](../checklists/scope-validation.md) | [solution-architect](../agents/solution-architect.md), [licensing-capacity-agent](../agents/licensing-capacity-agent.md) |
| 13 Integration Platform | [custom-connector](../playbooks/custom-connector.md), [azure-function-integration](../playbooks/azure-function-integration.md), [microsoft-graph-integration](../playbooks/microsoft-graph-integration.md) | [connectors-and-premium](../checklists/connectors-and-premium.md), [qa](../checklists/qa.md) | [connector-integration-agent](../agents/connector-integration-agent.md), [solution-architect](../agents/solution-architect.md) |
| 14 Rapid Prototyping | [canvas-app](../playbooks/canvas-app.md), [agent-flow-workflow](../playbooks/agent-flow-workflow.md) | [scope-validation](../checklists/scope-validation.md), [licensing-and-capacity](../checklists/licensing-and-capacity.md) | [power-apps-agent](../agents/power-apps-agent.md), [solution-architect](../agents/solution-architect.md) |
| 15 Audit & Compliance | [governance-audit](../playbooks/governance-audit.md) | [dlp-and-governance](../checklists/dlp-and-governance.md), [dataverse-security](../checklists/dataverse-security.md) | [security-governance-agent](../agents/security-governance-agent.md), [qa-test-agent](../agents/qa-test-agent.md) |

> The mapping above is indicative. The authoritative, full asset list for each service lives in that service's own file under **Delivery Approach**, **Quality Gates**, and **Related Agents** sections.

### Generating client artifacts with the pp-agency CLI

The catalogue is markdown-first. Turn a chosen service into client-facing documents with the `pp-agency` CLI rather than hand-authoring from scratch:

```bash
# Scaffold a new client engagement (pick the type that matches the service)
pp-agency new-project <client-name> --type power-apps   # 01, 14
pp-agency new-project <client-name> --type copilot      # 02
pp-agency new-project <client-name> --type integration  # 04, 13

# Produce the commercial documents
pp-agency generate-prd                 # requirements / PRD
pp-agency generate-solution-design     # technical design
pp-agency estimate-licensing -c usd    # per-currency licensing companion (usd|gbp|eur)

# Pull a checklist or agent brief on demand
pp-agency checklist -t qa              # or: deployment | scope-validation | licensing-and-capacity
pp-agency agent-brief <agent-name>     # brief a role from ../agents/

# Validate the engagement folder before sharing
pp-agency validate -p <path>
```

Always run `pp-agency validate` before sending anything to a client, and confirm every licensing figure against current Microsoft documentation.

## Licensing Warning (applies to every service)

Licensing is the single most common source of go-live surprises. Flag every premium dependency during design, never at deployment. All specific figures in this catalogue are marked **(Needs verification against current Microsoft docs)** and must be re-confirmed per engagement:

- **Premium connectors** (SQL Server, custom connectors, HTTP, and others) require **Power Apps Premium per-user** or **per-app** plans — seeded Microsoft 365 licensing will not cover them.
- **Power Apps Per-App vs Per-User** — per-app suits narrow rollouts; per-user suits power users. Model both before recommending (**Needs verification against current Microsoft docs**).
- **AI Builder credits** — every AI Builder model (form processing, prediction, GPT prompts) consumes a metered credit pool. Budget separately (**Needs verification against current Microsoft docs**).
- **Copilot Studio messages** — agent conversations consume a separate metered message capacity (**Needs verification against current Microsoft docs**).
- **Dataverse capacity** — database, file, and log storage are metered against tenant entitlements; large tables, attachments, and audit logging can exceed them (**Needs verification against current Microsoft docs**).
- **Power Pages capacity** — external portals are billed per authenticated/anonymous user or capacity pack (**Needs verification against current Microsoft docs**).

See [../checklists/licensing-and-capacity.md](../checklists/licensing-and-capacity.md) and [../checklists/connectors-and-premium.md](../checklists/connectors-and-premium.md) for the validation gates, and [../docs/licensing-and-capacity.md](../docs/licensing-and-capacity.md) for the extended reference.

## Commercial & Delivery Narrative

This catalogue describes the *services*. For the surrounding commercial and operational story, read:

- **[../docs/commercial-offers.md](../docs/commercial-offers.md)** — how these 15 services are bundled into commercial offers, packaging, positioning, and the buying motion.
- **[../docs/delivery-model.md](../docs/delivery-model.md)** — the end-to-end delivery model (discovery → design → build → QA → deploy → handover), the agent swarm, and how playbooks and checklists gate each phase.

Together they explain *what* you sell (this catalogue), *how you package and price it* (commercial-offers), and *how you deliver it reliably* (delivery-model).
