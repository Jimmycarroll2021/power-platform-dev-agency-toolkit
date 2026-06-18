# Custom Connector Playbook

> **Complexity Rating:** Medium / High
> **Last Updated:** 2024
> **Applies To:** Power Platform Custom Connectors, Power Automate, Power Apps

---

## 1. When to Use Custom Connectors

Use a custom connector when:

| Scenario | Why Custom Connector |
|----------|---------------------|
| Integrating with REST API not in existing connectors | Abstract API complexity |
| Reusing same API across multiple apps/flows | Centralize configuration |
| Need custom authentication method | Support various auth types |
| Need to transform API responses | Built-in transformation |
| Internal organization API | No public connector available |
| Third-party API with no connector | Create your own |
| Need to expose Azure Function | Clean integration point |
| Multiple environments (dev/test/prod) | Environment-specific endpoints |

### Decision Matrix

| Factor | Custom Connector | HTTP Action Directly |
|--------|-----------------|---------------------|
| Reuse across solutions | Excellent | Must copy-paste |
| Authentication management | Centralized | Per-action |
| Response schema | Defined, validated | Manual parsing |
| Developer experience | Clean, reusable | Verbose, repetitive |
| Maintenance | Update once | Update everywhere |
| Initial effort | Higher | Lower |

---

## 2. When NOT to Use Custom Connectors

> **DO NOT use custom connectors when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Single one-off API call | HTTP action in flow | Simpler, faster |
| API already has a first-party connector | Built-in connector | Maintained by Microsoft |
| Simple webhook receiver | HTTP trigger in flow | No connector needed |
| GraphQL API | Azure Function wrapper | Custom connectors don't natively support GraphQL |
| SOAP/XML API | Azure Function wrapper | REST/OpenAPI preferred |
| Need complex middleware | Azure API Management | Better routing, caching, policies |
| API changes frequently | HTTP action | Avoid constant connector updates |
| Only need it in one app | HTTP action in app | Less overhead |

---

## 3. Architecture

### 3.1 Custom Connector Architecture

```
[Power Apps / Power Automate]
       |
       v
[Custom Connector]
       |-- Authentication (OAuth, API Key, Basic)
       |-- Operations (defined endpoints)
       |-- Policies (transformation, caching)
       |
       v
[Target REST API]
       |-- External system
       |-- Azure Function
       |-- Internal service
```

### 3.2 Authentication Patterns

| Auth Type | Use When | Complexity |
|-----------|----------|------------|
| API Key | Simple internal APIs | Low |
| Basic Auth | Legacy systems | Low |
| OAuth 2.0 | Modern external APIs | Medium |
| OAuth 2.0 (Generic) | Non-standard OAuth | High |
| API Key + Secret | Many SaaS APIs | Low |
| Certificate | High-security internal | High |

---

## 4. OpenAPI Definition

### 4.1 Creating OpenAPI (Swagger) Specification

Custom connectors are based on OpenAPI 2.0 (Swagger) specifications.

**Minimum required structure:**
```json
{
  "swagger": "2.0",
  "info": {
    "title": "My API Connector",
    "description": "Connector for My API",
    "version": "1.0.0"
  },
  "host": "api.example.com",
  "basePath": "/v1",
  "schemes": ["https"],
  "paths": {
    "/resource": {
      "get": {
        "summary": "Get resources",
        "operationId": "GetResources",
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "type": "string",
            "description": "Resource ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/Resource"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Resource": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "status": {"type": "string"}
      }
    }
  }
}
```

### 4.2 OpenAPI Best Practices

| Practice | Why |
|----------|-----|
| Use descriptive operationIds | Becomes action name in flow |
| Define all response schemas | Enables dynamic content in flows |
| Include descriptions | Better intellisense |
| Use enums for fixed values | Dropdowns instead of free text |
| Define error responses | Better error handling |
| Version your API | Backward compatibility |

---

## 5. Authentication

### 5.1 API Key Authentication Setup

```
1. In custom connector wizard:
   - Security tab > Authentication type: API Key
   - Parameter name: X-API-Key (or as API requires)
   - Parameter location: Header
   
2. When creating connection:
   - User enters their API key
   - Stored securely by Power Platform
```

### 5.2 OAuth 2.0 Setup

```
1. In custom connector wizard:
   - Security tab > Authentication type: OAuth 2.0
   - Identity Provider: Generic OAuth 2
   - Client ID: [From API provider]
   - Client Secret: [From API provider]
   - Authorization URL: https://api.provider.com/oauth/authorize
   - Token URL: https://api.provider.com/oauth/token
   - Refresh URL: https://api.provider.com/oauth/refresh
   - Scope: [Required scopes]

2. When creating connection:
   - User redirected to provider login
   - OAuth token stored securely
   - Auto-refresh handled by platform
```

