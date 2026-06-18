# Power Automate Comprehensive Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Applies to**: Power Automate Cloud Flows, Desktop Flows, Business Process Flows
> **Needs verification against current Microsoft docs**: Licensing details, connector list, and limits change frequently.

---

## 1. Architecture Overview

```
+------------------+     +------------------+     +------------------+
|   Triggers       | --> |   Actions        | --> |   Connectors     |
|   (Start flow)   |     |   (Do work)      |     |   (External svc) |
+------------------+     +------------------+     +------------------+
        |                       |                        |
   Automated              Condition                  Dataverse
   Instant                Loop                       SharePoint
   Scheduled              Scope (try/catch)          SQL Server
   HTTP                   Compose                    Outlook
   Recurrence             Apply to each              Teams
                          Filter array               HTTP
                          Parse JSON                 Custom
```

---

## 2. Cloud Flow Types: Decision Matrix

| Scenario | Flow Type | Why |
|----------|-----------|-----|
| "When email arrives..." | Automated | Event-driven trigger |
| "When Dataverse row changes..." | Automated | Data-driven trigger |
| "User clicks button" | Instant (Power Apps/Vue) | User-initiated |
| "Every day at 9am" | Scheduled | Time-based |
| "External system calls API" | Instant (HTTP) | Webhook/API trigger |
| "When Teams message posted" | Automated | Connector trigger |

**Critical rule**: Always use solution-aware flows for production. Non-solution flows are bound to a user's My Flows and get deleted when the user leaves.

---

## 3. Triggers Deep Dive

### 3.1 Dataverse Trigger Patterns

```
// CORRECT: Narrow trigger with filter condition
Trigger: When a row is added, modified or deleted
  - Change type: Created
  - Table name: Accounts
  - Scope: Organization
  - Filter rows: statuscode eq 1 AND createdon gt @{addDays(utcNow(), -7)}
  - Select columns: name, statuscode, ownerid

// WRONG: Broad trigger with no filtering
Trigger: When a row is added, modified or deleted
  - Change type: Created or Modified
  - Table name: Accounts
  - Scope: Organization
  // NO FILTER - fires on every change, causes loops
```

**Trigger Conditions** (prevent unnecessary runs):
```
// Only trigger when status changes to "Approved"
@equals(triggerOutputs()?['body/statuscode'], '1')

// Only trigger for records owned by specific team
@equals(triggerOutputs()?['body/_ownerid_value'], 'GUID-HERE')
```

### 3.2 Recurrence (Scheduled) Triggers

| License | Min Frequency | Notes |
|---------|--------------|-------|
| Seeded (M365) | 15 minutes | Limited to standard connectors |
| Premium | 1 minute | Full connector access |
| Per Flow | 1 minute | Dedicated throughput |

```
Recurrence pattern for "business hours only":
- Frequency: Hour
- Interval: 1
- Start time: 2025-01-15T08:00:00Z
- Time zone: GMT Standard Time
- On these days: Monday, Tuesday, Wednesday, Thursday, Friday

// Always add a condition inside to double-check business hours
Condition: dayOfWeek(utcNow()) is not equal to 6 (Sunday)
```

### 3.3 HTTP Trigger (Webhook Pattern)

```
// HTTP Request trigger - use for external system callbacks
Trigger: When a HTTP request is received
  - Who can trigger: Anyone (use API key or Azure AD auth)
  - HTTP POST URL: (auto-generated)

// Response action - REQUIRED if caller expects response
Response:
  - Status code: 200
  - Body: {"status": "received", "id": "@{triggerBody()['id']}"}

// Important: Add Response BEFORE long-running actions
// HTTP triggers timeout after 120 seconds if no Response
```

---

## 4. Solution-Aware Flows (CRITICAL)

### Why Solution-Aware?

| Aspect | My Flows (Personal) | Solution-Aware |
|--------|--------------------|----------------|
| Ownership | Individual user | Environment/solution |
| ALM | Manual export/import | Proper lifecycle |
| Sharing | Limited | Role-based |
| Connection References | Not supported | Supported |
| Environment Variables | Not supported | Supported |
| When user leaves | DELETED | Persists |

