---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus
  - https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types
  - https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
  - https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention
  - https://www.microsoft.com/en-us/power-platform/products/power-apps/pricing
  - https://www.microsoft.com/en-us/power-platform/products/power-automate/pricing
  - https://www.microsoft.com/en-us/power-platform/products/power-pages/pricing
  - https://www.microsoft.com/en-us/licensing/news/power-app-per-app-end-of-sale
---

# Licensing and Capacity Guide

> **Version**: 1.1 | **Last updated**: 2026-06-19 (fact-checked against Microsoft Learn)
> **Purpose**: Comprehensive licensing reference for all Power Platform products. Use this to estimate project costs and avoid licensing surprises.
> **Verification note**: Pricing changes frequently. The figures below were verified against Microsoft Learn and microsoft.com pricing pages on 2026-06-19 (platform state 2026-H1). Always re-confirm current pricing on the Microsoft pricing pages before quoting clients. All prices are USD list and subject to change by region, currency, and agreement.

---

## 1. Power Apps Licensing

### 1.1 License Types

| License | Price (USD/mo) | What It Includes | Best For |
|---------|---------------|------------------|----------|
| **Per App** | $5/app/user | Run 1 app **or** access 1 Power Pages website, per business scenario; stackable | Users needing specific apps |
| **Premium** (formerly "Per User") | $20/user ($12/user at 2,000+ seats) | Build/run unlimited apps + unlimited Power Pages access | Power users, app-heavy roles |
| **Pay-as-you-go** | Metered via Azure | Billed per app, per active user/month | Variable usage, unpredictable |
| **Developer Plan** | Free | Full features in a personal developer environment (no sharing) | Development/testing only |

