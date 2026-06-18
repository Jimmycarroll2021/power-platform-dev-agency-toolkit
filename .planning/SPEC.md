# SPEC: power-platform-dev-agency-toolkit

## Project Type
GitHub repository — practical toolkit for Power Platform development agency

## Repository Root
/mnt/agents/output/power-platform-dev-agency-toolkit/

## Structure (100+ files)

### Root Config Files (12 files)
- README.md — main repo overview, navigation, quick start
- CLAUDE.md — Claude Code agent instructions
- KIMI.md — Kimi agent instructions
- CODEX.md — Codex agent instructions
- GEMINI.md — Gemini agent instructions
- AGENTS.md — general agent rules and swarm orchestration
- LICENSE — MIT license
- .gitignore — Node/TypeScript/Power Platform ignores
- .env.example — environment variable template
- package.json — root package config
- tsconfig.json — TypeScript config
- docker-compose.yml — optional dev container

### /docs/ (18 files)
platform-map.md, power-platform-tool-catalogue.md, power-automate-guide.md, power-apps-guide.md, dataverse-guide.md, ai-builder-guide.md, copilot-studio-guide.md, connectors-guide.md, power-pages-guide.md, power-bi-handoff-guide.md, alm-and-solutions.md, governance-and-coe.md, licensing-and-capacity.md, security-and-privacy.md, integration-patterns.md, delivery-model.md, commercial-offers.md, client-discovery.md, support-and-runbooks.md, glossary.md

### /agents/ (16 files)
platform-cartographer.md, solution-architect.md, power-automate-agent.md, desktop-rpa-agent.md, power-apps-agent.md, dataverse-agent.md, ai-builder-agent.md, copilot-studio-agent.md, connector-integration-agent.md, security-governance-agent.md, alm-deployment-agent.md, qa-test-agent.md, licensing-capacity-agent.md, commercial-strategy-agent.md, support-runbook-agent.md, swarm-orchestrator.md

### /prompts/ (16 files)
repo-build-master-prompt.md, client-discovery-prompt.md, automation-prd-prompt.md, power-apps-prd-prompt.md, copilot-agent-prd-prompt.md, ai-builder-document-processing-prompt.md, custom-connector-prompt.md, dataverse-design-prompt.md, rpa-assessment-prompt.md, alm-deployment-prompt.md, governance-audit-prompt.md, licensing-estimate-prompt.md, code-review-prompt.md, qa-test-plan-prompt.md, support-runbook-prompt.md, docs-watch-prompt.md

### /templates/ (13 files)
prd-template.md, technical-design-template.md, solution-design-template.md, client-proposal-template.md, scope-of-work-template.md, architecture-decision-record.md, delivery-plan-template.md, risk-register-template.md, licensing-estimate-template.md, qa-checklist.md, deployment-checklist.md, governance-checklist.md, support-runbook-template.md, handover-document-template.md

### /playbooks/ (18 files)
power-automate-cloud-flow.md, power-automate-desktop-rpa.md, approval-workflows.md, document-processing-ai-builder.md, ai-builder-gpt-prompts.md, canvas-app.md, model-driven-app.md, dataverse-solution.md, custom-connector.md, copilot-studio-agent.md, agent-flow-workflow.md, power-pages-site.md, sharepoint-to-dataverse-migration.md, microsoft-graph-integration.md, azure-function-integration.md, alm-pipeline.md, governance-audit.md, production-support.md

### /packages/cli/ (10+ files)
README.md, package.json, tsconfig.json, src/index.ts, src/commands/new-project.ts, run-discovery.ts, generate-prd.ts, generate-solution-design.ts, generate-agent-brief.ts, checklist.ts, validate-project.ts, estimate-licensing.ts, src/lib/file-utils.ts, markdown-utils.ts, templates.ts, project-types.ts

### /examples/ (4 project folders × 5 files each)
document-intake-ai-builder/, approval-automation/, copilot-studio-service-agent/, dataverse-case-management-app/ — each with README.md, architecture.md, prd.md, prompts.md, risks.md

### /checklists/ (13 files)
project-intake.md, scope-validation.md, power-platform-environment.md, licensing-and-capacity.md, connectors-and-premium.md, dataverse-security.md, dlp-and-governance.md, ai-builder-readiness.md, copilot-studio-readiness.md, alm-solution-readiness.md, qa.md, deployment.md, support-handover.md

### /scripts/ (5 files)
validate-docs.ts, generate-project.ts, create-agent-brief.ts, check-required-files.ts, estimate-credits.ts

### /.github/ (6 files)
workflows/lint.yml, docs-check.yml, repo-health.yml, ISSUE_TEMPLATE/client-project.md, bug_report.md, feature_request.md, PULL_REQUEST_TEMPLATE.md

### /power-platform/ (16 files)
pac-cli-cheatsheet.md, solution-patterns.md, environment-strategy.md, connection-references.md, environment-variables.md, dataverse-patterns.md, power-automate-patterns.md, desktop-flow-patterns.md, power-apps-patterns.md, pcf-patterns.md, custom-connectors-patterns.md, ai-builder-patterns.md, copilot-studio-patterns.md, power-pages-patterns.md, alm-devops-patterns.md, monitoring-and-telemetry.md

### /mcp/ (4 files)
copilot-studio-mcp-notes.md, agent-tooling-patterns.md, mcp-server-evaluation-template.md, external-agent-integration-template.md

## Implementation Rules
1. Every file must be substantive (> 50 lines minimum for guides)
2. All content must be practical, not theoretical
3. Include exact commands, copy-paste prompts, and checklists
4. Mark uncertain claims with "Needs verification against current Microsoft docs"
5. Include licensing warnings for premium features
6. Use consistent markdown formatting
7. Cross-reference related files
8. CLI must compile with `tsc --noEmit`
9. All examples must include architecture, PRD, prompts, and risks
