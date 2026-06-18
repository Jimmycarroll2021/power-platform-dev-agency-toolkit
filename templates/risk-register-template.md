# Risk Register Template

> **Project:** _________________________________
> **Version:** _________________________________
> **Last Updated:** _________________________________
> **Owner:** _________________________________
> **Status:** [ Active / Closed ]

---

## Risk Scoring Matrix

| | **Impact: Low (1)** | **Impact: Medium (2)** | **Impact: High (3)** |
|---|---|---|---|
| **Probability: Low (1)** | Score: 1 - Low | Score: 2 - Medium | Score: 3 - High |
| **Probability: Medium (2)** | Score: 2 - Medium | Score: 4 - High | Score: 6 - Critical |
| **Probability: High (3)** | Score: 3 - High | Score: 6 - Critical | Score: 9 - Critical |

**Score Legend:**
- **1-2 (Low):** Accept, monitor periodically
- **3-4 (High):** Active monitoring, mitigation plan required
- **6-9 (Critical):** Immediate action, escalate to steering committee

---

## Risk Categories

| Category | Description | Icon |
|----------|-------------|------|
| Technical | Technology, architecture, integration risks | |
| Schedule | Timeline, milestone, resource availability risks | |
| Resource | Team, skills, capacity risks | |
| Financial | Budget, cost, licensing risks | |
| Business | Requirements, stakeholder, organizational risks | |
| External | Vendor, regulatory, market risks | |
| Security | Data, access, compliance risks | |
| Operational | Support, maintenance, performance risks | |

---

## Active Risks

### RSK-001

| Field | Value |
|-------|-------|
| **Risk ID** | RSK-001 |
| **Description** | [Clear, specific description of the risk event] |
| **Category** | Technical / Schedule / Resource / Financial / Business / External / Security / Operational |
| **Probability** | High (3) / Medium (2) / Low (1) |
| **Impact** | High (3) / Medium (2) / Low (1) |
| **Score** | [Auto-calculated: Probability x Impact] |
| **Risk Level** | Critical / High / Medium / Low |
| **Mitigation Strategy** | [Actions to reduce probability or impact] |
| **Contingency Plan** | [Actions if the risk event occurs] |
| **Owner** | [Name and role of risk owner] |
| **Status** | Open / Mitigating / Resolved / Accepted / Triggered |
| **Review Date** | [Next review date] |
| **Trigger Condition** | [What event would trigger contingency] |
| **Last Updated** | |

---

### RSK-002

| Field | Value |
|-------|-------|
| **Risk ID** | RSK-002 |
| **Description** | |
| **Category** | |
| **Probability** | |
| **Impact** | |
| **Score** | |
| **Risk Level** | |
| **Mitigation Strategy** | |
| **Contingency Plan** | |
| **Owner** | |
| **Status** | |
| **Review Date** | |
| **Trigger Condition** | |
| **Last Updated** | |

---

### RSK-003

| Field | Value |
|-------|-------|
| **Risk ID** | RSK-003 |
| **Description** | |
| **Category** | |
| **Probability** | |
| **Impact** | |
| **Score** | |
| **Risk Level** | |
| **Mitigation Strategy** | |
| **Contingency Plan** | |
| **Owner** | |
| **Status** | |
| **Review Date** | |
| **Trigger Condition** | |
| **Last Updated** | |

---

### RSK-004

| Field | Value |
|-------|-------|
| **Risk ID** | RSK-004 |
| **Description** | |
| **Category** | |
| **Probability** | |
| **Impact** | |
| **Score** | |
| **Risk Level** | |
| **Mitigation Strategy** | |
| **Contingency Plan** | |
| **Owner** | |
| **Status** | |
| **Review Date** | |
| **Trigger Condition** | |
| **Last Updated** | |

---

### RSK-005

| Field | Value |
|-------|-------|
| **Risk ID** | RSK-005 |
| **Description** | |
| **Category** | |
| **Probability** | |
| **Impact** | |
| **Score** | |
| **Risk Level** | |
| **Mitigation Strategy** | |
| **Contingency Plan** | |
| **Owner** | |
| **Status** | |
| **Review Date** | |
| **Trigger Condition** | |
| **Last Updated** | |

