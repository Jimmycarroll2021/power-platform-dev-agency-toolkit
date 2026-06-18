---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-automate/limits-and-config
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/
---

# Power Automate Comprehensive Guide

> **Version**: 1.1 | **Last updated**: 2026-06-19 | **Verified as of**: 2026-06-19 (platform state 2026-H1)
> **Applies to**: Power Automate Cloud Flows, Desktop Flows, Business Process Flows
> **Note**: Licensing details, connector lists, and service limits change frequently. Facts below carry inline Microsoft Learn citations where verified; anything that could not be confirmed from a primary Microsoft source is flagged inline as unverified. Always re-check against [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config) before production use.

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

The historical *plan-based* minimum-frequency caps (e.g. "15 minutes on seeded plans") have been **removed**. There are no longer plan-based limits on flow trigger frequency or on the number of runs; usage is now governed by Power Platform request limits tied to a flow's performance profile ([licensing types](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types), [request limits](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations)). The platform-wide minimum recurrence interval is **60 seconds** for every profile ([limits-and-config](https://learn.microsoft.com/en-us/power-automate/limits-and-config)).

| License | Min recurrence interval | Connector access | Notes |
|---------|------------------------|------------------|-------|
| Free / Seeded (M365) | 60 seconds (platform minimum) | Standard connectors only | Seeded plans can use premium/custom connectors only in-context of the licensing app ([deep dive](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/deep-dive-on-specific-license)) |
| Premium (per user) | 60 seconds | Standard, premium, custom | 40,000 Power Platform requests/user/24h ([request limits](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations#request-limits-in-power-automate)) |
| Process (per flow, capacity) | 60 seconds | Standard, premium, custom | 250,000 requests/license/24h, stackable up to 10 ([licensing types](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)) |

> Although there is no longer a hard plan-based minimum, Microsoft still recommends reducing trigger frequency where possible and using trigger conditions to avoid burning request capacity ([scheduled tasks](https://learn.microsoft.com/en-us/power-automate/run-scheduled-tasks)).

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
// Inbound HTTP requests (including the HTTP Request trigger) must return a
// response within 120 seconds (2 minutes) - confirmed by Microsoft Learn.
// Actions placed AFTER the response action continue running beyond this limit.
```
> Citation: inbound request timeout is **120 seconds (2 minutes)** ([limits-and-config — Timeout](https://learn.microsoft.com/en-us/power-automate/limits-and-config)).

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
# NOTE: There is NO `pac flow` command group in the Power Platform CLI.
# (Corrected against Microsoft Learn - the documented command groups are
#  admin, application, auth, canvas, catalog, code, connection, connector,
#  copilot, data, env, help, managed-identity, model, modelbuilder, package,
#  pages, pcf, pipeline, plugin, power-fx, solution, telemetry, test, tool.)
# Cloud flows are solution components, so manage/inspect them via solutions.

# List all solutions in the connected environment (flows live inside solutions)
pac solution list

# List solutions in a specific environment (URL or GUID accepted)
pac solution list --environment https://yourorg.crm.dynamics.com

# To enumerate the flows themselves, open the solution in make.powerapps.com,
# or use the Power Automate Management connector ("List flows as Admin") /
# Power Apps Admin PowerShell (Get-AdminFlow).
```
> Citations: pac command groups ([CLI command groups](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/)); `pac solution list` with `--environment` (URL or GUID) ([pac solution reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution)).

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

**Licensing Warning**: For cloud flows, one Process (per flow) license covers the flow it is assigned to **and its child flows** ([licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs)). If you license by user instead, the owner needs a Power Automate Premium license that covers the premium connectors used across the parent and its child flows.

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

Option 1: Default (exponential backoff)
  // The default policy depends on the flow's performance profile:
  //   Low profile:          up to 2 retries
  //   Medium / High profile: up to 12 retries
  // (NOT a fixed "4 retries" - corrected against Microsoft Learn)
Option 2: None (no retries)
Option 3: Fixed interval
  - Count: up to 90 (max retry attempts)
  - Interval: e.g. PT10S
Option 4: Exponential interval
  - Count: up to 90 (max retry attempts)
  - Minimum interval: PT5S (5 seconds is the platform minimum delay)
  - Maximum interval: e.g. PT1H (max retry delay is 1 day)

// Use for: HTTP calls to unreliable APIs, database operations
// Configurable limits: max retry attempts = 90, max delay = 1 day, min delay = 5 seconds
```
> Citations: default retry policy is **up to 2 retries (Low)** or **up to 12 retries (Medium/High)**; configurable **retry attempts max 90**, **maximum delay 1 day**, **minimum delay 5 seconds** ([limits-and-config — Retry policy](https://learn.microsoft.com/en-us/power-automate/limits-and-config)).

### 6.3 Timeout Configuration

```
On any action, click "..." > Settings > Timeout:
- PT30S = 30 seconds
- PT5M = 5 minutes
- PT1H = 1 hour
- P1D = 1 day

// Maximum flow run duration: 30 days (confirmed)
// Outbound asynchronous request timeout: configurable up to 30 days (confirmed)
// Outbound synchronous request timeout: 120 seconds (fixed, not configurable)
```
> Citations: run duration **30 days**; outbound async request **configurable up to 30 days**; outbound synchronous request **120 seconds** ([limits-and-config](https://learn.microsoft.com/en-us/power-automate/limits-and-config)).

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
1. Create Microsoft Entra ID user: svc-powerautomate-prod@tenant.onmicrosoft.com
   (Azure AD is now Microsoft Entra ID)
2. Assign a Power Automate Premium license (formerly "Power Automate per user")
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

// Default degree of parallelism: 1 (i.e. sequential) when concurrency is OFF
// When concurrency control is ON, set a value between 1 and 50 (max is 50)
// (Corrected: the default is 1, not 20.)
// Use with caution: connector/API limits still apply
```
> Citation: "Apply to each concurrency" default is **1**, configurable between **1 and 50** ([limits-and-config — Concurrency, looping, and debatching limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)).

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

**Critical licensing rule** (corrected against Microsoft Learn — it depends on the flow type):

- **Automated and scheduled flows** run in the background and use the **owner's** limits/entitlement. Only the **flow owner** needs a Power Automate Premium license for the premium connector — not every running user.
- **Instant (on-demand) flows** use the limits of the **user who runs them**. Every user who triggers such a flow needs a Power Automate Premium license.
- In either case, you can instead license the **flow itself** with a **Power Automate Process** capacity license (formerly "per flow"), which allows premium/custom connectors regardless of the owning or triggering user's license. The flow must be in a solution for a Process license to be assigned.

> Citations: "automated/scheduled flows always use the limits of the owner; instant flows use the limits of the account that started the process" ([request limits FAQ](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations#request-limits-in-power-automate), [licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs)); Process license premium-connector entitlement ([licensing types](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)).

### 10.2 Seeded vs Premium License Coverage

```
SEEDED (M365/E5) & FREE: Standard connectors generally
  Standard: SharePoint, Outlook, OneDrive, Teams, Excel Online, Planner,
            Forms, To Do, RSS, Notification, Office 365 Users
  // Seeded licenses CAN use premium/custom connectors, but only when the
  // flow runs in-context of (and is associated to) the app the seeded
  // license comes from. Standalone premium connector use needs Premium.

PREMIUM (or Process capacity) required for general use of:
  Dataverse, SQL, HTTP, Custom connectors, Azure services,
  Salesforce, Dynamics, premium third-party connectors
```
> Citation: seeded vs Premium/Process connector entitlements and the in-context exception for seeded licenses ([licensing types](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types), [seeded licenses deep dive](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/deep-dive-on-specific-license)). Authoritative standard-vs-premium designation per connector: [Connector reference](https://learn.microsoft.com/en-us/connectors/connector-reference/).

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
- Dedicated Windows Server/VM (self-hosted) OR a Microsoft-hosted machine
- Unattended RPA entitlement. This is delivered by a Power Automate PROCESS
  capacity license (each Process license bears one unattended bot, allocated
  to a machine), or a Hosted Process license for Microsoft-hosted RPA.
  (Specific per-bot list price unverified as of 2026-06-19 - confirm against
   Microsoft Learn / the Power Automate pricing page. The legacy standalone
   "unattended RPA add-on" has been folded into Process/Hosted Process.)
- Service account with appropriate permissions
- Machine registered in Power Automate machine runtime (registration
  requires a Power Automate Premium user)

Use when:
- Process runs overnight or on schedule
- No human intervention needed
- High volume batch processing
- Multiple processes need to run on same machine (concurrent bots)

Setup:
1. Register machine in Power Automate portal (done by a Premium user)
2. Allocate a Process license to the machine to provide the unattended bot
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

All values below are verified against [Microsoft Learn — Limits of automated, scheduled, and instant flows](https://learn.microsoft.com/en-us/power-automate/limits-and-config) unless flagged otherwise.

| Limit | Value | Notes |
|-------|-------|-------|
| Flow run duration | 30 days | Maximum; pending steps (e.g. approvals) time out after 30 days |
| Outbound async request timeout | Configurable up to 30 days | Limited by flow run duration |
| Outbound synchronous request / inbound request timeout | 120 seconds (2 min) | Fixed (HTTP trigger, instant flows) |
| Message size | **100 MB** | Corrected (was 256 MB). Whole payload, not just the file |
| Message size with chunking | 1 GB | For actions that support chunking |
| Actions per flow **definition** | **500** | Corrected. The 100,000 figure is Power Platform requests per 5 min, not actions per run. Use child flows beyond 500 |
| Power Platform requests | 100,000 per 5 min | Plus 24h limits by profile: 10k Low / 200k Medium / 500k High |
| Apply to each array items | 5,000 (Low) / 100,000 (others) | Per loop |
| Paginated items | 5,000 (Low) / 100,000 (others) | Trigger multiple runs for more |
| Apply to each concurrency (degree of parallelism) | **1 default, 1–50 configurable** | Corrected (default is 1, not 20; max 50) |
| Until loop iterations | **Default 60, max 5,000** | Corrected to add default |
| Concurrent runs (when Concurrency Control on) | 1–100 (default 25) | Off by default; turning on is irreversible |
| Allowed nesting depth for actions | 8 | Use child flows beyond 8 levels |
| Switch scope cases | 25 | Per Switch |
| Variables per workflow | 250 | Per flow definition |
| Characters per expression | 8,192 | Per expression |
| Expression evaluation limit | 131,072 characters | For @concat()/@base64()/@string() |
| Request URL character limit | 16,384 characters | |
| Variable size | (specific cap unverified as of 2026-06-19 — confirm against Microsoft Learn) | No explicit per-variable size limit is published on the limits-and-config page; effective size is bounded by message-size/content-throughput limits |
| Retry attempts (configurable) | **90** | Corrected (was 10). Max delay 1 day, min delay 5 s |
| Run retention in storage | **30 days** | Corrected. Flat 30 days regardless of license; the 90-day figure is the "no trigger activity" suspension window, not run-history retention |
| Custom connectors | 50 per user | 500 requests/min per connection |

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

*End of Power Automate Guide. Facts verified against Microsoft Learn as of 2026-06-19 (platform state 2026-H1). Limits and licensing change frequently — re-verify against current Microsoft documentation before production use.*

**Primary sources used for verification:**
- [Limits of automated, scheduled, and instant flows](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)
- [Requests limits and allocations](https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations)
- [Power Automate licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs)
- [pac solution CLI reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution)
- [pac CLI command groups](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/)
