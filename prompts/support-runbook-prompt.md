# Support Runbook Creation Prompt

## Purpose
Use this prompt to create comprehensive support runbooks for Power Platform solutions. Copy and paste into your AI coding agent to produce operational documentation for support teams.

## Instructions for AI Agent

You are a Power Platform operations specialist. Your task is to create a comprehensive support runbook that enables a support team to effectively monitor, maintain, and troubleshoot a Power Platform solution. The runbook must be practical, step-by-step, and usable by support staff with varying technical expertise.

### Input Gathering

Before generating the runbook, confirm or gather:

```
Solution Context:
  - Solution name: [SOLUTION_NAME]
  - Components: [APPS | FLOWS | TABLES | BOTS | PORTALS]
  - Environment: [ENVIRONMENT_URL]
  - Go-live date: [DATE]
  - Support start date: [DATE]

Support Model:
  - Support tiers: [L1 | L2 | L3]
  - Support hours: [HOURS]
  - Response time SLA: [SLA]
  - Resolution time SLA: [SLA]
  - Escalation path: [PATH]

Operations:
  - Monitoring tools: [TOOLS]
  - Alert channels: [TEAMS | EMAIL | SMS]
  - Backup schedule: [SCHEDULE]
  - Maintenance windows: [WINDOWS]
```

### Runbook Structure

#### 1. Document Header

```markdown
# Support Runbook: [Solution Name]

| Attribute | Value |
|-----------|-------|
| Solution | [SOLUTION_NAME] |
| Version | [VERSION] |
| Last Updated | [DATE] |
| Owner | [OWNER] |
| Review Cycle | Monthly |
| Distribution | Support Team |
```

#### 2. Solution Overview

```markdown
### Architecture Summary

```
[High-level description of the solution]
```

### Component Inventory

| Component | Type | Purpose | Criticality | Owner |
|-----------|------|---------|-------------|-------|
| [Component 1] | Canvas App | [Purpose] | High | [Owner] |
| [Component 2] | Cloud Flow | [Purpose] | High | [Owner] |
| [Component 3] | Dataverse Table | [Purpose] | High | [Owner] |
| [Component 4] | Copilot Agent | [Purpose] | Medium | [Owner] |
| [Component 5] | Custom Connector | [Purpose] | Medium | [Owner] |

### Integration Points

| Integration | Source | Target | Type | Frequency | Criticality |
|-------------|--------|--------|------|-----------|-------------|
| [Integration 1] | [Source] | [Target] | [Type] | [Frequency] | [Level] |
| [Integration 2] | [Source] | [Target] | [Type] | [Frequency] | [Level] |

### Key Contacts

| Role | Name | Contact | Availability |
|------|------|---------|-------------|
| Solution Owner | [Name] | [Email/Phone] | Business hours |
| Technical Lead | [Name] | [Email/Phone] | 24/7 (critical) |
| Power Platform Admin | [Name] | [Email/Phone] | Business hours |
| Infrastructure | [Name] | [Email/Phone] | 24/7 |
| Microsoft Support | Premier Support | [Ticket method] | Per contract |
```

#### 3. Monitoring Setup

```markdown
### Dashboards

| Dashboard | URL | Purpose | Refresh Frequency |
|-----------|-----|---------|-------------------|
| Solution Health | [URL] | Overall health | Real-time |
| Flow Performance | [URL] | Flow success/failure | 5 minutes |
| App Usage | [URL] | Adoption metrics | Daily |
| Error Tracking | [URL] | Error trends | Real-time |

### Alerts

| Alert Name | Condition | Severity | Channel | Response Time | Action |
|-----------|-----------|----------|---------|--------------|--------|
| Flow failure spike | > 10 failures/hour | Critical | Teams + Email | 15 min | [Action] |
| App error rate | > 5% errors | High | Email | 1 hour | [Action] |
| Storage > 80% | Capacity warning | High | Email | 4 hours | [Action] |
| AI credits exhausted | No credits remaining | Medium | Email | 24 hours | [Action] |
| License unused | No login 30 days | Low | Weekly report | N/A | Review |

### Health Check Procedures

```markdown
### Daily Health Check (5 minutes)

