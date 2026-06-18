---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations
  - https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss
  - https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification
  - https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview
  - https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing
  - https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup
  - https://learn.microsoft.com/en-us/power-platform/guidance/coe/core-components
---

# Governance and Center of Excellence (CoE) Guide

> **Version**: 1.1 | **Last updated**: 2026-06-19 | **Verified against Microsoft Learn**: 2026-06-19 (platform state 2026-H1)
> **Purpose**: Establishing governance, deploying the CoE Starter Kit, and managing Power Platform at scale.
> **Note**: The CoE Starter Kit is [no longer actively maintained by Microsoft](https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup) — its core capabilities now ship natively in the Power Platform admin center (Inventory, Usage, Monitor, Actions). The kit remains downloadable and supported for existing/new deployments but won't gain new features. Managed Environments features change with monthly releases; re-verify component lists against current Microsoft docs.

---

## 1. Why Governance Matters

### 1.1 Without Governance

```
Common problems in unmanaged environments:

- Shadow IT: 500 apps nobody knows about
- Data leakage: Flow sending data to personal Gmail
- License waste: Premium licenses assigned to inactive users
- Security risks: Apps shared with "Everyone in org"
- Orphaned assets: Apps owned by departed employees
- Duplicate effort: 5 expense approval apps
- Compliance violations: No audit trail, no DLP policies
- Production outages: Untested flows running in production
```

### 1.2 Governance Pillars

```
PILLAR 1: Environment Strategy
  - Who can create environments
  - What types are allowed
  - Naming conventions
  - Lifecycle management

PILLAR 2: DLP Policies
  - Which connectors allowed
  - Environment-specific rules
  - Custom connector policies

PILLAR 3: Access Control
  - App/flow sharing rules
  - Service account management
  - Guest user policies

PILLAR 4: ALM Standards
  - Solution-based development
  - Deployment procedures
  - Environment promotion rules

PILLAR 5: Monitoring
  - Usage tracking
  - Capacity monitoring
  - Security auditing
  - Compliance reporting

PILLAR 6: Maker Onboarding
  - Training requirements
  - Standards documentation
  - Support process
  - Community building
```

---

## 2. CoE Starter Kit Components

