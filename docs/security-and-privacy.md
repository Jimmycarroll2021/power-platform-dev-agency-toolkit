# Security and Privacy Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Security architecture, implementation patterns, and compliance for Power Platform.
> **Needs verification against current Microsoft docs**: Security features and compliance certifications are regularly updated.

---

## 1. Dataverse Security Model

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

```
Use when: Specific fields need extra protection
  - Social Security Numbers
  - Salary information
  - Credit card numbers
  - Health information
  - Passwords/secrets

Setup:
  Step 1: Column properties > Advanced > Enable Field Security
  Step 2: Settings > Security > Field Security Profiles
  Step 3: Create profile (e.g., "HR Sensitive Data Access")
  Step 4: Add users/teams to profile
  Step 5: Set permissions per field: Read / Update / Create

Limitations:
  - Only works in model-driven apps (native enforcement)
  - Canvas apps: Must build separate validation
  - Plugins: Run in system context (see all fields)
  - Not available for all field types
  - System fields cannot be secured

Best practice:
  - Minimize secured fields (performance impact)
  - Document which fields are secured and why
  - Regular access review
```

### 2.2 Row-Level Security

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
  - Manager can see direct reports' records
  - Can be extended to management chain
  - Good for manager oversight
  - Configurable depth (manager, skip-level, etc.)

Setup hierarchy security:
  Settings > Security > Hierarchy Security
  [x] Enable Hierarchy Modeling
  Hierarchy Table: User
  Hierarchy Field: Manager
  Depth: 1 (direct reports only) or deeper
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

```
Step 1: Azure AD > App Registrations > New
  Name: PP-Integration-Service
  Supported account types: Single tenant

Step 2: API Permissions > Add > Dynamics CRM
  user_impersonation

Step 3: Certificates & Secrets
  Create certificate (preferred) or secret
  Save certificate thumbprint or secret value

Step 4: Create Application User in Dataverse
  Settings > Security > Users > switch to Application Users
  New:
    Application ID: (from Step 1)
    Full Name: Integration Service
    Security Role: Custom "Integration Service Role"

Step 5: Assign minimum permissions
  Only tables/columns needed for integration
  No admin privileges unless absolutely required

Step 6: Use in code:
  var client = new ServiceClient(
    new Uri("https://yourorg.crm.dynamics.com"),
    "app-id",
    "client-secret",
    false);
```

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

## 5. Azure AD Integration

### 5.1 Conditional Access for Power Platform

```
Configure in Azure AD > Security > Conditional Access

Policy 1: Require MFA for all Power Platform access
  Users: All users
  Cloud apps: Power Platform
  Conditions: None
  Access controls: Require MFA

Policy 2: Block access from high-risk locations
  Users: All users
  Cloud apps: Power Platform
  Conditions: Locations (exclude trusted)
  Access controls: Block

Policy 3: Require compliant device for admin roles
  Users: Power Platform admins
  Cloud apps: Power Platform
  Conditions: None
  Access controls: Require device to be marked as compliant

Policy 4: Block legacy authentication
  Users: All users
  Cloud apps: Power Platform
  Conditions: Client apps > Legacy auth
  Access controls: Block
```

### 5.2 Guest User Access

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

```
Dataverse:
  - AES-256 encryption for all data at rest
  - Microsoft-managed keys (default)
  - Customer-managed keys available (premium)

Customer-managed keys (CMK):
  - Store keys in Azure Key Vault
  - Rotate keys on your schedule
  - Revoke access if needed
  - Audit key usage

Setup CMK:
  Power Platform Admin Center > Environments > Settings
  > Data encryption > Manage encryption key
  > Link to Azure Key Vault
```

### 7.2 Encryption in Transit

```
All Power Platform traffic:
  - TLS 1.2 minimum
  - HTTPS for all connections
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

```
Dataverse features for GDPR:
  - Consent tracking (custom implementation)
  - Right to erasure (bulk delete + cascade)
  - Data export (Configuration Migration Tool)
  - Audit trail (who accessed what when)
  - Data residency (EU datacenter)

Implementation:
  1. Consent field on Contact table
  2. Flow: Check consent before processing
  3. Process: On erasure request, delete all personal data
  4. Document: Maintain processing records
  5. Transfer: Use EU datacenter for EU data
```

### 8.2 Data Residency

```
Power Platform datacenter regions:
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

```
Before pen testing:
  1. Notify Microsoft (required for some tests)
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
