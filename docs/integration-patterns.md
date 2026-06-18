# Integration Patterns Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Common integration patterns for Power Platform connecting to external systems.
> **Needs verification against current Microsoft docs**: API versions, connector capabilities, and service limits change frequently.

---

## 1. Microsoft Graph API Patterns

### 1.1 Authentication

```
Microsoft Graph requires Azure AD app registration:

Step 1: Azure AD > App Registrations > New
  Name: PowerPlatform-Graph

Step 2: API Permissions:
  - User.Read.All (read user profiles)
  - Group.Read.All (read groups)
  - Mail.Send (send emails)
  - Calendar.Read (read calendars)
  - TeamsActivity.Send (Teams notifications)

Step 3: Grant admin consent

Step 4: Get credentials:
  Application (client) ID
  Client secret (or certificate)
  Tenant ID

Step 5: Use in Power Automate:
  HTTP action > Authentication: Active Directory OAuth
  Tenant: (tenant ID)
  Audience: https://graph.microsoft.com
  Client ID: (application ID)
  Credential Type: Secret
  Secret: (client secret)
```

### 1.2 Common Graph Patterns

```
Pattern 1: Get user's manager
  GET https://graph.microsoft.com/v1.0/users/{email}/manager
  Use: Approval routing, escalation chains

Pattern 2: Get group members
  GET https://graph.microsoft.com/v1.0/groups/{id}/members
  Use: Bulk notifications, team-based access

Pattern 3: Send email via Graph (bypasses mailbox limits)
  POST https://graph.microsoft.com/v1.0/users/{from}/sendMail
  Body: { message: { subject, body, toRecipients } }
  Use: High-volume email, shared mailboxes

Pattern 4: Create Teams meeting
  POST https://graph.microsoft.com/v1.0/users/{id}/onlineMeetings
  Body: { startDateTime, endDateTime, subject }
  Use: Auto-create meetings from case scheduling

Pattern 5: Check user license
  GET https://graph.microsoft.com/v1.0/users/{id}/licenseDetails
  Use: License compliance checks
```

### 1.3 Graph Pagination

```
Graph API returns paged results:

Response includes:
  "@odata.nextLink": "https://graph.microsoft.com/v1.0/users?$skiptoken=..."

Handle in flow:
  1. Initial HTTP call
  2. Parse results
  3. Check for @odata.nextLink
  4. If present, loop to get next page
  5. Aggregate all results

Implementation:
  Initialize: nextLink = "https://graph.microsoft.com/v1.0/users"
  Until: empty(nextLink)
    HTTP GET: nextLink
    Append to array: body.value
    Set nextLink: body.@odata.nextLink
```

---

## 2. REST API Integration

### 2.1 Generic REST Pattern

```
Power Automate HTTP connector (premium):

Configuration:
  Method: GET/POST/PUT/PATCH/DELETE
  URI: https://api.example.com/v1/resource
  Headers: Content-Type: application/json
  Body: JSON payload
  Authentication: API Key, OAuth, Basic, or AD OAuth

Best practices:
  - Store base URL in environment variable
  - Use connection reference (not hardcoded)
  - Implement retry logic
  - Handle 4xx and 5xx errors
  - Set timeout appropriately
  - Log all API calls for debugging
```

### 2.2 REST Error Handling Pattern

```
Scope "API Call"
  HTTP action: Call external API

Scope "Handle Response"
  Switch: outputs('HTTP')?['statusCode']
    Case 200, 201, 204:
      Parse JSON response
      Continue processing
    Case 400:
      Log: "Bad request - check payload"
      Send alert
      Terminate: Bad request
    Case 401:
      Log: "Authentication failed"
      Send alert to admin
      Terminate: Unauthorized
    Case 404:
      Log: "Resource not found"
      Continue (may be expected)
    Case 429:
      Get Retry-After header
      Delay: Retry-After seconds
      Retry (Do-Until pattern)
    Case 500, 502, 503:
      Log: "Server error"
      Retry with exponential backoff
      After 3 retries: Escalate
```

---

## 3. Custom Connector Patterns

### 3.1 When to Build Custom Connector

