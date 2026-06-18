# Repo Build Master Prompt

## Purpose
This is the master prompt for building the entire power-platform-dev-agency-toolkit repository. Copy and paste this into your AI coding agent (Claude Code, Kimi, Cursor, Codex, or Gemini) to generate the complete repository structure.

## Instructions

You are a Power Platform solution architect and developer. Your task is to build a comprehensive agency toolkit for Power Platform development. This toolkit includes agent definitions, prompt templates, and reusable components for a multi-agent swarm that designs, builds, tests, and deploys Power Platform solutions.

Follow these instructions precisely:

### 1. Repository Structure

Create the following directory structure:

```
power-platform-dev-agency-toolkit/
├── agents/
│   ├── platform-cartographer.md
│   ├── solution-architect.md
│   ├── power-automate-agent.md
│   ├── desktop-rpa-agent.md
│   ├── power-apps-agent.md
│   ├── dataverse-agent.md
│   ├── ai-builder-agent.md
│   ├── copilot-studio-agent.md
│   ├── connector-integration-agent.md
│   ├── security-governance-agent.md
│   ├── alm-deployment-agent.md
│   ├── qa-test-agent.md
│   ├── licensing-capacity-agent.md
│   ├── commercial-strategy-agent.md
│   ├── support-runbook-agent.md
│   └── swarm-orchestrator.md
├── prompts/
│   ├── repo-build-master-prompt.md
│   ├── client-discovery-prompt.md
│   ├── automation-prd-prompt.md
│   ├── power-apps-prd-prompt.md
│   ├── copilot-agent-prd-prompt.md
│   ├── ai-builder-document-processing-prompt.md
│   ├── custom-connector-prompt.md
│   ├── dataverse-design-prompt.md
│   ├── rpa-assessment-prompt.md
│   ├── alm-deployment-prompt.md
│   ├── governance-audit-prompt.md
│   ├── licensing-estimate-prompt.md
│   ├── code-review-prompt.md
│   ├── qa-test-plan-prompt.md
│   ├── support-runbook-prompt.md
│   └── docs-watch-prompt.md
└── README.md
```

### 2. Agent Definition Format

Each agent file must follow this structure:
- **Role Definition**: What this agent does, its purpose, and scope
- **Inputs**: What information this agent needs to receive
- **Outputs**: What artifacts this agent produces
- **Tools**: What capabilities this agent uses
- **Validation Method**: How to verify the quality of outputs
- **Failure Modes**: Common failures and how to handle them
- **Handoff Rules**: When and how to hand off to other agents
- **Operational Notes**: Additional guidance

Each agent must be 150+ lines. Include specific decision trees, tables, and code examples where applicable.

### 3. Prompt Format

Each prompt file must be:
- 100+ lines
- Directly copy-pasteable into AI coding agents
- Include context, instructions, expected output format, and examples
- Include placeholders like `[CLIENT_NAME]`, `[PROJECT_NAME]` for customization

### 4. Key Design Principles

1. **Solution-aware**: All designs must work within Power Platform solutions
2. **ALM-ready**: All components must be deployable through ALM pipelines
3. **Security-first**: Security and governance considerations in every design
4. **Scalable**: Designs must work for small pilots and large enterprise deployments
5. **Documented**: Every decision must have documented rationale
6. **Verifiable**: Include "Needs verification against current Microsoft docs" warnings where platform capabilities change frequently

### 5. Agent Handoff Sequence

The agents follow this orchestration:
```
Platform Cartographer -> Solution Architect -> Build Agents (parallel) -> QA/Test -> ALM/Deploy -> Support
```

With these supporting agents activated as needed:
- Security/Governance (reviews all designs)
- Licensing/Capacity (analyzes all solutions)
- Commercial Strategy (packages for delivery)

### 6. Special Instructions

- Include specific Microsoft Learn URLs where applicable
- Reference official Microsoft terminology
- Include Power Fx formula examples in app designs
- Include Power Automate expression examples
- Include pac CLI commands for ALM operations
- Include security best practices throughout
- Include accessibility (WCAG) requirements
- Include performance optimization guidance

### 7. Quality Checklist

Before completing, verify:
- [ ] All 32 files exist and are non-empty
- [ ] Every agent file is 150+ lines
- [ ] Every prompt file is 100+ lines
- [ ] No TODO or placeholder content remains
- [ ] All handoff references point to valid agent names
- [ ] All outputs are directly usable without modification
- [ ] Microsoft docs warnings are included where needed

### 8. README Generation

After creating all files, generate a README.md that includes:
- Repository overview
- Directory structure
- Quick start guide
- Agent descriptions
- How to use prompts
- Contributing guidelines
- License information

## Expected Output

The complete repository with all 33 files (32 content files + README.md), ready for use by Power Platform development teams.

## Customization Variables

When using this prompt, replace these variables:
- `[AGENCY_NAME]`: Your agency or team name
- `[DEFAULT_REGION]`: Your default deployment region
- `[TENANT_TYPE]`: Your typical client tenant type (commercial, GCC, GCC High)
- `[DEFAULT_LICENSE_TYPE]`: Your default recommended license tier

## Notes

- This repository is designed for multi-agent AI workflows
- Each agent can be activated independently for specific tasks
- The swarm orchestrator coordinates the full end-to-end process
- Prompts are designed to be copy-pasted directly into Claude, Kimi, Cursor, Codex, or Gemini
- All content should be treated as living documents that evolve with the Power Platform
- **Needs verification against current Microsoft docs**: Platform capabilities change frequently. Verify all licensing, connector availability, and feature status against current Microsoft documentation before use.