> Verified against [CoE Starter Kit setup](https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup) and [Use core components](https://learn.microsoft.com/en-us/power-platform/guidance/coe/core-components). The kit is **no longer actively maintained**; Microsoft now recommends the Power Platform admin center's native Inventory/Usage/Monitor/Actions experiences. Components below remain accurate for existing deployments but the exact app/flow names evolve between releases.

### 2.1 Core Components

| Component | What It Does | Key Features |
|-----------|-------------|--------------|
| **Admin - Command Center** | Central dashboard for admins | Environment list, app/flow inventory, alerts |
| **Admin - Sync Template** | Inventory automation | Daily sync of all tenant resources to Dataverse |
| **Admin - Environment Request** | Governance workflow | Users request environments, admins approve |
| **Admin - Compliance Detail** | Compliance reporting | Apps/flows missing descriptions, shared broadly |
| **Admin - App Catalog** | Approved app directory | Users browse and request access to approved apps |
| **Admin - Set App Permissions** | Bulk permission management | Manage sharing across multiple apps |
| **Admin - Set Flow Permissions** | Bulk permission management | Manage sharing across multiple flows |
| **Maker - Command Center** | Maker dashboard | My apps, my flows, my capacity usage |
| **Maker - Training Management** | Training tracking | Assign training, track completion |
| **Maker - Innovation Backlog** | Idea submission | Users submit ideas, vote, track implementation |
| **Theme Editor** | Branding | Customize CoE apps with company branding |

### 2.2 Setup Requirements

```
Prerequisites (per Microsoft Learn — see citation below):
  - A dedicated environment WITH a Dataverse database (a production-type
    environment; Microsoft recommends one test + one production env)
  - Install identity: Power Platform service admin OR global tenant admin
    (Dynamics 365 service admin is NOT supported)
  - Power Apps Per User license (non-trial) + a Microsoft 365 license
  - Power Automate Per User license, or Per Flow licenses (non-trial)
  - A premium license for EVERY app user (Command Center and other CoE
    apps use Dataverse + premium connectors)
  - Power BI Pro (to share the CoE Power BI report); Power BI Premium
    per user or per capacity if using the data-export inventory mechanism
  - Office 365 mailbox usable by the Office 365 Outlook connector
  - Dataverse capacity (monitor - CoE uses significant storage)
  Source: https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup

Environment Setup:
  1. Create dedicated CoE environment
     Name: "CoE-Admin"
     Type: Production with a Dataverse database; default language English;
           security group set to None (open access); no sample apps/data
     Region: Same as main production

  2. Install CoE Starter Kit:
     Download: https://aka.ms/CoEStarterKitDownload  (confirmed live link)
     Import the managed core-components solution:
       CenterofExcellenceCoreComponents_x.xx_managed.zip
     (Import can take up to ~1 hour; upgrades up to ~2 hours.)
     Then open the "CoE Setup and Upgrade Wizard" app for a guided setup
     (the wizard is in preview; manual setup is the fallback).

  3. Configure core components:
     - Admin email address
     - Environment naming pattern
     - Data policy (DLP) names
     - Exclusion lists (if any)

  4. Turn on inventory sync flows:
     "Admin | Sync Template v4 (Driver)" — triggers the inventory crawl.
     (Microsoft also offers a data-export inventory mechanism, in
     experimental preview, that pulls from Azure Data Lake instead of
     running the cloud-flow crawl.) This populates the inventory
     Dataverse tables. The first run can take several hours.

  5. Verify data:
     Check the CoE Admin Command Center app
     Confirm apps, flows, environments visible
```

### 2.3 Monthly Maintenance

```
Required maintenance tasks:
  [ ] Update CoE Starter Kit. A new version is released monthly (usually
      the first full week of the month), but Microsoft recommends
      upgrading AT LEAST every three months — not necessarily every
      month. Test upgrades in a dedicated test env first.
      (https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup)
  [ ] Review compliance report (apps without descriptions)
  [ ] Review orphaned resources (owner left company)
  [ ] Review DLP policy violations
  [ ] Review capacity usage trends
  [ ] Clean up completed environment requests
  [ ] Archive old innovation backlog items
  [ ] Update training assignments
  [ ] Review and respond to maker feedback
```

---

## 3. Managed Environments

### 3.1 Features

> Verified against the [Managed Environments overview](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview). Managed Environments is a suite of premium capabilities that can be applied to ANY environment type (it is not itself a separate "environment type"). The feature set below is confirmed, with corrections noted inline.

```
Managed Environments = Suite of premium governance capabilities applied
to an environment (any type), NOT a distinct environment type.

Feature 1: Sharing Limits
  - Limit sharing to security groups only
  - Prevent sharing with "Everyone in organization"
  - Exclude specific security groups from limits

Feature 2: IP Firewall
  - Restrict access by IP address ranges
  - Allow specific locations only
  - Block access from unknown IPs

Feature 3: Data Policies
  - Enforce DLP policies automatically
  - Block sensitive data export
  - Audit data access

Feature 4: Insights
  - Usage analytics dashboard
  - Most active apps and flows
  - Maker activity trends
  - Capacity consumption

Feature 5: Solution Checker Enforcement
  - Require solution checker before import
  - Block solutions with critical issues

Feature 6: Extended Backup
  - The Managed Environments-specific feature is "Extended backup"
    (longer retention). Automatic system backups, on-demand manual
    backups, and point-in-time restore are STANDARD Dataverse
    environment capabilities, available without Managed Environments;
    Managed Environments adds extended backup retention on top.

Other Managed Environments capabilities (confirmed, not in the
original list): Environment groups, Maker welcome content, Pipelines
in Power Platform, IP cookie binding, Customer Managed Key (CMK),
Customer Lockbox, Virtual Network support, conditional access on
individual apps, app-access control, and data masking rules.
```

### 3.2 Enabling Managed Environments

```
Step 1: Power Platform Admin Center
  Environments > Select environment > Edit

Step 2: Enable Managed Environment
  [x] Enable Managed Environment

Step 3: Configure settings:
  Sharing limits:
    [x] Limit sharing
    Exclude groups: [IT Admins group]

  Usage insights:
    [x] Enable

  Solution checker:
    [x] Enforce
    Block level: High severity issues

Step 4: Set budget allocation (optional)
  Allocate capacity to this environment

Step 5: Save

Note on licensing (corrected): There is NO separate per-environment
fee for Managed Environments. Instead, Managed Environments is an
entitlement included with standalone premium licenses (Power Apps
Premium, Power Automate Premium, Microsoft Copilot Studio, Power Pages,
Dynamics 365). When an environment is managed, EVERY active user must
hold a qualifying premium/standalone license (or qualifying pay-as-you-go
meter); all apps/flows in a managed environment are treated as premium
regardless of the connectors used. The Developer Plan does NOT grant
Managed Environment use rights for end users. A single premium license
(e.g. Power Apps Premium OR Power Automate Premium) covers a user across
app + flow workloads in that environment.
Source: https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing
```

---

## 4. DLP Policies (Data Policies) Design

> Verified against [Manage data policies](https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss) and [Connector classification](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification). Microsoft's current term is **data policies**; "DLP" remains the common name. The three-group model and the cross-group blocking rule below are confirmed.

### 4.1 Policy Structure

```
Data (DLP) policies classify every connector into exactly three groups
(confirmed by Microsoft Learn). New/unassigned connectors land in
Non-Business by default unless you change the default group:

Business Group (allowed to connect to each other):
  - SharePoint
  - Dataverse
  - SQL Server
  - Office 365 Outlook
  - Office 365 Users
  - Microsoft Teams
  - Azure Blob Storage
  - HTTP
  - Custom connectors (your internal APIs)

Non-Business Group (allowed to connect to each other):
  - RSS
  - MSN Weather
  - Notification
  - (Utility connectors)

Blocked Group (cannot use at all):
  - Gmail
  - Twitter (unless approved use case)
  - Facebook
  - Personal OneDrive
  - Unapproved connectors

Important: Connectors in Business CANNOT connect to Non-Business.
This prevents data leakage (e.g., SharePoint -> Gmail).
```

### 4.2 Policy Scope

```
Environment-level policies:
  - Apply to a single specific environment
  - Different rules for dev/test/prod
  - CORRECTION: environment-level policies do NOT override tenant-level
    policies. Per Microsoft Learn, "Environment-level data policies
    can't override tenant-wide data policies." When multiple policies
    apply, they COMBINE, and the most restrictive outcome wins (if ANY
    applicable policy Blocks a connector, it is blocked).
    (https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss)

Tenant-level policies:
  - Apply to all environments (or an included/excluded subset)
  - Baseline security
  - Combine with environment-level policies (see combined-effect rules:
    https://learn.microsoft.com/en-us/power-platform/admin/dlp-combined-effect-multiple-policies)

Best practice:
  1. Tenant-level: Block clearly dangerous connectors
  2. Environment-level: Tailor to environment purpose
     - DEV: Relaxed (allow experimentation)
     - TEST: Same as production
     - PROD: Strict (business connectors only)
```

### 4.3 DLP Policy Best Practices

```
DO:
[+] Document each policy with business justification
[+] Include custom connectors in Business group
[+] Review policies quarterly
[+] Test policies in dev environment first
[+] Notify makers before policy changes
[+] Provide appeal process for exceptions
[+] Monitor policy violation reports

DO NOT:
[X] Block all connectors (makers will find workarounds)
[X] Apply same policy to all environments
[X] Change policies without testing
[X] Ignore policy violation alerts
[X] Forget to include new custom connectors
```

---

## 5. Environment Creation Governance

### 5.1 Environment Request Process

```
Without governance:
  Anyone creates environments -> Sprawl -> Cost overruns

With governance:
  1. Maker submits request via CoE app
     - Environment name
     - Purpose
     - Type needed (Sandbox/Production)
     - Expected duration
     - Makers who need access

  2. Admin reviews request
     - Validate business need
     - Check naming convention
     - Verify capacity availability
     - Determine DLP policy

  3. Admin approves or rejects
     Approved: Auto-provision environment
     Rejected: Reason provided to requester

  4. Environment lifecycle
     - Review date set (3 months default)
     - Auto-notification before review
     - Cleanup if unused
```

### 5.2 Naming Convention

```
Format: [Purpose]-[Project]-[Number]

Examples:
  DEV-SalesApp-01        (Development sandbox)
  TEST-SalesApp-01       (UAT environment)
  PROD-SalesApp-01       (Production)
  POC-RPA-01             (Proof of concept)
  TRAIN-NewHires-01      (Training environment)

Banned names:
  [X] "Test" (too vague)
  [X] "Personal" (not business purpose)
  [X] "Dev" (without project name)
  [X] Any name with employee's personal identifier
```

---

## 6. Quota and Capacity Monitoring

### 6.1 Capacity Types

```
Database capacity:
  - Table data and metadata
  - Includes Dataverse audit logs
  - Monitor: Admin Center > Resources > Capacity

File capacity:
  - Attachments, images
  - Email attachments (if stored in Dataverse)
  - Power Apps images

Log capacity:
  - Plugin trace logs
  - Audit logs (if configured)
  - Flow run history (retained period)

Power Platform request (PPR) limits — CORRECTED per Microsoft Learn
(https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations):
  - Limits are PER LICENSED USER per 24 hours (a sliding window),
    tracked at the user level and NOT pooled at environment or tenant
    level. The previous "500,000/24h per environment (sandbox)" figure
    was incorrect — there is no per-environment request entitlement of
    that kind.
  - 40,000 / 24h per user: paid premium licenses (Power Apps Premium,
    Power Automate Premium / per-user plan, most Dynamics 365 Enterprise
    & Professional apps).
  - 6,000 / 24h per user: Power Apps per-app, Power Apps pay-as-you-go,
    Microsoft 365 apps with Power Platform access, Dynamics 365 Team
    Member.
  - 250,000 / 24h per license: Power Automate Process / per-flow plan,
    and Microsoft Copilot Studio base + add-on packs (entitlement is on
    the FLOW/license, shared across all its users).
  - 200 / 24h: paid Power Apps Portals login.
  - Multiple licenses on one user stack additively (e.g. D365 Customer
    Service Enterprise + Power Apps per-user = 40,000 + 40,000 = 80,000).
  - The 500,000/24h figure DOES exist, but only as the pooled
    NON-LICENSED (application/service/system user) tenant-level base for
    Dynamics 365 Enterprise & Professional (+5,000 per USL, up to 10M).
  - A separate 5-minute limit of 100,000 requests applies regardless of
    license. (Most tenants are still in a transition period with more
    generous enforced limits.)
  - Service-protection limits (Dataverse, connectors, Power Automate)
    apply IN ADDITION to these entitlement limits.
```

### 6.2 Monitoring Setup

```
Dashboard to track:

1. Tenant-level capacity:
   Total allocated vs used vs remaining
   Trend over 90 days

2. Environment-level capacity:
   Top consumers by environment
   Growth rate per environment

3. App/flow-level usage:
   Most active apps (sessions/day)
   Most active flows (runs/day)
   Unused apps/flows (candidates for cleanup)

4. License utilization:
   Active vs assigned licenses
   License type breakdown
   Renewal forecast

Setup:
  - Use CoE Starter Kit dashboards
  - Configure Power BI dashboard from CoE data
  - Set email alerts at 70%, 85%, 95% thresholds
```

---

## 7. App and Flow Auditing

### 7.1 What to Audit

```
Audit events to track:
  - App created/deleted
  - App shared/unshared
  - App permissions changed
  - Flow created/deleted/modified
  - Flow turned on/off
  - Flow ownership changed
  - Environment created/deleted
  - DLP policy changes
  - Connector added/removed
  - User license assignment

Where to find:
  Power Platform Admin Center > Auditing
  Azure AD > Sign-in logs
  CoE Starter Kit > Compliance dashboards
```

### 7.2 Compliance Monitoring

```
Compliance checks (run weekly):

Check 1: Orphaned resources
  Query: Apps/flows where owner is disabled/deleted
  Action: Reassign to new owner or archive

Check 2: Overly shared resources
  Query: Apps shared with > 50 users or "Everyone"
  Action: Review and tighten sharing

Check 3: Missing metadata
  Query: Apps/flows without description
  Action: Notify owner, set deadline

Check 4: Premium license compliance
  Query: Users with premium connectors but no premium license
  Action: Assign license or modify flow

Check 5: Unused resources
  Query: Apps with 0 sessions in 90 days, flows with 0 runs
  Action: Archive or delete after notification

Check 6: Classic workflow audit
  Query: Classic workflows still active
  Action: Plan migration to cloud flows
```

---

## 8. Data Loss Prevention Strategy

### 8.1 Multi-Layer DLP

```
Layer 1: Tenant baseline
  - Block clearly dangerous connectors
  - Require business justification for premium connectors
  - Log all connector usage

Layer 2: Environment policies
  - Dev: Relaxed (innovation allowed)
  - Test: Same as production
  - Prod: Strict (business only)

Layer 3: Endpoint protection
  - Conditional access policies
  - IP restrictions for sensitive environments
  - Device compliance checks

Layer 4: User education
  - Training on secure practices
  - Regular security communications
  - Reporting process for concerns
```

### 8.2 Sensitive Data Handling

```
DO:
[+] Use Azure Key Vault for secrets
[+] Encrypt sensitive fields (field-level encryption)
[+] Audit access to sensitive tables
[+] Use DLP to prevent export to personal services
[+] Implement retention policies
[+] Train makers on data classification

DO NOT:
[X] Store passwords in flow steps
[X] Send sensitive data to personal email
[X] Use Excel/SharePoint for sensitive data without permissions
[X] Skip audit logging for sensitive tables
[X] Allow anonymous access to sensitive data
```

---

## 9. Maker Onboarding Process

### 9.1 Onboarding Checklist

```
Before granting maker access:

[ ] Complete Power Platform fundamentals training
[ ] Read organization standards document
[ ] Attend security briefing
[ ] Acknowledge acceptable use policy
[ ] Request environment (via CoE app)
[ ] Get environment approved and provisioned
[ ] Assigned to appropriate DLP policy
[ ] Assigned security group for sharing
[ ] Assigned maker buddy/mentor
[ ] Added to maker community Teams channel

Standards document should cover:
  - Naming conventions (apps, flows, tables, env vars)
  - Required solution usage
  - Connection reference requirements
  - Error handling standards
  - Sharing policies
  - Support process
  - Training resources
```

### 9.2 Maker Community

```
Build internal Power Platform community:

Monthly activities:
  - "Lunch and Learn" sessions
  - App showcase (demo apps from makers)
  - Tips and tricks sharing
  - Office hours (ask anything)

Quarterly activities:
  - Hackathon
  - Governance review
  - Training needs assessment
  - Community recognition awards

Communication channels:
  - Teams channel: "Power Platform Community"
  - Monthly newsletter
  - Yammer/SharePoint site
  - Regular admin office hours
```

---

## 10. Center of Excellence Team Structure

### 10.1 Recommended Team

```
Core Team (minimum):
  Power Platform Admin (0.5-1 FTE)
    - Environment management
    - DLP policies
    - License management
    - Capacity monitoring

  Solution Architect (0.5-1 FTE)
    - Standards definition
    - Code review
    - Complex solution design
    - ALM process

Extended Team:
  Security Admin (0.25 FTE)
    - Access reviews
    - Security policy
    - Audit response

  Trainer/Community Manager (0.25 FTE)
    - Onboarding
    - Training delivery
    - Community building

  Support (L2/L3) (0.5 FTE)
    - Maker support
    - Troubleshooting
    - Best practice guidance
```

---

## 11. Compliance and Privacy

### 11.1 Regulatory Considerations

```
GDPR (EU):
  - Right to be forgotten (data deletion)
  - Data export on request
  - Consent tracking
  - Audit trail of data access
  - Data residency (EU datacenter)

HIPAA (US healthcare):
  - BAA with Microsoft required
  - Encryption at rest and in transit
  - Access logging
  - Data minimization

SOX (Financial):
  - Change management documentation
  - Segregation of duties
  - Audit trail for financial data
  - Access controls

General:
  - Data classification labels
  - Retention policies
  - Backup and recovery
  - Penetration testing
```

### 11.2 Privacy Configuration

```
Power Platform privacy settings:

Tenant-level (Power Platform Admin Center > Settings > Tenant settings):
  [x] "Data sharing for Dynamics 365 Copilot and Power Platform Copilot
      AI Features" toggle — note: this is OFF BY DEFAULT (Microsoft does
      NOT use your data to train/improve Copilot unless you opt in). It
      is also currently available only for US-region tenants. Opting out
      later deletes shared data within 30 days.
  [x] "Copilot in Power Apps" maker toggle can be turned off, BUT
      generally available Copilot features are on by default and can only
      be turned off by contacting Microsoft Support. Cross-geo data
      sharing for Copilot can also be toggled off at tenant level.
      (https://learn.microsoft.com/en-us/power-platform/faqs-copilot-data-sharing)
  [x] Configure data residency

Environment-level:
  Settings > Privacy
  [x] Audit data access
  [x] Enable audit logging
  [x] Configure retention period

User-level:
  User settings > Privacy
  Users control their own privacy settings
```

---

## 12. Common Governance Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| "Lock everything down" | Makers go rogue, use shadow IT | Balanced approach with approved exceptions |
| "No governance at all" | Security risks, cost overruns | Start with basic DLP and environment policies |
| "CoE installed but not maintained" | Outdated data, ignored alerts | Monthly maintenance schedule |
| "Same policy for all environments" | Stifles innovation in dev | Tiered policies per environment type |
| "Ignoring orphaned resources" | Security holes, license waste | Weekly orphaned resource review |
| "No maker training" | Poor quality apps, support burden | Mandatory onboarding before access |
| "Admin does everything" | Bottleneck, slow delivery | Delegated admin, self-service where possible |
| "No capacity planning" | Unexpected overages | Monthly capacity review and forecasting |
| "Environment sprawl" | Unmanaged costs | Environment request and review process |
| "Set and forget DLP" | New connectors unblocked | Quarterly DLP review |

---

*End of Governance and CoE Guide. Consequential platform facts (request limits, DLP/data-policy behaviour, Managed Environments features and licensing, CoE Starter Kit setup) were verified against Microsoft Learn on 2026-06-19 (platform state 2026-H1) — see the `sources` in the frontmatter. CoE Starter Kit component names and Managed Environments capabilities evolve with monthly releases; re-verify against current Microsoft documentation before relying on exact app/flow names.*

> **HIPAA BAA note (unverified as of 2026-06-19 — confirm against Microsoft Learn):** the statement in §11 that a HIPAA Business Associate Agreement "is required" is general guidance; confirm current Microsoft HIPAA/BAA coverage and any service-specific exclusions against the Microsoft Trust Center / Microsoft Learn before relying on it for a compliance attestation.
