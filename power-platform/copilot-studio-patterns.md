---
title: "Copilot Studio Patterns"
description: "Patterns for building agents in Copilot Studio"
category: "ai"
tags: ["copilot-studio", "agents", "conversational-ai", "topics"]
---

# Copilot Studio Patterns

## 1. Agent with Knowledge Sources

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
│   └── Refresh: Daily
│   └── Max pages: 500
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

| Action Type | Use Case | Example |
|-------------|----------|---------|
| Power Automate flow | Complex logic, external APIs | Check order status |
| Custom connector | Third-party integration | CRM lookup |
| HTTP request | Direct API call | REST API query |
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

### SSO/Azure AD Authentication

```
Configuration:
  Authentication: Required
  Identity provider: Azure Active Directory
  Token variable: UserToken

Available context:
  - User.DisplayName
  - User.Email
  - User.Id
  - Entra ID attributes
```

### OAuth Authentication

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

| Entity | Examples | Notes |
|--------|----------|-------|
| Number | "123", "forty-five" | Integers and decimals |
| Date | "tomorrow", "Jan 15" | Relative and absolute |
| String | Free text | Use with validation |
| Choice | Predefined options | Exact or fuzzy match |
| Regular Expression | Custom patterns | Phone, order numbers |

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