### 5.3 Azure AD OAuth Setup

```
1. Register app in Azure AD:
   - Azure Portal > App Registrations
   - Note: Application (client) ID
   - Create client secret
   - Add API permissions

2. In custom connector:
   - Security tab > OAuth 2.0
   - Identity Provider: Azure AD
   - Client ID: [from app registration]
   - Client Secret: [from app registration]
   - Resource URL: https://graph.microsoft.com (or your API)
   - Tenant ID: common or specific tenant
```

---

## 6. Operations

### 6.1 Defining Operations

| Element | Purpose | Example |
|---------|---------|---------|
| Summary | Display name in flow | "Get Customer by ID" |
| Operation ID | Technical identifier | `GetCustomerById` |
| Description | Tooltip/help text | "Retrieves a customer record" |
| Visibility | Advanced/internal only | `important` or `advanced` |

### 6.2 Request Configuration

```
GET /customers/{id}
  |
  +-- Path parameters:
  |     +-- id (string, required): "Customer ID"
  |
  +-- Query parameters:
  |     +-- includeInactive (boolean, optional): "Include inactive records"
  |     +-- fields (string, optional): "Comma-separated field list"
  |
  +-- Headers:
        +-- Accept: application/json
```

### 6.3 Response Configuration

```
Response: 200 OK
  |
  +-- Body:
        {
          "id": "string",
          "name": "string",
          "email": "string",
          "status": "string",
          "createdDate": "string (date-time)"
        }
```

### 6.4 Policy Configuration

Use policies to transform requests and responses:

| Policy | Use For | Example |
|--------|---------|---------|
| Set header | Add default headers | Content-Type: application/json |
| Update URL | Route transformation | Append /api/v2 |
| Template | Request body formatting | JSON template for POST |
| Set property | Add default parameters | Add api-version query param |
| Set host | Environment-specific host | Change between dev/prod |

---

## 7. Testing

### 7.1 Connector Testing Steps

1. **Test Authentication**
   - Create a new connection
   - Verify auth flow completes
   - Verify token stored correctly

2. **Test Each Operation**
   - Select operation in test tab
   - Enter test parameters
   - Execute and verify response
   - Check response schema populated

3. **Test Error Handling**
   - Test with invalid parameters
   - Test with expired credentials
   - Test with server errors (5xx)
   - Verify error messages are useful

4. **Test in Flow**
   - Create test flow using connector
   - Verify dynamic content appears
   - Test with real data
   - Verify error handling works

### 7.2 Testing Checklist

| Test | Status | Notes |
|------|--------|-------|
| Connection creation | [ ] | |
| Each operation succeeds | [ ] | |
| Dynamic content visible | [ ] | |
| Error responses handled | [ ] | |
| Pagination works (if applicable) | [ ] | |
| Works in Power Automate | [ ] | |
| Works in Power Apps | [ ] | |
| Different auth scenarios | [ ] | |

---

## 8. Deployment

### 8.1 Connector Deployment Steps

| Step | Action | Notes |
|------|--------|-------|
| 1 | Export connector from dev environment | Download as .json |
| 2 | Update server URL for target environment | Dev -> Test/Prod |
| 3 | Import to target environment | Via maker portal |
| 4 | Create connection in target | Authenticate |
| 5 | Update connection references in solution | Point to new connection |
| 6 | Test in target environment | Verify operations |
| 7 | Share connector with users | Set permissions |

### 8.2 Environment-Specific Configuration

Use environment variables for the host URL:

| Environment | Host URL |
|------------|----------|
| Development | https://api-dev.example.com |
| Test | https://api-test.example.com |
| Production | https://api.example.com |

---

## 9. Monitoring

| Metric | How to Monitor | Alert |
|--------|---------------|-------|
| Connection failures | Flow run history | > 5% failure rate |
| Response times | Flow run duration | > 10 seconds |
| Auth token expiry | Connection status | Before expiry |
| API availability | Health check flow | HTTP error |

---

## 10. Licensing

| Component | License Required |
|-----------|-----------------|
| Custom connector creation | None (included) |
| Using custom connector in flow | Premium (custom connector is premium) |
| Using custom connector in app | Premium |
| Connections per user | Each user needs their own connection |

> **WARNING:** Custom connectors are classified as premium connectors. Every user of a flow or app that uses a custom connector needs a premium Power Apps or Power Automate license.

---

## 11. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| API changes break connector | High | Version API, monitor changes |
| Authentication complexity | Medium | Test all auth flows thoroughly |
| Premium licensing cost | Medium | Budget for all users |
| Connector not shared correctly | Medium | Document sharing process |
| Rate limiting from API | Medium | Implement caching, throttling |
| Security (API key exposure) | High | Use OAuth when possible, secure storage |
| Performance (slow API) | Medium | Set appropriate timeouts |
