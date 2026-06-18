# Support Runbook Template

> **System:** _________________________________
> **Version:** _________________________________
> **Environment:** [ Production / UAT / Test ]
> **Last Updated:** _________________________________
> **Owner:** _________________________________
> **Next Review Date:** _________________________________

---

## 1. System Overview

### 1.1 Solution Summary

| Item | Detail |
|------|--------|
| System Name | |
| Purpose | |
| Users (approx.) | |
| Business Criticality | Critical / High / Medium / Low |
| Go-Live Date | |
| Last Release | |
| Technology Stack | Power Platform + [other technologies] |

### 1.2 Architecture Diagram

```
[Insert simplified architecture diagram for support context]

[Users] --> [Power Apps] --> [Dataverse]
               |                |
          [Power Automate] --> [External Systems]
               |
          [AI Builder / Copilot]
```

### 1.3 Key Components

| Component | Type | Environment | Health Status |
|-----------|------|------------|---------------|
| [App Name] | Canvas App | Production | |
| [App Name] | Model-Driven App | Production | |
| [Table Name] | Dataverse Table | Production | |
| [Flow Name] | Cloud Flow | Production | |
| [Flow Name] | Scheduled Flow | Production | |
| [Dashboard] | Power BI | Production | |

### 1.4 Business Hours

| Region | Business Hours (Local) | Business Hours (UTC) |
|--------|----------------------|---------------------|
| Primary | | |
| Secondary | | |

---

## 2. Support Tiers and Contacts

### 2.1 Support Tier Structure

```
TIER 1 (Client IT / Helpdesk)
  ├── Initial triage
  ├── Password resets
  ├── User guidance
  └── Escalation to Tier 2 if unresolved in [X] hours

TIER 2 (Power Platform Support Team)
  ├── Technical investigation
  ├── Configuration issues
  ├── Flow debugging
  └── Escalation to Tier 3 if unresolved in [X] hours

TIER 3 (Delivery Team / Microsoft)
  ├── Complex technical issues
  ├── Platform bugs
  ├── Custom code issues
  └── Microsoft support tickets
```

### 2.2 Support Contacts

#### Tier 1: Client Helpdesk

| Role | Name | Email | Phone | Hours |
|------|------|-------|-------|-------|
| Helpdesk Email | | | | |
| Helpdesk Phone | | | | |
| IT Manager | | | | |

#### Tier 2: Power Platform Support Team

| Role | Name | Email | Phone | Hours |
|------|------|-------|-------|-------|
| Primary Support | | | | Business hours |
| Secondary Support | | | | Business hours |
| Support Email | | | | |
| Support Teams Channel | | | | |

#### Tier 3: Delivery Team / Platform Vendor

| Role | Name | Email | Phone | Escalation Trigger |
|------|------|-------|-------|-------------------|
| Solution Architect | | | | Technical escalation |
| Delivery Lead | | | | Commercial escalation |
| Microsoft Support | | | | Platform issues |
| Third-Party Vendor | | | | Integration issues |

### 2.3 Escalation Matrix

| Time Elapsed | Action | Notify |
|-------------|--------|--------|
| 1 hour (Critical) | Tier 2 engaged | Tier 2 team |
| 4 hours (Critical) | Tier 3 engaged | Delivery Lead |
| 8 hours (Critical) | Executive notification | Steering Committee |
| 4 hours (High) | Tier 2 engaged | Tier 2 team |
| 8 hours (High) | Tier 3 engaged | Delivery Lead |
| 24 hours (Medium) | Tier 2 engaged | Tier 2 team |
| 72 hours (Low) | Tier 2 engaged | Tier 2 team |

---

## 3. Common Issues and Resolutions

### 3.1 Access Issues

#### ISSUE-001: User Cannot Access the App

**Symptoms:** User reports "You don't have permission" or cannot find the app