```
Build custom connector when:
  - No certified connector exists
  - Need to encapsulate complex auth
  - Reuse same API across multiple flows/apps
  - Want to standardize error handling
  - Need to transform requests/responses

Don't build when:
  - Certified connector exists (use it)
  - Only one flow needs it (use HTTP action)
  - API changes frequently (maintenance burden)
  - Team lacks OpenAPI expertise
```

### 3.2 Custom Connector with OAuth 2.0

```
OpenAPI security definition:
  "securityDefinitions": {
    "oauth2": {
      "type": "oauth2",
      "flow": "accessCode",
      "authorizationUrl": "https://api.example.com/oauth/authorize",
      "tokenUrl": "https://api.example.com/oauth/token",
      "scopes": {
        "read": "Read access",
        "write": "Write access"
      }
    }
  }

Power Platform connector setup:
  Security > OAuth 2.0
  Identity Provider: Generic OAuth 2
  Client ID: (from API provider)
  Client Secret: (from API provider)
  Authorization URL: (from API docs)
  Token URL: (from API docs)
  Refresh URL: (usually same as Token URL)
  Scope: read write
```

---

## 4. Azure Function Integration

### 4.1 When to Use Azure Functions

```
Use Azure Functions when:
  - Logic is too complex for Power Automate
  - Need reusable code across multiple flows
  - Performance is critical (Functions are faster)
  - Need language features not available in Power Fx
  - Need to use third-party libraries
  - Processing large datasets

Don't use when:
  - Power Automate can do it (simpler to maintain)
  - Logic is simple (flow actions suffice)
  - Team has no Azure/C# expertise
  - Budget doesn't allow Azure compute costs
```

### 4.2 Azure Function + Power Automate Pattern

```
Architecture:
  Power Automate Trigger
    --> Azure Function (processing)
    --> Response to Power Automate
    --> Continue flow

Azure Function implementation (C#):
  [FunctionName("ProcessInvoice")]
  public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
  {
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var data = JsonConvert.DeserializeObject<InvoiceRequest>(requestBody);
    
    // Complex processing
    var result = await ProcessInvoice(data);
    
    return new OkObjectResult(result);
  }

Power Automate:
  1. Trigger: When row created (Dataverse)
  2. HTTP action: POST to Azure Function
     - Body: Invoice data from trigger
  3. Parse JSON: Function response
  4. Continue processing based on result
```

---

## 5. Azure API Management Patterns

### 5.1 API Management as Integration Hub

```
Architecture:
  Power Platform --> API Management --> Backend Systems
                       |
                       +--> Legacy System A
                       +--> Legacy System B
                       +--> SAP
                       +--> Custom API

Benefits:
  - Single custom connector in Power Platform
  - API Management handles routing
  - Centralized auth, logging, rate limiting
  - Transform requests/responses
  - Cache responses
  - Mock responses for testing
```

### 5.2 Setup

```
Step 1: Create API Management instance in Azure

Step 2: Add APIs:
  - Import from OpenAPI
  - Or create manually

Step 3: Configure policies:
  <policies>
    <inbound>
      <base />
      <set-header name="X-API-Key" exists-action="skip">
        <value>{{backend-api-key}}</value>
      </set-header>
    </inbound>
  </policies>

Step 4: Create single custom connector in Power Platform
  Pointing to API Management gateway URL

Step 5: Use one connector for all backend systems
```

---

## 6. SharePoint Integration

### 6.1 When to Use SharePoint with Power Platform

```
Appropriate use cases:
  - Document management and storage
  - Simple lists (< 10k items)
  - Team collaboration sites
  - Form attachments
  - Light approval workflows

Avoid:
  - Complex relationships (use Dataverse)
  - > 10,000 items without indexing
  - Row-level security (SharePoint permissions are complex)
  - Frequent updates (throttling)
```

### 6.2 SharePoint Patterns

