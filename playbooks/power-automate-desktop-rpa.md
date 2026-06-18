# Power Automate Desktop RPA Playbook

> **Complexity Rating:** High
> **Last Updated:** 2024
> **Applies To:** Power Automate Desktop, Attended and Unattended RPA

---

## 1. When to Use Desktop RPA

Use Power Automate Desktop RPA when:

| Scenario | Example |
|----------|---------|
| Legacy application with no API | Green-screen terminal app, old Windows app |
| Web application with no API | Legacy web portal, no REST endpoints |
| Cross-application data transfer | Copy data from App A to App B |
| Repetitive UI-based task | Daily data entry, form filling |
| File-based processing | Read Excel, process, update system via UI |
| Citrix/Remote desktop automation | Applications accessed via virtual desktop |
| Desktop application integration | Thick client software automation |

### Decision Matrix

| Factor | Use Desktop RPA | Use Cloud Flow Instead |
|--------|----------------|----------------------|
| Application type | No API available | API/REST available |
| Interaction type | UI-based required | Data-based sufficient |
| Trigger type | User-initiated or scheduled | Event-driven preferred |
| Stability of UI | Stable, rarely changes | N/A (API-based) |
| Volume | Moderate (hundreds/day) | High (thousands/day) |
| Error tolerance | Can handle some manual review | Fully automated |

---

## 2. When NOT to Use Desktop RPA

> **DO NOT use Desktop RPA when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| API is available | Cloud Flow + HTTP connector | Reliable, scalable, maintainable |
| High volume (>1000/day) | Cloud Flow or Azure Functions | Performance, cost, reliability |
| Real-time processing needed | Cloud Flow or API | RPA has inherent latency |
| UI changes frequently | API integration | RPA breaks with UI changes |
| Unstable application | API or database integration | RPA is brittle |
| Complex decision-making | Custom application or service | RPA is for repetitive tasks |
| Multi-machine coordination | Cloud Flow + queue pattern | Easier orchestration |
| Sensitive credential handling | Azure Key Vault + managed identity | Better security |

---

## 3. Attended vs. Unattended

### 3.1 Comparison

| Aspect | Attended RPA | Unattended RPA |
|--------|-------------|----------------|
| **Trigger** | User-initiated (button click) | Scheduled or event-triggered |
| **Machine** | User's workstation | Dedicated VM/Robot machine |
| **Interaction** | User may need to interact | Fully autonomous |
| **License** | Power Automate per user | Power Automate per user + Unattended add-on |
| **Cost** | Lower | Higher (VM + unattended license) |
| **Scalability** | Limited by user count | Scale with VM count |
| **Monitoring** | User observes | Requires robust logging |
| **Use case** | Assist user with task | Background batch processing |
| **Error handling** | User can intervene | Must be fully automated |

### 3.2 Decision Tree

```
NEED DESKTOP AUTOMATION
       |
       v
Does a user need to interact during the process?
   |--YES--> USE: Attended RPA
   |           - User triggers flow
   |           - May need to handle popups/decisions
   |           - Runs on user's machine
   |
   |--NO--> Does it need to run outside business hours?
               |--YES--> USE: Unattended RPA
               |           - Runs on dedicated VM
               |           - Scheduled or event-triggered
               |           - Fully autonomous
               |
               |--NO--> Could it be a cloud flow?
                           |--YES--> USE: Cloud Flow (preferred)
                           |--NO---> USE: Attended RPA (user-triggered)
```

---

## 4. Machine Setup

### 4.1 Unattended RPA Machine Requirements

| Specification | Minimum | Recommended |
|--------------|---------|-------------|
| OS | Windows 10/11 Pro or Enterprise | Windows 11 Enterprise |
| RAM | 8 GB | 16 GB |
| CPU | 4 cores | 8 cores |
| Disk | 128 GB SSD | 256 GB SSD |
| Network | 10 Mbps | 100 Mbps |
| Resolution | 1920x1080 | 1920x1080 |
| .NET Framework | 4.7.2+ | Latest |
| Power Automate Desktop | Latest | Latest |

### 4.2 Machine Configuration

| Setting | Configuration | Notes |
|---------|--------------|-------|
| Auto-login | Enabled | For unattended execution |
| Screen lock | Disabled | RPA needs unlocked session |
| Power settings | Never sleep | Prevents interruption |
| Windows updates | Scheduled maintenance window | Coordinate with RPA schedule |
| Screen resolution | Fixed | Prevent UI element position changes |
| UAC | Disabled or configured | Prevent dialog interruptions |
| Antivirus exclusions | PAD process, target apps | Prevent interference |

