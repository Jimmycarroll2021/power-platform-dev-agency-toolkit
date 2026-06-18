# Product Requirements Document — Copilot Studio Service Desk Agent

## 1. Document Information

| Field | Value |
|-------|-------|
| Document Name | Copilot Studio Service Desk Agent — PRD |
| Version | 1.0 |
| Date | 2024-03-01 |
| Author | Solution Architecture Team |
| Status | Approved for Development |
| Agent Name | `ContosoServiceAgent` |
| Environment | Production |

---

## 2. Objectives

### 2.1 Business Objectives

1. **Deflect 70% of L1 support inquiries** from human agents to the AI agent
2. **Reduce average first-response time** from 6 hours to under 30 seconds
3. **Improve employee satisfaction** with internal support from 42% to 80%+
4. **Free up 40% of service desk analyst time** currently spent on repetitive L1 tasks
5. **Provide 24/7 support coverage** without after-hours staffing
6. **Improve knowledge article utilization** from <10% to 85%+
7. **Reduce ticket misrouting** from 25% to <5%

### 2.2 Technical Objectives

1. Handle 500+ concurrent sessions with < 3 second response time
2. Achieve 90%+ intent recognition accuracy on top 50 topics
3. Maintain 4.2+ CSAT score
4. Support human handoff with full context transfer in < 10 seconds
5. Provide multi-language support (English primary, Spanish Phase 2)
6. Integrate with 8+ backend systems (SharePoint, Dataverse, Graph, Power Automate)

---

## 3. User Stories

### 3.1 Employee (End User)

| ID | Story | Priority |
|----|-------|----------|
| US-001 | As an employee, I want to ask questions in natural language so that I don't need to search through documentation | Must |
| US-002 | As an employee, I want instant answers 24/7 so that I can resolve issues outside business hours | Must |
| US-003 | As an employee, I want to reset my password through the agent so that I don't need to call the help desk | Must |
| US-004 | As an employee, I want to create support tickets through the agent so that I don't need to fill out forms | Must |
| US-005 | As an employee, I want to check my ticket status through the agent so that I can track progress | Must |
| US-006 | As an employee, I want the agent to understand context from previous messages so that I don't need to repeat myself | Must |
| US-007 | As an employee, I want to escalate to a human agent when needed so that complex issues get proper attention | Must |
| US-008 | As an employee, I want to provide feedback on the agent's responses so that the service improves over time | Should |
| US-009 | As an employee, I want the agent in Teams so that I don't need to switch apps | Must |
| US-010 | As an employee, I want the agent to remember my department/role so that answers are personalized | Should |
| US-011 | As a Spanish-speaking employee, I want to interact in Spanish so that language is not a barrier | Should |
| US-012 | As an employee, I want source citations for answers so that I can verify information | Should |

### 3.2 Service Desk Analyst

| ID | Story | Priority |
|----|-------|----------|
| US-101 | As an analyst, I want to receive full conversation context on handoff so that I don't ask employees to repeat information | Must |
| US-102 | As an analyst, I want to see what troubleshooting steps were already tried so that I don't repeat them | Must |
| US-103 | As an analyst, I want the agent to only escalate truly complex issues so that my workload is manageable | Must |
| US-104 | As an analyst, I want to see real-time agent metrics so that I can report on performance | Should |
| US-105 | As an analyst, I want to suggest new knowledge articles based on agent gaps so that the agent improves | Should |

### 3.3 Knowledge Manager

| ID | Story | Priority |
|----|-------|----------|
| US-201 | As a knowledge manager, I want to see which questions the agent couldn't answer so that I can create new articles | Must |
| US-202 | As a knowledge manager, I want to see which articles are most/least used so that I can prioritize updates | Should |
| US-203 | As a knowledge manager, I want to update articles and see changes reflected immediately in the agent | Must |

### 3.4 Administrator

| ID | Story | Priority |
|----|-------|----------|
| US-301 | As an admin, I want to monitor agent performance metrics so that I can optimize the agent | Must |
| US-302 | As an admin, I want to update topic flows without deploying code so that I can iterate quickly | Must |
| US-303 | As an admin, I want to configure escalation rules so that the right agents get the right cases | Must |
| US-304 | As an admin, I want to manage authentication so that only authorized users access certain features | Must |