```
Pattern 1: Document upload from Power Apps
  Power Apps: Attachment control
  Flow: When attachment added
        -> Create file in SharePoint
        -> Update Dataverse record with file link

Pattern 2: List sync
  Flow: When SharePoint item created
        -> Create Dataverse row
        (Bidirectional sync with conflict handling)

Pattern 3: Approval with document review
  Flow: Start approval
        -> Approver reviews document in SharePoint
        -> Approval response
        -> Update SharePoint metadata

Pattern 4: Folder structure creation
  Flow: When project created
        -> Create folder: /Projects/{ProjectName}
        -> Create subfolders: Documents, Photos, Reports
        -> Set permissions
        -> Update Dataverse with folder path
```

---

## 7. Teams and Outlook Integration

### 7.1 Teams Integration Patterns

```
Pattern 1: Adaptive Card notifications
  Flow: Send adaptive card to Teams channel
  Card contains:
    - Summary information
    - Action buttons (Approve, Reject, View)
    - Input fields (comments)
  User responds in Teams, flow continues

Pattern 2: Teams tab with Power Apps
  Canvas app embedded in Teams tab
  Full app functionality within Teams context
  Access Teams context (channel, team, user)

Pattern 3: Bot channel (Copilot Studio)
  Copilot Studio agent published to Teams
  Users interact via chat
  Bot can trigger flows, query data

Pattern 4: Teams meeting automation
  Flow: Create Teams meeting
        -> Add attendees from Dataverse
        -> Send invite
        -> Add to calendar
```

### 7.2 Outlook Integration Patterns

```
Pattern 1: Email-triggered flow
  Trigger: When email arrives
  Conditions: Subject contains "Invoice", From vendor domain
  Actions: Save attachment, extract data, create record

Pattern 2: Send rich HTML email
  Compose: HTML template with CSS styling
  Send: Via Outlook connector
  Dynamic: Replace placeholders with data

Pattern 3: Shared mailbox automation
  Trigger: When email arrives in shared mailbox
  Process: Classify, route, create ticket
  Avoid: Using personal mailboxes for business flows
```

---

## 8. Dynamics 365 Integration

### 8.1 Dataverse as Integration Layer

```
Power Platform and Dynamics 365 share Dataverse:
  - Dynamics 365 apps are built on Dataverse
  - Custom apps can access same data
  - Standard tables: Account, Contact, Lead, Opportunity, Case

Integration approaches:
  1. Same Dataverse: Direct table access
     Custom app reads/writes same tables as D365

  2. Custom tables + relationships
     Custom tables with lookups to standard tables

  3. Virtual tables
     Surface D365 data without copying

  4. Dual-write (for Finance/SCM)
     Bidirectional sync with Dynamics 365 FO
     Verify current status - some features may be in preview
```

### 8.2 Dynamics 365 Specific Patterns

```
Pattern 1: Extend CRM with custom app
  D365 Sales manages standard sales process
  Custom canvas app handles specialized workflow
  Both use same Opportunity table

Pattern 2: Custom field sync
  New field in Dataverse
  Plugin syncs to external ERP via API
  Maintains single source of truth

Pattern 3: Case escalation
  Case created in D365 Customer Service
  Flow escalates based on SLA
  Power Apps shows escalation dashboard
```

---

## 9. Event-Driven Architectures

### 9.1 Using Dataverse Events

```
Dataverse provides event triggers:
  - Row created
  - Row updated
  - Row deleted
  - Row assigned
  - Status changed

Implementation:
  Power Automate: "When a row is added, modified or deleted"
  Plugin: Register step on specific message
  Webhook: Register external URL for callback

Best practice: Use narrow filters to reduce trigger volume
  Filter rows: statuscode eq 1 (only trigger on specific status)
  Select columns: only trigger on specific field changes
```

### 9.2 Azure Service Bus Pattern

```
Architecture for high-volume events:

Producer: Power Automate
  -> Send message to Service Bus queue

Consumer: Power Automate or Azure Function
  -> Receive message from queue
  -> Process asynchronously

Benefits:
  - Decouples producer from consumer
  - Handles backpressure (queue buffers)
  - Supports multiple consumers
  - Guaranteed delivery
  - Retry built-in

Service Bus configuration:
  Queue: my-business-events
  Max delivery count: 10
  Lock duration: 5 minutes
  TTL: 14 days
  Dead-lettering: Enabled
```

---

## 10. Webhook Handling