### 4.3 Software Installation

1. Install Power Automate Desktop (latest version)
2. Sign in with service account
3. Register machine in Power Automate portal
4. Install all required target applications
5. Configure application shortcuts consistently
6. Test all applications launch and run correctly

### 4.4 Machine Group Setup

For scaling unattended RPA:

```
Machine Group: "Invoice-Processing-Bots"
  |
  +-- VM-BOT-01 (Primary)
  +-- VM-BOT-02 (Secondary)
  +-- VM-BOT-03 (Overflow)
  
Queue: "Invoice-Processing-Queue"
  |
  +-- Cloud Flow: Add items to queue
  +-- Desktop Flow: Process items from queue
```

---

## 5. Credential Management

### 5.1 Credential Types

| Credential Type | Storage | Use For | Security Level |
|----------------|---------|---------|---------------|
| Windows login | Azure AD | Machine auto-login | High |
| Application login | Credential Vault (PAD) | App authentication | Medium |
| API key | Azure Key Vault | External API calls | High |
| Database password | Credential Vault (PAD) | Database connections | Medium |

### 5.2 Credential Vault Setup

**DO NOT:**
- Hardcode credentials in desktop flows
- Store credentials in text files or Excel
- Share credential vault entries between flows unnecessarily
- Use personal accounts for unattended automation

**DO:**
- Use Power Automate credential vault
- Use Azure Key Vault for sensitive credentials
- Rotate credentials quarterly
- Use service accounts with minimal privileges
- Audit credential access regularly

### 5.3 Setting Up Credentials

```
1. Power Automate Portal > Credentials
2. Click "New credential"
3. Enter:
   - Credential name: [AppName]_[Username]
   - Username: service account
   - Password: [secure password]
4. Assign to appropriate desktop flow
5. Test credential works in target application
```

---

## 6. Error Handling

### 6.1 Error Handling Strategy

Every desktop flow MUST include:

1. **Try-Catch blocks** around each major section
2. **Screenshot on error** for debugging
3. **Retry logic** for transient failures
4. **Graceful exit** that closes all opened applications
5. **Error logging** to cloud (Dataverse or SharePoint)

### 6.2 Error Handling Pattern

```
[Main Flow Structure]
  |
  +-- [Block: Initialize]
  |     +-- Set variables
  |     +-- Launch required applications
  |     +-- Verify applications loaded
  |
  +-- [Block: Process Data] (OnError: GoTo Cleanup)
  |     +-- Loop through records
  |     +-- For each record:
  |           +-- [Block: Process Single Record] (OnError: Continue)
  |                 +-- Extract data
  |                 +-- Enter data in application
  |                 +-- Verify submission
  |                 +-- Log success
  |           +-- On error: Log failure, take screenshot, continue
  |
  +-- [Block: Cleanup] (Always run)
        +-- Save any pending work
        +-- Close all applications
        +-- Release locks
        +-- Report completion status
```

### 6.3 Error Recovery Actions

| Error Type | Recovery Action | Log Entry |
|-----------|----------------|-----------|
| Application not found | Retry launch (3x), then fail | "App launch failed" |
| Element not found | Refresh page, retry find (3x) | "Element not found after retry" |
| Timeout | Extend timeout, retry | "Timeout extended" |
| Invalid data | Skip record, log error | "Invalid data: [details]" |
| Application crash | Restart application, resume | "App crashed, restarted" |
| Credential failure | Alert admin, halt processing | "Auth failed: [app]" |

### 6.4 Error Logging to Cloud

Send error details to a centralized location:

```
[On Error]
  |
  +-- [Take Screenshot] --> Save to shared folder
  +-- [Run Cloud Flow: Log Error]
        |-- Machine Name: %ComputerName%
        |-- Flow Name: [desktop flow name]
        |-- Error Message: [error details]
        |-- Screenshot Path: [path]
        |-- Timestamp: [now]
        |-- Record being processed: [record ID]
```

---

## 7. Development Best Practices

### 7.1 Flow Organization

| Practice | Recommendation |
|----------|---------------|
| Subflows | Break into logical subflows (Login, Process, Logout) |
| Naming | Descriptive names: "Launch ERP", "Enter Invoice Data" |
| Variables | Use descriptive names: `currentInvoiceNumber` not `x` |
| Comments | Comment every major block |
| Constants | Use variables for URLs, timeouts, retry counts |

