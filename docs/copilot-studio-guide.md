# Copilot Studio Comprehensive Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Applies to**: Microsoft Copilot Studio (formerly Power Virtual Agents)
> **Needs verification against current Microsoft docs**: Copilot Studio evolves rapidly. Message pricing, channel availability, and feature names change frequently. MCP support status is particularly fluid.

---

## 1. Architecture Overview

```
+-------------------+     +------------------+     +------------------+
|   User Message    | --> |   Copilot Studio | --> |   Agent Response |
|   (Any channel)   |     |   Orchestration  |     |   (Text/Card/    |
+-------------------+     +------------------+     |    Action)       |
         |                         |               +------------------+
         v                         v
+-------------------+     +------------------+     +------------------+
|   Channels        |     |   Topics/Agents  |     |   Knowledge      |
|   - Teams         |     |   - Classic      |     |   - Documents    |
|   - Web           |     |   - Generative   |     |   - SharePoint   |
|   - Mobile        |     |   - Agent flows  |     |   - Websites     |
|   - Email         |     |   - Actions      |     |   - Dataverse    |
|   - API           |     |                  |     |                  |
+-------------------+     +------------------+     +------------------+
                                   |
                                   v
+-------------------+     +------------------+     +------------------+
|   Power Automate  |     |   Authentication |     |   Analytics      |
|   Actions         |     |   - Azure AD SSO |     |   - Sessions     |
|   - Custom flows  |     |   - OAuth        |     |   - Escalations  |
|   - Pre-built     |     |   - No auth      |     |   - CSAT         |
|                   |     |                  |     |   - Topics       |
+-------------------+     +------------------+     +------------------+
```

---

## 2. Agents vs Topics Architecture

### 2.1 Two Architectures

| Aspect | Classic Topics | Generative Agents |
|--------|---------------|--------------------|
| **Control** | High (explicit paths) | Lower (AI-driven) |
| **Setup time** | Longer (map all paths) | Faster (knowledge-based) |
| **Maintenance** | High (update each topic) | Lower (update knowledge) |
| **Predictability** | High | Medium (can wander) |
| **Best for** | Structured processes, compliance | Knowledge base Q&A, open-ended |
| **Fallback** | Explicit | Generative answers |

### 2.2 Hybrid Approach (Recommended)

```
Use BOTH architectures together:

1. Generative Answers for:
   - General knowledge questions
   - FAQ-style queries
   - Policy lookups
   - Unstructured information

2. Classic Topics for:
   - Structured workflows (reset password, submit ticket)
   - Compliance-required processes
   - Multi-step forms
   - Escalation procedures
   - Integration with backend systems

3. Routing:
   - Copilot Studio attempts topic match first
   - If no topic matches, falls back to generative answers
   - Configure fallback behavior explicitly
```

---

## 3. Generative Answers and Knowledge Sources

### 3.1 Knowledge Source Types

| Source | Setup | Use Case | Limitations |
|--------|-------|----------|-------------|
| **Uploaded documents** | Upload PDF/DOCX | Employee handbooks, policies | Size limits, manual update |
| **SharePoint sites** | Connect URL | Dynamic document libraries | Permission-based access |
| **Public websites** | Enter URLs | Public knowledge base | Public only, crawl frequency |
| **Dataverse** | Select tables | Structured business data | Table selection only |
| **OneDrive** | Connect account | Personal documents | Personal scope |
| **Custom knowledge** | API integration | External knowledge bases | Requires development |

### 3.2 Setting Up Generative Answers

