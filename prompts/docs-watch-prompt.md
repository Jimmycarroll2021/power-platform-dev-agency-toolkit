# Microsoft Docs Watch Prompt

## Purpose
Use this prompt to monitor Microsoft documentation for changes that could impact your Power Platform solutions. Copy and paste into your AI coding agent to set up automated tracking of release plans, deprecated features, and licensing updates.

## Instructions for AI Agent

You are a Power Platform intelligence analyst. Your task is to monitor Microsoft documentation, release plans, and platform updates for changes that could affect our Power Platform solutions. Track deprecated features, new capabilities, licensing changes, and breaking changes.

### Input Gathering

Before generating the monitoring plan, confirm or gather:

```
Solution Context:
  - Solutions in scope: [LIST_OF_SOLUTIONS]
  - Components used: [POWER_APPS | POWER_AUTOMATE | DATAVERSE | COPILOT | AI_BUILDER | RPA]
  - Current platform version: [VERSION]
  - Deployment region: [REGION]
  - Tenant type: [COMMERCIAL | GCC | GCC_HIGH | DOD | CHINA]

Monitoring Requirements:
  - Track release waves: [YES | NO]
  - Track deprecated features: [YES | NO]
  - Track licensing changes: [YES | NO]
  - Track security updates: [YES | NO]
  - Track connector changes: [YES | NO]
  - Notification frequency: [DAILY | WEEKLY | MONTHLY]
```

### Monitoring Plan Structure

#### 1. Document Header

```markdown
# Microsoft Docs Watch Plan

| Attribute | Value |
|-----------|-------|
| Scope | [SOLUTIONS_IN_SCOPE] |
| Region | [REGION] |
| Tenant Type | [TENANT_TYPE] |
| Created | [DATE] |
| Review Cycle | [FREQUENCY] |
| Owner | [OWNER] |
```

#### 2. Information Sources

```markdown
### Official Sources

| Source | URL | Content Type | Check Frequency |
|--------|-----|-------------|----------------|
| Microsoft 365 Roadmap | https://www.microsoft.com/en-us/microsoft-365/roadmap | Feature pipeline | Weekly |
| Power Platform Release Planner | https://releaseplans.microsoft.com | Wave details | Weekly |
| Power Platform Blog | https://powerplatform.microsoft.com/blog | Announcements | Weekly |
| Microsoft Learn - What's New | https://learn.microsoft.com/power-platform/ | Documentation updates | Weekly |
| Message Center (M365 Admin) | https://admin.microsoft.com | Tenant-specific updates | Daily |
| Microsoft Entra Blog | https://techcommunity.microsoft.com/identity | Auth changes | Weekly |

### Component-Specific Sources

| Component | Source URL | What to Track |
|-----------|-----------|---------------|
| Power Apps | https://learn.microsoft.com/power-apps/maker/whats-new | Canvas, model-driven updates |
| Power Automate | https://learn.microsoft.com/power-automate/whats-new | Flow, connector updates |
| Dataverse | https://learn.microsoft.com/power-apps/maker/data-platform/ | Table, API changes |
| Copilot Studio | https://learn.microsoft.com/copilot-studio/whats-new | Agent, topic updates |
| AI Builder | https://learn.microsoft.com/ai-builder/whats-new | Model, credit updates |
| Power Pages | https://learn.microsoft.com/power-pages/ | Portal updates |
| Connectors | https://learn.microsoft.com/connectors/ | New/changed connectors |

### Deprecation Tracking

| Source | URL | Check Frequency |
|--------|-----|----------------|
| Deprecated Features | https://learn.microsoft.com/power-platform/important-changes | Monthly |
| Breaking Changes | https://learn.microsoft.com/power-platform/important-changes-coming | Monthly |
| Connector Deprecations | Per-connector docs | Monthly |
```

#### 3. Release Wave Tracking

```markdown
### Release Wave Tracking Template

| Wave | Component | Feature | Status | Impact | Action Required | Target Date |
|------|-----------|---------|--------|--------|----------------|-------------|
| 2025 Wave 1 | [Component] | [Feature] | [Preview/GA] | [Impact level] | [Action] | [Date] |
| 2025 Wave 1 | [Component] | [Feature] | [Preview/GA] | [Impact level] | [Action] | [Date] |

### Impact Assessment Matrix

| Impact Level | Definition | Response |
|-------------|-----------|----------|
| Critical | Affects core functionality | Immediate assessment required |
| High | Significant feature improvement | Plan adoption within 30 days |
| Medium | Nice-to-have enhancement | Evaluate in next planning cycle |
| Low | Minor change or cosmetic | Note for awareness |
| Negative | Deprecation or limitation change | Plan remediation immediately |

### Feature Evaluation Checklist

For each new feature:
```
Feature: [Name]
Component: [Power Apps / Automate / Dataverse / etc.]
Status: [Preview / Public Preview / GA]

Evaluation Questions:
1. Does this feature solve a current pain point? [Yes/No]
2. Does this feature replace a custom/workaround solution? [Yes/No]
3. What is the licensing impact? [None / Included / Premium / TBD]
4. What is the implementation effort? [Hours/Days/Weeks]
5. Is there a dependency on other features? [List]
6. Does it affect existing solutions? [Yes/No - explain]
7. Is it available in our region? [Yes/No]
8. Is it available for our tenant type? [Yes/No]

Recommendation: [Adopt now / Plan for adoption / Evaluate later / Not applicable]
Owner: [Name]
Target Date: [Date]
```
```

#### 4. Deprecation Tracking