**Troubleshooting Steps:**
1. [ ] Verify user has appropriate security role assigned
2. [ ] Verify user is in the correct business unit
3. [ ] Verify user has Power Apps license assigned
4. [ ] Check if user is in the environment security group
5. [ ] Check DLP policy - user may be blocked
6. [ ] Verify app is shared with the user or their team

**Resolution:**
- Assign appropriate security role
- Share the app with the user
- Assign Power Apps license

**Prevention:**
- Automated user onboarding process
- Regular access review

---

#### ISSUE-002: User Cannot See Expected Data

**Symptoms:** User can access app but sees incomplete or no data

**Troubleshooting Steps:**
1. [ ] Check user's security role - read permissions on table?
2. [ ] Check business unit scope - user scope vs org scope?
3. [ ] Check if records are owned by the user or their team
4. [ ] Verify there are no active filters hiding data
5. [ ] Check if hierarchical security is affecting visibility

**Resolution:**
- Adjust security role permissions
- Reassign record ownership
- Adjust business unit/team membership

---

### 3.2 Flow Issues

#### ISSUE-003: Flow Not Triggering

**Symptoms:** Expected automation not running when record is created/updated

**Troubleshooting Steps:**
1. [ ] Check flow is turned ON
2. [ ] Check flow owner has valid connections
3. [ ] Check flow is not suspended (due to errors)
4. [ ] Verify trigger conditions are met
5. [ ] Check if flow is in a solution (managed layer issues)
6. [ ] Review flow run history for error messages
7. [ ] Check if DLP policy is blocking connections

**Resolution:**
- Turn on flow
- Fix broken connections
- Fix trigger conditions
- Re-save flow to refresh

**Prevention:**
- Use service accounts for flow ownership
- Monitor flow health dashboard
- Set up flow failure alerts

---

#### ISSUE-004: Flow Fails with Error

**Symptoms:** Flow shows failed runs in run history

**Common Error Messages and Resolutions:**

| Error Message | Cause | Resolution |
|--------------|-------|-----------|
| "Connection not found" | Connection deleted or expired | Recreate connection |
| "API rate limit exceeded" | Throttling from external API | Add delay, implement retry |
| "Item not found" | Record deleted or ID changed | Add error handling |
| "Bad request" | Invalid payload to API | Validate request format |
| "Timeout" | Operation took too long | Optimize or split operation |
| "Unauthorized" | Auth token expired | Refresh connection |

---

### 3.3 Performance Issues

#### ISSUE-005: App Loading Slowly

**Symptoms:** App takes > 5 seconds to load or navigate between screens

**Troubleshooting Steps:**
1. [ ] Check data source - delegation warnings?
2. [ ] Check number of concurrent users
3. [ ] Check for large gallery datasets (not delegating)
4. [ ] Check OnStart formulas for heavy operations
5. [ ] Check network connectivity
6. [ ] Check Dataverse capacity usage (if > 80%, may impact)

**Quick Fixes:**
- Add loading indicators
- Implement pagination
- Use collections for cached data
- Optimize formulas

---

#### ISSUE-006: Flow Running Slowly

**Symptoms:** Flow takes longer than expected to complete

**Troubleshooting Steps:**
1. [ ] Check loop iterations (too many?)
2. [ ] Check API response times
3. [ ] Check for nested apply-to-each loops
4. [ ] Check Dataverse query performance
5. [ ] Check if flow is hitting concurrency limits

---

### 3.4 Data Issues

#### ISSUE-007: Data Not Syncing with External System

**Symptoms:** Expected data not appearing in external system or vice versa

**Troubleshooting Steps:**
1. [ ] Check integration flow status
2. [ ] Check API endpoint accessibility
3. [ ] Verify API credentials are valid
4. [ ] Check for data transformation errors
5. [ ] Review integration error log table
6. [ ] Check for duplicate prevention logic blocking

---

#### ISSUE-008: Incorrect Data in Reports

**Symptoms:** Dashboard/report shows incorrect or outdated data

