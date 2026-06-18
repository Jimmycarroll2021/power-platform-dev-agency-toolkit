# Power Pages Playbook

> **Complexity Rating:** Medium / High
> **Last Updated:** 2024
> **Applies To:** Microsoft Power Pages, External-Facing Websites, Dataverse Portals

---

## 1. When to Use Power Pages

Use Power Pages when:

| Scenario | Why Power Pages |
|----------|----------------|
| External customer portal | Secure access for non-organization users |
| Partner portal | B2B collaboration site |
| Self-service support site | Knowledge base, case submission |
| Registration/Onboarding site | External user registration |
| Community portal | Discussion forums, community engagement |
| Anonymous information site | Public-facing content |
| Mixed anonymous/authenticated site | Some public, some restricted |
| Data collection from external users | Forms, surveys for non-employees |
| Order/status tracking | Customer order lookup |
| Event registration | External event management |

### Decision Matrix

| Factor | Power Pages | SharePoint | Custom Web App |
|--------|------------|------------|----------------|
| External users | Designed for this | Requires extra config | Full control |
| Dataverse integration | Native | Via connectors | Via API |
| Development speed | Fast (low-code) | Fast | Slow |
| Customization | Good | Limited | Unlimited |
| Security model | Role-based | SharePoint groups | Custom |
| Cost | Per user/site | M365 license | Infrastructure |
| No-code design | Yes | Yes | No |
| Multi-language | Built-in | Add-on | Custom build |

---

## 2. When NOT to Use Power Pages

> **DO NOT use Power Pages when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Internal-only site | SharePoint | Already licensed, simpler |
| Heavy content publishing | SharePoint | Better content management |
| Document collaboration | SharePoint | Built-in co-authoring |
| Need full code control | Custom web app (React, Angular) | No platform limitations |
| Complex single-page application | Custom web app | Better framework support |
| Very high traffic (>10k users/day) | Custom + Azure CDN | Cost, scalability |
| Need custom authentication providers | Custom web app | Limited provider support |
| Real-time collaboration features | Custom web app + SignalR | WebSocket support |

---

## 3. Site Setup

### 3.1 Site Creation Steps

| Step | Action | Notes |
|------|--------|-------|
| 1 | Go to powerpages.microsoft.com | Admin access required |
| 2 | Click "Create a site" | Choose template or blank |
| 3 | Select template or blank | Starter templates available |
| 4 | Name your site | Unique name, becomes URL |
| 5 | Choose language | Can add more later |
| 6 | Create site | Provisioning takes 10-30 minutes |
| 7 | Configure custom domain (optional) | Add DNS records |
| 8 | Configure SSL | Automatic or custom certificate |

### 3.2 Site Templates

| Template | Best For | Features Included |
|----------|---------|-------------------|
| Blank | Custom build | Minimal structure |
| Schedule and manage meetings | Appointment booking | Calendar, booking forms |
| Customer self-service | Support portal | Knowledge base, cases |
| Partner portal | B2B collaboration | Account management |
| Community | Discussion forum | Forums, ideas |
| Event registration | Event management | Registration, sessions |

### 3.3 Site Structure

```
[Site]
  |
  +-- [Home Page]
  |     +-- Hero section
  |     +-- Quick links
  |     +-- Featured content
  |
  +-- [Pages]
  |     +-- List pages (Dataverse data)
  |     +-- Form pages (Create/Edit records)
  |     +-- Custom pages (Canvas app embedded)
  |     +-- Web pages (Content)
  |
  +-- [Navigation]
  |     +-- Primary navigation
  |     +-- Footer navigation
  |     +-- Breadcrumbs
  |
  +-- [Security]
  |     +-- Web roles
  |     +-- Page permissions
  |     +-- Table permissions
  |
  +-- [Styling]
        +-- Theme
        +-- Custom CSS
        +-- Header/Footer templates
```

---

## 4. Authentication

### 4.1 Authentication Options

| Method | Use For | Configuration |
|--------|---------|--------------|
| Local authentication | Simple site, no external IdP | Username/password stored in Dataverse |
| Azure AD B2C | External customers, partners | Connect to Azure AD B2C tenant |
| Azure AD | Organization members only | Connect to organization's Azure AD |
| OAuth 2.0 (generic) | Social login, third-party IdP | Google, Facebook, etc. |
| SAML 2.0 | Enterprise SSO | Connect to SAML identity provider |
| OpenID Connect | Modern identity providers | Standard OIDC configuration |

### 4.2 Azure AD B2C Setup (Recommended for External Users)

```
Step 1: Create Azure AD B2C Tenant
  Azure Portal > Create resource > Azure AD B2C

Step 2: Register Application in B2C
  Azure AD B2C > App registrations > New registration
  - Name: PowerPages-Portal
  - Redirect URI: [Your Power Pages URL]

Step 3: Configure User Flows
  Azure AD B2C > User flows
  - Create sign-up/sign-in flow
  - Create password reset flow
  - Create profile editing flow

Step 4: Connect to Power Pages
  Power Pages > Set up > Authentication
  - Select Azure AD B2C
  - Enter tenant name
  - Enter application ID
  - Configure user flows

Step 5: Test
  Sign out > Sign in with B2C account
```

### 4.3 Authentication Best Practices

| Practice | Why |
|----------|-----|
| Use Azure AD B2C for external users | Purpose-built for external identities |
| Enable MFA for sensitive sites | Additional security layer |
| Configure password policies | Strong password requirements |
| Set session timeout | Reduce risk of abandoned sessions |
| Enable account lockout | Prevent brute force attacks |
| Custom branding on login page | Consistent user experience |

---

## 5. Dataverse Integration

### 5.1 Table Permissions

Table permissions control what data external users can see:

| Permission Type | Description | Use When |
|----------------|-------------|----------|
| Global | All records of table | Public reference data |
| Contact | Records linked to logged-in contact | My data scenarios |
| Account | Records linked to contact's account | Partner/org data |
| Self | Only the contact's own record | Profile management |
| Parent | Child records of parent | Parent-child scenarios |

### 5.2 Permission Configuration

```
1. Power Pages > Set up > Security > Table Permissions
2. Create new permission:
   - Name: My Invoices
   - Table: Invoice
   - Access Type: Contact
   - Privileges: Read (only see own)
3. Add to web role:
   - Select web role (e.g., "Customer")
   - Assign permission
4. Add relationship:
   - Contact relationship: Customer lookup
```

### 5.3 Web Roles

| Web Role | Typical Permissions | User Type |
|----------|-------------------|-----------|
| Anonymous | Read public content only | Not logged in |
| Authenticated User | Basic read, profile edit | Logged in, general |
| Customer | Read own data, create cases | Customer |
| Partner | Read org data, create orders | Partner contact |
| Administrator | Full access | Site admin |

### 5.4 Data Access Patterns

**Pattern 1: My Records**
```
User logs in --> Contact record identified
  --> Table permissions filter: Only where Contact = Current User
  --> User sees only their records
```

**Pattern 2: My Organization's Records**
```
User logs in --> Contact record --> Parent Account identified
  --> Table permissions filter: Only where Account = User's Account
  --> User sees their organization's records
```

**Pattern 3: Public Data**
```
No login required
  --> Global permissions on reference data tables
  --> Anonymous users see public information
```

---

## 6. Security

### 6.1 Security Checklist

| # | Security Item | Status | Notes |
|---|--------------|--------|-------|
| 1 | Table permissions configured for all exposed tables | [ ] | |
| 2 | Page permissions restrict sensitive pages | [ ] | |
| 3 | Web roles follow least privilege | [ ] | |
| 4 | Authentication enabled (not anonymous for sensitive data) | [ ] | |
| 5 | SSL/HTTPS enforced | [ ] | Automatic |
| 6 | Session timeout configured | [ ] | |
| 7 | Password policy enforced | [ ] | |
| 8 | Account lockout configured | [ ] | |
| 9 | IP restrictions (if needed) | [ ] | |
| 10 | CAPTCHA on public forms | [ ] | |
| 11 | Data validation on all inputs | [ ] | |
| 12 | Error pages don't leak information | [ ] | |
| 13 | Security headers configured | [ ] | |
| 14 | Regular security review scheduled | [ ] | |

### 6.2 Common Security Misconfigurations

> **DO NOT:**
> - Leave table permissions as "Global" when data should be private
> - Allow anonymous users to create records without validation
> - Expose internal system names in URLs or error messages
> - Forget to disable default accounts
> - Skip CAPTCHA on public-facing forms
> - Use local authentication for production external sites (use B2C)

---

## 7. Development Steps

### 7.1 Implementation Checklist

- [ ] Define site purpose and audience
- [ ] Identify external user types and roles
- [ ] Design information architecture (pages, navigation)
- [ ] Create Dataverse tables for external data
- [ ] Configure table permissions
- [ ] Set up authentication (Azure AD B2C recommended)
- [ ] Create web roles
- [ ] Design and build pages
- [ ] Configure navigation
- [ ] Apply branding (theme, logo, colors)
- [ ] Add custom CSS/JavaScript as needed
- [ ] Configure multi-language (if needed)
- [ ] Test with each web role
- [ ] Performance testing
- [ ] Security review
- [ ] Go-live planning

### 7.2 Page Types

| Page Type | Use For | Creation Method |
|-----------|---------|----------------|
| Web page | Static content | Design Studio > Pages |
| List page | Display Dataverse records | Design Studio > Lists |
| Form page | Create/edit records | Design Studio > Forms |
| Custom page | Complex interactions | Embed canvas app |
| Blank page | Full custom | Code editor |

---

## 8. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Anonymous access | Visit without login | Only public content visible |
| Authentication flow | Login with each identity provider | Successful login, profile created |
| Role-based access | Login as each web role | Correct data visible |
| Table permissions | Attempt to access unauthorized data | Access denied |
| Form submission | Submit data via forms | Data saved correctly |
| Data filtering | View list pages | Only authorized records shown |
| Mobile responsive | Test on phone/tablet | Usable layout |
| Multi-language | Switch languages | Content in correct language |
| Performance | Page load time | < 3 seconds |
| Security (input validation) | Attempt injection attacks | Input sanitized |
| Session timeout | Leave session idle | Times out correctly |
| Password reset | Use forgot password | Reset flow works |

---

## 9. Licensing

| Component | License Required | Notes |
|-----------|-----------------|-------|
| Power Pages site | Per site subscription | Tiered by authenticated users |
| Authenticated users | Per 100 users/day | Starts at ~$200/month |
| Anonymous users | Per 500 users/day | Lower cost tier |
| Dataverse storage | Standard Dataverse rates | For portal data |
| Azure AD B2C | Separate Azure subscription | Pay per MAU |

> **WARNING:** Power Pages pricing changed significantly in 2023. Verify current pricing. Authenticated user pricing can escalate quickly with high-traffic sites.

---

## 10. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Data exposure to wrong users | Critical | Rigorous table permission testing |
| Authentication bypass | Critical | Regular security audits |
| Performance degradation | Medium | Caching, optimize queries |
| Custom domain/SSL issues | Low | Test thoroughly before go-live |
| User adoption | Medium | UX testing, training |
| Licensing cost escalation | Medium | Monitor user counts |
| Limited customization vs custom web | Low | Understand limitations upfront |
| SEO limitations | Low | Use proper metadata, sitemap |
