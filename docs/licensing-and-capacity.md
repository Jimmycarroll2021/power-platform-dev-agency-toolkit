# Licensing and Capacity Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Comprehensive licensing reference for all Power Platform products. Use this to estimate project costs and avoid licensing surprises.
> **Needs verification against current Microsoft docs**: Pricing changes frequently. Always verify current pricing on Microsoft website before quoting clients. All prices are USD and subject to change.

---

## 1. Power Apps Licensing

### 1.1 License Types

| License | Price (USD/mo) | What It Includes | Best For |
|---------|---------------|------------------|----------|
| **Per App** | $5/app/user | Run 2 apps + 1 portal on 1 environment | Users needing specific apps |
| **Per User** | $20/user | Unlimited apps on unlimited environments | Power users, app-heavy roles |
| **Pay-as-you-go** | Metered via Azure | Billed per app session | Variable usage, unpredictable |
| **Developer Plan** | Free | Full features in dev environment | Development/testing only |

### 1.2 Decision: Per App vs Per User

```
Calculate break-even:
  Per App: $5 per app (up to 2 apps)
  Per User: $20 unlimited

Break-even: 4 apps = $20 (same as Per User)

Recommendation:
  1-2 apps needed    -> Per App ($5-10)
  3+ apps needed     -> Per User ($20)
  Usage unpredictable -> Pay-as-you-go (but monitor closely!)

Example:
  100 users, each needs 2 apps:
    Per App: 100 x $10 = $1,000/month
    Per User: 100 x $20 = $2,000/month
    -> Per App is cheaper

  100 users, each needs 5 apps:
    Per App: Not enough (max 2)
    Per User: 100 x $20 = $2,000/month
    -> Per User required
```

### 1.3 What Requires a Power Apps License

```
REQUIRES license:
  [X] Creating or editing canvas apps
  [X] Creating or editing model-driven apps
  [X] Running a canvas app (any user)
  [X] Running a model-driven app (any user)
  [X] Using custom pages
  [X] Using Power Apps component library (as maker)

DOES NOT require license (but has limits):
  [ ] Completing a Power Apps form embedded in Teams (if user has Teams license)
  [ ] Approving a request via email (Approvals connector)
  [ ] Receiving a notification from Power Automate
```

---

## 2. Power Automate Licensing

### 2.1 License Types

| License | Price (USD/mo) | What It Includes | Best For |
|---------|---------------|------------------|----------|
| **Seeded (M365)** | Included with M365/E5 | Standard connectors only | Simple M365 automation |
| **Per User** | $15/user | All connectors for one user | Individual power users |
| **Per User (Premium)** | $20/user | All connectors + RPA attended | Users needing RPA |
| **Per Flow** | $500/flow (5 min) | Dedicated capacity for 5 flows | Business-critical flows |
| **Unattended RPA** | $150/bot add-on | Unattended bot license | Desktop automation |
| **Hosted RPA** | Varies | Microsoft-hosted VM for RPA | No on-prem infrastructure |
| **Process Mining** | Varies | Process analysis | Optimization projects |

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

PREMIUM (requires paid license):
  Required when flow uses ANY premium connector
  Even if flow is "triggered" by a standard connector action

  CRITICAL RULE:
    If a flow has ONE premium action, the flow OWNER needs premium.
    If the flow runs in user's context, the USER needs premium.

Example: "When email arrives" (standard) -> "Create Dataverse row" (premium)
  The flow owner needs a premium license.
  Even though trigger is standard, the action is premium.
```

### 2.3 Per Flow vs Per User

```
Per Flow ($500/month for 5 flows):
  - Anyone can trigger (no per-user license needed)
  - Dedicated capacity (faster, more reliable)
  - Shared flows (service account owns)
  - Business-critical processes

  Best for:
    - Organization-wide processes (expense approval)
    - High-volume flows (1000s of runs/day)
    - Service account-owned flows
    - Flows used by many users

Per User ($15-20/month):
  - Individual license
  - User can create/use unlimited flows
  - Shared capacity

  Best for:
    - Individual productivity flows
    - Makers who build flows
    - Users who trigger personal flows

Break-even analysis:
  If flow is used by >33 users: Per Flow is cheaper
  (33 users x $15 = $495, close to $500 per-flow)

Example:
  Expense approval flow used by 200 employees:
    Per User: 200 x $15 = $3,000/month
    Per Flow: $500/month (for 5-flow pack)
    -> Per Flow is MUCH cheaper
```

### 2.4 Unattended RPA Licensing

```
Attended RPA (user present):
  Included in Power Automate Premium ($20/user)
  User must be logged in
  Screen can be locked but session active

Unattended RPA (no user present):
  Add-on: $150/bot/month
  Runs on dedicated VM/server
  No human supervision
  Can run on schedule or trigger

