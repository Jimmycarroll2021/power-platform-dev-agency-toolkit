---
title: "MCP Server Evaluation Template"
description: "Template for evaluating MCP servers for Power Platform integration"
category: "mcp"
tags: ["mcp", "evaluation", "template", "assessment"]
---

# MCP Server Evaluation Template

## Server Identification

| Field | Value |
|-------|-------|
| Server Name | |
| Provider / Author | |
| Version Evaluated | |
| Repository URL | |
| Documentation URL | |
| License | |
| Evaluation Date | |
| Evaluated By | |

---

## 1. Capabilities Assessment

### Available Tools

| Tool Name | Description | Input Parameters | Output Format | Notes |
|-----------|-------------|-----------------|---------------|-------|
| | | | | |
| | | | | |
| | | | | |

### Capability Coverage

- [ ] Read operations (GET)
- [ ] Write operations (POST/PUT)
- [ ] Delete operations
- [ ] Search / Query
- [ ] File operations
- [ ] Batch operations
- [ ] Real-time / Streaming
- [ ] Webhook support

### Data Types Supported

- [ ] Text
- [ ] JSON
- [ ] Binary / Files
- [ ] Structured data (tables)
- [ ] Images
- [ ] Streaming data

---

## 2. Authentication Requirements

### Supported Auth Methods

| Method | Supported | Notes |
|--------|-----------|-------|
| API Key | | |
| OAuth 2.0 | | |
| Basic Auth | | |
| Azure AD | | |
| Managed Identity | | |
| No auth (local) | | |

### Token Management

- [ ] Automatic token refresh
- [ ] Token caching
- [ ] Multiple identity support
- [ ] Service principal support

### Security Considerations

| Question | Answer | Risk Level |
|----------|--------|------------|
| Are credentials logged? | | |
| Is TLS required? | | |
| Are scopes supported? | | |
| Is RBAC enforced? | | |

---

## 3. Performance Characteristics

### Response Time Tests

| Operation | 10th %ile | 50th %ile | 95th %ile | 99th %ile | Notes |
|-----------|-----------|-----------|-----------|-----------|-------|
| Simple query | | | | | |
| Complex query | | | | | |
| Write operation | | | | | |
| File upload | | | | | |
| Batch operation | | | | | |

### Throughput Tests

| Scenario | Requests/sec | Success Rate | Notes |
|----------|-------------|--------------|-------|
| Single tool, sequential | | | |
| Multiple tools, parallel | | | |
| Mixed read/write | | | |
| Sustained load (5 min) | | | |

### Resource Usage

| Metric | Value | Notes |
|--------|-------|-------|
| Memory footprint | | |
| CPU usage | | |
| Network bandwidth | | |
| Disk I/O | | |

---

## 4. Security Assessment

### Code Review Checklist

- [ ] No hardcoded credentials
- [ ] Input validation present
- [ ] Output encoding implemented
- [ ] No SQL injection vulnerabilities
- [ ] No command injection vulnerabilities
- [ ] Dependency scan clean
- [ ] No known CVEs in dependencies
- [ ] Secure defaults configured

### Data Handling

| Question | Assessment |
|----------|------------|
| Does the server log sensitive data? | |
| Is data encrypted at rest? | |
| Is data encrypted in transit? | |
| Are there data residency concerns? | |
| Is PII handled appropriately? | |

### Network Security

- [ ] TLS 1.2+ enforced
- [ ] Certificate validation
- [ ] Connection timeouts configured
- [ ] Rate limiting supported
- [ ] IP allowlisting available

---

## 5. Integration Complexity

### Setup Effort

| Task | Estimated Hours | Notes |
|------|----------------|-------|
| Environment setup | | |
| Authentication configuration | | |
| Tool mapping in Copilot Studio | | |
| Error handling implementation | | |
| Testing | | |
| Documentation | | |
| **Total** | | |

### Dependencies

| Dependency | Version | Required | Notes |
|------------|---------|----------|-------|
| | | | |
| | | | |
| | | | |

### Hosting Requirements

- [ ] Local process (stdio)
- [ ] Container (Docker)
- [ ] Serverless (Azure Functions)
- [ ] VM / Dedicated server
- [ ] Cloud service (managed)

---

## 6. Operational Considerations

### Maintenance

| Question | Answer |
|----------|--------|
| Release frequency | |
| Breaking change policy | |
| Deprecation timeline | |
| Support channels | |
| Community size | |
| Last commit date | |

### Monitoring

- [ ] Health endpoint available
- [ ] Metrics exposed (Prometheus/OTel)
- [ ] Structured logging
- [ ] Distributed tracing support
- [ ] Alerting hooks

### Disaster Recovery

| Scenario | Recovery Method | RTO | RPO |
|----------|----------------|-----|-----|
| Server crash | | | |
| Data corruption | | | |
| Auth failure | | | |
| Network partition | | | |

---

## 7. Recommendation

### Overall Score

| Category | Weight | Score (1-5) | Weighted |
|----------|--------|-------------|----------|
| Capabilities | 20% | | |
| Security | 25% | | |
| Performance | 20% | | |
| Integration | 15% | | |
| Operations | 10% | | |
| Community | 10% | | |
| **Total** | **100%** | | |

### Recommendation

- [ ] **Adopt** - Ready for production use
- [ ] **Adopt with caveats** - Address issues first
- [ ] **Evaluate further** - Need more testing
- [ ] **Reject** - Does not meet requirements

### Conditions (if applicable)

| Condition | Priority | Owner | Target Date |
|-----------|----------|-------|-------------|
| | | | |
| | | | |

### Alternative Servers Considered

| Server | Score | Reason Not Selected |
|--------|-------|-------------------|
| | | |
| | | |

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Evaluator | | | |
| Security Review | | | |
| Architecture Review | | | |
| Final Decision | | | |
