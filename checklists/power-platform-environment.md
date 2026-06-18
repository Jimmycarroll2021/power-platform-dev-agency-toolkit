# Power Platform Environment Checklist

> **Project:** _________________________________
> **Date:** _________________________________
> **Completed by:** _________________________________
> **Environment:** [ Dev / Test / UAT / Production ]

---

## 1. Environment Creation

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | Environment request submitted and approved | [ ] | |
| 1.2 | Environment provisioned | [ ] | |
| 1.3 | Environment URL recorded | [ ] | |
| 1.4 | Environment ID recorded | [ ] | |
| 1.5 | Region/location correct | [ ] | |
| 1.6 | Environment type set correctly (Production/Sandbox) | [ ] | |
| 1.7 | Environment name follows naming convention | [ ] | |
| 1.8 | Database created | [ ] | |
| 1.9 | Environment accessible | [ ] | |
| 1.10 | Environment added to inventory/register | [ ] | |

---

## 2. DLP Policy

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | DLP policy applied to environment | [ ] | |
| 2.2 | Business connector group configured | [ ] | |
| 2.3 | Non-business connector group configured | [ ] | |
| 2.4 | Blocked connectors list reviewed | [ ] | |
| 2.5 | Required connectors are in Business group | [ ] | |
| 2.6 | No required connectors are blocked | [ ] | |
| 2.7 | Custom connectors classified | [ ] | |
| 2.8 | DLP policy tested with sample flow | [ ] | |
| 2.9 | DLP exception process documented (if needed) | [ ] | |
| 2.10 | Policy change approval process defined | [ ] | |

---

## 3. Capacity

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | Database capacity allocated | [ ] | GB: |
| 3.2 | File capacity allocated | [ ] | GB: |
| 3.3 | Log capacity allocated | [ ] | GB: |
| 3.4 | Current database usage checked | [ ] | |
| 3.5 | Current file usage checked | [ ] | |
| 3.6 | Current log usage checked | [ ] | |
| 3.7 | Capacity alerts configured | [ ] | |
| 3.8 | Capacity monitoring dashboard accessible | [ ] | |
| 3.9 | Additional capacity purchased (if needed) | [ ] | |
| 3.10 | Capacity growth projection documented | [ ] | |

---

## 4. Security

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | Security group assigned to environment | [ ] | |
| 4.2 | Environment admins assigned | [ ] | |
| 4.3 | Maker permissions configured | [ ] | |
| 4.4 | Guest access configured (if needed) | [ ] | |
| 4.5 | Admin access follows least privilege | [ ] | |
| 4.6 | Admin count minimal (< 5) | [ ] | |
| 4.7 | Background operations enabled | [ ] | |
| 4.8 | Audit enabled | [ ] | |
| 4.9 | Audit retention configured | [ ] | |
| 4.10 | IP restrictions configured (if required) | [ ] | |
| 4.11 | Session timeout configured | [ ] | |
| 4.12 | Copilot/AI features configured per policy | [ ] | |

---

## 5. Naming Convention

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | Environment naming convention documented | [ ] | |
| 5.2 | Environment name follows convention | [ ] | |
| 5.3 | Solution naming convention documented | [ ] | |
| 5.4 | Publisher prefix defined | [ ] | Prefix: |
| 5.5 | Table naming convention defined | [ ] | |
| 5.6 | Column naming convention defined | [ ] | |
| 5.7 | Flow naming convention defined | [ ] | |
| 5.8 | App naming convention defined | [ ] | |
| 5.9 | Security role naming convention defined | [ ] | |
| 5.10 | Naming conventions communicated to team | [ ] | |

---

## 6. Configuration

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Currency configured | [ ] | |
| 6.2 | Time zone configured | [ ] | |
| 6.3 | Language configured | [ ] | |
| 6.4 | Date format configured | [ ] | |
| 6.5 | Email server profile configured (if needed) | [ ] | |
| 6.6 | SharePoint integration configured (if needed) | [ ] | |
| 6.7 | Exchange sync configured (if needed) | [ ] | |
| 6.8 | Duplicate detection rules configured | [ ] | |
| 6.9 | Auto-numbering formats configured | [ ] | |
| 6.10 | Plugin trace log setting appropriate for environment | [ ] | |

---

## 7. Documentation

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 7.1 | Environment details documented | [ ] | |
| 7.2 | Environment owner documented | [ ] | |
| 7.3 | Access request process documented | [ ] | |
| 7.4 | Backup/restore process documented | [ ] | |
| 7.5 | Copy/reset process documented | [ ] | |
| 7.6 | Environment URL shared with team | [ ] | |
| 7.7 | Environment inventory updated | [ ] | |

---

## 8. Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Power Platform Admin | | [ ] Approved | |
| Solution Architect | | [ ] Approved | |
| Security Lead | | [ ] Approved | |