Hosted RPA:
  Microsoft provides the VM
  Additional cost per bot + VM compute
  No on-prem infrastructure needed

Bot concurrency:
  1 bot license = 1 concurrent unattended session
  Need 2 concurrent? Buy 2 bot licenses.

  Example:
    5 desktop flows, but max 2 run simultaneously:
    Need: 2 bot licenses = 2 x $150 = $300/month
```

---

## 3. Dataverse Capacity

### 3.1 Included Capacity

```
Per Power Apps license (Per App or Per User):
  Database: 10 MB
  File: 20 MB
  Log: 2 MB

Per Power Automate Premium license:
  Database: 10 MB
  File: 20 MB
  Log: 2 MB

Example calculation:
  100 Power Apps Per User licenses
  50 Power Automate Premium licenses
  
  Total pooled:
    Database: (100 + 50) x 10 MB = 1,500 MB = 1.5 GB
    File: (100 + 50) x 20 MB = 3,000 MB = 3 GB
    Log: (100 + 50) x 2 MB = 300 MB

Note: Capacity is POOLED at tenant level.
One environment can use more than its allocation if others use less.
```

### 3.2 Capacity Add-Ons

```
If pooled capacity insufficient:

Database capacity (per GB/month):
  Purchase additional database capacity
  Applied at tenant level

File capacity (per GB/month):
  Purchase additional file capacity
  For environments with many attachments

Log capacity (per GB/month):
  Purchase additional log capacity
  For heavily audited environments

Check current pricing:
  Power Platform Admin Center > Resources > Capacity
  or Microsoft pricing page
```

### 3.3 Capacity Monitoring

```
Monitor capacity at three levels:

1. Tenant level:
   Admin Center > Resources > Capacity > Summary
   Shows: Total allocated, used, available

2. Environment level:
   Admin Center > Environments > [Environment] > Capacity
   Shows: Usage per environment

3. Table level:
   Settings > Data management > Storage capacity by entity
   Shows: Which tables consume most space

Set up alerts:
  - 70%: Yellow warning (plan add-on)
  - 85%: Orange warning (purchase add-on soon)
  - 95%: Red alert (immediate action required)
```

---

## 4. AI Builder Credits

### 4.1 Credit Allocation

```
Included credits (verify current - changed in 2024):
  Some licenses include AI Builder credits
  - Power Apps Per User: Check current allocation
  - Power Automate Premium: Check current allocation
  - Dynamics 365 licenses: May include credits

  Common allocation: 1M credits per tenant per month
  (with qualifying licenses)

Purchased credits:
  $500 per 1M credits per month
  Additional packs available

Note: Credits are POOLED at tenant level.
One environment can use credits even if others exhaust them.
```

### 4.2 Credit Consumption by Model

```
Approximate consumption (verify current rates):

Pre-built models (per call):
  Sentiment analysis: ~1 credit
  Language detection: ~1 credit
  Key phrase extraction: ~1 credit
  Text recognition (OCR): ~1-5 credits
  Text translation: ~1-5 credits

Custom models (per call):
  Category classification: ~5-20 credits
  Entity extraction: ~5-20 credits
  Prediction: ~1-10 credits per row
  Object detection: ~50-200 credits

Document processing (per document):
  Receipt: ~50-100 credits
  Invoice: ~100-300 credits
  Identity document: ~50-100 credits
  Business card: ~10-50 credits
  Custom form (per page): ~100-500 credits

GPT prompts:
  Variable: Depends on input/output token count
  Typical: ~10-100 credits per prompt

Training (one-time):
  Custom document model: ~5,000-50,000 credits
  Category classification: ~1,000-5,000 credits
  Prediction model: ~5,000-20,000 credits
```

---

## 5. Copilot Studio Messages

### 5.1 Message-Based Licensing

```
Base license: $200/month
Includes: 25,000 messages

Additional messages: Purchase packs
  Verify current pricing for additional message packs

What counts as a message:
  - User message sent to copilot
  - Copilot response sent to user
  - Internal action (knowledge search, API call)

What does NOT count:
  - Transfer to live agent (after transfer)
  - Sign-in/sign-out prompts
  - System messages

Needs verification against current Microsoft docs:
  Message counting rules changed in 2024.
  Verify what's included in base license.
```

### 5.2 Estimating Message Volume

```
Formula:
  Monthly Messages = Users x Sessions/Month x Messages/Session x 2
  (x2 because each turn = user message + copilot response)

Example:
  500 employees
  2 sessions per month per employee
  10 messages per session (5 turns)
  
  500 x 2 x 10 = 10,000 messages/month

  Base pack: 25,000 messages
  Usage: 10,000 / 25,000 = 40%
  Cost: $200/month (base pack sufficient)

