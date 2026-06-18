# Power Platform Complete Landscape Map

> **Version**: 1.0 | **Last updated**: 2026-06-19
> **Status**: Living document — verify all URLs, licensing details, and preview status against current Microsoft Learn before quoting to clients.

---

## 1. Quick Navigation

| Product | Category | License Required | Premium? | Status |
|---------|----------|------------------|----------|--------|
| Power Automate Cloud | Automation | Per user / Per flow | Partial (premium connectors) | Stable |
| Power Automate Desktop | RPA | Unattended add-on for bot | Yes (unattended) | Stable |
| Power Apps Canvas | App dev | Per app / Per user | Yes | Stable |
| Power Apps Model-Driven | App dev | Per app / Per user | Yes | Stable |
| Power Apps Custom Pages | App dev | Per app / Per user | Yes | Stable |
| Dataverse | Data platform | Included with apps license | Yes | Stable |
| AI Builder | AI/ML | AI Builder credits | Yes | Stable |
| Copilot Studio | Conversational AI | Per message / capacity | Yes | Stable |
| Power Pages | Portals | Per site (authenticated) | Yes | Stable |
| Power BI | Analytics | Pro / PPU / Premium | Yes | Stable |
| Custom Connectors | Integration | Included with flow/app | No (to build) | Stable |
| PCF (Code Components) | Extensibility | Included with apps | No | Stable |
| Power Platform CLI | Dev tooling | Free download | No | Stable |
| Pipelines (Power Platform) | ALM | Premium environment | Yes | Stable |
| CoE Starter Kit | Governance | Free (requires licenses) | N/A | Stable |
| Managed Environments | Governance | Premium environment | Yes | Stable |

---

## 2. Power Automate

### 2.1 Cloud Flows

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Automate Cloud Flows |
| **Category** | Process Automation |
| **What it does** | Serverless workflow engine connecting 900+ cloud services with triggers, actions, and conditions |
| **Main use cases** | Approval workflows, data sync, notifications, data transformation, system integration |
| **Required license** | Power Automate Per User ($15/user/mo) or Per Flow ($500/flow/mo for 5 min) or seeded (M365) for standard connectors only |
| **Premium status** | Premium connectors require premium license. Seeded license only covers standard connectors. |
| **Authentication model** | OAuth 2.0 connections (user-based), connection references (ALM), service principal (premium) |
| **Key limitations** | 50MB file size limit (with chunking up to 1GB), 120-day run history, 30-day action timeout, 256MB message size, 100k action limit per flow run |
| **Common mistakes** | Using personal accounts for connections, hardcoding emails, no error handling, infinite loops with trigger conditions, not using solution-aware flows |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/ |

**Licensing Warning**: The seeded Power Automate license included with Microsoft 365 ONLY works with standard connectors. The moment you use a premium connector (Dataverse, Salesforce, SQL Server, HTTP, custom connectors, etc.), every user touching that flow needs a premium license.

### 2.2 Desktop Flows (RPA)

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Automate Desktop / RPA |
| **Category** | Robotic Process Automation |
| **What it does** | Records and plays back UI interactions on Windows applications, legacy systems, and websites |
| **Main use cases** | Legacy app automation, data entry, ERP automation, Citrix automation, Excel macro replacement |
| **Required license** | Power Automate Premium for attended; Unattended RPA add-on ($150/bot/mo) for unattended |
| **Premium status** | Attended included in Premium; Unattended is extra |
| **Authentication model** | Windows user account, service accounts, credential vault in Dataverse |
| **Key limitations** | Windows only, requires installed agent, cannot run without login session (attended), screen resolution dependency |
| **Common mistakes** | Building brittle selectors, not handling popups, no retry logic, unattended flows depending on UI elements that change |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/desktop-flows/ |

> Unattended RPA licensing and bot pricing changed in 2023/2024; verify current pricing and entitlements against [Power Automate licensing](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types) before quoting.

---

## 3. Power Apps