---

## 4. Functional Requirements

### 4.1 Conversational Intelligence

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | The agent SHALL support natural language understanding for the top 50 employee inquiries | Must |
| FR-002 | The agent SHALL maintain conversation context across multiple turns (minimum 20 turns) | Must |
| FR-003 | The agent SHALL support context switching (user changes topic mid-conversation) and return to previous topic | Should |
| FR-004 | The agent SHALL detect user sentiment and adjust tone accordingly (empathetic for frustrated users) | Should |
| FR-005 | The agent SHALL provide clarifying questions when intent is ambiguous (confidence < 0.7) | Must |
| FR-006 | The agent SHALL handle typos, abbreviations, and informal language common in workplace chat | Must |
| FR-007 | The agent SHALL support multi-turn dialogues for complex tasks (e.g., troubleshooting with verification steps) | Must |
| FR-008 | The agent SHALL provide estimated wait times when handing off to human agents | Should |

### 4.2 Topic Coverage

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-009 | The agent SHALL handle password reset requests with identity verification | Must |
| FR-010 | The agent SHALL provide VPN troubleshooting guidance with step-by-step verification | Must |
| FR-011 | The agent SHALL process software installation requests with approval routing | Must |
| FR-012 | The agent SHALL handle access/permissions requests with manager approval workflow | Must |
| FR-013 | The agent SHALL provide leave/PTO balance lookups | Must |
| FR-014 | The agent SHALL provide printer troubleshooting guidance | Must |
| FR-015 | The agent SHALL provide email/Outlook troubleshooting guidance | Must |
| FR-016 | The agent SHALL provide Microsoft Teams audio/video troubleshooting | Must |
| FR-017 | The agent SHALL answer HR policy questions via generative AI over knowledge base | Must |
| FR-018 | The agent SHALL answer benefits questions via generative AI over knowledge base | Must |
| FR-019 | The agent SHALL answer payroll questions via generative AI over knowledge base | Should |
| FR-020 | The agent SHALL provide facilities/room booking assistance | Could |

### 4.3 Generative AI (RAG) Integration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-021 | The agent SHALL use generative AI with retrieval-augmented generation over SharePoint knowledge bases | Must |
| FR-022 | The agent SHALL provide source citations for all generative answers | Must |
| FR-023 | The agent SHALL only answer when confidence >= 0.7; otherwise route to human or topic | Must |
| FR-024 | The agent SHALL ground all responses in organizational knowledge (no generic/hallucinated answers) | Must |
| FR-025 | The agent SHALL support follow-up questions about previously cited sources | Should |
| FR-026 | The agent SHALL fall back to human handoff when no relevant knowledge is found | Must |

### 4.4 Case Management Integration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-027 | The agent SHALL create support tickets in Dataverse with full conversation context | Must |
| FR-028 | The agent SHALL auto-categorize tickets based on conversation intent and entities | Must |
| FR-029 | The agent SHALL assign priority based on keywords, user role, and business rules | Must |
| FR-030 | The agent SHALL provide ticket number to user and allow status checking | Must |
| FR-031 | The agent SHALL route tickets to appropriate queues based on category/subcategory | Must |
| FR-032 | The agent SHALL update existing tickets when user provides additional information | Should |

### 4.5 Human Handoff

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-033 | The agent SHALL support explicit handoff when user requests human assistance | Must |
| FR-034 | The agent SHALL support implicit handoff based on confidence thresholds | Must |
| FR-035 | The agent SHALL transfer full conversation transcript to human agent | Must |
| FR-036 | The agent SHALL transfer user context (name, department, role) to human agent | Must |
| FR-037 | The agent SHALL transfer attempted troubleshooting steps to human agent | Must |
| FR-038 | The agent SHALL provide queue position estimate during handoff | Should |
| FR-039 | The agent SHALL summarize the conversation for the human agent | Must |
| FR-040 | The agent SHALL allow human agent to return conversation to bot after resolution | Should |

