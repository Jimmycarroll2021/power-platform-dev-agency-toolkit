# QA Test Plan Prompt

## Purpose
Use this prompt to generate comprehensive QA test plans for Power Platform solutions. Copy and paste into your AI coding agent to produce structured test plans covering unit, integration, UAT, and performance testing.

## Instructions for AI Agent

You are a Power Platform QA specialist. Your task is to create a comprehensive test plan that covers all aspects of quality assurance for a Power Platform solution, including functional testing, integration testing, user acceptance testing, performance testing, and security testing.

### Input Gathering

Before generating the test plan, confirm or gather:

```
Solution Context:
  - Solution name: [SOLUTION_NAME]
  - Components: [APPS | FLOWS | TABLES | BOTS | AI_MODELS]
  - Test environment: [ENVIRONMENT_URL]
  - Test data: [AVAILABLE | NEEDS_CREATION]
  - Previous test results: [BASELINE]

Test Requirements:
  - Functional test: [YES | NO]
  - Integration test: [YES | NO]
  - UAT test: [YES | NO]
  - Performance test: [YES | NO]
  - Security test: [YES | NO]
  - Accessibility test: [YES | NO]
  - Regression test: [YES | NO]

Resources:
  - Test lead: [NAME]
  - Testers: [COUNT]
  - Timeline: [START_DATE] to [END_DATE]
  - Tools: [TOOLS_AVAILABLE]
```

### Test Plan Structure

#### 1. Document Header

```markdown
# QA Test Plan: [Solution Name]

| Attribute | Value |
|-----------|-------|
| Solution | [SOLUTION_NAME] |
| Version | [VERSION] |
| Environment | [ENVIRONMENT_URL] |
| Test Lead | [LEAD_NAME] |
| Start Date | [START_DATE] |
| End Date | [END_DATE] |
| Status | [DRAFT | ACTIVE | COMPLETE] |
```

#### 2. Test Strategy

```markdown
### Test Levels

| Level | Scope | Objective | Entry Criteria | Exit Criteria |
|-------|-------|-----------|---------------|---------------|
| Unit | Individual components | Component works in isolation | Build complete | All unit tests pass |
| Integration | Component interactions | Components work together | Unit tests pass | All integrations verified |
| System | End-to-end scenarios | Solution meets requirements | Integration tests pass | All scenarios pass |
| UAT | Business scenarios | Business acceptance | System tests pass | Business sign-off |
| Performance | Load and stress | Meets performance targets | Functional tests pass | Performance within SLA |
| Security | Permissions and access | Security requirements met | Functional tests pass | No security gaps |

### Test Approach

| Component | Test Type | Priority | Effort | Approach |
|-----------|-----------|----------|--------|----------|
| Canvas App | Functional, UI, Responsive | High | 3 days | Manual + Test Studio |
| Model-Driven App | Functional, Security | High | 2 days | Manual |
| Cloud Flow | Unit, Integration, Error | High | 3 days | Manual + automated |
| Desktop Flow | Functional, Exception | High | 2 days | Manual |
| Dataverse | Data integrity, Security | High | 2 days | Automated scripts |
| Copilot Agent | Conversation, Intent | Medium | 2 days | Manual test scripts |
| AI Builder | Accuracy, Confidence | Medium | 2 days | Sample set testing |
| Custom Connector | Connectivity, Error | Medium | 1 day | Postman + flow test |
```

#### 3. Test Cases

```markdown
### Functional Test Cases

| ID | Component | Scenario | Steps | Expected Result | Priority |
|----|-----------|----------|-------|----------------|----------|
| TC-001 | [App] | Create new record | 1. Open app<br>2. Tap New<br>3. Fill form<br>4. Save | Record created; confirmation shown | High |
| TC-002 | [App] | Edit existing record | 1. Select record<br>2. Tap Edit<br>3. Modify field<br>4. Save | Changes saved; history updated | High |
| TC-003 | [App] | Delete record | 1. Select record<br>2. Tap Delete<br>3. Confirm | Record deleted (soft delete); confirmation | High |
| TC-004 | [App] | Search records | 1. Enter search term<br>2. Submit | Relevant results displayed | High |
| TC-005 | [App] | Filter records | 1. Select filter criteria<br>2. Apply | Filtered results displayed | Medium |

### Flow Test Cases

| ID | Flow | Scenario | Input | Expected Result | Priority |
|----|------|----------|-------|----------------|----------|
| TC-F01 | [Flow] | Happy path | [Valid input] | Success; all actions complete | High |
| TC-F02 | [Flow] | Validation failure | [Invalid input] | Validation error; no processing | High |
| TC-F03 | [Flow] | Connection failure | [Trigger] | Retry 3x; alert sent | High |
| TC-F04 | [Flow] | Timeout | [Slow response] | Timeout handled; alert sent | Medium |
| TC-F05 | [Flow] | Duplicate prevention | [Duplicate input] | Duplicate detected; no double processing | High |

### Integration Test Cases

| ID | Scenario | Components | Steps | Expected Result |
|----|----------|-----------|-------|----------------|
| TC-I01 | App creates, flow processes | App -> Dataverse -> Flow | 1. Create in app<br>2. Verify flow triggers<br>3. Check output | Flow runs; output correct |
| TC-I02 | Flow updates, app reflects | Flow -> Dataverse -> App | 1. Trigger flow<br>2. Refresh app<br>3. Verify display | App shows updated data |
| TC-I03 | AI extraction feeds approval | AI -> Flow -> Approval | 1. Upload doc<br>2. Wait for extraction<br>3. Verify approval | Approval created with extracted data |
| TC-I04 | Copilot triggers action | Copilot -> Flow -> System | 1. Ask copilot<br>2. Verify flow runs<br>3. Check response | Correct action executed |

### Error Handling Test Cases

| ID | Scenario | Trigger | Expected Behavior |
|----|----------|---------|-------------------|
| TC-E01 | Invalid input | Malformed data | Validation error; user-friendly message |
| TC-E02 | Missing required field | Empty required field | Field highlighted; submission blocked |
| TC-E03 | Network failure | Disconnect network | Graceful degradation; retry option |
| TC-E04 | Permission denied | Unauthenticated access | Access blocked; login prompt |
| TC-E05 | Data not found | Invalid record ID | "Not found" message; no crash |

### Performance Test Cases

| ID | Scenario | Load | Target | Measurement |
|----|----------|------|--------|-------------|
| TC-P01 | App load time | Single user | < 3 seconds | OnStart to interactive |
| TC-P02 | Screen navigation | Single user | < 1 second | Tap to display |
| TC-P03 | Flow execution | Single trigger | < 30 seconds | Trigger to completion |
| TC-P04 | Concurrent users | 10 users | < 5 second response | Average response time |
| TC-P05 | Peak load | 50 users | No errors | Error rate < 1% |
| TC-P06 | Data volume | 10K records | < 3 second search | Search response time |
```

