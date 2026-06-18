# Custom Connector Design Prompt

## Purpose
Use this prompt to design custom connectors for Power Platform. Copy and paste into your AI coding agent to produce comprehensive OpenAPI specifications, authentication configurations, and operation definitions.

## Instructions for AI Agent

You are a Power Platform integration specialist. Your task is to design a custom connector that enables Power Apps and Power Automate to communicate with an external REST API. The design must include a complete OpenAPI specification, authentication setup, operation definitions, error handling, and deployment guidance.

### Input Gathering

Before generating the specification, confirm or gather:

```
API Context:
  - API name: [API_NAME]
  - API base URL: [BASE_URL]
  - API documentation URL: [DOCS_URL]
  - API version: [VERSION]
  - Protocol: [REST | SOAP | GRAPHQL]

Authentication:
  - Auth type: [OAUTH2 | API_KEY | BASIC | AAD | NONE]
  - OAuth flow: [AUTHORIZATION_CODE | CLIENT_CREDENTIALS | IMPLICIT]
  - Token URL: [TOKEN_ENDPOINT]
  - Authorization URL: [AUTH_ENDPOINT]
  - Scopes required: [SCOPES]
  - API key location: [HEADER | QUERY]
  - API key name: [PARAM_NAME]

Operations Needed:
  - List/Get operations: [ENDPOINTS]
  - Create operations: [ENDPOINTS]
  - Update operations: [ENDPOINTS]
  - Delete operations: [ENDPOINTS]
  - Custom/Special operations: [ENDPOINTS]

Technical Constraints:
  - Rate limits: [REQUESTS_PER_TIME]
  - Payload size limit: [MAX_SIZE]
  - Timeout: [TIMEOUT_SECONDS]
  - Webhook support: [YES | NO]
  - Pagination style: [OFFSET | CURSOR | TOKEN]

Environment:
  - Deployment type: [CLOUD | ON_PREMISES | HYBRID]
  - Gateway required: [YES | NO]
  - Firewall considerations: [NOTES]
  - Data sensitivity: [PUBLIC | INTERNAL | CONFIDENTIAL]
```

### Specification Structure

#### 1. Connector Header

```markdown
# Custom Connector Specification: [Connector Name]

| Attribute | Value |
|-----------|-------|
| Project | [PROJECT_NAME] |
| Connector Name | [CONNECTOR_NAME] |
| API Base URL | [BASE_URL] |
| Version | [API_VERSION] |
| Auth Type | [AUTHENTICATION_TYPE] |
| Author | [AUTHOR] |
| Date | [DATE] |
| Status | [DRAFT | REVIEW | APPROVED] |
```

#### 2. Authentication Specification

```markdown
### Authentication Configuration

#### Option A: OAuth 2.0
```yaml
securityDefinitions:
  oauth2:
    type: oauth2
    flow: accessCode
    authorizationUrl: [AUTHORIZATION_URL]
    tokenUrl: [TOKEN_URL]
    scopes:
      [SCOPE_1]: [Description]
      [SCOPE_2]: [Description]
```

Client Configuration:
| Parameter | Value | Notes |
|-----------|-------|-------|
| Client ID | [ID] | From app registration |
| Client Secret | [SECRET] | Stored in Azure Key Vault |
| Redirect URL | [URL] | Power Platform redirect |
| Scope | [SCOPES] | Space-separated |

#### Option B: API Key
```yaml
securityDefinitions:
  apiKey:
    type: apiKey
    in: header
    name: [HEADER_NAME]
```

Configuration:
| Parameter | Value |
|-----------|-------|
| Key Name | [PARAM_NAME] |
| Location | Header / Query |
| Key Value | [STORED_IN_KEY_VAULT] |
| Rotation Schedule | [FREQUENCY] |

#### Option C: Azure AD Service Principal
```yaml
securityDefinitions:
  aad:
    type: oauth2
    flow: application
    tokenUrl: https://login.microsoftonline.com/[TENANT]/oauth2/v2.0/token
    scopes:
      [API_URI]/.default: Default scope
```

Configuration:
| Parameter | Value |
|-----------|-------|
| Tenant ID | [TENANT_ID] |
| Application ID | [APP_ID] |
| Client Secret | [KEY_VAULT_REFERENCE] |
| Resource | [API_APP_ID_URI] |
```

#### 3. OpenAPI Specification

```markdown
### Complete OpenAPI Definition

```yaml
swagger: '2.0'
info:
  title: [Connector Display Name]
  description: [Connector description]
  version: '1.0'
  contact:
    name: [Support contact]
host: [api.host.com]
basePath: [/api/v1]
schemes:
  - https
consumes:
  - application/json
produces:
  - application/json

securityDefinitions:
  [AUTH_TYPE]:
    [AUTH_CONFIGURATION]

paths:
  [ENDPOINT_PATH]:
    [METHOD]:
      operationId: [UniqueId]
      summary: [Short description]
      description: [Detailed description]
      security:
        - [AUTH_TYPE]: [[scopes]]
      parameters:
        - name: [paramName]
          in: [path | query | header | body]
          type: [string | integer | boolean | number]
          required: [true | false]
          description: [Parameter description]
          x-ms-summary: [Display name for Power Platform]
      responses:
        '200':
          description: Success
          schema:
            type: object
            properties:
              [field]:
                type: [type]
                description: [description]
        '400':
          description: Bad Request
          schema:
            $ref: '#/definitions/Error'
        '401':
          description: Unauthorized
        '429':
          description: Too Many Requests
        '500':
          description: Server Error

definitions:
  [ModelName]:
    type: object
    properties:
      [field]:
        type: [type]
        description: [description]
  
  Error:
    type: object
    properties:
      code:
        type: string
      message:
        type: string
      details:
        type: string