**Troubleshooting Steps:**
1. [ ] Check data refresh schedule
2. [ ] Check if filters are applied correctly
3. [ ] Verify data source connections
4. [ ] Check for data entry errors
5. [ ] Verify business rules are calculating correctly

---

### 3.5 Integration Issues

#### ISSUE-009: External API Unavailable

**Symptoms:** All integration flows failing with connection errors

**Troubleshooting Steps:**
1. [ ] Check external API status page
2. [ ] Test API endpoint from browser/Postman
3. [ ] Check network connectivity from Power Platform
4. [ ] Verify firewall rules haven't changed
5. [ ] Check API subscription/credits not expired

---

### 3.6 Issue Reference Summary

| Issue ID | Issue | Category | Avg. Resolution Time |
|----------|-------|----------|---------------------|
| ISSUE-001 | User cannot access app | Access | 15 min |
| ISSUE-002 | User cannot see data | Access | 20 min |
| ISSUE-003 | Flow not triggering | Automation | 30 min |
| ISSUE-004 | Flow fails with error | Automation | 45 min |
| ISSUE-005 | App loading slowly | Performance | 1 hour |
| ISSUE-006 | Flow running slowly | Performance | 1 hour |
| ISSUE-007 | Data not syncing | Data | 1 hour |
| ISSUE-008 | Incorrect report data | Data | 30 min |
| ISSUE-009 | External API unavailable | Integration | 2 hours |

---

## 4. Escalation Procedures

### 4.1 Escalation Criteria

**Escalate to Tier 3 when:**
- Issue affects > 10 users
- Issue impacts business-critical process
- Tier 2 cannot resolve within SLA
- Suspected platform bug
- Data integrity concern
- Security-related issue

**Escalate to Vendor/Microsoft when:**
- Confirmed platform bug
- Performance degradation at platform level
- License/capacity issue requiring Microsoft

### 4.2 Escalation Process

```
1. Document issue in ticketing system
2. Attempt Tier 1 resolution
3. Escalate to Tier 2 with documentation
4. Tier 2 investigates and attempts resolution
5. If unresolved, escalate to Tier 3
6. Tier 3 determines if vendor escalation needed
7. Create vendor ticket if required
8. Track to resolution
```

### 4.3 Vendor Contact Information

| Vendor | Support Portal | Phone | Account Number |
|--------|---------------|-------|---------------|
| Microsoft | admin.powerplatform.microsoft.com | | |
| [Third Party] | | | |

---

## 5. Maintenance Windows

### 5.1 Scheduled Maintenance

| Maintenance Type | Frequency | Window (UTC) | Duration | Impact |
|-----------------|-----------|-------------|----------|--------|
| Solution updates | Monthly | Saturday 02:00-06:00 | 2-4 hours | Read-only |
| Security patching | As needed | Saturday 02:00-06:00 | 1-2 hours | Minimal |
| Data cleanup | Monthly | Sunday 02:00-04:00 | 1-2 hours | None |
| Capacity review | Monthly | Business hours | 1 hour | None |

### 5.2 Emergency Maintenance

Emergency maintenance may be required for:
- Critical security patches
- Data integrity fixes
- Platform-mandated updates

**Emergency Process:**
1. Assess urgency and impact
2. Notify stakeholders (minimum 2 hours notice if possible)
3. Execute maintenance
4. Validate system health
5. Communicate completion

### 5.3 Change Freeze Periods

| Period | Reason | Change Status |
|--------|--------|--------------|
| | | No changes except critical fixes |

---

## 6. Monitoring Dashboards

### 6.1 System Health Dashboard

| Metric | Healthy Threshold | Warning Threshold | Critical Threshold | Current |
|--------|------------------|------------------|-------------------|---------|
| Flow success rate | > 95% | 90-95% | < 90% | |
| App load time | < 3s | 3-5s | > 5s | |
| Dataverse capacity | < 70% | 70-85% | > 85% | |
| API availability | > 99% | 95-99% | < 95% | |
| Active users | > 80% expected | 60-80% | < 60% | |

