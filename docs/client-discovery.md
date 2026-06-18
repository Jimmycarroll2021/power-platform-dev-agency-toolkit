# Client Discovery Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Structured approach to discovering client needs, assessing technical landscape, and producing actionable discovery reports.

---

## 1. Discovery Questionnaire Template

### 1.1 Business Context

```
Section 1: Business Overview

1.1 Company and Industry
  [ ] What industry are you in?
  [ ] How many employees?
  [ ] How many locations?
  [ ] What is your annual revenue range?
  [ ] Are you regulated (HIPAA, SOX, GDPR, etc.)?

1.2 Current Challenge
  [ ] What problem are you trying to solve?
  [ ] How long has this been a problem?
  [ ] What triggered looking for a solution now?
  [ ] What have you tried before?
  [ ] Why didn't previous solutions work?

1.3 Success Criteria
  [ ] What does success look like in 6 months?
  [ ] What metrics would improve?
  [ ] Who cares about this project succeeding?
  [ ] What happens if this project fails?

1.4 Budget and Timeline
  [ ] Do you have a budget allocated?
  [ ] What is your preferred timeline?
  [ ] Are there hard deadlines (compliance, audit, contract)?
  [ ] Who approves budget decisions?
```

### 1.2 Process Assessment

```
Section 2: Process Deep Dive

2.1 Current Process Mapping
  [ ] Walk me through the process step by step
  [ ] Who initiates? Who approves? Who completes?
  [ ] How long does each step take?
  [ ] Where do delays typically occur?
  [ ] What data is collected at each step?

2.2 Volume and Scale
  [ ] How many transactions per day/week/month?
  [ ] How many people touch each transaction?
  [ ] What are peak periods?
  [ ] What is your 2-year growth projection?

2.3 Pain Point Prioritization
  [ ] Rank these pain points (1-5):
    - Speed/efficiency
    - Accuracy/error rate
    - Visibility/reporting
    - Compliance/audit trail
    - User experience
    - Integration with other systems
    - Mobile access
    - Cost reduction

2.4 Exception Handling
  [ ] What happens when things go wrong?
  [ ] Who handles exceptions?
  [ ] How are escalations managed?
  [ ] What percentage are exceptions vs standard?
```

### 1.3 Technical Assessment

```
Section 3: Technical Landscape

3.1 Microsoft 365 / Azure AD
  [ ] Do you have Microsoft 365? Which plan?
  [ ] How many licensed users?
  [ ] Is Azure AD Connect configured (hybrid identity)?
  [ ] Do you use MFA?
  [ ] Do you have Conditional Access policies?
  [ ] Who manages Azure AD?

3.2 Current Power Platform Usage
  [ ] Do you currently use Power Apps?
  [ ] Do you currently use Power Automate?
  [ ] Do you currently use Dataverse?
  [ ] Do you currently use Power BI?
  [ ] How many apps/flows exist (approximate)?
  [ ] Who built them? Are they still maintained?
  [ ] Are there any governance policies in place?

3.3 Data and Systems
  [ ] What systems hold the data for this process?
    - ERP: _____________ (SAP, Dynamics 365, NetSuite, etc.)
    - CRM: _____________ (Salesforce, Dynamics, HubSpot, etc.)
    - Database: _____________ (SQL Server, Oracle, etc.)
    - File storage: _____________ (SharePoint, file servers, etc.)
  [ ] Are systems cloud-based or on-premises?
  [ ] Do you have APIs or integration points?
  [ ] What is the data quality like?

3.4 Security and Compliance
  [ ] What data classification levels exist?
  [ ] Are there data residency requirements?
  [ ] What compliance frameworks apply?
  [ ] Who handles security audits?
  [ ] Is there a security team?
  [ ] What is the change approval process?

3.5 Infrastructure
  [ ] Do you have Azure subscriptions?
  [ ] Do you use on-premises data gateway?
  [ ] What is your network topology?
  [ ] Do you have development/test environments?
```

---

## 2. Stakeholder Interview Guide

### 2.1 Interview Structure

```
For each stakeholder role, use this structure:

Opening (5 min):
  - Introduction and context
  - Explain discovery purpose
  - Confidentiality assurance
  - Ask permission to record (if applicable)

Current State (15 min):
  - "Walk me through your typical day related to [process]"
  - "What tools do you use?"
  - "What frustrates you most?"
  - "What would you change if you could?"

Pain Points (15 min):
  - "Where do things go wrong?"
  - "How often? How do you fix them?"
  - "What takes the most time?"
  - "What information do you wish you had?"

Future State (10 min):
  - "In an ideal world, how would this work?"
  - "What would make your job easier?"
  - "What reports/dashboards would you want?"
  - "How do you want to be notified?"

Closing (5 min):
  - "Is there anything I haven't asked that I should know?"
  - "Who else should I talk to?"
  - "Any documents I should review?"
  - Thank them and confirm next steps
```

### 2.2 Role-Specific Questions

