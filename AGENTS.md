# Multi-Agent Swarm Orchestration Guide

> This document defines how the 16 specialized agents in [`agents/`](agents/) coordinate to deliver Power Platform projects from discovery to production. Each agent is a markdown role definition; the [Swarm Orchestrator](agents/swarm-orchestrator.md) sequences them.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [The 16 Agents](#the-16-agents)
3. [Agent Handoff Protocol](#agent-handoff-protocol)
4. [Swarm Workflow Diagram](#swarm-workflow-diagram)
5. [Agent Activation Rules](#agent-activation-rules)
6. [Validation Gates](#validation-gates)
7. [Mapping Agents to Commercial Services](#mapping-agents-to-commercial-services)
8. [Example: Client Project Lifecycle](#example-client-project-lifecycle)
9. [Adding New Agents](#adding-new-agents)
10. [Quality Standards](#quality-standards)
11. [Failure Handling](#failure-handling)

---

## Architecture Overview

The delivery swarm follows a **pipeline architecture** with feedback loops, conducted by the [Swarm Orchestrator](agents/swarm-orchestrator.md):

```
Discovery -> Design -> Build -> Test -> Deploy -> Operate
   ^          ^        ^       ^       ^         |
   |          |        |       |       |         |
   +----------+--------+-------+-------+---------+
                        (feedback)
```

Each stage is owned by one or more agents. Agents communicate through:

1. **Markdown files** written to shared project directories (scaffolded under [`projects/`](projects/README.md))
2. **Checklist validation** in [`checklists/`](checklists/) as quality gates
3. **Playbook stages** in [`playbooks/`](playbooks/) as workflow definitions
4. **CLI commands** (`pp-agency`, see [`packages/cli/README.md`](packages/cli/README.md)) as operational interfaces

Each agent role lives as a single markdown file in [`agents/`](agents/). There are no YAML agent files and no system-prompt directory — read the agent's `.md` file directly to understand its scope, inputs, outputs, and handoff rules.

---

## The 16 Agents

The swarm is composed of exactly 16 agents. The orchestration sequence, handoff contracts, parallel-execution rules, and validation gates are defined in detail in [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md).

### Orchestration

#### 1. Swarm Orchestrator ([`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md))
- **Role**: Master coordination — activates, sequences, and manages all other agents
- **Responsibilities**: Agent activation sequencing, input/output contracts, validation gates, failure/retry handling, parallel-safety decisions, final quality gate before client delivery
- **Inputs**: Client engagement trigger, discovery outputs, business objectives, timeline/budget constraints
- **Outputs**: Activation sequence, handoff contracts, gate decisions, project status
- **Handoffs To**: every other agent (it is the conductor)
- **Activation**: Project start and every phase transition

### Discovery & Intelligence Agents

#### 2. Platform Cartographer ([`agents/platform-cartographer.md`](agents/platform-cartographer.md))
- **Role**: Maps the current state of the Power Platform ecosystem (capabilities, licensing, release plans, deprecations, regional availability)
- **Responsibilities**: Build capability maps, licensing matrices, release-plan trackers, and risk flags grounded in current Microsoft Learn content
- **Inputs**: Microsoft Learn URLs, release-plan notes, admin-center observations, licensing docs
- **Outputs**: Platform capability map, licensing matrix, release tracker, risk flags
- **Handoffs To**: solution-architect
- **Activation**: Phase 1, before architecture; refreshed when platform facts may have changed

#### 3. Licensing/Capacity Agent ([`agents/licensing-capacity-agent.md`](agents/licensing-capacity-agent.md))
- **Role**: Translates a component inventory into license requirements and a cost projection
- **Responsibilities**: Identify premium dependencies, model per-app vs per-user, size AI Builder credits, Copilot Studio messages, Dataverse and Power Pages capacity
- **Inputs**: Component inventory from solution-architect, platform capability map
- **Outputs**: License requirements, cost projection, capacity warnings
- **Handoffs To**: solution-architect, commercial-strategy-agent
- **Activation**: During architecture (parallel with design); revisited at deployment
- **Checklist**: [`checklists/licensing-and-capacity.md`](checklists/licensing-and-capacity.md), [`checklists/connectors-and-premium.md`](checklists/connectors-and-premium.md)

### Design Agents

#### 4. Solution Architect ([`agents/solution-architect.md`](agents/solution-architect.md))
- **Role**: Translates requirements into the correct Power Platform technology stack — the "right tool for the job" decision owner
- **Responsibilities**: Produce ADRs, a technology selection matrix, pattern recommendations, trade-off analysis, and a solution blueprint. Does not write code
- **Inputs**: Business requirements, capability map (cartographer), licensing matrix, integration/security constraints
- **Outputs**: ADRs, technology matrix, solution blueprint, trade-off analysis
- **Handoffs To**: power-apps-agent, power-automate-agent, dataverse-agent, copilot-studio-agent, ai-builder-agent, desktop-rpa-agent, connector-integration-agent (per the selected stack); escalates to commercial-strategy-agent
- **Activation**: After Platform Cartographer completes (Validation Gate 1)
- **Template**: [`templates/solution-design-template.md`](templates/solution-design-template.md), [`templates/architecture-decision-record.md`](templates/architecture-decision-record.md)

### Build Agents

#### 5. Power Apps Agent ([`agents/power-apps-agent.md`](agents/power-apps-agent.md))
- **Role**: Designs canvas and model-driven apps (and Power Pages app surfaces)
- **Inputs**: App type recommendation, screen inventory, data source spec from solution-architect
- **Outputs**: App design specifications, component library, screen/UX flows
- **Handoffs To**: qa-test-agent, alm-deployment-agent
- **Playbooks**: [`playbooks/canvas-app.md`](playbooks/canvas-app.md), [`playbooks/model-driven-app.md`](playbooks/model-driven-app.md), [`playbooks/power-pages-site.md`](playbooks/power-pages-site.md)

#### 6. Power Automate Agent ([`agents/power-automate-agent.md`](agents/power-automate-agent.md))
- **Role**: Designs cloud flows, approval workflows, and integration automations
- **Inputs**: Automation requirements, integration points, premium-connector list from solution-architect
- **Outputs**: Flow designs, connection references, error-handling patterns
- **Handoffs To**: qa-test-agent, alm-deployment-agent
- **Playbooks**: [`playbooks/power-automate-cloud-flow.md`](playbooks/power-automate-cloud-flow.md), [`playbooks/approval-workflows.md`](playbooks/approval-workflows.md), [`playbooks/agent-flow-workflow.md`](playbooks/agent-flow-workflow.md)

#### 7. Dataverse Agent ([`agents/dataverse-agent.md`](agents/dataverse-agent.md))
- **Role**: Designs the data model — tables, relationships, business rules, and security model
- **Inputs**: Entity requirements, security model from solution-architect
- **Outputs**: Table designs, relationships, business rules, row-level security model
- **Handoffs To**: power-apps-agent, power-automate-agent, qa-test-agent
- **Playbooks**: [`playbooks/dataverse-solution.md`](playbooks/dataverse-solution.md), [`playbooks/sharepoint-to-dataverse-migration.md`](playbooks/sharepoint-to-dataverse-migration.md)
- **Checklist**: [`checklists/dataverse-security.md`](checklists/dataverse-security.md)

#### 8. Copilot Studio Agent ([`agents/copilot-studio-agent.md`](agents/copilot-studio-agent.md))
- **Role**: Designs conversational AI — topics, knowledge sources, actions, and escalation
- **Inputs**: Agent purpose/scope, knowledge source spec, channel plan from solution-architect
- **Outputs**: Agent definitions, topic configurations, knowledge-grounding setup
- **Handoffs To**: qa-test-agent, alm-deployment-agent
- **Playbook**: [`playbooks/copilot-studio-agent.md`](playbooks/copilot-studio-agent.md)
- **Checklist**: [`checklists/copilot-studio-readiness.md`](checklists/copilot-studio-readiness.md)

#### 9. AI Builder Agent ([`agents/ai-builder-agent.md`](agents/ai-builder-agent.md))
- **Role**: Designs AI/ML components — document processing, prediction, classification, GPT prompts
- **Inputs**: Model type, document types, output schema, accuracy targets from solution-architect
- **Outputs**: Model design, training-data spec, human-review workflow
- **Handoffs To**: qa-test-agent, power-automate-agent (for consumption)
- **Playbooks**: [`playbooks/document-processing-ai-builder.md`](playbooks/document-processing-ai-builder.md), [`playbooks/ai-builder-gpt-prompts.md`](playbooks/ai-builder-gpt-prompts.md)
- **Checklist**: [`checklists/ai-builder-readiness.md`](checklists/ai-builder-readiness.md)

#### 10. Desktop RPA Agent ([`agents/desktop-rpa-agent.md`](agents/desktop-rpa-agent.md))
- **Role**: Designs desktop automation (Power Automate Desktop / RPA), attended and unattended
- **Inputs**: Desktop applications involved, attended/unattended recommendation, machine specs from solution-architect
- **Outputs**: Desktop flow designs, credential/machine plan, error-handling patterns
- **Handoffs To**: qa-test-agent, alm-deployment-agent
- **Playbook**: [`playbooks/power-automate-desktop-rpa.md`](playbooks/power-automate-desktop-rpa.md)

#### 11. Connector Integration Agent ([`agents/connector-integration-agent.md`](agents/connector-integration-agent.md))
- **Role**: Designs custom connectors and complex external integrations
- **Inputs**: Target API spec, auth requirements, operations, rate limits from solution-architect
- **Outputs**: Custom connector definitions, integration patterns, auth design
- **Handoffs To**: power-automate-agent, qa-test-agent
- **Playbooks**: [`playbooks/custom-connector.md`](playbooks/custom-connector.md), [`playbooks/azure-function-integration.md`](playbooks/azure-function-integration.md), [`playbooks/microsoft-graph-integration.md`](playbooks/microsoft-graph-integration.md)
- **Checklist**: [`checklists/connectors-and-premium.md`](checklists/connectors-and-premium.md)

### Governance & Security Agent

#### 12. Security/Governance Agent ([`agents/security-governance-agent.md`](agents/security-governance-agent.md))
- **Role**: Security review, DLP policy, and governance compliance
- **Responsibilities**: Review architecture and built solution for security, define DLP policies, produce compliance evidence, sign off before deployment
- **Inputs**: Architecture design, built solution, security test results
- **Outputs**: Security review, DLP policies, compliance checklist, security sign-off
- **Handoffs To**: solution-architect (during design), alm-deployment-agent (pre-deploy)
- **Activation**: Parallel with architecture and again at the quality gate
- **Playbook**: [`playbooks/governance-audit.md`](playbooks/governance-audit.md)
- **Checklist**: [`checklists/dlp-and-governance.md`](checklists/dlp-and-governance.md), [`checklists/dataverse-security.md`](checklists/dataverse-security.md)

### Quality, Deployment & Support Agents

#### 13. QA/Test Agent ([`agents/qa-test-agent.md`](agents/qa-test-agent.md))
- **Role**: Quality assurance and testing — test planning, execution, defect tracking, UAT sign-off
- **Inputs**: All solution components, test cases
- **Outputs**: Test plan, test results, defect log, UAT sign-off
- **Handoffs To**: alm-deployment-agent
- **Activation**: After build complete (Phase 4)
- **Checklist**: [`checklists/qa.md`](checklists/qa.md)
- **Template**: [`templates/qa-checklist.md`](templates/qa-checklist.md)

#### 14. ALM/Deployment Agent ([`agents/alm-deployment-agent.md`](agents/alm-deployment-agent.md))
- **Role**: Application lifecycle management and deployment — environment promotion, solution layering, release
- **Inputs**: Solution packages, environment configs, security sign-off
- **Outputs**: Pipeline configuration, deployment report, release notes
- **Handoffs To**: support-runbook-agent
- **Activation**: After Validation Gate 4 (quality gate)
- **Playbook**: [`playbooks/alm-pipeline.md`](playbooks/alm-pipeline.md)
- **Checklist**: [`checklists/alm-solution-readiness.md`](checklists/alm-solution-readiness.md), [`checklists/deployment.md`](checklists/deployment.md)

#### 15. Support/Runbook Agent ([`agents/support-runbook-agent.md`](agents/support-runbook-agent.md))
- **Role**: Support model, runbooks, and knowledge transfer for steady-state operation
- **Inputs**: Solution documentation, known issues, deployment report
- **Outputs**: Support model, runbooks, knowledge base, handover document
- **Handoffs To**: commercial-strategy-agent (project closeout)
- **Activation**: Parallel with deployment (Phase 5)
- **Playbook**: [`playbooks/production-support.md`](playbooks/production-support.md)
- **Checklist**: [`checklists/support-handover.md`](checklists/support-handover.md)
- **Template**: [`templates/support-runbook-template.md`](templates/support-runbook-template.md), [`templates/handover-document-template.md`](templates/handover-document-template.md)

#### 16. Commercial Strategy Agent ([`agents/commercial-strategy-agent.md`](agents/commercial-strategy-agent.md))
- **Role**: Business-facing — packages services into sellable offerings, structures pricing, writes proposals, identifies upsell
- **Inputs**: Solution scope (architect), licensing/cost (licensing-capacity-agent), effort estimates from build agents
- **Outputs**: Service package design, risk-adjusted pricing, client proposal, SOW closeout, upsell map
- **Handoffs To**: client (proposal/acceptance); receives escalations from solution-architect
- **Activation**: Project shaping (pre-engagement) and project close
- **Services**: maps to the 15 offerings in [`services/`](services/README.md)
- **Template**: [`templates/client-proposal-template.md`](templates/client-proposal-template.md), [`templates/scope-of-work-template.md`](templates/scope-of-work-template.md)

---

## Agent Handoff Protocol

### Handoff Process

1. **Complete Work** — Agent finishes its stage
2. **Self-Validate** — Agent runs the relevant checklist from [`checklists/`](checklists/)
3. **Document Output** — Agent writes deliverables to the project directory under [`projects/`](projects/README.md)
4. **Create Handoff Note** — Agent documents what was done and what's next (the contract format below)
5. **Notify Next Agent** — Explicit handoff with context, sequenced by the [Swarm Orchestrator](agents/swarm-orchestrator.md)

### Handoff Contract Format

Every handoff follows the contract defined in [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md):

```markdown
# Handoff: [From Agent] -> [To Agent]

## Completed Work
- [List of completed items]

## Deliverables
- relative/path/to/deliverable1.md - Description
- relative/path/to/deliverable2.md - Description

## Validation Status
- [x] Checklist 1: PASSED
- [x] Checklist 2: PASSED

## Context for Next Agent
- Key decisions made
- Known issues or limitations
- Dependencies on other work

## Next Steps
- What the next agent should do
- Suggested priority order
```

Each receiving agent's `.md` file documents the **trigger** and the required **package** for inbound handoffs — see the "Handoff Rules" section in [`agents/solution-architect.md`](agents/solution-architect.md) for a worked example.

---

## Swarm Workflow Diagram

```
                    +------------------+
                    | SWARM ORCHESTRATOR|
                    | (conducts all)    |
                    +--------+---------+
                             |
                    +--------v---------+
                    | PLATFORM          |
                    | CARTOGRAPHER      |
                    | - Capability map  |
                    | - Licensing matrix|
                    | - Risk flags      |
                    +--------+---------+
                             |
                    +--------v---------+
                    | SOLUTION ARCHITECT|
                    | - ADRs            |
                    | - Tech matrix     |
                    | - Blueprint       |
                    +--------+---------+
                             |
        +--------------------+--------------------+
        | (parallel during architecture)         |
 +------v-----------+                  +----------v---------+
 | LICENSING/       |                  | SECURITY/          |
 | CAPACITY AGENT   |                  | GOVERNANCE AGENT   |
 | - Cost projection|                  | - Security review  |
 | - Capacity       |                  | - DLP policies     |
 +------+-----------+                  +----------+---------+
        |                                         |
        +-------------------+---------------------+
                            |
                  [Validation Gate 1: Architecture]
                            |
      +---------+-----------+-----------+----------+----------+----------+
      |         |           |           |          |          |          |
 +----v---+ +---v----+ +----v----+ +----v----+ +---v----+ +---v----+ +--v-----+
 | POWER  | | POWER  | | DATA-   | | COPILOT | | AI     | | DESKTOP| | CONN.  |
 | APPS   | | AUTO-  | | VERSE   | | STUDIO  | | BUILDER| | RPA    | | INTEG. |
 | AGENT  | | MATE   | | AGENT   | | AGENT   | | AGENT  | | AGENT  | | AGENT  |
 +----+---+ +---+----+ +----+----+ +----+----+ +---+----+ +---+----+ +--+-----+
      |         |           |           |          |          |          |
      +---------+-----------+-----+-----+----------+----------+----------+
                                  |
                  [Validation Gate 2: Design] -> [Gate 3: Build Complete]
                                  |
                        +---------v---------+
                        |   QA/TEST AGENT   |
                        | - Test execution  |
                        | - UAT sign-off    |
                        +---------+---------+
                                  |
                  [Validation Gate 4: Quality Gate]
                  (Security/Governance final review here too)
                                  |
                        +---------v---------+
                        | ALM/DEPLOYMENT    |
                        | AGENT             |
                        | - UAT -> PROD     |
                        +---------+---------+
                                  |
                        +---------v---------+
                        | SUPPORT/RUNBOOK   |
                        | AGENT (parallel)  |
                        | - Runbooks        |
                        | - Knowledge base  |
                        +---------+---------+
                                  |
                        +---------v---------+
                        | COMMERCIAL        |
                        | STRATEGY AGENT    |
                        | - SOW closeout    |
                        | - Upsell map      |
                        +---------+---------+
                                  |
                  [Validation Gate 5: Client Acceptance]
                                  |
                        +---------v---------+
                        |   PROJECT CLOSE   |
                        +-------------------+
```

The authoritative phase/step sequence, durations, and gate criteria are in [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md).

---

## Agent Activation Rules

### Activation Triggers

| Trigger | Activated Agents |
|---------|------------------|
| New project / engagement trigger | swarm-orchestrator, platform-cartographer |
| Capability map ready | solution-architect |
| Architecture in progress | licensing-capacity-agent (parallel), security-governance-agent (parallel) |
| Architecture approved (Gate 1) | power-apps-agent, power-automate-agent, dataverse-agent (per selected stack) |
| AI / conversational scope selected | copilot-studio-agent, ai-builder-agent |
| Desktop or custom-integration scope selected | desktop-rpa-agent, connector-integration-agent |
| Build complete (Gate 3) | qa-test-agent, security-governance-agent (final review) |
| Quality gate passed (Gate 4) | alm-deployment-agent |
| Deployment in progress | support-runbook-agent (parallel) |
| Project close | commercial-strategy-agent |
| Escalation required | solution-architect, then commercial-strategy-agent (commercial impact) |

### Parallel Execution

These agents run in parallel when component boundaries are clear (see "Parallel Execution Rules" in [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md)):

- **licensing-capacity-agent** + **security-governance-agent** — during architecture
- **All build agents** — during implementation, with clear component ownership
- **qa-test-agent** + **security-governance-agent** (final review) — during the test phase
- **support-runbook-agent** + **alm-deployment-agent** — during deployment

### Conditional Activation

| Condition | Additional Agents |
|-----------|-------------------|
| Conversational AI in scope | copilot-studio-agent |
| Document/prediction AI in scope | ai-builder-agent |
| Complex data model | dataverse-agent |
| External / custom integrations | connector-integration-agent |
| Desktop / legacy UI automation | desktop-rpa-agent |
| External-facing portal | power-apps-agent (Power Pages) + security-governance-agent |
| Compliance requirements | security-governance-agent (extended) |

---

## Validation Gates

### Gate Structure

Every stage transition requires passing a validation gate, owned by the [Swarm Orchestrator](agents/swarm-orchestrator.md):

```
Stage N Output -> Checklist Validation -> Gate -> Stage N+1 Input
```

### Gate Requirements

| Gate | Checklist | Required Agents |
|------|-----------|-----------------|
| Gate 1: Architecture | [`project-intake`](checklists/project-intake.md), [`scope-validation`](checklists/scope-validation.md), [`licensing-and-capacity`](checklists/licensing-and-capacity.md) | solution-architect, licensing-capacity-agent, security-governance-agent |
| Gate 2: Design | [`dataverse-security`](checklists/dataverse-security.md), [`connectors-and-premium`](checklists/connectors-and-premium.md), [`copilot-studio-readiness`](checklists/copilot-studio-readiness.md), [`ai-builder-readiness`](checklists/ai-builder-readiness.md) | build agents, security-governance-agent |
| Gate 3: Build Complete | [`qa`](checklists/qa.md), [`power-platform-environment`](checklists/power-platform-environment.md) | build agents, qa-test-agent |
| Gate 4: Quality | [`qa`](checklists/qa.md), [`dlp-and-governance`](checklists/dlp-and-governance.md) | qa-test-agent, security-governance-agent |
| Gate 5: Deploy / Acceptance | [`alm-solution-readiness`](checklists/alm-solution-readiness.md), [`deployment`](checklists/deployment.md), [`support-handover`](checklists/support-handover.md) | alm-deployment-agent, support-runbook-agent |

Run a checklist against an engagement folder with the CLI:

```bash
node packages/cli/dist/index.js validate --project ./projects/<client-name>
```

Generate a fresh phase checklist into a project with:

```bash
node packages/cli/dist/index.js checklist --type deployment --output ./projects/<client-name>/checklists/deployment.md
```

`--type` accepts: `project-intake`, `scope-validation`, `deployment`, `qa`, `governance`, `support-handover`.

### Gate Failure Handling

If a gate fails:

1. **Block progression** — the next stage cannot start
2. **Create remediation task** — assigned to the responsible agent
3. **Re-validate** — must pass before proceeding
4. **Document exception** — if a waiver is needed, the solution-architect (and, for commercial impact, the commercial-strategy-agent) approves with a documented rationale

The orchestrator's gate outcomes are `GO`, `GO_WITH_CONDITIONS`, `NO_GO`, and `HALT` — see [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md).

---

## Mapping Agents to Commercial Services

Agents staff the 15 commercial offerings catalogued in [`services/`](services/README.md). When the [Commercial Strategy Agent](agents/commercial-strategy-agent.md) scopes an engagement, it selects a service offering, and the orchestrator activates the agents that offering names as its lead/build/QA roles.

| Service | Lead agents |
|---------|-------------|
| [01 Power Apps Pro Dev](services/01-power-apps-pro-dev.md) | power-apps-agent, solution-architect |
| [02 Copilot Studio Agents](services/02-copilot-studio-agents.md) | copilot-studio-agent, ai-builder-agent |
| [03 Dataverse Advanced](services/03-dataverse-advanced.md) | dataverse-agent, solution-architect |
| [04 Power Automate Enterprise](services/04-power-automate-enterprise.md) | power-automate-agent, desktop-rpa-agent |
| [05 Power Pages Portals](services/05-power-pages-portals.md) | solution-architect, security-governance-agent |
| [06 Power BI Embedded Analytics](services/06-pbi-embedded-analytics.md) | solution-architect, qa-test-agent |
| [07 ALM & DevOps](services/07-alm-devops.md) | alm-deployment-agent, solution-architect |
| [08 Governance & Security](services/08-governance-security.md) | security-governance-agent |
| [09 Migration & Upgrade](services/09-migration-upgrade.md) | dataverse-agent, solution-architect |
| [10 Training & Enablement](services/10-training-enablement.md) | support-runbook-agent, commercial-strategy-agent |
| [11 Managed Support](services/11-managed-support.md) | support-runbook-agent, qa-test-agent |
| [12 Discovery & Assessment](services/12-discovery-assessment.md) | solution-architect, licensing-capacity-agent |
| [13 Integration Platform](services/13-integration-platform.md) | connector-integration-agent, solution-architect |
| [14 Rapid Prototyping](services/14-rapid-prototyping.md) | power-apps-agent, solution-architect |
| [15 Audit & Compliance](services/15-audit-compliance.md) | security-governance-agent, qa-test-agent |

For the commercial packaging and delivery narrative, see [`docs/commercial-offers.md`](docs/commercial-offers.md) and [`docs/delivery-model.md`](docs/delivery-model.md).

---

## Example: Client Project Lifecycle

### Project: ACME Corp Customer Portal

First, scaffold the engagement workspace under [`projects/`](projects/README.md):

```bash
npm install && npm run build
node packages/cli/dist/index.js new-project "acme-portal" --client "ACME Corp" --type power-pages --output ./projects
```

**Week 1: Discovery & Intelligence**

```
platform-cartographer: Map current platform state for ACME's tenant
  -> Output: projects/acme-portal/capability-map.md, licensing matrix
  -> Handoff: solution-architect

solution-architect: Begin architecture; receive licensing input
  -> Run: node packages/cli/dist/index.js discovery
  -> Run: node packages/cli/dist/index.js generate-prd --project "acme-portal" --output ./projects/acme-portal/prd.md
```

**Week 2: Design**

```
solution-architect: Produce ADRs + solution blueprint
  -> Run: node packages/cli/dist/index.js generate-solution-design --project "acme-portal" --output ./projects/acme-portal/solution-design.md
  -> Gate 1: project-intake + scope-validation + licensing-and-capacity
  -> Handoff: dataverse-agent, power-apps-agent, security-governance-agent

dataverse-agent: Design data model
  -> Output: projects/acme-portal/data-model.md
  -> Validate: checklists/dataverse-security.md
  -> Handoff: power-apps-agent

power-apps-agent: Design portal app surfaces (Power Pages)
  -> Playbook: playbooks/power-pages-site.md
  -> Handoff: qa-test-agent
```

**Weeks 3-4: Build**

```
power-apps-agent + power-automate-agent + dataverse-agent: Build in DEV
  -> Outputs: projects/acme-portal/build/
  -> security-governance-agent (parallel): security review -> projects/acme-portal/security-review.md
  -> Gate 3 checklist: qa, power-platform-environment
```

**Week 5: Test**

```
qa-test-agent: Execute test plan
  -> Output: projects/acme-portal/test-report.md
  -> Validate: checklists/qa.md
  -> security-governance-agent: final review -> checklists/dlp-and-governance.md
  -> Gate 4 (Quality) -> Handoff: alm-deployment-agent
```

**Week 6: Deploy & Transition**

```
alm-deployment-agent: Promote UAT -> PROD
  -> Playbook: playbooks/alm-pipeline.md
  -> Validate: checklists/alm-solution-readiness.md, checklists/deployment.md
  -> Handoff: support-runbook-agent

support-runbook-agent (parallel): Runbooks + knowledge base
  -> Playbook: playbooks/production-support.md
  -> Validate: checklists/support-handover.md

commercial-strategy-agent: SOW closeout + upsell map
  -> Gate 5: Client Acceptance
```

Validate the full engagement folder before sharing anything with the client:

```bash
node packages/cli/dist/index.js validate --project ./projects/acme-portal
```

---

## Adding New Agents

### Process

1. **Create the agent definition** as a markdown file in [`agents/`](agents/), following the structure used by the existing 16 (for example, [`agents/solution-architect.md`](agents/solution-architect.md)):

   ```markdown
   # New Agent

   ## Role Definition
   What this agent owns and what it explicitly does not do.

   ## Inputs
   - Required input artifacts

   ## Outputs
   - Produced artifacts

   ## Tools
   - CLI commands, references, templates

   ## Handoff Rules
   ### To: <target-agent>
   **Trigger**: When ...
   **Package**: ...

   ## Operational Notes
   - Tag outputs needing verification against current Microsoft docs.
   ```

2. **Register the agent here** in [The 16 Agents](#the-16-agents) (the swarm size becomes 17+):
   - Add an entry with role, inputs, outputs, handoffs
   - Add it to the [Activation Rules](#agent-activation-rules) table
   - Wire it into the [Swarm Workflow Diagram](#swarm-workflow-diagram)

3. **Update the orchestrator** in [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md) — add the agent to the activation sequence, define its handoff contract, and place it relative to the validation gates.

4. **Reference it from playbooks and services** — name the new agent in the relevant files under [`playbooks/`](playbooks/) and [`services/`](services/README.md) so it is discoverable from the delivery and commercial layers.

5. **Validate the repository**:

   ```bash
   npm run validate          # runs structure, project, and docs checks
   npm run docs:check        # link / cross-reference check
   npm run repo:health       # repository health check
   ```

### Agent Definition Conventions

- One markdown file per agent in [`agents/`](agents/), `kebab-case.md`.
- Each file states **Role Definition**, **Inputs**, **Outputs**, **Tools**, handoff/escalation rules, and operational notes.
- Handoffs are named by agent (the human-readable role), and the receiving agent's file documents the inbound trigger and required package.
- There are no YAML agent files and no separate prompt directories — the markdown file is the single source of truth for a role.

---

## Quality Standards

### Agent Output Standards

Every agent output must meet these standards:

1. **Completeness** — All required sections present
2. **Accuracy** — Technical claims verified against Microsoft Learn (tag uncertain platform facts as needing verification against current Microsoft Learn)
3. **Consistency** — Follows repository conventions and uses repo-relative paths
4. **Traceability** — Links to inputs and decisions
5. **Validation** — Passes the relevant checklist in [`checklists/`](checklists/)

### Quality Checklist for Agent Outputs

```markdown
- [ ] File has proper YAML frontmatter (title, description, related)
- [ ] Cross-references to related files use working repo-relative paths
- [ ] Platform claims are marked with certainty / verification notes
- [ ] The relevant checklist has been run
- [ ] Handoff notes are included
- [ ] No hardcoded credentials, environment URLs, or connection strings
- [ ] Licensing requirements documented (premium connectors, AI credits, capacity)
- [ ] Security implications considered
```

### Review Process

1. **Self-review** — Agent reviews its own output against the checklist
2. **Automated validation** — `node packages/cli/dist/index.js validate --project <path>`, plus `npm run validate` and `npm run docs:check` at the repo root
3. **Peer review** — The next agent in the pipeline reviews the inbound handoff package
4. **Architecture review** — The solution-architect reviews complex or critical changes; commercial impact escalates to the commercial-strategy-agent

---

## Failure Handling

The orchestrator owns failure classification, retry policy, and the circuit breaker — see [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md). Summary below.

### Agent Failure Types

| Failure | Handling |
|---------|----------|
| Validation gate failure | Block progression, create remediation task |
| Agent timeout | Escalate to swarm-orchestrator, reassign |
| Knowledge gap | Escalate to platform-cartographer to re-map; document gap |
| Conflict between agents | solution-architect mediation, ADR required |
| External dependency failure | swarm-orchestrator notification, timeline update |
| Tool / CLI failure | alm-deployment-agent investigation, workaround |

### Retry Logic

The orchestrator applies a 3-attempt policy with exponential backoff:

```
Attempt 1: Execute task
  -> Success: Continue
  -> Failure: Log details, retry with same parameters

Attempt 2: Retry with modified approach
  -> Success: Continue
  -> Failure: Escalate to agent specialist

Attempt 3: Alternative approach
  -> Success: Document deviation
  -> Failure: Escalate to solution-architect; assess alternatives; document blocker
```

A **circuit breaker** trips if the same agent fails 3+ times on the same task type: stop routing similar tasks to it, activate a fallback or manual process, require root-cause analysis before re-enabling, and notify project leadership.

### Escalation Path

```
Agent Issue -> Peer Agent -> Solution Architect -> Swarm Orchestrator -> Commercial Strategy Agent / Client (if needed)
```

### Recovery Procedures

**If an agent produces invalid output:**

1. Reject the output with specific feedback
2. Return it to the agent with correction notes
3. Re-validate after correction
4. Document the correction in the project decision log

**If a critical-path agent fails:**

1. Immediately notify the swarm-orchestrator
2. Assess impact on timeline and downstream gates
3. Implement the contingency plan (fallback agent or manual process)
4. Update all dependent agents and the project status

---

## Quick Reference

| Need | Action |
|------|--------|
| Find an agent's role | Read `agents/<name>.md` (e.g. [`agents/solution-architect.md`](agents/solution-architect.md)) |
| Understand orchestration | Read [`agents/swarm-orchestrator.md`](agents/swarm-orchestrator.md) |
| Scaffold an engagement | `node packages/cli/dist/index.js new-project <name> --client <client> --type <type>` |
| Generate a PRD | `node packages/cli/dist/index.js generate-prd --project <name>` |
| Generate a solution design | `node packages/cli/dist/index.js generate-solution-design --project <name>` |
| Generate a phase checklist | `node packages/cli/dist/index.js checklist --type <type>` |
| Generate an agent brief | `node packages/cli/dist/index.js agent-brief --agent <type>` |
| Estimate licensing | `node packages/cli/dist/index.js estimate-licensing -c usd` |
| Validate an engagement | `node packages/cli/dist/index.js validate --project <path>` |
| Validate the repo | `npm run validate` / `npm run docs:check` / `npm run repo:health` |
| Pick a commercial service | Browse [`services/README.md`](services/README.md) |
| Run a delivery playbook | Open the relevant file in [`playbooks/`](playbooks/) and follow it in order |

> After `cd packages/cli && npm link`, the same commands run as `pp-agency <cmd>` instead of `node packages/cli/dist/index.js <cmd>`. The CLI's `agent-brief` accepts the generic roles `architect`, `data-modeler`, `developer`, `tester`, `alm-engineer`, and `security-admin` — these are document-generation templates, distinct from the 16 swarm agents in [`agents/`](agents/).

---

> **Swarm Principle**: The whole is greater than the sum of its parts. Agents succeed through coordination, validation, and clear handoffs. No agent works in isolation — the Swarm Orchestrator keeps the loop honest.


---

## Agent Memory / Session Continuity

When resuming work on this project, read `.planning/MEMORY-CHECKPOINT.md` first.
It contains the current state, latest commits, open blockers, key files, and the
exact next steps needed to reach a prod-ready MVP.

Last checkpoint: 2026-06-19 · commit `20528d5`.