### 6.2 Dashboard URLs

| Dashboard | URL | Access |
|-----------|-----|--------|
| Power Platform Admin Center | admin.powerplatform.microsoft.com | Admin |
| Power Automate Analytics | flow.microsoft.com/manage/resources | Admin |
| Application Insights | [URL] | Admin |
| Custom Monitoring | [URL] | Support team |

### 6.3 Alert Configuration

| Alert | Condition | Channel | Recipients |
|-------|-----------|---------|------------|
| Flow failure spike | > 5 failures in 1 hour | Email + Teams | Support team |
| Capacity warning | > 80% DB capacity | Email | Admin |
| App error rate | > 5% error rate | Email + Teams | Dev team |
| Integration failure | Any API failure | Email | Support team |

---

## 7. Backup and Restore Procedures

### 7.1 Backup Strategy

| Component | Backup Method | Frequency | Retention |
|-----------|--------------|-----------|-----------|
| Dataverse | System backup | Daily (automated) | 28 days |
| Dataverse | Manual backup | Pre-deployment | Until next deployment |
| Solution | Export managed | Per release | All versions |
| Configuration | Documentation | Per change | Current only |

### 7.2 Manual Backup Procedure

| Step | Action | Status | Notes |
|------|--------|--------|-------|
| 1 | Navigate to Power Platform Admin Center | [ ] | |
| 2 | Select environment | [ ] | |
| 3 | Click "Backups" | [ ] | |
| 4 | Click "Create manual backup" | [ ] | |
| 5 | Name the backup: [SystemName-YYYYMMDD-vX.X] | [ ] | |
| 6 | Click "Create" | [ ] | |
| 7 | Verify backup completed | [ ] | |

### 7.3 Restore Procedure

> **WARNING:** Restore will overwrite current data. All changes since backup will be lost.

| Step | Action | Status | Notes |
|------|--------|--------|-------|
| 1 | Notify all stakeholders of restore | [ ] | |
| 2 | Export current state (for analysis) | [ ] | Optional |
| 3 | Navigate to Power Platform Admin Center | [ ] | |
| 4 | Select environment | [ ] | |
| 5 | Click "Backups" | [ ] | |
| 6 | Select backup to restore | [ ] | |
| 7 | Click "Restore" | [ ] | |
| 8 | Confirm restore (type environment name) | [ ] | |
| 9 | Monitor restore progress | [ ] | May take hours |
| 10 | Validate system after restore | [ ] | Smoke test |
| 11 | Notify stakeholders of completion | [ ] | |

---

## 8. Emergency Contacts

### 8.1 Emergency Contact List

| Role | Name | Primary Phone | Secondary Phone | Email | Available 24/7? |
|------|------|--------------|-----------------|-------|----------------|
| Client Emergency Contact | | | | | |
| Delivery Lead | | | | | |
| Technical Lead | | | | | |
| Microsoft Support | | | | | Yes |

### 8.2 Emergency Procedures

**System Down (Critical):**
1. Confirm issue scope (who, what, when)
2. Notify Tier 2 and Tier 3 immediately
3. Check Microsoft service health dashboard
4. Attempt basic recovery steps
5. Engage Microsoft support if platform issue
6. Communicate to users via agreed channel
7. Document all actions taken

**Data Breach:**
1. Isolate affected components
2. Notify security officer immediately
3. Preserve audit logs
4. Follow organization incident response plan
5. Notify affected users per GDPR/policy requirements

**Ransomware / Malicious Activity:**
1. Do NOT power off systems (preserves evidence)
2. Isolate affected environment
3. Contact security team immediately
4. Preserve all logs
5. Follow organization incident response plan

---

## Appendix A: Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial runbook |

## Appendix B: Reference Documents

| Document | Location | Description |
|----------|----------|-------------|
| Solution Documentation | | Technical documentation |
| User Guide | | End user documentation |
| Admin Guide | | Administrator documentation |
| Architecture Diagram | | System architecture |
