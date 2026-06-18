#!/usr/bin/env tsx
/**
 * create-agent-brief.ts
 *
 * Creates an agent brief for a specific agent type and project context.
 *
 * Usage:
 *   tsx scripts/create-agent-brief.ts <agent-type> [--project "Project Name"] [--context "additional context"]
 *
 * Reads agent definition from /agents/ and generates a task-specific brief.
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ── Configuration ────────────────────────────────────────────────────────────

const AGENTS_DIR = path.resolve(__dirname, "..", "agents");
const OUTPUT_DIR = path.resolve(__dirname, "..", "output");

interface AgentDefinition {
  type: string;
  name: string;
  role: string;
  expertise: string[];
  responsibilities: string[];
  deliverables: string[];
  tools: string[];
  inputs: string[];
  outputs: string[];
  constraints: string[];
  communicationStyle: string;
}

// ── Default Agent Definitions ────────────────────────────────────────────────

const DEFAULT_AGENTS: Record<string, AgentDefinition> = {
  "solution-architect": {
    type: "solution-architect",
    name: "Solution Architect",
    role: "Design end-to-end Power Platform solutions aligned with business requirements",
    expertise: [
      "Power Platform architecture",
      "Dataverse design",
      "Security modeling",
      "Integration patterns",
      "ALM strategy",
    ],
    responsibilities: [
      "Design solution architecture",
      "Define data model",
      "Establish security model",
      "Create integration specifications",
      "Define ALM approach",
    ],
    deliverables: [
      "Solution design document",
      "Data model diagram",
      "Security model document",
      "Integration specification",
      "ALM plan",
    ],
    tools: [
      "Power Platform Admin Center",
      "Dataverse",
      "Azure DevOps",
      "Visio / draw.io",
      "PAC CLI",
    ],
    inputs: [
      "Business requirements",
      "Existing system documentation",
      "Compliance requirements",
      "User personas",
    ],
    outputs: [
      "Architecture decision records",
      "Technical specifications",
      "Review reports",
    ],
    constraints: [
      "Must use managed solutions in production",
      "Must follow organization's security standards",
      "Must be within licensed capacity",
    ],
    communicationStyle: "Technical, structured, with diagrams and decision logs",
  },
  "power-apps-developer": {
    type: "power-apps-developer",
    name: "Power Apps Developer",
    role: "Build canvas and model-driven apps using Power Apps",
    expertise: [
      "Canvas apps (formula language)",
      "Model-driven apps",
      "Custom pages",
      "PCF components",
      "Responsive design",
    ],
    responsibilities: [
      "Develop canvas and model-driven apps",
      "Implement UI/UX designs",
      "Write Power Fx formulas",
      "Create reusable components",
      "Perform unit testing",
    ],
    deliverables: [
      "Canvas app source",
      "Model-driven app config",
      "Component library",
      "Test results",
      "Deployment notes",
    ],
    tools: [
      "Power Apps Studio",
      "Power Platform CLI",
      "Git",
      "Monitor tool",
      "Test Studio",
    ],
    inputs: [
      "Solution design",
      "UI/UX mockups",
      "Data model",
      "User stories",
    ],
    outputs: [
      "App packages",
      "Source code commits",
      "Bug reports",
    ],
    constraints: [
      "Must follow coding standards",
      "Must include error handling",
      "Must be accessibility compliant (WCAG 2.1)",
    ],
    communicationStyle: "Practical, code-focused, with screenshots and examples",
  },
  "automation-specialist": {
    type: "automation-specialist",
    name: "Automation Specialist",
    role: "Design and implement Power Automate flows and Desktop Flows",
    expertise: [
      "Cloud flows",
      "Desktop flows (RPA)",
      "Business process flows",
      "Error handling patterns",
      "Integration patterns",
    ],
    responsibilities: [
      "Build cloud and desktop flows",
      "Implement error handling",
      "Configure connection references",
      "Design approval workflows",
      "Optimize flow performance",
    ],
    deliverables: [
      "Flow definitions",
      "Connection reference configs",
      "Run history analysis",
      "Documentation",
    ],
    tools: [
      "Power Automate",
      "Power Automate Desktop",
      "Power Platform CLI",
      "Process advisor",
    ],
    inputs: [
      "Business process maps",
      "Trigger requirements",
      "Integration endpoints",
      "Error handling requirements",
    ],
    outputs: [
      "Flow packages",
      "Performance reports",
      "Incident logs",
    ],
    constraints: [
      "Must implement retry logic",
      "Must use scope for error handling",
      "Must follow naming conventions",
    ],
    communicationStyle: "Process-oriented, with flow diagrams and step-by-step guides",
  },
  "dataverse-specialist": {
    type: "dataverse-specialist",
    name: "Dataverse Specialist",
    role: "Design and manage Dataverse tables, relationships, and security",
    expertise: [
      "Table design",
      "Relationship modeling",
      "Business rules",
      "Plug-in development",
      "Security design",
    ],
    responsibilities: [
      "Design table schemas",
      "Configure relationships",
      "Implement business rules",
      "Develop plug-ins",
      "Configure security",
    ],
    deliverables: [
      "Table schemas",
      "ER diagrams",
      "Plug-in assemblies",
      "Security model docs",
    ],
    tools: [
      "Power Apps maker portal",
      "Plugin Registration Tool",
      "XrmToolBox",
      "SQL Server Management Studio",
    ],
    inputs: [
      "Data requirements",
      "Integration specs",
      "Compliance requirements",
    ],
    outputs: [
      "Data model exports",
      "Configuration documentation",
      "Migration scripts",
    ],
    constraints: [
      "Must follow naming conventions",
      "Must implement audit logging",
      "Must respect data residency",
    ],
    communicationStyle: "Data-focused, with schemas and relationship diagrams",
  },
  "ai-builder-specialist": {
    type: "ai-builder-specialist",
    name: "AI Builder Specialist",
    role: "Design and implement AI Builder models and GPT prompts",
    expertise: [
      "Document processing",
      "Text classification",
      "Prediction models",
      "GPT prompts",
      "Form processing",
    ],
    responsibilities: [
      "Train AI models",
      "Design prompt engineering strategies",
      "Integrate AI into apps and flows",
      "Monitor model performance",
      "Manage AI credits",
    ],
    deliverables: [
      "Trained models",
      "Prompt templates",
      "Integration configurations",
      "Performance reports",
    ],
    tools: [
      "AI Builder",
      "Power Apps",
      "Power Automate",
      "Azure AI services",
    ],
    inputs: [
      "Training data sets",
      "Use case specifications",
      "Accuracy requirements",
      "Sample documents",
    ],
    outputs: [
      "Published models",
      "Confidence metrics",
      "Usage analytics",
    ],
    constraints: [
      "Must stay within AI credit budget",
      "Must meet minimum accuracy thresholds",
      "Must handle PII according to policy",
    ],
    communicationStyle: "Analytical, with metrics and confidence scores",
  },
  "copilot-studio-developer": {
    type: "copilot-studio-developer",
    name: "Copilot Studio Developer",
    role: "Build conversational agents using Copilot Studio",
    expertise: [
      "Topic design",
      "Entity extraction",
      "Action configuration",
      "Authentication setup",
      "Knowledge source integration",
    ],
    responsibilities: [
      "Design conversation topics",
      "Configure generative answers",
      "Set up actions and tools",
      "Implement authentication",
      "Test and refine conversations",
    ],
    deliverables: [
      "Agent configuration",
      "Topic definitions",
      "Action schemas",
      "Test transcripts",
    ],
    tools: [
      "Copilot Studio",
      "Power Automate",
      "Azure Bot Service",
      "Application Insights",
    ],
    inputs: [
      "Conversation scripts",
      "FAQ documents",
      "API specifications",
      "Brand guidelines",
    ],
    outputs: [
      "Published agent",
      "Analytics dashboard",
      "Escalation reports",
    ],
    constraints: [
      "Must handle off-topic gracefully",
      "Must include escalation paths",
      "Must comply with content policies",
    ],
    communicationStyle: "Conversational, with transcript examples and topic flows",
  },
  "devops-engineer": {
    type: "devops-engineer",
    name: "DevOps Engineer",
    role: "Implement ALM, CI/CD, and governance for Power Platform",
    expertise: [
      "Azure DevOps",
      "GitHub Actions",
      "PAC CLI",
      "Solution management",
      "Environment strategy",
    ],
    responsibilities: [
      "Configure CI/CD pipelines",
      "Manage solution lifecycle",
      "Implement governance policies",
      "Set up monitoring",
      "Automate deployments",
    ],
    deliverables: [
      "Pipeline definitions",
      "Deployment scripts",
      "Governance policies",
      "Environment configs",
      "Runbooks",
    ],
    tools: [
      "Azure DevOps",
      "GitHub Actions",
      "PAC CLI",
      "Power Platform Admin Center",
      "Azure Monitor",
    ],
    inputs: [
      "Solution packages",
      "Environment configs",
      "Release schedule",
      "Security requirements",
    ],
    outputs: [
      "Deployment reports",
      "Pipeline logs",
      "Health checks",
    ],
    constraints: [
      "Must use managed solutions in prod",
      "Must include rollback capability",
      "Must have approval gates",
    ],
    communicationStyle: "Infrastructure-focused, with pipeline diagrams and configs",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadAgentDefinition(agentType: string): AgentDefinition {
  // Try to load from agents directory
  const agentFile = path.join(AGENTS_DIR, `${agentType}.json`);
  if (fs.existsSync(agentFile)) {
    return JSON.parse(fs.readFileSync(agentFile, "utf-8")) as AgentDefinition;
  }

  // Fall back to built-in defaults
  if (DEFAULT_AGENTS[agentType]) {
    return DEFAULT_AGENTS[agentType];
  }

  console.error(`Unknown agent type: ${agentType}`);
  console.error(`Available types: ${Object.keys(DEFAULT_AGENTS).join(", ")}`);
  process.exit(1);
}

function generateBrief(
  agent: AgentDefinition,
  projectName: string,
  additionalContext: string
): string {
  return `---
title: "Agent Brief: ${agent.name}"
agentType: "${agent.type}"
project: "${projectName}"
created: ${new Date().toISOString()}
status: draft
---

# Agent Brief: ${agent.name}

## Assignment Details

| Field | Value |
|-------|-------|
| Agent Type | ${agent.type} |
| Role | ${agent.role} |
| Project | ${projectName} |
| Assigned | ${new Date().toISOString().split("T")[0]} |

## Context

${additionalContext || "No additional context provided."}

## Responsibilities

${agent.responsibilities.map((r) => `- ${r}`).join("\n")}

## Required Expertise

${agent.expertise.map((e) => `- ${e}`).join("\n")}

## Deliverables

${agent.deliverables.map((d) => `- [ ] ${d}`).join("\n")}

## Tools and Access

${agent.tools.map((t) => `- ${t}`).join("\n")}

## Inputs Required

${agent.inputs.map((i) => `- [ ] ${i}`).join("\n")}

## Expected Outputs

${agent.outputs.map((o) => `- ${o}`).join("\n")}

## Constraints

${agent.constraints.map((c) => `- ${c}`).join("\n")}

## Communication Style

${agent.communicationStyle}

## Task Instructions

1. Review the project context and inputs above
2. Confirm understanding of responsibilities
3. Identify any blockers or missing inputs
4. Begin with deliverable: ${agent.deliverables[0] || "First deliverable"}

## Notes

- Escalate blockers immediately
- Update status daily
- Follow the organization's coding and documentation standards
`;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(): { agentType: string; projectName: string; context: string } {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: tsx scripts/create-agent-brief.ts <agent-type> [--project \"Project Name\"] [--context \"additional context\"]");
    console.error(`\nAvailable agent types:\n${Object.keys(DEFAULT_AGENTS).map((a) => `  - ${a}`).join("\n")}`);
    process.exit(1);
  }

  const agentType = args[0];
  let projectName = "Unnamed Project";
  let context = "";

  const projectIndex = args.indexOf("--project");
  if (projectIndex !== -1 && args[projectIndex + 1]) {
    projectName = args[projectIndex + 1];
  }

  const contextIndex = args.indexOf("--context");
  if (contextIndex !== -1 && args[contextIndex + 1]) {
    context = args[contextIndex + 1];
  }

  return { agentType, projectName, context };
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const { agentType, projectName, context } = parseArgs();
  const agent = loadAgentDefinition(agentType);
  const brief = generateBrief(agent, projectName, context);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputFile = path.join(
    OUTPUT_DIR,
    `brief-${agentType}-${new Date().toISOString().split("T")[0]}.md`
  );
  fs.writeFileSync(outputFile, brief, "utf-8");

  console.log(`Agent brief generated: ${outputFile}`);
  console.log(`Agent: ${agent.name}`);
  console.log(`Project: ${projectName}`);
  console.log(`Deliverables: ${agent.deliverables.length}`);
}

if (require.main === module) {
  main();
}

export { loadAgentDefinition, generateBrief };
