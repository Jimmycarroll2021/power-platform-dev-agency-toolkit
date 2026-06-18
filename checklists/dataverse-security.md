# Dataverse Security Checklist

> **Project:** _________________________________
> **Date:** _________________________________
> **Completed by:** _________________________________
> **Environment:** _________________________________

---

## 1. Security Roles

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | Security roles designed for all user personas | [ ] | |
| 1.2 | Security role naming convention defined | [ ] | |
| 1.3 | Each role follows least privilege principle | [ ] | |
| 1.4 | Role permissions documented (CRUD matrix) | [ ] | |
| 1.5 | Custom security roles created (not just OOB) | [ ] | |
| 1.6 | Roles tested with actual users | [ ] | |
| 1.7 | No role has excessive permissions | [ ] | |
| 1.8 | System Administrator role count minimized | [ ] | Count: |
| 1.9 | Service account roles separate from user roles | [ ] | |
| 1.10 | Role assignments reviewed and approved | [ ] | |
| 1.11 | Unused security roles identified for cleanup | [ ] | |
| 1.12 | Security role changes follow change control | [ ] | |

---

## 2. Teams

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | Team structure defined (owner, access, AAD) | [ ] | |
| 2.2 | Teams created for functional groups | [ ] | |
| 2.3 | Team membership maintained | [ ] | |
| 2.4 | Record ownership by team where appropriate | [ ] | |
| 2.5 | Team security roles assigned | [ ] | |
| 2.6 | Access teams configured for dynamic sharing | [ ] | |
| 2.7 | Team naming convention defined | [ ] | |
| 2.8 | Azure AD group team integration (if used) | [ ] | |
| 2.9 | Team responsibilities documented | [ ] | |

---

## 3. Business Units

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | Business unit hierarchy designed | [ ] | |
| 3.2 | Business unit naming convention defined | [ ] | |
| 3.3 | Parent-child BU structure appropriate | [ ] | |
| 3.4 | Users assigned to correct business units | [ ] | |
| 3.5 | Teams assigned to correct business units | [ ] | |
| 3.6 | Security roles scoped to appropriate BU level | [ ] | |
| 3.7 | BU isolation tested | [ ] | |
| 3.8 | BU structure documented | [ ] | |
| 3.9 | BU change process defined | [ ] | |
| 3.10 | Hierarchy security enabled (if needed) | [ ] | |

---

## 4. Field Security

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | Sensitive fields identified | [ ] | |
| 4.2 | PII fields catalogued | [ ] | |
| 4.3 | Financial data fields identified | [ ] | |
| 4.4 | Field security profiles created | [ ] | |
| 4.5 | Field security profiles tested | [ ] | |
| 4.6 | Field-level security documented | [ ] | |
| 4.7 | Field security aligns with data classification | [ ] | |
| 4.8 | Users without field access cannot see data (including exports) | [ ] | |
| 4.9 | Field security review scheduled | [ ] | |

---

## 5. Record-Level Security

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | Ownership model defined (user vs. team) | [ ] | |
| 5.2 | Sharing rules defined | [ ] | |
| 5.3 | Cascading sharing behavior configured | [ ] | |
| 5.4 | Reparent behavior defined | [ ] | |
| 5.5 | Direct sharing minimized | [ ] | |
| 5.6 | Access teams used for dynamic sharing | [ ] | |
| 5.7 | Sharing privileges restricted where possible | [ ] | |
| 5.8 | Shared record audit enabled | [ ] | |

---

## 6. Auditing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Audit enabled at environment level | [ ] | |
| 6.2 | Audit enabled for all business tables | [ ] | |
| 6.3 | User access auditing enabled | [ ] | |
| 6.4 | SDK message auditing enabled (if needed) | [ ] | |
| 6.5 | Audit retention period configured | [ ] | |
| 6.6 | Audit log access restricted to authorized users | [ ] | |
| 6.7 | Audit log review process defined | [ ] | |
| 6.8 | Audit log storage monitored | [ ] | |
| 6.9 | Sensitive actions audited | [ ] | |
| 6.10 | Audit report accessible to compliance team | [ ] | |

---

## 7. Privacy and Compliance

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 7.1 | Data classification applied | [ ] | |
| 7.2 | PII handling complies with GDPR/regulations | [ ] | |
| 7.3 | Data retention policy configured | [ ] | |
| 7.4 | Data export restricted to authorized users | [ ] | |
| 7.5 | Bulk delete operations require approval | [ ] | |
| 7.6 | Guest access restricted appropriately | [ ] | |
| 7.7 | Data masking for non-production environments | [ ] | |
| 7.8 | Consent management (if applicable) | [ ] | |

---

## 8. Testing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 8.1 | Each role tested with test user | [ ] | |
| 8.2 | Users can only see authorized records | [ ] | |
| 8.3 | Users can only edit authorized records | [ ] | |
| 8.4 | Users cannot delete unauthorized records | [ ] | |
| 8.5 | Field security working as designed | [ ] | |
| 8.6 | Business unit isolation working | [ ] | |
| 8.7 | Hierarchy security working (if enabled) | [ ] | |
| 8.8 | Audit log captures all key actions | [ ] | |
| 8.9 | Security works in model-driven apps | [ ] | |
| 8.10 | Security works in canvas apps | [ ] | |
| 8.11 | Security works in Power Automate flows | [ ] | |
| 8.12 | Security works in Power Pages | [ ] | |

---

## 9. Documentation

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 9.1 | Security model diagram created | [ ] | |
| 9.2 | Security roles documented with permissions | [ ] | |
| 9.3 | Business unit structure documented | [ ] | |
| 9.4 | Field security profiles documented | [ ] | |
| 9.5 | Security testing results documented | [ ] | |
| 9.6 | Security runbook created | [ ] | |
| 9.7 | Security review process defined | [ ] | |
| 9.8 | Incident response plan for security breaches | [ ] | |

---

## 10. Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Solution Architect | | [ ] Approved | |
| Security Lead | | [ ] Approved | |
| Power Platform Admin | | [ ] Approved | |
| Compliance Officer | | [ ] Approved | |
