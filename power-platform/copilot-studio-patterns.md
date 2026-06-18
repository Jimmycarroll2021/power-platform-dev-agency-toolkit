---
title: "Copilot Studio Patterns"
description: "Patterns for building agents in Copilot Studio"
category: "ai"
tags: ["copilot-studio", "agents", "conversational-ai", "topics"]
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-authentication-azure-ad
  - https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-entities-slot-filling
---

# Copilot Studio Patterns

> **Platform-state note (verified 2026-06-19, baseline 2026-H1):** Copilot Studio
> features evolve quickly. Capability and limit claims below were checked against
> Microsoft Learn on the date above; the per-claim citation links point to the
> primary source. Re-verify before quoting hard limits to a client.

## 1. Agent with Knowledge Sources

Supported knowledge source types are: **public website**, **file upload / documents**,
**SharePoint** (and OneDrive), **Dataverse**, and **enterprise data via Microsoft
Copilot connectors** indexed by Microsoft Search. (Confirmed — [Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio).)
Documented per-source input limits differ by orchestration mode: e.g. public
websites allow 25 sites in **generative** mode vs 4 URLs in **classic** mode; SharePoint
allows 25 URLs (generative) vs 4 (classic); Dataverse is unlimited (generative) vs
2 sources / 15 tables each (classic). (Confirmed — [Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio).)

### Configuration

```
Agent: "Aluma Support Agent"

Knowledge Sources:
├── SharePoint Site:
│   └── https://aluma.sharepoint.com/sites/kb
│   └── Include: All documents in /support folder
│
├── Website:
│   └── https://docs.aluma.example.com
│   └── Refresh: scheduled sync keeps content fresh (background job)
│   └── Limit: generative mode allows 25 website sources per agent;
│       classic mode allows 4 URLs (no documented per-site page cap;
│       "Max pages: 500" in earlier drafts was unverified — confirm
│       against Microsoft Learn)
│
├── Uploaded Files:
│   ├── Product-Manual-v3.pdf
│   ├── FAQ-2024.docx
│   └── Troubleshooting-Guide.pdf
│
└── Dataverse:
    └── Table: Support Articles
    └── Columns: Title, Content, Category, Tags
```

### Generative Answers Node

The generative answers node grounds responses in knowledge sources via
retrieval-augmented generation and returns source citations; the documented
content-moderation default is **High**, with levels from Lowest to Highest, and
the topic-level setting takes precedence at runtime. Citations are part of the
built-in safety/transparency layer and there is no toggle to turn them off.
(Confirmed — [Add a generative answers node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node) and [Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio).)

```
[Topic trigger: "Any matched intent or fallback"]
  │
  ▼
[Generative Answers]
  Source: All knowledge sources
  Content moderation: High
  Response length: Medium
  Number of responses: 3
  │
  ▼
[Condition: Has answer?]
  ├── Yes → [Display answer with source citations]
  └── No  → [Escalate to human]
```

### Grounding Prompt

```
You are a helpful support assistant for Aluma products.

Instructions:
- Answer based ONLY on the provided knowledge sources
- If you cannot find the answer, say "I don't have that information"
- Always include the source document name in your response
- Keep responses under 200 words
- For technical issues, include a link to create a support ticket

Context:
{sources}

Question:
{user_query}
```

---

## 2. Agent with Tools/Actions

### Action Types

Copilot Studio adds capabilities as **tools**. Documented tool types include
agent flow / Power Automate flow, prebuilt connector, custom connector, REST API
(OpenAPI), prompt, Model Context Protocol (MCP), and computer use; the table
below maps the common ones. "HTTP request" here is the **REST API** tool type
(built from an OpenAPI spec). (Confirmed — [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent).)

| Action Type | Use Case | Example |
|-------------|----------|---------|
| Power Automate / agent flow | Complex logic, external APIs | Check order status |
| Custom connector | Third-party integration | CRM lookup |
| REST API (HTTP, OpenAPI) | Direct API call | REST API query |
| Dataverse | Database operations | Create support case |

### Tool Configuration Pattern

