# AI Agent Prompts — Copilot Studio Service Desk Agent

This document contains structured prompts for guiding AI agents (GitHub Copilot, ChatGPT, Claude, or Microsoft Copilot) through building the Copilot Studio Service Desk Agent.

---

## Prompt 1: Agent Topic Design — Password Reset

### Context
You are a Copilot Studio conversation designer building a topic that helps employees reset their passwords securely.

### Prompt
```
Design a complete Copilot Studio topic for password reset assistance with the following requirements:

TOPIC NAME: Password Reset
TRIGGER PHRASES (minimum 15):
- "I forgot my password"
- "reset my password"
- "can't login"
- "password expired"
- "locked out of my account"
- "forgotten password"
- "need to change password"
- "password not working"
- "account locked"
- "reset password please"
- "I can't remember my password"
- "login failed"
- "password reset link"
- "unlock my account"
- "forgot credentials"

CONVERSATION FLOW:

NODE 1 — Trigger & Initial Response
- Welcome message acknowledging the issue
- Ask user to confirm their work email address for verification
- Variable: UserEmail (text)

NODE 2 — Email Validation
- Validate email format (regex: standard email pattern)
- Validate domain (@contoso.com)
- If invalid: ask again (max 3 attempts, then handoff)
- If valid: proceed to verification

NODE 3 — Identity Verification
- Call Power Automate flow svc_Flow_UserLookup with UserEmail
- If user found: proceed to reset
- If user not found: "I couldn't find an account with that email. 
  Please double-check or I can connect you with support."
- If multiple matches: ask for additional info (department, employee ID)

NODE 4 — Password Reset Action
- Call Power Automate flow svc_Flow_PasswordReset with UserEmail
- Flow returns: Success/Error, ResetLink, ExpiryTime
- If success: "I've sent a password reset link to [email]. 
  Please check your inbox and spam folder. The link expires in [time]."
- If error: "I encountered an issue. Let me connect you with IT support." → Handoff

NODE 5 — Follow-up
- Ask: "Were you able to reset your password successfully?"
- [Yes] → "Great! Is there anything else I can help with?"
- [No] → "I'm sorry to hear that. Let me connect you with IT support." → Handoff
- [Need more time] → "No problem. You can always come back if you need help."

NODE 6 — Handoff (if needed)
- Transfer to IT Support queue with context:
  * User email
  * Issue: password reset failed
  * Attempted steps
  * Error details

VARIABLES:
- UserEmail (text) — user's email address
- UserProfile (object) — result from user lookup
- ResetResult (object) — result from password reset flow
- AttemptCount (number) — retry counter

ERROR HANDLING:
- Max 3 attempts for email input
- Flow timeout: handoff after 30 seconds
- Invalid user: handoff option
- Power Automate failure: handoff with error details

DELIVERABLES:
1. Complete topic node-by-node specification
2. All trigger phrases
3. Message text for each node
4. Variable definitions
5. Power Automate flow interface contracts (inputs/outputs)
6. Handoff configuration
7. Test conversation script (10+ test scenarios)
```

---

## Prompt 2: Generative AI Knowledge Integration

### Context
You are configuring Copilot Studio's generative AI capabilities to answer employee questions using SharePoint knowledge bases.

