# Power Automate Cloud Flow Playbook

> **Complexity Rating:** Low / Medium / High (circle one)
> **Last Updated:** 2024
> **Applies To:** Power Automate Cloud Flows (Automated, Instant, Scheduled, HTTP)

---

## 1. When to Use Cloud Flows

Use cloud flows when you need:

| Scenario | Why Cloud Flow |
|----------|---------------|
| Event-driven automation (trigger on Dataverse record change) | Native triggers, no infrastructure |
| Scheduled recurring tasks | Built-in scheduling, no cron needed |
| HTTP API integrations | Built-in HTTP connector, easy auth |
| Approval workflows | Native approval actions, Teams integration |
| Email/SMS/Teams notifications | Native Office 365 connectors |
| Data synchronization between systems | Visual designer, error handling |
| File processing (SharePoint, OneDrive) | Native file triggers |
| Business process automation | No-code/low-code, rapid development |

## 2. When NOT to Use Cloud Flows

> **DO NOT use cloud flows for:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Complex branching logic (> 10 nested conditions) | Azure Logic Apps or Azure Functions | Maintainability |
| Long-running stateful orchestrations (> 30 days) | Azure Logic Apps (Standard) or Durable Functions | Timeout limits |
| Heavy data transformation / ETL | Azure Data Factory or Azure Functions | Performance, cost |
| Real-time synchronous API (< 100ms response) | Azure Functions or API Management | Latency |
| Desktop/legacy application automation | Power Automate Desktop (RPA) | Needs UI interaction |
| Complex document processing (> 100 pages/batch) | Azure Functions + AI Document Intelligence | Throughput |
| Multi-step human workflows with state machines | Azure Logic Apps or custom app | State management |
| Code-intensive operations (complex regex, parsing) | Azure Functions | Code flexibility |

---

## 3. Architecture

### 3.1 Flow Types Decision Tree

```
NEED AUTOMATION
       |
       v
Is it triggered by an event?
   |--YES--> Is it a Dataverse event?
   |           |--YES--> USE: Automated Cloud Flow (Dataverse trigger)
   |           |--NO---> Is it a file/email/Teams event?
   |                       |--YES--> USE: Automated Cloud Flow (connector trigger)
   |                       |--NO---> Is it an HTTP webhook?
   |                                   |--YES--> USE: Automated Cloud Flow (HTTP trigger)
   |
   |--NO--> Does it run on a schedule?
               |--YES--> USE: Scheduled Cloud Flow
               |--NO---> Is it triggered by a user?
                           |--YES--> USE: Instant Cloud Flow (button/flow run)
                           |--NO---> Is it called by another system?
                                       |--YES--> USE: Instant Cloud Flow (HTTP request)
```

### 3.2 Architecture Patterns

#### Pattern: Event-Driven with Retry

```
[Dataverse: Record Created]
       |
       v
[Trigger: When a row is added]
       |
       v
[Scope: Try]
       |
       |-->[Data Operation: Validate]
       |-->[HTTP: Call External API]
       |-->[Dataverse: Update Status = "Processed"]
       |
[Scope: Catch] (run after Try has failed)
       |
       |-->[Dataverse: Update Status = "Error"]
       |-->[Teams: Notify Support]
       |-->[Dataverse: Log Error Details]
```

#### Pattern: Fan-Out / Parallel Processing

```
[Scheduled Trigger]
       |
       v
[Dataverse: List records to process]
       |
       v
[Apply to Each] --> Process each record
       |
       v
[Condition: Success?]
   |--YES-->[Update: Processed]
   |--NO--->[Update: Failed + Log]
```

---

## 4. Data Model

### 4.1 Recommended Supporting Tables

Create a **Flow Run Log** table for tracking and auditing:

| Column | Type | Purpose |
|--------|------|---------|
| Flow Run Log ID | Auto-number | Unique identifier |
| Flow Name | Text | Which flow executed |
| Run ID | Text | Power Automate run ID |
| Status | Choice (Success / Warning / Error) | Outcome |
| Start Time | DateTime | When flow started |
| End Time | DateTime | When flow ended |
| Duration (ms) | Number | Execution time |
| Trigger Record ID | Text | Source record reference |
| Error Message | Text | Error details |
| Retry Count | Number | Number of retry attempts |
| Correlation ID | Text | Cross-flow tracking |

### 4.2 Status Tracking Pattern

Add a **Process Status** column to business tables:

| Status Value | Meaning | Next Action |
|-------------|---------|------------|
| Pending | Waiting for processing | Flow picks up automatically |
| Processing | Flow is actively working | Monitor |
| Processed | Successfully completed | None |
| Error | Processing failed | Manual review required |
| Retry | Scheduled for retry | Flow will retry |
| Skipped | Intentionally skipped | None |

---

## 5. Authentication

### 5.1 Connection Strategy