```
Tool: "Check Order Status"
  Type: Power Automate flow
  Trigger: "Run a flow from Copilot"
  Input:
    - orderNumber (string, required)
    - email (string, required)
  Output:
    - status (string)
    - trackingUrl (string)
    - estimatedDelivery (date)

Input Sources:
  - orderNumber: Extract from user message (entity)
  - email: Ask user or get from authentication context
```

### Multi-Tool Orchestration

```
[User: "Where is my order?"]
  │
  ▼
[Entity Extraction: Order Number]
  │
  ├──▶ Found: Order #12345
  │    │
  │    ▼
  │   [Tool: Check Order Status]
  │    Input: orderNumber=12345, email=user@example.com
  │    │
  │    ├──▶ Success
  │    │    [Display: "Order #12345 is {status}. 
  │    │             Tracking: {trackingUrl}"]
  │    │    [Suggest: "Need to change delivery address?"]
  │    │
  │    └──▶ Not found
  │         [Display: "I couldn't find that order."]
  │         [Ask: "Can you verify the order number?"]
  │
  └──▶ Not found
       [Ask: "What's your order number?"]
       [Wait for response → retry extraction]
```

---

## 3. Agent Flow with Human Review

### Escalation Flow

```
[Topic: Technical Support]
  │
  ▼
[Generative Answers]
  Question answered?
  │
  ├──▶ Yes → [Confirm resolution]
  │         [Ask: "Did this resolve your issue?"]
  │            ├── Yes → [Close conversation]
  │            └── No  → [Escalate]
  │
  └──▶ No / Low confidence → [Escalate]
            │
            ▼
           [Create support ticket in Dataverse]
           [Send notification to support team]
           [Transfer to live agent]
           [Handoff context summary]
```

### Context Handoff

```
When escalating, include:
{
  "conversationSummary": "User asking about order #12345",
  "triedSolutions": ["Checked order status", "Provided tracking link"],
  "userSentiment": "frustrated",
  "orderNumber": "12345",
  "customerTier": "Gold",
  "suggestedPriority": "High"
}
```

---

## 4. Authentication Patterns

Copilot Studio's documented end-user authentication options are **Authenticate
with Microsoft** (default; Microsoft Entra ID, Teams/M365 only — `User.AccessToken`
not exposed), **No authentication**, and **Authenticate manually** (Microsoft Entra
ID V2 with federated credentials or client secrets, or **Generic OAuth2** for
providers such as Google). The patterns below map onto these modes. (Confirmed —
[Configure user authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication) and [Configure user authentication with Microsoft Entra ID](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-authentication-azure-ad).)

### No Authentication (Public)

```
Use case: General FAQ, public information
Configuration: Authentication = None
Limitations: No user context, no personalized data
```

### Manual Authentication

```
[Ask user for ID/Account number]
  │
  ▼
[Validate against Dataverse]
  │
  ├──▶ Valid → [Store in variable: authContext]
  │         [Personalize responses]
  │
  └──▶ Invalid → [Retry (max 3)]
            [After 3 failures: "Please contact support"]
```

### SSO / Microsoft Entra ID Authentication

(Formerly "Azure Active Directory" — Microsoft renamed it to **Microsoft Entra ID**.
SSO is supported for agents published to Teams 1:1 chats and only with Entra ID.
Confirmed — [Configure user authentication with Microsoft Entra ID](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-authentication-azure-ad).)

```
Configuration:
  Authentication: Required (Authenticate with Microsoft / Entra ID)
  Identity provider: Microsoft Entra ID
  Token variable: UserToken

Available context:
  - User.DisplayName
  - User.Email
  - User.Id
  - Entra ID attributes
```

### OAuth Authentication

(Maps to the **Authenticate manually → Generic OAuth2** service provider, which
supports any OAuth2 identity provider. Confirmed — [Configure user authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication).)

```
[Agent Settings > Security > Authentication]
  OAuth connection:
    - Provider: Custom
    - Authorization URL: https://auth.example.com/authorize
    - Token URL: https://auth.example.com/token
    - Scope: read write

Usage:
  - Access token available as variable
  - Use in HTTP action headers
  - Automatic refresh
```

