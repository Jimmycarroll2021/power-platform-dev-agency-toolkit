# Code Review Prompt

## Purpose
Use this prompt to conduct comprehensive code reviews of Power Platform solutions. Copy and paste into your AI coding agent to produce structured review reports with findings and recommendations.

## Instructions for AI Agent

You are a Power Platform code reviewer. Your task is to review solution components (Power Fx formulas, Power Automate flows, Dataverse configurations, plug-in code) against best practices, security standards, and performance guidelines. Produce a structured review report with severity ratings and actionable recommendations.

### Input Gathering

Before generating the review, confirm or gather:

```
Review Context:
  - Solution name: [SOLUTION_NAME]
  - Component type: [CANVAS_APP | MODEL_DRIVEN_APP | FLOW | DATAVERSE | PLUGIN | ALL]
  - Review scope: [FULL | PARTIAL | CHANGE_ONLY]
  - Reviewer: [REVIEWER_NAME]
  - Author: [AUTHOR_NAME]
  - Review date: [DATE]

Standards:
  - Naming convention: [STANDARD]
  - Security baseline: [REQUIREMENTS]
  - Performance targets: [TARGETS]
  - Accessibility requirement: [WCAG_LEVEL]
```

### Review Structure

#### 1. Document Header

```markdown
# Power Platform Code Review Report

| Attribute | Value |
|-----------|-------|
| Solution | [SOLUTION_NAME] |
| Component | [COMPONENT_NAME] |
| Type | [COMPONENT_TYPE] |
| Author | [AUTHOR] |
| Reviewer | [REVIEWER] |
| Date | [DATE] |
| Status | [PASS | PASS_WITH_NOTES | NEEDS_CHANGES | BLOCKED] |
```

#### 2. Review Checklist

```markdown
### Naming Conventions

| Check | Standard | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Table names use publisher prefix | [prefix_][name] | [Actual] | [Pass/Fail] |
| Column names use publisher prefix | [prefix_][name] | [Actual] | [Pass/Fail] |
| App names follow convention | [Project]_[Name] | [Actual] | [Pass/Fail] |
| Flow names follow convention | [Project]_[Process]_[Type] | [Actual] | [Pass/Fail] |
| Variable names are descriptive | Not var1, var2 | [Actual] | [Pass/Fail] |
| Connection references named clearly | [Connector]_[Purpose] | [Actual] | [Pass/Fail] |

### Security

| Check | Standard | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| No hardcoded credentials | Key Vault/Conn Ref | [Actual] | [Pass/Fail] |
| No sensitive data in outputs | Mask/encrypt | [Actual] | [Pass/Fail] |
| Security roles follow least privilege | Min permissions | [Actual] | [Pass/Fail] |
| Field-level security on sensitive fields | Configured | [Actual] | [Pass/Fail] |
| No admin privileges for service accounts | Specific roles | [Actual] | [Pass/Fail] |

### Performance

| Check | Standard | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Delegable functions used | Where possible | [Actual] | [Pass/Fail] |
| Collections used for caching | App start | [Actual] | [Pass/Fail] |
| Concurrent loading | Parallel where safe | [Actual] | [Pass/Fail] |
| No loops without exit conditions | Always bounded | [Actual] | [Pass/Fail] |
| Indexes on frequently queried columns | Documented | [Actual] | [Pass/Fail] |

### Error Handling

| Check | Standard | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Try-catch-finally scopes | All flows | [Actual] | [Pass/Fail] |
| Run-after configured | Error paths | [Actual] | [Pass/Fail] |
| Error notifications | Alert sent | [Actual] | [Pass/Fail] |
| Error logging | Centralized | [Actual] | [Pass/Fail] |
| Graceful degradation | User-friendly | [Actual] | [Pass/Fail] |

### Maintainability

| Check | Standard | Actual | Pass/Fail |
|-------|----------|--------|-----------|
| Comments on complex formulas | Explained | [Actual] | [Pass/Fail] |
| Reusable components | Component library | [Actual] | [Pass/Fail] |
| Environment variables used | No hardcoded URLs | [Actual] | [Pass/Fail] |
| Solution layering | Clear structure | [Actual] | [Pass/Fail] |
| Documentation | Complete | [Actual] | [Pass/Fail] |
```

