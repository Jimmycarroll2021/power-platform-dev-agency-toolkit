---
title: "External Agent Integration Template"
description: "Template for integrating external agents with Power Platform via MCP"
category: "mcp"
tags: ["mcp", "external-agents", "integration", "template"]
---

# External Agent Integration Template

## Agent Description

| Field | Value |
|-------|-------|
| Agent Name | |
| Vendor / Provider | |
| Agent Type | [ ] LLM-based [ ] Rule-based [ ] Hybrid [ ] Other |
| Hosting | [ ] Cloud (SaaS) [ ] Self-hosted [ ] Hybrid |
| Primary Language | |
| Supported Languages | |
| Version | |

### Capabilities

| Capability | Description | Confidence |
|------------|-------------|------------|
| | | |
| | | |
| | | |

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| | | |
| | | |

---

## 2. Integration Method

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Integration Diagram                       │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐  │
│  │   External   │◄────►│   MCP / API  │◄────►│  Power   │  │
│  │    Agent     │      │   Gateway    │      │ Platform │  │
│  └──────────────┘      └──────────────┘      └──────────┘  │
│         ▲                       ▲                   ▲       │
│         │                       │                   │       │
│    [Agent SDK]            [MCP Protocol]     [Custom Conn] │
│                                                              │
│  Transport: [ ] HTTP  [ ] WebSocket  [ ] gRPC  [ ] Stdio   │
│  Protocol:  [ ] MCP   [ ] REST       [ ] GraphQL [ ] SDK   │
└─────────────────────────────────────────────────────────────┘
```

### Integration Pattern

- [ ] **Agent as Orchestrator** - External agent calls Power Platform
- [ ] **Power Platform as Orchestrator** - Copilot Studio calls external agent
- [ ] **Bidirectional** - Both platforms initiate calls
- [ ] **Event-driven** - Async via message queue
- [ ] **File-based** - Shared file storage

### API Specification

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| | | | |
| | | | |
| | | | |

---

## 3. Data Flow

### Inbound (External Agent → Power Platform)

```
[External Agent]
    │
    ├──▶ Query Dataverse records
    │    └── GET /api/data/v9.2/{entity}
    │
    ├──▶ Create Dataverse record
    │    └── POST /api/data/v9.2/{entity}
    │
    ├──▶ Trigger Power Automate flow
    │    └── POST /trigger/{flow-id}
    │
    └──▶ Call custom connector
         └── POST /connector/{connector}/{action}
```

### Outbound (Power Platform → External Agent)

```
[Copilot Studio / Flow]
    │
    ├──▶ Send message to agent
    │    └── POST {agent-endpoint}/chat
    │
    ├──▶ Query agent knowledge
    │    └── POST {agent-endpoint}/query
    │
    ├──▶ Execute agent tool
    │    └── POST {agent-endpoint}/tools/{tool}
    │
    └──▶ Get agent status
         └── GET {agent-endpoint}/health
```

### Data Mapping

| Source Field | Target Field | Transformation | Notes |
|-------------|-------------|----------------|-------|
| | | | |
| | | | |
| | | | |

### PII Handling

| Data Element | Classification | Handling |
|-------------|---------------|----------|
| | | |
| | | |

---

## 4. Authentication

### Authentication Method

- [ ] API Key (header)
- [ ] API Key (query parameter)
- [ ] OAuth 2.0 (Authorization Code)
- [ ] OAuth 2.0 (Client Credentials)
- [ ] Azure AD (Application)
- [ ] Azure AD (Delegated)
- [ ] Mutual TLS (mTLS)
- [ ] JWT Token
- [ ] Basic Auth
- [ ] No authentication

### Token Flow

```
[Authentication Sequence]
    │
    ├──▶ 1. Request token
    │      POST /token
    │      { client_id, client_secret, grant_type }
    │
    ├──▶ 2. Receive token
    │      { access_token, refresh_token, expires_in }
    │
    ├──▶ 3. Use token
    │      Header: Authorization: Bearer {token}
    │
    └──▶ 4. Refresh token (before expiry)
           POST /token
           { refresh_token, grant_type: "refresh_token" }