### How to Create Solution-Aware Flows

```
1. Go to make.powerapps.com (NOT flow.microsoft.com)
2. Select your Solution
3. Click "New" > "Automation" > "Cloud flow" > "Automated"
4. Build your flow
5. ALWAYS use connection references (not personal connections)
```

**Command-line check**:
```bash
# List flows in environment (solution-aware shown with solution name)
pac flow list

# List flows in a solution
pac solution list --environment https://yourorg.crm.dynamics.com
```

---

## 5. Child Flows and Reusable Patterns

### 5.1 Child Flow Pattern (Call from Parent)

**Child Flow** (reusable component):
```
Trigger: Manually trigger a flow (V2)
  Inputs:
    - recipientEmail (Text, required)
    - subject (Text, required)
    - body (Text, required)
    - priority (Text, default: "normal")

Actions:
1. Send an email (V2) - Outlook
   - To: triggerBody()['recipientEmail']
   - Subject: triggerBody()['subject']
   - Body: triggerBody()['body']
   - Importance: triggerBody()['priority']

2. Respond to a Power App or flow
   - statusCode: 200
   - body: {"sendStatus": "success", "sentTo": "@{triggerBody()['recipientEmail']}"}
```

**Parent Flow** (calling):
```
1. When a row is modified (Dataverse)
2. Run a Child Flow
   - Child flow: "Send Notification Email"
   - recipientEmail: outputs('Get_account')?['body/emailaddress1']
   - subject: Your case has been updated
   - body: HTML template with dynamic values
   - priority: if(equals(outputs('Get_case')?['body/prioritycode'], '1'), 'high', 'normal')
```

**Licensing Warning**: Child flows run in the caller's context. The calling flow's owner must have a premium license that covers both flows.

### 5.2 Reusable Error Handling Pattern

Create a child flow called "Error Logger":
```
Trigger: Manually trigger a flow
  Inputs:
    - flowName (Text)
    - errorMessage (Text)
    - errorDetails (Text)
    - runId (Text)

Actions:
1. Add a row into a table (Dataverse - Error Log table)
   - Flow Name: triggerBody()['flowName']
   - Error Message: triggerBody()['errorMessage']
   - Error Details: triggerBody()['errorDetails']
   - Run ID: triggerBody()['runId']
   - Timestamp: utcNow()

2. Post message in chat or channel (Teams)
   - Post to: Flow Errors channel
   - Message: "Flow [name] failed. Error: [message]. Run ID: [runId]"
```

---

## 6. Error Handling, Retry Policies, and Timeouts

### 6.1 Scope Pattern (Try/Catch/Finally)

```
Main Scope: "Try"
  - All your main actions go here

Catch Scope: "Catch" (configure run after: has failed, is skipped)
  - Get the error details:
    Compose: result('Try')
  - Parse JSON to extract error
  - Call Error Logger child flow
  - Send alert email

Finally Scope: "Finally" (configure run after: has failed, is successful, is skipped)
  - Cleanup actions
  - Log completion
```

**Exact configuration**:
```
Scope "Catch":
  Click "..." on scope > Configure run after
  [x] has failed
  [x] is skipped
  [ ] is successful
  [ ] has timed out

Scope "Finally":
  Click "..." on scope > Configure run after
  [x] has failed
  [x] is successful
  [x] is skipped
  [x] has timed out
```

### 6.2 Retry Policies

```
On any action, click "..." > Settings > Retry Policy:

Option 1: Default (4 retries, exponential backoff)
Option 2: None (no retries)
Option 3: Fixed interval
  - Count: 5
  - Interval: 10 (seconds)
Option 4: Exponential interval
  - Count: 5
  - Interval: 5 (seconds)
  - Minimum interval: 5
  - Maximum interval: 60

// Use for: HTTP calls to unreliable APIs, database operations
```

### 6.3 Timeout Configuration

```
On any action, click "..." > Settings > Timeout:
- PT30S = 30 seconds
- PT5M = 5 minutes
- PT1H = 1 hour
- P1D = 1 day

// Maximum flow run duration: 30 days
// Individual action timeout: up to 30 days (but limited by flow timeout)
```

