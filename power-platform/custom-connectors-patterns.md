---
title: "Custom Connector Patterns"
description: "Patterns for creating, securing, and deploying custom connectors"
category: "integration"
tags: ["custom-connectors", "openapi", "api", "integration"]
---

# Custom Connector Patterns

## 1. OpenAPI-Based Creation

### Create from OpenAPI Definition

```powershell
# Via Power Platform Maker Portal
# 1. Go to make.powerapps.com
# 2. Data > Custom connectors > New custom connector > Create from OpenAPI URL
# 3. Paste OpenAPI spec URL or upload file

# Via PAC CLI
pac connector init --api-definition api/openapi.json --output custom-connector
```

### OpenAPI Spec Best Practices

```yaml
openapi: "3.0.0"
info:
  title: "Aluma API"
  version: "1.0.0"
  description: "Aluma integration API"
servers:
  - url: https://api.aluma.example.com/v1
paths:
  /invoices/{id}:
    get:
      summary: "Get invoice by ID"
      operationId: getInvoice
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: "Invoice found"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Invoice"
    post:
      summary: "Create invoice"
      operationId: createInvoice
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/InvoiceCreate"
      responses:
        "201":
          description: "Invoice created"
components:
  schemas:
    Invoice:
      type: object
      properties:
        id:
          type: string
        amount:
          type: number
          format: decimal
        status:
          type: string
          enum: ["draft", "sent", "paid", "overdue"]
    InvoiceCreate:
      type: object
      required: ["amount", "customerId"]
      properties:
        amount:
          type: number
        customerId:
          type: string
```

### Import OpenAPI to Power Platform

```powershell
# Via admin PowerShell
$pac canvas pack --sources . --msapp app.msapp

# Via maker portal import
# Custom Connectors > New > Import an OpenAPI file
```

---

## 2. Authentication Patterns

### OAuth 2.0 (Authorization Code)

```powershell
# Custom connector settings:
# Security > Authentication type: OAuth 2.0
# Identity Provider: Generic OAuth 2
# Client ID: <from app registration>
# Client Secret: <from app registration>
# Authorization URL: https://login.example.com/oauth/authorize
# Token URL: https://login.example.com/oauth/token
# Refresh URL: https://login.example.com/oauth/token
# Scope: api://<client-id>/.default
```

**Setup steps:**
1. Register app in identity provider
2. Add redirect URI: `https://global.consent.azure-apim.net/redirect`
3. Configure scopes
4. Enter credentials in custom connector security tab
5. Test connection

### API Key

```powershell
# Custom connector settings:
# Security > Authentication type: API Key
# Parameter name: X-API-Key
# Parameter location: Header

# Usage in flow:
# Connection created with API key stored securely
# Key sent automatically with every request
```

### Azure Active Directory (AAD)

```powershell
# Custom connector settings:
# Security > Authentication type: OAuth 2.0
# Identity Provider: Azure Active Directory
# Client ID: <AAD app ID>
# Client Secret: <AAD app secret>
# Resource: https://api.aluma.example.com
# Tenant ID: <directory-id>

# AAD App Registration:
# 1. Register new app in Azure AD
# 2. Add API permission: <your API>
# 3. Grant admin consent
# 4. Create client secret
```

### Basic Authentication

```powershell
# Custom connector settings:
# Security > Authentication type: Basic authentication
# Username and password collected at connection time
# Encoded as Base64 in Authorization header

# Note: Consider OAuth 2.0 instead for production
```

---

## 3. Policy Template Patterns

### Request Transformation

```xml
<!-- Add header to all requests -->
<policies>
  <inbound>
    <set-header name="X-Request-Source" exists-action="override">
      <value>Power-Platform</value>
    </set-header>
    <set-header name="X-Correlation-Id" exists-action="override">
      <value>@(Guid.NewGuid().ToString())</value>
    </set-header>
  </inbound>
</policies>
```

### Response Transformation

```xml
<!-- Transform error responses to consistent format -->
<policies>
  <outbound>
    <choose>
      <when condition="@(context.Response.StatusCode >= 400)">
        <set-body>
          {
            "error": true,
            "statusCode": @(context.Response.StatusCode),
            "message": "@(context.Response.Body.As<string>())"
          }
        </set-body>
      </when>
    </choose>
  </outbound>
</policies>
```

### Retry Policy

```xml
<policies>
  <backend>
    <retry count="3" interval="5">
      <when condition="@(context.Response.StatusCode == 503 || 
                         context.Response.StatusCode == 502 ||
                         context.Response.StatusCode == 504)" />
    </retry>
  </backend>
</policies>
```

### Rate Limiting

```xml
<policies>
  <inbound>
    <rate-limit calls="100" renewal-period="60" />
  </inbound>
</policies>
```

---

## 4. Testing and Validation

### Connector Test Page

```
Maker Portal > Custom Connectors > Your Connector > Test

Steps:
1. Create a connection
2. Select an operation
3. Fill in parameters
4. Click "Test operation"
5. Review request/response
```

### Automated Testing with PowerShell

```powershell
# Get connection
token=$(az account get-access-token --resource https://service.flow.microsoft.com --query accessToken -o tsv)

# Test connector operation
curl -X POST "https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/{env}/api-operations/{op}/invoke" \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {
      "id": "test-123"
    }
  }'
```

### Validation Checklist

- [ ] All operations return expected schema
- [ ] Error responses handled gracefully
- [ ] Authentication works with target identity provider
- [ ] Pagination works for list endpoints
- [ ] File upload/download operations function
- [ ] Timeout settings appropriate for API latency
- [ ] Connector icon and description complete

---

## 5. Deployment and Sharing

### Export and Import

```powershell
# Export connector definition
pac connector init --connector-id <guid> --environment <url> --output ./exported

# Import to another environment
pac connector create --api-definition ./exported/apiDefinition.json \
  --api-properties ./exported/apiProperties.json \
  --environment <target-url>
```

### Sharing

```powershell
# Via maker portal
# Custom Connectors > ... > Share
# Add users or security groups

# Permissions:
# - Can use: Run actions via this connector
# - Can edit: Modify connector definition
```

### DLP Compliance

```powershell
# Ensure connector is in DLP policy
# Admin Center > Policies > Data policies
# Add custom connector to appropriate group:
#   - Business (approved)
#   - Non-business (blocked)
#   - Blocked (explicitly blocked)
```

---

## 6. Monitoring

### Connector Usage

```powershell
# Via Power Platform Admin Center
# Analytics > Connectors
# View: Request count, error rate, latency by connector

# Via Azure API Management (if using APIM)
# Review application insights for custom connector gateway
```

### Health Check Flow

```
[Recurrence: Every 15 minutes]
  │
  ▼
[Custom Connector: Health endpoint]
  │
  ├──▶ Success → [Log: Healthy]
  │
  └──▶ Failure → [Log: Unhealthy]
        → [Send alert: Teams/Email]
        → [Create Dataverse alert record]
```