```

### Security Requirements

- [ ] Token rotation enabled
- [ ] Token expiry < 1 hour
- [ ] Refresh token rotation
- [ ] Scope limitation
- [ ] IP allowlisting
- [ ] Request signing
- [ ] Rate limiting on auth endpoints

---

## 5. Error Handling

### Error Categories

| Category | Code Range | Example | Retry Strategy |
|----------|-----------|---------|---------------|
| Client error | 400-499 | Invalid input | No retry |
| Server error | 500-599 | Agent timeout | Exponential backoff |
| Auth error | 401, 403 | Token expired | Refresh + retry |
| Rate limit | 429 | Too many requests | Wait + retry |
| Network | N/A | Connection failed | Immediate retry |

### Error Response Format

```json
{
  "error": {
    "code": "AGENT_PROCESSING_ERROR",
    "message": "Failed to process request",
    "details": {
      "originalError": "Timeout after 30 seconds",
      "requestId": "req-abc-123",
      "timestamp": "2024-03-15T10:30:00Z"
    },
    "retryable": true,
    "suggestedAction": "Retry with longer timeout"
  }
}
```

### Fallback Behavior

| Scenario | Fallback Action | User Experience |
|----------|----------------|----------------|
| Agent unavailable | Queue for later | "Your request is queued" |
| Agent timeout | Partial response | "Here's what I found so far..." |
| Agent error | Human handoff | "Transferring to an agent..." |
| Data mismatch | Request clarification | "Could you clarify...?" |

---

## 6. Monitoring

### Metrics

| Metric | Source | Alert Threshold | Dashboard |
|--------|--------|----------------|-----------|
| Request volume | Both | > 10K/day | Yes |
| Response time p95 | Both | > 5s | Yes |
| Error rate | Both | > 2% | Yes |
| Token refresh rate | Auth | > 10/hour | No |
| Queue depth | External | > 100 | Yes |

### Health Check

```
[External Agent Health]
    │
    ├──▶ Endpoint: GET {agent-url}/health
    ├──▶ Expected: {"status": "healthy", "version": "x.y.z"}
    ├──▶ Interval: 60 seconds
    └──▶ Timeout: 10 seconds
```

### Log Correlation

```json
{
  "correlationId": "uuid-v4",
  "timestamp": "ISO-8601",
  "source": "power-platform|external-agent",
  "direction": "inbound|outbound",
  "requestId": "unique-request-id",
  "duration": 1234,
  "status": "success|error",
  "errorCode": "if applicable"
}
```

---

## 7. Rollback Plan

### Version Management

| Version | Status | Rollback Target | Notes |
|---------|--------|----------------|-------|
| Current | Active | Previous | |
| Previous | Ready | N/A | |

### Rollback Triggers

- [ ] Error rate exceeds threshold (> 5% for 10 minutes)
- [ ] Response time exceeds SLA (> 10s p95 for 15 minutes)
- [ ] Data integrity issues detected
- [ ] Security vulnerability discovered
- [ ] Business-critical functionality broken

### Rollback Procedure

```
[Emergency Rollback]
    │
    ├──▶ 1. Alert team via incident channel
    │
    ├──▶ 2. Disable integration endpoint
    │      [ ] Custom connector: disable
    │      [ ] Flow: turn off
    │      [ ] API: block traffic
    │
    ├──▶ 3. Redirect traffic to fallback
    │      [ ] Use previous agent version
    │      [ ] Enable human handoff
    │      [ ] Show maintenance message
    │
    ├──▶ 4. Preserve data
    │      [ ] Export queue contents
    │      [ ] Save in-flight requests
    │
    ├──▶ 5. Restore previous version
    │      [ ] Deploy previous connector
    │      [ ] Restore previous flow version
    │      [ ] Verify functionality
    │
    ├──▶ 6. Verify health
    │      [ ] Run smoke tests
    │      [ ] Check error rates
    │      [ ] Monitor for 30 minutes
    │
    └──▶ 7. Post-incident
         [ ] Document root cause
         [ ] Update runbook
         [ ] Schedule post-mortem
```

### Rollback Testing

| Test | Frequency | Last Run | Result |
|------|-----------|----------|--------|
| Connector disable/enable | Monthly | | |
| Flow version restore | Monthly | | |
| Fallback agent switch | Quarterly | | |
| Full DR simulation | Quarterly | | |

---

## 8. Sign-off

| Role | Name | Date | Approval |
|------|------|------|----------|
| Integration Owner | | | |
| Security Review | | | |
| Architecture Review | | | |
| Operations | | | |
| Business Owner | | | |

---

## 9. Appendix

### Reference Documents

| Document | Location |
|----------|----------|
| API Specification | |
| Authentication Guide | |
| Error Code Reference | |
| Agent Training Data | |

### Contact Information

| Role | Name | Email | Phone |
|------|------|-------|-------|
| Integration Owner | | | |
| Vendor Support | | | |
| On-call Engineer | | | |