### Prompt
```
Configure Copilot Studio generative answers for an internal service desk agent with these requirements:

KNOWLEDGE SOURCES:
1. SharePoint Site: "IT Knowledge Base" (URL: https://contoso.sharepoint.com/sites/IT-KB)
   - 80+ articles covering: VPN, email, Teams, printers, hardware, software, security
   - Document library: "Articles" with metadata columns
   
2. SharePoint Site: "HR Knowledge Base" (URL: https://contoso.sharepoint.com/sites/HR-KB)
   - 50+ articles covering: benefits, policies, leave, payroll, onboarding
   - Document library: "Policies" with metadata columns

3. SharePoint Site: "Finance Knowledge Base" (URL: https://contoso.sharepoint.com/sites/Finance-KB)
   - 20+ articles covering: expense policy, travel, procurement

CONFIGURATION REQUIREMENTS:

1. GENERATIVE ANSWERS SETUP
   - Enable generative answers feature
   - Add all 3 SharePoint sites as knowledge sources
   - Configure content moderation level: High
   - Set confidence threshold: 0.7
   - Enable source citations
   - Set max response length: 1500 characters

2. CUSTOMIZATION
   - System prompt: Define agent persona and response guidelines
   - Fallback behavior: When no good answer found → route to human handoff topic
   - Content filters: Block responses about salaries of specific individuals, 
     confidential projects, security credentials
   - Grounding: Only use approved knowledge sources (no general web knowledge)

3. SYSTEM PROMPT DESIGN
   Design the system prompt that controls how the generative AI responds:
   - Role: "You are Cosmo, Contoso's virtual support assistant."
   - Tone: "Professional, friendly, concise. Use bullet points for steps."
   - Constraints: "Only answer based on provided knowledge sources. 
     If unsure, say 'I don't have information about that' and offer handoff."
   - Citations: "Always cite the source document name at the end."
   - Safety: "Do not provide information about specific employee salaries, 
     confidential projects, or security-sensitive procedures."

4. TESTING APPROACH
   - 50 test questions across all 3 knowledge bases
   - Edge cases: ambiguous questions, questions outside scope, multi-part questions
   - Evaluation criteria: accuracy, relevance, conciseness, citation correctness

5. MONITORING
   - How to track which questions were answered by generative AI vs topics
   - How to identify knowledge gaps (unanswered questions)
   - How to measure answer quality (thumbs up/down)

DELIVERABLES:
1. Step-by-step generative answers configuration guide
2. Complete system prompt text
3. Knowledge source optimization checklist
4. Test question matrix (50 questions)
5. Quality evaluation rubric
6. Knowledge gap identification process
```

---

## Prompt 3: Power Automate Action Flows

### Context
You are building Power Automate flows that will be called as actions from Copilot Studio topics.

### Prompt
```
Design 5 Power Automate flows that serve as backend actions for the Copilot Studio service desk agent.

FLOW 1: svc_Flow_PasswordReset
Purpose: Initiate Azure AD password reset
Trigger: HTTP Request (from Copilot Studio)
Input: { "userEmail": "string" }
Steps:
1. Parse JSON input
2. Validate user exists in Azure AD (Microsoft Graph)
3. Check if account is enabled (not disabled)
4. Generate password reset link via Graph API
5. Log action to Dataverse audit table
6. Return: { "success": true/false, "message": "string", "expiryMinutes": 15 }
Error handling: Return structured error for each failure mode

FLOW 2: svc_Flow_SoftwareRequest
Purpose: Create software installation request
Trigger: HTTP Request
Input: { "requesterEmail": "string", "softwareName": "string", 
         "businessJustification": "string", "urgency": "Low|Medium|High" }
Steps:
1. Parse input
2. Lookup requester in Azure AD for manager info
3. Check if software is in approved catalog
4. Create Dataverse svc_case record
5. If requires approval: start approval flow to manager
6. Send confirmation email to requester
7. Return: { "caseNumber": "string", "status": "string", "requiresApproval": true/false }

FLOW 3: svc_Flow_LeaveBalance
Purpose: Query employee leave balance
Trigger: HTTP Request
Input: { "userEmail": "string" }
Steps:
1. Parse input
2. Verify user identity (email matches authenticated user)
3. Query HR system/Dataverse for leave balances:
   - Vacation days (total, used, remaining)
   - Sick days (total, used, remaining)
   - Personal days
   - Floating holidays
4. Return: { 
     "vacation": { "total": N, "used": N, "remaining": N },
     "sick": { "total": N, "used": N, "remaining": N },
     "personal": { "total": N, "used": N, "remaining": N }
   }
Security: Only return data for the authenticated user (no lookup of other employees)

FLOW 4: svc_Flow_CreateCase
Purpose: Create support ticket from agent conversation
Trigger: HTTP Request
Input: { 
  "title": "string",
  "description": "string", 
  "category": "string",
  "subcategory": "string",
  "priority": "Low|Medium|High|Critical",
  "requesterEmail": "string",
  "conversationId": "string",
  "conversationSummary": "string",
  "attachments": ["base64"]
}
Steps:
1. Parse and validate input
2. Auto-categorize using keyword matching if category not provided
3. Set priority based on business rules (keywords, requester role)
4. Create Dataverse svc_case record
5. If attachments provided: save to SharePoint, link to case
6. Route to appropriate queue based on category
7. Send notification to assigned queue
8. Return: { "caseNumber": "string", "status": "New", "estimatedResponse": "string" }

FLOW 5: svc_Flow_UserLookup
Purpose: Lookup user information from Azure AD
Trigger: HTTP Request
Input: { "email": "string" }
Steps:
1. Call Microsoft Graph: GET /users/{email}
2. Extract: displayName, department, jobTitle, officeLocation, manager
3. Return: { 
     "found": true/false,
     "displayName": "string",
     "department": "string",
     "jobTitle": "string",
     "location": "string",
     "managerName": "string",
     "managerEmail": "string"
   }

DELIVERABLES:
1. Complete flow designs for all 5 flows
2. JSON input/output schemas
3. Error handling specifications
4. Security/authorization notes
5. Dataverse table references
6. Connection reference requirements
7. Test scenarios for each flow
```

