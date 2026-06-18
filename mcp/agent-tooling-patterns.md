---
title: "Agent Tooling Patterns with MCP"
description: "Patterns for designing agent tools using MCP in Power Platform"
category: "mcp"
tags: ["mcp", "agent-tooling", "tools", "actions", "patterns"]
---

# Agent Tooling Patterns with MCP

## 1. Tool Design Principles

### Core Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| Single Responsibility | Each tool does one thing | One MCP tool per operation |
| Idempotency | Same input = same output | No side effects on repeated calls |
| Discoverability | Tool purpose is clear | Descriptive names and descriptions |
| Error Clarity | Failures are actionable | Structured error with remediation |
| Input Validation | Reject bad input early | Schema validation on entry |

### Tool Naming Convention

```
<domain>_<resource>_<action>

Examples:
  dataverse_account_create
  sharepoint_document_search
  graph_calendar_getevents
  salesforce_opportunity_update
```

---

## 2. Action vs Connector vs MCP Tool Comparison

### Decision Matrix

| Criteria | Power Automate Action | Custom Connector | MCP Tool |
|----------|----------------------|------------------|----------|
| Complexity | Low-Medium | Medium | Medium-High |
| External API | Via built-in connectors | Direct HTTP | Via MCP protocol |
| Reusability | Within flows | Across flows/apps | Across agents/platforms |
| Setup effort | Low | Medium | High |
| Runtime | Cloud flow | Connector API | MCP server |
| State management | Flow variables | Connection refs | MCP context |
| Error handling | Built-in scopes | HTTP status codes | MCP error protocol |
| Best for | Quick automation | Stable integrations | Dynamic tool discovery |

### When to Use Each

```
Scenario: Send an email
  → Power Automate Action (Office 365 connector)
  Reason: Built-in, simple, reliable

Scenario: Call internal REST API
  → Custom Connector
  Reason: Direct integration, reusable

Scenario: Dynamic tool discovery by AI agent
  → MCP Tool
  Reason: Agent can discover and invoke dynamically

Scenario: Complex multi-step business process
  → Power Automate Action (child flow)
  Reason: Orchestration, error handling, retries
```

---

## 3. When to Use MCP vs Custom Connectors

### Use MCP When

- The tool set changes frequently
- You need dynamic tool discovery
- The same tools are used across multiple AI platforms
- You want standardized error handling
- The tool provider offers an MCP server

### Use Custom Connectors When

- The API is stable and well-documented
- You need tight Power Platform integration
- Authentication is complex (multi-step OAuth)
- You need to support non-AI use cases (traditional flows)
- Performance is critical (no MCP overhead)

### Hybrid Pattern

```
┌─────────────────────────────────────────┐
│          Power Platform                  │
│                                          │
│  ┌─────────────┐   ┌─────────────────┐ │
│  │ Custom      │   │ MCP Wrapper     │ │
│  │ Connector   │   │ (Azure Function)│ │
│  │ (Direct)    │   │                 │ │
│  └──────┬──────┘   └────────┬────────┘ │
│         │                    │          │
│         ▼                    ▼          │
│  ┌───────────────────────────────────┐  │
│  │      Power Automate Flow          │  │
│  │      (Orchestration Layer)        │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│                  ▼                       │
│  ┌───────────────────────────────────┐  │
│  │      Copilot Studio Agent         │  │
│  │      (Tool Consumer)              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 4. Security Boundaries

### Authentication Flow

```
User → Copilot Studio Agent
  │
  ├──▶ Direct Action (OAuth)
  │    User context passed through
  │
  ├──▶ Service Account Action
  │    Pre-configured credentials
  │    No user context
  │
  └──▶ MCP Tool
       ├── OAuth via MCP client
       │   Token managed by MCP layer
       │
       └── Service Principal
           Managed identity or SP
