# Copilot Studio Service Desk Agent — Architecture Document

## 1. System Architecture Overview

The Copilot Studio Service Desk Agent is built on a conversational AI architecture that combines declarative topic definitions, generative AI retrieval-augmented generation (RAG) over SharePoint knowledge bases, and Power Automate action integrations. The agent operates as a stateful conversation manager that routes user intents to appropriate topics, tools, or generative answers.

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CHANNEL LAYER                                      │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Microsoft Teams │  │  Web (Custom     │  │  Microsoft 365 Copilot   │  │
│  │                  │  │   Canvas/Direct  │  │  (Extensibility)         │  │
│  │  • Personal Chat │  │   Line)          │  │                          │  │
│  │  • Group Chat    │  │                  │  │  • Declarative agent     │  │
│  │  • Team Channel  │  │  • Embedded in   │  │    manifest              │  │
│  │  • @mention      │  │    SharePoint    │  │  • API plugin            │  │
│  │                  │  │  • Standalone    │  │  • Graph connector       │  │
│  │  Authentication: │  │    web page      │  │                          │  │
│  │  Teams SSO       │  │                  │  │  Authentication:         │  │
│  │                  │  │  Authentication: │  │  Entra ID SSO            │  │
│  │                  │  │  Entra ID /      │  │                          │  │
│  │                  │  │  Anonymous       │  │                          │  │
│  └────────┬─────────┘  └────────┬─────────┘  └───────────┬──────────────┘  │
│           │                     │                        │                  │
│           └─────────────────────┼────────────────────────┘                  │
│                                 ▼                                           │
│                    ┌──────────────────────┐                                 │
│                    │   Copilot Studio     │                                 │
│                    │   Channel Adapter    │                                 │
│                    │                      │                                 │
│                    │  • Unified activity  │                                 │
│                    │    format            │                                 │
│                    │  • Channel-specific  │                                 │
│                    │    rendering         │                                 │
│                    │  • SSO token passing │                                 │
│                    └──────────┬───────────┘                                 │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COPILOT STUDIO CONVERSATION ENGINE                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  1. CONVERSATION ORCHESTRATOR                                        │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │    │
│  │  │   Trigger    │  │   Intent     │  │   Conversation       │    │    │
│  │  │   Phrases    │  │   Routing    │  │   State Manager      │    │    │
│  │  │              │  │              │  │                      │    │    │
│  │  │ • NL trigger │  │ • Topic      │  │ • Session variables  │    │    │
│  │  │   phrases    │  │   matching   │  │ • User context       │    │    │
│  │  │ • Regex      │  │ • Confidence │  │ • Conversation stack │    │    │
│  │  │   patterns   │  │   threshold  │  │ • Entity values      │    │    │
│  │  │ • Entities   │  │ • Fallback   │  │ • Authentication     │    │    │
│  │  │   in utterance│ │   routing    │  │   state              │    │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  2. TOPIC EXECUTION ENGINE                                           │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │    │
│  │  │   Custom     │  │   Conversa-  │  │   Question & Answer  │    │    │
│  │  │   Topics     │  │   tional     │  │   (Generative AI)    │    │    │
│  │  │   (20+)      │  │   Plugins    │  │                      │    │    │
│  │  │              │  │   (Preview)  │  │ • SharePoint RAG     │    │    │
│  │  │ • Password   │  │              │  │ • Public websites    │    │    │
│  │  │   Reset      │  │ • Custom     │  │ • Custom data        │    │    │
│  │  │ • VPN Help   │  │   connectors │  │   sources            │    │    │
│  │  │ • Software   │  │ • API calls  │  │ • GPT-4 generation   │    │    │
│  │  │   Request    │  │ • AI Builder │  │ • Source citations   │    │    │
│  │  │ • Access Req │  │              │  │ • Grounding checks   │    │    │
│  │  │ • Leave Bal  │  │              │  │ • Content filtering  │    │    │
│  │  │ • Printer    │  │              │  │ • Hallucination      │    │    │
│  │  │   Issues     │  │              │  │   guardrails         │    │    │
│  │  │ • Email Help │  │              │  │                      │    │    │
│  │  │ • Case Create│  │              │  │                      │    │    │
│  │  │ • Handoff    │  │              │  │                      │    │    │
│  │  │ • Feedback   │  │              │  │                      │    │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  3. AUTHORIZATION & AUTHENTICATION                                   │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │    │
│  │  │   Entra ID   │  │   SSO /      │  │   User Context       │    │    │
│  │  │   (Azure AD) │  │   OAuth      │  │   Resolution         │    │    │
│  │  │              │  │              │  │                      │    │    │
│  │  │ • User auth  │  │ • Teams SSO  │  │ • User email         │    │    │
│  │  │ • Token      │  │ • OAuth 2.0  │  │ • Display name       │    │    │
│  │  │   validation │  │ • PKCE       │  │ • Department         │    │    │
│  │  │ • Group      │  │ • Token      │  │ • Job title          │    │    │
│  │  │   membership │  │   refresh    │  │ • Manager            │    │    │
│  │  │ • Role       │  │              │  │ • Location           │    │    │
│  │  │   claims     │  │              │  │ • Entitlements       │    │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  4. TOOLS & ACTIONS LAYER                                            │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │    │
│  │  │   Power      │  │   Dataverse  │  │   Microsoft Graph    │    │    │
│  │  │   Automate   │  │   Actions    │  │   Actions            │    │    │
│  │  │   Flows      │  │              │  │                      │    │    │
│  │  │              │  │ • Search KB  │  │ • Get user profile   │    │    │
│  │  │ • Password   │  │ • Create case│  │ • Get manager        │    │    │
│  │  │   reset flow │  │ • Query case │  │ • Get direct reports │    │    │
│  │  │ • Software   │  │   status     │  │ • Check group        │    │    │
│  │  │   req flow   │  │ • Update case│  │   membership         │    │    │
│  │  │ • Access req │  │ • Log metric │  │ • Search users       │    │    │
│  │  │   flow       │  │              │  │ • Get org hierarchy  │    │    │
│  │  │ • Leave bal  │  │              │  │ • Get OOF status     │    │    │
│  │  │   flow       │  │              │  │                      │    │    │
│  │  │ • Printer    │  │              │  │                      │    │    │
│  │  │   troubleshoot│ │              │  │                      │    │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICES LAYER                               │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   SharePoint     │  │   Dataverse      │  │   Power Automate         │  │
│  │   Knowledge      │  │   (Service Mgmt) │  │   (Service Flows)        │  │
│  │   Bases          │  │                  │  │                          │  │
│  │                  │  │ • svc_case       │  │ • svc_Flow_PasswordReset │  │
│  │ • IT KB (80+)    │  │ • svc_kb_article │  │ • svc_Flow_SoftwareReq   │  │
│  │ • HR KB (50+)    │  │ • svc_case_note  │  │ • svc_Flow_AccessReq     │  │
│  │ • Finance KB(20+)│  │ • svc_escalation │  │ • svc_Flow_LeaveBalance  │  │
│  │ • Custom         │  │ • svc_satisfaction│ │ • svc_Flow_PrinterHelp    │  │
│  │   connectors     │  │ • svc_agent_time │  │ • svc_Flow_VPNHelp       │  │
│  │                  │  │ • svc_metrics    │  │ • svc_Flow_EmailHelp     │  │
│  │                  │  │ • svc_knowledge_ │  │ • svc_Flow_CreateCase    │  │
│  │                  │  │   gap            │  │ • svc_Flow_Handoff       │  │
│  │                  │  │                  │  │ • svc_Flow_Feedback      │  │
│  │                  │  │                  │  │ • svc_Flow_KBSearch      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LIVE AGENT HANDOFF & ANALYTICS                            │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Dynamics 365        │  │  Copilot Studio  │  │   Power BI           │  │
│  │  Customer Service    │  │  Analytics       │  │   Dashboard          │  │
│  │  (Live Chat)         │  │  (Built-in)      │  │                      │  │
│  │                      │  │                  │  │ • Volume by channel  │  │
│  │ • Omni-channel       │  │ • Session analytics│ │ • Topic breakdown    │  │
│  │   engagement hub     │  │ • Topic analysis │  │ • Deflection rate    │  │
│  │ • Agent workspace    │  │ • Session        │  │ • CSAT trends        │  │
│  │ • Queue management   │  │   transcripts    │  │ • Resolution paths   │  │
│  │ • Conversation       │  │ • Engagement     │  │ • Escalation reasons │  │
│  │   context handoff    │  │ • KPI dashboard  │  │ • Peak hours         │  │
│  │ • Real-time          │  │ • Satisfaction   │  │ • Agent utilization  │  │
│  │   translation        │  │   scores         │  │ • Cost per session   │  │
│  │ • Supervisor         │  │ • Abandonment    │  │ • ROI metrics        │  │
│  │   dashboard          │  │   rate           │  │                      │  │
│  └──────────────────────┘  └──────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Knowledge Architecture

