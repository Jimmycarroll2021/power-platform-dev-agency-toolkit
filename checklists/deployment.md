# Deployment Checklist

> **Project:** _________________________________
> **Deployment Date:** _________________________________
> **Deployment Window:** _________________________________
> **Target Environment:** _________________________________
> **Solution Version:** _________________________________
> **Deployment Lead:** _________________________________

---

## 1. Pre-Deployment

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 1.1 | Deployment approved by steering committee | [ ] | PM | |
| 1.2 | Change request submitted and approved | [ ] | PM | |
| 1.3 | All QA tests passed | [ ] | QA | |
| 1.4 | UAT sign-off obtained | [ ] | PO | |
| 1.5 | Solution exported and versioned | [ ] | Dev | |
| 1.6 | Managed solution created | [ ] | Dev | |
| 1.7 | Solution backed up to Git (tagged) | [ ] | DevOps | |
| 1.8 | Previous production version backed up | [ ] | Admin | |
| 1.9 | Rollback plan reviewed and ready | [ ] | Architect | |
| 1.10 | Deployment runbook reviewed | [ ] | DevOps | |
| 1.11 | Environment variables documented | [ ] | Dev | |
| 1.12 | Environment variables values confirmed for prod | [ ] | Admin | |
| 1.13 | Connection references mapped to production | [ ] | Admin | |
| 1.14 | Communication plan ready | [ ] | PM | |
| 1.15 | Users notified of maintenance window | [ ] | PM | |
| 1.16 | Support team briefed | [ ] | PM | |
| 1.17 | Target environment healthy | [ ] | Admin | |
| 1.18 | No conflicting unmanaged changes in prod | [ ] | Admin | |
| 1.19 | Downtime impact assessed and accepted | [ ] | PM | |
| 1.20 | Deployment team on standby | [ ] | DevOps | |

---

## 2. Deployment Execution

| # | Step | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 2.1 | Begin deployment window | [ ] | DevOps | Time: |
| 2.2 | Backup current production state | [ ] | Admin | |
| 2.3 | Import managed solution | [ ] | DevOps | |
| 2.4 | Verify import success (no errors/warnings) | [ ] | DevOps | |
| 2.5 | Publish all customizations | [ ] | DevOps | |
| 2.6 | Configure environment variables | [ ] | Admin | |
| 2.7 | Activate connection references | [ ] | Admin | |
| 2.8 | Assign security roles | [ ] | Admin | |
| 2.9 | Activate plugins | [ ] | DevOps | |
| 2.10 | Turn on flows | [ ] | DevOps | |
| 2.11 | Verify all components active | [ ] | DevOps | |
| 2.12 | Execute data migration (if applicable) | [ ] | Dev | |
| 2.13 | Verify data migration | [ ] | QA | |
| 2.14 | Update portal/settings (if applicable) | [ ] | Dev | |

---

## 3. Post-Deployment Testing

| # | Test Case | Status | Notes |
|---|----------|--------|-------|
| 3.1 | App loads without errors | [ ] | |
| 3.2 | Core CRUD operations work | [ ] | |
| 3.3 | Key flows execute successfully | [ ] | |
| 3.4 | Integrations respond correctly | [ ] | |
| 3.5 | Security roles function correctly | [ ] | |
| 3.6 | Reports/dashboards display data | [ ] | |
| 3.7 | Business rules execute correctly | [ ] | |
| 3.8 | Email notifications send correctly | [ ] | |
| 3.9 | No console errors in browser | [ ] | |
| 3.10 | Mobile experience works | [ ] | |

---

## 4. Post-Deployment Tasks

| # | Check Item | Status | Owner | Notes |
|---|-----------|--------|-------|-------|
| 4.1 | Smoke tests passed | [ ] | QA | |
| 4.2 | Monitoring dashboards verified | [ ] | DevOps | |
| 4.3 | Alerts configured and tested | [ ] | DevOps | |
| 4.4 | Deployment communicated to stakeholders | [ ] | PM | |
| 4.5 | Users notified system is live | [ ] | PM | |
| 4.6 | Support team confirms readiness | [ ] | Support | |
| 4.7 | Known issues communicated | [ ] | PM | |
| 4.8 | Documentation updated | [ ] | Tech Writer | |
| 4.9 | Deployment log completed | [ ] | DevOps | |
| 4.10 | First hour monitoring complete | [ ] | DevOps | |
| 4.11 | First 24 hours monitoring scheduled | [ ] | DevOps | |
| 4.12 | Hypercare support activated | [ ] | PM | |
| 4.13 | Rollback window closed (window passed) | [ ] | PM | |

---

## 5. Rollback Procedure (If Needed)

| # | Step | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 5.1 | Decision to rollback made | [ ] | Steering | |
| 5.2 | Stakeholders notified | [ ] | PM | |
| 5.3 | Previous solution version identified | [ ] | DevOps | |
| 5.4 | Previous version imported | [ ] | DevOps | |
| 5.5 | Customizations published | [ ] | DevOps | |
| 5.6 | Components verified | [ ] | QA | |
| 5.7 | Smoke tests passed | [ ] | QA | |
| 5.8 | Users notified of rollback | [ ] | PM | |
| 5.9 | Incident documented | [ ] | PM | |
| 5.10 | Post-mortem scheduled | [ ] | PM | |

---

## 6. Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Deployment Lead | | [ ] Approved | |
| Solution Architect | | [ ] Approved | |
| QA Lead | | [ ] Approved | |
| Product Owner | | [ ] Approved | |
| Power Platform Admin | | [ ] Approved | |

---

## Deployment Timeline

| Milestone | Planned Time | Actual Time | Status |
|-----------|-------------|-------------|--------|
| Window opens | | | |
| Pre-deployment complete | | | |
| Solution imported | | | |
| Configuration complete | | | |
| Smoke tests complete | | | |
| Window closes | | | |