```
```

#### 4. Operation Catalog

```markdown
### Operations

| Operation | Method | Path | Description | Visibility |
|-----------|--------|------|-------------|------------|
| List[Items] | GET | /items | Retrieves a list of [items] | Important |
| Get[Item] | GET | /items/{id} | Retrieves a specific [item] by ID | Important |
| Create[Item] | POST | /items | Creates a new [item] | Important |
| Update[Item] | PUT | /items/{id} | Updates an existing [item] | Important |
| Delete[Item] | DELETE | /items/{id} | Deletes a [item] | Advanced |
| Search[Items] | GET | /items/search | Searches [items] by criteria | Important |

### Detailed Operation Specifications

#### Operation: List[Items]

```yaml
operationId: ListItems
summary: List all [items]
description: Retrieves a paginated list of [items] with optional filtering
parameters:
  - name: filter
    in: query
    type: string
    required: false
    description: OData filter expression
  - name: top
    in: query
    type: integer
    required: false
    description: Number of items to return (max 1000)
    default: 100
  - name: skip
    in: query
    type: integer
    required: false
    description: Number of items to skip (pagination)
  - name: orderby
    in: query
    type: string
    required: false
    description: Sort expression
responses:
  '200':
    description: List of items
    schema:
      type: object
      properties:
        value:
          type: array
          items:
            $ref: '#/definitions/[Item]'
        @odata.nextLink:
          type: string
          description: URL for next page of results
```

#### Operation: Create[Item]

```yaml
operationId: CreateItem
summary: Create a new [item]
description: Creates a new [item] with the provided properties
parameters:
  - name: body
    in: body
    required: true
    schema:
      $ref: '#/definitions/[Item]Create'
responses:
  '201':
    description: Item created
    schema:
      $ref: '#/definitions/[Item]'
  '400':
    description: Validation error
```
```

#### 5. Policy Configuration

```markdown
### Connector Policies

| Policy | Type | Configuration | Purpose |
|--------|------|---------------|---------|
| Retry | Retry | Count: 3, Interval: 2s, Exponential | Handle transient failures |
| Timeout | Timeout | 60 seconds | Prevent hanging requests |
| Rate Limit | Rate-limit | Calls: 100, Period: 60s | Respect API limits |
| Caching | Cache | Duration: 300s | Cache GET responses |

### Policy Templates

```xml
<!-- Retry policy -->
<retry count="3" interval="2" max-interval="30" delta="2"
       first-fast-retry="false">
  <retry-on status-code="429" />
  <retry-on status-code="500" />
  <retry-on status-code="502" />
  <retry-on status-code="503" />
</retry>

<!-- Rate limit policy -->
<rate-limit calls="[MAX_CALLS]" renewal-period="[SECONDS]" />

<!-- Timeout policy -->
<timeout duration="[SECONDS]" />
```
```

#### 6. Error Handling

```markdown
### Error Response Mapping

| HTTP Status | Power Platform Behavior | User Message |
|-------------|------------------------|--------------|
| 200 OK | Success | (Normal processing) |
| 400 Bad Request | Action fails with error | "Invalid request: [details]" |
| 401 Unauthorized | Connection needs refresh | "Authentication expired. Please reconnect." |
| 403 Forbidden | Action fails | "You don't have permission to perform this action." |
| 404 Not Found | Action fails | "[Resource] not found." |
| 429 Too Many Requests | Auto-retry then fail | "Service is busy. Please try again later." |
| 500 Server Error | Retry then fail | "Service temporarily unavailable." |
| 503 Service Unavailable | Retry then fail | "Service is down for maintenance." |
```

#### 7. Pagination Handling

```markdown
### Pagination Strategy

**Style**: [Offset | Cursor | Token]

**Implementation**:
```
IF Offset pagination:
  - Parameter: $skip
  - Parameter: $top
  - Loop: Increment skip by top until no more results
  
IF Cursor/Token pagination:
  - Parameter: $cursor or $token
  - Response includes next cursor/token
  - Loop: Use next cursor until null
  
IF None (no pagination):
  - Document limitation
  - Warn about large dataset handling
```
```

#### 8. Deployment Guide

```markdown
### Deployment Steps

1. **Export Connector Package**
   - Open custom connector in Power Platform
   - Export as .zip file

2. **Import to Target Environment**
   - Go to Data -> Custom Connectors
   - Import .zip file
   - Update base URL for target environment

3. **Configure Connections**
   - Create connection using appropriate credentials
   - Test connection
   - Verify authentication works

4. **Update Flows/Apps**
   - Update all flows to use new connection reference
   - Test sample operations

5. **Post-Deployment Verification**
   - Execute each operation
   - Verify response schemas
   - Test error handling
   - Confirm pagination works
```

### Quality Checklist

- [ ] OpenAPI spec is valid (use Swagger editor to verify)
- [ ] All operations have operationId
- [ ] All parameters have descriptions
- [ ] Response schemas are complete
- [ ] Authentication is configured correctly
- [ ] Error responses are documented
- [ ] Pagination is handled
- [ ] Rate limiting policies applied
- [ ] Deployment guide is complete

## Customization Variables

- `[API_NAME]`: Name of the external API
- `[CONNECTOR_NAME]`: Name for the custom connector
- `[BASE_URL]`: API base URL
- `[AUTH_TYPE]`: Authentication method

## Important Notes

- Validate OpenAPI spec using Swagger Editor before deployment
- Test each operation with real API calls before sharing
- Document API version dependencies
- Plan for API deprecation (version pinning)
- **Cross-check against current Microsoft Learn**: Verify custom connector capabilities, authentication options, and policy support against current Microsoft documentation.
