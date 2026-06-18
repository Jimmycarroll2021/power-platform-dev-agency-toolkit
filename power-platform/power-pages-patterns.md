---
title: "Power Pages Patterns"
description: "Patterns for building Power Pages sites"
category: "portals"
tags: ["power-pages", "portals", "web-api", "liquid", "authentication"]
---

# Power Pages Patterns

## 1. Site Setup and Configuration

### Site Creation

```powershell
# Via Power Platform Admin Center
# Resources > Power Pages sites > Create a site

# Via PAC CLI (preview)
pac pages upload --path "./site-content" --environment <url>
```

### Initial Configuration Checklist

- [ ] Site name and URL configured
- [ ] SSL certificate (default or custom)
- [ ] Privacy and terms pages created
- [ ] Site visibility (public/restricted)
- [ ] Language packs installed
- [ ] Search configured
- [ ] Analytics connected (Application Insights)

### Site Structure

```
Home
├── Products
│   ├── Product List
│   └── Product Detail
├── Support
│   ├── Knowledge Base
│   ├── Submit Ticket
│   └── Ticket Status
├── Account
│   ├── Profile
│   ├── Orders
│   └── Settings
└── Admin (restricted)
    ├── Dashboard
    └── User Management
```

---

## 2. Authentication Patterns

### Local Authentication

```
Site Settings:
  Authentication/Registration/Enabled: true
  Authentication/Registration/RequireEmailConfirmation: true
  Authentication/Registration/ResetPasswordEnabled: true
```

### Azure AD B2C

```
1. Create Azure AD B2C tenant
2. Register application in B2C
3. Configure user flows:
   - Sign up / Sign in
   - Password reset
   - Profile editing
4. In Power Pages:
   Site Settings > Identity providers > Add provider
   - Provider: Azure AD B2C
   - Tenant: <tenant>.onmicrosoft.com
   - Application ID: <app-id>
   - Policy: B2C_1_signupsignin
```

### Multi-Provider Setup

```
Authentication Providers:
├── Azure AD B2C (Primary)
│   └── For customers
├── Azure AD (Organizational)
│   └── For employees
└── OAuth 2.0 (Google)
    └── For quick sign-in
```

### Claims Mapping

```liquid
{% comment %} Map AD claims to contact fields {% endcomment %}
{% assign firstname = user.firstname %}
{% assign lastname = user.lastname %}
{% assign email = user.email %}

{% comment %} Custom claims from B2C {% endcomment %}
{% assign customer_tier = user.customer_tier | default: "Standard" %}
{% assign account_number = user.account_number %}
```

---

## 3. Dataverse List and Forms

### Secure List Configuration

```
Table Permission:
  Table: aluma_SupportTicket
  Permission: Contact (scope)
  Access Type: Read
  Conditions:
    - Status = Active
    - Owner = Current user's contact
```

### Multi-Step Form

```
Step 1: Personal Information
  - First Name (required)
  - Last Name (required)
  - Email (required, read-only if authenticated)

Step 2: Request Details
  - Category (dropdown)
  - Priority (radio buttons)
  - Description (rich text)

Step 3: Attachments
  - File upload (max 3 files, 10MB each)

Step 4: Review and Submit
  - Summary of all fields
  - Terms acceptance checkbox
  - Submit button
```

### Form Metadata Configuration

```xml
<!-- Table Permission for create -->
<powerpages>
  <tablepermission>
    <tablename>aluma_SupportTicket</tablename>
    <contactrelationship>aluma_Contact</contactrelationship>
    <permission>Write</permission>
    <scope>Contact</scope>
  </tablepermission>
</powerpages>
```

---

## 4. Web API Usage

### Reading Data

```javascript
// Fetch user's orders
fetch("/_api/aluma_orders?$filter=_aluma_contact_value eq " + contactId + 
      "&$orderby=createdon desc&$top=10", {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => {
  data.value.forEach(order => {
    console.log(order.aluma_ordernumber, order.aluma_totalamount);
  });
});
```

### Creating Records