---

## 7. Connection References and Environment Variables

### 7.1 Connection Reference Setup (Step by Step)

```
Step 1: In your solution, click New > Connection Reference
Step 2: Name: "cr_SHARED_DATAVERSE" (use consistent naming: prefix_CONNECTOR_PURPOSE)
Step 3: Connector: Microsoft Dataverse
Step 4: Click Create
Step 5: When prompted, create/select connection for current environment
Step 6: In your flow, use the connection reference (not "create new connection")
```

### 7.2 Environment Variable Setup

```
// Create environment variable in solution
Name: ev_SharePointSiteUrl
Display name: SharePoint Site URL
Data type: Text
Default value: https://tenant.sharepoint.com/sites/dev-site

// Current value (set per environment after import):
Value: https://tenant.sharepoint.com/sites/prod-site

// Use in flow:
SharePoint actions will offer the environment variable in dropdowns
Or use: @{parameters('ev_SharePointSiteUrl (text)')}
```

### 7.3 Connection Reference Naming Convention

```
Format: {publisher prefix}_{CONNECTOR}_{PURPOSE}

Examples:
  cr_SHARED_DATAVERSE       (shared Dataverse connection)
  cr_SHARED_SHAREPOINT      (shared SharePoint connection)
  cr_SHARED_OUTLOOK         (shared Outlook connection)
  cr_SERVICEBUS_QUEUES      (dedicated Service Bus connection)
  cr_SQL_PRODUCTION         (dedicated SQL connection)
```

---

## 8. Service Account Best Practices

### 8.1 Why Service Accounts?

| Problem | Solution |
|---------|----------|
| Flow breaks when employee leaves | Use service account |
| "Who owns this?" confusion | Named service account per environment |
| License compliance audit | Trackable dedicated account |
| Permission changes | Service account has consistent permissions |

### 8.2 Service Account Setup

```
1. Create Azure AD user: svc-powerautomate-prod@tenant.onmicrosoft.com
2. Assign Power Automate Per User license
3. Add to required security groups
4. Assign Dataverse security role (e.g., "Flow Service Account")
5. Login as service account once to activate license
6. Create connections in each environment using service account
7. Use connection references pointing to service account connections
8. Document in service account registry
```

### 8.3 DO NOT DO (Critical Warnings)

```
DO NOT:
[X] Use your personal account for production flows
[X] Use an employee's account (leaves = broken flows)
[X] Share passwords for service accounts
[X] Use service accounts with MFA (use conditional access instead)
[X] Forget to license service accounts
[X] Use different accounts across environments (use consistent naming)
[X] Forget to set "run-only" permissions correctly
```

---

## 9. Performance Optimization

### 9.1 Array/Loop Performance

```
// SLOW: Apply to each with API call inside
Apply to each: items
  -> Create item in SharePoint  // 100 items = 100 API calls

// FAST: Batch processing (if connector supports it)
// Option 1: Send batch HTTP request
// Option 2: Use "Create new row" with batch (Dataverse)
// Option 3: Use "Send an HTTP request to SharePoint" with $batch

// FAST: Use "Filter array" and "Select" before loops
Filter array: status eq 'active'    // Reduce items first
Select: extract only needed fields  // Reduce payload
Apply to each: filtered results
```

### 9.2 Concurrency Control

```
Apply to each loop:
  Click "..." > Settings
  Concurrency control: ON
  Degree of parallelism: 10

// Default: 20 concurrent (if not set)
// Maximum: 50
// Use with caution: API limits still apply
```

### 9.3 Avoiding Common Bottlenecks

```
1. Don't initialize variables inside loops
2. Don't use "Apply to each" when "Select" + single action works
3. Use "Filter array" before loops to reduce iterations
4. Enable pagination on triggers that support it
5. Use "Get items" with OData filter instead of "Apply to each" + condition
6. For Dataverse: always use "List rows" with $filter, not client-side filtering
```

---

## 10. Premium Connector List and Licensing

### 10.1 Common Premium Connectors (Requiring Premium License)

