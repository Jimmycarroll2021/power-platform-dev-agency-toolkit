# Deployment Checklist Template

> **Project:** _________________________________
> **Deployment Date:** _________________________________
> **Deployment Window:** _________________________________
> **Target Environment:** [ Dev / Test / UAT / Production ]
> **Deployment Lead:** _________________________________
> **Rollback Window:** _________________________________
> **Overall Status:** [ Ready / In Progress / Complete / Rolled Back ]

---

## Deployment Summary

| Item | Detail |
|------|--------|
| Solution Version | |
| Source Environment | |
| Target Environment | |
| Deployment Type | [ Full / Patch / Update ] |
| Downtime Required | [ Yes / No ] |
| Estimated Duration | |
| Business Impact | [ None / Low / Medium / High ] |
| Communication Sent | [ Yes / No ] |

---

## 1. Pre-Deployment Validation

### 1.1 Solution Preparation

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 1.1.1 | Solution exported from source environment | [ ] | | |
| 1.1.2 | Solution version incremented correctly | [ ] | | Follow semantic versioning |
| 1.1.3 | All components included in solution | [ ] | | Verify component list |
| 1.1.4 | No unmanaged changes in target environment | [ ] | | Check for unmanaged layers |
| 1.1.5 | Previous version backup available | [ ] | | Export backup of current solution |
| 1.1.6 | Solution file validated (not corrupted) | [ ] | | Verify file size and integrity |

### 1.2 Code/Configuration Review

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 1.2.1 | All code reviewed and approved | [ ] | | Code review sign-off |
| 1.2.2 | No hardcoded values (use environment variables) | [ ] | | Check for URLs, IDs, secrets |
| 1.2.3 | All TODO/FIXME items resolved | [ ] | | Search codebase |
| 1.2.4 | No test data in solution | [ ] | | Remove test records |
| 1.2.5 | Business rules validated | [ ] | | Test in source env |
| 1.2.6 | Flows have error handling | [ ] | | Try-catch scopes |
| 1.2.7 | No disabled flows included (unless intentional) | [ ] | | Review flow status |

### 1.3 Documentation Review

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 1.3.1 | Deployment runbook updated | [ ] | | This document |
| 1.3.2 | Release notes prepared | [ ] | | List of changes |
| 1.3.3 | Known issues documented | [ ] | | With workarounds |
| 1.3.4 | Rollback procedure documented | [ ] | | Section 9 |
| 1.3.5 | Support team briefed | [ ] | | Pre-deployment meeting |

### 1.4 Environment Validation

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 1.4.1 | Target environment is healthy | [ ] | | Check admin center |
| 1.4.2 | Sufficient capacity available | [ ] | | DB, file, log storage |
| 1.4.3 | No scheduled maintenance during deployment | [ ] | | Check Microsoft health |
| 1.4.4 | DLP policies configured correctly | [ ] | | Verify connector access |
| 1.4.5 | No pending solution imports in queue | [ ] | | Check solution history |

### 1.5 Dependency Check

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 1.5.1 | All dependent solutions already deployed | [ ] | | Check dependency order |
| 1.5.2 | API endpoints accessible from target environment | [ ] | | Network test |
| 1.5.3 | Third-party systems available | [ ] | | Confirm with vendors |
| 1.5.4 | External integrations tested end-to-end | [ ] | | Integration test results |

> **DO NOT:** Skip pre-deployment validation. A failed deployment in production is significantly more costly than a 30-minute validation check.

---

## 2. Solution Import Steps

### 2.1 Import Preparation

| # | Step | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 2.1.1 | Log into Power Platform Admin Center | [ ] | | https://admin.powerplatform.microsoft.com |
| 2.1.2 | Navigate to target environment | [ ] | | Verify correct environment |
| 2.1.3 | Navigate to Solutions | [ ] | | |
| 2.1.4 | Verify no conflicting unmanaged customizations | [ ] | | Check for active layers |

### 2.2 Solution Import

| # | Step | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 2.2.1 | Click "Import solution" | [ ] | | |
| 2.2.2 | Upload solution file (.zip) | [ ] | | Verify file name matches version |
| 2.2.3 | Review solution components | [ ] | | Verify expected components listed |
| 2.2.4 | Choose import options | [ ] | | Activate plugins: Yes, Publish workflows: Yes |
| 2.2.5 | Start import | [ ] | | Record start time |
| 2.2.6 | Monitor import progress | [ ] | | Do not navigate away |
| 2.2.7 | Verify import success | [ ] | | Check for green checkmark |
| 2.2.8 | Review import log for warnings | [ ] | | Document any warnings |
| 2.2.9 | Publish all customizations | [ ] | | After successful import |

### 2.3 Post-Import Verification

| # | Step | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 2.3.1 | Solution appears in solution list | [ ] | | Correct version number |
| 2.3.2 | All components status = "Active" | [ ] | | Check for any disabled components |
| 2.3.3 | No import errors in log | [ ] | | Review detailed log |
| 2.3.4 | Layering check passed | [ ] | | No unexpected unmanaged layers |