### 10.1 Receiving Webhooks in Power Platform

```
External system sends webhook to Power Automate:

Setup:
  Trigger: "When a HTTP request is received"
  Method: POST
  Relative path: /webhook/invoice-updated
  Schema: Define expected JSON body

Security:
  Option 1: API key in header
    Check header X-API-Key against secret
  
  Option 2: HMAC signature verification
    Calculate HMAC of body using shared secret
    Compare with signature header
  
  Option 3: IP whitelist
    Only accept from known IP ranges

Response:
  Always return 200 quickly (webhooks timeout)
  Then process asynchronously
```

### 10.2 Sending Webhooks from Power Platform

```
Power Automate sends webhook to external system:

HTTP action:
  Method: POST
  URI: https://external-system.com/webhook
  Headers:
    Content-Type: application/json
    X-Signature: (HMAC of body)
  Body: {
    "event": "case.created",
    "timestamp": "@{utcNow()}",
    "data": {
      "caseId": "@{outputs('Create_row')?['body/incidentid']}",
      "title": "@{triggerBody()['title']}"
    }
  }

Retry policy:
  Exponential backoff
  Max 10 retries
  Timeout: 30 seconds per attempt
```

---

## 11. Batch vs Real-Time Patterns

### 11.1 Decision Matrix

| Factor | Real-Time | Batch |
|--------|-----------|-------|
| **User expectation** | Immediate result | Delay acceptable |
| **Data volume** | Low (< 100 items) | High (> 1000 items) |
| **API limits** | May exceed | Spread load over time |
| **Complexity** | Simple workflows | Complex transformations |
| **Error handling** | Immediate feedback | Summary report |
| **External system** | Available, fast | Slow, rate-limited |

### 11.2 Batch Processing Pattern

```
Implementation:

1. Scheduled trigger (nightly at 2 AM)
2. Get all pending items
   - List rows with status = "Pending"
   - Pagination enabled
3. Select: Map to processing format
4. Chunk into batches of 100
5. For each batch:
   a. Apply to each with concurrency = 5
   b. Process item
   c. Update status
   d. Log result
6. Send summary report
   - Total processed
   - Success count
   - Failure count
   - Error details

Error handling:
  - Continue on error (don't stop batch)
  - Log all failures
  - Retry failed items separately
  - Alert if failure rate > 5%
```

### 11.3 Real-Time Processing Pattern

```
Implementation:

1. Event trigger (row created)
2. Immediate validation
3. Quick processing (< 10 seconds)
4. Response or notification
5. Async tasks (if needed) via Service Bus

Optimization:
  - Minimize actions in real-time path
  - Offload heavy work to child flow
  - Use Service Bus for guaranteed delivery
  - Return quickly, process asynchronously
```

---

## 12. Error Handling and Retry

### 12.1 Comprehensive Error Handling

```
Every integration flow MUST have:

1. Try-Catch pattern:
   Scope "Try"
     - Main integration logic
   Scope "Catch"
     - Run after: has failed, is skipped
     - Extract error details
     - Log to Dataverse error table
     - Send alert
   Scope "Finally"
     - Run after: always
     - Cleanup resources
     - Log completion

2. Retry logic:
   - Exponential backoff for transient errors
   - Max retry count: 10
   - Circuit breaker pattern (stop after N failures)

3. Dead letter handling:
   - After max retries, save to dead letter queue
   - Manual review and reprocessing
   - Alert on dead letter accumulation

4. Monitoring:
   - Success/failure rate dashboard
   - Average processing time
   - Error trend analysis
   - SLA compliance
```

### 12.2 Retry Configuration

```
Standard retry settings:

For HTTP calls to external APIs:
  Type: Exponential interval
  Count: 10
  Interval: 5 seconds
  Minimum interval: 5 seconds
  Maximum interval: 1 hour

For database operations:
  Type: Fixed interval
  Count: 3
  Interval: 10 seconds

For message queue operations:
  Type: Exponential interval
  Count: 10
  Service Bus handles this automatically
```

---

*End of Integration Patterns Guide. Verify all API endpoints and connector capabilities against current Microsoft documentation.*
