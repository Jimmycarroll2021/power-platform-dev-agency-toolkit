# Connectors Comprehensive Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Applies to**: All Power Platform connectors
> **Needs verification against current Microsoft docs**: Connector list, premium status, and rate limits change frequently. Always verify DLP policy compatibility.

---

## 1. Connector Types Overview

```
+---------------------+    +---------------------+    +---------------------+
|  Certified          |    |  Independent        |    |  Custom             |
|  Connectors         |    |  Publisher          |    |  Connectors         |
|---------------------|    |---------------------|    |---------------------|
| Microsoft-tested    |    | Third-party built   |    | You build           |
| 900+ available      |    | Community/company   |    | OpenAPI-based       |
| Standard + Premium  |    | Limited testing     |    | Any REST API        |
| Full support        |    | Limited support     |    | Your responsibility |
+---------------------+    +---------------------+    +---------------------+
         |                           |                           |
         v                           v                           v
  Outlook, SharePoint          Jira, ServiceNow           Your internal API
  Dataverse, SQL               Trello, GitHub             Partner API
  Teams, OneDrive              Third-party SaaS           Custom service
```

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

**Licensing**: These work with the seeded Power Automate license included in Microsoft 365.

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

**Licensing Warning**: If a flow uses ANY premium connector, every user who owns, triggers, or is referenced by that flow needs a premium license OR the flow must have a Per Flow license.

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
    openapi: 3.0.0 (convert to 2.0 for Power Platform)
    Use Swagger Editor: https://editor.swagger.io/

  Required in OpenAPI:
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
  - Requires premium license to use

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

Requirements:
- Windows Server or Windows 10/11 (not recommended for prod)
- .NET Framework (check current requirements)
- Network access to data sources
- Outbound HTTPS (443) to Azure

Recommended:
- Install on dedicated server (not developer laptop)
- Cluster for high availability (2+ gateways)
- Service account (not personal account)
- Regular updates (via Power Platform admin center)
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
    Settings > Pagination > Turn on > Threshold: 10000

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
| Dataverse | 6,000 req/5min per user | Batch operations, caching |
| SharePoint | 1 req/sec per connection | Reduce frequency, use webhooks |
| SQL Server | 100 req/10sec | Connection pooling, stored procs |
| HTTP (generic) | 1,000 req/min per connection | Implement retry/backoff |
| Outlook | 10,000 emails/day | Monitor daily volume |
| Teams | 6,000 req/min per app | Batch messages |

### 8.2 Handling Throttling (HTTP 429)

```
Retry policy configuration:
  Retry type: Exponential interval
  Count: 10
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
DLP policies control connector usage:

Policy structure:
  Environment scope: Specific environments or all
  Connector groups:
    - Business (allowed): Dataverse, SharePoint, SQL, Outlook
    - Non-business (allowed): Notification, RSS
    - Blocked: Gmail, personal connectors

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
| 16 | **Azure AD** | Premium | User/group management |
| 17 | **Salesforce** | Premium | CRM sync |
| 18 | **Dynamics 365** | Premium | ERP operations |
| 19 | **DocuSign** | Premium | E-signatures |
| 20 | **Custom Connector** | Premium | Internal API integration |

---

*End of Connectors Guide. Verify connector status and premium classification against current Microsoft documentation.*