---

## 3. Environment Variable Configuration

| # | Environment Variable | Source Value | Target Value | Status | Notes |
|---|---------------------|-------------|-------------|--------|-------|
| 3.1 | API Base URL | | | [ ] | |
| 3.2 | API Key/Secret | | | [ ] | Update in Azure Key Vault |
| 3.3 | Environment Name | | | [ ] | |
| 3.4 | Notification Email | | | [ ] | |
| 3.5 | SharePoint Site URL | | | [ ] | |
| 3.6 | Teams Channel ID | | | [ ] | |
| 3.7 | Time Zone | | | [ ] | |
| 3.8 | Currency Code | | | [ ] | |
| 3.9 | Feature Flags | | | [ ] | Enable/disable features |
| 3.10 | Timeout Values | | | [ ] | API call timeouts |

> **WARNING:** Never commit secrets to source control. Always use environment variables or Azure Key Vault references for sensitive configuration.

---

## 4. Connection Reference Setup

| # | Connection Reference | Connection Type | Status | Notes |
|---|---------------------|----------------|--------|-------|
| 4.1 | Dataverse | Built-in | [ ] | Auto-created |
| 4.2 | Office 365 Outlook | Standard | [ ] | Verify mailbox access |
| 4.3 | Office 365 Users | Standard | [ ] | |
| 4.4 | SharePoint | Standard | [ ] | Verify site access |
| 4.5 | Teams | Standard | [ ] | Verify team membership |
| 4.6 | [Custom Connector] | Custom | [ ] | Verify API accessibility |
| 4.7 | [HTTP Connector] | Premium | [ ] | Verify endpoint access |
| 4.8 | [Azure Blob] | Premium | [ ] | Verify storage account |
| 4.9 | [SQL Server] | Premium | [ ] | Verify DB connectivity |

> **DO NOT:** Use personal accounts for connection references in production. Use service accounts with appropriate permissions.

---

## 5. Security Role Assignment

### 5.1 Security Role Verification

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 5.1.1 | All security roles imported correctly | [ ] | | Compare with source |
| 5.1.2 | Role permissions match design | [ ] | | Verify CRUD permissions |
| 5.1.3 | No unintended privilege escalation | [ ] | | Review changes carefully |
| 5.1.4 | Custom security roles functional | [ ] | | Test each role |

### 5.2 Role Assignment

| # | Role | Users/Teams Assigned | Status | Notes |
|---|------|---------------------|--------|-------|
| 5.2.1 | System Administrator | | [ ] | Minimize - only admins |
| 5.2.2 | [Custom: App User] | | [ ] | |
| 5.2.3 | [Custom: App Manager] | | [ ] | |
| 5.2.4 | [Custom: Read Only] | | [ ] | |
| 5.2.5 | [Custom: Integration] | | [ ] | Service account |

### 5.3 Field Security Profile

| # | Field | Security Profile | Status | Notes |
|---|-------|-----------------|--------|-------|
| 5.3.1 | [Sensitive Field 1] | | [ ] | |
| 5.3.2 | [Sensitive Field 2] | | [ ] | |

---

## 6. Data Migration

| # | Step | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 6.1 | Migration scripts prepared | [ ] | | Tested in non-prod |
| 6.2 | Reference data migrated | [ ] | | Lookup values, configs |
| 6.3 | Master data migrated | [ ] | | Customers, products |
| 6.4 | Transaction data migrated | [ ] | | If applicable |
| 6.5 | Data validation complete | [ ] | | Record counts match |
| 6.6 | Data integrity verified | [ ] | | Relationships intact |

> **DO NOT:** Migrate production data without a rollback plan. Always test migration scripts in a non-production environment first.

---

## 7. Smoke Testing

### 7.1 Application Smoke Tests

| # | Test Case | Expected Result | Status | Notes |
|---|----------|----------------|--------|-------|
| 7.1.1 | App loads without errors | Home screen visible | [ ] | |
| 7.1.2 | User can log in | Authentication successful | [ ] | |
| 7.1.3 | Navigation works | All screens accessible | [ ] | |
| 7.1.4 | Create record | Record created successfully | [ ] | |
| 7.1.5 | View record | Data displayed correctly | [ ] | |
| 7.1.6 | Edit record | Changes saved successfully | [ ] | |
| 7.1.7 | Search/filter works | Results returned correctly | [ ] | |

### 7.2 Automation Smoke Tests

| # | Test Case | Expected Result | Status | Notes |
|---|----------|----------------|--------|-------|
| 7.2.1 | Trigger flow executes | Flow runs on trigger | [ ] | |
| 7.2.2 | Scheduled flow runs | Flow executes on schedule | [ ] | |
| 7.2.3 | Flow sends notifications | Email/Teams sent | [ ] | |
| 7.2.4 | Integration flow works | Data exchanged correctly | [ ] | |
| 7.2.5 | Error handling works | Errors caught and logged | [ ] | |

### 7.3 Integration Smoke Tests