#### 3. Findings

```markdown
| ID | Severity | Category | Finding | Recommendation | File/Location |
|----|----------|----------|---------|----------------|--------------|
| F-001 | Critical | Security | [Finding] | [Recommendation] | [Location] |
| F-002 | High | Performance | [Finding] | [Recommendation] | [Location] |
| F-003 | Medium | Maintainability | [Finding] | [Recommendation] | [Location] |
| F-004 | Low | Style | [Finding] | [Recommendation] | [Location] |

### Severity Definitions
- **Critical**: Must fix before deployment. Security risk or data loss possible.
- **High**: Should fix before deployment. Significant performance or reliability impact.
- **Medium**: Fix before next release. Code quality or maintainability issue.
- **Low**: Nice to have. Style or minor improvement.
```

#### 4. Power Fx Review

```markdown
### Formula Review

| Location | Formula | Issue | Recommendation |
|----------|---------|-------|----------------|
| [Screen].[Control] | [Formula] | [Issue] | [Fix] |

### Common Patterns to Check

| Pattern | Anti-Pattern | Best Practice |
|---------|-------------|---------------|
| Filtering | Filter(col, condition) on large collection | Filter(dataSource, condition) - delegate |
| Variables | Set everywhere | Use context variables; minimize global |
| Navigation | Hardcoded screen names | Use named references |
| Data loading | Sequential ClearCollect | Use Concurrent() |
| Error display | Default error | User-friendly messages |
```

#### 5. Flow Review

```markdown
### Flow Review

| Flow | Check | Status | Notes |
|------|-------|--------|-------|
| [Flow 1] | Connection references | [Pass/Fail] | [Notes] |
| [Flow 1] | Error handling scopes | [Pass/Fail] | [Notes] |
| [Flow 1] | Retry configuration | [Pass/Fail] | [Notes] |
| [Flow 2] | Trigger conditions | [Pass/Fail] | [Notes] |
| [Flow 2] | Variable initialization | [Pass/Fail] | [Notes] |

### Flow Anti-Patterns

| Anti-Pattern | Found? | Fix |
|-------------|--------|-----|
| Hardcoded connection | [Yes/No] | Use connection reference |
| No error handling | [Yes/No] | Add try-catch scopes |
| Infinite loop risk | [Yes/No] | Add exit conditions |
| No timeout configured | [Yes/No] | Set action timeouts |
| Sensitive data in logs | [Yes/No] | Mask/remove sensitive data |
```

#### 6. Final Assessment

```markdown
| Category | Score | Grade |
|----------|-------|-------|
| Security | [Score]/100 | [A/B/C/D/F] |
| Performance | [Score]/100 | [A/B/C/D/F] |
| Maintainability | [Score]/100 | [A/B/C/D/F] |
| Best Practices | [Score]/100 | [A/B/C/D/F] |
| **Overall** | **[Score]/100** | **[Grade]** |

### Decision
- [ ] **Approved** - No changes required
- [ ] **Approved with notes** - Minor issues, address in next iteration
- [ ] **Needs changes** - Address findings and re-review
- [ ] **Blocked** - Critical issues must be resolved

### Action Items
| ID | Action | Owner | Due Date | Priority |
|----|--------|-------|----------|----------|
| A1 | [Action] | [Owner] | [Date] | [Priority] |
```

### Quality Checklist

- [ ] All security checks reviewed
- [ ] Performance patterns checked
- [ ] Error handling verified
- [ ] Naming conventions checked
- [ ] Findings documented with severity
- [ ] Action items assigned with owners

## Customization Variables

- `[SOLUTION_NAME]`: Name of the solution
- `[COMPONENT_TYPE]`: Type of component being reviewed
- `[REVIEWER]`: Name of reviewer

## Important Notes

- Be specific in findings; include exact locations
- Provide code examples for fixes
- Prioritize security findings
- Balance thoroughness with practicality
- **Needs verification against current Microsoft docs**: Verify Power Fx functions, flow actions, and best practices against current Microsoft documentation.
