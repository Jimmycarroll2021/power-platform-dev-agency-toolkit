# ALM Solution Readiness Checklist

> **Project:** _________________________________
> **Date:** _________________________________
> **Completed by:** _________________________________
> **Solution:** _________________________________
> **Environment:** _________________________________

---

## 1. Solution Structure

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | Solution follows segmentation strategy | [ ] | |
| 1.2 | Solution has clear, descriptive name | [ ] | |
| 1.3 | Publisher prefix defined and consistent | [ ] | Prefix: |
| 1.4 | Solution version follows semantic versioning | [ ] | Version: |
| 1.5 | Solution contains only related components | [ ] | |
| 1.6 | No unrelated components in solution | [ ] | |
| 1.7 | Dependencies on other solutions documented | [ ] | |
| 1.8 | Circular dependencies avoided | [ ] | |
| 1.9 | Solution description populated | [ ] | |
| 1.10 | Solution configuration migrated correctly | [ ] | |

---

## 2. Environment Variables

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | All environment-specific values use environment variables | [ ] | |
| 2.2 | No hardcoded URLs in flows/apps | [ ] | |
| 2.3 | No hardcoded IDs in flows/apps | [ ] | |
| 2.4 | No hardcoded email addresses | [ ] | |
| 2.5 | Environment variables have descriptive names | [ ] | |
| 2.6 | Environment variables have appropriate data types | [ ] | |
| 2.7 | Default values set for development | [ ] | |
| 2.8 | Environment variable values set for all environments | [ ] | |
| 2.9 | Environment variables included in solution | [ ] | |
| 2.10 | Secret values use Azure Key Vault references (if applicable) | [ ] | |
| 2.11 | Environment variable documentation maintained | [ ] | |

---

## 3. Connection References

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | All connections use connection references | [ ] | |
| 3.2 | No direct connections in flows | [ ] | |
| 3.3 | Connection references have descriptive names | [ ] | |
| 3.4 | Connection references included in solution | [ ] | |
| 3.5 | Connection references configured in target environment | [ ] | |
| 3.6 | Service accounts used for production connections | [ ] | |
| 3.7 | Connection ownership assigned (not individual user) | [ ] | |
| 3.8 | All connections active and validated | [ ] | |
| 3.9 | Connection reference mapping documented per environment | [ ] | |
| 3.10 | Fallback connections identified | [ ] | |

---

## 4. Source Control

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | Solution unpacked to source control | [ ] | |
| 4.2 | Git repository initialized | [ ] | |
| 4.3 | Branching strategy defined and followed | [ ] | |
| 4.4 | Main branch protected | [ ] | |
| 4.5 | Pull request process enforced | [ ] | |
| 4.6 | Code review required for merges | [ ] | |
| 4.7 | Commit messages descriptive | [ ] | |
| 4.8 | Solution version tagged in Git | [ ] | |
| 4.9 | .gitignore configured for Power Platform | [ ] | |
| 4.10 | Source control access limited to team | [ ] | |

---

## 5. Pipeline Configuration

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | Build pipeline created | [ ] | |
| 5.2 | Build pipeline tested | [ ] | |
| 5.3 | Deploy pipeline created (Test) | [ ] | |
| 5.4 | Deploy pipeline created (Production) | [ ] | |
| 5.5 | Pipeline approvals configured | [ ] | |
| 5.6 | Service connections configured | [ ] | |
| 5.7 | Pipeline variables defined | [ ] | |
| 5.8 | Pipeline secrets managed securely | [ ] | |
| 5.9 | Deployment gates configured | [ ] | |
| 5.10 | Rollback pipeline/steps defined | [ ] | |
| 5.11 | Pipeline notifications configured | [ ] | |
| 5.12 | Pipeline documentation maintained | [ ] | |

---

## 6. Pre-Deployment Validation

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Solution exported successfully | [ ] | |
| 6.2 | Managed solution created | [ ] | |
| 6.3 | Solution import tested in non-production | [ ] | |
| 6.4 | No import errors or warnings | [ ] | |
| 6.5 | All components active after import | [ ] | |
| 6.6 | Environment variables set correctly | [ ] | |
| 6.7 | Connection references active | [ ] | |
| 6.8 | Plugin registration verified | [ ] | |
| 6.9 | Business rules active | [ ] | |
| 6.10 | Flows turned on and working | [ ] | |
| 6.11 | Apps launch successfully | [ ] | |
| 6.12 | Security roles functional | [ ] | |

---

## 7. Documentation

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 7.1 | Deployment runbook created | [ ] | |
| 7.2 | Rollback procedure documented | [ ] | |
| 7.3 | Environment variable reference documented | [ ] | |
| 7.4 | Connection reference mapping documented | [ ] | |
| 7.5 | Dependency matrix maintained | [ ] | |
| 7.6 | Release notes prepared | [ ] | |
| 7.7 | Known issues documented | [ ] | |
| 7.8 | ALM process guide maintained | [ ] | |

---

## 8. Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| DevOps Lead | | [ ] Approved | |
| Solution Architect | | [ ] Approved | |
| Power Platform Admin | | [ ] Approved | |