1. Open [Dashboard URL]
2. Check flow success rate (target: > 95%)
3. Check app error rate (target: < 1%)
4. Review any overnight alerts
5. Log findings in [Log location]

### Weekly Health Check (30 minutes)

1. Review daily logs for the week
2. Check AI Builder credit consumption
3. Check Dataverse storage growth
4. Review user adoption trends
5. Check for any Microsoft service advisories
6. Document in weekly report

### Monthly Review (2 hours)

1. Comprehensive performance review
2. Security audit (permission changes, DLP violations)
3. Capacity planning (storage, credits, licenses)
4. Incident trend analysis
5. Knowledge base review and updates
6. Runbook accuracy verification
```
```

#### 4. Incident Response Procedures

```markdown
### Incident Classification

| Severity | Definition | Examples | Response Time | Resolution Target |
|----------|-----------|----------|--------------|-------------------|
| P1 - Critical | Service down, data loss | All flows failing, app inaccessible | 15 minutes | 4 hours |
| P2 - High | Major feature broken | Specific flow failing, data sync broken | 1 hour | 8 hours |
| P3 - Medium | Feature degraded | Slow performance, intermittent errors | 4 hours | 3 days |
| P4 - Low | Minor issue | Cosmetic bug, single user issue | 24 hours | Next release |

### Incident Response Workflow

```
Detect -> Triage -> Respond -> Resolve -> Post-Incident Review
```

### Common Incident Runbooks

#### Incident: Flow Failing

| Step | Action | Expected Result | Time |
|------|--------|----------------|------|
| 1 | Check flow run history | Identify failing action | 2 min |
| 2 | Check connection references | All show "Connected" | 2 min |
3 | Review error message | Identify error type | 2 min |
| 4 | Check external system status | System is accessible | 3 min |
| 5 | Attempt manual retry | Success or same error | 2 min |
| 6 | If resolved: Document and close | | 2 min |
| 7 | If not resolved: Escalate to L2 | Handoff with context | 2 min |

#### Incident: App Not Loading

| Step | Action | Expected Result | Time |
|------|--------|----------------|------|
| 1 | Test app from different browser | Narrow browser vs app issue | 2 min |
| 2 | Check Power Platform service health | All systems operational | 2 min |
| 3 | Check user permissions | User has correct security role | 2 min |
| 4 | Check Dataverse connectivity | Connection successful | 2 min |
| 5 | Check for recent solution changes | Identify if change-related | 3 min |
| 6 | If resolved: Document and close | | 2 min |
| 7 | If not resolved: Escalate to L2 | Handoff with context | 2 min |

#### Incident: Data Not Syncing

| Step | Action | Expected Result | Time |
|------|--------|----------------|------|
| 1 | Check flow trigger (is it running?) | Flow is enabled and triggering | 2 min |
| 2 | Check last successful run | Identify when issue started | 2 min |
| 3 | Check external system connectivity | Ping/API test successful | 3 min |
| 4 | Check for schema changes | No unexpected changes | 3 min |
| 5 | Check for authentication issues | Credentials valid | 2 min |
| 6 | If resolved: Document and close | | 2 min |
| 7 | If not resolved: Escalate to L2 | Handoff with context | 2 min |

#### Incident: Copilot Agent Not Responding

| Step | Action | Expected Result | Time |
|------|--------|----------------|------|
| 1 | Test agent in Copilot Studio | Agent responds in test | 2 min |
| 2 | Check message credit balance | Credits available | 1 min |
| 3 | Check knowledge source sync | Sources up to date | 2 min |
| 4 | Check channel configuration | Channel enabled and configured | 2 min |
| 5 | Review recent agent changes | Identify if change-related | 3 min |
| 6 | If resolved: Document and close | | 2 min |
| 7 | If not resolved: Escalate to L2 | Handoff with context | 2 min |
```

#### 5. Escalation Procedures