```markdown
### Deprecation Register

| Feature/Component | Deprecation Date | Removal Date | Current Usage | Migration Plan | Owner | Status |
|-------------------|-----------------|-------------|---------------|---------------|-------|--------|
| [Feature 1] | [Date] | [Date] | [Where used] | [Plan] | [Owner] | [Status] |
| [Feature 2] | [Date] | [Date] | [Where used] | [Plan] | [Owner] | [Status] |

### Deprecation Response Workflow

```
Detect deprecation announcement
  -> Assess impact on our solutions
    -> If used in production:
      -> Identify migration alternative
      -> Estimate effort
      -> Create work item
      -> Assign owner
      -> Set target date (before removal date)
      -> Monitor for updates
    -> If not used:
      -> Log for awareness
      -> Update deprecation register
```

### Common Deprecation Patterns to Watch

| Category | Examples | Impact |
|----------|----------|--------|
| Connector deprecation | Old API versions, third-party changes | Flows break |
| Feature retirement | Classic workflows, old app designer | Must migrate |
| API version retirement | Dataverse API versions | Integrations break |
| Authentication changes | OAuth 1.0, basic auth | Connections fail |
| UI changes | Deprecated controls | Apps need update |
| Licensing changes | Feature included/excluded | Cost impact |
```

#### 5. Licensing Change Tracking

```markdown
### Licensing Watch List

| Date | Change | Impact | Action Required | Status |
|------|--------|--------|----------------|--------|
| [Date] | [Description] | [Impact] | [Action] | [Status] |

### Licensing Sources

| Source | URL | Check Frequency |
|--------|-----|----------------|
| Power Platform Pricing | https://powerplatform.microsoft.com/pricing/ | Monthly |
| Licensing Guide | https://go.microsoft.com/fwlink/?linkid=2085130 | Monthly |
| AI Builder Credits | https://learn.microsoft.com/ai-builder/credit-management | Monthly |
| Copilot Studio Pricing | https://www.microsoft.com/copilot-studio/pricing | Monthly |

### License Impact Assessment

When licensing changes are detected:
1. Identify affected users/flows/apps
2. Calculate cost impact (increase or decrease)
3. Identify alternative licensing options
4. Assess timeline for compliance
5. Notify stakeholders
6. Plan license procurement or reallocation
```

#### 6. Notification and Reporting

```markdown
### Weekly Digest Template

```markdown
# Power Platform Docs Weekly Digest
Week of: [Date]
Prepared by: [Name]

## New Features (Wave X)
- [Feature 1] - [Brief description] - [Impact assessment]
- [Feature 2] - [Brief description] - [Impact assessment]

## Deprecation Notices
- [Deprecation 1] - [Removal date] - [Our action plan]

## Licensing Updates
- [Change 1] - [Impact] - [Action required]

## Security Advisories
- [Advisory 1] - [Severity] - [Action required]

## Recommendations
1. [Action item with owner and date]
2. [Action item with owner and date]

## Upcoming Important Dates
- [Date]: [Event/Deadline]
```

### Distribution List

| Role | Email | Frequency | Format |
|------|-------|-----------|--------|
| Platform Admin | [Email] | Weekly | Full digest |
| Solution Architects | [Email] | Weekly | Feature-focused |
| IT Leadership | [Email] | Monthly | Summary only |
| Development Team | [Email] | Weekly | Technical details |
```

#### 7. Emergency Response

```markdown
### Critical Platform Changes

When a critical change is detected (breaking change, security vulnerability, service outage):

1. **Immediate (within 1 hour)**
   - Verify impact on our solutions
   - Notify platform admin and solution owners
   - Post in emergency Teams channel

2. **Short-term (within 4 hours)**
   - Assess full impact across all solutions
   - Identify workarounds or mitigations
   - Create incident ticket
   - Assign response team

3. **Medium-term (within 24 hours)**
   - Implement mitigations
   - Test workarounds
   - Communicate to users if needed
   - Plan permanent fix

### Emergency Contacts

| Role | Name | Phone | Email | Availability |
|------|------|-------|-------|-------------|
| Platform Admin | [Name] | [Phone] | [Email] | 24/7 |
| Solution Architect | [Name] | [Phone] | [Email] | Business hours |
| Microsoft Support | Premier | [Number] | [Email] | Per contract |
```

#### 8. Search Queries for Monitoring

```markdown
### Recommended Search Patterns

Execute these searches regularly:

```
site:learn.microsoft.com/power-platform "deprecated" "2025"
site:learn.microsoft.com/power-platform "breaking change" "2025"
site:learn.microsoft.com/power-platform "general availability" after:2025-01-01
site:learn.microsoft.com/power-apps "what's new"
site:learn.microsoft.com/power-automate "what's new"
site:learn.microsoft.com/copilot-studio "what's new"
site:learn.microsoft.com/ai-builder "what's new"
site:learn.microsoft.com/connectors "new connector"
```

```
site:powerplatform.microsoft.com/blog "announcement"
site:techcommunity.microsoft.com "Power Platform" "update"
```
```

### Quality Checklist

- [ ] All information sources identified and bookmarked
- [ ] Release wave tracking template created
- [ ] Deprecation register established
- [ ] Notification templates prepared
- [ ] Emergency response procedure documented
- [ ] Search queries compiled
- [ ] Distribution list configured

## Customization Variables

- `[SOLUTIONS_IN_SCOPE]`: List of solutions to monitor
- `[REGION]`: Deployment region
- `[TENANT_TYPE]`: Type of tenant
- `[OWNER]`: Monitoring plan owner

## Important Notes

- Set calendar reminders for weekly/monthly checks
- Subscribe to relevant RSS feeds where available
- Join Power Platform community forums for early signals
- Document all findings; institutional knowledge is critical
- **Cross-check against current Microsoft Learn**: This meta-prompt itself should be reviewed quarterly to ensure all tracked sources are still current and relevant.
