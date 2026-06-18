#!/usr/bin/env tsx
/**
 * generate-project.ts
 *
 * Generates a new project scaffold for the power-platform-dev-agency-toolkit.
 *
 * Usage:
 *   tsx scripts/generate-project.ts <project-name> [--client "Client Name"]
 *
 * Creates the following structure under projects/{name}/:
 *   - 00-project-brief.md
 *   - 01-prd.md
 *   - 02-solution-design.md
 *   - 03-risk-register.md
 *   - 04-checklist.md
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ── Configuration ────────────────────────────────────────────────────────────

const PROJECTS_DIR = path.resolve(__dirname, "..", "projects");

// ── Templates ────────────────────────────────────────────────────────────────

function projectBriefTemplate(name: string, client: string): string {
  return `---
title: "Project Brief: ${name}"
client: "${client}"
status: draft
created: ${new Date().toISOString()}
author: ""
tags: ["project-brief", "${name.toLowerCase().replace(/\s+/g, "-")}"]
---

# Project Brief: ${name}

## Client

${client}

## Project Overview

Provide a 2-3 sentence summary of what this project aims to achieve.

## Business Problem

Describe the business problem or opportunity this project addresses.

## Goals and Objectives

1. Goal one
2. Goal two
3. Goal three

## Success Criteria

- [ ] Criterion one
- [ ] Criterion two
- [ ] Criterion three

## Constraints and Assumptions

### Constraints

- Budget limit
- Timeline restrictions
- Technical limitations

### Assumptions

- Assumption one
- Assumption two

## Key Stakeholders

| Name | Role | Responsibility |
|------|------|----------------|
|      |      |                |
|      |      |                |

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
|      |      |      |           |
`;
}

function prdTemplate(name: string): string {
  return `---
title: "Product Requirements Document: ${name}"
status: draft
created: ${new Date().toISOString()}
tags: ["prd", "requirements"]
---

# Product Requirements Document: ${name}

## 1. Introduction

### 1.1 Purpose

Describe the purpose of this document and the product being specified.

### 1.2 Scope

Define what is in scope and out of scope for this release.

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
|      |            |

## 2. Functional Requirements

### 2.1 User Stories

| ID | User Story | Priority | Acceptance Criteria |
|----|-----------|----------|---------------------|
| US-001 | As a [role], I want [feature] so that [benefit] | Must Have | |
| US-002 | As a [role], I want [feature] so that [benefit] | Should Have | |

### 2.2 Use Cases

#### UC-001: [Use Case Name]

**Actors:**
**Preconditions:**
**Postconditions:**

**Main Flow:**
1. Step one
2. Step two
3. Step three

**Alternative Flows:**
- A1: Alternative path

## 3. Non-Functional Requirements

### 3.1 Performance

- Response time requirements
- Throughput requirements

### 3.2 Security

- Authentication requirements
- Authorization requirements
- Data protection

### 3.3 Usability

- Accessibility standards (WCAG 2.1)
- Mobile responsiveness

### 3.4 Reliability

- Availability targets (e.g., 99.9%)
- Recovery time objectives

## 4. Data Requirements

### 4.1 Data Model

[Insert entity relationship diagram or description]

### 4.2 Data Migration

Describe any data migration requirements from existing systems.

## 5. Integration Requirements

### 5.1 External Systems

| System | Integration Type | Data Direction | Frequency |
|--------|-----------------|----------------|-----------|
|        |                 |                |           |

### 5.2 APIs

| API | Purpose | Authentication |
|-----|---------|----------------|
|     |         |                |

## 6. Compliance and Regulatory

- Data residency requirements
- Industry-specific compliance (GDPR, HIPAA, etc.)

## 7. Release Criteria

- [ ] All P0/P1 bugs resolved
- [ ] Performance tests pass
- [ ] Security review complete
- [ ] User acceptance testing signed off

## 8. Appendix

### 8.1 References

### 8.2 Open Questions

| Question | Owner | Due Date | Status |
|----------|-------|----------|--------|
|          |       |          |        |
`;
}

function solutionDesignTemplate(name: string): string {
  return `---
title: "Solution Design: ${name}"
status: draft
created: ${new Date().toISOString()}
tags: ["solution-design", "architecture"]
---

# Solution Design: ${name}

## 1. Architecture Overview

### 1.1 High-Level Architecture

[Insert architecture diagram or description]

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
|       |           |         |         |

### 1.3 Environment Topology

| Environment | Type | Purpose | Region |
|-------------|------|---------|--------|
| Dev         | Sandbox | Development | |
| Test        | Sandbox | UAT | |
| Production  | Production | Live | |

## 2. Data Architecture

### 2.1 Dataverse Tables

| Table | Purpose | Key Columns | Row Count (est.) |
|-------|---------|-------------|-----------------|
|       |         |             |                 |

### 2.2 Relationships

| Parent | Child | Type | Behavior |
|--------|-------|------|----------|
|        |       |      |          |

### 2.3 Security Model

- Business units:
- Security roles:
- Field-level security:

## 3. Component Design

### 3.1 Power Apps

| App | Type | Purpose | Users |
|-----|------|---------|-------|
|     | Model-driven / Canvas | | |

### 3.2 Power Automate Flows

| Flow | Trigger | Purpose | Complexity |
|------|---------|---------|------------|
|      |         |         |            |

### 3.3 Power Pages

[Describe site structure and configuration]

### 3.4 Copilot Studio Agents

| Agent | Purpose | Knowledge Sources | Actions |
|-------|---------|------------------|---------|
|       |         |                  |         |

### 3.5 AI Builder Models

| Model | Type | Purpose | Confidence Threshold |
|-------|------|---------|---------------------|
|       |      |         |                     |

## 4. Integration Design

### 4.1 Connection References

| Name | Connector | Purpose |
|------|-----------|---------|
|      |           |         |

### 4.2 Custom Connectors

| Connector | Base URL | Authentication |
|-----------|----------|----------------|
|           |          |                |

### 4.3 Data Flow

[Describe data flow between systems]

## 5. Security Design

### 5.1 Authentication

- Identity provider:
- MFA requirements:
- Conditional access:

### 5.2 Authorization

- Role-based access control:
- Privilege matrix:

### 5.3 Data Protection

- Encryption at rest:
- Encryption in transit:
- DLP policies:

## 6. Error Handling

### 6.1 Global Error Strategy

[Describe error handling approach]

### 6.2 Retry Policies

| Component | Retry Count | Backoff Strategy |
|-----------|------------|------------------|
|           |            |                  |

## 7. Monitoring and Logging

### 7.1 Telemetry

- Application Insights key:
- Custom dimensions:

### 7.2 Alerts

| Condition | Severity | Notification |
|-----------|----------|--------------|
|           |          |              |

## 8. Deployment Plan

### 8.1 Solution Packaging

- Solution name:
- Version strategy:
- Managed vs unmanaged:

### 8.2 Deployment Steps

1. Step one
2. Step two
3. Step three

### 8.3 Rollback Plan

[Describe rollback procedure]

## 9. Performance Considerations

- Estimated concurrent users:
- Data volume projections:
- Caching strategy:

## 10. Appendix

### 10.1 Assumptions

### 10.2 Risks and Mitigations

### 10.3 Decisions Log

| Date | Decision | Rationale | Decision Maker |
|------|----------|-----------|----------------|
|      |          |           |                |
`;
}

function riskRegisterTemplate(name: string): string {
  return `---
title: "Risk Register: ${name}"
status: active
created: ${new Date().toISOString()}
tags: ["risk-register", "${name.toLowerCase().replace(/\s+/g, "-")}"]
---

# Risk Register: ${name}

## Risk Summary

| ID | Risk Description | Probability | Impact | Score | Owner | Status |
|----|-----------------|-------------|--------|-------|-------|--------|
| R001 | | Medium | Medium | | | Open |
| R002 | | Medium | Medium | | | Open |
| R003 | | Low | High | | | Open |

## Detailed Risk Descriptions

### R001: [Risk Title]

**Description:**
**Trigger:**
**Impact:**
**Mitigation Strategy:**
**Contingency Plan:**
**Review Date:**

### R002: [Risk Title]

**Description:**
**Trigger:**
**Impact:**
**Mitigation Strategy:**
**Contingency Plan:**
**Review Date:**

## Risk Scoring Matrix

|            | Low Impact | Medium Impact | High Impact |
|------------|-----------|---------------|-------------|
| High Prob  | Medium    | High          | Critical    |
| Medium Prob| Low       | Medium        | High        |
| Low Prob   | Low       | Low           | Medium      |

## Review Log

| Date | Reviewer | Notes |
|------|----------|-------|
|      |          |       |
`;
}

function checklistTemplate(name: string): string {
  return `---
title: "Project Checklist: ${name}"
status: active
created: ${new Date().toISOString()}
tags: ["checklist", "${name.toLowerCase().replace(/\s+/g, "-")}"]
---

# Project Checklist: ${name}

## Discovery Phase

- [ ] Stakeholder interviews completed
- [ ] Requirements gathered and documented
- [ ] Current state analysis complete
- [ ] Feasibility assessment done
- [ ] Budget approved

## Design Phase

- [ ] Solution architecture approved
- [ ] Data model designed
- [ ] Security model defined
- [ ] Integration design complete
- [ ] UI/UX mockups approved
- [ ] Technical design review passed

## Build Phase

- [ ] Development environment provisioned
- [ ] Core components developed
- [ ] Integrations implemented
- [ ] Unit tests written
- [ ] Code review completed
- [ ] Security review passed

## Testing Phase

- [ ] Integration testing complete
- [ ] Performance testing complete
- [ ] UAT conducted
- [ ] Accessibility testing done
- [ ] Security penetration test passed
- [ ] Regression testing complete

## Deployment Phase

- [ ] Production environment ready
- [ ] Data migration tested
- [ ] Deployment package created
- [ ] Deployment executed
- [ ] Smoke tests passed
- [ ] Monitoring configured

## Handover Phase

- [ ] Documentation complete
- [ ] Training delivered
- [ ] Support handover done
- [ ] Warranty period started
- [ ] Project closure report

## Post-Launch

- [ ] 30-day health check
- [ ] 90-day review
- [ ] Lessons learned documented
- [ ] Continuous improvement plan
`;
}

// ── File Generation ──────────────────────────────────────────────────────────

function generateProject(projectName: string, clientName: string): void {
  const sanitizedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const projectDir = path.join(PROJECTS_DIR, sanitizedName);

  if (fs.existsSync(projectDir)) {
    console.error(`Error: Project directory already exists: ${projectDir}`);
    process.exit(1);
  }

  fs.mkdirSync(projectDir, { recursive: true });

  const files: { name: string; content: string }[] = [
    { name: "00-project-brief.md", content: projectBriefTemplate(projectName, clientName) },
    { name: "01-prd.md", content: prdTemplate(projectName) },
    { name: "02-solution-design.md", content: solutionDesignTemplate(projectName) },
    { name: "03-risk-register.md", content: riskRegisterTemplate(projectName) },
    { name: "04-checklist.md", content: checklistTemplate(projectName) },
  ];

  for (const file of files) {
    const filePath = path.join(projectDir, file.name);
    fs.writeFileSync(filePath, file.content, "utf-8");
    console.log(`Created: ${path.relative(REPO_ROOT, filePath)}`);
  }

  console.log(`\nProject "${projectName}" scaffolded at: ${projectDir}`);
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(): { projectName: string; clientName: string } {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: tsx scripts/generate-project.ts <project-name> [--client \"Client Name\"]");
    process.exit(1);
  }

  const projectName = args[0];
  let clientName = projectName;

  const clientIndex = args.indexOf("--client");
  if (clientIndex !== -1 && args[clientIndex + 1]) {
    clientName = args[clientIndex + 1];
  }

  return { projectName, clientName };
}

// ── Constants ────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, "..");

// ── Entry Point ──────────────────────────────────────────────────────────────

if (require.main === module) {
  const { projectName, clientName } = parseArgs();
  generateProject(projectName, clientName);
}

export { generateProject };