```
Step 1: Knowledge > Add knowledge source
  Option A: Upload files
    - Drag and drop PDFs/DOCXs
    - Max file size: Check current limits (typically 50MB per file)
    - Supported: PDF, DOCX, PPTX, TXT, HTML

  Option B: SharePoint
    - Enter site URL: https://tenant.sharepoint.com/sites/knowledge
    - Copilot Studio crawls libraries
    - Respects SharePoint permissions

  Option C: Public websites
    - Enter URLs (one per line)
    - Specify crawl depth
    - Exclusion patterns for navigation/footer

Step 2: Configure generative answers:
  - Enable content moderation
  - Set response length (concise/balanced/detailed)
  - Enable source citations
  - Configure fallback message

Step 3: Test thoroughly:
  - Ask questions from the knowledge
  - Ask questions NOT in knowledge (should fallback)
  - Test edge cases and ambiguous queries
  - Verify citation accuracy
```

### 3.3 Knowledge Source Best Practices

```
DO:
[+] Keep documents current (version control)
[+] Use clear headings and structure (AI uses them)
[+] Remove outdated documents from knowledge
[+] Test with real user questions
[+] Monitor "no answer found" queries to identify gaps
[+] Use SharePoint for dynamic content (auto-sync)
[+] Organize in topic-specific folders

DO NOT:
[X] Upload documents with conflicting information
[X] Include sensitive data in public knowledge sources
[X] Rely solely on generative answers for compliance topics
[X] Forget to update knowledge when policies change
[X] Mix languages in same knowledge source (unless multi-lingual model)
```

---

## 4. Tools/Actions/Connectors for Agents

### 4.1 Power Automate Actions

```
Setup:
Step 1: Actions > Add action > Create new flow
Step 2: Select trigger: "Copilot Studio" (when copilot calls a flow)
Step 3: Define inputs from copilot:
  - userEmail (Text)
  - issueDescription (Text)
  - priority (Text)

Step 4: Build flow logic:
  - Create ticket in ServiceNow/Dataverse
  - Send notification
  - Query database
  - Call external API

Step 5: Define outputs to copilot:
  - ticketNumber (Text)
  - status (Text)
  - estimatedResolution (Text)

Step 6: Save and publish
Step 7: Add to topic as action node
```

### 4.2 Action Input/Output Pattern

```
Example: "Get User Details" action

Inputs (from Copilot Studio):
  {
    "userEmail": "john.doe@company.com"
  }

Flow logic:
  1. Parse input
  2. Look up user in Dataverse/AD
  3. Get manager, department, phone

Outputs (to Copilot Studio):
  {
    "fullName": "John Doe",
    "department": "IT",
    "managerName": "Jane Smith",
    "phone": "+1-555-1234",
    "found": true
  }

In Copilot topic:
  - Use output variables in messages
  - Branch based on "found" value
  - Handle errors gracefully
```

### 4.3 Connector Availability

```
Copilot Studio can use:
- Power Automate actions (any connector)
- Custom connectors
- HTTP calls (via Power Automate)
- Dataverse operations (native)

Limitations:
- Not all connectors available directly (use Power Automate)
- Some connectors require premium licensing
- Rate limits apply

Licensing Warning:
  Flows triggered from Copilot Studio that use premium connectors
  require appropriate Power Automate licensing for the flow owner.
```

---

## 5. Agent Flows and Workflows

### 5.1 Topic Design Pattern

```
Topic: "Submit IT Support Ticket"

Trigger phrases:
  - "I need IT help"
  - "My computer is broken"
  - "Submit a support ticket"
  - "IT issue"
  - "Technical problem"

Topic flow:
  1. Message: "I'll help you submit an IT support ticket."

  2. Question: "What type of issue are you experiencing?"
     Options: [Hardware, Software, Network, Account, Other]
     Save response in: varIssueType

  3. Question: "Please describe the issue in detail:"
     Input type: Text (multi-line)
     Save response in: varDescription

  4. Condition: varIssueType = "Hardware"
     Yes:
       5a. Question: "What device?"
           Options: [Laptop, Monitor, Printer, Phone, Other]
           Save in: varDevice
     No: Skip

  5. Action: Call Power Automate "Create IT Ticket"
     Inputs:
       - issueType: varIssueType
       - description: varDescription
       - device: varDevice
       - userEmail: System.User.Email

  6. Parse action output
     - ticketNumber: Topic.ticketNumber
     - priority: Topic.priority

  7. Message: "Your ticket #{Topic.ticketNumber} has been created
     with {Topic.priority} priority. You'll receive an email
     confirmation shortly."

  8. End conversation
```

