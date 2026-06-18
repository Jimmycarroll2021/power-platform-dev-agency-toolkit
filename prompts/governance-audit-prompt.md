# Governance Audit Prompt

## Purpose
Use this prompt to conduct comprehensive governance audits of Power Platform environments. Copy and paste into your AI coding agent to produce audit findings, compliance reports, and remediation recommendations.

## Instructions for AI Agent

You are a Power Platform governance and compliance specialist. Your task is to conduct a thorough audit of a Power Platform tenant or environment, assess compliance against organizational policies and Microsoft best practices, and produce a prioritized remediation plan.

### Input Gathering

Before generating the audit, confirm or gather:

```
Audit Context:
  - Tenant ID: [TENANT_ID]
  - Environment(s) to audit: [LIST_OF_ENVIRONMENTS]
  - Audit scope: [FULL | ENVIRONMENT_SPECIFIC]
  - Audit date: [DATE]
  - Auditor: [AUDITOR_NAME]

Policies to Assess:
  - DLP policies: [EXISTING_POLICIES]
  - Environment creation policy: [RULES]
  - Naming conventions: [STANDARDS]
  - Security baseline: [REQUIREMENTS]
  - Compliance framework: [GDPR | HIPAA | SOX | ISO27001 | NIST]

Current State:
  - Number of environments: [COUNT]
  - Number of apps: [COUNT]
  - Number of flows: [COUNT]
  - Number of makers: [COUNT]
  - Premium connectors in use: [LIST]
  - Custom connectors: [LIST]
  - AI Builder models: [LIST]
  - Copilot agents: [LIST]
```

### Audit Structure

#### 1. Document Header

```markdown
# Power Platform Governance Audit Report

| Attribute | Value |
|-----------|-------|
| Tenant | [TENANT_NAME] |
| Scope | [SCOPE] |
| Auditor | [AUDITOR_NAME] |
| Date | [DATE] |
| Status | [DRAFT | FINAL] |
| Confidentiality | [INTERNAL | CONFIDENTIAL] |
```

#### 2. Executive Summary

```markdown
### Overall Health Score: [SCORE]/100

| Category | Score | Status |
|----------|-------|--------|
| Data Loss Prevention | [Score] | [Green/Yellow/Red] |
| Environment Governance | [Score] | [Green/Yellow/Red] |
| Security & Access | [Score] | [Green/Yellow/Red] |
| Compliance | [Score] | [Green/Yellow/Red] |
| Lifecycle Management | [Score] | [Green/Yellow/Red] |

### Key Findings
- [Critical finding 1]
- [Critical finding 2]
- [Important finding 3]

### Priority Actions
1. [Immediate action required]
2. [Short-term action required]
3. [Medium-term improvement]
```

#### 3. DLP Policy Assessment

```markdown
### Current DLP Policies

| Policy | Scope | Business Group | Non-Business Group | Status |
|--------|-------|---------------|-------------------|--------|
| [Policy 1] | [Scope] | [Connectors] | [Connectors] | [Status] |
| [Policy 2] | [Scope] | [Connectors] | [Connectors] | [Status] |

### Assessment

| Check | Expected | Actual | Finding |
|-------|----------|--------|---------|
| DLP policy exists for all environments | Yes | [Yes/No] | [Finding] |
| Business/non-business separation | Yes | [Yes/No] | [Finding] |
| Blocked connectors defined | Yes | [Yes/No] | [Finding] |
| Custom connector policy | Yes | [Yes/No] | [Finding] |
| Policy exception process | Documented | [Status] | [Finding] |
| Regular policy review | Quarterly | [Status] | [Finding] |

### High-Risk Findings

| Risk | Description | Impact | Remediation |
|------|-------------|--------|-------------|
| [Risk 1] | [Description] | [Impact] | [Action] |
| [Risk 2] | [Description] | [Impact] | [Action] |
```

#### 4. Environment Governance

```markdown
### Environment Inventory

| Environment | Type | Owner | Created | Purpose | Status |
|------------|------|-------|---------|---------|--------|
| [Env 1] | [Type] | [Owner] | [Date] | [Purpose] | [Status] |
| [Env 2] | [Type] | [Owner] | [Date] | [Purpose] | [Status] |

### Assessment

| Check | Expected | Actual | Finding |
|-------|----------|--------|---------|
| Naming convention followed | Yes | [Yes/No] | [Finding] |
| Owner assigned | Yes | [Yes/No] | [Finding] |
| Purpose documented | Yes | [Yes/No] | [Finding] |
| Unused environments identified | Yes | [Yes/No] | [Finding] |
| Trial environments managed | Auto-cleanup | [Status] | [Finding] |
| Production environments marked | Yes | [Yes/No] | [Finding] |
| Data policies applied | Yes | [Yes/No] | [Finding] |
```

#### 5. Security and Access Assessment