```javascript
// Submit support ticket
fetch("/_api/aluma_supporttickets", {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "aluma_title": "Login Issue",
    "aluma_description": "Cannot access my account",
    "aluma_priority": "High",
    "aluma_contact@odata.bind": "/contacts(" + contactId + ")"
  })
})
.then(response => response.json())
.then(data => {
  alert("Ticket created: " + data.aluma_ticketnumber);
});
```

### Web API Site Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| Webapi/aluma_orders/enabled | true | Enable orders endpoint |
| Webapi/aluma_orders/fields | aluma_ordernumber,aluma_totalamount,status | Field selection |
| Webapi/aluma_orders/scope | contact | Security scope |
| Webapi/error/passthrough | false | Error handling |

---

## 5. Liquid Template Patterns

### Basic Output

```liquid
{{ page.title }}
{{ user.name }}
{{ now | date: 'yyyy-MM-dd' }}
```

### Conditional Display

```liquid
{% if user %}
  <p>Welcome, {{ user.name }}!</p>
  {% if user.roles contains 'Administrators' %}
    <a href="/admin">Admin Panel</a>
  {% endif %}
{% else %}
  <p>Please <a href="/signin">sign in</a>.</p>
{% endif %}
```

### Loop Through Data

```liquid
{% assign tickets = entities.aluma_supportticket %}
{% for ticket in tickets %}
  {% if ticket.aluma_contact.id == user.id %}
    <tr>
      <td>{{ ticket.aluma_ticketnumber }}</td>
      <td>{{ ticket.aluma_title }}</td>
      <td>{{ ticket.statuscode.label }}</td>
      <td>{{ ticket.createdon | date: 'MMM dd, yyyy' }}</td>
    </tr>
  {% endif %}
{% endfor %}
```

### Include Templates

```liquid
{% comment %} header.liquid {% endcomment %}
<header>
  <nav>
    <a href="/">{{ snippets["Home"] }}</a>
    {% include 'navigation' %}
    {% if user %}
      <span>{{ user.name }}</span>
      <a href="/account">My Account</a>
      <a href="/signout?returnurl={{ request.path | url_encode }}">Sign Out</a>
    {% else %}
      <a href="/signin?returnurl={{ request.path | url_encode }}">Sign In</a>
    {% endif %}
  </nav>
</header>
```

### Content Snippets

```liquid
{% comment %} Reusable content blocks {% endcomment %}
{{ snippets["Footer-Content"] }}
{{ snippets["Contact-Info"] }}
{{ snippets["Hours-of-Operation"] }}

{% comment %} Snippet with Liquid {% endcomment %}
{% editable snippets "CallToAction" type: 'html' %}
```

### Web Form with Liquid

```liquid
{% form id: "SupportTicketForm" %}
  <div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="aluma_title" required />
  </div>
  
  <div class="form-group">
    <label for="category">Category</label>
    <select id="category" name="aluma_category">
      <option value="">Select...</option>
      <option value="Technical">Technical Issue</option>
      <option value="Billing">Billing Question</option>
      <option value="General">General Inquiry</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="aluma_description" rows="5"></textarea>
  </div>
  
  <button type="submit">Submit Ticket</button>
{% endform %}
```

---

## 6. Search Configuration

### Configure Search

```
Site Settings:
  Search/Enabled: true
  Search/FacetedView: true
  Search/ResultsPerPage: 10

Searchable Tables:
  - aluma_SupportArticle (Title, Content, Tags)
  - aluma_Product (Name, Description, SKU)
  - aluma_FAQ (Question, Answer, Category)
```

### Custom Search Results

```liquid
{% assign query = request.params.q %}
{% if query %}
  <h2>Search results for "{{ query }}"</h2>
  
  {% assign results = query | search_index: 'portal' %}
  
  {% if results.size > 0 %}
    <ul>
    {% for result in results %}
      <li>
        <a href="{{ result.url }}">{{ result.title }}</a>
        <p>{{ result.fragment }}</p>
        <span>{{ result.createdon | date: 'MMM dd, yyyy' }}</span>
      </li>
    {% endfor %}
    </ul>
  {% else %}
    <p>No results found. Try different keywords.</p>
  {% endif %}
{% endif %}
```