High-volume scenario:
  5,000 external customers
  5 sessions per month
  8 messages per session
  
  5,000 x 5 x 8 = 200,000 messages/month
  Need: 8 x base packs = ~$1,600/month
```

---

## 6. Power Pages Licensing

### 6.1 Pricing Model

```
Authenticated users:
  $200/month per 100 daily authenticated users (DAU)
  DAU = unique user who signs in per day
  Counted per site, pooled calculation

Anonymous users:
  Separate (lower) pricing tier
  Verify current pricing
  Counted by unique daily users

Capacity considerations:
  - Dataverse storage included with Power Apps
  - File storage for uploads
  - Page view bandwidth

Needs verification against current Microsoft docs:
  Power Pages licensing changed from portal add-on.
  Verify current DAU pricing.
```

### 6.2 Estimating DAU

```
Formula:
  DAU = Total registered users x Login frequency

Example:
  1,000 registered customers
  30% log in on any given day
  
  DAU = 1,000 x 0.30 = 300 daily users
  
  License packs: 300 / 100 = 3 packs
  Cost: 3 x $200 = $600/month

Seasonal variation:
  Plan for peak DAU, not average
  Tax portal in April: DAU x 5
  Enrollment period: DAU x 3
```

---

## 7. Premium Connectors Licensing

### 7.1 How Premium Connectors Affect Licensing

```
RULE: Any flow or app using a premium connector requires
      a premium license for the user interacting with it.

Scenarios:
  1. Flow uses Dataverse (premium):
     - Flow owner needs Power Automate Premium OR
     - Flow has Per Flow license

  2. Canvas app uses SQL Server (premium):
     - Every user of the app needs Power Apps license
     - (They already need this for any Power App)

  3. Custom connector used in flow:
     - Custom connectors are PREMIUM
     - Flow owner needs premium license
     - All users triggering need premium license

  4. Flow shared with 50 users:
     - If Per Flow licensed: No per-user license needed
     - If Per User licensed: All 50 users need $15/month
     - Break-even: 33 users (33 x $15 = $495 ~ $500)
```

### 7.2 Common Licensing Mistakes

| Mistake | Impact | Prevention |
|---------|--------|------------|
| Using seeded license with premium connector | Flow fails for non-admin users | Audit all connectors before go-live |
| Not licensing flow triggerers | Users can't trigger flows | Document all user touchpoints |
| Forgetting service account license | Background flows stop working | License all service accounts |
| Sharing app without sharing data permissions | App opens but no data visible | Check both app and data source permissions |
| Using pay-as-you-go without monitoring | Unexpected large bill | Set Azure spending limits |
| Not counting guest/external users | License compliance issue | Track external user access |
| Ignoring capacity overages | Service degradation | Monitor capacity weekly |
| Buying Per User for org-wide flows | Massive unnecessary cost | Use Per Flow for shared processes |
| Not including dev/test licenses | Developers use production | Budget for non-prod licenses |
| Forgetting unattended RPA bots | Bot won't run | Buy bot licenses before deployment |

---

## 8. How to Estimate for a Project

### 8.1 Estimation Worksheet

```
Step 1: Count users
  Internal users: _____
  External users: _____
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
  Concurrent unattended bots: _____
  Premium connector flows: _____

Step 4: Count AI
  AI Builder models: _____
  Estimated monthly calls: _____
  GPT prompts per month: _____

Step 5: Count Copilot Studio
  Agents: _____
  Expected DAU: _____
  Expected monthly messages: _____

Step 6: Calculate
  Power Apps: _____ users x $_____ = $_____/month
  Power Automate: _____ users x $_____ = $_____/month
  Per Flow packs: _____ x $500 = $_____/month
  RPA bots: _____ x $150 = $_____/month
  AI Builder credits: $_____/month
  Copilot Studio: $_____/month
  Power Pages: _____ DAU packs x $200 = $_____/month
  Dataverse capacity: $_____/month
  TOTAL: $_____/month
```

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
```

---

## 9. Tools for Monitoring Usage

### 9.1 Built-in Monitoring

```
Power Platform Admin Center:
  - Licensing page: Assigned vs active licenses
  - Capacity page: Storage usage by type
  - Usage insights: App sessions, flow runs

Azure Cost Management (for pay-as-you-go):
  - Azure portal > Cost Management
  - Filter by Power Platform resources
  - Set budget alerts

Power BI Report (from CoE):
  - License utilization dashboard
  - Capacity trends
  - Usage by environment
```

### 9.2 Monitoring Checklist

```
Weekly:
  [ ] Review license utilization
  [ ] Check for unused assigned licenses
  [ ] Monitor flow run volume

Monthly:
  [ ] Capacity usage check
  [ ] AI Builder credit consumption
  [ ] Copilot Studio message usage
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

*End of Licensing Guide. ALL pricing must be verified against current Microsoft documentation before client proposals. This guide is for estimation only.*