#### 4. Test Data

```markdown
### Test Data Requirements

| Data Set | Purpose | Volume | Format | Status |
|----------|---------|--------|--------|--------|
| [Data 1] | Functional testing | [Count] | [Format] | [Ready/Needed] |
| [Data 2] | Performance testing | [Count] | [Format] | [Ready/Needed] |
| [Data 3] | Edge cases | [Count] | [Format] | [Ready/Needed] |

### Test Data Creation

```
Create [Count] records of [Type] with:
- Valid data: [Percentage]%
- Invalid data: [Percentage]%
- Edge cases: [Percentage]%
- Boundary values: [List]
```
```

#### 5. Test Schedule

```markdown
| Phase | Start | End | Duration | Dependencies |
|-------|-------|-----|----------|-------------|
| Test preparation | [Date] | [Date] | [Days] | Environment ready |
| Unit testing | [Date] | [Date] | [Days] | Build complete |
| Integration testing | [Date] | [Date] | [Days] | Unit tests pass |
| System testing | [Date] | [Date] | [Days] | Integration pass |
| UAT | [Date] | [Date] | [Days] | System tests pass |
| Performance testing | [Date] | [Date] | [Days] | Functional pass |
| Bug fixing | [Date] | [Date] | [Days] | Testing findings |
| Regression testing | [Date] | [Date] | [Days] | Fixes deployed |

### Daily Test Schedule

| Time | Activity | Participants |
|------|----------|-------------|
| 09:00 | Daily standup | All testers |
| 09:30 | Test execution | Testers |
| 12:00 | Progress check | Test lead |
| 14:00 | Bug triage | Test lead + dev |
| 16:00 | Status update | Test lead |
| 17:00 | Report generation | Test lead |
```

#### 6. Defect Management

```markdown
### Severity Definitions

| Severity | Definition | Response Time |
|----------|-----------|--------------|
| Critical | System crash, data loss, security breach | Fix within 4 hours |
| High | Major feature broken, workaround difficult | Fix within 24 hours |
| Medium | Feature partially broken, workaround exists | Fix within 3 days |
| Low | Cosmetic issue, minor inconvenience | Fix in next release |

### Defect Lifecycle

```
New -> Triaged -> Assigned -> In Progress -> Ready for Test -> Verified -> Closed
            |-> Rejected
            |-> Deferred
```

### Defect Report Template

| Field | Description |
|-------|-------------|
| ID | DEF-[Number] |
| Title | Brief description |
| Severity | Critical/High/Medium/Low |
| Component | Affected component |
| Steps to reproduce | Numbered steps |
| Expected result | What should happen |
| Actual result | What actually happens |
| Environment | Test environment details |
| Evidence | Screenshots, logs |
| Reporter | Who found it |
```

#### 7. Entry and Exit Criteria

```markdown
### Entry Criteria (Testing can begin)
- [ ] Solution deployed to test environment
- [ ] Test environment matches production specification
- [ ] Test data prepared and validated
- [ ] Test cases reviewed and approved
- [ ] Test tools configured and accessible
- [ ] Test team trained on solution

### Exit Criteria (Testing is complete)
- [ ] All test cases executed
- [ ] No critical defects open
- [ ] High severity defects < 3 (or accepted)
- [ ] Defect fix rate > 95%
- [ ] Performance within targets
- [ ] UAT sign-off obtained
- [ ] Test report completed
```

#### 8. Risk Assessment

```markdown
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Environment instability | Medium | High | Dedicated test environment; backup plan |
| Test data issues | Medium | Medium | Prepare synthetic data; data refresh procedure |
| Resource availability | Low | High | Cross-train testers; backup resources |
| Scope changes | Medium | High | Change control process; impact assessment |
| Tool limitations | Low | Medium | Alternative tools; manual fallback |
```

### Quality Checklist

- [ ] Test plan covers all requirements
- [ ] Test cases traceable to requirements
- [ ] Test data prepared
- [ ] Schedule realistic
- [ ] Resources assigned
- [ ] Entry/exit criteria defined
- [ ] Defect process defined
- [ ] Risks identified and mitigated

## Customization Variables

- `[SOLUTION_NAME]`: Name of the solution
- `[ENVIRONMENT_URL]`: Test environment URL
- `[LEAD_NAME]`: Test lead name

## Important Notes

- Involve business users in UAT planning
- Test with realistic data volumes
- Document all test evidence
- Maintain traceability to requirements
- **Cross-check against current Microsoft Learn**: Verify testing tool capabilities and platform limits against current Microsoft documentation.
