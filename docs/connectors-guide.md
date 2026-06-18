---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/connectors/connector-reference/
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
  - https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits
  - https://learn.microsoft.com/en-us/power-automate/limits-and-config
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types
  - https://learn.microsoft.com/en-us/connectors/sharepoint/
  - https://learn.microsoft.com/en-us/connectors/office365/
  - https://learn.microsoft.com/en-us/connectors/sql/
  - https://learn.microsoft.com/en-us/connectors/teams/
  - https://learn.microsoft.com/en-us/connectors/custom-connectors/define-openapi-definition
  - https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification
  - https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-install
---

# Connectors Comprehensive Guide

> **Version**: 1.1 | **Last updated**: 2026-06-19
> **Applies to**: All Power Platform connectors
> **Platform state baseline**: 2026-H1. Claims below are cited inline to [Microsoft Learn](https://learn.microsoft.com/en-us/connectors/connector-reference/). Connector lists, premium status, and rate limits change frequently — re-verify against the per-connector "Throttling Limits" section on each connector's reference page and your tenant's DLP policy before building.

---

## 1. Connector Types Overview

```
+---------------------+    +---------------------+    +---------------------+
|  Certified          |    |  Independent        |    |  Custom             |
|  Connectors         |    |  Publisher          |    |  Connectors         |
|---------------------|    |---------------------|    |---------------------|
| Microsoft-tested    |    | Third-party built   |    | You build           |
| 1,400+ available*   |    | Community/company   |    | OpenAPI-based       |
| Standard + Premium  |    | Limited testing     |    | Any REST API        |
| Full support        |    | Limited support     |    | Your responsibility |
+---------------------+    +---------------------+    +---------------------+
         |                           |                           |
         v                           v                           v
  Outlook, SharePoint          Jira, ServiceNow           Your internal API
  Dataverse, SQL               Trello, GitHub             Partner API
  Teams, OneDrive              Third-party SaaS           Custom service
```

\* Microsoft does not publish a fixed total; the catalog grows continuously. The authoritative live list (and exact current count) is the [Connector reference overview](https://learn.microsoft.com/en-us/connectors/connector-reference/), with separate [Standard](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-standard-connectors) and [Premium](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors) tier lists. The "1,400+" figure is approximate (unverified as of 2026-06-19 — confirm the current count against Microsoft Learn).

---

## 2. Certified Connectors: Standard vs Premium

### 2.1 Standard Connectors (Included with M365)

| Connector | Common Use Cases |
|-----------|-----------------|
| **Office 365 Outlook** | Send/receive emails, calendar, contacts |
| **Office 365 Users** | User profile lookup, manager chain |
| **SharePoint** | Document libraries, lists, pages |
| **Microsoft Teams** | Post messages, create channels, meetings |
| **OneDrive** | File storage, personal documents |
| **Excel Online** | Read/write Excel files (not delegable) |
| **Planner** | Task management, plan creation |
| **Forms** | Survey responses, form submissions |
| **To Do** | Task lists, personal task management |
| **Approvals** | Approval workflows, request management |
| **RSS** | Feed monitoring, news aggregation |
| **Notifications** | Mobile push notifications |

**Licensing**: Standard connectors require no special licensing — users on the free plan or a Microsoft 365 plan can access standard connectors, and the seeded Power Automate/Power Apps use rights in Microsoft 365 cover them (within the app context). Confirmed against [Connector reference overview](https://learn.microsoft.com/en-us/connectors/connector-reference/) and [Power Automate licensing types](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types).

### 2.2 Premium Connectors (Require Premium License)

| Connector | Common Use Cases | License Required |
|-----------|-----------------|------------------|
| **Microsoft Dataverse** | CRUD operations, business data | Power Apps/Automate Premium |
| **SQL Server** | Database queries, stored procedures | Power Automate Premium |
| **HTTP / HTTP + Swagger** | Custom API calls, webhooks | Power Automate Premium |
| **Azure Blob Storage** | Cloud file storage | Power Automate Premium |
| **Azure Service Bus** | Message queuing | Power Automate Premium |
| **Azure Event Grid** | Event-driven architectures | Power Automate Premium |
| **Azure Functions** | Serverless code execution | Power Automate Premium |
| **Azure DevOps** | CI/CD integration | Power Automate Premium |
| **Salesforce** | CRM sync, lead management | Power Automate Premium |
| **Dynamics 365** | ERP operations | Power Automate Premium |
| **SAP** | ERP integration | Power Automate Premium |
| **Oracle Database** | Database operations | Power Automate Premium |
| **Custom Connectors** | Internal APIs, bespoke services | Power Automate Premium |
| **Adobe PDF Services** | Document manipulation | Power Automate Premium |
| **DocuSign** | E-signature workflows | Power Automate Premium |

**Licensing Warning**: A standalone Power Apps or Power Automate plan (or another plan that grants premium rights) is required to use premium, on-premises, and custom connectors — Microsoft 365 / seeded plans only grant standard connectors. Under the default **per-user** model, the user whose license the flow runs under needs premium rights (instant flows use the invoking user's license; automated/scheduled flows use the flow *owner's* license). Alternatively, assign a **Process license** (formerly "per flow plan") to the flow itself: the flow then accesses premium connectors and can be used by anyone regardless of their individual license, because the licence is tied to the flow, not the users. In **Managed Environments** and **Dataverse for Teams**, per-user premium licensing is still enforced unless capacity (per-flow/Process) licensing is allocated. Confirmed against [Power Automate licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs) and [Power Automate license types](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types).

### 2.3 Independent Publisher Connectors

```
Characteristics:
- Built by third parties (not Microsoft)
- Available in connector gallery
- Support is community-based
- May have reliability issues
- Test thoroughly before production use

Examples: Various social media, niche SaaS tools

Recommendation: Use with caution for production.
Prefer certified connectors. For critical integrations,
build custom connectors instead.
```

---

## 3. Custom Connector Creation Process

### 3.1 Step-by-Step Guide

```
Step 1: Prepare OpenAPI definition
  Option A: Generate from existing API
    - Use Swagger UI: https://api.example.com/swagger.json
    - Use Postman collection export
    - Use Azure API Management export

  Option B: Write manually
    Native format is OpenAPI 2.0 (Swagger 2.0) - definition must be < 1 MB.
    OpenAPI 3.0 specs can now be imported directly (the platform
    converts v3 to 2.0 behind the scenes); historically v3 had to be
    downgraded to 2.0 by hand. The required fields below are 2.0 syntax.
    Use Swagger Editor: https://editor.swagger.io/
    # Verified: https://learn.microsoft.com/en-us/connectors/custom-connectors/define-openapi-definition

  Required in OpenAPI 2.0:
    - host
    - basePath
    - schemes
    - paths with operations (get, post, put, delete)
    - parameters (query, path, body)
    - responses with schemas
    - securityDefinitions

Step 2: Create custom connector in Power Platform
  make.powerapps.com > Custom connectors > New custom connector
  Option A: Create from blank
  Option B: Import OpenAPI file
  Option C: Import Postman collection

Step 3: Configure General info
  - Connector name: MyAPI
  - Description: Integration with internal billing system
  - Host: api.example.com
  - Base URL: /v1

Step 4: Configure Security
  Option A: API Key
    - Parameter name: X-API-Key
    - Location: Header
  Option B: OAuth 2.0
    - Identity Provider: Generic OAuth 2
    - Client ID, Client Secret, Authorization URL, Token URL
  Option C: Basic Auth
    - Username/password
  Option D: No authentication
    - (Not recommended for production)

Step 5: Configure Definition (triggers and actions)
  - Review imported operations
  - Add summary and description to each
  - Configure visibility (important/none)
  - Test each operation

Step 6: Test connector
  - Create connection
  - Test each action
  - Verify responses
  - Save

Step 7: Use in flow/app
  - Available in connector picker
  - Custom connectors are premium - require a premium plan (or a
    Process-licensed flow), same as premium connectors.
    # Verified: https://learn.microsoft.com/en-us/connectors/connector-reference/

Step 8: For ALM: Export with solution
  - Add custom connector to solution
  - Export managed for test/prod
  - Connection references will need new connections per environment
```

### 3.2 OpenAPI Import Tips

```
Common issues and fixes:

Issue: "Operation ID missing"
Fix: Add operationId to each path in OpenAPI:
  paths:
    /invoices:
      get:
        operationId: ListInvoices  # REQUIRED

Issue: "Schema not found"
Fix: Define schemas in definitions section:
  definitions:
    Invoice:
      type: object
      properties:
        id: { type: string }
        amount: { type: number }

Issue: "Authentication fails"
Fix: Verify securityDefinitions match your auth type:
  securityDefinitions:
    apiKey:
      type: apiKey
      name: X-API-Key
      in: header

Issue: "URL parameters not working"
Fix: Use proper parameter syntax:
  parameters:
    - name: invoiceId
      in: path
      required: true
      type: string
```

---

## 4. Connection References and Environment Variables

### 4.1 Connection Reference Setup

```
Why use connection references:
- Flows can be moved between environments
- Connections are environment-specific
- No hardcoded connection IDs
- Service accounts per environment

Setup:
1. In solution: New > Connection Reference
2. Name: cr_SHARED_HTTP_MyAPI
3. Connector: Your custom connector
4. Create connection for current environment
5. In flow: Use connection reference (not "new connection")

Per environment:
  DEV:  Connection uses dev-api.example.com + test account
  TEST: Connection uses test-api.example.com + test account
  PROD: Connection uses api.example.com + service account
```

### 4.2 Environment Variables for URLs

```
Instead of hardcoding API URLs in custom connectors:

Create environment variable:
  Name: ev_APIBaseUrl
  Type: Text
  Value: https://dev-api.example.com

Use in flow:
  HTTP action URL: @{parameters('ev_APIBaseUrl')}/invoices

This allows same connector, different URLs per environment.
```

---

## 5. On-Premises Data Gateway

### 5.1 Gateway Architecture

```
Cloud Flow --> Azure Service Bus --> Gateway (on-prem) --> SQL Server/SharePoint/File Share
              (encrypted tunnel)      (your network)

Requirements (verified against Microsoft Learn install page):
- 64-bit Windows 10 or 64-bit Windows Server 2019 (minimum)
- .NET Framework 4.8
- ~4 GB disk for performance-monitoring logs
- Network access to data sources
- Outbound HTTPS (443) to Azure (Azure Relay / Service Bus)
- NOT supported on Server Core, Windows containers, or a domain controller
# Verified: https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-install

Recommended (per Microsoft Learn):
- 64-bit Windows Server 2019 or later, 8-core CPU, 8 GB memory, SSD spooling
- Install on a dedicated always-on server (not a developer laptop)
- Cluster for high availability (2+ gateways, each on its own machine)
- Service account (not personal account)
- Regular updates (only the last ~6 releases are supported)
```

### 5.2 Gateway Installation

```powershell
# Download from Power Platform Admin Center
# https://admin.powerplatform.microsoft.com > Data gateways > New gateway

# Or download directly
# https://aka.ms/on-premises-data-gateway

# Installation steps:
1. Run installer on gateway server
2. Sign in with admin account
3. Register new gateway:
   - Name: "PROD-Gateway-01"
   - Recovery key: (save in password manager!)
   - Region: Match your Power Platform environment region
4. Add to gateway cluster (if HA needed)
5. Verify in admin center

# Add data sources:
Admin Center > Data gateways > Manage gateways
> Select gateway > New data source
  - Type: SQL Server
  - Server: sqlserver.company.local
  - Database: ProductionDB
  - Authentication: Windows (service account)
```

### 5.3 Gateway Best Practices

```
DO:
[+] Install on server OS (Windows Server, not Windows 10)
[+] Use clustered gateways for HA (min 2)
[+] Use dedicated service account
[+] Monitor gateway health in admin center
[+] Keep gateway updated
[+] Document data source configurations
[+] Test failover if clustered

DO NOT:
[X] Install on developer's laptop
[X] Use personal account for gateway admin
[X] Forget the recovery key
[X] Install in different region from environment
[X] Ignore gateway performance alerts
```

---

## 6. Microsoft Graph Integration Patterns

### 6.1 Graph API via HTTP Connector

```
The HTTP connector (premium) allows calling Microsoft Graph:

Action: HTTP
  Method: GET
  URI: https://graph.microsoft.com/v1.0/users/{userId}/manager
  Authentication: Active Directory OAuth
    Tenant: (your tenant ID)
    Audience: https://graph.microsoft.com
    Client ID: (app registration ID)
    Credential Type: Secret
    Secret: (from app registration)

Common Graph endpoints:
  GET /users                    - List users
  GET /users/{id}/manager       - Get manager
  GET /users/{id}/photo/$value  - Get profile photo
  GET /groups                   - List groups
  GET /teams                    - List teams
  POST /users/{id}/sendMail    - Send email via Graph
  GET /sites                    - List SharePoint sites
```

### 6.2 Graph Permissions Setup

```
Step 1: Azure AD > App Registrations > New
  Name: PowerPlatform-Graph-Integration

Step 2: API Permissions > Add > Microsoft Graph
  - User.Read.All (read user profiles)
  - Group.Read.All (read groups)
  - Mail.Send (send emails)
  - Sites.Read.All (read SharePoint)
  - Directory.Read.All (read directory)

Step 3: Grant admin consent
  (Requires Azure AD admin)

Step 4: Certificates & Secrets
  New client secret > Copy value

Step 5: Use in flow (HTTP connector with Azure AD OAuth)
```

---

## 7. Common Connector Patterns

### 7.1 Pagination Pattern

```
Many connectors return paginated results. Handle this:

Pattern 1: Built-in pagination
  List rows (Dataverse):
    Settings > Pagination > Turn on > Threshold (e.g. 5000-100000)
    # Max paginated items per run: 5,000 (Low) / 100,000 (other profiles)
    # Verified: https://learn.microsoft.com/en-us/power-automate/limits-and-config

Pattern 2: Until loop for HTTP APIs
  Initialize: uri = "https://api.example.com/items?page=1"
  Until: empty(body('HTTP')?['value'])
    HTTP GET: uri
    Append to array variable: body('HTTP')?['value']
    Set variable: uri = body('HTTP')?['@odata.nextLink']

Pattern 3: Do-while
  Do:
    Get items with $skip token
    Process batch
  While: @odata.nextLink exists
```

### 7.2 Error Handling Pattern

```
Every connector call should have error handling:

Scope "API Call"
  Action: HTTP - Call external API

Scope "Error Handler" (run after: has failed)
  Compose: result('API Call')  // Get error details
  Parse JSON: error structure
  Condition: status code analysis
    400: Log validation error, notify user
    401: Log auth error, alert admin
    404: Log not found, continue processing
    429: Retry with exponential backoff
    500: Retry, then escalate
  Send alert via Teams/email

Scope "Cleanup" (run after: always)
  Log attempt to audit table
```

### 7.3 Batch Processing Pattern

```
For processing many items efficiently:

1. Get all items (with pagination)
2. Select: Map to processing format
3. Chunk into batches of 100
4. For each batch:
   a. Send batch API call (if API supports)
   b. Or use concurrency control (parallelism: 10)
5. Collect results
6. Handle failures individually
7. Send summary report
```

---

## 8. Rate Limiting and Throttling

### 8.1 Connector-Specific Limits

| Connector | Rate Limit | Strategy |
|-----------|-----------|----------|
| Dataverse | 6,000 requests / 5 min per user (sliding 300s window); also a 1,200s combined-execution-time limit and a concurrent-request limit, all per user/app/web-server ([api-limits](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits)) | Batch operations (up to 5,000 ops/batch), caching |
| SharePoint | 600 calls / 60 sec **per connection** ([SharePoint connector](https://learn.microsoft.com/en-us/connectors/sharepoint/)) | Reduce frequency, use webhooks, filter/Top |
| SQL Server | CRUD: 100 calls / 10 sec per connection; Native (stored proc / query): 500 calls / 10 sec per connection ([SQL connector](https://learn.microsoft.com/en-us/connectors/sql/)) | Connection pooling, stored procs |
| HTTP (generic action) | No published per-connection connector throttle — HTTP actions count against your 5-min burst (100,000 req/5min) and 24-hour Power Platform request entitlement instead (unverified as of 2026-06-19 — confirm against Microsoft Learn; there is no managed-connector throttle table for the generic HTTP action) | Implement retry/backoff; respect PPR limits |
| Office 365 Outlook | 300 calls / 60 sec per connection; recipient quota 10,000 / day per connection; 2 connections per user ([Office 365 Outlook connector](https://learn.microsoft.com/en-us/connectors/office365/)) | Monitor volume, batch recipients |
| Teams | 100 calls / 60 sec **per connection** (Flow-bot non-GET ops further limited to 25 / 300 sec) ([Teams connector](https://learn.microsoft.com/en-us/connectors/teams/)) | Batch messages, slow polling |

### 8.2 Handling Throttling (HTTP 429)

```
# Default retry policy (no config): exponential, up to 12 retries for
# Medium/High performance profiles, scaling ~7s up to ~1 hour for the last
# retry (Low profile: up to 2 retries, ~10 min max). Override per-action:
# Verified: https://learn.microsoft.com/en-us/power-automate/limits-and-config
Retry policy configuration (custom override):
  Retry type: Exponential interval
  Count: 10            # default is 4; max configurable per limits-and-config
  Interval: 5 seconds
  Minimum interval: 5 seconds
  Maximum interval: 1 hour

Custom retry (more control):
  Scope "API Call"
    HTTP action
  Scope "Handle 429"
    Condition: outputs('HTTP')?['statusCode'] = 429
    Yes:
      Parse JSON: outputs('HTTP')?['headers']
      Get Retry-After header value
      Delay: Retry-After seconds
      Go back to API Call (recursive pattern using Do-Until)
```

---

## 9. Security and DLP Considerations

### 9.1 DLP Policy Design

```
DLP (data) policies control connector usage.
# Verified: 3 data groups - Business, Non-Business, Blocked. New connectors
# default to Non-Business. Custom connectors CAN be classified. Core
# connectors (Dataverse, Approvals, Notifications) and M365 standard
# connectors (SharePoint, Teams, Outlook, OneDrive for Business, etc.)
# CANNOT be Blocked - only Business/Non-Business (use Advanced Connector
# Policies for stricter allowlisting).
# https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification

Policy structure:
  Environment scope: Specific environments or all
  Connector groups (exactly three):
    - Business (allowed): Dataverse, SharePoint, SQL, Outlook
    - Non-business (allowed): Notification, RSS    [default group]
    - Blocked: Gmail, personal connectors          [not for unblockable list]

Best practices:
  1. Block personal email connectors in production
  2. Separate policies per environment type (dev/test/prod)
  3. Include custom connectors in business group
  4. Review and update quarterly
  5. Document exceptions

Common DLP policy:
  Business:
    - Microsoft Dataverse
    - SharePoint
    - SQL Server
    - Office 365 Outlook
    - Office 365 Users
    - Microsoft Teams
    - HTTP
    - Azure Blob Storage
  Blocked:
    - Gmail
    - Twitter
    - Facebook
    - Personal OneDrive
```

### 9.2 Security Checklist for Connectors

```
[ ] Custom connectors use HTTPS only (not HTTP)
[ ] API keys stored as secure inputs (not in flow steps)
[ ] OAuth preferred over API key where available
[ ] Connection references used (not personal connections)
[ ] Service accounts own production flows
[ ] DLP policies configured and enforced
[ ] Rate limiting understood and planned for
[ ] API credentials rotated regularly
[ ] Unused connections cleaned up quarterly
[ ] Connector changes documented
[ ] Test connector in separate environment first
[ ] Error responses don't leak sensitive data
```

---

## 10. Top 20 Most-Used Connectors with Use Cases

| # | Connector | Type | Common Use Cases |
|---|-----------|------|-----------------|
| 1 | **Microsoft Dataverse** | Premium | All business data CRUD |
| 2 | **SharePoint** | Standard | Document management, lists |
| 3 | **Office 365 Outlook** | Standard | Email notifications, approvals |
| 4 | **Microsoft Teams** | Standard | Chat notifications, approvals |
| 5 | **Office 365 Users** | Standard | User lookup, manager chain |
| 6 | **SQL Server** | Premium | Database operations |
| 7 | **HTTP** | Premium | Custom API integration |
| 8 | **OneDrive** | Standard | File storage, sharing |
| 9 | **Excel Online** | Standard | Spreadsheet operations |
| 10 | **Approvals** | Standard | Approval workflows |
| 11 | **Azure Blob Storage** | Premium | Large file storage |
| 12 | **Azure Key Vault** | Premium | Secure secret retrieval |
| 13 | **Condition** | Built-in | Logic branching |
| 14 | **Power Apps** | Built-in | Trigger from app |
| 15 | **Planner** | Standard | Task management |
| 16 | **Microsoft Entra ID** (formerly Azure AD) | Premium | User/group management |
| 17 | **Salesforce** | Premium | CRM sync |
| 18 | **Dynamics 365** | Premium | ERP operations |
| 19 | **DocuSign** | Premium | E-signatures |
| 20 | **Custom Connector** | Premium | Internal API integration |

---

*End of Connectors Guide. Verified against Microsoft Learn as of 2026-06-19 (platform state 2026-H1). Tier/Premium classification and per-connector throttling limits change frequently — always re-check the [Connector reference overview](https://learn.microsoft.com/en-us/connectors/connector-reference/) and each connector's own "Throttling Limits" section before building.*