### 4.6 Authentication & Personalization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-041 | The agent SHALL authenticate users via Teams SSO or Entra ID | Must |
| FR-042 | The agent SHALL personalize responses based on user profile (department, role, location) | Should |
| FR-043 | The agent SHALL restrict sensitive actions (password reset, leave balance) to authenticated users | Must |
| FR-044 | The agent SHALL support guest users with limited capabilities | Should |
| FR-045 | The agent SHALL mask PII in conversation logs and transcripts | Must |

### 4.7 Feedback & Continuous Improvement

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-046 | The agent SHALL collect CSAT feedback after each resolved conversation | Must |
| FR-047 | The agent SHALL collect thumbs up/down feedback on individual responses | Should |
| FR-048 | The agent SHALL log all unanswered questions for knowledge gap analysis | Must |
| FR-049 | The agent SHALL generate weekly reports on top knowledge gaps | Should |
| FR-050 | The agent SHALL support A/B testing of topic variations | Could |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Agent response time | < 3 seconds |
| NFR-002 | Generative answer generation | < 5 seconds |
| NFR-003 | Human handoff transfer time | < 10 seconds |
| NFR-004 | Concurrent session capacity | 500+ |
| NFR-005 | Power Automate flow execution | < 10 seconds |

### 5.2 Quality

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-006 | Intent recognition accuracy (top 50) | > 90% |
| NFR-007 | Generative answer relevance | > 85% thumbs up |
| NFR-008 | CSAT score | > 4.2 / 5.0 |
| NFR-009 | Deflection rate | > 70% |
| NFR-010 | Abandonment rate | < 10% |

### 5.3 Security & Compliance

| ID | Requirement |
|----|-------------|
| NFR-011 | All authentication via Entra ID with SSO |
| NFR-012 | PII masked in conversation logs |
| NFR-013 | Data residency in organization's tenant |
| NFR-014 | Content moderation on all generative outputs |
| NFR-015 | Conversation retention: 90 days |
| NFR-016 | GDPR compliance for EU employees |

---

## 6. Agent Personality & Design

### 6.1 Persona

**Name:** Cosmo (Contoso Support)
**Tone:** Professional, friendly, helpful, concise
**Style:** Conversational but efficient; asks clarifying questions when needed; always offers human handoff

### 6.2 Greeting Behavior

| Scenario | Greeting |
|----------|----------|
| First interaction | "Hello! I'm Cosmo, Contoso's virtual support assistant. I can help with IT issues, HR questions, password resets, and more. What can I help you with today?" |
| Returning user (same day) | "Welcome back! How can I help you today?" |
| Returning user (new day) | "Good [morning/afternoon]! Welcome back. What can I help with today?" |
| After handoff return | "Welcome back! Your previous issue with [topic] was resolved. What else can I help with?" |

### 6.3 Response Guidelines

1. **Be concise**: Keep responses under 1500 characters; use bullet points for steps
2. **Be actionable**: Always provide next steps, not just information
3. **Be honest**: If unsure, say so and offer handoff — never guess
4. **Be contextual**: Reference previous conversation turns
5. **Be respectful**: Use user's name when known; acknowledge frustration
6. **Cite sources**: Always include "Source: [Article Name]" for knowledge base answers
7. **Offer handoff**: Always include "Would you like to speak with a support analyst?" as an option

---

## 7. Data Model

### 7.1 Dataverse Tables

