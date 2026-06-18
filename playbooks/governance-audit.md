# Governance Audit Playbook

> **Complexity Rating:** Medium
> **Last Updated:** 2024
> **Applies To:** Power Platform Governance, Center of Excellence (CoE), DLP, Security, Compliance

---

## 1. Purpose of Governance Audit

Regular governance audits ensure:

| Objective | Outcome |
|-----------|---------|
| Security | No unauthorized access, data protection |
| Compliance | Regulatory requirements met |
| Cost optimization | No wasted licenses or capacity |
| Risk mitigation | Identify and address risks |
| Standardization | Consistent practices across environments |
| Operational excellence | Healthy, well-managed platform |

### Audit Scope

| Area | What to Review | Frequency |
|------|---------------|-----------|
| DLP policies | Connector governance | Quarterly |
| Environments | Strategy, health, cleanup | Monthly |
| Security | Roles, access, audit logs | Quarterly |
| Apps and flows | Inventory, ownership, usage | Monthly |
| Licensing | Utilization, optimization | Monthly |
| Data compliance | PII, retention, residency | Quarterly |
| Maker governance | Onboarding, support | Quarterly |
| CoE | Starter kit health, adoption | Monthly |

---

## 2. DLP (Data Loss Prevention) Audit

### 2.1 DLP Policy Review

| Check | Method | Expected Result |
|-------|--------|----------------|
| All environments have DLP policy | Admin center | No "No Policy" environments |
| Business/Non-Business groups defined | Policy review | Clear classification |
| Blocked connectors list reviewed | Policy review | Appropriate blocks |
| Custom connectors classified | Policy review | All classified |
| Exception process documented | Documentation review | Document exists, followed |
| Policy changes logged | Audit log | All changes tracked |

### 2.2 DLP Best Practices Checklist

- [ ] Separate DLP policies for dev/test/prod
- [ ] HTTP connector restricted in production
- [ ] Social media connectors blocked in production
- [ ] File storage connectors appropriately classified
- [ ] Email connectors restricted to business use
- [ ] No connector is "unclassified"
- [ ] Policy change requires approval
- [ ] Policies reviewed quarterly
- [ ] Policy exceptions are time-bound
- [ ] Exception review scheduled before expiry

### 2.3 DLP Risk Indicators

| Risk | Severity | Detection Method |
|------|----------|-----------------|
| Environment without DLP policy | Critical | Admin center scan |
| HTTP connector in production | High | Policy review |
| Personal connectors used for business | Medium | Connector audit |
| Custom connector not classified | Medium | Policy review |
| Policy exception expired | Medium | Exception register |

---

## 3. Environment Audit

### 3.1 Environment Inventory

Maintain an inventory of all environments:

| Property | Detail |
|----------|--------|
| Environment name | |
| Environment ID | |
| URL | |
| Region | |
| Type | Production / Sandbox / Trial / Developer |
| Purpose | |
| Owner | |
| Security group | |
| Created date | |
| Last activity | |
| Capacity usage | Database / File / Log |
| Solutions installed | Count |
| Managed/Unmanaged ratio | |

### 3.2 Environment Health Checks

| Check | Method | Healthy Threshold |
|-------|--------|------------------|
| Capacity (database) | Admin center | < 70% |
| Capacity (file) | Admin center | < 70% |
| Capacity (log) | Admin center | < 70% |
| API call usage | Admin center | < 80% of allocation |
| Background operations | Admin center | Enabled |
| Audit enabled | Admin center | Yes |
| Backup policy | Admin center | Configured |
| Managed solutions | Environment check | No unmanaged in prod |

### 3.3 Environment Cleanup

| Action | Frequency | Method |
|--------|-----------|--------|
| Identify unused environments | Monthly | CoE dashboard |
| Delete trial environments | Monthly | Admin center |
| Archive old data | Quarterly | Dataflow or export |
| Review capacity growth | Monthly | Admin center trends |
| Clean up orphaned apps/flows | Monthly | CoE toolkit |

---

## 4. Security Audit

### 4.1 User Access Review

| Check | Method | Frequency |
|-------|--------|-----------|
| System Administrator count | Admin center | Quarterly |
| Admin accounts are service accounts | User review | Quarterly |
| No personal accounts have admin | User review | Quarterly |
| Unused admin roles removed | Access review | Quarterly |
| Guest access reviewed | Azure AD | Quarterly |
| MFA enforced for admins | Azure AD | Quarterly |

### 4.2 Security Role Review

| Check | Method | Expected |
|-------|--------|----------|
| All security roles documented | Documentation | Up-to-date |
| Unused roles identified | Admin center | Documented, justified |
| Role assignments reviewed | Security audit | Least privilege |
| Custom roles tested | Testing | Work as intended |
| System Administrator role restricted | Admin center | < 5 users |

### 4.3 Audit Log Review

| What to Review | What to Look For | Action if Found |
|---------------|-----------------|----------------|
| Privileged role changes | Unauthorized admin grants | Investigate, revoke |
| Failed sign-ins | Brute force attempts | Alert, block IP |
| Mass deletions | Data destruction | Investigate, restore |
| Export activities | Data exfiltration | Review, alert |
| Environment creation | Unauthorized environments | Review, delete if needed |

---

## 5. App and Flow Inventory

### 5.1 Asset Inventory