```
Executive Sponsor:
  - What business outcome are you hoping for?
  - How does this align with strategic priorities?
  - What is the budget approval process?
  - Who are the key decision makers?
  - What would cause this project to be deprioritized?

Process Owner:
  - How is performance measured today?
  - What reports do you generate?
  - How do you know if the process is working well?
  - What compliance requirements exist?
  - Who are the key users?

End Users:
  - Walk me through what you do (show, don't tell)
  - What takes the most time?
  - What errors happen most?
  - What do you do on mobile vs desktop?
  - What training would you need?

IT Admin:
  - What is the current environment setup?
  - What are the security requirements?
  - What integrations exist?
  - What is the change management process?
  - What are the constraints?

Finance:
  - What is the budget?
  - What ROI is expected?
  - How are licenses currently purchased?
  - What is the procurement process?
```

---

## 3. Current State Assessment Framework

### 3.1 Process Maturity Model

```
Level 1: Ad-hoc (Chaos)
  - No defined process
  - Each person does it differently
  - No documentation
  - No tracking
  - Indicators: "It depends on who you ask", "We wing it"

Level 2: Defined (Email/Spreadsheet)
  - Process exists but informal
  - Email or spreadsheet-based
  - Some consistency
  - Limited visibility
  - Indicators: "We have a template", "It's in the shared drive"

Level 3: Managed (Basic Tools)
  - Defined process with basic tools
  - Some automation
  - Basic tracking
  - Known bottlenecks
  - Indicators: "We use SharePoint lists", "We have a form"

Level 4: Automated (Power Platform)
  - Workflow automation
  - Structured data
  - Dashboards and reporting
  - Integration with systems
  - Indicators: "We have an app for that", "Flows handle routing"

Level 5: Optimized (AI/Analytics)
  - Predictive analytics
  - AI-assisted decisions
  - Continuous improvement
  - Self-service reporting
  - Indicators: "AI suggests next actions", "We predict bottlenecks"
```

### 3.2 Technical Readiness Scorecard

```
Score each area 1-5 (1=poor, 5=excellent):

[ ] M365 Licensing           __/5
    - Do they have the right licenses?
    - Is there capacity for premium features?

[ ] Azure AD Setup           __/5
    - Is identity management solid?
    - Is MFA enabled?

[ ] Power Platform Experience __/5
    - Have they built apps/flows before?
    - Is there internal expertise?

[ ] Data Quality             __/5
    - Is data clean and structured?
    - Are there data owners?

[ ] Integration Points       __/5
    - Do systems have APIs?
    - Is integration documented?

[ ] Security Posture         __/5
    - Are security policies defined?
    - Is there a security team?

[ ] Governance               __/5
    - Are there ALM practices?
    - Is there environment management?

[ ] Change Management        __/5
    - Is there a change process?
    - Will users adopt new tools?

Total: __/40

Interpretation:
  32-40: Excellent - Ready for complex solutions
  24-31: Good - Ready with some preparation
  16-23: Fair - Need foundational work first
  8-15: Poor - Significant preparation needed
  0-7: Very Poor - Start with basics
```

---

## 4. Licensing and Capacity Assessment

### 4.1 License Inventory

```
Document current licensing:

Microsoft 365:
  [ ] Plan type: _____________
  [ ] Licensed users: _____________
  [ ] Active users: _____________

Power Platform:
  [ ] Power Apps licenses: _____________
  [ ] Power Automate licenses: _____________
  [ ] Power BI licenses: _____________
  [ ] Dynamics 365 licenses: _____________
  [ ] Copilot Studio: _____________

Azure:
  [ ] Subscription: _____________
  [ ] AD tenant: _____________
  [ ] Key Vault: _____________

Capacity:
  [ ] Dataverse database used: _____________
  [ ] Dataverse file used: _____________
  [ ] AI Builder credits available: _____________

Needs:
  [ ] Additional licenses required: _____________
  [ ] Additional capacity required: _____________
  [ ] Estimated monthly cost: _____________
```

---

## 5. Risk and Constraint Identification

### 5.1 Risk Register Template

```
| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|----|------|-----------|--------|------------|-------|
| R1 | Data quality issues | High | High | Data audit before migration | Client |
| R2 | User adoption resistance | Medium | High | Change management, training | Both |
| R3 | Integration API limitations | Medium | Medium | Technical spike early | Us |
| R4 | License cost higher than budget | Medium | High | Early license assessment | Us |
| R5 | Scope creep | High | Medium | Strict change control | PM |
| R6 | Key stakeholder unavailable | Medium | High | Identify backup contacts | Client |
| R7 | Security/compliance blockers | Low | High | Early security review | Both |
| R8 | Performance with large data | Medium | Medium | Performance testing | Us |
```

### 5.2 Constraint Categories

```
Technical Constraints:
  - No premium connectors allowed (budget)
  - On-premises only (no cloud APIs)
  - Legacy system with no API
  - Data residency requirements
  - MFA required for all access

Organizational Constraints:
  - Change freeze periods
  - Approval processes (procurement, IT, security)
  - Union/labor considerations
  - Multi-language requirements
  - Accessibility requirements

Resource Constraints:
  - Limited client SME availability
  - No internal Power Platform expertise
  - Budget limitations
  - Fixed go-live date
  - Limited test environment access
```

