---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus
  - https://www.microsoft.com/en-us/licensing/news/power-app-per-app-end-of-sale
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/ai-builder/endofaibcredits
  - https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity
  - https://learn.microsoft.com/en-us/power-pages/go-live/assign-licensing
  - https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-admin-power-bi-licensing
  - https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors
---

# Licensing and Capacity Checklist

> **Project:** _________________________________
> **Date:** _________________________________
> **Completed by:** _________________________________
> **Tenant:** _________________________________

> **Platform-state notes (verified 2026-06-19 against Microsoft Learn, baseline 2026-H1).** Several SKUs have been renamed or are mid-transition — read the per-section notes below before pricing a deal. Always confirm current figures in the [Power Platform licensing overview](https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus) and the current Power Platform Licensing Guide, since prices and entitlements change.

---

## 1. Power Apps Licensing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 1.1 | Number of Power Apps per user licenses needed | [ ] | Count: |
| 1.2 | Number of Power Apps per app licenses needed | [ ] | Count: |
| 1.3 | Per-user vs. per-app decision documented | [ ] | |
| 1.4 | Current available licenses checked | [ ] | |
| 1.5 | Additional licenses to be procured | [ ] | Count: |
| 1.6 | License procurement process initiated | [ ] | |
| 1.7 | Pay-as-you-go option evaluated | [ ] | |
| 1.8 | Guest user licensing considered | [ ] | |
| 1.9 | License assignment process defined | [ ] | |
| 1.10 | License audit scheduled | [ ] | |