| Asset Type | Count | Active | Unused | Orphaned |
|-----------|-------|--------|--------|----------|
| Canvas apps | | | | |
| Model-driven apps | | | | |
| Cloud flows | | | | |
| Desktop flows | | | | |
| Custom connectors | | | | |
| AI Builder models | | | | |
| Chatbots | | | | |
| Power Pages sites | | | | |

### 5.2 Health Indicators

| Indicator | Healthy | Warning | Critical |
|-----------|---------|---------|----------|
| App launches/week | > 50 | 10-50 | < 10 |
| Flow success rate | > 95% | 90-95% | < 90% |
| Unused apps (90 days) | < 10% | 10-25% | > 25% |
| Orphaned flows | 0 | 1-5 | > 5 |
| Flows with broken connections | 0 | 1-3% | > 3% |

---

## 6. Licensing Audit

### 6.1 License Utilization

| License Type | Purchased | Assigned | Utilization | Need Adjustment? |
|-------------|-----------|----------|-------------|-----------------|
| Power Apps per user | | | | |
| Power Apps per app | | | | |
| Power Automate per user | | | | |
| Power Automate per flow | | | | |
| AI Builder credits | | | | |
| Dataverse capacity (DB) | | | | |
| Dataverse capacity (File) | | | | |

### 6.2 License Optimization Opportunities

| Opportunity | Potential Savings | Effort |
|-------------|------------------|--------|
| Remove unused licenses | | Low |
| Convert per-user to per-app | | Low |
| Consolidate service accounts | | Low |
| Optimize flow licensing | | Medium |
| Right-size capacity | | Medium |

---

## 7. Compliance Audit

### 7.1 Data Compliance

| Check | Method | Compliant? |
|-------|--------|-----------|
| PII identified and catalogued | Data scan | |
| Data classification applied | Policy review | |
| Data retention policy defined | Documentation | |
| Data retention policy enforced | Technical review | |
| Data residency requirements met | Region review | |
| Right to erasure process defined | Documentation | |
| Right to erasure can be executed | Technical test | |
| Cross-border transfer assessed | Legal review | |
| Audit trail complete | Log review | |

### 7.2 Regulatory Compliance

| Regulation | Requirement | Status |
|------------|------------|--------|
| GDPR | Data subject rights | |
| GDPR | Consent management | |
| GDPR | Breach notification | |
| SOX | Audit trail | |
| HIPAA | PHI protection | |
| Industry-specific | [Specific requirements] | |

---

## 8. CoE (Center of Excellence) Review

### 8.1 CoE Starter Kit Health

| Component | Status | Notes |
|----------|--------|-------|
| Core components installed | | Version: |
| Governance components active | | |
| Nurture components active | | |
| Inventory sync running | | Last run: |
| Dashboards accessible | | |
| App catalog maintained | | Apps listed: |

### 8.2 CoE Metrics

| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Total makers | | | |
| New makers this month | | | |
| Apps created this month | | | |
| Flows created this month | | | |
| Adoption rate | | > 60% | |
| Compliance violation count | | 0 | |
| Support tickets | | < 10/month | |

---

## 9. Recommendations Template

### 9.1 Audit Report Structure

```
1. Executive Summary
   - Overall health score
   - Critical findings count
   - Key recommendations

2. Findings by Category
   - DLP: [Score], [Findings]
   - Environments: [Score], [Findings]
   - Security: [Score], [Findings]
   - Apps/Flows: [Score], [Findings]
   - Licensing: [Score], [Findings]
   - Compliance: [Score], [Findings]

3. Critical Findings
   - Finding, Risk, Recommendation, Priority, Owner

4. Recommendations
   - Priority matrix (Impact vs Effort)
   - Quick wins
   - Strategic initiatives

5. Action Plan
   - Item, Owner, Due Date, Status
```

### 9.2 Priority Matrix

| Priority | Effort | Impact | Timeline |
|----------|--------|--------|----------|
| Critical - Fix now | Any | Security/Compliance risk | Immediate |
| High - Quick win | Low | Medium-High impact | This sprint |
| Medium - Planned | Medium | Medium impact | Next quarter |
| Low - Backlog | High | Low impact | Future |

---

## 10. Audit Frequency

| Audit Type | Frequency | Owner | Deliverable |
|-----------|-----------|-------|-------------|
| Full governance audit | Quarterly | Platform Admin | Audit report |
| Security review | Quarterly | Security Lead | Security assessment |
| Licensing review | Monthly | License Admin | Utilization report |
| Environment health | Monthly | Platform Admin | Health dashboard |
| App/flow inventory | Monthly | CoE Team | Inventory report |
| Compliance review | Quarterly | Compliance Officer | Compliance report |
| DLP review | Quarterly | Security Lead | DLP assessment |
| Maker governance | Quarterly | CoE Team | Adoption report |

---

## 11. Tools

| Tool | Purpose | Link |
|------|---------|------|
| CoE Starter Kit | Governance automation | github.com/microsoft/coe-starter-kit |
| Power Platform Admin Center | Tenant administration | admin.powerplatform.microsoft.com |
| Azure AD | Identity management | portal.azure.com |
| Microsoft Purview | Compliance center | compliance.microsoft.com |
| PowerShell modules | Scripting | Power Platform PowerShell |

---

## 12. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Audit findings ignored | High | Escalation path, steering committee |
| Incomplete audit scope | Medium | Use checklist, multiple reviewers |
| False sense of security | High | External audit periodically |
| Audit fatigue | Low | Automate where possible |
| Resource constraints | Medium | Prioritize critical areas |
