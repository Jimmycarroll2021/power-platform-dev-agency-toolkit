# Governance Checklist Template

> **Organization:** _________________________________
> **Assessment Date:** _________________________________
> **Assessor:** _________________________________
> **Scope:** [ Tenant-wide / Environment-specific / Solution-specific ]
> **Overall Compliance:** [ Compliant / Partially Compliant / Non-Compliant ]

---

## Assessment Summary

| Domain | Status | Score | Priority Actions |
|--------|--------|-------|-----------------|
| DLP Policy Compliance | | /100 | |
| Environment Strategy | | /100 | |
| Solution Management | | /100 | |
| Security Roles | | /100 | |
| Data Compliance | | /100 | |
| Maker Governance | | /100 | |
| CoE Requirements | | /100 | |
| Audit Trail | | /100 | |
| **OVERALL** | | **/100** | |

---

## 1. DLP Policy Compliance

### 1.1 DLP Policy Configuration

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | DLP policies defined for all environments | [ ] | |
| 1.2 | Business/non-business connector groups defined | [ ] | |
| 1.3 | Blocked connectors list reviewed and approved | [ ] | |
| 1.4 | No "No Policy" environments exist | [ ] | All envs have DLP |
| 1.5 | DLP policies aligned with security requirements | [ ] | |
| 1.6 | Custom connectors classified correctly | [ ] | |
| 1.7 | DLP policy changes require approval | [ ] | Change control |
| 1.8 | DLP policies documented and communicated | [ ] | |

### 1.2 DLP Policy Best Practices

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 1.9 | HTTP connector restricted or monitored | [ ] | High risk |
| 1.10 | Social media connectors blocked in production | [ ] | |
| 1.11 | File storage connectors classified correctly | [ ] | |
| 1.12 | Email connectors restricted in scope | [ ] | |
| 1.13 | DLP exception process documented | [ ] | |
| 1.14 | Regular DLP audits scheduled | [ ] | Quarterly |

### 1.3 DLP Anti-Patterns

> **DO NOT:**
> - Create a single DLP policy for all environments
> - Allow HTTP connector in production without restrictions
> - Leave environments without any DLP policy
> - Allow makers to create custom connectors without approval
> - Classify all connectors as "Business" to avoid restrictions

---

## 2. Environment Strategy

### 2.1 Environment Inventory

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | Complete environment inventory maintained | [ ] | |
| 2.2 | Naming convention enforced | [ ] | |
| 2.3 | Environment purpose documented | [ ] | |
| 2.4 | Dev/Test/Prod separation exists | [ ] | |
| 2.5 | Production environments marked | [ ] | |
| 2.6 | Unused environments identified for cleanup | [ ] | |
| 2.7 | Environment creation requires approval | [ ] | |
| 2.8 | Default environment governed | [ ] | |

### 2.2 Environment Configuration

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.9 | Security groups assigned to environments | [ ] | |
| 2.10 | Environment makers controlled | [ ] | |
| 2.11 | Background operations enabled (prod) | [ ] | |
| 2.12 | Audit enabled on all environments | [ ] | |
| 2.13 | Capacity alerts configured | [ ] | |
| 2.14 | Environment backup policy defined | [ ] | |
| 2.15 | Copy/reset environment process documented | [ ] | |

### 2.3 Environment Naming Convention

| Environment Type | Naming Pattern | Example |
|-----------------|---------------|---------|
| Development | [Org]-[Project]-Dev | Contoso-HR-Dev |
| Test / UAT | [Org]-[Project]-Test | Contoso-HR-Test |
| Production | [Org]-[Project]-Prod | Contoso-HR-Prod |
| Sandbox | [Org]-[Project]-Sandbox | Contoso-HR-Sandbox |

---

## 3. Solution Management

### 3.1 Solution Strategy

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | Solution segmentation strategy defined | [ ] | |
| 3.2 | Managed solutions in production | [ ] | |
| 3.3 | Publisher prefix defined and used | [ ] | |
| 3.4 | Solution versioning follows standard | [ ] | Semantic versioning |
| 3.5 | Solution dependencies documented | [ ] | |
| 3.6 | Patch management process defined | [ ] | |
| 3.7 | Upgrade strategy documented | [ ] | |

### 3.2 Solution Health

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.8 | No unmanaged customizations in production | [ ] | |
| 3.9 | Solution layering understood and managed | [ ] | |
| 3.10 | No solution dependency conflicts | [ ] | |
| 3.11 | Solution import history reviewed | [ ] | |
| 3.12 | Failed solution imports resolved | [ ] | |

### 3.3 ALM Compliance

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.13 | Source control used for solutions | [ ] | |
| 3.14 | Deployment pipelines configured | [ ] | |
| 3.15 | Environment variables used (not hardcoded) | [ ] | |
| 3.16 | Connection references used | [ ] | |
| 3.17 | Deployment approvals required for production | [ ] | |

> **DO NOT:** Allow direct unmanaged changes in production environments. All changes should go through ALM pipeline.

---

## 4. Security Roles

