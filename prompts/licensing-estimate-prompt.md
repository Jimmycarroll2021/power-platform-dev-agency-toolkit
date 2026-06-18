# Licensing and Capacity Estimate Prompt

## Purpose
Use this prompt to generate comprehensive licensing and capacity estimates for Power Platform solutions. Copy and paste into your AI coding agent to produce accurate cost projections and license recommendations.

## Instructions for AI Agent

You are a Power Platform licensing specialist. Your task is to analyze a solution architecture and produce a detailed licensing and capacity estimate that covers all required licenses, capacity add-ons, and projected costs.

### Input Gathering

Before generating the estimate, confirm or gather:

```
Solution Context:
  - Solution name: [SOLUTION_NAME]
  - Number of canvas apps: [COUNT]
  - Number of model-driven apps: [COUNT]
  - Number of portals: [COUNT]
  - Number of cloud flows: [COUNT]
  - Number of desktop flows: [COUNT]
  - Number of Copilot agents: [COUNT]
  - Number of AI Builder models: [COUNT]
  - Dataverse usage: [YES | NO]
  - Estimated Dataverse storage: [GB]

Users:
  - Total users: [COUNT]
  - Canvas app users: [COUNT]
  - Model-driven app users: [COUNT]
  - Portal users: [COUNT]
  - Flow users (authors): [COUNT]
  - RPA users: [COUNT]
  - Admin users: [COUNT]
  - Guest users: [COUNT]

Existing Licenses:
  - Microsoft 365 licenses: [COUNT | TYPE]
  - Power Apps licenses: [COUNT | TYPE]
  - Power Automate licenses: [COUNT | TYPE]
  - Power BI licenses: [COUNT | TYPE]
  - Dynamics 365 licenses: [COUNT | TYPE]

Premium Connectors:
  - List of premium connectors used: [LIST]
  - List of custom connectors: [LIST]

AI/Copilot Usage:
  - AI Builder credit estimate: [COUNT]
  - Copilot message volume: [MESSAGES/MONTH]
  - GPT prompt calls: [CALLS/MONTH]

Budget:
  - Monthly budget: $[AMOUNT]
  - Annual budget: $[AMOUNT]
  - Budget flexibility: [FIXED | FLEXIBLE]
```

### Estimate Structure

#### 1. Document Header

```markdown
# Licensing and Capacity Estimate

| Attribute | Value |
|-----------|-------|
| Solution | [SOLUTION_NAME] |
| Date | [DATE] |
| Author | [AUTHOR] |
| Version | [VERSION] |
| Status | [DRAFT | FINAL] |
| Valid Through | [DATE] |
```

#### 2. License Inventory

```markdown
### Current License Assessment

| Existing License | Count | Power Platform Entitlements | Notes |
|-----------------|-------|---------------------------|-------|
| Microsoft 365 E3 | [Count] | Power Apps (limited) | Can run apps in Teams |
| Microsoft 365 E5 | [Count] | Power Apps + Automate (limited) | Includes per-user for basic |
| Power Apps per user | [Count] | Full canvas + model-driven | Premium connectors |
| Power Automate per user | [Count] | Full flow authoring | Premium connectors |
| Dynamics 365 Sales | [Count] | Model-driven + Dataverse | App-specific |

### Required Licenses

| License Type | Count | Unit Price | Monthly Cost | Annual Cost | Justification |
|-------------|-------|-----------|-------------|-------------|---------------|
| Power Apps per user | [Count] | $20 | $[Total] | $[Total] | [Reason] |
| Power Apps per app | [Count] | $5/app | $[Total] | $[Total] | [Reason] |
| Power Automate per user | [Count] | $15 | $[Total] | $[Total] | [Reason] |
| Power Automate per flow | [Count] | $100 | $[Total] | $[Total] | [Reason] |
| Power Automate unattended RPA | [Count] | $150 | $[Total] | $[Total] | [Reason] |
| Power Pages authenticated | [Count] | $200/100users | $[Total] | $[Total] | [Reason] |
| Power Pages anonymous | [Count] | $100/500users | $[Total] | $[Total] | [Reason] |
| AI Builder credits | [Count] | $500/1M | $[Total] | $[Total] | [Reason] |
| Copilot Studio | [Count] sessions | Variable | $[Total] | $[Total] | [Reason] |
| Dataverse storage (file) | [GB] | $2/GB | $[Total] | $[Total] | [Reason] |
| Dataverse storage (log) | [GB] | $10/GB | $[Total] | $[Total] | [Reason] |

**Total Monthly Cost**: $[Amount]
**Total Annual Cost**: $[Amount]
```

#### 3. User-by-User License Assignment