### 7.2 UI Element Management

| Practice | Recommendation |
|----------|---------------|
| Anchors | Use reliable anchor elements for relative positioning |
| Selectors | Use multiple attributes (not just position) |
| Waits | Always add "Wait for element" before interaction |
| Fallbacks | Have backup selectors for critical elements |
| UI Repository | Centralize UI element definitions |

### 7.3 Reliability Patterns

| Pattern | Implementation |
|---------|---------------|
| Wait-and-retry | Wait 2s, retry 3x before failing |
| Health check | Verify application responsive before each step |
| State verification | Confirm expected screen before acting |
| Screenshot audit | Screenshot before/after critical actions |
| Graceful shutdown | Close all apps even on failure |

---

## 8. Testing

### 8.1 Testing Checklist

| Test | Method | Pass Criteria |
|------|--------|--------------|
| Happy path | Run with valid data | All steps complete successfully |
| Invalid data | Run with malformed data | Error caught, logged, flow continues |
| Application not responding | Kill target app mid-flow | Error handling triggers, cleanup runs |
| Slow application | Add artificial delays | Flow waits appropriately |
| Wrong starting state | Start with app already open | Flow handles gracefully |
| Large dataset | Process 100+ records | No memory leaks, stable performance |
| Credential failure | Use wrong password | Auth error detected, admin alerted |
| Screen resolution change | Run at different resolution | Elements still found |
| Locked machine (attended) | Lock machine mid-flow | Appropriate error |

### 8.2 Performance Baselines

| Metric | Target | Measurement |
|--------|--------|-------------|
| Single transaction time | < 2 minutes | Average over 10 runs |
| 100-record batch | < 30 minutes | Total elapsed time |
| Memory usage | < 2 GB | Peak during execution |
| CPU usage | < 80% | Average during execution |
| Error rate | < 2% | Over 100 transactions |

---

## 9. Deployment

### 9.1 Deployment Steps

| Step | Action | Verification |
|------|--------|-------------|
| 1 | Export desktop flow from dev machine | .robin file or solution export |
| 2 | Import to target machine | Flow appears in PAD |
| 3 | Configure credentials on target | Credentials test successfully |
| 4 | Test on target machine | Full test run passes |
| 5 | Register machine in cloud portal | Machine shows "Available" |
| 6 | Configure cloud flow trigger | Trigger test works |
| 7 | Schedule (if unattended) | Runs on schedule |
| 8 | Monitor first runs | Success rate acceptable |

### 9.2 Version Management

| Version | Action | Notes |
|---------|--------|-------|
| Update flow | Export new version, import to machines | Test before production |
| Rollback | Restore previous .robin file | Keep last 3 versions |
| Breaking UI change | Update selectors, retest fully | May need co-development with app team |

---

## 10. Monitoring

### 10.1 Key Metrics

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| Success rate | Cloud flow run history | < 95% |
| Average run time | Desktop flow analytics | > 2x baseline |
| Machine availability | Machine registration status | Offline > 15 min |
| Queue depth | Cloud flow queue | > 50 items |
| Error types | Error log | New error pattern |

### 10.2 Dashboard

Create a Power BI dashboard tracking:
- Daily success/failure counts
- Average processing time by record type
- Machine utilization
- Error breakdown by type
- Queue depth over time

---

## 11. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| UI changes break automation | High | Regular health checks, flexible selectors |
| Application updates | High | Test environment, change notifications |
| Machine failure | High | Machine groups, redundancy |
| Credential expiration | High | Calendar reminders, automated rotation |
| License cost escalation | Medium | Optimize flow count, attended vs unattended |
| Scalability limits | Medium | Machine groups, queue-based processing |
| Security (screen scraping) | Medium | Secure machines, credential vault, audit |

---

## 12. Licensing

| Component | License Required | Cost ( indicative) |
|-----------|-----------------|-------------------|
| Power Automate Desktop (attended) | Windows 10/11 license (free) | Included with OS |
| Attended RPA (cloud orchestration) | Power Automate per user | ~$15/user/month |
| Unattended RPA add-on | Power Automate per user + Unattended add-on | ~$150/bot/month |
| Hosted RPA (Microsoft-hosted VM) | Per bot license | Additional cost |

> **WARNING:** Unattended RPA licensing changed significantly in 2023. Verify current pricing. Each unattended bot requires both a base license AND an unattended add-on.