> Pricing and naming confirmed: Power Apps "Per User" is now **Power Apps Premium** at $20/user/mo ($12/user/mo with 2,000+ new licenses); Power Apps **per app** is $5/user/app/mo and entitles **one app or one Power Pages website** (not "2 apps + 1 portal" — that older bundle is superseded). Per-app licenses are stackable so a user can be assigned several. [Power Apps pricing](https://www.microsoft.com/en-us/power-platform/products/power-apps/pricing), [About Power Apps per app plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp).

> **2026-H1 change — Power Apps per app end-of-sale for new customers.** Effective **2 January 2026**, the Power Apps per app SKU is no longer available for purchase by new MPSA customers; existing Enterprise/MPSA customers may continue to use and renew. **CSP customers are not impacted** and can still purchase, use, and renew per app. Microsoft indicated the SKU would return to price lists in early April 2026. Confirm a client's purchase channel before quoting per-app. [Important update to Power Apps per app license](https://www.microsoft.com/en-us/licensing/news/power-app-per-app-end-of-sale).

### 1.2 Decision: Per App vs Premium

```
Calculate break-even (per user):
  Per App: $5 per app (one app or one Power Pages site per license; stackable)
  Premium: $20 unlimited apps

Break-even: 4 stacked per-app licenses = $20 (same as Premium)

Recommendation:
  1-3 apps needed     -> Per App ($5-15)
  4+ apps needed      -> Premium ($20)
  Usage unpredictable -> Pay-as-you-go (but monitor closely!)

Example:
  100 users, each needs 2 apps:
    Per App: 100 x $10 = $1,000/month
    Premium: 100 x $20 = $2,000/month
    -> Per App is cheaper

  100 users, each needs 5 apps:
    Per App: 100 x $25 = $2,500/month (5 stacked per-app licenses each)
    Premium: 100 x $20 = $2,000/month
    -> Premium is cheaper at 4+ apps/user
```

> Note: each Power Apps per app license covers **one** app (it is no longer capped at "max 2"); you stack licenses for multiple apps, so the break-even versus Premium is at 4 apps/user. [About Power Apps per app plans](https://learn.microsoft.com/en-us/power-platform/admin/about-powerapps-perapp).

### 1.3 What Requires a Power Apps License

```
REQUIRES license:
  [X] Creating or editing canvas apps
  [X] Creating or editing model-driven apps
  [X] Running a canvas app (any user)
  [X] Running a model-driven app (any user)
  [X] Using custom pages
  [X] Using Power Apps component library (as maker)

DOES NOT require a standalone Power Apps license (but has limits):
  [ ] Completing a Power Apps form embedded in Teams (Dataverse for Teams, if user has Teams license)
  [ ] Approving a request via email (Approvals connector)
  [ ] Receiving a notification from Power Automate
```

> A Power Apps **per app** assignment does **not** grant rights to create or own Power Automate flows that use premium features — that requires Power Apps Premium or a Power Automate Premium license. [Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq).

> **Managed Environments enforcement (2026-H1):** in Managed Environments, every user running an app must hold a Power Apps Premium, Power Automate Premium, or qualifying Dynamics 365 Enterprise license. In-app end-user notifications for this enforcement began rolling out in **June 2026** (admin advance notices from March 2026). [Managed Environment licensing](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing).

---

## 2. Power Automate Licensing

### 2.1 License Types

| License | Price (USD/mo) | What It Includes | Best For |
|---------|---------------|------------------|----------|
| **Seeded (M365)** | Included with M365/E3/E5 | Standard connectors only | Simple M365 automation |
| **Premium (per user)** | $15/user | Standard + premium + custom connectors, attended RPA, process mining, AI Builder credits, Dataverse | Individual power users / RPA builders |
| **Process** (per flow or per machine) | $150/flow or bot | Capacity license: one cloud flow (premium connectors, 250k actions/day) **or** one unattended bot | Business-critical / unattended automation |
| **Hosted Process** | $215/bot | Process + a Microsoft-hosted machine (zero infrastructure RPA) | No on-prem infrastructure |
| **Process Mining** | Included in Premium | 50 MB process-mining data/user (up to 100 GB/tenant) | Optimization projects |

> Confirmed against [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types) and [Power Automate pricing](https://www.microsoft.com/en-us/power-platform/products/power-automate/pricing). **Important:** the legacy **Per Flow** plan ($100/flow, 5-license minimum) and the standalone **unattended RPA add-on** ($150/bot) were **removed from price lists on 1 August 2023** and replaced by the **Power Automate Process** capacity license ($150 per flow or per machine, no minimum, stackable up to 10 per flow). There is no "$500 for 5 flows" SKU. [Power Automate pay-as-you-go pricing news](https://www.microsoft.com/en-us/licensing/news/powerautomate_payg_pricing).

> Power Automate **Premium** is now $15/user/mo and already includes premium + custom connectors and **one attended bot**; attended RPA no longer requires a separate $20 tier. [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types).

### 2.2 Seeded vs Premium: Critical Distinction

```
SEEDED (included with M365/E3/E5):
  Works with STANDARD connectors only:
    SharePoint, Outlook, OneDrive, Teams, Excel Online,
    Planner, Forms, To Do, Approvals, RSS, Notification

  DOES NOT work with:
    Dataverse, SQL Server, HTTP, Custom connectors,
    Azure services, Salesforce, Dynamics 365,
    Premium third-party connectors

PREMIUM (requires a paid premium/Process license):
  Required when flow uses ANY premium connector
  Even if flow is "triggered" by a standard connector action

  CRITICAL RULE:
    If a flow has ONE premium action, it needs premium entitlement.
    - Automated/scheduled flows use the flow OWNER's license context.
    - Instant flows (button, Power Apps) use the INVOKING user's context.
    - A flow with a Process license needs no per-user license at all.

Example: "When email arrives" (standard) -> "Create Dataverse row" (premium)
  The flow owner needs a premium license (or the flow needs a Process license).
  Even though the trigger is standard, the action is premium.
```

> Confirmed: even M365 E5 does **not** include premium connectors; HTTP, SQL Server, Azure services, Dynamics 365, and **custom connectors** are premium. Dataverse is premium but is the one premium connector that can't be DLP-blocked. The license-context rules (owner vs invoker; Process bypasses per-user) are accurate. [Power Automate licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs), [Premium tier connectors](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors).

### 2.3 Process (per flow) vs Premium (per user)

```
Power Automate Process ($150 / flow or machine / month):
  - Assigned to a cloud flow or a machine (capacity, not a user)
  - Flow must be in a solution to assign a Process license
  - Anyone can trigger the flow (no per-user license needed)
  - Premium + custom connectors; 250,000 actions/day per license
  - Stackable up to 10 per flow (+250k actions each)
  - One Process license on a machine = one unattended bot (one desktop flow at a time)

  Best for:
    - Organization-wide processes (expense approval)
    - High-volume flows (1000s of runs/day)
    - Service-account-owned / shared flows
    - Unattended desktop automation

Power Automate Premium ($15 / user / month):
  - Individual user license
  - User can create/run unlimited cloud flows + one attended bot
  - Shared (per-user) action limits

  Best for:
    - Individual productivity flows
    - Makers who build flows / RPA developers
    - Users who trigger personal flows

Break-even analysis (per single shared flow):
  If a shared flow is used by >10 users: Process is cheaper
  (10 users x $15 = $150 = one Process license)

Example:
  Expense approval flow used by 200 employees:
    Per User: 200 x $15 = $3,000/month
    Process:  $150/month (one Process license on the flow)
    -> Process is MUCH cheaper
```

> Recomputed break-even using the correct $150 Process price (was wrongly $500 / 33 users in v1.0). A registered machine for unattended runs still requires the machine to have been registered by a Power Automate Premium user. [Power Automate Process license](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types).

### 2.4 RPA Licensing

```
Attended RPA (user present):
  Included in Power Automate Premium ($15/user) — one attended bot per license
  User must be logged in; screen can be locked but session active

Unattended RPA (no user present):
  Power Automate Process ($150 / machine / month) = one unattended bot
  (the old standalone $150 unattended RPA add-on was retired 2023-08-01
   and folded into the Process license)
  Runs on a registered on-prem / self-managed machine; one desktop flow at a time
  Machine must first be registered by a Premium user

Hosted RPA:
  Power Automate Hosted Process ($215 / bot / month)
  Microsoft provides the VM (zero infrastructure); superset of Process

Bot concurrency:
  1 Process license = 1 concurrent unattended desktop-flow run
  Need 2 concurrent? Allocate 2 Process licenses to the machine(s).

  Example:
    5 desktop flows, but max 2 run simultaneously:
    Need: 2 Process licenses = 2 x $150 = $300/month
```

> Confirmed: unattended RPA is delivered via the **Process** capacity license (one unattended bot per license), not a separate add-on; Hosted Process is $215/bot/mo. [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types).

---

## 3. Dataverse Capacity

### 3.1 Included Capacity

```
One-time tenant default (first qualifying Power Platform / D365 subscription):
  Database: 10 GB   (one-time, per tenant — NOT per license)
  (File and Log default capacity is provided per the licensing guide; verify
   exact default file/log figures on the Power Platform Licensing Guide.)

Per-license capacity that ACCRUES to the tenant pool:
  Power Apps Premium (per user):     Database 250 MB,  File 2 GB
  Power Apps per app:                Database 50 MB,   File 400 MB
  Power Automate Premium (per user): Database 50 MB,   File 200 MB
  Power Automate Process:            Database 50 MB,   File 200 MB
  (Log capacity is tracked separately; included Dataverse log entitlement
   is small per license — verify exact per-license log figure on the
   Power Platform Licensing Guide.)

Default environment included storage:
  Database 3 GB, File 3 GB, Log 1 GB

Example calculation:
  New tenant buys 100 Power Apps Premium + 50 Power Automate Premium:
    Database: 10 GB default + (100 x 250 MB) + (50 x 50 MB)
            = 10 GB + 25 GB + 2.5 GB = 37.5 GB
    File:     (100 x 2 GB) + (50 x 200 MB) = 200 GB + 10 GB = 210 GB

Note: Capacity is an ENTITLEMENT that accrues per active license and is
POOLED at tenant level (it does not reset monthly/annually).
One environment can use more than its share if others use less.
```

> **Major correction:** v1.0 listed 10 MB DB / 20 MB file / 2 MB log **per license** — those are obsolete legacy figures. Current model: a one-time **10 GB** tenant default database pool plus **per-license accruals** (Power Apps Premium = 250 MB DB + 2 GB file; per app = 50 MB DB + 400 MB file; Power Automate Premium/Process = 50 MB DB + 200 MB file). Database and file capacity are pooled across Dataverse and Operations workloads; log is tracked separately. [Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage), [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types), [Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq).

### 3.2 Capacity Add-Ons

```
If pooled capacity is insufficient, buy in 1-GB add-on increments:

Database capacity (per GB/month):
  Dataverse Database 1 GB add-on, applied at tenant level

File capacity (per GB/month):
  Dataverse File 1 GB add-on, for environments with many attachments

Log capacity (per GB/month):
  Dataverse Log 1 GB add-on, for heavily audited environments

Note: file excess entitlement CANNOT cover a database or log deficit;
database excess CAN cover log/file overflow (one-way overflow rules apply).

Check current pricing:
  Power Platform Admin Center > Licensing > Capacity add-ons
  or the Power Platform Licensing Guide
```

> Confirmed: storage is purchased in 1-GB add-on increments; database/log/file are enforced as separate entitlements with one-way overflow (database can cover log/file overuse; file cannot cover database/log). [Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage).

### 3.3 Capacity Monitoring

```
Monitor capacity at three levels:

1. Tenant level:
   Power Platform Admin Center > Licensing > Capacity add-ons > Summary
   Shows: Total allocated, used, available (by source: org default,
          user licenses, additional storage)

2. Environment level:
   Licensing > Dataverse > [Environment]
   Shows: database/file/log usage per environment

3. Table level:
   Licensing > Dataverse > [Environment] > Consumption per table
   Shows: which tables consume most space (and DataverseSearch index)

Microsoft's built-in capacity notifications:
  - <15% remaining: approaching-limit notification
  - <5% remaining: admin-operations-at-risk notification
  - In overage: blocks create/copy/restore/recover environment
  Tenant/PP/D365 admins receive these weekly by email.
```

> Updated to current admin-center navigation (Licensing > Capacity add-ons / Dataverse) and Microsoft's actual notification thresholds (15% / 5% / overage), replacing the v1.0 70/85/95% figures, which were illustrative custom alerts, not Microsoft's built-in thresholds. You may still configure your own 70/85/95% alerts; Microsoft's system thresholds are 15%/5%/overage. [Dataverse capacity-based storage details](https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage).

---

## 4. AI Builder Credits

### 4.1 Credit Allocation

```
Seeded credits included with licenses (REMOVED on 2026-11-01):
  Power Apps Premium (per user): 500 credits   (max 1M/tenant)
  Power Apps per app:            250 credits   (max 1M/tenant; none if bought pre-Nov 2022)
  Power Automate Premium:        5,000 credits (max 1M/tenant)
  Power Automate Process:        5,000 credits (max 1M/tenant)
  Dynamics 365 F&O:              20,000 credits (max 20,000/tenant)

  >>> These seeded credits are being REMOVED on 1 November 2026. After that,
      only AI Builder add-on credits remain active. <<<

Purchased credits (AI Builder capacity add-on):
  1,000,000 credits per add-on
  >>> NEW customers can no longer buy the AI Builder add-on; they must use
      Copilot Credits instead. Existing customers can renew/buy through
      the Microsoft 365 admin center until 2026-11-01. <<<

Note: Credits are POOLED at tenant level and reset monthly (no carryover).
Credits can be left unallocated (tenant pool) or allocated to specific environments.
```

> **Major correction:** v1.0 said "common allocation: 1M credits per tenant per month" and "$500 per 1M credits." Current model: seeded per-license credits (Premium 500, per app 250, Power Automate Premium/Process 5,000, D365 F&O 20,000), each capped at 1M/tenant; the AI Builder add-on grants **1,000,000 credits**. The standalone $500/1M-credit add-on still applies to existing customers but **new customers must purchase Copilot Credits instead** ($0.01/message PAYGO or capacity packs), and **all seeded credits are removed on 2026-11-01**. [Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management).

### 4.2 Credit Consumption by Model

```
Consumption varies by capability — use the authoritative AI Builder
capability rate table in the Power Platform Licensing Guide for exact rates.
Indicative magnitudes (verify exact rates against the rate table):

Pre-built models (per call):
  Sentiment analysis: ~1 credit                (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)
  Language detection: ~1 credit                (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)
  Key phrase extraction: ~1 credit             (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)
  Text recognition (OCR): ~1-5 credits         (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)
  Text translation: ~1-5 credits               (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)

Custom models (per call):
  Category classification: ~5-20 credits       (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)
  Entity extraction: ~5-20 credits             (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)
  Prediction: ~1-10 credits per row            (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)
  Object detection: ~50-200 credits            (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)

Document processing (per document/page):
  Receipt processing: ~32 credits per receipt is the figure Microsoft uses
    in its own worked example; other document types vary
    (confirm exact per-type rates against the AI Builder capability rate table)
  Invoice / identity / business card / custom form: rates vary per page
    (unverified exact rate as of 2026-06-19 — confirm against Microsoft Learn)

AI prompts / GPT:
  Variable — depends on input/output (and reasoning) token counts and the
  underlying model selected. See "Prompt tokens" in AI Builder docs.

Training:
  Training models in the AI Models page does NOT consume credits (it is free),
  contrary to the v1.0 "5,000-50,000 credits" training estimates.
  Testing prebuilt/custom models and previewing AI models is also free
  (except Prompts, which always consume credits even in preview).
```

> Corrected the most consequential consumption claims: **training and testing models are free** (v1.0 implied large training credit costs). Microsoft's own example rates receipt processing at **32 credits/receipt**. Per-capability exact rates live in the AI Builder capability rate table in the Power Platform Licensing Guide; the remaining indicative per-call magnitudes are marked unverified pending that table. [Licensing and AI Builder credits](https://learn.microsoft.com/en-us/ai-builder/credit-management).

---

## 5. Copilot Studio (Copilot Credits)

### 5.1 Consumption-Based Licensing

```
Currency change: as of 2025-09-01, the agent currency changed from
"messages" to "Copilot Credits" (quantity per pack and PAYGO rate unchanged).

Prepaid capacity pack:
  $200 / pack / month  ->  25,000 Copilot Credits per pack
  Tenant-wide; multiple packs can be stacked; no monthly carryover

Pay-as-you-go (PAYGO) meter:
  $0.01 per message, billed through an Azure subscription, no commitment
  Recommended as an overage "safety net" alongside prepaid packs

Pre-Purchase Plan (P3):
  Annual commitment of Copilot Credit Commit Units with tiered discounts
  across Copilot Studio, Dynamics 365, and Microsoft 365 Copilot

Included with Microsoft 365 Copilot ($30/user/month):
  The Copilot Studio "lite" experience; agents in Copilot Chat, Teams, and
  SharePoint (classic/generative answers, Graph tenant grounding) do NOT
  draw down the Copilot Studio pack or meter.

Overage enforcement:
  A grace overage is allowed; custom agents are disabled when a tenant
  reaches 125% of prepaid capacity (until capacity is increased or resets).
```

> **Major correction:** v1.0 framed this as "$200/month base license includes 25,000 messages" plus a hedge about 2024 changes. Current model: the unit is **Copilot Credits** (renamed from messages on 2025-09-01); a **capacity pack is $200/mo for 25,000 credits** and **PAYGO is $0.01/message**. There is no separate base license fee distinct from the pack. [Billing rates and management — Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management), [Copilot Studio licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing).

> Credit consumption depends on the agent type, knowledge sources, and the complexity of each answer/action; classic answers cost less than generative answers or actions that invoke tools/flows. Exact per-interaction credit rates are in the Copilot Studio billing rates table. [Billing rates and management — Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management).

### 5.2 Estimating Credit / Message Volume

```
Rough message-count formula (each turn = user message + agent response):
  Monthly messages ~= Users x Sessions/Month x Messages/Session

  Note: under Copilot Credits, different interactions consume DIFFERENT
  numbers of credits, so a flat "messages x rate" estimate is only a floor.
  Use the Copilot Studio billing rates table for credit-accurate estimates.

Example (prepaid packs):
  500 employees x 2 sessions/month x 10 messages/session = 10,000 messages
    One pack (25,000 credits) likely sufficient for simple Q&A: $200/month

High-volume scenario:
  5,000 external customers x 5 sessions x 8 messages = 200,000 messages
    Simple interactions: ~8 packs (~$1,600/month) on prepaid, OR
    ~$2,000/month on PAYGO at $0.01/message
    -> generative/tool-using agents consume MORE credits per interaction,
       so size with the billing rates table, not a flat message count.
```

> Updated the example to reflect that credits, not flat messages, are the billing unit. PAYGO at $0.01/message gives a simple upper-bound check; prepaid packs are cheaper per credit at steady volume. [Billing rates and management — Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management).

---

## 6. Power Pages Licensing

### 6.1 Pricing Model

```
Capacity-based (per website, per month), sold as packs at the environment level:

Authenticated users:
  Prepaid: $200 / site / month per pack of 100 authenticated users
  PAYGO:   $4 per authenticated user / site / month
  Each authenticated-user pack accrues 2 GB database + 16 GB file capacity
  Min initial assignment: 25 per environment (then increments of 1)

Anonymous users:
  Prepaid: $75 / site / month per pack of 500 anonymous users
  PAYGO:   $0.30 per anonymous user / site / month
  Each anonymous-user pack accrues 0.5 GB database + 4 GB file capacity
  Min initial assignment: 200 per environment (then increments of 1)

Metering: a user is counted only when they access a site in a calendar month
(monthly active users), per site. CDN and WAF are included.

Existing entitlements:
  Power Apps per app license -> one Power Pages website
  Power Apps Premium license -> unlimited Power Pages websites
  Dynamics 365 Enterprise    -> unlimited Power Pages websites
```

> Updated: Power Pages is licensed by **monthly active users per site** (packs of 100 authenticated / 500 anonymous), not the v1.0 "daily authenticated users (DAU)" model. Prepaid authenticated = **$200/100 users/site/mo** (PAYGO $4/user); anonymous = **$75/500 users/site/mo** (PAYGO $0.30/user). [Power Pages pricing](https://www.microsoft.com/en-us/power-platform/products/power-pages/pricing), [Power Platform licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq).

### 6.2 Estimating Monthly Active Users

```
Formula:
  MAU = Total registered users x Monthly login rate

Example:
  1,000 registered customers
  60% sign in within a given month
  -> MAU = 1,000 x 0.60 = 600 authenticated users/site

  Authenticated packs: 600 / 100 = 6 packs
  Cost: 6 x $200 = $1,200/month
  (Or PAYGO: 600 x $4 = $2,400/month — prepaid is cheaper at steady volume)

Seasonal variation:
  Metering is by monthly active users, so cost tracks actual monthly usage.
  Plan prepaid packs for typical peak month; PAYGO absorbs spikes.
```

> Rewritten around monthly active users (the current metering unit) instead of DAU. Prepaid vs PAYGO comparison added at the verified $200/100 (prepaid) and $4/user (PAYGO) rates. [Power Pages pricing](https://www.microsoft.com/en-us/power-platform/products/power-pages/pricing).

---

## 7. Premium Connectors Licensing

### 7.1 How Premium Connectors Affect Licensing

```
RULE: Any flow or app using a premium connector requires premium entitlement
      for the user interacting with it (or a Process license on the flow).

Scenarios:
  1. Flow uses Dataverse (premium):
     - Flow owner needs Power Automate Premium / Power Apps Premium, OR
     - Flow has a Power Automate Process license

  2. Canvas app uses SQL Server (premium):
     - Every user of the app needs a Power Apps license (Premium or per app)
     - (They already need a Power Apps license to run any Power App)

  3. Custom connector used in flow:
     - Custom connectors are PREMIUM
     - Flow owner needs premium (or the flow needs a Process license)
     - Users triggering an instant flow need premium in their own context

  4. Shared flow used by 50 users:
     - Process-licensed flow: NO per-user license needed
     - Per-user model: each interacting user needs premium ($15/user)
     - Break-even: ~10 users (10 x $15 = $150 = one Process license)
```

> Confirmed connector classifications: HTTP, SQL Server, Azure services, Dynamics 365, and custom connectors are **premium**; Dataverse is premium but cannot be DLP-blocked. Break-even recomputed at the correct $150 Process price (~10 users), replacing v1.0's $500/33-user figure. [Premium tier connectors](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-premium-connectors), [Power Automate licensing FAQ](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs).

### 7.2 Common Licensing Mistakes

| Mistake | Impact | Prevention |
|---------|--------|------------|
| Using seeded license with premium connector | Flow fails for non-licensed users | Audit all connectors before go-live |
| Not licensing flow triggerers (instant flows) | Users can't trigger flows | Document all user touchpoints |
| Forgetting service-account / flow license | Background flows stop working | License service accounts or use Process licenses |
| Sharing app without sharing data permissions | App opens but no data visible | Check both app and data-source permissions |
| Using pay-as-you-go without monitoring | Unexpected large bill | Set Azure budget alerts |
| Not counting guest/external users | License compliance issue | Track external/guest access |
| Ignoring capacity overages | Service degradation / blocked ops | Monitor capacity weekly |
| Buying per-user for org-wide flows | Massive unnecessary cost | Use a Process license for shared processes |
| Not including dev/test licenses | Developers build in production | Use free Developer Plan environments + budget non-prod |
| Forgetting unattended automation licenses | Bot won't run | Allocate Process licenses before deployment |
| Assuming M365 E5 includes premium connectors | Build blocked at runtime | E5 is seeded (standard connectors only) |
| Quoting per-app to a new MPSA customer | SKU unavailable (since 2026-01-02) | Confirm purchase channel; CSP still has per app |

---

## 8. How to Estimate for a Project

### 8.1 Estimation Worksheet

```
Step 1: Count users
  Internal users: _____
  External users (Power Pages auth/anon): _____
  Service accounts: _____
  Developers: _____
  Admins: _____

Step 2: Count apps
  Canvas apps: _____
  Model-driven apps: _____
  Power Pages sites: _____
  Apps per user (avg): _____

Step 3: Count flows
  Cloud flows: _____
  Desktop flows (attended): _____
  Desktop flows (unattended): _____
  Concurrent unattended bots (= Process licenses): _____
  Premium connector flows: _____

Step 4: Count AI
  AI Builder models / capabilities: _____
  Estimated monthly calls: _____
  AI prompts per month: _____

Step 5: Count Copilot Studio
  Agents: _____
  Expected monthly interactions: _____
  Estimated monthly Copilot Credits (use billing rates table): _____

Step 6: Calculate
  Power Apps Premium: _____ users x $20 = $_____/month
  Power Apps per app: _____ x $5 = $_____/month
  Power Automate Premium: _____ users x $15 = $_____/month
  Power Automate Process: _____ flows/bots x $150 = $_____/month
  Hosted Process: _____ bots x $215 = $_____/month
  AI Builder add-on (existing cust.) / Copilot Credits (new cust.): $_____/month
  Copilot Studio packs: _____ x $200 (25k credits) = $_____/month
  Power Pages auth: _____ packs x $200 (per 100) = $_____/month
  Power Pages anon: _____ packs x $75 (per 500) = $_____/month
  Dataverse capacity add-ons: $_____/month
  TOTAL: $_____/month
```

> Worksheet updated with current SKU names and verified per-unit prices ($20 Premium, $15 Power Automate Premium, $150 Process, $215 Hosted Process, $200/25k-credit Copilot pack, $200/100 + $75/500 Power Pages).

### 8.2 Budget Buffer

```
Always add buffer to estimates:

Year 1 buffer: +20%
  - Underestimated users
  - Additional apps discovered
  - Capacity overages

Year 2 buffer: +15%
  - Organic growth
  - New features requiring premium

Year 3 buffer: +10%
  - Steady state
  - Price increases

Common surprises that increase cost:
  - "We also need this for the sales team" (+50 users)
  - "Can we connect to Salesforce?" (premium connector)
  - "We need historical data too" (capacity increase)
  - "Audit wants 7-year retention" (log capacity)
  - "Make the bot run after hours" (unattended -> Process license)
  - "We're a new customer" (per-app and AI Builder add-on availability — check channel/dates)
```

---

## 9. DLP / Governance Behaviour (Quick Reference)

```
Data policies (DLP) group connectors so makers can't combine sensitive ones:

Connector groups:
  - Business (sensitive)        - Non-business (general)        - Blocked
  Data cannot flow between the Business and Non-business groups in one
  app/flow/agent. Blocked connectors can't be used at all.

Enforcement is BOTH design-time and runtime:
  - Design-time: makers can't save an app/flow that violates policy.
  - Runtime: violating apps/flows/agents are suspended/quarantined and
    blocked connections are disabled.

Special cases:
  - Dataverse is a premium connector that CANNOT be blocked.
  - Policy latency: usually within an hour; up to 24 hours in extreme cases.
  - Policies cascade tenant -> environment; resources poll for updates.
```

> Confirmed governance/DLP behaviour: connectors are grouped Business / Non-business / Blocked, with both design-time and runtime enforcement, tenant-to-environment cascade, and up to 24-hour worst-case enforcement latency. [Data policies — Power Platform](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention).

---

## 10. Tools for Monitoring Usage

### 10.1 Built-in Monitoring

```
Power Platform Admin Center:
  - Licensing page: assigned vs active licenses; capacity add-ons
  - Capacity / Dataverse pages: storage usage by type and environment
  - Usage insights: app sessions, flow runs

Azure Cost Management (for pay-as-you-go meters):
  - Azure portal > Cost Management
  - Filter by Power Platform / Copilot Studio resources
  - Set budget alerts

Power BI Report (from the CoE Starter Kit):
  - License utilization dashboard
  - Capacity trends
  - Usage by environment
```

### 10.2 Monitoring Checklist

```
Weekly:
  [ ] Review license utilization
  [ ] Check for unused assigned licenses
  [ ] Monitor flow run / action volume

Monthly:
  [ ] Capacity usage check (database / file / log)
  [ ] AI Builder credit consumption (before 2026-11-01 seeded-credit removal)
  [ ] Copilot Studio credit usage vs prepaid packs / PAYGO
  [ ] New environment creation
  [ ] License assignment audit

Quarterly:
  [ ] License optimization review
  [ ] Capacity planning forecast
  [ ] True-up calculation
  [ ] Budget vs actual analysis
  [ ] Renewal preparation
```

---

*End of Licensing Guide. ALL pricing must be re-verified against current Microsoft documentation before client proposals — prices and SKUs change frequently and vary by region, currency, and agreement. This guide was fact-checked against Microsoft Learn on 2026-06-19 (platform state 2026-H1) and is for estimation only.*