```

### Permission Matrix

| Tool Type | Who Authenticates | Risk Level | Mitigation |
|-----------|------------------|------------|------------|
| User-delegated | End user | Low | OAuth consent |
| Service account | System | Medium | Credential vault, rotation |
| MCP delegated | MCP client | Medium | MCP auth protocol |
| Anonymous | None | High | IP restriction, API keys |

### Data Handling

```
Sensitive Data Checklist:
□ No PII in tool names or descriptions
□ Input/output logged only if non-sensitive
□ Encryption in transit (TLS 1.2+)
□ Encryption at rest for cached data
□ Data residency compliance (GDPR, etc.)
□ Audit trail for all tool invocations
```

---

## 5. Implementation Patterns

### Pattern 1: Direct MCP Tool

```json
{
  "name": "dataverse_query_records",
  "description": "Query records from a Dataverse table. Returns matching records with specified columns.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "table": {
        "type": "string",
        "description": "Logical name of the Dataverse table"
      },
      "columns": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Columns to retrieve"
      },
      "filter": {
        "type": "string",
        "description": "OData filter expression"
      },
      "top": {
        "type": "integer",
        "description": "Maximum number of records",
        "default": 50
      }
    },
    "required": ["table", "columns"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "records": {"type": "array"},
      "count": {"type": "integer"},
      "nextLink": {"type": "string"}
    }
  }
}
```

### Pattern 2: MCP Wrapper Flow

```
[Copilot Studio calls Action]
  │
  ▼
[Power Automate Flow: MCP_Proxy]
  Inputs: toolName, toolParameters
  │
  ├──▶ [Switch: toolName]
  │
  ├──▶ Case "query_dataverse"
  │    [HTTP to MCP Server]
  │    [Parse Response]
  │    [Format for Agent]
  │    [Return]
  │
  ├──▶ Case "search_documents"
  │    [HTTP to MCP Server]
  │    [Parse Response]
  │    [Return]
  │
  └──▶ Default
       [Return error: Unknown tool]
```

### Pattern 3: Multi-Tool Orchestration

```
[Agent Goal: "Create a support ticket with customer context"]
  │
  ├──▶ Tool 1: dataverse_get_contact
  │    Input: email = user email
  │    Output: contact record
  │
  ├──▶ Tool 2: dataverse_get_account
  │    Input: accountId = contact.parentAccountId
  │    Output: account record
  │
  ├──▶ Tool 3: dataverse_create_ticket
  │    Input: {
  │      title: "Issue reported",
  │      contactId: contact.id,
  │      accountId: account.id,
  │      priority: "Medium"
  │    }
  │    Output: ticket record
  │
  └──▶ Tool 4: graph_send_email
       Input: {
         to: support@example.com,
         subject: "New ticket #{ticket.number}",
         body: "Details..."
       }
```

---

## 6. Error Handling Patterns

### Structured Error Response

```json
{
  "error": true,
  "errorType": "validation_error",
  "message": "Table 'contoso_accounts' does not exist",
  "code": "TABLE_NOT_FOUND",
  "suggestions": [
    "Check the table name spelling",
    "Verify you have access to this table",
    "Available tables: account, contact, opportunity"
  ],
  "retryable": false,
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### Retry Pattern

```
[Invoke MCP Tool]
  │
  ├──▶ Success → Return result
  │
  └──▶ Error
       │
       ├──▶ Retryable? (network, timeout, rate limit)
       │    ├── Yes → [Wait: exponential backoff]
       │    │         [Retry: max 3 times]
       │    │         [Success → return]
       │    │         [Fail → escalate]
       │    └── No → [Return error to agent]
       │
       └──▶ Not retryable
            [Return error with suggestions]
```

---

## 7. Monitoring Tool Usage

### Metrics to Track

| Metric | Why | Alert Threshold |
|--------|-----|----------------|
| Tool call volume | Capacity planning | > 10K/day |
| Error rate | Reliability | > 5% errors |
| Latency p95 | User experience | > 5 seconds |
| Unique tools used | Adoption | < 3 tools / agent |
| Retry rate | Stability | > 10% retries |

### Logging Pattern

```json
{
  "timestamp": "2024-03-15T10:30:00Z",
  "correlationId": "abc-123-def",
  "agentId": "support-agent-v2",
  "sessionId": "session-456",
  "toolInvocation": {
    "toolName": "dataverse_query_records",
    "inputHash": "sha256:a1b2c3...",
    "duration": 2340,
    "success": true,
    "recordsReturned": 5
  },
  "mcpServer": "dataverse-mcp-prod.eastus.azurecontainer.io"
}
```
