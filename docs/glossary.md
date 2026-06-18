# Power Platform Glossary

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Comprehensive definitions of 100+ Power Platform terms.

---

## A

**Action** - A single operation in a Power Automate flow (e.g., "Create a row," "Send an email"). Actions follow the trigger and perform the actual work of the workflow.

**Adaptive Card** - A platform-agnostic UI card format (JSON) used to display rich content and interactive elements in Teams, Outlook, and Copilot Studio conversations.

**AI Builder** - A low-code AI service within Power Platform that provides pre-built and custom AI models for document processing, prediction, text analysis, and GPT prompts.

**ALM (Application Lifecycle Management)** - The process of managing Power Platform solutions through development, testing, and production environments using solutions, version control, and deployment pipelines.

**Application User** - A non-human user in Dataverse associated with an Azure AD app registration, used for server-to-server authentication in integrations.

**Approval Action** - A Power Automate action that sends approval requests to users via email or Teams, with Approve/Reject/Custom response options.

**Attended RPA** - Robotic Process Automation where a desktop flow runs on a user's machine while they are present, typically for assisted data entry.

**Azure AD B2C** - Azure Active Directory Business-to-Consumer, an identity service used for external user authentication in Power Pages.

**Azure DevOps** - Microsoft's development collaboration platform used for CI/CD pipelines, work tracking, and source control for Power Platform solutions.

## B

**BPF (Business Process Flow)** - A guided, stage-based process visualization embedded in model-driven apps to ensure users follow consistent steps.

**Business Rule** - A client-side and server-side validation and field manipulation mechanism in Dataverse that requires no code.

**Business Unit (BU)** - A hierarchical security boundary in Dataverse used to segment data and control access across organizational divisions.

## C

**Canvas App** - A Power Apps application built with pixel-perfect, drag-and-drop design using Power Fx formulas. Ideal for custom mobile experiences.

**CDS (Common Data Service)** - The former name for Microsoft Dataverse. Some legacy documentation may still use this term.

**Child Flow** - A reusable flow called by another (parent) flow. Enables modular design and code reuse across multiple workflows.

**Choice Column** - A Dataverse column type that presents a dropdown of predefined values. Formerly called "Option Set."

**Cloud Flow** - A Power Automate workflow that runs in Microsoft's cloud infrastructure, triggered by events, schedules, or manual actions.

**CoE (Center of Excellence)** - A governance framework and starter kit for managing Power Platform adoption, including inventory, compliance, and best practices.

**Component Library** - A repository of reusable canvas app components (headers, navigation, controls) that can be shared across multiple apps.

**Component (PCF)** - A custom code control built with TypeScript/React using the Power Apps Component Framework for use in canvas and model-driven apps.

**Conditional Access** - Azure AD policies that enforce security conditions (MFA, device compliance, location) before granting access to Power Platform.

