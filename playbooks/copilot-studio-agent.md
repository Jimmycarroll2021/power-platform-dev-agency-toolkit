# Copilot Studio Agent Playbook

> **Complexity Rating:** Medium
> **Last Updated:** 2024
> **Applies To:** Microsoft Copilot Studio, Agents, Topics, Generative AI, Power Platform

---

## 1. When to Use Copilot Studio Agents

Use Copilot Studio when:

| Scenario | Why Copilot Studio |
|----------|-------------------|
| Employee self-service (HR, IT) | 24/7 availability, deflects tickets |
| FAQ and knowledge base Q&A | Conversational access to documents |
| Process guidance | Step-by-step process walkthrough |
| Data lookup (Dataverse) | Natural language queries |
| Multi-turn form filling | Conversational data collection |
| Internal helpdesk | Automate common requests |
| Customer-facing support | Scale support operations |
| Triaging and routing | Classify and route to right team |
| Appointment/scheduling | Interactive booking |
| Status checking | Natural language status queries |

### Decision Matrix

| Factor | Copilot Studio | Power Virtual Agent (legacy) | Custom Bot |
|--------|---------------|------------------------------|------------|
| Generative AI needed | Yes (built-in) | No | Requires Azure OpenAI |
| Power Platform integration | Native | Native | Requires SDK |
| Multi-channel | Teams, web, custom | Limited | Full control |
| Citizen developer | Yes | Yes | No (requires code) |
| Custom NLU | No | No | Yes (LUIS, CLU) |
| Complex dialog management | Medium | Medium | Full control |

---

## 2. When NOT to Use Copilot Studio

> **DO NOT use Copilot Studio when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Need fully custom NLU/training | Azure Bot Service + LUIS | Full control over NLU |
| Complex multi-turn state machines | Azure Bot Framework | Code-level control |
| Need on-premises deployment | Azure Bot Service | Cloud-only |
| Very simple Q&A (< 20 questions) | SharePoint Q&A or FAQ page | Overkill |
| Need custom speech recognition | Azure Speech Services | Specialized capabilities |
| Need video/image understanding | Azure AI Vision | Not supported in Copilot Studio |
| High-complexity decision trees | Custom application | Better UX for complex branching |
| Requirement for 100% deterministic responses | Custom app with rules | Generative AI has variability |

---

## 3. Agent Design

### 3.1 Agent Architecture

```
[User Input - Natural Language]
       |
       v
[Copilot Studio]
       |
       +--[Topic Match] --> Specific topic found?
       |   |--YES--> [Execute Topic]
       |   |--NO---> [Generative AI / Fallback]
       |
       +--[Generative AI] --> Use knowledge sources?
       |   |--YES--> [Search knowledge] --> [Generate response]
       |   |--NO---> [Fallback / Escalation]
       |
       +--[Actions] --> Need to do something?
       |   |--YES--> [Call Power Automate] --> [Execute action]
       |   |--NO---> [Return response]
       |
       v
[User receives response]
```

### 3.2 Agent Design Principles

| Principle | Implementation |
|-----------|---------------|
| Scope definition | Define what agent CAN and CANNOT do |
| Clear greeting | Set expectations in welcome message |
| Escalation path | Always provide human handoff option |
| Progressive disclosure | Don't overwhelm, guide step by step |
| Confirmation | Confirm actions before executing |
| Error recovery | Graceful handling of misunderstood inputs |
| Personality | Consistent, professional tone |

### 3.3 Conversation Flow Design

```
[WELCOME]
  "Hello! I'm the Contoso Support Agent. 
   I can help you with:
   - Answering questions about our policies
   - Checking the status of your requests
   - Submitting support tickets
   - Finding documentation
   
   What would you like help with today?"
       |
       v
[UNDERSTAND INTENT]
       |
       +-->[Question about policy] --> [Search Knowledge]
       +-->[Check status] ---------> [Auth + Lookup]
       +-->[Submit ticket] --------> [Collect Info]
       +-->[Find documentation] ---> [Search Knowledge]
       +-->[Unknown] --------------> [Clarify / Fallback]
       |
       v
[RESPOND + CONFIRM SATISFACTION]
       |
       +-->[User satisfied] -------> [Close]
       +-->[User not satisfied] ---> [Escalate to human]
```