### 5.2 Conversation Variables

```
Variable Types:
  - Text: String values
  - Boolean: True/False
  - Number: Numeric values
  - Record: Complex objects (from actions)
  - Table: Arrays (from actions)

Scope:
  - Topic variables: Local to current topic
  - Global variables: Available across all topics (use sparingly)
  - System variables: Pre-built (User.Name, User.Email, Conversation.Id)

Best practices:
  - Use descriptive names: varTicketNumber (not var1)
  - Clear sensitive data at end of conversation
  - Don't store PII in global variables
  - Use records for complex action outputs
```

---

## 6. Human Review and Escalation

### 6.1 Escalation Patterns

```
Pattern 1: Direct Handoff (Live Agent)
  Condition: User asks for "human" or "agent"
  Action: Transfer to live agent (Dynamics 365 Customer Service)
  Requirements: Omnichannel for Customer Service license

Pattern 2: Ticket Creation
  Condition: Issue cannot be resolved
  Action: Create support ticket, provide ticket number
  Follow-up: Human agent reviews ticket and contacts user

Pattern 3: Email Escalation
  Condition: Complex issue requiring research
  Action: Collect details, send email to support team
  Response: Human responds via email (outside copilot)

Pattern 4: Scheduled Callback
  Condition: Issue needs human but not urgent
  Action: Collect callback number, create callback request
  Follow-up: Human calls user during business hours
```

### 6.2 Configuring Escalation

```
In topic:
  1. Question: "Would you like to speak with a human agent?"
     Options: [Yes, No]

  2. Condition: User selected "Yes"
     Yes:
       3a. Message: "Transferring you to the next available agent..."
       3b. Transfer node:
           - Transfer to: Live agent queue (Dynamics 365)
           - OR: Transfer to: Specific topic
           - Fallback: "All agents are busy. Please try again later."
     No:
       3a. Message: "Is there anything else I can help with?"
```

---

## 7. Authentication and SSO

### 7.1 Authentication Options

| Method | Use Case | Setup Complexity |
|--------|----------|-----------------|
| **No authentication** | Public FAQ, anonymous access | None |
| **Azure AD SSO** | Internal employees, Teams | Medium |
| **OAuth 2.0** | External users, custom identity | High |
| **User sign-in (manual)** | Simple user identification | Low |
| **API token** | Embedded scenarios, API calls | Medium |

### 7.2 Azure AD SSO Setup

```
Step 1: Settings > Security > Authentication
Step 2: Select "Require users to sign in"
Step 3: Select "Azure Active Directory" as provider
Step 4: Configure:
  - Client ID: (from Azure AD app registration)
  - Client Secret: (from Azure AD)
  - Tenant ID: (your Azure AD tenant)
  - Resource URL: https://graph.microsoft.com

Step 5: Test authentication in Test Canvas

Step 6: For Teams channel:
  - SSO is automatic (uses Teams context)
  - No separate sign-in required

Note: User identity available via:
  System.User.Id
  System.User.Email
  System.User.Name
```

### 7.3 Authentication Best Practices

```
DO:
[+] Use SSO for Teams deployment (seamless experience)
[+] Authenticate for any action involving user data
[+] Use System.User.Email to personalize responses
[+] Implement authorization checks in Power Automate flows
[+] Log authentication events for audit

DO NOT:
[X] Allow anonymous access to sensitive operations
[X] Trust client-provided identity without verification
[X] Store user credentials or tokens in variables
[X] Skip auth for actions that modify data
```

---

## 8. Entity Extraction in Conversations

### 8.1 Built-in Entities

