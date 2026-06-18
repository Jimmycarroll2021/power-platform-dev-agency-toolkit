# Delivery Model Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: How we deliver Power Platform projects - from discovery to support.

---

## 1. Project Phases

### 1.1 Phase Overview

```
Phase 1: DISCOVERY        (1-3 weeks)
Phase 2: DESIGN            (2-4 weeks)
Phase 3: BUILD             (4-12 weeks)
Phase 4: TEST              (2-4 weeks)
Phase 5: DEPLOY            (1-2 weeks)
Phase 6: SUPPORT           (Ongoing)
```

### 1.2 Phase 1: Discovery

```
Duration: 1-3 weeks
Price model: Fixed fee (typically $5,000-$15,000)

Activities:
  - Stakeholder interviews
  - Current state assessment
  - Technical landscape review
  - Licensing assessment
  - Feasibility analysis
  - Risk identification

Deliverables:
  - Discovery Report
  - Solution architecture recommendation
  - Licensing estimate
  - Project scope and SOW
  - Risk register

Exit criteria:
  - Client signs off on Discovery Report
  - SOW agreed and signed
  - Budget approved
  - Project team assigned
```

### 1.3 Phase 2: Design

```
Duration: 2-4 weeks

Activities:
  - Data model design (Dataverse tables, relationships)
  - Security model design (roles, BU structure)
  - App wireframes and UX design
  - Flow architecture diagrams
  - Integration design
  - ALM strategy definition
  - Test plan creation

Deliverables:
  - Technical Design Document
  - Data model diagram
  - Security model diagram
  - Wireframes/mockups
  - ALM plan
  - Test plan
  - Project schedule

Exit criteria:
  - Design review completed
  - Client approves design
  - No outstanding design questions
  - Development environment ready
```

### 1.4 Phase 3: Build

```
Duration: 4-12 weeks (varies by project size)
Method: Agile sprints (2-week sprints)

Sprint structure:
  Week 1:
    Monday:    Sprint planning (2 hours)
    Tue-Fri:   Development work
  
  Week 2:
    Mon-Thu:   Development + peer review
    Friday:    Sprint demo + retrospective

Daily activities:
  - Daily standup (15 minutes)
  - Development work
  - Peer code review
  - Unit testing
  - Solution packaging

Sprint deliverables:
  - Working, tested components
  - Updated solution in dev environment
  - Sprint demo to client
  - Sprint retrospective notes

Exit criteria:
  - All scope items developed
  - Solution checker passes
  - Peer review complete
  - Unit tests pass
```

### 1.5 Phase 4: Test

```
Duration: 2-4 weeks

Test levels:
  Unit Test (developer):
    - Individual flow actions
    - App screen functionality
    - Plugin logic
    - Business rule validation

  Integration Test (QA):
    - End-to-end flows
    - Cross-system integration
    - Data migration validation
    - Security role testing

  UAT (client):
    - Business scenarios
    - Edge cases
    - Performance with real data
    - Sign-off criteria

Deliverables:
  - Test results document
  - Defect log (resolved/known)
  - UAT sign-off
  - Performance baseline

Exit criteria:
  - All critical defects resolved
  - UAT sign-off received
  - Performance acceptable
  - Rollback plan tested
```

### 1.6 Phase 5: Deploy

```
Duration: 1-2 weeks

Pre-deployment (1 week before):
  - Final solution export (managed)
  - Deployment checklist review
  - Stakeholder notification
  - Backup verification
  - Rollback plan confirmed

Deployment day:
  - Deploy during maintenance window
  - Import managed solution to PROD
  - Activate flows
  - Verify connections
  - Smoke tests
  - Monitor for 4 hours

Post-deployment:
  - User notification
  - Training delivery
  - Support handover
  - Monitor for 1 week

Exit criteria:
  - Solution deployed successfully
  - Smoke tests pass
  - Users can access
  - No critical issues
  - Support team briefed
```

### 1.7 Phase 6: Support

