# Power Platform Tool Catalogue

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Comprehensive catalogue of every tool, surface, and component in the Microsoft Power Platform ecosystem.
> **Needs verification against current Microsoft docs**: Licensing and preview status change frequently. Verify before quoting.

---

## Table of Contents

1. [Automation Tools](#1-automation-tools)
2. [App Development Tools](#2-app-development-tools)
3. [Data Platform Tools](#3-data-platform-tools)
4. [AI and ML Tools](#4-ai-and-ml-tools)
5. [Conversational AI Tools](#5-conversational-ai-tools)
6. [Portal and Web Tools](#6-portal-and-web-tools)
7. [Analytics Tools](#7-analytics-tools)
8. [Integration and Connectivity](#8-integration-and-connectivity)
9. [Developer and Extensibility Tools](#9-developer-and-extensibility-tools)
10. [ALM and DevOps Tools](#10-alm-and-devops-tools)
11. [Governance and Admin Tools](#11-governance-and-admin-tools)
12. [Data Migration and Integration Tools](#12-data-migration-and-integration-tools)

---

## 1. Automation Tools

### 1.1 Cloud Flows (Automated)

| Field | Detail |
|-------|--------|
| **Name** | Automated Cloud Flow |
| **Category** | Automation - Trigger-based |
| **Description** | Flows that start automatically when a trigger event occurs (new email, new row, webhook, etc.) |
| **Main use cases** | Real-time data sync, notification systems, event-driven automation, approval routing |
| **Best-fit project types** | Integration projects, approval workflows, notification systems |
| **Required license** | Power Automate Per User ($15/user/mo) or Per Flow ($500/flow/mo) or seeded for standard only |
| **Premium/non-premium** | Premium connectors require premium license |
| **Authentication/security model** | User-based OAuth connections; for ALM use connection references |
| **Key limitations and quotas** | 50MB file size (1GB with chunking), 120-day run history, 30-day timeout, 100k actions per run |
| **Common mistakes** | Not using trigger conditions (causes infinite loops), hardcoding emails, no error handling |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/triggers-introduction |
| **Example implementation idea** | Auto-route invoice emails to SharePoint + notify AP team via Teams |

### 1.2 Cloud Flows (Instant / Button)

| Field | Detail |
|-------|--------|
| **Name** | Instant Cloud Flow |
| **Category** | Automation - On-demand |
| **Description** | Flows triggered manually by a user click, Power Apps button, or API call |
| **Main use cases** | One-click actions, admin utilities, Power Apps integration, manual data processing |
| **Best-fit project types** | Apps needing backend logic, admin tools, user-initiated processes |
| **Required license** | Same as automated flows |
| **Premium/non-premium** | Same as automated flows |
| **Authentication/security model** | Runs in triggering user's context |
| **Key limitations and quotas** | 120-second response for Power Apps, 30-day overall timeout |
| **Common mistakes** | Long-running flows triggered synchronously from Power Apps, not handling timeouts |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/triggers-introduction |
| **Example implementation idea** | "Generate Report" button in Power Apps that triggers a flow with parameters |

### 1.3 Cloud Flows (Scheduled)

| Field | Detail |
|-------|--------|
| **Name** | Scheduled Cloud Flow |
| **Category** | Automation - Time-based |
| **Description** | Flows that run on a recurring schedule (every minute, hour, day, week) |
| **Main use cases** | Daily reports, cleanup jobs, batch processing, recurring sync |
| **Best-fit project types** | Batch integration, maintenance, scheduled reporting |
| **Required license** | Same as automated flows |
| **Premium/non-premium** | Premium connectors require premium license |
| **Authentication/security model** | Uses flow owner's connections |
| **Key limitations and quotas** | Min frequency: 1 minute (premium), 15 minutes (standard). Max: configurable. Runs for 30 days max. |
| **Common mistakes** | Running too frequently, not checking for existing data (duplicate processing), no concurrency control |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/triggers-introduction |
| **Example implementation idea** | Daily sync of new Salesforce opportunities to Dataverse |

### 1.4 Desktop Flows (Attended)

| Field | Detail |
|-------|--------|
| **Name** | Attended Desktop Flow |
| **Category** | RPA - User-attended |
| **Description** | UI automation that runs on a user's desktop while they watch/interact |
| **Main use cases** | Assisted data entry, guided workflows, repetitive UI tasks |
| **Best-fit project types** | Legacy system automation, data migration, repetitive data entry |
| **Required license** | Included in Power Automate Premium |
| **Premium/non-premium** | Included in premium |
| **Authentication/security model** | Windows user account |
| **Key limitations and quotas** | Requires logged-in user session, screen must be unlocked, Windows only |
| **Common mistakes** | Building selectors that break on UI changes, not handling unexpected popups |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/desktop-flows/ |
| **Example implementation idea** | Extract data from legacy ERP and enter into modern system via UI automation |

### 1.5 Desktop Flows (Unattended)

| Field | Detail |
|-------|--------|
| **Name** | Unattended Desktop Flow |
| **Category** | RPA - Autonomous |
| **Description** | UI automation that runs on a dedicated machine without human supervision |
| **Main use cases** | Overnight batch processing, 24/7 automation, server-based RPA |
| **Best-fit project types** | High-volume legacy automation, unattended data processing |
| **Required license** | Unattended RPA add-on ($150/bot/mo) |
| **Premium/non-premium** | Premium add-on |
| **Authentication/security model** | Dedicated service account |
| **Key limitations and quotas** | One bot license = one concurrent unattended session, machine dependency |
| **Common mistakes** | Not buying enough bot licenses, flows failing due to UI changes |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/desktop-flows/ |
| **Example implementation idea** | Overnight processing of 1000 invoices through legacy accounting system |

### 1.6 Business Process Flows

| Field | Detail |
|-------|--------|
| **Name** | Business Process Flow (BPF) |
| **Category** | Automation - Guided process |
| **Description** | Visual process guide embedded in model-driven apps with defined stages and steps |
| **Main use cases** | Sales stages, case resolution, onboarding workflows, compliance checklists |
| **Best-fit project types** | CRM implementations, case management, any process needing stage tracking |
| **Required license** | Included in Power Apps license |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Dataverse security roles |
| **Key limitations and quotas** | Max 10 stages per BPF, limited branching logic, model-driven only |
| **Common mistakes** | Trying to replace cloud flows with BPFs, over-complicating stages |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-automate/business-process-flows-overview |
| **Example implementation idea** | Lead-to-opportunity process with qualification, proposal, negotiation stages |

---

## 2. App Development Tools

### 2.1 Canvas Apps

| Field | Detail |
|-------|--------|
| **Name** | Canvas App |
| **Category** | App Development - Custom |
| **Description** | Pixel-perfect, formula-driven apps with drag-and-drop design and Excel-like Power Fx language |
| **Main use cases** | Mobile apps, custom forms, calculators, inspection tools, event apps |
| **Best-fit project types** | Field service, mobile-first, quick internal tools, custom UX projects |
| **Required license** | Power Apps Per App ($5) or Per User ($20/mo) |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Azure AD, implicit user context |
| **Key limitations and quotas** | 2000 non-delegable rows, 500 local collection items, 2MB app size |
| **Common mistakes** | Not delegating queries, using ClearCollect on large data, hardcoding IDs |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/ |
| **Example implementation idea** | Mobile inspection app with camera, offline sync, and signature capture |

### 2.2 Model-Driven Apps

| Field | Detail |
|-------|--------|
| **Name** | Model-Driven App |
| **Category** | App Development - Data-centric |
| **Description** | Auto-generated UI from Dataverse metadata: forms, views, charts, dashboards |
| **Main use cases** | CRM, case management, service desk, compliance tracking, data-heavy apps |
| **Best-fit project types** | Enterprise business apps, security-heavy apps, complex data relationships |
| **Required license** | Power Apps Per App or Per User |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Azure AD + Dataverse security roles + BU hierarchy |
| **Key limitations and quotas** | Dataverse-only, less UI control, requires security model design |
| **Common mistakes** | Over-complicating forms, not designing BU structure, too many form columns |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/ |
| **Example implementation idea** | Customer service case management with queue routing and SLA tracking |

### 2.3 Custom Pages

| Field | Detail |
|-------|--------|
| **Name** | Custom Page |
| **Category** | App Development - Hybrid |
| **Description** | Canvas app pages embedded within model-driven apps for custom visualizations |
| **Main use cases** | Custom dashboards, wizard interfaces, interactive components in model-driven context |
| **Best-fit project types** | Model-driven apps needing custom UI components |
| **Required license** | Included in Power Apps license |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Inherits hosting model-driven app context |
| **Key limitations and quotas** | Some canvas features not available, context passing can be tricky |
| **Common mistakes** | Using when standard forms work, not passing context parameters |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/page-overview |
| **Example implementation idea** | Interactive KPI dashboard embedded in account form |

### 2.4 Component Library

| Field | Detail |
|-------|--------|
| **Name** | Component Library |
| **Category** | App Development - Reusability |
| **Description** | Reusable canvas components that can be shared across multiple apps |
| **Main use cases** | Standard headers, navigation, footer, common controls, branding consistency |
| **Best-fit project types** | Multi-app portfolios, agencies, standardized UX |
| **Required license** | Included in Power Apps |
| **Premium/non-premium** | Included |
| **Authentication/security model** | N/A |
| **Key limitations and quotas** | Canvas apps only, cannot use in model-driven (use PCF instead) |
| **Common mistakes** | Not using component library from project start, versioning issues |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/component-library |
| **Example implementation idea** | Standardized header with user info, notifications, and navigation for 10+ apps |

### 2.5 Power Apps Mobile

| Field | Detail |
|-------|--------|
| **Name** | Power Apps Mobile Player |
| **Category** | App Runtime - Mobile |
| **Description** | Native iOS/Android app for running canvas and model-driven apps on mobile devices |
| **Main use cases** | Field service, mobile inspections, on-the-go approvals |
| **Best-fit project types** | Any app needing mobile access |
| **Required license** | Same as Power Apps license |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Azure AD sign-in in app |
| **Key limitations and quotas** | Requires download from app store, offline capability limited to specific connectors |
| **Common mistakes** | Not testing on actual devices, ignoring offline scenarios |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/mobile/ |
| **Example implementation idea** | Field technician app with offline data collection and sync |

---

## 3. Data Platform Tools

### 3.1 Dataverse Tables

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Table |
| **Category** | Data - Core Storage |
| **Description** | Cloud-native table with rich data types, validation, relationships, and business rules |
| **Main use cases** | App data storage, business entity definitions, relationship modeling |
| **Best-fit project types** | All Dataverse-backed projects |
| **Required license** | Included with Power Apps/Automate premium |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Dataverse security roles |
| **Key limitations and quotas** | API limits per user/environment, storage capacity limits |
| **Common mistakes** | Not using solutions for ALM, not indexing lookup columns |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/ |
| **Example implementation idea** | Custom project management entity with related tasks, contacts, and documents |

### 3.2 Dataverse Views

| Field | Detail |
|-------|--------|
| **Name** | Dataverse View |
| **Category** | Data - Presentation |
| **Description** | Filtered, sorted column layouts for displaying table data in model-driven apps |
| **Main use cases** | App navigation, filtered data sets, dashboard data sources |
| **Best-fit project types** | Model-driven apps, Power BI integration |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Respects user's security roles |
| **Key limitations and quotas** | Limited to Dataverse data, max 250 columns in view |
| **Common mistakes** | Creating too many views, not optimizing for performance |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/ |
| **Example implementation idea** | "My Active Cases" view filtered by owner and status |

### 3.3 Dataverse Business Rules

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Business Rule |
| **Category** | Data - Business Logic |
| **Description** | Client-side and server-side validation and field manipulation without code |
| **Main use cases** | Field validation, conditional visibility, default values, error messages |
| **Best-fit project types** | Model-driven apps, form validation |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | N/A |
| **Key limitations and quotas** | Limited logic capability (no loops), scoped to single table |
| **Common mistakes** | Trying to implement complex logic, not testing all conditions |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/ |
| **Example implementation idea** | Show "Other" text field only when "Category = Other" is selected |

### 3.4 Dataverse Plugins

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Plugin |
| **Category** | Data - Server-side Code |
| **Description** | C# code that runs server-side on Dataverse CRUD operations |
| **Main use cases** | Complex validation, cross-table logic, external API calls, audit logging |
| **Best-fit project types** | Complex business logic that can't be done with low-code |
| **Required license** | Included |
| **Premium/non-premium** | Included (developer skill required) |
| **Authentication/security model** | Runs in system context or calling user context |
| **Key limitations and quotas** | 2-minute timeout, sandbox isolation, must be registered via Plugin Registration Tool |
| **Common mistakes** | Not handling exceptions, infinite loops with recursive triggers, no tracing |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/plug-ins |
| **Example implementation idea** | Auto-create related task records when a case is created |

### 3.5 Dataverse Custom APIs

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Custom API |
| **Category** | Data - Custom Endpoint |
| **Description** | Define custom Dataverse API endpoints with typed parameters and custom logic |
| **Main use cases** | Custom operations, complex multi-step processes exposed as API, plugin wrapper |
| **Best-fit project types** | API-first integrations, complex server-side operations |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Dataverse authentication |
| **Key limitations and quotas** | Must be created via API or solution import, requires plugin for logic |
| **Common mistakes** | Not defining proper input/output parameters, not documenting |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/custom-api |
| **Example implementation idea** | "ApproveBudget" custom API that validates, updates budget, and sends notification |

### 3.6 Virtual Tables

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Virtual Table |
| **Category** | Data - External Integration |
| **Description** | Dataverse tables that surface external data without copying it into Dataverse |
| **Main use cases** | Read-only external data in model-driven apps, legacy system integration |
| **Best-fit project types** | Dataverse apps needing external read-only data |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | External data source authentication |
| **Key limitations and quotas** | Read-only in most cases, performance depends on external source, no offline support |
| **Common mistakes** | Using for high-write scenarios, expecting Dataverse performance |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/virtual-entities/ |
| **Example implementation idea** | Surface customer data from legacy SQL database in model-driven app without migration |

### 3.7 Synapse Link for Dataverse

| Field | Detail |
|-------|--------|
| **Name** | Azure Synapse Link for Dataverse |
| **Category** | Data - Analytics Export |
| **Description** | Near real-time export of Dataverse data to Azure Synapse Analytics and Data Lake |
| **Main use cases** | Reporting, ML, data warehousing, Power BI direct query on large datasets |
| **Best-fit project types** | Analytics-heavy projects, large data volume reporting |
| **Required license** | Azure Synapse + Data Lake costs (not included in Power Platform license) |
| **Premium/non-premium** | Azure costs apply |
| **Authentication/security model** | Managed identity |
| **Key limitations and quotas** | Export-only (one way), requires Azure subscription, incremental update only |
| **Common mistakes** | Not factoring Azure costs, expecting real-time (it's near real-time) |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/export-to-azure-synapse-link |
| **Example implementation idea** | Export all case data to Synapse for trend analysis and ML prediction |

---

## 4. AI and ML Tools

### 4.1 AI Builder Document Processing

| Field | Detail |
|-------|--------|
| **Name** | AI Builder Document Processing |
| **Category** | AI - Document Intelligence |
| **Description** | Extract structured data from PDFs and images using prebuilt or custom models |
| **Main use cases** | Invoice processing, form extraction, contract parsing, receipt processing |
| **Best-fit project types** | Document-heavy workflows, AP automation, compliance |
| **Required license** | AI Builder credits |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Environment-scoped models |
| **Key limitations and quotas** | Credit consumption varies by model type, training requires 5+ sample documents |
| **Common mistakes** | Not training with enough variety, not implementing human review |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/ai-builder/form-processing-model |
| **Example implementation idea** | Process 500 vendor invoices monthly, extract amount, date, PO number |

### 4.2 AI Builder GPT Prompts

| Field | Detail |
|-------|--------|
| **Name** | AI Builder GPT Prompts |
| **Category** | AI - Generative AI |
| **Description** | Create and use GPT-based prompts in Power Automate and Power Apps |
| **Main use cases** | Text generation, summarization, classification, JSON extraction, translation |
| **Best-fit project types** | Content generation, intelligent automation, text processing |
| **Required license** | AI Builder credits (GPT actions consume credits) |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Azure AD |
| **Key limitations and quotas** | Token limits per prompt, credit consumption per call, region availability |
| **Common mistakes** | Not handling hallucinations, not validating outputs, prompt injection risk |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/ai-builder/prompt-model |
| **Example implementation idea** | Summarize customer complaint emails and classify urgency automatically |

### 4.3 AI Builder Prediction

| Field | Detail |
|-------|--------|
| **Name** | AI Builder Prediction |
| **Category** | AI - Predictive Analytics |
| **Description** | Train models to predict outcomes based on historical Dataverse data |
| **Main use cases** | Churn prediction, lead scoring, delay prediction, risk assessment |
| **Best-fit project types** | CRM optimization, proactive service, risk management |
| **Required license** | AI Builder credits |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Dataverse security |
| **Key limitations and quotas** | Requires minimum 300 historical records with outcomes, Dataverse only |
| **Common mistakes** | Insufficient training data, not refreshing model regularly |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/ai-builder/prediction-model |
| **Example implementation idea** | Predict which support cases will exceed SLA based on historical patterns |

---

## 5. Conversational AI Tools

### 5.1 Copilot Studio Agents

| Field | Detail |
|-------|--------|
| **Name** | Copilot Studio Agent (formerly PVA Bot) |
| **Category** | Conversational AI |
| **Description** | Build AI agents with topic-based authoring, generative answers, and tool integration |
| **Main use cases** | IT helpdesk, HR self-service, customer support, FAQ, knowledge base queries |
| **Best-fit project types** | Service desk automation, employee self-service, customer-facing chat |
| **Required license** | Copilot Studio ($200/mo for 25k messages) |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Azure AD SSO, custom auth via Power Automate |
| **Key limitations and quotas** | Message caps, knowledge source size limits, some connector restrictions |
| **Common mistakes** | Not planning escalation, over-relying on generative answers, no testing |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/microsoft-copilot-studio/ |
| **Example implementation idea** | IT helpdesk agent that resets passwords, checks ticket status, escalates to human |

### 5.2 Copilot Studio Generative Answers

| Field | Detail |
|-------|--------|
| **Name** | Generative Answers |
| **Category** | Conversational AI - Knowledge |
| **Description** | AI-generated responses from uploaded documents, websites, and SharePoint |
| **Main use cases** | Knowledge base Q&A, policy queries, self-service information |
| **Best-fit project types** | Internal knowledge base, policy portals |
| **Required license** | Included in Copilot Studio license |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Respects source document permissions |
| **Key limitations and quotas** | Document size limits, token limits per response, hallucination risk |
| **Common mistakes** | Not curating source documents, no guardrails, not testing edge cases |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/microsoft-copilot-studio/ |
| **Example implementation idea** | Upload employee handbook; agent answers policy questions with citations |

---

## 6. Portal and Web Tools

### 6.1 Power Pages Site

| Field | Detail |
|-------|--------|
| **Name** | Power Pages Site |
| **Category** | External Portal |
| **Description** | Secure, data-driven external-facing website integrated with Dataverse |
| **Main use cases** | Customer portals, partner portals, registration sites, self-service |
| **Best-fit project types** | External-facing Dataverse apps, B2B/B2C portals |
| **Required license** | Power Pages ($200/mo per 100 daily authenticated users) |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Azure AD B2C, OAuth, SAML, OpenID Connect, local |
| **Key limitations and quotas** | Dataverse as primary data source, Liquid template learning curve |
| **Common mistakes** | Using for marketing sites, not planning auth model, exposing too much data |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-pages/ |
| **Example implementation idea** | Customer self-service portal for case creation and document upload |

### 6.2 Power Pages Web API

| Field | Detail |
|-------|--------|
| **Name** | Power Pages Web API |
| **Category** | Portal - API Access |
| **Description** | OData v4 API for CRUD operations on Dataverse from Power Pages or external apps |
| **Main use cases** | Custom JavaScript in portals, external system integration, advanced portal scenarios |
| **Best-fit project types** | Complex portal builds needing custom frontend code |
| **Required license** | Included in Power Pages |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Site user authentication required |
| **Key limitations and quotas** | OData v4 only, table must be enabled for Web API, rate limits apply |
| **Common mistakes** | Not enabling table permissions, exposing sensitive data |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview |
| **Example implementation idea** | Custom React component in portal that fetches and displays case history |

---

## 7. Analytics Tools

### 7.1 Power BI Embedded in Apps

| Field | Detail |
|-------|--------|
| **Name** | Power BI Embedded |
| **Category** | Analytics - Embedded |
| **Description** | Embed Power BI reports and tiles directly in Power Apps and SharePoint |
| **Main use cases** | In-app dashboards, contextual analytics, embedded KPIs |
| **Best-fit project types** | Apps needing integrated analytics |
| **Required license** | Power BI Pro at minimum; Premium for large datasets |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Azure AD, row-level security |
| **Key limitations and quotas** | Pro: 1GB dataset, PPU: 100GB |
| **Common mistakes** | Not aligning RLS with app security, embedding without Pro license |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-bi/developer/embedded/ |
| **Example implementation idea** | Account dashboard in model-driven app showing revenue trends and pipeline |

---

## 8. Integration and Connectivity Tools

### 8.1 Certified Connectors

| Field | Detail |
|-------|--------|
| **Name** | Certified Connector (Standard) |
| **Category** | Integration - Standard |
| **Description** | Microsoft-tested connectors for common services (SharePoint, Outlook, Teams, OneDrive) |
| **Main use cases** | Microsoft 365 integration, common cloud services |
| **Best-fit project types** | Most Power Automate projects |
| **Required license** | Included in seeded license |
| **Premium/non-premium** | Standard (free) |
| **Authentication/security model** | OAuth, API key |
| **Key limitations and quotas** | Varies by connector, generally 1000 req/min |
| **Common mistakes** | Assuming all connectors are standard |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/connectors/connector-reference/ |
| **Example implementation idea** | Send Teams notification when SharePoint list item is created |

### 8.2 Premium Connectors

| Field | Detail |
|-------|--------|
| **Name** | Certified Connector (Premium) |
| **Category** | Integration - Premium |
| **Description** | Connectors requiring premium license: Dataverse, SQL Server, Salesforce, HTTP, Azure services |
| **Main use cases** | Business system integration, database access, custom API calls |
| **Best-fit project types** | Enterprise integration projects |
| **Required license** | Power Automate Premium or Per User |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | OAuth, connection references, service principal |
| **Key limitations and quotas** | 1000 req/min per connection, some have additional service limits |
| **Common mistakes** | Not budgeting for premium licenses, using personal connections |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/connectors/connector-reference/ |
| **Example implementation idea** | Sync Dataverse customers to Salesforce via premium connectors |

### 8.3 Custom Connectors

| Field | Detail |
|-------|--------|
| **Name** | Custom Connector |
| **Category** | Integration - Custom |
| **Description** | Build your own connector from an OpenAPI definition for any REST API |
| **Main use cases** | Internal APIs, third-party services without certified connectors |
| **Best-fit project types** | Custom API integration |
| **Required license** | Premium license required to USE |
| **Premium/non-premium** | Premium to use; free to build |
| **Authentication/security model** | API Key, OAuth 2.0, Basic, Windows |
| **Key limitations and quotas** | OpenAPI 2.0 only, 15MB response, 1000 req/min |
| **Common mistakes** | Not versioning, hardcoded URLs, no error handling |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/connectors/custom-connectors/ |
| **Example implementation idea** | Connect to internal billing API for invoice retrieval |

### 8.4 On-Premises Data Gateway

| Field | Detail |
|-------|--------|
| **Name** | On-Premises Data Gateway |
| **Category** | Integration - On-Premises Bridge |
| **Description** | Bridge between cloud services and on-premises data sources (SQL, SharePoint, file shares) |
| **Main use cases** | Cloud flows accessing on-prem SQL, on-prem SharePoint, file systems |
| **Best-fit project types** | Hybrid cloud-on-prem integration |
| **Required license** | Free to install; premium license needed for premium connectors |
| **Premium/non-premium** | Free infrastructure |
| **Authentication/security model** | Windows service account, gateway admin |
| **Key limitations and quotas** | Single point of failure if not clustered, network dependency, latency |
| **Common mistakes** | Installing on user's laptop (not server), not clustering for HA |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/data-integration/gateway/ |
| **Example implementation idea** | Cloud flow reads on-prem SQL Server inventory database |

---

## 9. Developer and Extensibility Tools

### 9.1 Power Apps Component Framework (PCF)

| Field | Detail |
|-------|--------|
| **Name** | PCF Code Component |
| **Category** | Extensibility - Code |
| **Description** | Build custom controls using TypeScript/React for use in Canvas and Model-Driven apps |
| **Main use cases** | Custom visualizations, complex controls, third-party JS library integration |
| **Best-fit project types** | Apps needing custom UI not available out-of-box |
| **Required license** | Included in Power Apps |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Runs in user context |
| **Key limitations and quotas** | Code only, pac CLI required, canvas support has limits |
| **Common mistakes** | Using when standard controls work, not testing cross-device |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/developer/component-framework/ |
| **Example implementation idea** | Custom Gantt chart control for project management app |

### 9.2 Power Platform CLI (pac)

| Field | Detail |
|-------|--------|
| **Name** | Power Platform CLI |
| **Category** | Developer Tooling |
| **Description** | Command-line interface for ALM, solution management, PCF development |
| **Main use cases** | CI/CD, solution packaging, environment management, PCF build |
| **Best-fit project types** | All ALM-enabled projects |
| **Required license** | Free |
| **Premium/non-premium** | Free |
| **Authentication/security model** | Interactive, service principal |
| **Key limitations and quotas** | Learning curve, admin privileges needed for some operations |
| **Common mistakes** | Using interactive auth in CI/CD, not pinning versions |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction |
| **Example implementation idea** | Azure DevOps pipeline using pac to deploy solutions |

### 9.3 Dataverse Web API

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Web API |
| **Category** | Developer - API Access |
| **Description** | OData v4 REST API for all Dataverse CRUD operations |
| **Main use cases** | External app integration, custom frontends, mobile app backends |
| **Best-fit project types** | Headless integrations, custom development |
| **Required license** | Requires app/flow license for API access |
| **Premium/non-premium** | Included |
| **Authentication/security model** | OAuth 2.0, Azure AD, client credentials |
| **Key limitations and quotas** | API limits apply, 5000 records per page |
| **Common mistakes** | Not handling pagination, not using $select for performance |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/ |
| **Example implementation idea** | React SPA that reads/writes Dataverse data directly |

---

## 10. ALM and DevOps Tools

### 10.1 Solutions (Managed/Unmanaged)

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Solution |
| **Category** | ALM - Packaging |
| **Description** | Container for packaging apps, flows, tables, and components for deployment |
| **Main use cases** | App lifecycle management, deployment packaging, version control |
| **Best-fit project types** | ALL production projects |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Environment admin for import/export |
| **Key limitations and quotas** | Dependency management can be complex, unmanaged in dev only |
| **Common mistakes** | Editing in production (unmanaged), not using environment variables |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts |
| **Example implementation idea** | Package entire case management app for dev->test->prod promotion |

### 10.2 Power Platform Pipelines

| Field | Detail |
|-------|--------|
| **Name** | Power Platform Pipelines |
| **Category** | ALM - Native CI/CD |
| **Description** | Low-code deployment pipelines for promoting solutions between environments |
| **Main use cases** | Citizen developer ALM, simple dev-test-prod deployment |
| **Best-fit project types** | Teams without Azure DevOps expertise |
| **Required license** | Requires Managed Environment |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Environment admin |
| **Key limitations and quotas** | Less flexible than Azure DevOps, requires Managed Environment |
| **Common mistakes** | Using for complex scenarios, not setting up environments first |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/alm/pipelines |
| **Example implementation idea** | One-click deploy from dev to test to production environments |

### 10.3 Environment Variables

| Field | Detail |
|-------|--------|
| **Name** | Environment Variable |
| **Category** | ALM - Configuration |
| **Description** | Key-value pairs that store environment-specific configuration in solutions |
| **Main use cases** | API URLs, connection strings, feature flags, email addresses per environment |
| **Best-fit project types** | All ALM-enabled projects |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | N/A |
| **Key limitations and quotas** | Must be defined in solution, types: string, number, JSON, Dataverse reference |
| **Common mistakes** | Hardcoding values instead of using env vars, not including in solution |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables |
| **Example implementation idea** | Store SharePoint site URL as env var (different per environment) |

### 10.4 Connection References

| Field | Detail |
|-------|--------|
| **Name** | Connection Reference |
| **Category** | ALM - Connections |
| **Description** | Abstracted connection definition that flows use instead of hardcoded connections |
| **Main use cases** | ALM-friendly connections, service account switching per environment |
| **Best-fit project types** | All solution-aware flow projects |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Connection credentials stored separately |
| **Key limitations and quotas** | Must be created before flow import, one per connection per solution |
| **Common mistakes** | Not using connection references (hardcoding connections), not planning per env |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-connection-reference |
| **Example implementation idea** | Single flow uses connection ref; dev uses test account, prod uses service account |

---

## 11. Governance and Admin Tools

### 11.1 CoE Starter Kit

| Field | Detail |
|-------|--------|
| **Name** | CoE Starter Kit |
| **Category** | Governance - Toolkit |
| **Description** | Free collection of apps, flows, and dashboards for governing Power Platform |
| **Main use cases** | Inventory, compliance, DLP auditing, maker nurture |
| **Best-fit project types** | All tenants with >5 makers |
| **Required license** | Free download; consumes Power Apps/Automate licenses |
| **Premium/non-premium** | Free (license consumption applies) |
| **Authentication/security model** | Requires Power Platform Admin role |
| **Key limitations and quotas** | Must be in dedicated environment, requires regular updates |
| **Common mistakes** | Installing in production, not updating, not assigning admin |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/guidance/coe/ |
| **Example implementation idea** | Inventory dashboard showing all apps, flows, makers, and compliance status |

### 11.2 Managed Environments

| Field | Detail |
|-------|--------|
| **Name** | Managed Environment |
| **Category** | Governance - Premium Feature |
| **Description** | Premium environment type with built-in governance controls |
| **Main use cases** | Production governance, sharing limits, IP restrictions, insights |
| **Best-fit project types** | Production environments |
| **Required license** | Premium (pricing model varies) |
| **Premium/non-premium** | Premium |
| **Authentication/security model** | Tenant admin |
| **Key limitations and quotas** | Additional cost, some features require maker premium licenses |
| **Common mistakes** | Not enabling on production, not configuring limits |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview |
| **Example implementation idea** | Enable sharing limits so only admins can share apps tenant-wide |

### 11.3 DLP Policies

| Field | Detail |
|-------|--------|
| **Name** | Data Loss Prevention (DLP) Policy |
| **Category** | Governance - Security |
| **Description** | Controls which connectors can be used together and in which environments |
| **Main use cases** | Prevent data leakage, restrict connector usage, enforce security |
| **Best-fit project types** | All enterprise tenants |
| **Required license** | Included in admin center |
| **Premium/non-premium** | Included |
| **Authentication/security model** | Power Platform Admin |
| **Key limitations and quotas** | Can block legitimate use if misconfigured, custom connectors need explicit policy |
| **Common mistakes** | Blocking all business connectors, not including custom connectors in policies |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss |
| **Example implementation idea** | Block personal email connectors (Gmail, personal Outlook) in production env |

---

## 12. Data Migration and Integration Tools

### 12.1 Data Import Wizard

| Field | Detail |
|-------|--------|
| **Name** | Dataverse Import Wizard |
| **Category** | Migration - UI |
| **Description** | Built-in wizard for importing CSV/Excel data into Dataverse |
| **Main use cases** | One-time data loads, small data migrations, lookup data seeding |
| **Best-fit project types** | Small migrations, initial data load |
| **Required license** | Included |
| **Premium/non-premium** | Included |
| **Authentication/security model** | User permissions |
| **Key limitations and quotas** | 32MB file size, not suitable for complex relationships |
| **Common mistakes** | Using for large migrations, not mapping lookup columns correctly |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-import |
| **Example implementation idea** | Import 5000 customer records from Excel to Dataverse |

### 12.2 Dataflows (Power Query Online)

| Field | Detail |
|-------|--------|
| **Name** | Dataflow |
| **Category** | Integration - ETL |
| **Description** | Power Query Online for transforming and loading data into Dataverse or Data Lake |
| **Main use cases** | Scheduled data refresh, data transformation, multi-source consolidation |
| **Best-fit project types** | Data integration, regular data sync |
| **Required license** | Included with Power Apps; premium for Data Lake output |
| **Premium/non-premium** | Partial |
| **Authentication/security model** | Connection credentials |
| **Key limitations and quotas** | Refresh frequency limits, compute time limits |
| **Common mistakes** | Not optimizing queries (slow refresh), not handling errors |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-and-use-dataflows |
| **Example implementation idea** | Daily ETL from 3 Excel sources into unified Dataverse table |

### 12.3 Azure DevOps/GitHub Actions

| Field | Detail |
|-------|--------|
| **Name** | Power Platform Build Tools |
| **Category** | ALM - CI/CD |
| **Description** | Azure DevOps extensions and GitHub Actions for Power Platform deployment |
| **Main use cases** | Full CI/CD, automated testing, branching strategies, release management |
| **Best-fit project types** | Enterprise ALM, team development |
| **Required license** | Azure DevOps/GitHub licenses separate |
| **Premium/non-premium** | Free extensions (consumes Azure resources) |
| **Authentication/security model** | Service principal |
| **Key limitations and quotas** | Requires setup expertise, build agent costs |
| **Common mistakes** | Not using service principals, not pinning pac versions |
| **Current status** | Stable |
| **Microsoft Docs URL** | https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools |
| **Example implementation idea** | GitHub Actions pipeline that deploys on PR merge with solution checker |

---

*End of Tool Catalogue. All licensing and URLs should be verified before client use.*