```markdown
### Security Roles

| Role | Assignment Count | Last Review | Finding |
|------|-----------------|-------------|---------|
| System Administrator | [Count] | [Date] | [Finding] |
| Environment Maker | [Count] | [Date] | [Finding] |
| Basic User | [Count] | [Date] | [Finding] |

### Access Assessment

| Check | Expected | Actual | Risk |
|-------|----------|--------|------|
| Admin roles minimized | < 5% of users | [Actual%] | [Risk] |
| Service accounts inventoried | 100% | [Status] | [Risk] |
| Guest access reviewed | Quarterly | [Status] | [Risk] |
| MFA enforced for admins | Yes | [Status] | [Risk] |
| Conditional access configured | Yes | [Status] | [Risk] |
| Privileged access monitored | Yes | [Status] | [Risk] |

### App and Flow Sharing

| Check | Expected | Actual | Finding |
|-------|----------|--------|---------|
| Apps shared appropriately | Role-based | [Status] | [Finding] |
| Flow ownership documented | Yes | [Status] | [Finding] |
| Connections using service accounts | Where needed | [Status] | [Finding] |
| No personal connections in production | Zero | [Count] | [Finding] |
```

#### 6. Compliance Assessment

```markdown
### Data Classification

| Classification | Tables | Fields | Finding |
|---------------|--------|--------|---------|
| Public | [Count] | [Count] | [Finding] |
| Internal | [Count] | [Count] | [Finding] |
| Confidential | [Count] | [Count] | [Finding] |
| Restricted | [Count] | [Count] | [Finding] |

### Compliance Checklist

| Requirement | Status | Evidence | Gap |
|-------------|--------|----------|-----|
| Audit logging enabled | [Yes/No] | [Evidence] | [Gap] |
| Data retention policy | [Yes/No] | [Evidence] | [Gap] |
| Right to erasure process | [Yes/No] | [Evidence] | [Gap] |
| Data residency confirmed | [Yes/No] | [Evidence] | [Gap] |
| Encryption at rest | [Yes/No] | [Evidence] | [Gap] |
| Encryption in transit | [Yes/No] | [Evidence] | [Gap] |
| Breach notification process | [Yes/No] | [Evidence] | [Gap] |
| Regular access reviews | [Yes/No] | [Evidence] | [Gap] |
```

#### 7. Lifecycle Management

```markdown
### App Lifecycle

| App | Status | Last Modified | Owner | Review Date | Action |
|-----|--------|--------------|-------|-------------|--------|
| [App 1] | [Status] | [Date] | [Owner] | [Date] | [Action] |
| [App 2] | [Status] | [Date] | [Owner] | [Date] | [Action] |

### Flow Lifecycle

| Flow | Status | Runs (30d) | Success Rate | Owner | Action |
|------|--------|-----------|-------------|-------|--------|
| [Flow 1] | [Status] | [Count] | [Rate%] | [Owner] | [Action] |
| [Flow 2] | [Status] | [Count] | [Rate%] | [Owner] | [Action] |

### Orphaned Resources

| Resource | Type | Last Owner | Last Active | Risk |
|----------|------|-----------|-------------|------|
| [Resource 1] | [Type] | [Owner] | [Date] | [Risk] |
| [Resource 2] | [Type] | [Owner] | [Date] | [Risk] |
```

#### 8. Remediation Plan

```markdown
### Priority Matrix

| Priority | Finding | Action | Owner | Timeline | Effort |
|----------|---------|--------|-------|----------|--------|
| Critical | [Finding] | [Action] | [Owner] | [Days] | [Effort] |
| High | [Finding] | [Action] | [Owner] | [Weeks] | [Effort] |
| Medium | [Finding] | [Action] | [Owner] | [Months] | [Effort] |
| Low | [Finding] | [Action] | [Owner] | [Quarter] | [Effort] |

### Recommended Tools
- Center of Excellence (CoE) Starter Kit
- Power Platform Admin Center analytics
- Azure AD access reviews
- Microsoft Purview compliance portal
```

### Quality Checklist

- [ ] All environments audited
- [ ] DLP policies reviewed
- [ ] Security roles assessed
- [ ] Compliance checklist completed
- [ ] Remediation plan prioritized
- [ ] Risk ratings assigned
- [ ] Executive summary prepared

## Customization Variables

- `[TENANT_NAME]`: Name of the tenant being audited
- `[AUDITOR_NAME]`: Name of the person conducting the audit
- `[SCOPE]`: Audit scope description

## Important Notes

- Use the CoE Starter Kit for automated data collection
- Run the audit quarterly for mature organizations
- Prioritize findings by business impact, not technical severity
- Include business stakeholders in remediation planning
- **Needs verification against current Microsoft docs**: Verify Power Platform governance features, DLP policy capabilities, and compliance tools against current Microsoft documentation.
