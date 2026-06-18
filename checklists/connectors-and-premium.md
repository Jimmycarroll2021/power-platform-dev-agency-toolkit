---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification
  - https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/connectors/sql/
---

# Connectors and Premium Audit Checklist

> **Project:** _________________________________
> **Date:** _________________________________
> **Completed by:** _________________________________
> **Environment:** _________________________________

---

## Platform reference (verified 2026-06-19, platform state 2026-H1)

The connector tiers and DLP behaviour this checklist assumes are confirmed against Microsoft Learn:

- **Premium connectors require a standalone Power Apps or Power Automate plan** — they are not covered by seeded Microsoft 365 use rights. As of 2026-H1, Power Apps Premium is licensed per user at $20/user/month, Power Apps per app at $5/user/app/month, and Power Automate Premium at $15/user/month ([Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq)).
- **Dataverse, SQL Server, HTTP, Azure Blob Storage, and Azure Queues are Premium-tier** connectors for Power Apps and Power Automate (SQL Server is Standard only in Azure Logic Apps) ([SQL Server connector](https://learn.microsoft.com/en-us/connectors/sql/); [premium connector list](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors)). Azure Service Bus is a premium connector (unverified as of 2026-06-19 — confirm against Microsoft Learn).
- **Office 365 Outlook, SharePoint, OneDrive for Business, Microsoft Teams, Approvals, Excel Online (Business), and Microsoft 365 Users are Standard / core connectors** and cannot be blocked by classic data policies ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)).
- **DLP data policies sort every connector into one of three groups — Business, Non-Business, or Blocked.** A given app or flow can use connectors from only one of the Business/Non-Business groups at a time (they cannot share data across groups). New connectors default to the Non-Business group. Microsoft-owned standard connectors and the Dataverse connector cannot be blocked; Dataverse is the only premium connector that cannot be blocked ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)).

---

## 1. Connector Inventory

| # | Connector Name | Type (Standard/Premium/Custom) | Used In | DLP Group |
|---|---------------|-------------------------------|---------|-----------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |

---

## 2. Standard Connectors

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | All standard connectors identified | [ ] | |
| 2.2 | Standard connectors sufficient for core functionality | [ ] | |
| 2.3 | Office 365 connectors usage documented | [ ] | |
| 2.4 | SharePoint connector usage documented | [ ] | |
| 2.5 | OneDrive connector usage documented | [ ] | |
| 2.6 | Teams connector usage documented | [ ] | |
| 2.7 | Outlook connector usage documented | [ ] | |
| 2.8 | Approvals connector usage documented | [ ] | |
| 2.9 | Microsoft 365 Users connector usage documented | [ ] | |
| 2.10 | Excel Online connector usage documented | [ ] | |

---

## 3. Premium Connectors

> Tier reference: Dataverse, SQL Server, HTTP, Azure Blob Storage, and Azure Queues are Premium-tier for Power Apps/Power Automate and require a standalone Power Apps or Power Automate license ([premium connector list](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors); [licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq)).

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | All premium connectors identified | [ ] | |
| 3.2 | Business justification for each premium connector | [ ] | |
| 3.3 | Dataverse connector required | [ ] | Yes / No |
| 3.4 | SQL Server connector required | [ ] | Yes / No |
| 3.5 | HTTP connector required | [ ] | Yes / No |
| 3.6 | Azure Blob Storage connector required | [ ] | Yes / No |
| 3.7 | Azure Service Bus connector required | [ ] | Yes / No |
| 3.8 | Azure Queue connector required | [ ] | Yes / No |
| 3.9 | Custom connector required | [ ] | Yes / No |
| 3.10 | Third-party premium connectors required | [ ] | Yes / No |
| 3.11 | Premium connector licensing cost estimated | [ ] | |
| 3.12 | All users of premium connectors have required license | [ ] | |
| 3.13 | Premium connector usage optimized (minimize unnecessary use) | [ ] | |

---

## 4. Custom Connectors

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | Custom connectors needed? | [ ] | Yes / No |
| 4.2 | Custom connector purposes documented | [ ] | |
| 4.3 | OpenAPI/Swagger specifications created | [ ] | |
| 4.4 | Authentication configured correctly | [ ] | |
| 4.5 | Custom connector tested independently | [ ] | |
| 4.6 | Custom connector shared with appropriate users | [ ] | |
| 4.7 | Custom connector documented | [ ] | |
| 4.8 | Custom connector owner assigned | [ ] | |
| 4.9 | Custom connector versioning strategy defined | [ ] | |
| 4.10 | Fallback plan if custom connector fails | [ ] | |

---

## 5. DLP Compliance

> Behaviour reference: connectors are grouped Business / Non-Business / Blocked; an app or flow cannot combine connectors across the Business and Non-Business groups, new connectors default to Non-Business, and Microsoft standard connectors plus Dataverse cannot be blocked ([Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)).

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | All connectors classified in DLP policy | [ ] | |
| 5.2 | No required connectors are blocked | [ ] | |
| 5.3 | Business group classification appropriate | [ ] | |
| 5.4 | Non-business group classification appropriate | [ ] | |
| 5.5 | Custom connectors classified in DLP | [ ] | |
| 5.6 | No connectors evade DLP classification | [ ] | |
| 5.7 | DLP policy tested with all flows | [ ] | |
| 5.8 | DLP exception requests documented (if any) | [ ] | |
| 5.9 | Connector usage reviewed for policy compliance | [ ] | |
| 5.10 | DLP policy aligned with security requirements | [ ] | |

---

## 6. Connector Security

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Connection ownership reviewed | [ ] | |
| 6.2 | Service accounts used for production connections | [ ] | |
| 6.3 | No personal accounts for production connections | [ ] | |
| 6.4 | Connection references used (not hardcoded) | [ ] | |
| 6.5 | Credentials stored securely (Key Vault where possible) | [ ] | |
| 6.6 | API keys rotated regularly | [ ] | |
| 6.7 | OAuth tokens auto-refresh working | [ ] | |
| 6.8 | Connection sharing minimal and documented | [ ] | |
| 6.9 | Orphaned connections identified and cleaned up | [ ] | |
| 6.10 | Connector usage audited | [ ] | |

---

## 7. Cost Impact

| Connector | Users Affected | License Required | Monthly Cost |
|-----------|---------------|-----------------|-------------|
| | | | |
| | | | |
| | | | |
| | | | |

---

## 8. Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Solution Architect | | [ ] Approved | |
| Power Platform Admin | | [ ] Approved | |
| Security Lead | | [ ] Approved | |