### 4.1 Role Management

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | Security roles follow least privilege principle | [ ] | |
| 4.2 | Custom roles documented with purpose | [ ] | |
| 4.3 | No unused security roles exist | [ ] | |
| 4.4 | System Administrator role restricted | [ ] | |
| 4.5 | Security role assignments reviewed quarterly | [ ] | |
| 4.6 | Service accounts have dedicated roles | [ ] | |
| 4.7 | Privileged access logged and monitored | [ ] | |

### 4.2 Field Security

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.8 | Sensitive fields identified | [ ] | |
| 4.9 | Field security profiles configured | [ ] | |
| 4.10 | PII fields protected | [ ] | |
| 4.11 | Financial data fields restricted | [ ] | |

---

## 5. Data Compliance

### 5.1 Data Governance

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | Data classification policy applied | [ ] | |
| 5.2 | PII data identified and catalogued | [ ] | |
| 5.3 | Data retention policy defined | [ ] | |
| 5.4 | Data archival process implemented | [ ] | |
| 5.5 | Data deletion process defined (GDPR) | [ ] | |
| 5.6 | Data residency requirements met | [ ] | |
| 5.7 | Cross-border data transfer assessed | [ ] | |

### 5.2 Data Protection

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.8 | Encryption at rest enabled | [ ] | Default in Dataverse |
| 5.9 | Encryption in transit enforced (TLS 1.2+) | [ ] | |
| 5.10 | Backup and recovery tested | [ ] | |
| 5.11 | Data loss prevention for sensitive data | [ ] | |

---

## 6. Maker Governance

### 6.1 Maker Management

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Maker onboarding process defined | [ ] | |
| 6.2 | Maker training required before access | [ ] | |
| 6.3 | Maker activity monitored | [ ] | |
| 6.4 | Inactive makers identified | [ ] | |
| 6.5 | Orphaned apps/flows identified | [ ] | |
| 6.6 | Maker support channels defined | [ ] | |

### 6.2 App and Flow Governance

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.7 | App sharing follows principle of least privilege | [ ] | |
| 6.8 | Flow ownership not tied to individual users | [ ] | Use service accounts |
| 6.9 | Flows with premium connectors audited | [ ] | |
| 6.10 | Apps with sensitive connections reviewed | [ ] | |
| 6.11 | Deprecated apps/flows identified and removed | [ ] | |
| 6.12 | App and flow naming conventions enforced | [ ] | |

---

## 7. CoE Requirements

### 7.1 Center of Excellence

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 7.1 | CoE Starter Kit installed | [ ] | |
| 7.2 | CoE dashboards configured | [ ] | |
| 7.3 | App catalog maintained | [ ] | |
| 7.4 | Nurture program established | [ ] | |
| 7.5 | Governance components active | [ ] | |
| 7.6 | Compliance processes automated | [ ] | |
| 7.7 | Environment management automated | [ ] | |

### 7.2 CoE Monitoring

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 7.8 | App usage metrics tracked | [ ] | |
| 7.9 | Flow success rates monitored | [ ] | |
| 7.10 | License utilization tracked | [ ] | |
| 7.11 | Capacity usage monitored | [ ] | |
| 7.12 | Compliance violations flagged | [ ] | |
| 7.13 | Regular governance reports generated | [ ] | |

---

## 8. Audit Trail

### 8.1 Audit Configuration

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 8.1 | Audit enabled on all tables with business data | [ ] | |
| 8.2 | User access audit enabled | [ ] | |
| 8.3 | SDK operations audited | [ ] | |
| 8.4 | Audit log retention configured | [ ] | |
| 8.5 | Audit logs accessible for review | [ ] | |

### 8.2 Audit Review

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 8.6 | Regular audit log reviews scheduled | [ ] | Monthly |
| 8.7 | Privileged access audited | [ ] | |
| 8.8 | Failed authentication attempts reviewed | [ ] | |
| 8.9 | Data export activities monitored | [ ] | |
| 8.10 | Audit findings have remediation plans | [ ] | |

---

## Remediation Plan

| Priority | Finding | Action | Owner | Due Date | Status |
|----------|---------|--------|-------|----------|--------|
| Critical | | | | | |
| High | | | | | |
| Medium | | | | | |
| Low | | | | | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Assessor | | | |
| Power Platform Admin | | | |
| Security Officer | | | |
| Compliance Officer | | | |

---

## Appendix A: Assessment Methodology

| Score | Rating | Description |
|-------|--------|-------------|
| 90-100 | Compliant | Meets or exceeds all requirements |
| 70-89 | Partially Compliant | Meets most requirements, minor gaps |
| 50-69 | At Risk | Several gaps requiring attention |
| 0-49 | Non-Compliant | Significant gaps, immediate action required |

## Appendix B: Reference Standards

| Standard | Link | Description |
|----------|------|-------------|
| Microsoft Power Platform Governance | docs.microsoft.com | Official documentation |
| CoE Starter Kit | github.com/microsoft/coe-starter-kit | Governance toolkit |
| Microsoft Security Baselines | docs.microsoft.com | Security recommendations |