---

## 5. Variable Management

### Conversation Variables

```
Set variable:
  Name: userOrderNumber
  Type: String
  Value: Extracted entity or user input
  Scope: Topic (reset each conversation)
         / Global (persist across topics)

Usage:
  - {userOrderNumber} in messages
  - As input to actions
  - In conditions
```

### Session State

```
[On conversation start]
  │
  ├──▶ Initialize: context = {}
  ├──▶ Load: user preferences (if authenticated)
  └──▶ Set: language = user's preferred language

[During conversation]
  ├──▶ Track: topics visited
  ├──▶ Track: tools invoked
  └──▶ Track: user satisfaction signals

[On conversation end]
  ├──▶ Save: transcript
  └──▶ Save: outcome (resolved/escalated/abandoned)
```

---

## 6. Entity Extraction

### Built-in Entities

Copilot Studio ships many prebuilt entities (Email, Date and time, Person name,
Phone number, Color, Country, City, Number, Money, and more). Custom entities are
of two types: **Closed list** (the "Choice" row below) and **Regular expression**.
RegEx entities use .NET regex syntax (NLU/CLU); NLU+ uses JavaScript regex syntax.
(Confirmed — [Use entities and slot filling](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-entities-slot-filling).)

| Entity | Examples | Notes |
|--------|----------|-------|
| Number | "123", "forty-five" | Integers and decimals |
| Date and time | "tomorrow", "Jan 15" | Relative and absolute |
| Money | "$100", "a hundred dollars" | Saved as a number |
| String | Free text | Use with validation |
| Closed list ("Choice") | Predefined options | Custom entity, list of values |
| Regular Expression | Custom patterns | Phone, order numbers (.NET regex) |

### Custom Entity Pattern

```
Entity: "Order Number"
  Type: Regular expression
  Pattern: ALU-\d{6}
  Examples:
    - ALU-123456 (valid)
    - ALU-001234 (valid)
    - 123456 (invalid)

Slot filling:
  - Required: Yes
  - Prompt: "What's your order number? (Format: ALU-XXXXXX)"
  - Validation: Must match pattern
  - Retry: Up to 3 times
```

### Entity Routing

```
[User message]
  │
  ▼
[Extract entities]
  │
  ├──▶ Contains "order number" → Route to Order topic
  ├──▶ Contains "refund" → Route to Refund topic
  ├──▶ Contains "technical" → Route to Support topic
  └──▶ No entities match → Generative Answers
```

---

## 7. Topic Design Patterns

### Topic Structure Template

```
Topic: "[CATEGORY] Topic Name"
  Trigger phrases:
    - "phrase one"
    - "phrase two"
    - "phrase three"

  [Trigger node]
    │
    ▼
  [Collect required information]
    │
    ▼
  [Process (tool call or condition)]
    │
    ├──▶ Success path
    │    [Present result]
    │    [Confirm satisfaction]
    │
    └──▶ Error path
         [Log error]
         [Offer alternatives]
         [Escalate if needed]
```

### Fallback Topic

(By default Copilot Studio also creates a **Conversational boosting** system topic
containing a generative answers node wired to your agent-level knowledge sources;
it acts as the fallback when authored topics can't answer. Confirmed —
[Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio).)

```
[Fallback topic (system)]
  │
  ▼
[Generative Answers: Knowledge sources]
  │
  ├──▶ Has answer → [Deliver answer]
  │
  └──▶ No answer
       [Acknowledge: "I don't know that yet"]
       [Log: Unanswered question]
       [Suggest: Contact options]
       [Offer: Create support ticket]
```

### Topic Routing Decision Tree

```
Incoming message
    │
    ├──▶ Matches topic trigger (high confidence)
    │    └── Route to specific topic
    │
    ├──▶ Matches action keyword
    │    └── Route to action topic
    │
    ├──▶ General knowledge question
    │    └── Generative Answers
    │
    └──▶ Unrecognized
         └── Fallback topic
```