### 2.1 Knowledge Source Configuration

| Knowledge Source | Type | Document Count | Update Frequency | Description |
|------------------|------|---------------|------------------|-------------|
| IT Knowledge Base | SharePoint Site | 80+ articles | Weekly | Troubleshooting, how-to guides, policies |
| HR Knowledge Base | SharePoint Site | 50+ articles | Monthly | Benefits, policies, procedures |
| Finance Knowledge Base | SharePoint Site | 20+ articles | Quarterly | Expense, procurement, travel policies |
| Public Documentation | Website | N/A | Real-time | Microsoft 365 help, vendor documentation |

### 2.2 Knowledge Base Optimization for Generative AI

For optimal generative answer quality, knowledge articles must follow these guidelines:

1. **Article Structure**: Each article has a clear title, problem statement, step-by-step solution, and related articles
2. **Article Length**: 200-800 words per article (optimal for RAG chunking)
3. **Metadata Tags**: Each article tagged with categories (IT, HR, Finance), subcategories, and keywords
4. **Freshness**: Last reviewed date visible; articles older than 12 months flagged for review
5. **Cross-references**: Related articles linked for follow-up questions
6. **No duplicates**: Consolidate similar articles; remove outdated versions

### 2.3 Generative Answers Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| Content Moderation | High | Filter inappropriate responses in workplace context |
| Grounding | Enabled | Require source citations from knowledge base |
| Confidence Threshold | 0.7 | Only answer when sufficiently confident |
| Fallback Behavior | Escalate to topic | Route to human handoff if no good answer found |
| Character Limit | 1500 | Keep responses concise and readable |
| Max Sources Cited | 3 | Prevent information overload |