```
See support-and-runbooks.md for detailed support model.

Key elements:
  - Warranty period: 30 days post go-live
  - Support tiers: L1 (helpdesk), L2 (internal), L3 (us)
  - Response times defined in SLA
  - Regular health checks
  - Continuous improvement backlog
```

---

## 2. Roles and Responsibilities

### 2.1 Project Team Structure

| Role | Responsibility | Allocation |
|------|---------------|------------|
| **Project Manager** | Schedule, budget, communication, risk | 0.5 FTE |
| **Solution Architect** | Technical design, integration, ALM | 0.5-1 FTE |
| **Power Platform Developer** | Build apps, flows, Dataverse config | 1-3 FTE |
| **Dataverse Developer** | Tables, relationships, plugins, security | 0.5-1 FTE |
| **UX Designer** | Wireframes, user experience | 0.25-0.5 FTE |
| **QA Tester** | Test planning, execution, UAT support | 0.5 FTE |
| **Change Manager** | Training, adoption, comms | 0.25 FTE |

### 2.2 Client Responsibilities

```
Client must provide:
  - Business subject matter expert (SME) - 0.5 FTE during build
  - Technical liaison (IT contact) - 0.25 FTE
  - Executive sponsor
  - UAT testers (3-5 business users)
  - Access to environments and systems
  - Timely feedback and decisions
  - Change approval process
```

---

## 3. Client Communication Cadence

```
Weekly:
  - Status email (every Friday)
    - What was completed this week
    - What's planned next week
    - Risks and issues
    - Budget status

Bi-weekly:
  - Sprint demo (every 2 weeks)
    - Demonstrate working software
    - Gather feedback
    - Adjust priorities

Monthly:
  - Steering committee meeting
    - Budget review
    - Scope change decisions
    - Risk review
    - Strategic alignment

Ad-hoc:
  - Issue escalation calls
  - Technical deep-dives
  - Design reviews

Communication tools:
  - Teams channel: Project collaboration
  - Email: Formal communications
  - Azure DevOps/Jira: Task tracking
  - SharePoint: Document repository
```

---

## 4. Sprint Structure for Power Platform Projects

### 4.1 Sprint Calendar (2-week sprint)

```
Day 1 (Monday AM):
  Sprint Planning (2 hours)
    - Review backlog
    - Estimate stories
    - Commit to sprint scope
    - Assign tasks

Day 1-4 (Mon-Thu Week 1):
  Development
    - Build components
    - Peer review
    - Unit testing

Day 5 (Friday Week 1):
  Mid-sprint check
    - Progress review
    - Blocker identification
    - Scope adjustment if needed

Day 6-9 (Mon-Thu Week 2):
  Development + Testing
    - Complete development
    - QA testing
    - Bug fixes
    - Solution packaging

Day 10 (Friday Week 2):
  Sprint Demo (1 hour)
    - Demo working features to client
    - Gather feedback
    - Update backlog

  Sprint Retrospective (30 min, internal)
    - What went well?
    - What could improve?
    - Action items

  Sprint Close
    - Export solution
    - Update documentation
    - Prepare for next sprint
```

### 4.2 Story Point Estimation

```
Use modified Fibonacci scale:
  1: Trivial (change label text, update env var)
  2: Simple (new field, simple flow action)
  3: Small (new column, simple business rule)
  5: Medium (new flow, form customization)
  8: Large (new table, complex flow with error handling)
  13: Complex (plugin, custom API, complex integration)
  21: Very complex (multi-system integration, RPA)

Team velocity:
  Track completed points per sprint
  Use 3-sprint average for planning
  Adjust for holidays, PTO
```

---

## 5. Documentation Standards

### 5.1 Required Documentation