**svc_case (Support Case)**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| caseid | Unique Identifier | Yes | PK |
| svc_casenumber | Autonumber | Yes | CASE-YYYY-NNNN |
| svc_title | Single Line Text | Yes | Case title |
| svc_description | Multiple Lines Text | Yes | Full description |
| svc_category | Choice | Yes | IT-Infrastructure, IT-Software, IT-Access, IT-Email, IT-Teams, HR-Benefits, HR-Policy, HR-Leave, HR-Payroll, Facilities, Security, Other |
| svc_subcategory | Choice | Yes | 30+ subcategories |
| svc_priority | Choice | Yes | Low, Medium, High, Critical |
| svc_status | Choice | Yes | New, Assigned, In Progress, Pending User, Resolved, Closed, Reopened, Cancelled |
| svc_source | Choice | Yes | Agent, Web, Email, Phone, Teams |
| svc_requester | Lookup (User) | Yes | Reporting employee |
| svc_assignedto | Lookup (User) | No | Analyst |
| svc_createdbyagent | Boolean | Yes | Auto-created flag |
| svc_conversationid | Single Line Text | No | Copilot conversation ID |
| svc_agentconfidence | Decimal | No | AI confidence |
| svc_resolution | Multiple Lines Text | No | Resolution notes |
| svc_satisfaction | Choice | No | Satisfied, Neutral, Dissatisfied |
| svc_resolveddate | DateTime | No | Resolution timestamp |
| svc_timesresolved | Whole Number | Yes | Reopen counter |
| svc_relatedkbarticles | Multiple Lines Text | No | KB articles shared |
| svc_handoffreason | Choice | No | UserRequest, LowConfidence, CriticalPriority, Sentiment, ComplexIssue |

**svc_satisfaction_survey (Feedback)**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| surveyid | Unique Identifier | Yes | PK |
| svc_conversationid | Single Line Text | Yes | Conversation reference |
| svc_rating | Whole Number | Yes | 1-5 scale |
| svc_feedback | Multiple Lines Text | No | Free-form feedback |
| svc_topic | Single Line Text | No | Primary topic |
| svc_resolved | Boolean | Yes | Whether issue was resolved |
| svc_useremail | Email | Yes | Respondent |
| svc_submitteddate | DateTime | Yes | Timestamp |

**svc_knowledge_gap (Unanswered Questions)**

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| gapid | Unique Identifier | Yes | PK |
| svc_question | Multiple Lines Text | Yes | Exact user question |
| svc_intentdetected | Single Line Text | No | What intent was identified |
| svc_confidence | Decimal | No | NLU confidence |
| svc_conversationid | Single Line Text | Yes | Reference |
| svc_frequency | Whole Number | Yes | Times asked |
| svc_status | Choice | Yes | New, Under Review, Article Created, Resolved, Ignored |
| svc_assignedto | Lookup (User) | No | Knowledge manager |
| svc_createddate | DateTime | Yes | First occurrence |

---

## 8. UI Requirements

### 8.1 Teams Experience

| Element | Specification |
|---------|--------------|
| Avatar | Contoso-branded bot avatar (professional, friendly) |
| Typing indicator | Show when processing |
| Suggested actions | Yes — after each response |
| Adaptive cards | For forms (ticket creation, feedback) |
| File upload | Support for screenshots and attachments |
| @mention | Support in team channels |

### 8.2 Web Experience

| Element | Specification |
|---------|--------------|
| Embedding | SharePoint web part or standalone |
| Header | Contoso branding with agent name |
| Theme | Match Contoso intranet theme |
| Accessibility | WCAG 2.1 AA compliant |
| Responsive | Mobile + tablet + desktop |

---

## 9. Out of Scope

| Item | Reason | Future |
|------|--------|--------|
| Voice/voicebot integration | Teams calling integration complex | Phase 2 |
| Proactive outreach (notifications) | Requires additional licensing | Phase 2 |
| Complex ITSM workflows (change management) | Requires ServiceNow integration | Phase 2 |
| Predictive support (anticipate issues) | ML model development | Phase 3 |
| Full multi-tenant support | Single tenant only | Phase 3 |
| External customer-facing agent | Security/compliance review needed | Separate project |

---

## 10. Acceptance Criteria

1. Agent correctly answers 90%+ of top 25 FAQ questions
2. Password reset flow completes successfully with identity verification
3. VPN troubleshooting guides users through steps and escalates appropriately
4. Ticket creation captures all required fields and routes correctly
5. Human handoff transfers full context within 10 seconds
6. CSAT score > 4.0 during 2-week pilot with 200 users
7. Deflection rate > 60% during pilot
8. Average response time < 3 seconds
9. Teams integration works on desktop, web, and mobile
10. Knowledge base answers cite sources correctly
11. No PII exposed in conversation logs or analytics
12. Spanish language support functional (if Phase 2 included)