| Connection Type | Use For | Account Type |
|----------------|---------|-------------|
| Built-in (Dataverse, Office 365) | Native Microsoft services | Service account |
| OAuth (Salesforce, SharePoint) | External cloud services | Service account |
| API Key (custom APIs) | Third-party REST APIs | Service account / Key Vault |
| Basic Auth (legacy) | Legacy systems | Service account (migrate to OAuth) |
| Certificate Auth | High-security integrations | Certificate in Key Vault |

### 5.2 Service Account Setup

> **DO NOT:** Use personal user accounts for production flow connections. When a user leaves, their connections break.

**Service Account Requirements:**
- Dedicated account (e.g., svc-powerplatform@company.com)
- MFA exclusion or conditional access (for unattended flows)
- License: Power Automate per user OR Power Automate per flow
- Mailbox enabled (for email actions)
- Teams license (for Teams actions)

### 5.3 Connection Reference Pattern

Always use **Connection References** (not hardcoded connections):

```
SOLUTION: MySolution
  |
  +-- Connection References
  |     +-- "Dataverse Connection" --> Points to actual connection
  |     +-- "SharePoint Connection" --> Points to actual connection
  |     +-- "Outlook Connection" --> Points to actual connection
  |
  +-- Cloud Flows (use Connection References, not direct connections)
```

Benefits:
- Connections managed per environment
- ALM-friendly (solution can move between environments)
- Easy to update connection without editing flows

---

## 6. Licensing

### 6.1 License Requirements

| Scenario | License Required | Notes |
|----------|-----------------|-------|
| Trigger on Dataverse, use Dataverse actions | Power Apps license (per user or per app) | Included with Power Apps |
| Use premium connectors (HTTP, SQL, custom) | Power Automate Premium | Per user or per flow |
| Unattended RPA | Power Automate per user with RPA + Unattended add-on | |
| AI Builder actions | AI Builder credits | 1M credits/user/month base |
| Standard connectors only | Microsoft 365 license | Free for standard |

### 6.2 Cost Optimization

| Strategy | Savings | Implementation |
|----------|---------|---------------|
| Use instant flows with Power Apps | Avoid per-flow license | Trigger from canvas app |
| Share service accounts | Reduce per-user licenses | One account per integration type |
| Scheduled vs. trigger | Reduce runs | Use trigger instead of polling |
| Filter at source | Reduce action calls | OData filter in Dataverse queries |

---

## 7. Development Steps

### 7.1 Pre-Development Checklist

- [ ] Identify trigger type (automated/scheduled/instant)
- [ ] Confirm all required connectors are DLP-approved
- [ ] Verify service account has necessary permissions
- [ ] Document expected inputs and outputs
- [ ] Identify error scenarios and handling strategy
- [ ] Confirm data volume (peak and average)

### 7.2 Building the Flow

**Step 1:** Create in a solution (never as a standalone flow)

**Step 2:** Name the flow with a consistent pattern:
```
[Project]_[Category]_[Trigger]_[Action]
Examples:
- HR_Automated_Onboarding_CreateRecords
- HR_Scheduled_Daily_SendReminders
- HR_Instant_Approve_Request
```

**Step 3:** Add trigger and configure
- For Dataverse triggers: always add a filter to reduce unnecessary runs
- Use "Scope" column filters when possible

**Step 4:** Build the main logic using scopes

```
[Trigger]
  |
  v
[Scope: Initialize Variables]
  |-->[Set variable: CorrelationId = guid()]
  |-->[Set variable: StartTime = utcNow()]
  |
  v
[Scope: Main Logic] (run after: is successful)
  |-->[Action 1]
  |-->[Action 2]
  |-->[Action 3]
  |
  v
[Scope: Success Cleanup] (run after: is successful)
  |-->[Update: Status = "Processed"]
  |-->[Log: Success]
  |
  v
[Scope: Error Handler] (run after: has failed, is skipped)
  |-->[Update: Status = "Error"]
  |-->[Log: Error details]
  |-->[Send notification]
```

**Step 5:** Add error handling
- Every flow MUST have error handling
- Use Configure run after settings
- Log errors to a custom table

**Step 6:** Add logging
- Track start/end times
- Log trigger record reference
- Capture error details

**Step 7:** Test thoroughly (see Section 8)

### 7.3 Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Flow name | [Project]_[Type]_[Trigger]_[Action] | HR_Auto_EmployeeCreate_SendWelcome |
| Scope names | [Purpose] in Title Case | Main Logic, Error Handler, Initialize |
| Action names | Verb + Object | Get Employee Record, Send Email |
| Variable names | camelCase | correlationId, retryCount |

---

## 8. Testing

### 8.1 Unit Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Happy path | Trigger with valid data | All steps succeed |
| Missing required field | Omit a required field | Graceful error, logged |
| Invalid data type | Pass wrong data type | Caught in validation |
| External API timeout | Simulate slow API | Retry logic works |
| External API error (4xx/5xx) | Force API error | Error handler catches |
| Duplicate trigger | Trigger same event twice | Idempotency works |
| Large payload | Maximum expected data volume | Performance acceptable |
| Empty payload | Zero records to process | Completes without error |