| Connector | Use Case | Notes |
|-----------|----------|-------|
| Microsoft Dataverse | CRUD operations | Core to most projects |
| SQL Server | Database access | On-prem needs gateway |
| HTTP / HTTP + Swagger | Custom API calls | Very commonly needed |
| Azure Blob Storage | File storage | Includes triggers |
| Azure Service Bus | Message queuing | Enterprise patterns |
| Salesforce | CRM integration | Per-user licensing |
| Dynamics 365 | ERP integration | Module-specific |
| Custom Connectors | Internal APIs | ALL custom = premium |
| Adobe PDF Services | Document manipulation | Pay per use |
| DocuSign / Adobe Sign | E-signatures | Per-service licensing |

**Critical licensing rule**: If a flow uses ONE premium connector, EVERY user who:
- Owns the flow
- Triggered the flow
- Is referenced in the flow (approvals, mentions)

needs a premium license OR the flow must be licensed with Per Flow license.

### 10.2 Seeded vs Premium License Coverage

```
SEEDED (M365/E5): Works with standard connectors only
  Standard: SharePoint, Outlook, OneDrive, Teams, Excel Online, Planner,
            Forms, To Do, Yammer, RSS, Notification, Office 365 Users

PREMIUM: Required for
  Dataverse, SQL, HTTP, Custom connectors, Azure services,
  Salesforce, Dynamics, premium third-party connectors
```

---

## 11. Desktop Flows: Attended vs Unattended

### 11.1 Attended RPA

```
Requirements:
- Windows 10/11 machine
- Power Automate Desktop installed
- User logged in (screen can be locked but session active)
- Premium license for the user

Use when:
- User is present to handle exceptions
- Process needs human decision points
- Volume is low/interactive
- Legacy UI is simple and stable
```

### 11.2 Unattended RPA

```
Requirements:
- Dedicated Windows Server/VM
- Unattended RPA bot license ($150/bot/month)
- Service account with appropriate permissions
- Machine registered in Power Automate machine runtime

Use when:
- Process runs overnight or on schedule
- No human intervention needed
- High volume batch processing
- Multiple processes need to run on same machine (concurrent bots)

Setup:
1. Register machine in Power Automate portal
2. Assign unattended bot license
3. Create desktop flow
4. Create cloud flow that calls desktop flow with "Run a flow built by Power Automate Desktop"
5. Configure machine group for HA
```

### 11.3 RPA Best Practices

```
DO:
[+] Use "Wait for window" actions before interactions
[+] Take screenshots on failure for debugging
[+] Use credential vault (never hardcode passwords)
[+] Build modular subflows for reusable components
[+] Handle popups and unexpected dialogs
[+] Use "If window exists" before assuming UI state
[+] Test on target machine resolution

DO NOT:
[X] Build selectors that rely on dynamic IDs
[X] Assume window is always in same position
[X] Run unattended on machines that auto-update/restart
[X] Skip error handling
[X] Use personal credentials in flows
```

---

## 12. Common Patterns with Examples

### 12.1 Approval Pattern with Escalation

```
Trigger: When a row is created (Dataverse - Expense Claims)

1. Update row: Status = "Pending Approval"

2. Start and wait for an approval
   - Approval type: Approve/Reject - First to respond
   - Title: "Expense claim from @{outputs('Get_user')?['body/fullname']}"
   - Assigned to: @{outputs('Get_user')?['body/_managerid_value']}
   - Details: Amount, date, reason
   - Item link: Link to model-driven app record
   - Timeout: P3D (3 days)

3. Condition: outcome equals 'Approve'
   If yes:
     4a. Update row: Status = "Approved"
     4b. Send email to submitter: approved
   If no:
     4c. Update row: Status = "Rejected"
     4d. Send email to submitter: rejected with comments

// Escalation branch (configure run after: has timed out)
5. Scope "Escalation":
   Run after: Start and wait... has timed out
   5a. Start and wait for an approval (to manager's manager)
   5b. Update based on outcome
```

### 12.2 Bulk Data Processing Pattern

