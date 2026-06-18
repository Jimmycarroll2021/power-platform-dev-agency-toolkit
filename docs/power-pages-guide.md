---
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq
  - https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pages
  - https://learn.microsoft.com/en-us/power-pages/configure/power-platform-cli-solution-management
  - https://learn.microsoft.com/en-us/power-pages/security/table-permissions
  - https://learn.microsoft.com/en-us/power-pages/security/authentication/
  - https://learn.microsoft.com/en-us/power-pages/security/authentication/azure-ad-b2c-provider
  - https://learn.microsoft.com/en-us/power-pages/admin/add-custom-domain
---

# Power Pages Comprehensive Guide

> **Version**: 1.1 | **Last updated**: 2026-06-19
> **Applies to**: Microsoft Power Pages (formerly Power Apps Portals)
> **Verification**: Pricing, authentication, ALM commands, and feature availability verified against Microsoft Learn on 2026-06-19 (platform state 2026-H1). Pricing and feature availability change frequently — re-verify before quoting figures to a client.

---

## 1. When to Use Power Pages vs Power Apps

| Factor | Power Pages | Power Apps |
|--------|-------------|------------|
| **Users** | External (anonymous/authenticated) | Internal (employees) |
| **Authentication** | Multiple options (B2C, OAuth, SAML) | Azure AD only |
| **Licensing** | Per site per user capacity | Per user or per app |
| **Data source** | Dataverse only | Any |
| **Design control** | Liquid templates + Bootstrap | Full drag-and-drop (canvas) |
| **URL** | Custom domain supported | N/A (embedded or mobile app) |
| **SEO** | Good (public pages indexable) | N/A |
| **Mobile** | Responsive web | Native app experience |