### 3.1 Canvas Apps

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Apps Canvas |
| **Category** | Low-code App Development |
| **What it does** | Pixel-perfect app design with drag-and-drop controls and Excel-like Power Fx formulas |
| **Main use cases** | Mobile apps, inspection apps, field service, custom calculators, event check-in, approval apps |
| **Required license** | Power Apps Per App ($5/app/user/mo) or Per User ($20/user/mo) or pay-as-you-go |
| **Premium status** | Yes - all Power Apps require a license |
| **Authentication model** | Azure AD, implicit user context, service principal for headless scenarios |
| **Key limitations** | 2000 non-delegable row limit (unless using data source delegation), 500 local collection limit, no code-behind, mobile app required for mobile use |
| **Common mistakes** | Not delegating queries to data source, using ClearCollect on large tables, hardcoding IDs, not using components, ignoring responsive design |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/ |

### 3.2 Model-Driven Apps

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Apps Model-Driven |
| **Category** | Data-centric App Development |
| **What it does** | Auto-generated UI from Dataverse table structure with forms, views, charts, and dashboards |
| **Main use cases** | CRM, case management, service desk, compliance tracking, any data-heavy business app |
| **Required license** | Power Apps Per App or Per User (same as canvas) |
| **Premium status** | Yes |
| **Authentication model** | Azure AD, Dataverse security roles, business unit hierarchy |
| **Key limitations** | Dataverse-only data source, less control over UI layout, requires security model design upfront |
| **Common mistakes** | Over-complicating forms, not designing BU structure early, too many columns on forms, ignoring command bar customization |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/ |

### 3.3 Custom Pages

| Attribute | Detail |
|-----------|--------|
| **Name** | Custom Pages (Canvas inside Model-Driven) |
| **Category** | Hybrid App Development |
| **What it does** | Canvas app pages embedded within model-driven apps for custom UI where auto-generated falls short |
| **Main use cases** | Custom dashboards, wizard-style data entry, interactive visualizations within model-driven context |
| **Required license** | Same as Power Apps (included in Per User/Per App) |
| **Premium status** | Yes (same as Power Apps) |
| **Authentication model** | Azure AD via hosting model-driven app |
| **Key limitations** | Still has some canvas limitations, navigation context can be tricky, not all canvas features work |
| **Common mistakes** | Using custom pages when standard forms suffice, not passing context parameters correctly |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/page-overview |

---

## 4. Dataverse

| Attribute | Detail |
|-----------|--------|
| **Name** | Microsoft Dataverse |
| **Category** | Cloud-Native Data Platform |
| **What it does** | Cloud-hosted data store with rich data types, relationships, business rules, security model, and ALM support |
| **Main use cases** | Business app data, complex relationships, security-sensitive data, ALM-ready solutions, any app needing more than flat data |
| **Required license** | Included with Power Apps/Power Automate premium licenses; additional database/file/log capacity may be needed |
| **Premium status** | Yes (included with app/flow license) |
| **Authentication model** | Azure AD, security roles, business units, field-level security, row-level security via teams |
| **Key limitations** | API call limits (per user and per environment), storage costs beyond included capacity, learning curve for security model |
| **Common mistakes** | Using for simple lookup lists (SharePoint is cheaper), not planning BU structure, ignoring capacity monitoring, not using solutions |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/ |

**Licensing Warning**: Dataverse capacity is pooled per tenant. If your client has 100 Power Apps licenses, they get 100 x 10MB = 1GB database capacity pooled. File and log capacity are separate pools. Monitor these - overages can be expensive.

---

## 5. AI Builder

| Attribute | Detail |
|-----------|--------|
| **Name** | AI Builder |
| **Category** | Low-code AI/ML |
| **What it does** | Pre-built and custom AI models for document processing, prediction, classification, extraction, and more |
| **Main use cases** | Invoice processing, form extraction, sentiment analysis, entity extraction, object detection, category classification |
| **Required license** | AI Builder credits (included: 1M credits per tenant with certain licenses; purchase: $500 per 1M credits/mo) |
| **Premium status** | Yes |
| **Authentication model** | Azure AD, environment-scoped models, role-based access to models |
| **Key limitations** | Credit consumption can be high, model training time limits, region availability varies, document processing has page limits |
| **Common mistakes** | Not estimating credit usage, not designing human-in-the-loop review, training with too few documents, ignoring confidence scores |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/ai-builder/ |