---

## 4. Topics

### 4.1 Topic Types

| Topic Type | Use For | Trigger |
|------------|---------|---------|
| Custom topic | Specific business scenarios | Phrases, entities |
| Conversation boosting | Generative AI fallback | Unmatched utterances |
| System topics | Built-in behaviors | Greeting, escalation, error |

### 4.2 Topic Design Best Practices

| Practice | Why |
|----------|-----|
| Keep topics focused | One topic = one intent |
| 10-15 trigger phrases minimum | Better recognition |
| Use entities for variables | Extract structured data |
| End with question or action | Keep conversation moving |
| Always have an exit path | User can leave any time |

### 4.3 Topic Structure Template

```
Topic: [Name]
  |
  +-- Trigger Phrases (10-15):
  |     "phrase one"
  |     "phrase two"
  |     "phrase three"
  |
  +-- [Node 1: Message or Question]
  |     "[Welcome message or question to user]"
  |
  +-- [Node 2: Condition or Action]
  |     Check: [Condition]
  |     |--If YES--> [Node 3A]
  |     |--If NO---> [Node 3B]
  |
  +-- [Node 3A: Success Path]
  |     [Execute action / Provide info]
  |     [Confirm satisfaction]
  |
  +-- [Node 3B: Alternative Path]
  |     [Handle exception]
  |     [Offer escalation]
  |
  +-- [End: Close or Redirect]
        "Is there anything else I can help with?"
```

### 4.4 Trigger Phrase Examples

| Intent | Trigger Phrases |
|--------|----------------|
| Check ticket status | "check my ticket", "where is my request", "ticket status", "check status" |
| Submit new ticket | "create ticket", "new request", "submit issue", "report a problem" |
| Find policy | "what is the policy", "show me guidelines", "where are the rules", "policy document" |
| Reset password | "forgot password", "reset my password", "can't login", "password help" |

---

## 5. Knowledge

### 5.1 Knowledge Sources

| Source Type | Use For | Setup |
|-------------|---------|-------|
| SharePoint | Internal documents, policies | Link SharePoint site |
| OneDrive | Personal/team files | Link OneDrive folder |
| Website | Public documentation | Enter public URL |
| File upload | Specific documents | Upload files directly |
| Custom (Dataverse) | Structured Q&A | Create Q&A pairs |

### 5.2 Knowledge Best Practices

| Practice | Why |
|----------|-----|
| Use structured documents | Clear headings, short paragraphs |
| Update regularly | Stale knowledge gives wrong answers |
| Include FAQ section | Common questions answered directly |
| Use clear language | AI understands better |
| Organize by topic | Better search results |
| Version documents | Track changes, rollback |

### 5.3 Generative AI Configuration

| Setting | Recommendation | Notes |
|---------|---------------|-------|
| Content moderation | High | Reduce inappropriate responses |
| Response length | Medium | Balance detail with conciseness |
| Source citation | Enabled | Show where answer came from |
| Fallback behavior | Specific topic | Route to fallback topic |

---

## 6. Tools (Actions)

### 6.1 Action Types

| Action Type | Use For | Example |
|-------------|---------|---------|
| Power Automate flow | Execute automation | Create ticket, send email |
| HTTP request | Call external API | Check system status |
| Dataverse query | Read/write Dataverse | Get user records |
| Skill (Bot Framework) | Complex logic | Custom code execution |

### 6.2 Creating Power Automate Actions