---

## 6. Feasibility Scoring Matrix

### 6.1 Project Feasibility Score

```
Score each factor 1-5:

Business Factors (weight: 30%):
  [ ] Executive sponsorship     __ x 0.06 = ___
  [ ] Clear success criteria    __ x 0.06 = ___
  [ ] Budget availability       __ x 0.06 = ___
  [ ] Business value            __ x 0.06 = ___
  [ ] Timeline flexibility      __ x 0.06 = ___
                                    Subtotal: ___

Technical Factors (weight: 40%):
  [ ] Data availability/quality __ x 0.08 = ___
  [ ] Integration feasibility   __ x 0.08 = ___
  [ ] License readiness         __ x 0.08 = ___
  [ ] Security clearance        __ x 0.08 = ___
  [ ] Technical complexity      __ x 0.08 = ___
                                    Subtotal: ___

Organizational Factors (weight: 30%):
  [ ] User readiness            __ x 0.06 = ___
  [ ] Change appetite           __ x 0.06 = ___
  [ ] Resource availability     __ x 0.06 = ___
  [ ] Governance maturity       __ x 0.06 = ___
  [ ] Previous success          __ x 0.06 = ___
                                    Subtotal: ___

                                    TOTAL: ___/5.0

Interpretation:
  4.0-5.0: Highly feasible - Proceed with confidence
  3.0-3.9: Feasible with preparation - Address gaps
  2.0-2.9: Challenging - Significant preparation needed
  1.0-1.9: Not feasible - Decline or recommend different approach
```

---

## 7. Discovery Report Template

### 7.1 Report Structure

```markdown
# Discovery Report: [Client Name]
## Date: [Date]
## Prepared by: [Consultant Name]

---

## Executive Summary
[1-page summary of findings and recommendations]

## 1. Business Context
- Company overview
- Process description
- Current challenges
- Success criteria

## 2. Current State Assessment
- Process maturity level: [1-5]
- Technical readiness score: [__/40]
- Key pain points (prioritized)
- Current tools and systems

## 3. Technical Landscape
- M365/Azure AD status
- Current Power Platform usage
- Systems integration map
- Data model overview
- Security and compliance requirements

## 4. Recommended Solution
- Solution architecture
- Key components
- Integration points
- Security model
- ALM approach

## 5. Licensing Assessment
- Current licenses
- Required licenses
- Estimated monthly cost
- Capacity requirements

## 6. Project Approach
- Recommended phases
- Timeline estimate
- Team composition
- Key milestones

## 7. Risk Assessment
- Risk register
- Mitigation strategies
- Constraints
- Assumptions

## 8. Feasibility Score
- Overall score: [__/5.0]
- Recommendation: Proceed / Proceed with caution / Decline

## 9. Next Steps
- Immediate actions
- Proposal timeline
- Stakeholder decisions needed
```

---

## 8. Common Client Archetypes

### 8.1 Archetype Profiles

```
ARCHETYPE 1: "The First-Timer"
  Signs: No Power Platform experience, curious but cautious
  Needs: Education, proof of concept, low-risk start
  Approach: Start small, quick win, build confidence
  Best first package: Power Apps Internal Tool (#8) or Workflow Build (#2)

ARCHETYPE 2: "The Sprawler"
  Signs: 50+ apps/flows, no governance, chaos
  Needs: Audit, governance, consolidation
  Approach: Assessment first, then systematic cleanup
  Best first package: Technical Audit (#1), then ALM (#11) + CoE (#12)

ARCHETYPE 3: "The Upgrader"
  Signs: Mature Excel/SharePoint solution, hitting limits
  Needs: Migration path, user transition, data integrity
  Approach: Parallel build, phased migration, training
  Best first package: Excel Modernisation (#7)

ARCHETYPE 4: "The Integrator"
  Signs: Multiple systems that don't talk, API-heavy environment
  Needs: Integration hub, data sync, unified view
  Approach: API assessment, connector strategy, data model
  Best first package: Custom Connector (#9) + Workflow Build (#2)

ARCHETYPE 5: "The Compliance-Driven"
  Signs: Regulatory pressure, audit findings, risk-averse
  Needs: Audit trail, security, documented processes
  Approach: Security-first, compliance review, documentation
  Best first package: Technical Audit (#1), then Case Management (#6)

ARCHETYPE 6: "The Efficiency Seeker"
  Signs: Lean team, manual processes, cost-conscious
  Needs: ROI justification, automation, quick wins
  Approach: ROI calculator, phased approach, measurable outcomes
  Best first package: Approval Automation (#3) + Workflow Build (#2)

ARCHETYPE 7: "The AI Curious"
  Signs: Heard about AI Builder/Copilot, wants to explore
  Needs: Education, use case validation, cost clarity
  Approach: Readiness assessment, pilot, measured expansion
  Best first package: AI Readiness Review (#15), then pilot build
```

---

*End of Client Discovery Guide. Adapt questions and frameworks to each client's specific context.*