---

## Risk Summary Dashboard

### By Status

| Status | Count | Risks |
|--------|-------|-------|
| Open | | |
| Mitigating | | |
| Resolved | | |
| Accepted | | |
| Triggered | | |

### By Category

| Category | Count | Highest Score |
|----------|-------|--------------|
| Technical | | |
| Schedule | | |
| Resource | | |
| Financial | | |
| Business | | |
| External | | |
| Security | | |
| Operational | | |

### By Risk Level

| Level | Count | Action Required |
|-------|-------|----------------|
| Critical (6-9) | | Immediate escalation |
| High (3-4) | | Mitigation plan active |
| Medium (2) | | Monitor regularly |
| Low (1) | | Accept, periodic review |

---

## Risk Trend

| Review Date | Total Risks | Critical | High | Medium | Low | Trend |
|-------------|------------|----------|------|--------|-----|-------|
| | | | | | | |
| | | | | | | |

---

## Common Power Platform Project Risks

### Technical Risks

| Risk ID | Description | Typical Mitigation |
|---------|-------------|-------------------|
| RSK-T01 | Integration API unavailable or unreliable | Build mock services, define SLA with vendor |
| RSK-T02 | Power Platform connector limitations discovered late | Proof of concept early in project |
| RSK-T03 | Performance issues at scale | Load testing in non-prod, capacity planning |
| RSK-T04 | AI Builder model accuracy below threshold | Training data assessment, human review fallback |
| RSK-T05 | Custom connector development complexity | API review before commitment |
| RSK-T06 | Dataverse delegation limits hit | Query optimization, delegation-aware design |

### Schedule Risks

| Risk ID | Description | Typical Mitigation |
|---------|-------------|-------------------|
| RSK-S01 | Requirements creep | Strict change control, MVP definition |
| RSK-S02 | Key stakeholder unavailability | Scheduled meetings, escalation path |
| RSK-S03 | Client review delays | Build buffer time, set clear deadlines |
| RSK-S04 | Dependency on external team | Regular sync, joint planning |

### Resource Risks

| Risk ID | Description | Typical Mitigation |
|---------|-------------|-------------------|
| RSK-R01 | Key developer leaves project | Knowledge sharing, documentation |
| RSK-R02 | Skills gap in new technology | Training, pair programming |
| RSK-R03 | Client SME unavailable | Multiple SME contacts, async communication |

### Financial Risks

| Risk ID | Description | Typical Mitigation |
|---------|-------------|-------------------|
| RSK-F01 | Licensing cost higher than estimated | Validate with Microsoft, phased rollout |
| RSK-F02 | Scope expansion without budget increase | Change order process, clear SOW |
| RSK-F03 | Premium connector requirements discovered late | Connector audit in design phase |

### Security Risks

| Risk ID | Description | Typical Mitigation |
|---------|-------------|-------------------|
| RSK-SEC01 | DLP policy blocks required connectors | Early DLP review, policy exception process |
| RSK-SEC02 | Security role misconfiguration | Security testing, role validation |
| RSK-SEC03 | PII exposure in apps/flows | Data classification, field-level security |

---

## Review Schedule

| Review Type | Frequency | Next Review | Attendees |
|------------|-----------|-------------|-----------|
| Team risk review | Weekly | | Project team |
| Steering committee | Bi-weekly | | Steering committee |
| Client risk review | Monthly | | Client + Delivery team |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | | | Initial risk register |

---

## Escalation Trigger

**Escalate immediately when:**
- Any risk score reaches 9 (Critical)
- More than 2 risks are in "Triggered" status
- A risk threatens the project timeline by > 2 weeks
- A risk threatens the project budget by > 10%
- A security risk is triggered

**Escalation Path:**
```
Risk Owner --> Project Manager --> Delivery Lead --> Steering Committee
```