> AI Builder credit allocation changed with licensing updates in 2024/2025 and is transitioning to Copilot Credits; verify current included credits and rates against [AI Builder credit management](https://learn.microsoft.com/en-us/ai-builder/credit-management) before quoting.

---

## 6. Copilot Studio

| Attribute | Detail |
|-----------|--------|
| **Name** | Microsoft Copilot Studio |
| **Category** | Conversational AI / Agents |
| **What it does** | Build custom AI agents (chatbots) with topic-based authoring, generative AI, and Power Platform integration |
| **Main use cases** | IT helpdesk bots, HR self-service, customer service, FAQ bots, internal knowledge base agents |
| **Required license** | Copilot Studio ($200/mo for 25k messages); messages can be purchased in packs |
| **Premium status** | Yes |
| **Authentication model** | Azure AD SSO, OAuth for channels, custom authentication via Power Automate |
| **Key limitations** | Message limits, knowledge source size limits, generative answers have token limits, some connectors restricted |
| **Common mistakes** | Not designing escalation paths, over-relying on generative answers without guardrails, not testing entity extraction, ignoring analytics |
| **Current status** | Stable (evolving rapidly) |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/microsoft-copilot-studio/ |

> Copilot Studio was rebranded from Power Virtual Agents and message-based pricing has shifted to Copilot Credits as of September 2025; verify current naming and pricing against [Copilot Studio billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing) before quoting.

---

## 7. Power Pages

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Pages |
| **Category** | External Portal / Website |
| **What it does** | Build secure, data-driven external-facing websites integrated with Dataverse |
| **Main use cases** | Customer portals, partner portals, registration sites, self-service portals, community sites |
| **Required license** | Power Pages Authenticated User ($200/mo for 100 daily users) or Anonymous (cheaper); also needs Power Apps license for maker |
| **Premium status** | Yes |
| **Authentication model** | Azure AD B2C, OAuth 2.0, local authentication, SAML 2.0, OpenID Connect |
| **Key limitations** | Dataverse as primary data source, learning curve for Liquid templates, limited design flexibility vs custom web dev |
| **Common mistakes** | Using for simple marketing sites (overkill), not planning authentication model, exposing too much data, ignoring web roles |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-pages/ |

---

## 8. Power BI

| Attribute | Detail |
|-----------|--------|
| **Name** | Microsoft Power BI |
| **Category** | Business Intelligence / Analytics |
| **What it does** | Data visualization, interactive dashboards, paginated reports, embedded analytics |
| **Main use cases** | Executive dashboards, operational reporting, embedded analytics in apps, self-service BI |
| **Required license** | Pro ($10/user/mo), Premium Per User ($20/user/mo), or Premium Per Capacity ($4,995/capacity/mo) |
| **Premium status** | Yes |
| **Authentication model** | Azure AD, row-level security (RLS), object-level security (OLS), service principals |
| **Key limitations** | Data refresh limits (Pro: 8/day, PPU: 48/day), dataset size limits (Pro: 1GB, PPU: 100GB), requires gateway for on-prem data |
| **Common mistakes** | Building models instead of connecting to Dataverse directly, not implementing RLS, ignoring query folding, DAX performance issues |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-bi/ |

---

## 9. Custom Connectors

| Attribute | Detail |
|-----------|--------|
| **Name** | Custom Connectors |
| **Category** | Integration |
| **What it does** | Build your own connectors using OpenAPI definition to connect to any REST API |
| **Main use cases** | Internal API integration, legacy system connectivity, third-party services without certified connectors |
| **Required license** | Power Automate Premium or Power Apps license to USE; no separate license to BUILD |
| **Premium status** | Using a custom connector requires a premium license |
| **Authentication model** | API Key, OAuth 2.0, Basic Auth, Windows Auth |
| **Key limitations** | Requires premium license to use, 1000 requests/minute per connection, 15MB response size, OpenAPI 2.0 only |
| **Common mistakes** | Not securing API keys, hardcoded URLs instead of environment variables, poor error handling in connector definition |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/connectors/custom-connectors/ |

**Licensing Warning**: Every user of a flow or app that uses a custom connector MUST have a premium Power Automate or Power Apps license. This is a common budget shock.

---

## 10. PCF (Power Apps Component Framework)

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Apps Component Framework (PCF) |
| **Category** | Extensibility / Code Components |
| **What it does** | Build custom code components (React, TypeScript) for use in Canvas and Model-Driven apps |
| **Main use cases** | Custom visualizations, complex controls not available out-of-box, integrating third-party JS libraries |
| **Required license** | Included with Power Apps license |
| **Premium status** | No extra cost |
| **Authentication model** | N/A (runs in user context) |
| **Key limitations** | Code-only (no visual designer), must use pac CLI to build/deploy, canvas support has limitations, security review required for marketplace |
| **Common mistakes** | Using PCF when standard controls work, not testing across devices, ignoring performance impact, not handling canvas vs model-driven differences |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/developer/component-framework/ |

---

## 11. Power Platform CLI (pac)

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Platform CLI (pac) |
| **Category** | Developer Tooling |
| **What it does** | Command-line interface for all ALM operations: solution export/import, environment management, PCF build, Dataverse operations |
| **Main use cases** | CI/CD pipelines, solution packaging, environment provisioning, PCF component development |
| **Required license** | Free download |
| **Premium status** | No |
| **Authentication model** | Interactive login, service principal (application user), username/password |
| **Key limitations** | Learning curve, some operations require admin privileges, authentication can be tricky in CI/CD |
| **Common mistakes** | Using interactive auth in pipelines, not using service principals, not pinning pac version in CI/CD |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction |

**Essential pac commands**:
```bash
# Install
dotnet tool install --global Microsoft.PowerApps.CLI.Tool

# Auth
pac auth create --url https://yourorg.crm.dynamics.com --name MyOrg

# Solution export
pac solution export --path ./solution.zip --name MySolution --managed

# Solution import
pac solution import --path ./solution.zip --activate-plugins --force-overwrite

# Environment list
pac admin list

# PCF
pac pcf init --namespace MyNamespace --name MyControl --template field
pac pcf push --publisher-prefix mypref
```

---

## 12. Power Platform Pipelines

| Attribute | Detail |
|-----------|--------|
| **Name** | Power Platform Pipelines |
| **Category** | ALM / Deployment |
| **What it does** | Native, low-code CI/CD for deploying solutions between environments directly in Power Platform |
| **Main use cases** | Deploying solutions dev->test->prod without Azure DevOps setup, citizen developer ALM |
| **Required license** | Requires Managed Environment (premium feature) |
| **Premium status** | Yes (requires Managed Environment) |
| **Authentication model** | Environment admin permissions |
| **Key limitations** | Less flexible than Azure DevOps, no advanced branching, requires Managed Environments, limited approval gates |
| **Common mistakes** | Using for complex ALM scenarios better suited to Azure DevOps, not setting up environment strategy first |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/alm/pipelines |

---

## 13. CoE Starter Kit

| Attribute | Detail |
|-----------|--------|
| **Name** | Center of Excellence (CoE) Starter Kit |
| **Category** | Governance / Administration |
| **What it does** | Free toolkit of apps, flows, and dashboards for governing Power Platform adoption |
| **Main use cases** | Inventory of apps/flows, compliance checking, nurture campaigns, environment management, DLP auditing |
| **Required license** | Free to download; requires Power Automate/Dataverse licenses to run (can use Developer plan for testing) |
| **Premium status** | No (but consumes licenses to run) |
| **Authentication model** | Requires Power Platform Admin Role in Azure AD |
| **Key limitations** | Must be installed in a dedicated environment, requires regular updates, can generate significant Dataverse storage |
| **Common mistakes** | Installing in production environment, not assigning dedicated admin, not updating monthly, ignoring the setup wizard |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/guidance/coe/ |

---

## 14. Managed Environments

| Attribute | Detail |
|-----------|--------|
| **Name** | Managed Environments |
| **Category** | Governance / Premium Admin Feature |
| **What it does** | Premium environment type with built-in governance: sharing limits, IP restrictions, data policies, insights |
| **Main use cases** | Production environment governance, security hardening, compliance, usage insights |
| **Required license** | Available to all environments in tenant at flat rate ($?) |
| **Premium status** | Yes |
| **Authentication model** | Tenant admin configuration |
| **Key limitations** | Additional cost per environment or tenant-wide, some features require premium licenses for makers |
| **Common mistakes** | Not enabling on production environments, not configuring sharing limits, not reviewing insights reports |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview |

> Managed Environments pricing and licensing entitlements have changed over time; verify current structure against [Managed Environments licensing](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-licensing) before quoting.

---

## 15. Feature Comparison Matrix

### Automation Decision Matrix

| If you need... | Use | Don't use |
|----------------|-----|-----------|
| Cloud-to-cloud integration | Power Automate Cloud | Desktop Flows |
| Legacy UI automation | Power Automate Desktop | Cloud Flows |
| Scheduled data sync | Power Automate Scheduled | Power Apps |
| Real-time approvals | Power Automate + Approvals | Manual email |
| Complex business logic | Cloud Flows + Dataverse | SharePoint lists |

### App Type Decision Matrix

| If you need... | Use | Don't use |
|----------------|-----|-----------|
| Mobile-first field app | Canvas App | Model-Driven |
| Complex data relationships | Model-Driven App | Canvas + SharePoint |
| External customer portal | Power Pages | Power Apps |
| Quick internal tool | Canvas App | Custom web app |
| CRM/Case management | Model-Driven App | Canvas |

---

## 16. Licensing Quick Reference

### Per-User vs Per-App Decision Tree

```
User needs more than 2 apps?
  Yes -> Per User ($20/mo) is cheaper
  No  -> Per App ($5/app/mo) may suffice

User needs premium connectors in flows?
  Yes -> Power Automate Per User ($15/mo) or Premium ($20/mo)
  No  -> Seeded license may work

Unattended automation needed?
  Yes -> Unattended RPA add-on required
  No  -> Attended RPA included in Premium
```

### Capacity Monitoring

```powershell
# Check Dataverse capacity in Power Platform Admin Center
# Navigate to: Resources > Capacity > Summary
# Or use Admin Center URL:
# https://admin.powerplatform.microsoft.com/resources/capacity
```

---

## 17. Authentication Models Summary

| Product | User Auth | Service/Headless | SSO |
|---------|-----------|-------------------|-----|
| Power Automate | OAuth connections | Service principal (premium) | N/A |
| Power Apps | Azure AD implicit | N/A | Supported |
| Dataverse | Azure AD + security roles | Application user | Supported |
| Power Pages | Azure AD B2C, OAuth | N/A | Supported |
| Copilot Studio | Azure AD SSO | Direct line secret | Supported |
| Custom Connectors | OAuth, API Key | API Key, Basic | Varies |

---

## 18. Status Legend

| Status | Meaning |
|--------|---------|
| **Stable** | Generally available, production-ready |
| **Preview** | Available but not for production, terms may change |
| **Deprecated** | Being phased out, plan migration |
| **Region-limited** | Not available in all datacenter regions |

---

## 19. Deprecated / End-of-Life Items

| Product/Feature | Replacement | EOL Date | Action Required |
|-----------------|-------------|----------|-----------------|
| Common Data Service | Microsoft Dataverse | Already renamed | Update documentation |
| Power Virtual Agents | Microsoft Copilot Studio | Rebranded | Use new name |
| Dynamics 365 Portals | Power Pages | Migrated | Verify licensing |
| Skype for Business integration | Microsoft Teams | EOL | Migrate to Teams |

---

## 20. Quick-Start Decision Framework

When starting a new client engagement, use this flow:

1. **Data storage**: Simple lists (<10k rows, flat) -> SharePoint. Complex relationships, security -> Dataverse.
2. **Automation**: Cloud integration -> Power Automate Cloud. Legacy UI -> Desktop Flows.
3. **User interface**: Internal users, mobile -> Canvas. Complex data, security -> Model-Driven. External users -> Power Pages.
4. **AI**: Document processing -> AI Builder. Conversational -> Copilot Studio. Advanced ML -> Azure AI.
5. **Analytics**: Embedded in app -> Power BI tile. Standalone -> Power BI service.
6. **Governance**: All tenants -> CoE Starter Kit. Production environments -> Managed Environments.

---

*End of Platform Map. Verify all URLs and licensing details before client presentations.*
