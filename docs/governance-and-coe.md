# Governance and Center of Excellence (CoE) Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Establishing governance, deploying the CoE Starter Kit, and managing Power Platform at scale.
> **Needs verification against current Microsoft docs**: CoE Starter Kit components and Managed Environment features change with monthly releases.

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
Prerequisites:
  - Dedicated environment (NOT production)
  - Power Platform Admin role in Azure AD
  - Power Automate Per User license (for flows)
  - Power Apps Per User license (for apps)
  - Dataverse capacity (monitor - CoE uses significant storage)
  - SQL Server Connector (premium, for some features)

Environment Setup:
  1. Create dedicated CoE environment
     Name: "CoE-Admin"
     Type: Production (flows need to run continuously)
     Region: Same as main production

  2. Install CoE Starter Kit:
     Download: https://aka.ms/coestarterkitdownload
     Import solution: CoEStarterKit.zip
     Run setup wizard

  3. Configure core components:
     - Admin email address
     - Environment naming pattern
     - DLP policy names
     - Exclusion lists (if any)

  4. Turn on sync flows:
     Admin - Sync Template v3 ( runs daily )
     This populates the inventory Dataverse tables

  5. Verify data:
     Check Admin - Command Center app
     Confirm apps, flows, environments visible
```

### 2.3 Monthly Maintenance

```
Required monthly tasks:
  [ ] Update CoE Starter Kit (new version released monthly)
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

```
Managed Environments = Premium environment type with built-in governance

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

Feature 6: Backup and Restore
  - Automatic daily backups
  - On-demand backups
  - Point-in-time restore
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

Note: There is a cost per Managed Environment.
Verify current pricing before enabling.
```

---

## 4. DLP Policies Design

### 4.1 Policy Structure

```
DLP policies have connector groups:

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
  - Apply to specific environments
  - Different rules for dev/test/prod
  - Override tenant-level policies

Tenant-level policies:
  - Apply to all environments (unless overridden)
  - Baseline security
  - Prevent completely blocked connectors

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

API request limits:
  - Per user: 40,000/24 hours (premium)
  - Per environment: 500,000/24 hours (sandbox), higher for production
  - Per flow: No explicit limit (within user/env limits)
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

Tenant-level:
  Admin Center > Settings > Privacy
  [x] Disable Copilot data sharing (if required)
  [x] Opt out of AI training data usage (if required)
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

*End of Governance and CoE Guide. Verify all CoE Starter Kit components and Managed Environment features against current Microsoft documentation.*