```
For every project:

1. Technical Design Document
   - Architecture overview
   - Data model (tables, relationships)
   - Security model (roles, BU)
   - Integration design
   - ALM strategy
   - Environment details

2. Build Documentation
   - Solution component inventory
   - Environment variables list
   - Connection references
   - Flow documentation (trigger, actions, error handling)
   - App documentation (screens, data sources, formulas)

3. Runbook
   - Deployment procedures
   - Troubleshooting guide
   - Common issues and resolutions
   - Escalation procedures
   - Contact information

4. User Guide
   - Step-by-step instructions
   - Screenshots
   - FAQ
   - Video tutorials (recommended)

5. Admin Guide
   - Environment management
   - User management
   - Security role assignment
   - Backup/restore procedures
   - Capacity monitoring
```

### 5.2 Documentation Templates

```
Flow documentation template:
  Flow Name: [Name]
  Purpose: [What this flow does]
  Trigger: [When it runs]
  Owner: [Service account]
  Solution: [Which solution]
  
  Steps:
    1. [Action]: [Description]
    2. [Action]: [Description]
    ...
  
  Error Handling: [How errors are handled]
  Connections: [Connection references used]
  Environment Variables: [Used variables]
  
  Change Log:
    [Date]: [Author]: [Change description]

App documentation template:
  App Name: [Name]
  Type: [Canvas/Model-Driven]
  Purpose: [What this app does]
  Users: [Target audience]
  
  Data Sources: [List]
  Security Roles: [Required roles]
  
  Screens: [List with descriptions]
  
  Key Formulas: [Document complex formulas]
  
  Change Log:
    [Date]: [Author]: [Change description]
```

---

## 6. Change Management Process

### 6.1 Change Request Process

```
1. Request submitted (client or team)
   - Description of change
   - Business justification
   - Requested by: [Name, Date]

2. Impact assessment (internal, within 2 business days)
   - Effort estimate (hours)
   - Schedule impact
   - Budget impact
   - Risk assessment
   - Dependencies

3. Client approval/rejection
   - Review impact assessment
   - Approve with budget adjustment
   - Reject with reason
   - Defer to future phase

4. If approved:
   - Add to backlog
   - Schedule in upcoming sprint
   - Update SOW if needed

5. If rejected:
   - Document reason
   - Add to "future considerations"
   - Revisit in project retrospective
```

### 6.2 Change Categories

```
Category 1: Minor (no approval needed, track only)
  - Bug fixes (in scope)
  - Label/text changes
  - Color/layout tweaks
  - Existing feature refinement

Category 2: Moderate (PM approval, inform client)
  - New fields/columns
  - Additional flow actions
  - New report/chart
  - Additional test scenarios

Category 3: Major (client approval required)
  - New tables/entities
  - New integrations
  - Security model changes
  - Scope additions
  - Significant rework
```

---

## 7. UAT and Sign-Off Criteria

### 7.1 UAT Process

```
Week 1: UAT Preparation
  - Deploy to UAT environment
  - Load test data
  - Provide UAT guide
  - Train UAT testers
  - Set up UAT Teams channel

Week 2: UAT Execution
  - Testers execute test scenarios
  - Log defects in shared tracker
  - Daily standup to review progress
  - Triage defects (critical/high/medium/low)

Week 3: Defect Resolution + Retest
  - Team fixes critical and high defects
  - Testers retest fixed items
  - Regression testing

Week 4: UAT Sign-Off
  - Review remaining defects (deferred vs must-fix)
  - Client provides UAT sign-off
  - OR: Lists must-fix items blocking sign-off
```

### 7.2 Sign-Off Criteria

```
For UAT sign-off, ALL must be true:

[ ] All critical test scenarios passed
[ ] All high-priority defects resolved
[ ] Medium/low defects documented with acceptance
[ ] Performance meets defined benchmarks
[ ] Security roles tested and working
[ ] Data migration validated (if applicable)
[ ] Integration endpoints verified
[ ] Rollback procedure tested
[ ] Training materials delivered
[ ] Support documentation complete
[ ] Business sponsor confirms readiness
```

---

## 8. Go-Live Checklist