---

## Prompt 4: Testing Conversation Scenarios

### Context
Create comprehensive conversation test scripts for validating the service desk agent.

### Prompt
```
Create a comprehensive test plan for the Copilot Studio Service Desk Agent with conversation test scripts.

TEST CATEGORIES:

CATEGORY 1: Intent Recognition Tests (30 conversations)
Test that the agent correctly identifies intents:
1. "I forgot my password" → Password Reset topic
2. "can't connect to VPN" → VPN Troubleshooting topic
3. "need to install Python" → Software Request topic
4. "how many vacation days do I have left" → Leave Balance topic
5. "printer on floor 3 is broken" → Printer Issues topic
6. "when do we get paid" → Payroll FAQ (generative)
7. "what's the parental leave policy" → HR Policy (generative)
8. "my email won't sync on my phone" → Email Issues topic
9. "create a support ticket" → Case Creation topic
10. "talk to a person" → Human Handoff topic
... (20 more variations including typos, abbreviations, indirect phrasing)

CATEGORY 2: Conversation Flow Tests (20 conversations)
Test complete multi-turn conversations:
1. Password reset: user provides email → verification → reset link → confirmation
2. VPN troubleshooting: symptom → client type → step 1 → fail → step 2 → fail → handoff
3. Software request: app name → justification → urgency → case created → confirmation
4. Case creation: description → category → priority → case number → status check
5. Mixed: password question → resolved → immediate "what about VPN" → context switch

CATEGORY 3: Edge Case Tests (15 conversations)
1. User types gibberish → graceful fallback → handoff offer
2. User asks about competitor/sensitive info → content filter → refusal
3. User asks in Spanish (if supported) → language detection → Spanish response
4. User repeatedly asks same question → agent recognizes repetition → offers handoff
5. User is frustrated (negative sentiment) → empathetic response → handoff offer
6. Auth failure: user requests leave balance but auth fails → error handling
7. Flow timeout: Power Automate takes too long → timeout message → retry/handoff
8. User provides wrong email 3 times → max attempts → handoff
9. User cancels mid-conversation → graceful exit
10. User uploads file during conversation → file handling → continue

CATEGORY 4: Generative AI Tests (20 conversations)
1. Question with direct KB match → accurate answer with citation
2. Question requiring synthesis of multiple articles → combined accurate answer
3. Question not in KB → fallback → handoff
4. Follow-up question referencing previous answer → maintains context
5. Complex question requiring step-by-step → structured response
6. Question with multiple possible meanings → clarifying question

CATEGORY 5: Integration Tests (15 conversations)
1. Password reset flow + Azure AD integration
2. Case creation + Dataverse integration
3. Leave balance + HR system integration
4. Human handoff + Dynamics 365 CS integration
5. Full conversation + transcript logging
6. Feedback collection + Dataverse storage

EVALUATION CRITERIA:
For each test, evaluate:
- Intent recognition: Correct/Incorrect
- Response relevance: Accurate/Inaccurate/Irrelevant
- Conversation flow: Complete/Partial/Broken
- Source citation: Present/Correct (for generative)
- Handoff appropriateness: Timely/Early/Late/Missed
- Tone and persona: Consistent/Inconsistent

DELIVERABLES:
1. 100 test conversation scripts
2. Evaluation rubric
3. Pass/fail criteria
4. Regression test suite
5. Performance benchmarks (response time per conversation)
6. UAT sign-off checklist
```

