---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/about-encryption
  - https://learn.microsoft.com/en-us/power-platform/admin/customer-managed-key
  - https://learn.microsoft.com/en-us/power-platform/admin/field-level-security
  - https://learn.microsoft.com/en-us/power-platform/admin/hierarchy-security
  - https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds
  - https://learn.microsoft.com/en-us/power-platform/admin/server-cipher-tls-requirements
  - https://learn.microsoft.com/en-us/power-platform/admin/regions-overview
  - https://learn.microsoft.com/en-us/power-platform/guidance/adoption/conditional-access
  - https://learn.microsoft.com/en-us/power-platform/admin/dataverse-privacy-dsr-guide
  - https://learn.microsoft.com/en-us/azure/security/fundamentals/pen-testing
  - https://www.microsoft.com/en-us/msrc/pentest-rules-of-engagement
---

# Security and Privacy Guide

> **Version**: 1.1 | **Last updated**: 2026-06-19 | **Verified against Microsoft Learn**: 2026-06-19 (platform state 2026-H1)
> **Purpose**: Security architecture, implementation patterns, and compliance for Power Platform.
> **Note**: Security features and compliance certifications are updated frequently. Inline citations link to the Microsoft Learn pages used to verify each claim; re-verify before relying on any figure for a client engagement.

---

## 1. Dataverse Security Model

