---
title: "Copilot Studio MCP Integration Notes"
description: "MCP (Model Context Protocol) integration notes for Copilot Studio"
category: "mcp"
tags: ["mcp", "copilot-studio", "integration", "model-context-protocol"]
---

# Copilot Studio MCP Integration Notes

## 1. Current MCP Support Status

### Overview

Model Context Protocol (MCP) is an open protocol that enables AI agents to connect to external tools and data sources. As of the current release:

| Feature | Status | Notes |
|---------|--------|-------|
| MCP server consumption | Preview | Via custom connector or code |
| MCP tool exposure | Not native | Use custom actions instead |
| Built-in MCP servers | Limited | Community growing |
| Authentication via MCP | Partial | OAuth 2.0 supported |

### What MCP Means for Copilot Studio

MCP allows Copilot Studio agents to:
- Access external tools through a standardized protocol
- Maintain context across tool invocations
- Discover available tools dynamically
- Handle errors consistently

---

## 2. Available MCP Servers

### Official/Well-Known Servers

| Server | Provider | Capabilities | Authentication |
|--------|----------|-------------|----------------|
| Filesystem | Anthropic | Read/write local files | Local access |
| GitHub | Anthropic | Repos, issues, PRs | GitHub token |
| PostgreSQL | Anthropic | Database queries | DB credentials |
| Slack | Anthropic | Messages, channels | Slack OAuth |
| Brave Search | Brave | Web search | API key |
| Google Maps | Community | Geocoding, directions | API key |
| Azure DevOps | Community | Work items, repos | AAD token |

### Power Platform-Relevant MCP Servers

```
Microsoft Graph MCP:
  Capabilities:
    - Read/write user profiles
    - Access calendar events
    - Send emails
    - Read Teams messages
  Authentication: Azure AD

Dynamics 365 MCP (community):
  Capabilities:
    - Query Dataverse tables
    - Create/update records
    - Execute custom APIs
  Authentication: OAuth 2.0

SharePoint MCP:
  Capabilities:
    - List documents
    - Read file contents
    - Upload files
  Authentication: AAD
```

---

## 3. Configuration Steps

### Option A: MCP via Custom Connector

```
Step 1: Set up MCP server
  - Install MCP server package
  - Configure environment variables
  - Start server (stdio or HTTP transport)

Step 2: Create custom connector in Power Platform
  - OpenAPI spec from MCP server capabilities
  - Configure authentication
  - Test connection

Step 3: Use in Copilot Studio
  - Add connector as action
  - Map MCP tools to agent actions
  - Configure error handling
```

### Option B: MCP via Power Automate Flow

```
[Copilot Studio Action: "Query Dataverse"]
  │
  ▼
[Power Automate Flow: MCP Proxy]
  │
  ├──▶ [HTTP Request to MCP Server]
  │      Endpoint: http://mcp-server:8080/query
  │      Body: {
  │        "tool": "dataverse_query",
  │        "params": {
  │          "table": "accounts",
  │          "filter": "name eq 'Contoso'"
  │        }
  │      }
  │
  ├──▶ [Parse JSON Response]
  │
  └──▶ [Return to Copilot Studio]
         {
           "records": [...],
           "count": 1
         }
```

### Step-by-Step: GitHub MCP Integration

```powershell
# 1. Install MCP server
npm install -g @anthropai/mcp-server-github

# 2. Set environment variable
$env:GITHUB_TOKEN = "ghp_your_token_here"

# 3. Start server (stdio mode)
mcp-server-github

# 4. In Copilot Studio:
#    - Create custom connector pointing to MCP bridge
#    - Add actions: get_issue, create_issue, list_prs
#    - Map to agent topics
```

---

## 4. Authentication Considerations

### MCP Auth Patterns

```
Pattern 1: API Key
  - Key stored in environment variable
  - Passed in request header
  - Simple but limited security

Pattern 2: OAuth 2.0
  - Token managed by MCP client
  - Refresh token support
  - Recommended for production

Pattern 3: Azure AD
  - Service principal or managed identity
  - Token via Azure Identity library
  - Best for Microsoft ecosystem
```

### Securing MCP Connections

```yaml
# Recommended: Azure Container Instance with VNet
mcp-server:
  image: mcp/d365-server:latest
  environment:
    D365_URL: https://org.crm.dynamics.com
    AZURE_CLIENT_ID: ${sp-client-id}
    AZURE_CLIENT_SECRET: ${sp-secret}
    AZURE_TENANT_ID: ${tenant-id}
  network:
    vnet: /subscriptions/.../vnets/mcp-vnet
    subnet: mcp-subnet
  security:
    allowTrafficFrom: [copilot-studio-ip-range]
```

---

## 5. Limitations and Workarounds

### Current Limitations

| Limitation | Workaround |
|-----------|------------|
| No native MCP support in Copilot Studio | Use custom connectors or flows as bridge |
| MCP servers run outside Power Platform | Host in Azure Container Instances or Functions |
| No built-in MCP discovery | Document available tools manually |
| Stateful sessions not supported | Use conversation variables to track context |
| Limited error handling in MCP | Wrap in Power Automate with retry logic |

### Transport Options

```
Stdio Transport:
  Pros: Simple, local execution
  Cons: Not scalable, requires process management
  Use for: Development, single-user scenarios

HTTP/SSE Transport:
  Pros: Scalable, network-accessible
  Cons: Requires hosting infrastructure
  Use for: Production, multi-agent scenarios

Azure Function Transport:
  Pros: Serverless, managed, scalable
  Cons: Cold start latency
  Use for: Production Power Platform integration
```

### Context Window Management

```
Problem: MCP tools can return large data sets
         that exceed token limits.

Solutions:
1. Pagination: Request data in chunks
2. Filtering: Send filter criteria to MCP server
3. Summarization: Pre-process large responses
4. Lazy loading: Fetch data only when needed
```

---

## 6. Reference Architecture

```
┌─────────────────────────────────────────────────────┐
│              Copilot Studio Agent                    │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │   Topics     │    │      Custom Actions       │   │
│  │              │◄──►│  (MCP Client Wrapper)    │   │
│  └──────────────┘    └──────────────────────────┘   │
│                              │                       │
└──────────────────────────────┼───────────────────────┘
                               │ HTTP
                    ┌──────────▼──────────┐
                    │   Azure Function    │
                    │   (MCP Bridge)      │
                    └──────────┬──────────┘
                               │ MCP Protocol
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │ MCP Svr 1 │   │ MCP Svr 2 │   │ MCP Svr 3 │
        │  (Graph)  │   │  (Datavs) │   │  (GitHub) │
        └───────────┘   └───────────┘   └───────────┘
```

---

## 7. Getting Started Checklist

- [ ] Identify which MCP servers are relevant
- [ ] Set up MCP server hosting (Azure recommended)
- [ ] Configure authentication (Azure AD preferred)
- [ ] Create custom connector in Power Platform
- [ ] Test connectivity from Copilot Studio
- [ ] Map MCP tools to agent topics/actions
- [ ] Implement error handling and retries
- [ ] Document available tools for agent designers
- [ ] Set up monitoring for MCP connections
- [ ] Plan for MCP server updates/maintenance