## 3. Topic Definitions

### 3.1 Topic Inventory

| Topic | Trigger Phrases | Primary Response | Tool Used |
|-------|----------------|-----------------|-----------|
| Greeting | "Hello", "Hi", "Hey", "Good morning" | Welcome message + capability overview | None |
| Password Reset | "reset password", "forgot password", "can't login" | Trigger svc_Flow_PasswordReset | Power Automate |
| VPN Issues | "VPN not working", "can't connect to VPN", "Cisco AnyConnect" | Troubleshooting guide + reset flow | Power Automate |
| Software Request | "install software", "need app", "software request" | Software request form + approval flow | Power Automate |
| Access Request | "need access", "request permissions", "can't access" | Access request form + org lookup | Power Automate |
| Leave Balance | "vacation days", "PTO balance", "sick leave" | Query leave balance via flow | Power Automate |
| Printer Setup | "printer not working", "add printer", "printing issue" | Step-by-step troubleshooting guide | Generative Answers |
| Email Issues | "email not syncing", "Outlook problem", "can't send email" | Troubleshooting guide + escalation | Generative Answers |
| Teams Issues | "Teams audio not working", "can't share screen", "camera issue" | Troubleshooting guide | Generative Answers |
| HR Policy | "parental leave", "work from home policy", "dress code" | HR policy lookup via Generative Answers | Generative Answers |
| Benefits | "health insurance", "401k", "dental coverage" | Benefits lookup via Generative Answers | Generative Answers |
| Payroll | "when do we get paid", "paycheck question", "direct deposit" | Payroll FAQ via Generative Answers | Generative Answers |
| Case Creation | "create ticket", "submit support request", "need help" | Guided case creation with smart routing | Dataverse |
| Case Status | "ticket status", "where is my request", "check ticket" | Case status lookup | Dataverse |
| Human Handoff | "speak to agent", "talk to person", "escalate" | Transfer to live agent with context | D365 CS |
| Feedback | "feedback", "rate service", "complaint" | CSAT survey + feedback collection | Dataverse |
| Goodbye | "bye", "thank you", "done" | Closing message + CSAT prompt | None |
| Fallback | (no match) | "I didn't understand" + suggestion + handoff option | None |

### 3.2 Topic Conversation Flows