Dataverse layers tenant (Microsoft Entra ID), environment, business unit, security role, and record/row plus column controls. The layered model below maps to the documented Dataverse security concepts ([Security concepts in Microsoft Dataverse](https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds), [Role-based security roles](https://learn.microsoft.com/en-us/power-platform/admin/database-security)).

### 1.1 Security Layers

```
Layer 1: Organization (Tenant)
  - Azure AD controls who can access
  - Conditional access policies
  - MFA enforcement

Layer 2: Environment
  - Who can access which environment
  - Environment admin roles
  - Managed Environment policies

Layer 3: Business Unit
  - Data segmentation
  - Hierarchical access
  - Record isolation between BUs

Layer 4: Security Role
  - Table-level permissions (CRUD)
  - Field-level permissions
  - Feature access

Layer 5: Record-Level
  - Owner (user or team)
  - Shared with (explicit sharing)
  - Access teams (dynamic sharing)
  - Hierarchy security (manager access)

Layer 6: Field-Level
  - Field security profiles
  - Read/Create/Update per field
  - Additional encryption if needed
```

### 1.2 Security Role Design Best Practices

```
Principle: Least Privilege
  Give users ONLY the permissions they need to do their job.

Design process:
  1. Identify user personas
     - Customer Service Rep
     - Sales Manager
     - Finance Analyst
     - Admin

  2. For each persona, define:
     - Which tables they need
     - What operations (CRUD) per table
     - Which fields are sensitive
     - Which BU they belong to

  3. Create custom security roles:
     Start from "Basic User" (minimum)
     Add permissions incrementally
     Never start from "System Administrator"

  4. Test with real scenarios:
     Can CS Rep see only their cases? YES
     Can CS Rep edit closed cases? NO
     Can Sales Manager see team pipeline? YES
     Can Sales Manager see finance data? NO

  5. Document and review quarterly
```

### 1.3 Common Security Role Template

```
Role: Customer Service Representative

Core Records:
  Case:          Read (BU), Create (User), Write (User), Delete (None)
  Contact:       Read (BU), Create (User), Write (User), Delete (None)
  Account:       Read (BU), Create (None), Write (None), Delete (None)
  Activity:      Read (BU), Create (User), Write (User), Delete (None)
  Note:          Read (BU), Create (User), Write (User), Delete (None)

Custom Tables:
  Knowledge Article: Read (Organization), Create (None), Write (None)
  Escalation:        Read (BU), Create (User), Write (User)

Business Management:
  User:          Read (BU)
  Team:          Read (BU)
  Business Unit: Read (None - can't see BU structure)

Customization:
  None (end users shouldn't customize)

Field Security:
  Contact.SSN:        No access
  Account.CreditLimit: Read only (can't modify)
```

---

## 2. Column-Level and Row-Level Security

### 2.1 Column-Level Security (Field Security)

Microsoft now calls this **column-level security**; "field security" is the legacy term. Verified against [Column-level security (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/field-level-security).

```
Use when: Specific fields need extra protection
  - Social Security Numbers
  - Salary information
  - Credit card numbers
  - Health information
  - Passwords/secrets

Setup (current maker/admin experience):
  Step 1: Solution > Table > Columns > select column >
          Advanced options > General > Enable column security
  Step 2: Optionally select a Masking rule (native masking is supported)
  Step 3: Power Platform Admin Center > environment > Settings >
          Users + permissions > Column security profiles
  Step 4: Create profile (e.g., "HR Sensitive Data Access")
  Step 5: Add users/teams to the profile
  Step 6: Set permissions per column: Read / Read unmasked / Update / Create

How enforcement works (corrected):
  - Column-level security is organization-wide and enforced at the
    Dataverse data/API layer for ALL access paths — model-driven apps,
    canvas apps, the Web API, and connectors — not just model-driven apps.
  - System administrators ALWAYS bypass column security; data is never
    hidden from the System Administrator role. Test with a non-admin account.
  - Plugins/custom code: a column security profile must grant the
    application/service principal access, or it sees masked/locked values
    like any other principal (it does NOT automatically see all fields).
  - Changes to column security require an end-user browser refresh to take
    effect on the client.

Which columns can be secured (corrected):
  - Most custom and system columns CAN be secured — including many
    system columns containing PII.
  - Columns that CANNOT be secured: virtual-table columns, lookup columns,
    formula columns, primary name columns, and system columns such as
    createdon, modifiedon, statecode, and statuscode.
  - File and Image columns can be secured but not masked; rich-text columns
    can be secured but embedded images can't be masked.
  - (The older guidance that "system fields cannot be secured" is no longer
    accurate — most system columns are eligible; only a defined set is excluded.)

Best practice:
  - Minimize secured columns (avoid unnecessary overhead)
  - Document which columns are secured and why
  - Regular access review
```

### 2.2 Row-Level Security

Row-level access in Dataverse combines ownership, business units, sharing, access teams, and hierarchy security. Verified against [Security concepts in Microsoft Dataverse](https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds) and [Hierarchy security](https://learn.microsoft.com/en-us/power-platform/admin/hierarchy-security).

```
Method 1: Ownership
  - Every record has an owner (user or team)
  - User can access: Own records + shared records
  - Most common, easiest to implement

Method 2: Business Unit
  - Records scoped to BU
  - Parent/child BU access configurable
  - Good for organizational structure

Method 3: Access Teams
  - Dynamic team per record
  - Add/remove members per record
  - Good for ad-hoc collaboration
  - No ownership change needed

Method 4: Hierarchy Security
  - Two models: Manager hierarchy and Position hierarchy.
  - Manager hierarchy: a manager gets read/write/append/append-to on
    DIRECT reports' records and read-only on non-direct reports in the
    same management chain; the manager must be in the same business unit
    (or the parent BU) as the report.
  - Position hierarchy: grants access across business units based on
    position, independent of the manager chain.
  - Depth limits how many levels deep read access extends (e.g. depth 2 =
    own records plus reports two levels down).
  - Hierarchy security SUPPLEMENTS security roles; users still need at
    least user-level read on the table. Microsoft recommends keeping the
    effective hierarchy to <= 50 users under a manager/position.

Setup hierarchy security (corrected path):
  Settings > Security > Hierarchy Security (requires the
    "Change Hierarchy Security Settings" privilege)
  Select [x] Enable Manager Hierarchy Model  -OR-
         [x] Enable Position Hierarchy Model
  Manager model uses the User table's Manager field.
  Set Depth (e.g. 1 = direct reports only, deeper for skip-levels).
```

---

## 3. Sharing and Ownership Models

### 3.1 Ownership Best Practices

```
DO:
[+] Assign records to the person responsible
[+] Use team ownership for queue-based work
[+] Set default owner via flow or plugin
[+] Audit ownership changes
[+] Minimize ownership transfers (creates audit noise)

DO NOT:
[X] Leave records unassigned (owned by SYSTEM)
[X] Assign everything to one user
[X] Use service account as record owner
[X] Transfer ownership without business reason
```

### 3.2 Sharing Best Practices

```
DO:
[+]] Use team sharing instead of individual sharing
[+] Set sharing limits in Managed Environments
[+] Audit shared records regularly
[+] Use access teams for temporary sharing
[+] Document sharing policies

DO NOT:
[X] Share with "Everyone" or large groups
[X] Cascade share unnecessarily (creates many share records)
[X] Leave shares in place after project ends
[X] Share sensitive records broadly
```

---

## 4. Service Accounts and Application Users

### 4.1 Service Account Types

| Type | Use Case | Authentication | Risk Level |
|------|----------|---------------|------------|
| **Named user (dedicated)** | Flow ownership, app ownership | Username/password | Medium |
| **Application user** | Server-to-server, API calls | Client secret/certificate | Low |
| **Managed identity** | Azure resources | Azure-managed | Low |

### 4.2 Application User Setup

This is the server-to-server (S2S) / confidential-client flow: a Dataverse application user bound to a Microsoft Entra ID app registration. It does not consume a paid license. Verified against [Register an app with Microsoft Entra ID](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/walkthrough-register-app-azure-active-directory) and [Use OAuth authentication with Dataverse](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/authenticate-oauth).

```
Step 1: Microsoft Entra ID (formerly "Azure AD") > App registrations > New
  Name: PP-Integration-Service
  Supported account types: Single tenant
  (For a confidential client you do NOT need to grant the
   "Access Dynamics 365 as organization users" delegated permission —
   the app is bound to a Dataverse application user instead.)

Step 2: Certificates & secrets
  Create certificate (preferred) or client secret
  Copy the secret value immediately — it isn't shown again after you
  leave the page. Save the certificate thumbprint or secret value.

Step 3: Create the custom security role in Dataverse first
  Define the minimum access/privileges the integration needs
  (tables/columns only — no admin privileges unless absolutely required).

Step 4: Create the Application User in the Power Platform Admin Center
  PPAC > environment > Settings > Users + permissions > Application users
  New app user:
    App (Application/Client ID): (from Step 1)
    Business unit + Security role: the custom "Integration Service Role"
  (Permissions can be granted directly or via a team.)

Step 5: Use in code (Dataverse SDK for .NET — Microsoft.PowerPlatform.Dataverse.Client).
  ServiceClient (which uses MSAL) handles the OAuth flow. Prefer a
  connection string with AuthType=ClientSecret:

  string connectionString = $@"
    AuthType = ClientSecret;
    Url = https://yourorg.crm.dynamics.com;
    ClientId = {clientId};
    ClientSecret = {clientSecret}";
  IOrganizationService service = new ServiceClient(connectionString);

  // The typed constructor below is also valid:
  // new ServiceClient(new Uri(url), clientId, clientSecret, useUniqueInstance: false);
```

> Microsoft recommends using the most secure flow available — prefer managed identities or certificate credentials over client secrets where viable.

### 4.3 Service Account Security

```
DO:
[+] Use dedicated accounts (not personal)
[+] Use strong passwords (if not using cert)
[+] Store secrets in Azure Key Vault
[+] Rotate credentials quarterly
[+] Monitor account activity
[+] Disable when no longer needed
[+] Use certificates instead of secrets where possible
[+] Restrict IP access via conditional access

DO NOT:
[X] Share service account credentials
[X] Use same account across multiple clients
[X] Grant System Administrator to service accounts
[X] Store secrets in flow definitions
[X] Use service accounts for interactive login
```

---

## 5. Microsoft Entra ID Integration (formerly Azure AD)

### 5.1 Conditional Access for Power Platform

Power Platform uses Microsoft Entra ID Conditional Access (requires Entra ID P1/P2; otherwise use Security Defaults). Verified against [Configure identity and access management — Conditional Access](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/conditional-access).

> **Targeting note (corrected):** there is no single "Power Platform" cloud app. Target **All cloud apps**, or explicitly include the relevant apps. In particular **Microsoft Flow Service** (App ID `7df0a125-d3be-4c96-aa54-591f83ff541c`) is NOT covered by the Office 365 app target, so embedded Power Automate from SharePoint/Teams/Excel can fail (AADSTS50076) if you only target Office 365. Always exclude break-glass/emergency accounts. Note that Conditional Access policies scoped to users don't block service principals — use Conditional Access for workload identities for those.

```
Configure in Microsoft Entra ID > Protection > Conditional Access

Policy 1: Require MFA for all Power Platform access
  Users: All users
  Cloud apps: All cloud apps (or include Microsoft Flow Service + Dataverse)
  Conditions: None
  Access controls: Require MFA

Policy 2: Block access from high-risk locations
  Users: All users
  Cloud apps: All cloud apps (or include Microsoft Flow Service + Dataverse)
  Conditions: Locations (exclude trusted)
  Access controls: Block

Policy 3: Require compliant device for admin roles
  Users: Power Platform admins
  Cloud apps: All cloud apps (or include Microsoft Flow Service + Dataverse)
  Conditions: None
  Access controls: Require device to be marked as compliant

Policy 4: Block legacy authentication
  Users: All users
  Cloud apps: All cloud apps (or include Microsoft Flow Service + Dataverse)
  Conditions: Client apps > Legacy auth
  Access controls: Block
```

### 5.2 Guest User Access

Guest access is governed by Microsoft Entra B2B collaboration settings; see [Configure identity and access management](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/conditional-access). Specific guest licensing and connector behaviour vary by scenario.

```
External/guest users CAN access Power Platform:
  - Apps shared with them
  - Flows they trigger
  - Teams-embedded apps

Controls:
  - Enable in Azure AD: Collaboration settings
  - Set DLP policies for guest access
  - Monitor guest activity
  - Review guest access quarterly

Limitations:
  - Guests may need additional licensing
  - Some connectors restricted for guests
  - MFA may be required depending on home tenant
```

---

## 6. DLP and Data Governance

### 6.1 DLP Policy Strategy

```
See connectors-guide.md for detailed DLP setup.

Key security-related DLP rules:

Rule 1: Personal email blocked in production
  Blocked: Gmail, Yahoo Mail, personal Outlook
  Reason: Prevent data exfiltration

Rule 2: Personal cloud storage blocked
  Blocked: Dropbox, personal OneDrive, personal Google Drive
  Reason: Prevent data leakage

Rule 3: Social media requires approval
  Blocked: Twitter, Facebook, LinkedIn (default)
  Exception: Marketing team (separate policy)

Rule 4: External APIs restricted
  Allowed: Only approved custom connectors
  Process: Request approval via CoE app
```

### 6.2 Data Classification

```
Implement data classification labels:

Public: Anyone can access
  - Published knowledge articles
  - Public web content

Internal: Company employees
  - Most business data
  - Internal processes

Confidential: Specific teams/roles
  - Financial data
  - HR records
  - Customer PII

Highly Confidential: Minimal access
  - Credit card data
  - Health records
  - Legal documents

Implementation:
  - Use Microsoft Purview sensitivity labels
  - Apply to Dataverse columns
  - Enforce via DLP policies
  - Audit access to high-classification data
```

---

## 7. Encryption

### 7.1 Encryption at Rest

Confirmed against [About data encryption (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/about-encryption) and [Manage your customer-managed encryption key](https://learn.microsoft.com/en-us/power-platform/admin/customer-managed-key).

```
Dataverse:
  - AES-256 encryption for all data at rest (Microsoft Crypto Board approved)
  - Microsoft-managed keys by default (Microsoft stores/manages the key)
  - Customer-managed key (CMK) available for added control

Customer-managed keys (CMK):
  - Store keys in your own Azure Key Vault (or Key Vault Managed HSM
    for FIPS 140-2 Level 3); requires an Azure subscription with Key Vault
  - Rotate or swap the encryption key on demand
  - Revoke key access to block Microsoft access; can revert to a
    Microsoft-managed key at any time
  - Key Vault MUST have Soft Delete and Purge protection enabled
  - WARNING: if the key expires, all environments encrypted with it go
    down — monitor and alert on key/cert expiry

Setup CMK (corrected — uses a Power Platform enterprise policy):
  1. Key Vault admin creates a key in Azure Key Vault and creates a
     Power Platform enterprise policy (this creates a Microsoft Entra
     managed identity).
  2. Grant that enterprise policy/managed identity access to the key,
     then grant the Power Platform/Dynamics 365 service admin read access
     to the enterprise policy.
  3. Service admin adds environments to the enterprise policy in the
     Power Platform Admin Center; added environments are then encrypted
     with the CMK.
  (Recommended: separate duties so the Key Vault admin is not also a
   Power Platform admin.)
```

### 7.2 Encryption in Transit

Confirmed against [Server cipher suites and TLS requirements (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/server-cipher-tls-requirements): Power Platform requires all incoming HTTP traffic to use TLS 1.2 or higher and rejects TLS 1.1 or lower; Dataverse uses TLS 1.3 and 1.2 cipher suites and enables HSTS. TLS 1.0/1.1 and weak ciphers (e.g. TLS_RSA) are deprecated; Microsoft recommends moving to TLS 1.3.

```
All Power Platform traffic:
  - TLS 1.2 minimum (TLS 1.1 and below are rejected); TLS 1.3 supported
  - HTTPS for all connections; HSTS enabled
  - Encrypted between services

Verify in your integrations:
  - Custom connectors: Must use HTTPS
  - API endpoints: TLS 1.2 required
  - Certificate validation: Enabled
  - No hardcoded HTTP URLs
```

---

## 8. Privacy Compliance

### 8.1 GDPR Compliance

Microsoft provides a dedicated Data Subject Rights (DSR) guide for Dataverse — see [Responding to DSR requests for Microsoft Dataverse customer data](https://learn.microsoft.com/en-us/power-platform/admin/dataverse-privacy-dsr-guide) and [Compliance and data privacy](https://learn.microsoft.com/en-us/power-platform/admin/wp-compliance-data-privacy).

```
Dataverse features for GDPR:
  - Consent tracking (custom implementation)
  - Right to erasure: delete the user's personal data, or permanently
    delete the user record. Note: deleting a user in M365 only DISABLES
    the Dataverse user; an admin must remove/delete personal data.
    Erasure removes system-generated logs but NOT audit-log data.
  - Data export / portability: export to Excel (then save as CSV/XML) or
    via the Dataverse Web API. (Corrected: the Configuration Migration
    Tool is for configuration/reference data, not DSR data portability.)
  - Audit trail (who accessed what when); audit data retained 90 days,
    exportable as CSV. A permanently deleted user shows as "No Name" in
    audit logs (anonymized, not removed).
  - Data residency (EU/EUDB datacenter for EU data)

Implementation:
  1. Consent field on Contact table
  2. Flow: Check consent before processing
  3. Process: On erasure request, delete all personal data
  4. Document: Maintain processing records
  5. Transfer: Use EU datacenter for EU data
```

### 8.2 Data Residency

Region availability is set per environment and bounded by "macro regions" (data-residency boundaries). The list below is indicative — verify the current set against [Power Platform and Dynamics 365 datacenter regions](https://learn.microsoft.com/en-us/power-platform/admin/new-datacenter-regions) and [Choose the region when setting up an environment](https://learn.microsoft.com/en-us/power-platform/admin/regions-overview). Note: India and Australia have tax-law restrictions tying the environment region to the tenant's country (an exception is possible for Australia).

```
Power Platform datacenter regions (indicative — confirm current list):
  - United States
  - Europe (EU)
  - UK
  - Asia Pacific
  - Japan
  - India
  - Australia
  - Canada
  - South America
  - Middle East
  - Africa

Multi-geo:
  - Different environments in different regions
  - Data doesn't leave chosen region
  - Configure per environment

Verify current regions:
  https://learn.microsoft.com/en-us/power-platform/admin/regions-overview
```

---

## 9. Penetration Testing Considerations

### 9.1 Scope

```
What to test:
  - Custom connectors (API endpoints)
  - Power Pages sites (public-facing)
  - Custom plugins (server-side code)
  - PCF components (client-side code)
  - Integration flows (data handling)

What NOT to test (Microsoft responsibility):
  - Dataverse platform itself
  - Power Automate engine
  - Power Apps runtime
  - Microsoft-managed infrastructure
```

### 9.2 Pen Test Requirements

Corrected per [Penetration testing (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/security/fundamentals/pen-testing): as of June 15, 2017, Microsoft no longer requires pre-approval or notification to pen-test your own cloud resources, but you MUST comply with the [Microsoft Cloud Unified Penetration Testing Rules of Engagement](https://www.microsoft.com/en-us/msrc/pentest-rules-of-engagement) (the ROE is the authoritative source). Denial-of-service (DoS/DDoS) testing is prohibited under all circumstances. Third parties need explicit written authorization from the resource owner.

```
Before pen testing:
  1. No notification/pre-approval needed, BUT comply with the Rules of
     Engagement (ROE). DoS/DDoS testing is never allowed.
     https://www.microsoft.com/en-us/msrc/pentest-rules-of-engagement

  2. Scope definition:
     - Target environment (NOT production)
     - Test accounts (don't use real user accounts)
     - IP ranges
     - Time window

  3. Test environment setup:
     - Copy production to isolated sandbox
     - Use anonymized data
     - Enable full auditing

  4. What to look for:
     - Injection vulnerabilities
     - Broken authentication
     - Sensitive data exposure
     - Access control issues
     - Insecure direct object references
```

---

## 10. Security Audit Checklist

### 10.1 Quarterly Security Review

```
[ ] Security role assignments reviewed
    - No orphaned roles
    - Least privilege enforced
    - Inactive users removed

[ ] Field security profiles reviewed
    - Correct users have access
    - No unauthorized access

[ ] Sharing audit
    - No overly shared records
    - Old shares removed
    - Guest access reviewed

[ ] Application users/service accounts
    - Credentials rotated
    - Minimum permissions
    - Activity reviewed

[ ] DLP policies
    - No violations
    - Policies current
    - New connectors covered

[ ] Environment access
    - Only authorized users
    - Admin roles appropriate
    - Inactive environments reviewed

[ ] Audit logs
    - Full audit enabled on sensitive tables
    - Logs retained appropriately
    - Suspicious activity investigated

[ ] Encryption
    - CMK rotation (if used)
    - Certificate expiration checked
    - TLS version current

[ ] Conditional access
    - MFA enforced
    - Risk policies active
    - Location restrictions working

[ ] Data loss prevention
    - No policy violations
    - Incident response documented
    - Remediation completed
```

### 10.2 Pre-Go-Live Security Checklist

```
[ ] All security roles tested with actual personas
[ ] Field security verified in model-driven app
[ ] Canvas app security built (if using Dataverse)
[ ] Service accounts configured with minimum permissions
[ ] DLP policies configured and tested
[ ] Conditional access policies active
[ ] Audit logging enabled for all sensitive tables
[ ] Encryption verified (at rest and in transit)
[ ] Sharing limits configured (Managed Environment)
[ ] Guest access policies documented
[ ] Data residency confirmed
[ ] Privacy compliance verified
[ ] Penetration testing completed (if required)
[ ] Security documentation complete
[ ] Incident response plan documented
[ ] Security training completed for admins
```

---

*End of Security Guide. Verify all security features and compliance certifications against current Microsoft documentation.*