---

## Prompt 5: Analytics and Continuous Improvement

### Context
Design the analytics and monitoring strategy for the service desk agent.

### Prompt
```
Design a comprehensive analytics and continuous improvement framework for the Copilot Studio Service Desk Agent.

ANALYTICS REQUIREMENTS:

1. COPILOT STUDIO BUILT-IN ANALYTICS
What to monitor:
- Sessions: Total, unique users, per channel, per day/hour
- Engagement: Messages per session, session duration, abandonment rate
- Outcomes: Deflected vs escalated, resolved vs unresolved
- Topics: Most/least triggered, resolution rate per topic
- Satisfaction: CSAT scores, thumbs up/down rates
- Language: Detected languages, translation usage

2. CUSTOM DATAVERSE ANALYTICS
Additional data to capture:
- svc_case records created by agent (volume, category, priority accuracy)
- svc_satisfaction_survey responses (rating, feedback text, by topic)
- svc_knowledge_gap entries (unanswered questions, frequency trends)
- svc_agent_metrics (hourly/daily aggregation)

3. POWER BI DASHBOARDS
Design these dashboards:

Dashboard A: Executive Summary
- Total sessions (today/this week/this month)
- Deflection rate with trend
- CSAT score with trend
- Cost savings estimate (sessions × cost per session)
- Top 10 topics
- Human handoff rate

Dashboard B: Agent Performance Deep Dive
- Intent recognition accuracy by topic
- Topic resolution rates
- Average session duration by topic
- Abandonment points (where users drop off)
- Sentiment analysis over time
- Generative answer quality scores

Dashboard C: Knowledge Base Health
- Most referenced knowledge articles
- Knowledge gaps (unanswered questions) trend
- Article freshness status
- Generative answer accuracy by knowledge source
- Gaps created vs gaps resolved per week

Dashboard D: Service Desk Impact
- Tickets created by agent vs manually
- Ticket routing accuracy
- Agent-created ticket resolution time vs manual tickets
- Analyst workload before/after agent
- Peak hours and capacity planning

4. CONTINUOUS IMPROVEMENT PROCESS

Weekly Review (Knowledge Manager + Agent Admin):
- Review top 20 unanswered questions
- Identify new knowledge article needs
- Review low-performing topics
- Update trigger phrases based on missed intents

Monthly Review (Service Desk Manager + IT):
- Review deflection rate trends
- Analyze human handoff reasons
- Identify topic gaps
- Plan topic updates and new topics
- Review CSAT trends

Quarterly Review (Steering Committee):
- ROI analysis: cost savings, efficiency gains
- Strategic topic roadmap
- Technology updates (new Copilot Studio features)
- Scaling plan: new channels, new departments

DELIVERABLES:
1. Analytics data model (what to capture, where, how)
2. Power BI dashboard designs (visualizations, DAX measures)
3. Data collection flow specifications
4. Weekly/Monthly/Quarterly review templates
5. Knowledge gap identification process
6. Topic improvement playbook
```

---

## Usage Notes

### Recommended AI Tools

| Task | Recommended Tool |
|------|-----------------|
| Topic conversation design | ChatGPT 4 / Claude 3 |
| Power Automate flow design | GitHub Copilot / ChatGPT |
| Test scenario generation | Claude 3 |
| Analytics design | ChatGPT 4 |
| Documentation | Any |

### Important Considerations

> **Warning:** Copilot Studio licensing and generative AI capabilities are evolving rapidly. Verify current feature availability and pricing before implementation.
>
> Generative AI responses should always include human oversight for knowledge base quality. The agent's answers are only as good as the source knowledge.
>
> Test thoroughly with real organizational data (anonymized) before production deployment. NLU accuracy varies significantly based on domain-specific language.