> **Notes (verified 2026-06-19).** The per-user plan is now **Power Apps Premium** (formerly "Power Apps per user"), confirmed in the [Power Platform licensing overview](https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus). **The Power Apps per app SKU went end-of-sale for new customers on 2026-01-02** — existing Enterprise/CSP customers can continue to use and renew, but new deals cannot rely on it; license rows 1.2/1.5 should default to Premium or Pay-as-you-go for new tenants ([Microsoft Licensing: per app end of sale](https://www.microsoft.com/en-us/licensing/news/power-app-per-app-end-of-sale)). Pay-as-you-go (1.7) is billed via an Azure subscription ([about per app plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp)). Under Managed Environments, every active user needs a premium per-user license or capacity add-on ([Managed Environments licensing](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing)).

---

## 2. Power Automate Licensing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 2.1 | Number of Power Automate per user licenses needed | [ ] | Count: |
| 2.2 | Number of Power Automate per flow licenses needed | [ ] | Count: |
| 2.3 | Attended RPA licenses needed | [ ] | Count: |
| 2.4 | Unattended RPA add-ons needed | [ ] | Count: |
| 2.5 | Hosted RPA licenses needed | [ ] | Count: |
| 2.6 | Process mining license needed | [ ] | Count: |
| 2.7 | Premium connector usage identified | [ ] | |
| 2.8 | Seeded vs. standalone license decision documented | [ ] | |
| 2.9 | Service account licensing planned | [ ] | |
| 2.10 | Flow run volume estimated | [ ] | |

> **Notes (verified 2026-06-19).** Power Automate plan names have changed — map the rows above accordingly ([Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)): the per-user plan is now **Power Automate Premium** (includes attended RPA, premium/custom connectors, process mining, AI Builder credits, Dataverse storage). The former "per flow" / "unattended RPA add-on" rows (2.2/2.4) are now the **Power Automate Process** capacity license (no 5-pack minimum), and "hosted RPA" (2.5) is **Power Automate Hosted Process** (RPA with no infrastructure). Unattended bots still require the registering user to hold a Premium license. **Process mining (2.6)** is included with Premium at 50 MB/license (up to 100 GB/tenant) with a dedicated add-on for more ([same source](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)). Premium connector usage (2.7) requires a standalone premium plan — Microsoft 365 licenses cover standard connectors only ([premium connectors list](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors)).

---

## 3. Dataverse Capacity

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 3.1 | Current database capacity (GB) | [ ] | |
| 3.2 | Current file capacity (GB) | [ ] | |
| 3.2 | Current log capacity (GB) | [ ] | |
| 3.3 | Projected database growth (GB/month) | [ ] | |
| 3.4 | Projected file growth (GB/month) | [ ] | |
| 3.5 | Projected log growth (GB/month) | [ ] | |
| 3.6 | 12-month projection calculated | [ ] | |
| 3.7 | Additional capacity needed? | [ ] | |
| 3.8 | Capacity add-on purchased (if needed) | [ ] | |
| 3.9 | Capacity monitoring alerts configured | [ ] | |
| 3.10 | Data archival strategy defined | [ ] | |
| 3.11 | Data retention policy defined | [ ] | |

> **Notes (verified 2026-06-19).** Dataverse capacity is tracked in **three pooled tenant types — database, file, and log** (rows 3.1–3.5 are correct) and is sold per type in 1-GB add-on increments ([Dataverse capacity-based storage](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage)). Capacity **accrues per active license** (not per month) on top of a tenant-wide base entitlement: e.g. Power Automate Premium adds 250 MB database + 2 GB file per license; the (legacy) Power Apps per app adds ~50 MB database + 400 MB file ([Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)). The PPAC banner warns when total capacity drops below 15% remaining; sustained overage can lead to service suspension after notice — wire that into alerts (3.9). Confirm exact per-SKU MB/GB figures in the current Power Platform Licensing Guide before sizing.

---

## 4. AI Builder Credits

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 4.1 | AI Builder features required? | [ ] | Yes / No |
| 4.2 | AI models identified | [ ] | |
| 4.3 | Estimated monthly credit consumption | [ ] | |
| 4.4 | Base allocation sufficient? | [ ] | |
| 4.5 | Additional credits to purchase | [ ] | |
| 4.6 | Credit monitoring plan defined | [ ] | |
| 4.7 | Fallback plan if credits exhausted | [ ] | |
| 4.8 | AI Builder region availability confirmed | [ ] | |

> **Notes (verified 2026-06-19) — important transition.** AI Builder capacity is measured in **service credits**; each premium per-user license seeds 5,000 credits/month, the add-on is 1,000,000 credits, and usage resets monthly with **no rollover** ([Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management)). **AI Builder seeded credits and the standalone AI Builder capacity add-on are being retired: seeded credits end 2026-11-01, and new customers can no longer buy the AI Builder add-on — they purchase Copilot Credits instead** ([End of AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/endofaibcredits)). A dual-mode model now applies — environments consume AI Builder credits first, then Copilot Credits; inside Copilot Studio agents/agent flows, AI Builder features always consume Copilot Credits. For new tenants, model rows 4.3–4.5 against **Copilot Credits** (see Section 5), not the legacy add-on.

---

## 5. Copilot Studio Licensing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 5.1 | Copilot Studio required? | [ ] | Yes / No |
| 5.2 | Estimated monthly Copilot Credits consumed (formerly "messages") | [ ] | |
| 5.3 | Copilot Credit capacity packs to purchase (25,000 credits/pack) | [ ] | |
| 5.4 | Channels identified (Teams, web, etc.) | [ ] | |
| 5.5 | Copilot Studio region availability confirmed | [ ] | |
| 5.6 | Generative AI features enabled? | [ ] | |
| 5.7 | Generative AI overage plan defined | [ ] | |

> **Notes (verified 2026-06-19) — currency renamed.** As of **2025-09-01, Copilot Studio's billing currency changed from "messages" to "Copilot Credits"** (rows above updated to match) ([Manage Copilot Studio credits and capacity](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-messages-capacity)). It is a tenant-wide license: capacity packs contain **25,000 Copilot Credits each at $200/pack/month**, replenished monthly with **no rollover**; pay-as-you-go (Azure meter) and a pre-purchase Commit-Unit plan are alternatives ([Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)). Credits must be allocated to environments in PPAC. Microsoft 365 Copilot-licensed users get classic/generative answers and Graph grounding in Copilot Chat/Teams/SharePoint at no extra credit cost. Confirm current pack price before quoting.

---

## 6. Power Pages Licensing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 6.1 | Power Pages required? | [ ] | Yes / No |
| 6.2 | Site type identified | [ ] | |
| 6.3 | Authenticated users expected (per day) | [ ] | |
| 6.4 | Anonymous users expected (per day) | [ ] | |
| 6.5 | Site license tier determined | [ ] | |
| 6.6 | Azure AD B2C licensing considered | [ ] | |
| 6.7 | SSL certificate planned | [ ] | |
| 6.8 | Custom domain configured | [ ] | |

> **Notes (verified 2026-06-19).** Power Pages uses **capacity-based, per-website monthly licensing** split into two categories (rows 6.3/6.4 are correct): **authenticated users sold in packs of 100** and **anonymous users sold in packs of 500**, each allocated to an environment and consumed per website per calendar month with no rollover ([Power Pages licensing](https://learn.microsoft.com/en-us/power-pages/go-live/assign-licensing)). Capacity is managed as authenticated MAU / anonymous MAU in PPAC ([Power Pages capacity management](https://learn.microsoft.com/en-us/power-pages/admin/capacity-management)). Azure AD B2C is now branded **Microsoft Entra External ID** — treat row 6.6 as "external-identity provider (Entra External ID / B2C)" (unverified pricing detail as of 2026-06-19 — confirm against Microsoft Learn). CDN and WAF are included in Power Pages licensing.

---

## 7. Power BI Licensing

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 7.1 | Power BI reports required? | [ ] | Yes / No |
| 7.2 | Number of Pro licenses needed | [ ] | |
| 7.3 | Number of Premium Per User licenses needed | [ ] | |
| 7.4 | Premium capacity (dedicated) needed? | [ ] | |
| 7.5 | Embedded analytics needed? | [ ] | |
| 7.6 | Report consumers identified | [ ] | |
| 7.7 | Report creators identified | [ ] | |

> **Notes (verified 2026-06-19) — Premium → Fabric transition.** Per-user licenses are **Fabric (Free), Power BI Pro, and Power BI Premium Per User (PPU)** — rows 7.2/7.3 are correct ([Power BI licensing guide](https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-admin-power-bi-licensing)). **Dedicated "Power BI Premium" per-capacity P SKUs (row 7.4) are retired for new purchase — buy Microsoft Fabric capacity (F SKUs) instead** ([Understand Microsoft Fabric licenses](https://learn.microsoft.com/en-us/fabric/enterprise/licenses)). Free users can view content without a per-user license only on **F64+** (or legacy P1+) capacity; below F64 each viewer still needs Pro/PPU. Update row 7.4 to "Fabric F SKU capacity (F64+ for free-user viewing)".

---

## 8. Add-Ons and Premium Features

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 8.1 | Custom connectors needed? | [ ] | Count: |
| 8.2 | Premium connectors identified | [ ] | List: |
| 8.3 | Third-party connector costs estimated | [ ] | |
| 8.4 | Additional portal/app add-ons needed | [ ] | |
| 8.5 | Dynamics 365 app licensing required? | [ ] | |
| 8.6 | Microsoft 365 base licensing sufficient? | [ ] | |
| 8.7 | Guest/user CAL requirements assessed | [ ] | |

> **Notes (verified 2026-06-19).** **Premium connectors (8.2) require a standalone premium Power Apps/Power Automate plan** — Microsoft 365 base licensing (8.6) covers standard connectors only, so it is *not* sufficient for SQL, Azure, Dynamics 365, custom, or on-premises-gateway connectors. Use the authoritative [List of all premium tier connectors](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors) to classify each connector. A flow carrying a **Power Automate Process** license can use premium connectors without each user being licensed ([Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)). Dynamics 365 app licensing (8.5) carries its own Power Platform use rights — verify against the current Dynamics 365 Licensing Guide (unverified per-app detail as of 2026-06-19 — confirm against Microsoft Learn).

---

## 9. Cost Summary

| Category | Monthly Cost | Annual Cost |
|----------|-------------|-------------|
| Power Apps | | |
| Power Automate | | |
| Dataverse capacity | | |
| AI Builder | | |
| Copilot Studio | | |
| Power Pages | | |
| Power BI | | |
| Add-ons | | |
| **TOTAL** | | |

---

## 10. Validation

| # | Check Item | Status | Notes |
|---|-----------|--------|-------|
| 10.1 | All licensing requirements identified | [ ] | |
| 10.2 | Budget approved for licensing | [ ] | |
| 10.3 | Procurement process initiated | [ ] | |
| 10.4 | Licenses available before go-live | [ ] | |
| 10.5 | Capacity sufficient for projected load | [ ] | |
| 10.6 | Monitoring for capacity configured | [ ] | |
| 10.7 | Cost optimization opportunities identified | [ ] | |
| 10.8 | Annual licensing review scheduled | [ ] | |
| 10.9 | Client briefed on ongoing licensing costs | [ ] | |
| 10.10 | Licensing documentation archived | [ ] | |

---

## Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Solution Architect | | [ ] Approved | |
| Account Manager | | [ ] Approved | |
| Client Budget Owner | | [ ] Approved | |