```
Available entities (pre-built):
  - Person name: "Contact John Smith"
  - Email address: "john@company.com"
  - Phone number: "555-123-4567"
  - Date/time: "next Tuesday at 3pm"
  - Number: "42" or "one hundred"
  - Organization: "Microsoft"
  - URL: "https://example.com"
  - Money: "$50.00"
  - Percentage: "25%"
  - Geography: "New York", "USA"
```

### 8.2 Custom Entities

```
Creating custom entities:
Step 1: Entities > New entity
Step 2: Entity name: "TicketPriority"
Step 3: Extraction type:
  - Closed list: Pre-defined values [High, Medium, Low]
  - Regex: Pattern-based (e.g., ticket number format)
  - ML learned: Trains from examples

Step 4: Add values/synonyms:
  High: urgent, critical, asap, emergency
  Medium: normal, standard, regular
  Low: whenever, not urgent, minor

Step 5: Use in topic:
  Question: "What's the priority?"
  Entity: TicketPriority
  Save in: varPriority
```

---

## 9. Adaptive Cards

### 9.1 Using Adaptive Cards in Copilot Studio

```
Adaptive Cards provide rich UI in conversations:

Example: Ticket Summary Card
{
  "type": "AdaptiveCard",
  "version": "1.3",
  "body": [
    {
      "type": "TextBlock",
      "text": "Support Ticket Summary",
      "weight": "Bolder",
      "size": "Medium"
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "Ticket #:", "value": "{ticketNumber}" },
        { "title": "Priority:", "value": "{priority}" },
        { "title": "Status:", "value": "{status}" },
        { "title": "Created:", "value": "{createdDate}" }
      ]
    },
    {
      "type": "ActionSet",
      "actions": [
        {
          "type": "Action.OpenUrl",
          "title": "View Ticket",
          "url": "https://crm.company.com/tickets/{ticketNumber}"
        }
      ]
    }
  ]
}

Note: Variable substitution uses {variableName} syntax.
Cards render in Teams, web chat, and some other channels.
```

---

## 10. Publishing Channels

### 10.1 Available Channels

| Channel | Authentication | Best For | Setup Complexity |
|---------|---------------|----------|-----------------|
| **Microsoft Teams** | Automatic SSO | Internal employees | Easy |
| **Web (Demo)** | Optional | Testing, demos | None |
| **Custom Website** | Configurable | Public-facing support | Medium |
| **Mobile App** | Configurable | Branded mobile experience | High |
| **Email** | Email identity | Email-based support | Medium |
| **Facebook** | Facebook auth | Consumer-facing | Medium |
| **Direct Line API** | Custom | Any custom channel | High |
| **Omnichannel** | Dynamics 365 | Customer service center | High |

### 10.2 Teams Deployment

```
Step 1: Channels > Microsoft Teams > Turn on
Step 2: "Availability options":
  - Personal app (1:1 chat with bot)
  - Team channel (group chat)
  - Both

Step 3: "Show to colleagues" (testing) or "Submit for admin approval"

Step 4: If admin approval required:
  - Admin: Teams Admin Center > Manage apps
  - Find app > Allow
  - Users can then add via Apps > Built for your org

Step 5: Pin to Teams sidebar (optional):
  Teams Admin Center > Setup policies > Add app
```

---

## 11. Analytics and Monitoring

### 11.1 Key Metrics to Track

```
Session Analytics:
  - Total sessions: Volume indicator
  - Engagement rate: Sessions with user messages
  - Resolution rate: Sessions without escalation
  - Escalation rate: Sessions transferred to human
  - CSAT score: User satisfaction (if enabled)
  - Abandonment rate: Sessions where user left

Topic Analytics:
  - Topic trigger rate: How often each topic fires
  - Topic completion rate: Successful completions
  - Topic abandonment: Where users drop off
  - Topic resolution: Successful resolutions per topic

Performance:
  - Average session duration
  - Average response time
  - Error rate (failed actions)

Usage by Channel:
  - Teams vs Web vs Other
  - Peak usage times
  - User demographics (if authenticated)
```

### 11.2 Improving Performance