**Password Reset Topic Flow:**
```
User: "I forgot my password"
Agent: "I can help you reset your password. First, I need to verify your identity."
Agent: "Please confirm your work email address."
User: "john.smith@contoso.com"
Agent: [Calls svc_Flow_PasswordReset with email]
Agent: "I've sent a password reset link to john.smith@contoso.com. 
       Please check your email (including spam folder) and click the link 
       within 15 minutes. Do you need help with anything else?"
User: "No, thanks"
Agent: "You're welcome! If you need further assistance, I'm here 24/7."
```

**VPN Troubleshooting Topic Flow:**
```
User: "VPN is not connecting"
Agent: "I'm sorry to hear that. Let me help you troubleshoot. 
       Which VPN client are you using?"
       [Buttons: Cisco AnyConnect | GlobalProtect | Windows VPN | Other]
User: [Clicks Cisco AnyConnect]
Agent: "Let's try these steps in order. Please tell me the result after each step."
Agent: "Step 1: Open Cisco AnyConnect and click 'Disconnect' if it shows 
       'Connected', then wait 10 seconds and click 'Connect'. Did this work?"
User: "No, still not connecting"
Agent: "Step 2: Restart the Cisco AnyConnect service. Press Windows+R, 
       type 'services.msc', find 'Cisco AnyConnect', right-click and select 
       'Restart'. Then try connecting again. Did this work?"
User: "No"
Agent: "Step 3: Let me check if there are any known VPN outages."
Agent: [Calls svc_Flow_VPNHelp]
Agent: "There are no reported outages. I'll create a support ticket for you 
       and connect you with an IT analyst."
Agent: [Triggers Handoff topic]
```

## 4. Tools and Actions

### 4.1 Power Automate Flows (Agent Actions)

| Flow Name | Input | Output | Description |
|-----------|-------|--------|-------------|
| svc_Flow_PasswordReset | UserEmail | Success/Error | Generates password reset link via Azure AD |
| svc_Flow_SoftwareReq | SoftwareName, BusinessJustification, Urgency | TicketNumber | Creates software request ticket |
| svc_Flow_AccessReq | ResourceName, AccessLevel, Duration | TicketNumber | Creates access request ticket |
| svc_Flow_LeaveBalance | UserEmail | BalanceDays, Breakdown | Queries HR system for leave balance |
| svc_Flow_PrinterHelp | PrinterLocation, ErrorDescription | TroubleshootingSteps | Retrieves printer-specific troubleshooting |
| svc_Flow_VPNHelp | VPNClient, ErrorMessage | Status, KnownIssues | Checks VPN service status |
| svc_Flow_EmailHelp | IssueType, EmailClient | TroubleshootingSteps | Retrieves email troubleshooting steps |
| svc_Flow_CreateCase | Title, Description, Category, Priority, Attachments | CaseNumber | Creates Dataverse support case |
| svc_Flow_CaseStatus | CaseNumber | Status, AssignedTo, LastUpdate | Queries case status |
| svc_Flow_Handoff | ConversationId, Context, Category | QueuePosition | Transfers to live agent |
| svc_Flow_Feedback | Rating, Comments, ConversationId | Success | Records satisfaction feedback |
| svc_Flow_KBSearch | Query | Top3Articles | Searches knowledge base |
| svc_Flow_UserLookup | EmailOrName | UserProfile | Looks up user in Azure AD |

### 4.2 Dataverse Tables (Service Management)

**svc_case (Support Case)**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| caseid | Unique Identifier | Yes | Primary key |
| svc_casenumber | Autonumber | Yes | Human-readable case number (e.g., CASE-2024-0001) |
| svc_title | Single Line Text | Yes | Case title |
| svc_description | Multiple Lines Text | Yes | Detailed description |
| svc_category | Choice | Yes | IT-Infrastructure, IT-Software, IT-Access, HR-Benefits, HR-Policy, HR-Payroll, Facilities, Security |
| svc_subcategory | Choice | Yes | Drill-down category |
| svc_priority | Choice | Yes | Low, Medium, High, Critical |
| svc_status | Choice | Yes | New, Assigned, In Progress, Pending User, Resolved, Closed, Cancelled |
| svc_source | Choice | Yes | Agent, Web, Email, Phone, Teams |
| svc_requester | Lookup (User) | Yes | Person who reported |
| svc_assignedto | Lookup (User) | No | Assigned analyst |
| svc_createdbyagent | Boolean | Yes | Whether case was created by the agent |
| svc_conversationid | Single Line Text | No | Copilot Studio conversation ID for context |
| svc_agentconfidence | Decimal | No | AI confidence score when case created |
| svc_resolution | Multiple Lines Text | No | Resolution summary |
| svc_satisfaction | Choice | No | Satisfied, Neutral, Dissatisfied |
| svc_timesresolved | Whole Number | Yes | Number of resolution attempts |