```
Trigger: Recurrence (daily at 2 AM)

1. List rows (Dataverse - Pending sync items)
   - $filter: statuscode eq 100000000
   - $top: 1000
   - Pagination: ON (10k items)

2. Select: Map to target format
   From: value
   Map:
     customerId: _customerid_value
     amount: estimatedvalue
     currency: transactioncurrencyid

3. Parse JSON: validate format

4. HTTP POST to external API
   - Batch endpoint if available
   - Otherwise: Apply to each with concurrency = 10

5. Update source rows: status = "Synced"
   // Use batch update via Dataverse API for performance

6. Send completion summary email
```

### 12.3 Error Handling + Notification Pattern

```
Every production flow should have this structure:

Scope "Main Logic"
  [All business logic here]

Scope "On Error" (run after Main Logic has failed)
  1. Compose: result('Main Logic')
  2. Parse JSON: extract error details
  3. Add row to Error Log table (Dataverse)
     - Flow name: workflow()
     - Run ID: workflow()['run']['name']
     - Error message: body('Parse_JSON')?['error/message']
     - Stack trace: body('Parse_JSON')?['error/stackTrace']
     - Timestamp: utcNow()
  4. Post to Teams: alert with Run ID link
  5. Send email to: admin@company.com

Scope "On Success" (run after Main Logic is successful)
  1. Add row to Audit Log: success
```

---

## 13. JSON Parsing and Data Manipulation

### 13.1 Parse JSON Pattern

```
1. HTTP action or trigger returns JSON
2. Parse JSON action:
   Content: body('HTTP_action') or triggerBody()
   Schema: Use "Generate from sample" with actual payload

// Common schema for Dataverse response:
{
  "type": "object",
  "properties": {
    "value": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "accountid": {"type": "string"},
          "name": {"type": "string"},
          "emailaddress1": {"type": "string"}
        }
      }
    }
  }
}
```

### 13.2 Common Expressions

```
// Get current timestamp
@{utcNow()}

// Format date
@{formatDateTime(utcNow(), 'yyyy-MM-dd')}

// Add days
@{addDays(utcNow(), 7)}

// Get property from object (null-safe)
@{coalesce(triggerBody()?['field'], 'default')}

// Check if array has items
@{not(empty(body('List_rows')?['value']))}

// Get first item
@{first(body('List_rows')?['value'])?['name']}

// Filter array inline
@{body('Filter_array')}

// Join array to string
@{join(variables('emailList'), ';')}

// Create GUID
@{guid()}
```

---

## 14. Flow Limits Summary

| Limit | Value | Notes |
|-------|-------|-------|
| Flow run duration | 30 days | Maximum |
| Action timeout | 30 days (configurable) | But limited by flow duration |
| Message size | 256 MB | With chunking |
| File size (chunked) | 1 GB | Via chunking |
| Actions per flow run | 100,000 | Hard limit |
| List rows page size | 5,000 | Use pagination for more |
| Maximum list rows | 100,000 | With pagination |
| Apply to each concurrency | 50 | Default 20 |
| Until loop iterations | 5,000 | Hard limit |
| Branch nesting | 8 levels | Nested conditions |
| Expression length | 8,192 characters | |
| Variable size | 209 MB | |
| Retry count | 10 | Configurable per action |
| Retention period | 30 days (free) / 90 days (premium) | Run history |

---

## 15. Migration Checklist

```
Before go-live, verify:
[ ] All flows are solution-aware
[ ] All connections use connection references
[ ] All environment-specific values use env variables
[ ] Service accounts own all production flows
[ ] Error handling scopes are in place
[ ] Retry policies configured for external APIs
[ ] Run-only permissions set correctly
[ ] DLP policies allow required connectors
[ ] Flow owners have appropriate licenses
[ ] No hardcoded emails or IDs
[ ] Approval timeout and escalation configured
[ ] Child flows tested independently
[ ] Bulk operations tested with production data volumes
[ ] Desktop flows tested on target machine
[ ] Screenshots configured for RPA failures
[ ] Run history review process documented
```

---

*End of Power Automate Guide. Verify all limits and licensing against current Microsoft documentation before production use.*
