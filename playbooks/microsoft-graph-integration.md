# Microsoft Graph Integration Playbook

> **Complexity Rating:** Medium
> **Last Updated:** 2024
> **Applies To:** Microsoft Graph API, Power Platform, Power Automate, Power Apps

---

## 1. When to Use Microsoft Graph

Use Microsoft Graph when you need:

| Scenario | Graph API Endpoint |
|----------|-------------------|
| Read/update user profiles | /users |
| Manage calendar events | /users/{id}/calendar |
| Send emails | /users/{id}/sendMail |
| Access Teams messages/channels | /teams, /channels |
| Read SharePoint files/lists | /sites, /drives |
| Manage groups and memberships | /groups |
| Access OneDrive files | /drives |
| Read organizational hierarchy | /users/{id}/manager |
| Manage to-do tasks | /todo/lists |
| Access planner tasks | /planner |
| Read audit logs | /auditLogs |
| Manage devices | /devices |

### Decision Matrix

| Need | Microsoft Graph | Built-in Connector | Custom Connector |
|------|----------------|-------------------|-----------------|
| User/Group management | Yes (native) | Office 365 Users (limited) | No |
| Send email | Yes | Office 365 Outlook (easier) | No |
| Calendar management | Yes | Office 365 Outlook (easier) | No |
| Teams deep integration | Yes | Teams connector (basic) | For custom |
| File operations | Yes | OneDrive/SharePoint (easier) | No |
| Directory management | Yes (only way) | N/A | N/A |
| Advanced queries | Yes | Limited | No |

---

## 2. When NOT to Use Microsoft Graph Directly

> **DO NOT use Graph API directly when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Simple email sending | Office 365 Outlook connector | Simpler, no auth setup |
| Simple calendar read | Office 365 Outlook connector | Easier to configure |
| File upload/download | OneDrive/SharePoint connector | Built-in, simpler |
| Teams notification | Teams connector | One action vs. Graph call |
| Basic user lookup | Office 365 Users connector | No custom auth needed |
| Operations available in built-in connector | Built-in connector | Less setup, maintained by Microsoft |

---

## 3. Authentication

### 3.1 Authentication Methods

| Method | Use When | Complexity |
|--------|----------|------------|
| Delegated (user context) | Acting on behalf of user | Medium |
| Application (app-only) | Background/automated processes | Medium |
| On-behalf-of | Middle-tier services | High |

### 3.2 Application Registration

```
Step 1: Register App in Azure AD
  Azure Portal > App registrations > New registration
  - Name: "Power Platform Graph Integration"
  - Supported account types: Single tenant (or multi-tenant)
  - Redirect URI: https://global.aadg.windows.net/... (for delegated)

Step 2: Configure API Permissions
  API Permissions > Add permission > Microsoft Graph
  
  For delegated:
    - User.Read (basic profile)
    - Mail.Send (send email)
    - Calendars.ReadWrite (calendar)
    - Group.Read.All (groups)
    - Directory.Read.All (directory)
  
  For application:
    - Application permissions (admin consent required)
    - User.Read.All
    - Mail.Send
    - Group.Read.All

Step 3: Grant Admin Consent
  Click "Grant admin consent for [tenant]"
  Required for application permissions

Step 4: Create Client Secret or Certificate
  Certificates & secrets > New client secret
  Note: Store securely (Azure Key Vault)
```

### 3.3 Power Automate Connection Setup

```
Option 1: HTTP connector with Azure AD OAuth
  - Connector: HTTP
  - Authentication: Active Directory OAuth
  - Tenant: [tenant-id]
  - Audience: https://graph.microsoft.com
  - Client ID: [app-id]
  - Credential type: Secret or Certificate
  - Secret: [client-secret]

Option 2: Custom connector
  - Create custom connector with OAuth 2.0
  - Identity Provider: Azure AD
  - Resource URL: https://graph.microsoft.com

Option 3: Use built-in connectors (preferred for simple ops)
  - Office 365 Users
  - Office 365 Outlook
  - Microsoft Teams
```

---

## 4. Common Operations

### 4.1 User Operations

| Operation | Method | Endpoint | Permissions |
|-----------|--------|----------|-------------|
| Get current user | GET | /me | User.Read |
| Get user by ID | GET | /users/{id} | User.Read.All |
| Get user manager | GET | /users/{id}/manager | User.Read.All |
| Get direct reports | GET | /users/{id}/directReports | User.Read.All |
| Get user photo | GET | /users/{id}/photo/$value | User.Read.All |
| Search users | GET | /users?$search="name" | User.Read.All |
| Update user | PATCH | /users/{id} | User.ReadWrite.All |
| Get group members | GET | /groups/{id}/members | GroupMember.Read.All |

### 4.2 Mail Operations

| Operation | Method | Endpoint | Permissions |
|-----------|--------|----------|-------------|
| Send email | POST | /users/{id}/sendMail | Mail.Send |
| Get messages | GET | /users/{id}/messages | Mail.Read |
| Create draft | POST | /users/{id}/messages | Mail.ReadWrite |
| Get mail folders | GET | /users/{id}/mailFolders | Mail.Read |

### 4.3 Calendar Operations

| Operation | Method | Endpoint | Permissions |
|-----------|--------|----------|-------------|
| Get events | GET | /users/{id}/calendar/events | Calendars.Read |
| Create event | POST | /users/{id}/calendar/events | Calendars.ReadWrite |
| Update event | PATCH | /users/{id}/calendar/events/{eventId} | Calendars.ReadWrite |
| Delete event | DELETE | /users/{id}/calendar/events/{eventId} | Calendars.ReadWrite |
| Get availability | POST | /users/{id}/calendar/getSchedule | Calendars.Read |