```
48 hours before:
  [ ] Final managed solution exported
  [ ] Solution checker passed
  [ ] Deployment runbook reviewed
  [ ] Rollback plan confirmed
  [ ] Stakeholders notified of go-live window
  [ ] Support team on standby

24 hours before:
  [ ] Production environment backed up
  [ ] Service accounts verified active
  [ ] Connection references tested
  [ ] DLP policies verified
  [ ] Monitoring configured

Go-live day:
  [ ] Maintenance window confirmed
  [ ] Import managed solution
  [ ] Activate plugins
  [ ] Turn on flows
  [ ] Verify connections
  [ ] Run smoke tests
  [ ] Verify with business user
  [ ] Send go-live notification
  [ ] Monitor for 4 hours

Post go-live:
  [ ] Monitor error logs (48 hours)
  [ ] Check flow run success rates
  [ ] Gather initial feedback
  [ ] Daily check-ins with client (first week)
  [ ] Weekly check-ins (first month)
```

---

## 9. Post-Go-Live Support Model

```
Week 1-2: Hypercare
  - Daily standup with client
  - Monitor all flow runs
  - Respond to issues within 2 hours
  - Track all questions and issues
  - Daily status report

Week 3-4: Stabilization
  - Every-other-day check-ins
  - Monitor critical flows
  - Respond within 4 hours
  - Weekly status report
  - Address feedback

Month 2-3: Warranty
  - Weekly check-ins
  - Respond within 8 hours
  - Fix defects (in scope)
  - Bi-weekly status report

Month 4+: Support agreement
  - Per support contract
  - Standard SLA response times
  - Monthly health checks
  - Continuous improvement
```

---

## 10. Escalation Procedures

```
Level 1: Project Team (same day response)
  - Developer: Technical issues
  - PM: Schedule/budget issues
  - QA: Testing issues

Level 2: Project Lead + Client Sponsor (24-hour response)
  - Unresolved Level 1 issues
  - Scope disagreements
  - Resource conflicts

Level 3: Executive (48-hour response)
  - Contract disputes
  - Budget overruns
  - Project continuation decisions

Escalation triggers:
  - Issue unresolved after 3 business days
  - Budget variance > 10%
  - Schedule slip > 1 week
  - Quality concerns
  - Relationship issues
```

---

## 11. Team Composition by Project Size

### 11.1 Small Project ($25K-$75K)

```
Duration: 4-8 weeks

Team:
  - Project Manager (0.25 FTE)
  - Power Platform Developer (1 FTE)
  - QA (0.25 FTE, shared)

Client:
  - SME (0.25 FTE)
  - UAT testers (2 people)

Typical scope:
  - 1-2 canvas apps
  - 5-10 flows
  - 2-3 Dataverse tables
  - Simple security model
```

### 11.2 Medium Project ($75K-$200K)

```
Duration: 8-16 weeks

Team:
  - Project Manager (0.5 FTE)
  - Solution Architect (0.5 FTE)
  - Power Platform Developer (2 FTE)
  - Dataverse Developer (0.5 FTE)
  - QA (0.5 FTE)
  - UX Designer (0.25 FTE)

Client:
  - SME (0.5 FTE)
  - Technical liaison (0.25 FTE)
  - UAT testers (3-5 people)

Typical scope:
  - Model-driven app + canvas app
  - 10-20 flows
  - 5-10 Dataverse tables
  - Full security model
  - 1-2 integrations
```

### 11.3 Large Project ($200K-$500K)

```
Duration: 16-26 weeks

Team:
  - Project Manager (1 FTE)
  - Solution Architect (1 FTE)
  - Power Platform Developers (3 FTE)
  - Dataverse Developer (1 FTE)
  - QA (1 FTE)
  - UX Designer (0.5 FTE)
  - Change Manager (0.25 FTE)

Client:
  - SMEs (1-2 FTE)
  - Technical liaison (0.5 FTE)
  - Executive sponsor
  - UAT testers (5-10 people)

Typical scope:
  - Multiple apps (canvas + model-driven)
  - 20+ flows
  - 10+ Dataverse tables
  - Complex security model
  - Multiple integrations
  - ALM + governance setup
  - Training program
```

---

*End of Delivery Model Guide. Adapt timelines and team sizes based on actual project requirements.*