```markdown
### Escalation Matrix

| From | To | Trigger | Method | Information Required |
|------|-----|---------|--------|---------------------|
| L1 | L2 | L1 SLA breached or超出能力 | Ticket escalation | Full ticket history, attempted fixes |
| L2 | L3 | Platform bug or architecture issue | Direct escalation | Technical details, reproduction steps |
| L3 | Microsoft | Confirmed platform issue | Premier support ticket | Tenant ID, correlation IDs |
| Any | Emergency | Data breach or outage | Emergency contact | Immediate notification |

### Escalation Template

```
ESCALATION: [P1/P2/P3/P4] - [Brief description]

Incident ID: [ID]
Time: [Timestamp]
Environment: [URL]
Component: [Component]
Impact: [Number of users/business impact]

Symptoms:
- [Symptom 1]
- [Symptom 2]

Actions Taken:
1. [Action]
2. [Action]

Evidence:
- [Screenshot/log/URL]

Next Steps Required:
- [What L2/L3 needs to do]
```
```

#### 6. Maintenance Procedures

```markdown
### Scheduled Maintenance

| Maintenance Task | Frequency | Duration | Window | Procedure |
|-----------------|-----------|----------|--------|-----------|
| Solution backup | Weekly | 30 min | Off-peak | [Steps] |
| Credential rotation | 90 days | 15 min | Business hours | [Steps] |
| License review | Monthly | 30 min | Business hours | [Steps] |
| Performance review | Monthly | 1 hour | Business hours | [Steps] |
| Knowledge base update | Monthly | 2 hours | Business hours | [Steps] |
| Security audit | Quarterly | 4 hours | Business hours | [Steps] |
| Disaster recovery test | Quarterly | 4 hours | Maintenance window | [Steps] |

### Backup and Recovery

```markdown
### Backup Procedure

1. Export managed solution from production
2. Store in [Backup location]
3. Name with timestamp: [SolutionName_YYYYMMDD.zip]
4. Verify export completed successfully
5. Log backup in [Backup log]

### Recovery Procedure

1. Identify last known good backup
2. Export current state (for forensics)
3. Import backup solution to environment
4. Verify all components restored
5. Test critical functionality
6. Notify stakeholders
7. Document incident and lessons learned
```
```

#### 7. Knowledge Base

```markdown
### Quick Reference Cards

#### Card 1: Flow Status Check
```
1. Go to make.powerautomate.com
2. Navigate to My flows / Team flows
3. Check column: Status (On/Off)
4. Check column: Runs (28-day history)
5. Click flow name for detailed history
6. Red = failed; investigate
```

#### Card 2: User Access Check
```
1. Go to admin.powerplatform.microsoft.com
2. Navigate to Environments > [Environment]
3. Click Users
4. Search for user
5. Check security roles assigned
6. Verify app sharing permissions
```

#### Card 3: Connection Reference Check
```
1. Go to make.powerautomate.com
2. Navigate to Connections
3. Check status column
4. "Connected" = good
5. "Error" = re-authenticate
6. Click Fix connection if needed
```

### FAQ

| Question | Answer |
|----------|--------|
| "How do I grant access to a new user?" | Assign security role in Dataverse + share app |
| "How do I restart a failed flow?" | Open flow > Run history > Resubmit |
| "Where do I find error logs?" | Flow run history or [Log location] |
| "How do I check if AI credits are low?" | Go to [Dashboard URL] or AI Builder > Overview |
| "Who do I contact for [issue]?" | Check escalation matrix above |
```

### Quality Checklist

- [ ] All components documented
- [ ] Monitoring dashboards configured
- [ ] Alert thresholds set
- [ ] Common incidents have runbooks
- [ ] Escalation matrix published
- [ ] Contact list current
- [ ] Recovery procedures tested
- [ ] Knowledge base populated

## Customization Variables

- `[SOLUTION_NAME]`: Name of the solution
- `[ENVIRONMENT_URL]`: Production environment URL
- `[OWNER]`: Runbook owner

## Important Notes

- Update runbook after every incident (continuous improvement)
- Test recovery procedures quarterly
- Review and update contact information monthly
- Train support team on all procedures before go-live
- **Needs verification against current Microsoft docs**: Verify monitoring capabilities, service health information, and admin procedures against current Microsoft documentation.