### 8.2 Integration Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| End-to-end with external system | Full data flow | Data correct in both systems |
| Auth token refresh | Let token expire | Flow continues working |
| DLP policy compliance | Check connector usage | No DLP violations |
| Parallel execution | Trigger multiple simultaneously | No race conditions |
| Connection failure | Disable connection | Error captured, notified |

### 8.3 Performance Testing

| Metric | Target | Test Method |
|--------|--------|-------------|
| Flow execution time | < 30 seconds | Run with typical payload |
| Consecutive runs | No throttling | Run 50x in rapid succession |
| Memory usage | No failures | Large dataset test |
| Retry behavior | Completes within 3 retries | Force intermittent failures |

### 8.4 Testing Checklist

- [ ] Happy path test passed
- [ ] Error handling test passed
- [ ] Edge cases tested (null, empty, max size)
- [ ] Security test (unauthorized access attempt)
- [ ] Performance test passed
- [ ] Integration test passed
- [ ] Monitored for 24 hours in test environment

---

## 9. Deployment

### 9.1 Packaging

1. Ensure flow is in a **managed solution**
2. Use **connection references** (not direct connections)
3. Use **environment variables** for configuration
4. Document all dependencies

### 9.2 Deployment Steps

| Step | Action | Verification |
|------|--------|-------------|
| 1 | Import managed solution | Solution imported successfully |
| 2 | Activate connection references | All connections show "Connected" |
| 3 | Verify environment variables | All variables set correctly |
| 4 | Turn on flow | Flow status = "On" |
| 5 | Run smoke test | Test trigger produces expected result |
| 6 | Verify monitoring | Alert rules active |

### 9.3 Post-Deployment

- Verify flow turned ON in production
- Confirm connection references are active
- Test with a live trigger event
- Monitor first 24 hours closely
- Confirm error logging table receiving entries

---

## 10. Monitoring

### 10.1 Key Metrics

| Metric | How to Monitor | Alert Threshold |
|--------|---------------|----------------|
| Flow failure rate | Power Automate Analytics | > 5% in 1 hour |
| Average run duration | Power Automate Analytics | > 2x baseline |
| Throttled runs | Power Platform Admin Center | Any throttling |
| Suspended flows | Power Automate portal | Any suspension |
| Connection failures | Flow run history | > 3 in 1 hour |

### 10.2 Alerting Setup

Configure alerts for:
1. Flow failures (> threshold)
2. Flow suspended
3. Connection broken
4. Unusually long execution times

Use the **Flow Run Log** custom table for historical analysis and reporting.

---

## 11. Risks and Anti-Patterns

### 11.1 Common Anti-Patterns

> **DO NOT:**

| Anti-Pattern | Risk | Fix |
|-------------|------|-----|
| No error handling | Silent failures, data loss | Add Try-Catch scopes |
| No logging | Cannot debug production issues | Log to custom table |
| Hardcoded values | Breaks across environments | Use environment variables |
| Personal account connections | Breaks when user leaves | Use service accounts |
| Infinite loops | Throttling, runaway costs | Add loop detection/counters |
| No idempotency | Duplicate records | Check before create |
| Unbounded "Apply to Each" | Timeouts, throttling | Batch processing, pagination |
| Sensitive data in outputs | Security breach | Use secure inputs/outputs |
| No timeout configuration | Runs indefinitely | Set action timeout |
| Untested error paths | Production surprises | Test every error scenario |

### 11.2 Risk Register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Flow throttling | High | Optimize queries, reduce frequency |
| Connector deprecation | Medium | Monitor connector health, abstraction layer |
| Service account lockout | High | Monitor account, exclusion policies |
| Dataverse API limits | Medium | Use batch operations, caching |
| Flow owner leaves | High | Use service accounts, transfer ownership |

---

## 12. MVP vs. Production

| Aspect | MVP Version | Production Version |
|--------|-------------|-------------------|
| Error handling | Basic email on failure | Structured logging, retry, alerts |
| Monitoring | Manual check | Automated dashboards, alerts |
| Documentation | Basic notes | Full runbook, architecture docs |
| Testing | Happy path only | Full test suite, edge cases |
| Security | Basic connections | Service accounts, Key Vault |
| Logging | Flow run history | Custom log table, correlation IDs |
| Scalability | Single-threaded | Batching, parallel processing |

---

## Appendix A: Quick Reference

### Common Expressions

| Purpose | Expression |
|---------|-----------|
| Current timestamp | `utcNow()` |
| Format date | `formatDateTime(utcNow(), 'yyyy-MM-dd')` |
| Parse JSON safely | Use "Parse JSON" action with schema |
| Null check | `empty(variables('varName'))` |
| Get GUID | `guid()` |
| Convert to string | `string(outputs('ActionName'))` |
| Coalesce | `coalesce(triggerBody()?['field'], 'default')` |

### Common Trigger Filters

| Scenario | Filter Expression |
|----------|------------------|
| Only specific entity | Column filter in trigger |
| Only specific status | Row filter: `status eq 'Active'` |
| Only specific user | `ownerid eq '[user-id]'` |
| Only recent records | `modifiedon ge @{addHours(utcNow(), -1)}` |