### 4.4 Teams Operations

| Operation | Method | Endpoint | Permissions |
|-----------|--------|----------|-------------|
| Get teams | GET | /me/joinedTeams | Team.ReadBasic.All |
| Get channels | GET | /teams/{id}/channels | Channel.ReadBasic.All |
| Send channel message | POST | /teams/{id}/channels/{id}/messages | ChannelMessage.Send |
| Create chat | POST | /chats | Chat.Create |
| Send chat message | POST | /chats/{id}/messages | ChatMessage.Send |

### 4.5 SharePoint/OneDrive Operations

| Operation | Method | Endpoint | Permissions |
|-----------|--------|----------|-------------|
| Get sites | GET | /sites | Sites.Read.All |
| Get drives | GET | /sites/{id}/drives | Sites.Read.All |
| Get files | GET | /drives/{id}/root/children | Files.Read.All |
| Upload file | PUT | /drives/{id}/items/{id}/content | Files.ReadWrite |
| Download file | GET | /drives/{id}/items/{id}/content | Files.Read.All |

---

## 5. Error Handling

### 5.1 Common Error Codes

| Status Code | Meaning | Handling |
|-------------|---------|----------|
| 400 | Bad Request | Check request format, parameters |
| 401 | Unauthorized | Check token, permissions, consent |
| 403 | Forbidden | Insufficient permissions, check scopes |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Throttling - implement backoff |
| 500 | Internal Server Error | Retry with exponential backoff |
| 503 | Service Unavailable | Retry after delay |

### 5.2 Error Handling Pattern

```
[HTTP Request to Graph]
       |
       v
[Parse Response]
       |
       v
[Check Status Code]
       |
   +---+---+
   |       |
  2xx    Error
   |       |
   v       v
[Process] [Check Error Code]
              |
              +--401--> [Refresh token, retry]
              +--403--> [Log permission issue, alert admin]
              +--404--> [Handle not found]
              +--429--> [Exponential backoff, retry]
              +--5xx--> [Retry with delay, alert if persists]
              +--Other-> [Log, alert, fail gracefully]
```

---

## 6. Throttling

### 6.1 Throttling Limits

| Resource | Limit | Per |
|----------|-------|-----|
| General | 10,000 requests | Per 10 minutes per app per tenant |
| Mail send | 10,000 requests | Per 10 minutes per mailbox |
| Calendar | 10,000 requests | Per 10 minutes per mailbox |
| User profile | 15,000 requests | Per 10 minutes per app |
| File operations | 15,000 requests | Per 10 minutes per app |

### 6.2 Throttling Handling

| Strategy | Implementation |
|----------|---------------|
| Rate limiting | Max X requests per minute in flow |
| Exponential backoff | Retry after 1s, 2s, 4s, 8s, 16s |
| Batching | Batch operations where possible |
| Caching | Cache user lookups, don't repeat |
| Delta query | Use delta tokens for incremental sync |

### 6.3 Throttling Headers

| Header | Purpose |
|--------|---------|
| Retry-After | Seconds to wait before retry |
| RateLimit-Limit | Request limit |
| RateLimit-Remaining | Remaining requests |
| RateLimit-Reset | Unix timestamp when limit resets |

---

## 7. Development Steps

### 7.1 Implementation Checklist

- [ ] Identify required Graph operations
- [ ] Register app in Azure AD
- [ ] Configure API permissions
- [ ] Grant admin consent
- [ ] Choose authentication method
- [ ] Set up connection in Power Platform
- [ ] Build/test each operation
- [ ] Implement error handling
- [ ] Implement throttling handling
- [ ] Add logging
- [ ] Test with real data
- [ ] Document permissions required

### 7.2 Sample Power Automate Pattern

```
[Trigger]
  |
  v
[HTTP: GET https://graph.microsoft.com/v1.0/users/{id}]
  |-- Authentication: Active Directory OAuth
  |
  v
[Parse JSON: Response]
  |
  v
[Condition: Status = 200?]
  |--YES-->[Process user data]
  |--NO--->[Handle error]
```

---

## 8. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Authentication | Test connection | Token acquired, requests succeed |
| Each operation | Execute individually | Correct response |
| Error scenarios | Force errors | Handled gracefully |
| Throttling | Rapid requests | Backoff works, no data loss |
| Token expiry | Wait for expiry | Auto-refresh works |
| Permission changes | Remove permission | Graceful 403 handling |
| Large datasets | Pagination test | All records retrieved |

---

## 9. Licensing

| Component | License Required |
|-----------|-----------------|
| Graph API access | Microsoft 365 license (for delegated) |
| Application permissions | Azure AD (no additional license) |
| HTTP connector in flow | Premium (if using HTTP directly) |
| Built-in connectors | Standard (included with M365) |

---

## 10. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Token expiry/refresh failure | High | Monitor, implement retry |
| Throttling | Medium | Rate limiting, backoff |
| Permission changes | High | Monitor, alert on 403s |
| API version deprecation | Medium | Stay current, monitor announcements |
| Admin consent revoked | Critical | Monitor, alert immediately |
| PII exposure in logs | High | Sanitize logs, don't log tokens |
| Over-permissioned app | High | Least privilege principle |
| Paging large result sets | Low | Implement delta queries |