```markdown
### License Assignment Matrix

| User Role | Count | Power Apps | Power Automate | RPA | AI Builder | Total/User |
|-----------|-------|-----------|---------------|-----|-----------|-----------|
| Admin | [Count] | Per user | Per user | - | Included | $35 |
| App User (Standard) | [Count] | Per app | - | - | - | $5 |
| App User (Premium) | [Count] | Per user | Per user | - | - | $35 |
| Flow Author | [Count] | - | Per user | - | - | $15 |
| RPA Operator | [Count] | - | Per user | Unattended | - | $165 |
| Portal User | [Count] | Pages | - | - | - | $2 |
| AI User | [Count] | Per user | - | - | Credits | $20+ |
| Copilot User | [Count] | - | - | - | Msg credits | Variable |
```

#### 4. Premium Connector Audit

```markdown
### Premium Connector Inventory

| Connector | Flows Using | License Option | Monthly Cost | Optimization |
|-----------|------------|----------------|-------------|--------------|
| [Connector 1] | [Count] | Per user | $[Amount] | [Suggestion] |
| [Connector 2] | [Count] | Per flow | $[Amount] | [Suggestion] |
| [Connector 3] | [Count] | Per user | $[Amount] | [Suggestion] |

### Optimization Opportunities

| Current | Optimized | Savings | Approach |
|---------|-----------|---------|----------|
| [Current] | [Optimized] | $[Amount] | [Strategy] |
| [Current] | [Optimized] | $[Amount] | [Strategy] |
```

#### 5. Capacity Planning

```markdown
### Dataverse Storage

| Storage Type | Current | 12-Month | 24-Month | Add-On Needed |
|-------------|---------|----------|----------|---------------|
| Database | [GB] | [GB] | [GB] | [Yes/No] |
| File | [GB] | [GB] | [GB] | [Yes/No] |
| Log | [GB] | [GB] | [GB] | [Yes/No] |

### API Request Capacity

| License Type | Users | Daily Allowance | Total Daily | Peak Safety |
|-------------|-------|----------------|-------------|-------------|
| Power Apps per user | [Count] | 25,000 | [Total] | [Status] |
| Power Apps per app | [Count] | 5,000 | [Total] | [Status] |
| Power Automate per user | [Count] | 25,000 | [Total] | [Status] |

### AI Builder Credits

| Model | Monthly Usage | Credits/Unit | Monthly Credits | Annual |
|-------|-------------|-------------|----------------|--------|
| [Model 1] | [Count] | [Rate] | [Total] | [Total] |
| [Model 2] | [Count] | [Rate] | [Total] | [Total] |
| **Total** | | | **[Total]** | **[Total]** |
```

#### 6. Cost Projection

```markdown
### 3-Year TCO

| Year | Licenses | Capacity | AI/Copilot | Support | Total |
|------|----------|----------|-----------|---------|-------|
| Year 1 | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Total] |
| Year 2 | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Total] |
| Year 3 | $[Amount] | $[Amount] | $[Amount] | $[Amount] | $[Total] |
| **Total** | **$[Amount]** | **$[Amount]** | **$[Amount]** | **$[Amount]** | **$[Total]** |

### Budget Comparison

| Item | Estimated | Budget | Variance |
|------|-----------|--------|----------|
| Monthly | $[Amount] | $[Amount] | $[Amount] |
| Annual | $[Amount] | $[Amount] | $[Amount] |
```

#### 7. Recommendations

```markdown
| # | Recommendation | Impact | Effort | Priority |
|---|---------------|--------|--------|----------|
| 1 | [Recommendation] | [Impact] | [Effort] | [Priority] |
| 2 | [Recommendation] | [Impact] | [Effort] | [Priority] |
| 3 | [Recommendation] | [Impact] | [Effort] | [Priority] |
```

### Quality Checklist

- [ ] All users have assigned licenses
- [ ] All premium connectors covered
- [ ] Capacity add-ons calculated
- [ ] AI Builder credits estimated
- [ ] 3-year TCO projected
- [ ] Optimization opportunities identified
- [ ] Budget variance calculated

## Customization Variables

- `[SOLUTION_NAME]`: Name of the solution
- `[USER_COUNTS]`: Number of users per role
- `[BUDGET_AMOUNT]`: Available budget

## Important Notes

- Pricing changes frequently; verify with Microsoft
- Consider EA/MCA discounts for large volumes
- Build in 20% buffer for growth
- Review estimates quarterly
- **Cross-check against current Microsoft Learn**: Verify all pricing, license entitlements, and capacity limits against current Microsoft documentation. Pricing in this prompt is illustrative and will vary by region and agreement type.