**Connection** - The authenticated link between Power Platform and an external service (e.g., a user's SharePoint connection).

**Connection Reference** - An abstraction layer in solutions that separates the connection definition from the flow/app, enabling ALM across environments.

**Connector** - A pre-built or custom integration adapter that enables Power Platform to communicate with external services and APIs.

**Copilot Studio** - Microsoft's low-code conversational AI platform for building custom agents (chatbots) with topic-based authoring and generative answers.

**Custom API** - A user-defined API endpoint in Dataverse with typed parameters, used to encapsulate complex server-side operations.

**Custom Connector** - A connector built from an OpenAPI definition to integrate Power Platform with any REST API not covered by certified connectors.

**Custom Page** - A canvas app page embedded within a model-driven app, combining custom UI with Dataverse's native security model.

## D

**Daily Authenticated User (DAU)** - A licensing metric for Power Pages counting unique users who sign in per day.

**Dataflow** - Power Query Online for transforming and loading data into Dataverse or Azure Data Lake on a scheduled basis.

**Data Loss Prevention (DLP)** - Policies that control which connectors can be used together and in which environments to prevent data exfiltration.

**Dataverse** - Microsoft's cloud-native data platform for Power Platform, providing tables, relationships, business rules, and a comprehensive security model.

**Dataverse View** - A filtered, sorted presentation of table data displayed in model-driven apps and used by Power BI.

**Delegation** - The ability of a canvas app to push query operations to the data source rather than processing locally, avoiding the 2000-row limit.

**Desktop Flow** - A Power Automate RPA workflow that automates UI interactions on Windows applications and websites.

**Dual-Write** - A bidirectional data synchronization feature between Dataverse and Dynamics 365 Finance and Operations.

**Dynamics 365** - Microsoft's suite of business applications (Sales, Customer Service, etc.) built on the Dataverse platform.

## E

**Elastic Table** - A Dataverse table type optimized for high-volume, short-lived data with horizontal scaling capabilities.

**Entity** - The legacy term for a Dataverse table. Still used in some APIs and documentation.

**Environment** - A dedicated space in Power Platform containing apps, flows, data, and settings, isolated from other environments.

**Environment Variable** - A key-value pair stored in a solution for environment-specific configuration (URLs, feature flags, thresholds).

**Escalation** - The process of transferring a conversation from an AI agent to a human agent in Copilot Studio, or routing issues to higher support tiers.

**Event Grid** - An Azure service for event-driven architectures that can trigger Power Automate flows based on Azure resource events.

## F

**Field Security** - Column-level security in Dataverse that restricts Read/Update/Create access to specific fields independently of table permissions.

**FetchXML** - Dataverse's XML-based query language used in reports, views, and code to retrieve data with filters, sorting, and joins.

**Flow Run** - A single execution instance of a Power Automate flow, including all actions and their results.

**Flow Run History** - The log of all executions for a flow, showing success/failure status, duration, and input/output data.

**Formula Column** - A Dataverse column whose value is calculated from a formula using other columns in the same table. Read-only.

## G

**Gateway (On-Premises Data Gateway)** - A Windows service that bridges cloud Power Platform services with on-premises data sources like SQL Server and SharePoint.

**Generative Answers** - A Copilot Studio feature that uses AI to generate responses from uploaded documents, SharePoint sites, and web content.

**GitHub Actions** - CI/CD automation workflows that can be used to deploy Power Platform solutions using the Power Platform Build Tools.

**Global Discovery Service** - The API endpoint that returns the list of Dataverse environments available to an authenticated user.

**GPT Prompt** - An AI Builder feature that uses generative AI (GPT) to process text in Power Automate flows and Power Apps based on custom prompts.

## H

**Hierarchy Security** - A Dataverse security model where managers can access their direct reports' records, configurable to multiple management levels.

**HTTP Action** - A Power Automate action that makes HTTP requests to REST APIs. Requires a premium license.

**HTTP Trigger** - A Power Automate trigger that starts a flow when an HTTP request is received, enabling webhook scenarios.

**Hybrid Identity** - An Azure AD configuration where on-premises Active Directory synchronizes with cloud Azure AD, enabling single sign-on.

## I

**Implicit Connection** - A user-based connection in canvas apps that runs in the context of the logged-in user.

**Independent Publisher Connector** - A connector built by third parties and published to the Power Platform connector gallery without Microsoft certification.

**Instant Flow** - A Power Automate flow triggered manually by a button click, Power Apps action, or API call.

**Integration** - The connection of Power Platform with external systems, services, or APIs to exchange data and trigger actions.

## J

## K

**Key Vault** - Azure Key Vault, used to securely store secrets, certificates, and keys referenced by Power Platform and Azure services.

**Knowledge Source** - Content (documents, websites, SharePoint) used by Copilot Studio's generative answers to provide AI-generated responses.

## L

**Layering (Solution)** - The stacking mechanism where managed solutions overlay each other, with the topmost layer determining the final component state.

**Least Privilege** - The security principle of granting users only the minimum permissions necessary to perform their tasks.

**License** - The Microsoft subscription granting access to Power Platform features and services. Types include per-user, per-app, and capacity-based.

**Liquid** - A templating language used in Power Pages to dynamically display data, create loops, and implement conditional logic in web pages.

**Lookup Column** - A Dataverse column type that creates a relationship to another table, storing the GUID of the related record.

**Low-Code** - An application development approach using visual tools and minimal hand-coding, making development accessible to non-professional developers.

## M

**Managed Environment** - A premium environment type with built-in governance features including sharing limits, IP restrictions, and insights.

**Managed Solution** - A packaged, locked solution exported from development and imported into test/production environments. Components cannot be edited.

**Message (Copilot Studio)** - A billing unit for Copilot Studio consumption, counting user messages, bot responses, and internal actions.

**Microsoft Graph** - The unified API for Microsoft 365 services, providing access to users, groups, emails, calendars, Teams, and SharePoint.

**Model-Driven App** - A Power Apps application auto-generated from Dataverse table metadata, featuring forms, views, charts, and dashboards.

**MFA (Multi-Factor Authentication)** - An authentication method requiring users to provide two or more verification factors to access resources.

## N

**Non-Delegable** - A query or function that cannot be pushed to the data source for processing, forcing local processing with a 2000-row limit in canvas apps.

## O

**OAuth** - An open authentication standard used by connectors to enable secure, delegated access to external services without sharing passwords.

**ODATA** - The Open Data Protocol used by Dataverse Web API for querying and manipulating data via RESTful endpoints.

**Offline** - Canvas app capability that allows users to work without internet connectivity, syncing data when connection is restored.

**On-Premises Data Gateway** - See "Gateway."

**Owner** - The user or team assigned to a Dataverse record, controlling access based on security role scope settings.

**Owner Team** - A Dataverse team that owns records, with all members sharing the same access level to those records.

## P

**pac CLI** - The Power Platform Command Line Interface, a unified tool for ALM operations, solution management, and PCF development.

**Patch** - A small, incremental update to a managed solution containing only changed components, used for hotfixes.

**PCF (Power Apps Component Framework)** - A framework for building custom code components (React/TypeScript) for use in canvas and model-driven apps.

**Per Flow License** - A Power Automate licensing option that assigns dedicated capacity to specific flows, eliminating per-user license requirements.

**Per User License** - A Power Automate/Power Apps licensing option granting an individual user access to all premium features.

**Pipeline (Power Platform)** - A native, low-code CI/CD feature for deploying solutions between environments, requiring Managed Environments.

**Platform Admin** - The administrator role in Power Platform responsible for environment management, DLP policies, licensing, and governance.

**Plugin** - C# code that executes server-side in response to Dataverse data operations (Create, Update, Delete, Retrieve).

**Plugin Trace Log** - A Dataverse table that stores tracing output from plugin execution for debugging purposes.

**Portal** - See "Power Pages."

**Power Apps** - Microsoft's low-code application development platform for building canvas, model-driven, and custom page applications.

**Power Automate** - Microsoft's workflow automation service for creating cloud flows, desktop flows, and business process flows.

**Power BI** - Microsoft's business intelligence and data visualization platform, integrated with Power Platform for embedded analytics.

**Power Fx** - The low-code formula language used in canvas apps, similar to Excel formulas, for expressing logic and data operations.

**Power Pages** - Microsoft's platform for building secure, external-facing websites and portals integrated with Dataverse.

**Power Platform** - Microsoft's unified low-code platform comprising Power Apps, Power Automate, Power BI, Dataverse, AI Builder, and Copilot Studio.

**Premium Connector** - A connector requiring a paid Power Automate or Power Apps license to use. Includes Dataverse, SQL Server, HTTP, and custom connectors.

**Process Mining** - An analysis technique that uses event logs to discover, monitor, and improve real business processes.

## Q

**Queue** - A Dataverse feature for routing records (typically cases or tasks) to teams or individuals for work assignment.

**Quick View Form** - A compact, read-only form in model-driven apps that displays related record data inline on a parent form.

## R

**RBAC (Role-Based Access Control)** - Access control based on security roles assigned to users, determining their permissions in Dataverse.

**RPA (Robotic Process Automation)** - Technology that automates UI interactions on desktop applications, implemented in Power Automate as desktop flows.

**Recurrence Trigger** - A Power Automate trigger that runs flows on a scheduled interval (e.g., every hour, daily at 9 AM).

**Responsive Design** - Canvas app design patterns that adapt layout and controls to different screen sizes and orientations.

**Retry Policy** - Configuration on Power Automate actions that automatically retries failed operations with configurable intervals and counts.

**RLS (Row-Level Security)** - A Power BI feature that restricts data access at the row level based on user identity and role membership.

**Rollup Column** - A Dataverse column that aggregates values from child records (SUM, COUNT, MIN, MAX, AVG), calculated asynchronously.

**Run-Only Permission** - A sharing setting for flows that allows users to trigger a flow without being able to edit it.

## S

**Sandbox** - A non-production Power Platform environment type used for development, testing, and training. Cannot be used for live operations.

**Scheduled Flow** - A Power Automate flow triggered by a recurrence pattern (time-based) rather than an event.

**Scope** - A Power Automate container action used to group actions together and implement try/catch/finally error handling patterns.

**Security Role** - A collection of permissions in Dataverse defining what tables, fields, and features a user can access and what operations they can perform.

**Seeded License** - A Power Automate license included with Microsoft 365 that only supports standard connectors, not premium ones.

**Service Account** - A dedicated, non-human user account used for running flows, owning apps, and system-to-system authentication.

**Service Bus** - An Azure messaging service used for reliable, asynchronous communication between distributed systems and Power Platform.

**SharePoint** - Microsoft's collaboration and document management platform, commonly used as a data source and document store with Power Platform.

**Site Map** - The navigation structure definition for a model-driven app, organizing tables, dashboards, and web resources into areas and groups.

**Solution** - A package containing Power Platform components (apps, flows, tables, etc.) for ALM, deployment, and version control.

**Solution Checker** - A tool that validates Power Platform solutions for code quality, security issues, and best practice compliance.

**Solution-Aware** - A flow or component that is stored within a Dataverse solution, enabling ALM and environment portability.

**Sovereign Cloud** - An isolated Microsoft cloud instance (e.g., GCC, China) with separate infrastructure and compliance requirements.

**Standard Connector** - A Power Automate connector included with Microsoft 365 licenses that does not require a premium license.

**Subflow** - A reusable section of a desktop flow that can be called from multiple places within the same flow.

**Synapse Link** - A feature that replicates Dataverse data to Azure Synapse Analytics and Data Lake for near real-time analytics.

## T

**Table (Dataverse)** - A container for structured data in Dataverse, equivalent to a database table, with columns, relationships, and business rules.

**Table Permission** - Security settings in Power Pages that control which Dataverse records portal users can view or edit.

**Team** - A group of users in Dataverse used for record ownership, access control, and collaborative work.

**Tenant** - The top-level organization boundary in Microsoft 365/Azure AD, containing all environments, users, and licenses.

**Trigger** - The event that starts a Power Automate flow (e.g., "When a row is created," "On a schedule," "When an email arrives").

**Trigger Condition** - A filter applied to a flow trigger to prevent unnecessary runs when specific criteria are not met.

## U

**Unattended RPA** - Desktop flow automation that runs on a dedicated machine without human supervision, typically on a schedule or trigger.

**Unmanaged Solution** - A solution used in development where components can be freely edited. Serves as the source of truth for ALM.

**Upgrade (Solution)** - The process of replacing a managed solution with a newer version, incorporating all patches and updates.

**User Principal Name (UPN)** - The email-style identifier for a Microsoft 365/Azure AD user (e.g., user@company.com).

## V

**Variable** - A named storage location in Power Automate (Initialize Variable action) or Power Apps (Set/UpdateContext) for storing and manipulating data.

**Version Control** - The practice of tracking and managing changes to solution source code, typically using Git with unpacked solutions.

**Virtual Table** - A Dataverse table that surfaces data from an external source without copying it into Dataverse, appearing as a native table.

**View** - See "Dataverse View."

## W

**Web API** - The OData v4 REST API for Dataverse, enabling external applications to perform CRUD operations on data.

**Web Resource** - A file (HTML, JavaScript, CSS, image) stored in Dataverse for use in model-driven apps and forms.

**Web Role** - A security role in Power Pages that defines what authenticated or anonymous portal users can access and do.

**Webhook** - An HTTP callback mechanism where an external system sends real-time event notifications to a Power Automate HTTP trigger.

**Workflow (Classic)** - The legacy, deprecated server-side workflow engine in Dataverse. Replaced by Power Automate cloud flows.

## X

**XRM (Extensible Relationship Management)** - The underlying framework of Dataverse that enables building any relationship-based business application.

## Y

## Z

---

## Acronyms Quick Reference

| Acronym | Full Term |
|---------|-----------|
| ALM | Application Lifecycle Management |
| API | Application Programming Interface |
| BPF | Business Process Flow |
| BU | Business Unit |
| CD | Continuous Deployment |
| CI | Continuous Integration |
| CLI | Command Line Interface |
| CMK | Customer-Managed Key |
| CoE | Center of Excellence |
| CRUD | Create, Read, Update, Delete |
| DAU | Daily Authenticated User |
| DLP | Data Loss Prevention |
| FO | Finance and Operations (Dynamics 365) |
| GCC | Government Community Cloud |
| GPT | Generative Pre-trained Transformer |
| GUID | Globally Unique Identifier |
| HA | High Availability |
| HTTP | Hypertext Transfer Protocol |
| IP | Internet Protocol / Intellectual Property |
| JS | JavaScript |
| KB | Knowledge Base |
| L1/L2/L3 | Support Level 1/2/3 |
| MFA | Multi-Factor Authentication |
| OData | Open Data Protocol |
| OAuth | Open Authorization |
| PCF | Power Apps Component Framework |
| PII | Personally Identifiable Information |
| REST | Representational State Transfer |
| RLS | Row-Level Security |
| RPA | Robotic Process Automation |
| RTA | Real-Time Automation |
| SaaS | Software as a Service |
| SLA | Service Level Agreement |
| SOW | Statement of Work |
| SPN | Service Principal Name |
| SSO | Single Sign-On |
| TLS | Transport Layer Security |
| UAT | User Acceptance Testing |
| UPN | User Principal Name |
| VM | Virtual Machine |
| XRM | Extensible Relationship Management |

---

*End of Glossary. Terms and definitions should be verified against current Microsoft documentation as naming conventions evolve.*