> Power Pages is built natively on Microsoft Dataverse as its primary data store (external data is reachable via APIs/connectors, but the site's own data model is Dataverse) — confirmed against [Microsoft Learn](https://learn.microsoft.com/en-us/power-pages/security/table-permissions). Power Pages supports federated identity providers (Microsoft Entra External ID / Azure AD B2C, generic OpenID Connect, SAML 2.0, WS-Federation) plus a local provider — [Microsoft Learn: authentication overview](https://learn.microsoft.com/en-us/power-pages/security/authentication/).

```
Decision Tree:
  External users (customers, partners, public)?
    Yes -> Power Pages
    No  -> Power Apps

  Need public-facing website with SEO?
    Yes -> Power Pages
    No  -> Consider Power Apps

  Need custom URL/branding?
    Yes -> Power Pages
    No  -> Either works

  Simple marketing site?
    Yes -> Consider SharePoint or static site (cheaper)
    No  -> Power Pages for data-driven portal
```

---

## 2. Site Setup and Configuration

### 2.1 Creating a Power Pages Site

```
Step 1: Make sure prerequisites met:
  - Power Apps license (maker)
  - Dataverse environment
  - System Administrator or System Customizer role

Step 2: Create site:
  powerpages.microsoft.com > Create a site
  Option A: Use template
    - Customer self-service
    - Partner portal
    - Community site
    - Blank site
  Option B: Blank site (recommended for custom builds)

Step 3: Configure basics:
  - Site name: Customer Portal
  - Site address: customerportal (becomes customerportal.powerappsportals.com)
  - Language: English (can add more later)
  - Template: Select or blank

Step 4: Wait for provisioning (10-30 minutes)

Step 5: Configure:
  - Home page content
  - Navigation
  - Authentication
  - Data access (table permissions)

Step 6: Preview and publish
```

> The default site URL format is `<sitename>.powerappsportals.com`; you can later attach one custom domain (site must be in production state, requires an SSL certificate and a CNAME) — confirmed against [Microsoft Learn: Add a custom domain name](https://learn.microsoft.com/en-us/power-pages/admin/add-custom-domain).

### 2.2 Site Structure

```
Power Pages site hierarchy:

Site
+-- Web Pages (hierarchical)
|   +-- Home (/)
|   +-- About (/about)
|   +-- Services (/services)
|   |   +-- Service Detail (/services/consulting)
|   +-- Account (/account)
|   |   +-- Profile (/account/profile)
|   |   +-- My Cases (/account/cases)
|   +-- Support (/support)
|       +-- Create Case (/support/new-case)
|       +-- Case Status (/support/status)
|
+-- Web Templates (reusable page layouts)
|   +-- Full Page
|   +-- Two Column
|   +-- Dashboard
|
+-- Page Templates (wire up web templates)
|   +-- Default Template
|   +-- Home Page Template
|
+-- Content Snippets (reusable text/HTML)
|   +-- Header Logo
|   +-- Footer Copyright
|   +-- Welcome Message
|
+-- Web Files (CSS, JS, images)
|   +-- custom.css
|   +-- portal.js
|   +-- logo.png
|
+-- Web Links (navigation sets)
|   +-- Primary Navigation
|   +-- Footer Navigation
|   +-- Account Menu
|
+-- Entity Lists (data grids)
|   +-- My Cases List
|   +-- Invoice History
|
+-- Entity Forms (data entry)
|   +-- Case Create Form
|   +-- Profile Edit Form
|
+-- Table Permissions (security)
    +-- Case Read (own records)
    +-- Contact Read/Write (own profile)
```

---

## 3. Authentication Options

### 3.1 Authentication Methods Comparison

| Method | Use Case | Setup Complexity | User Experience |
|--------|----------|-----------------|-----------------|
| **Local authentication** | Simple password-based | Low | Moderate (separate password) |
| **Azure AD B2C** | External customers, scalable | High | Excellent (SSO) |
| **Azure AD** | Employees, B2B | Medium | Excellent (company SSO) |
| **OAuth 2.0** | Social login (Google, Facebook) | Medium | Excellent (one-click) |
| **SAML 2.0** | Enterprise SSO (Okta, ADFS) | High | Excellent (enterprise SSO) |
| **OpenID Connect** | Custom identity provider | Medium | Good |
| **WS-Federation** | Legacy enterprise IdPs | High | Good |

> Verified against [Microsoft Learn: authentication overview](https://learn.microsoft.com/en-us/power-pages/security/authentication/). Power Pages supports a local provider plus federated providers over OpenID Connect, SAML 2.0, and WS-Federation; Azure AD B2C is configured as an OpenID Connect provider. Microsoft now **recommends Microsoft Entra External ID (and discourages the local provider)** for new external-facing sites — Azure AD B2C remains supported but is the older path, and Microsoft documents migrating identity providers to Entra External ID. Azure AD has been renamed **Microsoft Entra ID**.

### 3.2 Azure AD B2C / Entra External ID Setup (External Users)

> Microsoft recommends **Microsoft Entra External ID** for new external-facing sites; Azure AD B2C (shown below) is still supported and configured as an OpenID Connect provider. Both are set up the same way in Power Pages. Verified against [Microsoft Learn: set up an OpenID Connect provider with Azure AD B2C](https://learn.microsoft.com/en-us/power-pages/security/authentication/azure-ad-b2c-provider).

```
Step 1: Create Azure AD B2C tenant
  Azure Portal > Create resource > Azure AD B2C
  Or use existing B2C tenant

Step 2: Register Power Pages application
  Azure AD B2C > App registrations > New
  Name: Power Pages Customer Portal
  Supported account types: Accounts in any identity provider
  Redirect URI: https://yoursite.powerappsportals.com/signin-aad-b2c_1

Step 3: Configure user flows
  Azure AD B2C > User flows > New
  - Sign up and sign in
  - Password reset
  - Profile editing

Step 4: Get configuration values:
  - Authority: https://yourb2c.b2clogin.com/yourb2c.onmicrosoft.com/B2C_1_signupsignin1
  - Client ID: (from app registration)
  - Application ID: (same as client ID)
  - Metadata address: https://.../v2.0/.well-known/openid-configuration

Step 5: Configure in Power Pages:
  Power Pages > Set up > Authentication
  > Add provider > OpenID Connect
  Name: Azure AD B2C
  Authority: (from Step 4)
  Client ID: (from Step 4)
  Redirect URI: (auto-populated)

Step 6: Test sign-up flow
  Open incognito window
  Navigate to site
  Click Sign In > Sign Up
  Complete registration
  Verify contact record created in Dataverse
```

### 3.3 Authentication Best Practices

```
DO:
[+] Use Azure AD B2C for external portals (most flexible)
[+] Enable password reset
[+] Configure email verification
[+] Set session timeout appropriately
[+] Use HTTPS only (enforced)
[+] Enable multi-factor authentication where possible
[+] Test all auth flows before go-live
[+] Document recovery procedure for locked accounts

DO NOT:
[X] Use local authentication for production (less secure)
[X] Allow infinite session duration
[X] Skip email verification
[X] Use same B2C tenant for multiple clients (data isolation)
[X] Forget to configure password policies
```

---

## 4. Dataverse Integration

### 4.1 Table Permissions (Security)

```
Table permissions control what data portal users can see/edit.
This is CRITICAL - without permissions, no data is visible.

Permission types:
  - Read: View records
  - Write: Edit records
  - Create: Add new records
  - Delete: Remove records
  - Append: Add related records
  - Append To: Be added as related

Access types (verified against Microsoft Learn — see citation after this block):
  - Global: All records in table (use cautiously; with the Anonymous role this exposes all rows)
  - Contact: Records related to the signed-in contact (needs an N:1 relationship to the contact table)
  - Account: Records related to the contact's parent account (needs an N:1 relationship to the account table)
  - Self: The signed-in contact's own record (profile only)
  - Parent: Records linked via a parent table permission. NOTE: the Parent access type is configured only in the Portal Management app, not the design studio; polymorphic lookups are not supported for parent-child permissions.

Example: Case Management Portal

Table: Case
  Permission: Read
  Access type: Contact
  Scope: Cases where Customer = current portal user
  Web roles: Authenticated Users, Premium Users

Table: Case
  Permission: Create
  Access type: Contact
  Scope: Can create cases for self
  Web roles: Authenticated Users

Table: Invoice
  Permission: Read
  Access type: Account
  Scope: Invoices for contact's parent company
  Web roles: Authenticated Users

Table: Knowledge Article
  Permission: Read
  Access type: Global
  Scope: All published articles
  Web roles: Anonymous Users, Authenticated Users
```

> Access types, the web-role association model, and the Portal-Management-app-only Parent type are confirmed against [Microsoft Learn: Set table permissions in Power Pages](https://learn.microsoft.com/en-us/power-pages/security/table-permissions). All authenticated contacts get the built-in **Authenticated Users** role; all unauthenticated visitors get **Anonymous Users**. Table permissions take effect only when associated with a web role.

### 4.2 Setting Up Table Permissions

```
Step 1: Power Pages > Set up > Table permissions
Step 2: New permission
  Table: (select Dataverse table)
  Access type: Contact / Account / Global / Self
  Permission: Read / Write / Create / Delete (check boxes)
  Web roles: (select which roles get this permission)

Step 3: Add to page
  Edit page > Component > List or Form
  Select table > Table permissions auto-applied

Step 4: Test with different user types
  - Anonymous user (should see limited data)
  - Authenticated user (should see own data)
  - Admin user (should see all data)
```

---

## 5. Liquid Templates

### 5.1 Liquid Basics for Power Pages

```
Liquid is a templating language used in Power Pages for dynamic content.

Output:
  {{ user.fullname }}           - Current user's name
  {{ user.email }}              - Current user's email
  {{ page.title }}              - Current page title
  {{ site.name }}               - Site name
  {{ now }}                     - Current date/time
  {{ request.url }}             - Current URL

Tags (logic):
  {% if user %}
    Welcome, {{ user.fullname }}!
  {% else %}
    Please sign in.
  {% endif %}

  {% unless user %}
    <a href="/SignIn">Sign In</a>
  {% endunless %}

  {% for item in page.children %}
    <li><a href="{{ item.url }}">{{ item.title }}</a></li>
  {% endfor %}

Filters:
  {{ user.createdon | date: 'MMMM dd, yyyy' }}
  {{ page.title | upcase }}
  {{ entity.name | escape }}
```

### 5.2 Dataverse Data in Liquid

```
Fetch Dataverse data in templates:

1. Entity list (declarative):
   {% entitylist name:"My Cases List" %}
   {% endentitylist %}

2. Entity form (with Liquid):
   {% entityform name:"Case Create Form" %}

3. FetchXML (custom queries):
   {% fetchxml my_query %}
   <fetch version="1.0">
     <entity name="incident">
       <attribute name="title" />
       <attribute name="statuscode" />
       <attribute name="createdon" />
       <filter>
         <condition attribute="customerid" operator="eq" value="{{ user.id }}" />
       </filter>
     </entity>
   </{% endfetchxml %}

   {% for result in my_query.results %}
     <tr>
       <td>{{ result.title }}</td>
       <td>{{ result.statuscode.label }}</td>
       <td>{{ result.createdon | date: 'MMM dd, yyyy' }}</td>
     </tr>
   {% endfor %}

4. Power Pages specific tags:
   {% include 'Page Header' %}     - Include snippet
   {% editable snippets "Welcome" %} - Editable content area
   {% webform name:"Contact Us" %}   - Render web form
```

### 5.3 Custom Liquid Examples

```liquid
<!-- Case status badge -->
{% assign status = case.statuscode.label %}
{% if status == 'Active' %}
  <span class="badge badge-warning">{{ status }}</span>
{% elsif status == 'Resolved' %}
  <span class="badge badge-success">{{ status }}</span>
{% else %}
  <span class="badge badge-secondary">{{ status }}</span>
{% endif %}

<!-- Personalized welcome -->
{% if user %}
  <div class="welcome-banner">
    <h2>Welcome back, {{ user.fullname }}!</h2>
    <p>Account: {{ user.parentcustomerid.name }}</p>
    <p>Member since: {{ user.createdon | date: 'MMMM yyyy' }}</p>
  </div>
{% else %}
  <div class="guest-banner">
    <h2>Welcome to our Customer Portal</h2>
    <a href="/SignIn" class="btn btn-primary">Sign In</a>
    <a href="/Register" class="btn btn-secondary">Register</a>
  </div>
{% endif %}

<!-- Navigation menu with active state -->
{% for link in weblinks[Primary Navigation].weblinks %}
  <li class="nav-item {% if request.url == link.url %}active{% endif %}">
    <a class="nav-link" href="{{ link.url }}">{{ link.name }}</a>
  </li>
{% endfor %}
```

---

## 6. Web API Access

### 6.1 Enabling Web API

```
Step 1: Power Pages > Set up > Site settings
Step 2: Find/Create:
  Name: Webapi/contact/enabled
  Value: true

  Name: Webapi/contact/fields
  Value: fullname,emailaddress1,telephone1,address1_city

Step 3: Table permissions must be configured
  Without table permissions, Web API returns 403

Step 4: Test with JavaScript:
  fetch('/_api/contacts', {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  })
  .then(r => r.json())
  .then(data => console.log(data));
```

### 6.2 Common Web API Operations

```javascript
// READ (with filter)
fetch("/_api/contacts?$filter=emailaddress1 eq 'test@example.com'", {
  headers: { 'Accept': 'application/json' }
})

// CREATE
fetch('/_api/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    fullname: 'John Doe',
    emailaddress1: 'john@example.com'
  })
})

// UPDATE
fetch('/_api/contacts(550e8400-e29b-41d4-a716-446655440000)', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ telephone1: '555-1234' })
})

// DELETE
fetch('/_api/contacts(550e8400-e29b-41d4-a716-446655440000)', {
  method: 'DELETE'
})
```

---

## 7. Security and Permissions

### 7.1 Web Roles

```
Web roles define what portal users can do:

Anonymous Users: (not authenticated)
  - View public pages
  - Submit contact forms
  - Search knowledge base

Authenticated Users: (signed in)
  - All Anonymous permissions +
  - View own profile
  - Create/view own cases
  - View account-related data

Premium Users: (specific role assignment)
  - All Authenticated permissions +
  - Access premium content
  - Download documents
  - View invoices

Administrators: (portal admins)
  - Full access
  - Manage content
  - View all records
```

### 7.2 Contact Registration Process

```
User registers on portal:
  1. Fills registration form
  2. Portal creates Contact record in Dataverse
  3. User is authenticated (via chosen method)
  4. Web role(s) assigned to contact
  5. Table permissions applied based on role

Auto-registration settings:
  Site settings:
    - Authentication/Registration/Enabled: true
    - Authentication/Registration/ProfileEnabled: true
    - Authentication/Registration/SignupEnabled: true
```

---

## 8. Deployment and ALM

### 8.1 Site Configuration Export/Import

```
Two supported ALM approaches (verified against Microsoft Learn — see citations below):

NOTE on command name: `pac paportal` -> `pac powerpages` (CLI v1.27) -> `pac pages`
(CLI v1.32). `powerpages` and `paportal` still work, but `pac pages` is the
recommended command going forward.

NOTE on data models: the --modelVersion flag selects 1 (Standard) or 2 (Enhanced).
Run `pac pages list -v` to see which data model a site uses.

Approach A — CLI download/upload (Standard or Enhanced data model):
1. Authenticate and list sites to get the website ID:
   pac auth create --environment https://yourorg.crm.dynamics.com
   pac pages list
2. Download site content (writes a manifest used for delta uploads):
   pac pages download --path ./site-config --webSiteId <id> --modelVersion 2
3. Store site configuration in source control:
   git add ./site-config/
   git commit -m "Portal v1.2.0"
4. Deploy to a target environment (cross-environment = full upload; intra-environment
   uses the manifest for delta uploads):
   pac pages upload --path ./site-config --modelVersion 2 --environment <target>
   # or use a deployment profile: pac pages upload --path ./site-config --deploymentProfile dev --modelVersion 2

Approach B — Solution-aware deployment (Enhanced data model; preview as of 2026-06-19):
   The enhanced data model supports adding a Power Pages site to a Dataverse solution,
   so the website moves with normal solution ALM:
   pac solution init --publisher-name '<name>' --publisher-prefix '<prefix>' --outputDirectory <dir>
   pac solution add-solution-component -sn <SolutionName> -c <powerpagesite record ID> -ct <componentType>
   pac solution export   # then import to the target environment via normal ALM

For Dataverse schema changes (either approach): export the solution with tables/forms/
views, import to the target environment, then deploy the Power Pages configuration.
```

> CLI commands, parameters, and the `paportal`->`powerpages`->`pages` rename are confirmed against [Microsoft Learn: pac pages command group](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pages). Solution-aware Power Pages deployment (enhanced data model, preview) is confirmed against [Microsoft Learn: Power Platform CLI solution support for Power Pages](https://learn.microsoft.com/en-us/power-pages/configure/power-platform-cli-solution-management).

### 8.2 Environment Strategy

```
DEV:
  - Developer sandbox
  - Frequent changes
  - Test data
  - Basic auth (local or simple B2C)

TEST:
  - Stable configuration
  - UAT data
  - Mirror production auth
  - Performance testing

PROD:
  - Live site
  - Real user data
  - Full B2C auth
  - Monitoring enabled
  - Backup configured
```

---

## 9. Search Configuration

### 9.1 Portal Search Setup

```
Step 1: Enable search:
  Power Pages > Set up > Search
  [x] Enable search
  Configure search scope

Step 2: Configure search entities:
  Select which tables are searchable:
    - Knowledge Articles
    - Web Pages
    - Files
    - Custom tables (if indexed)

Step 3: Customize search results:
  Edit search results page
  Customize result layout with Liquid
  Add faceted search filters

Step 4: Test search:
  Verify results relevance
  Check permissions (users only see allowed results)
  Test with different web roles
```

---

## 10. Performance Optimization

```
DO:
[+] Use entity lists (server-rendered) for large datasets
[+] Enable output caching for static content
[+] Minimize custom JavaScript
[+] Optimize images before upload
[+] Use CDN for static assets (if available)
[+] Limit FetchXML query results (top 50-100)
[+] Use pagination for large lists
[+] Enable compression (gzip)
[+] Test with realistic data volumes

DO NOT:
[X] Load thousands of records in single page
[X] Use complex FetchXML on homepage
[X] Ignore mobile performance
[X] Add heavy third-party JS libraries unnecessarily
[X] Forget to clear cache after updates
```

---

## 11. Licensing

```
Power Pages licensing model (verified against Microsoft Learn — see citation
below; list prices, USD, commercial channel, as of 2026-06-19):

Capacity is per WEBSITE per CALENDAR MONTH (NOT "daily", NOT pooled at tenant
level). Subscription capacity is purchased in packs and assigned at the
ENVIRONMENT level. Uniqueness for authenticated users is keyed on the Dataverse
contact record ID; for anonymous users on a browser-cookie ID.

Authenticated users (subscription, sold in packs of 100 users/site/month):
  - Tier 1 (1+ pack,  100+ users):    $200 / pack / month
  - Tier 2 (100+ packs, 10,000+ users): $75 / pack / month
  - Tier 3 (1,000+ packs, 100,000+ users): $50 / pack / month
  - A user who signs in any number of times in the month counts once.
  - Pay-as-you-go meter also available (priced per authenticated user/site/month).
  - Minimum 25 authenticated-user capacity assigned per environment.

Anonymous users (subscription, sold in packs of 500 users/site/month):
  - Tier 1 (1+ pack,  500+ users):    $75 / pack / month
  - Tier 2 (20+ packs, 10,000+ users): $37.50 / pack / month
  - Tier 3 (200+ packs, 100,000+ users): $25 / pack / month
  - Sign-in/registration pages and system pages (/_*) are NOT counted; a user
    who browses anonymously then logs in the same UTC day counts only as
    authenticated.

Use rights via other licenses (internal authenticated users):
  - Power Apps Premium (per user) and Dynamics 365 enterprise licenses: access
    unlimited Power Pages websites.
  - Power Apps per app: access one Power Pages website in the licensed environment.

Storage included per subscription capacity pack:
  - Authenticated pack: +2 GB Dataverse database + 16 GB Dataverse file (accrues
    to the tenant).
  - Anonymous pack:     +500 MB Dataverse database + 4 GB Dataverse file.

Capacity considerations:
  - Dataverse database + file storage for portal data and uploaded documents.
  - Power Platform request (API call) limits apply at the tenant/license level.
  - Unused monthly user capacity does not carry over.
```

> Pricing tiers, the per-website/per-month (not daily) counting rule, the
> contact-ID uniqueness rule, anonymous packs, environment-level assignment
> (min 25 authenticated), included storage, and use rights via Power Apps /
> Dynamics 365 licenses are all confirmed against
> [Microsoft Learn: Power Platform licensing FAQs (Power Pages section)](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-flow-licensing-faq).
> For the latest list prices also see the
> [Power Pages pricing page](https://www.microsoft.com/en-us/power-platform/products/power-pages/pricing).
> List prices change — re-verify before quoting to a client.

---

*End of Power Pages Guide. Core facts (licensing, authentication providers, table-permission access types, pac CLI commands, default domain, solution-aware ALM) were verified against Microsoft Learn on 2026-06-19 (platform state 2026-H1) — see the `sources` list in the frontmatter at the top. Pricing and preview-feature status change frequently; re-verify against current Microsoft documentation before quoting figures or committing to an approach.*