```
1. In Copilot Studio:
   Actions > Add an action > Create a flow
   
2. Build flow:
   Trigger: Copilot Studio connector
   |
   +--[Parse input parameters]
   +--[Execute business logic]
   +--[Return output parameters]

3. Back in Copilot Studio:
   - Configure input parameters
   - Map output to conversation
   - Test end-to-end
```

### 6.3 Action Input/Output Design

| Aspect | Best Practice |
|--------|--------------|
| Input naming | Descriptive, camelCase: `ticketNumber` |
| Input validation | Validate in flow, return errors |
| Output structure | Simple, flat structure |
| Error handling | Return success flag + message |
| Timeout | Keep under 30 seconds |

---

## 7. Publishing

### 7.1 Publishing Checklist

- [ ] All topics tested with sample conversations
- [ ] Knowledge sources indexed and verified
- [ ] Actions tested end-to-end
- [ ] Authentication configured (if needed)
- [ ] Content moderation settings reviewed
- [ ] Fallback topic handles unknowns gracefully
- [ ] Escalation path tested
- [ ] Welcome message clear and helpful
- [ ] Testing in target channel (Teams, web)
- [ ] Analytics baseline established

### 7.2 Channel Configuration

| Channel | Configuration | Notes |
|---------|--------------|-------|
| Microsoft Teams | Install app, configure scope | Internal use |
| Website (demo) | Embed iframe | Testing |
| Website (production) | Custom canvas, Direct Line | External use |
| Custom app | Direct Line API | Full control |

### 7.3 Publishing Steps

1. Test in Test copilot environment
2. Review analytics and conversation quality
3. Configure production channel
4. Publish to production
5. Monitor first 48 hours closely
6. Iterate based on real conversations

---

## 8. Development Steps

### 8.1 Implementation Checklist

- [ ] Define agent scope and boundaries
- [ ] Identify primary use cases
- [ ] Design conversation flows (happy path + edge cases)
- [ ] Create topic structure
- [ ] Add trigger phrases (10+ per topic)
- [ ] Configure knowledge sources
- [ ] Build Power Automate actions
- [ ] Configure authentication (if needed)
- [ ] Design fallback/escalation
- [ ] Test all conversation paths
- [ ] Configure channels
- [ ] Publish
- [ ] Set up monitoring
- [ ] Plan iteration cycle

---

## 9. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Trigger phrase recognition | Test each phrase | Correct topic triggered |
| Entity extraction | Provide values in utterance | Values extracted correctly |
| Conversation flow | Walk through full topic | All nodes execute correctly |
| Knowledge search | Ask knowledge questions | Relevant answers returned |
| Action execution | Trigger actions | Actions complete successfully |
| Fallback handling | Ask off-topic question | Graceful fallback or escalation |
| Escalation | Request human | Handoff works correctly |
| Multi-turn dialog | Complex conversation | Context maintained |
| Error recovery | Provide invalid input | Agent recovers gracefully |
| Channel test | Test in Teams/web | Renders correctly |

---

## 10. Licensing

| Component | License Required | Cost |
|-----------|-----------------|------|
| Copilot Studio | Copilot Studio license | ~$200/25k messages/month |
| Messages (usage) | Per 25k messages | Bundled with license |
| Power Automate actions | Standard or Premium | Per action type |
| Dataverse (if used) | Power Apps license | If reading/writing Dataverse |
| Teams channel | Microsoft Teams license | For Teams deployment |

> **WARNING:** Copilot Studio is licensed by message volume, not by user. Monitor message consumption carefully. Each user message + bot response counts toward the limit.

---

## 11. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Hallucination (wrong answers) | High | Knowledge source validation, confidence thresholds |
| Off-topic responses | Medium | Content moderation, clear scope |
| Message volume overage | Medium | Monitor usage, plan capacity |
| Knowledge source stale | Medium | Regular review, automated freshness checks |
| User adoption | Medium | Training, clear value proposition |
| Integration complexity | Medium | Start simple, iterate |
| PII in conversations | High | Data handling policies, retention settings |
| Escalation path failure | High | Test thoroughly, monitor |
