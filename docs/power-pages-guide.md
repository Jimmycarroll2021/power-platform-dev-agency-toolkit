# Power Pages Comprehensive Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Applies to**: Microsoft Power Pages (formerly Power Apps Portals)
> **Needs verification against current Microsoft docs**: Pricing, authentication options, and feature availability change frequently.

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

### 3.2 Azure AD B2C Setup (Recommended for External Users)

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

Access types:
  - Global: All records in table
  - Contact: Records linked to current contact
  - Account: Records linked to current contact's parent account
  - Self: Contact's own record (profile only)
  - Parent: Records linked to parent entity

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
Power Pages doesn't use solutions directly (different from apps/flows).

ALM approach:
1. Use Power Platform CLI (pac) for site export/import:
   pac auth create --url https://yourorg.crm.dynamics.com
   pac powerpages upload --path ./site-config
   pac powerpages download --path ./site-config --webSiteId <id>

2. Store site configuration in source control:
   git add ./site-config/
   git commit -m "Portal v1.2.0"

3. Deploy to target environment:
   pac powerpages upload --path ./site-config --environment <target>

4. For Dataverse schema changes:
   Export solution with tables/forms/views
   Import to target environment
   Then upload Power Pages configuration
```

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
Power Pages licensing model:

Authenticated users:
  - $200/month per 100 daily authenticated users
  - "Daily authenticated user" = unique user who signs in per day
  - Counted at tenant level, pooled across sites

Anonymous users:
  - Separate (lower) pricing tier
  - Counted by page views or unique users
  - Verify current pricing model

Capacity considerations:
  - Dataverse storage for portal data
  - File storage for uploaded documents
  - API call capacity

Needs verification against current Microsoft docs:
  Power Pages licensing changed significantly from portal add-on model.
  Verify current pricing and what counts as a "daily authenticated user."
```

---

*End of Power Pages Guide. Verify all pricing, authentication setup steps, and feature availability against current Microsoft documentation.*