| # | Test Case | Expected Result | Status | Notes |
|---|----------|----------------|--------|-------|
| 7.3.1 | External API reachable | HTTP 200 response | [ ] | |
| 7.3.2 | Data sync works | Data transferred correctly | [ ] | |
| 7.3.3 | Authentication valid | No auth errors | [ ] | |
| 7.3.4 | Webhooks received | Events processed | [ ] | |

### 7.4 Reporting Smoke Tests

| # | Test Case | Expected Result | Status | Notes |
|---|----------|----------------|--------|-------|
| 7.4.1 | Dashboards load | Charts render correctly | [ ] | |
| 7.4.2 | Reports have data | Current data displayed | [ ] | |
| 7.4.3 | Filters work | Filtered results correct | [ ] | |
| 7.4.4 | Export works | PDF/Excel export functional | [ ] | |

---

## 8. Post-Deployment Validation

### 8.1 Solution Health

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 8.1.1 | Solution version correct in target | [ ] | | Matches deployment version |
| 8.1.2 | All components active | [ ] | | No disabled components |
| 8.1.3 | No solution import warnings | [ ] | | Clean import log |
| 8.1.4 | Solution layering correct | [ ] | | Managed layer on top |

### 8.2 Monitoring Setup

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 8.2.1 | Flow failure alerts configured | [ ] | | Notify on failure |
| 8.2.2 | App monitoring active | [ ] | | Application Insights |
| 8.2.3 | Capacity monitoring set up | [ ] | | DB, file storage |
| 8.2.4 | Error logging table accessible | [ ] | | Custom error log |

### 8.3 Communication

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 8.3.1 | Deployment complete notification sent | [ ] | | To stakeholders |
| 8.3.2 | Known issues communicated | [ ] | | With workarounds |
| 8.3.3 | Support team notified | [ ] | | With context |
| 8.3.4 | Users informed of new features | [ ] | | Release notes shared |

### 8.4 Documentation

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 8.4.1 | Deployment log completed | [ ] | | This checklist |
| 8.4.2 | Issues encountered documented | [ ] | | With resolutions |
| 8.4.3 | Configuration changes recorded | [ ] | | For audit |
| 8.4.4 | Handover to support complete | [ ] | | Support briefing |

---

## 9. Rollback Procedure

> **Use only if smoke testing fails or critical issues found.**

### 9.1 Rollback Trigger Criteria

Rollback MUST be initiated if:
- [ ] Critical functionality broken and no workaround
- [ ] Data integrity compromised
- [ ] Security vulnerability introduced
- [ ] Performance severely degraded (> 50%)
- [ ] Business operations impacted

### 9.2 Rollback Steps

| # | Step | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 9.2.1 | Notify stakeholders of rollback | [ ] | | Communication |
| 9.2.2 | Stop all flows | [ ] | | Turn off flows |
| 9.2.3 | Export current state (for analysis) | [ ] | | Before rollback |
| 9.2.4 | Delete deployed solution version | [ ] | | From target env |
| 9.2.5 | Import previous version backup | [ ] | | From backup |
| 9.2.6 | Restore environment variables | [ ] | | Previous values |
| 9.2.7 | Restore connection references | [ ] | | Previous connections |
| 9.2.8 | Verify previous version functional | [ ] | | Smoke test |
| 9.2.9 | Notify stakeholders of completion | [ ] | | Rollback complete |
| 9.2.10 | Schedule post-mortem | [ ] | | Within 24 hours |

### 9.3 Rollback Verification

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 9.3.1 | Previous version fully functional | [ ] | |
| 9.3.2 | No data loss from rollback | [ ] | |
| 9.3.3 | Users can access system | [ ] | |
| 9.3.4 | Integrations working | [ ] | |

---

## 10. Deployment Sign-Off

| Role | Name | Approval | Date | Notes |
|------|------|----------|------|-------|
| Deployment Lead | | [ ] Approved | | |
| Solution Architect | | [ ] Approved | | |
| QA Lead | | [ ] Approved | | Smoke tests |
| Product Owner | | [ ] Approved | | Business validation |
| Client IT | | [ ] Approved | | Environment validation |

---

## Deployment Timeline Log

| Time | Activity | Status | Owner |
|------|----------|--------|-------|
| [Start] | Deployment window opened | | |
| | Pre-deployment validation started | | |
| | Solution import started | | |
| | Solution import completed | | |
| | Environment variables configured | | |
| | Connection references set up | | |
| | Security roles assigned | | |
| | Data migration completed | | |
| | Smoke testing started | | |
| | Smoke testing completed | | |
| | Post-deployment validation | | |
| | Deployment sign-off | | |
| [End] | Deployment window closed | | |

---

## Appendix A: Environment Details

| Item | Source Environment | Target Environment |
|------|-------------------|-------------------|
| Environment URL | | |
| Environment ID | | |
| Region | | |
| Version | | |

## Appendix B: Solution Details

| Item | Detail |
|------|--------|
| Solution Name | |
| Version | |
| Publisher | |
| Components Count | |
| Export Date | |
| File Size | |