```
Based on analytics:

1. High escalation rate on a topic:
   - Review conversation transcripts
   - Identify where users get stuck
   - Simplify topic flow or add clarifying questions

2. Low resolution rate:
   - Check if knowledge sources are current
   - Verify action flows are working
   - Test edge cases

3. Low CSAT:
   - Enable post-conversation survey
   - Review negative feedback
   - Identify common complaint patterns

4. Abandonment at specific node:
   - Node is confusing or too complex
   - Response time too slow
   - Question is unclear
```

---

## 12. When to Use Copilot Studio vs Alternatives

| Scenario | Copilot Studio | Power Apps | Cloud Flows |
|----------|---------------|------------|-------------|
| FAQ/Knowledge Q&A | YES | No | No |
| Guided form completion | Good | Better (more UI control) | No |
| Multi-step approval | Good | Better | YES |
| Data entry with validation | OK | YES | No |
| Complex business logic | Via flows | Via formulas | YES |
| Rich visualizations | Cards only | Full control | No |
| Mobile-first experience | OK | YES (canvas) | No |
| Real-time collaboration | No | Limited | No |

---

## 13. Licensing

### 13.1 Capacity Model

```
Copilot Studio licensing:
  Base: $200/month for 25,000 messages
  Additional: Message packs available

What counts as a message:
  - User message sent to copilot
  - Copilot response sent to user
  - Internal copilot action (API call, knowledge search)

What does NOT count:
  - Transfer to live agent (after transfer)
  - User messages during agent handoff
  - System messages (sign-in prompts)

Needs verification against current Microsoft docs:
  Message counting rules and pricing changed in 2024.
  Verify current pricing and what's included.
```

### 13.2 Estimating Message Volume

```
Example: IT Helpdesk Copilot

Assumptions:
  - 500 employees
  - Average 2 copilot sessions per employee per month
  - Average 10 messages per session (5 user + 5 copilot)

Calculation:
  500 users x 2 sessions x 10 messages = 10,000 messages/month

  Base pack: 25,000 messages ($200/month)
  Usage: 10,000/25,000 = 40% of capacity
  Cost: $200/month

  Buffer: Add 50% for growth = 15,000 messages
  Still within base pack.

High-volume scenario:
  5,000 employees, 5 sessions/month, 10 messages each
  = 250,000 messages/month
  = 10 base packs = ~$2,000/month
```

---

## 14. MCP Support Status

```
MCP (Model Context Protocol) Support:
  Status: Check current Microsoft documentation

As of early 2025:
  - Microsoft announced Copilot Studio connector ecosystem expansion
  - MCP may be supported for custom tool integration
  - Verify current status before proposing to clients

Needs verification against current Microsoft docs:
  MCP support is rapidly evolving. Check the latest documentation
  for current capabilities and limitations.
```

---

## 15. Common Mistakes

| Mistake | Why It's Bad | Solution |
|---------|-------------|----------|
| No escalation path | Users get stuck, frustrated | Always provide human handoff |
| Over-relying on generative answers | Inconsistent, potentially incorrect | Use topics for critical processes |
| Not testing with real users | Missed edge cases | UAT with target audience |
| Ignoring analytics | Can't improve what you don't measure | Review weekly |
| Not updating knowledge sources | Outdated information | Set review schedule |
| Complex topic flows | Users abandon | Keep to 5-7 nodes per topic |
| No error handling for actions | Silent failures | Always handle flow errors |
| Storing PII in conversation logs | Privacy violation | Clear sensitive data, check retention |
| Not authenticating for sensitive actions | Security risk | Require auth for data access |
| Poor trigger phrases | Topic never fires | Use 10+ varied trigger phrases |
| Ignoring channel differences | Bad UX on some channels | Test on all target channels |
| Not localizing content | Non-English users can't use | Create separate copilots or translate |

---

*End of Copilot Studio Guide. Verify all pricing, channel availability, and feature status against current Microsoft documentation.*