## 5. Security Model

### 5.1 Authentication

| Channel | Auth Method | User Identity |
|---------|-------------|---------------|
| Teams | Teams SSO | Entra ID (Azure AD) |
| Web (internal) | OAuth 2.0 + PKCE | Entra ID |
| M365 Copilot | Implicit (M365 auth) | Entra ID |

### 5.2 Authorization

| Capability | Authenticated User | Guest User | Anonymous |
|------------|-------------------|------------|-----------|
| FAQ answers | Yes | Yes (limited) | Yes (limited) |
| Password reset | Yes | No | No |
| Leave balance | Yes | No | No |
| Case creation | Yes | Yes | No |
| Case status | Yes (own only) | No | No |
| Software request | Yes | No | No |
| Human handoff | Yes | Yes | Yes |

### 5.3 Data Protection

- Conversation transcripts stored encrypted in Copilot Studio
- Case data in Dataverse with RBAC
- No PII in conversation logs (masking enabled)
- Retention: conversation history 90 days, cases 3 years

## 6. Human Handoff Architecture

### 6.1 Handoff Triggers

| Trigger | Condition | Action |
|---------|-----------|--------|
| User request | User explicitly asks for human | Immediate handoff |
| Topic confidence | NLU confidence < 0.5 for 3 consecutive messages | Suggest handoff |
| Case complexity | Case created with Priority=Critical | Immediate handoff |
| Multiple failures | 2+ previous case reopens for same issue | Suggest handoff |
| Sentiment | Negative sentiment detected consistently | Suggest handoff |

### 6.2 Handoff Data Transfer

When handoff occurs, the following context is transferred to the live agent:

1. Full conversation transcript
2. User profile (name, email, department, job title)
3. Identified intent and entities
4. Any case numbers created during conversation
5. Knowledge articles already shared with user
6. Troubleshooting steps already attempted
7. User sentiment trend
8. Authentication status

## 7. Multi-Language Support

| Language | Status | Notes |
|----------|--------|-------|
| English (US) | Primary | Full support |
| Spanish | Phase 2 | 15% of workforce |
| French | Phase 2 | 8% of workforce (Montreal office) |
| German | Phase 3 | 5% of workforce (Frankfurt office) |

Multi-language strategy: Use Copilot Studio's built-in multilingual support with translated topic content and language-specific knowledge bases.

## 8. Monitoring & Analytics

### 8.1 Copilot Studio Built-in Analytics

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Sessions per day | 200+ | < 100 |
| Deflection rate | 70%+ | < 60% |
| CSAT score | 4.2/5 | < 3.8 |
| Abandonment rate | < 10% | > 15% |
| Average session length | 6-8 messages | > 12 messages |
| Resolution time | < 3 min | > 5 min |

### 8.2 Custom Power BI Dashboards

| Dashboard | Audience | Key Metrics |
|-----------|----------|-------------|
| Executive Summary | CIO, CHRO | Cost savings, deflection rate, CSAT, volume trends |
| Agent Performance | Service Desk Manager | Topic resolution rates, handoff reasons, knowledge gaps |
| Knowledge Base Health | Knowledge Manager | Article coverage, freshness, search success rate |
| Employee Experience | HR | Satisfaction by department, peak usage, common issues |

## 9. Scaling Considerations

| Factor | Current | Target (Year 1) |
|--------|---------|-----------------|
| Concurrent users | 50 | 200 |
| Sessions/month | 4,000 | 10,000 |
| Knowledge articles | 150 | 300 |
| Topics | 20 | 40 |
| Languages | 1 | 3 |
| Handoff queues | 2 (IT, HR) | 4 (IT, HR, Finance, Facilities) |

### 9.1 Performance Optimization

1. **Flow caching**: Cache Power Automate flow results for 5 minutes to reduce API calls
2. **Knowledge base indexing**: Ensure SharePoint search is configured for optimal performance
3. **Conversation state**: Minimize variable storage, clear after session ends
4. **Batch operations**: Use Dataverse bulk operations for analytics
