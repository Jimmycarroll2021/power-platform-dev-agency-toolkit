# Risk Register — Copilot Studio Service Desk Agent

## Risk Register Summary

| Category | Count | High Severity | Medium Severity | Low Severity |
|----------|-------|--------------|-----------------|--------------|
| Technical Risks | 7 | 3 | 3 | 1 |
| Business Risks | 5 | 2 | 2 | 1 |
| Operational Risks | 5 | 2 | 2 | 1 |
| Compliance Risks | 3 | 1 | 1 | 1 |
| **Total** | **20** | **8** | **8** | **4** |

---

## 1. Technical Risks

### RISK-T001: AI Hallucination and Incorrect Answers

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T001 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | High (60%) |
| **Impact** | Critical — Generative AI may provide incorrect, outdated, or fabricated answers that mislead employees or cause them to take wrong actions. |

**Description:**
Copilot Studio's generative AI uses retrieval-augmented generation (RAG) over SharePoint knowledge bases. However, it can still: (a) misinterpret knowledge base content, (b) synthesize conflicting information incorrectly, (c) "hallucinate" steps or details not in the source, (d) provide outdated information if the KB is stale. For IT procedures, wrong answers can cause system issues; for HR policy, wrong answers can create legal liability.

**Mitigation Strategies:**
1. Set confidence threshold to 0.7 (only answer when sufficiently confident)
2. Require source citations for all generative answers
3. Implement "grounding" — restrict answers to approved knowledge sources only
4. Set content moderation to "High" to filter problematic outputs
5. Disable general web knowledge; only use organizational KB
6. Implement human review process for generative answer quality before go-live
7. Monitor thumbs up/down feedback and review all negative feedback within 24 hours
8. Include disclaimer: "This information is based on [Source]. For critical decisions, please verify with [department]."
9. Weekly audit of 50 random generative responses for accuracy

**Contingency Plan:**
If hallucination rate exceeds 10%, temporarily reduce generative AI scope to only the most reliable knowledge sources and expand human handoff for ambiguous queries.

**Owner:** AI Ethics Lead + Knowledge Manager
**Review Date:** Daily during pilot, weekly in production

---

### RISK-T002: Knowledge Base Freshness and Accuracy

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T002 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | High (65%) |
| **Impact** | High — The agent's answers are only as good as the knowledge base. Outdated or incorrect KB articles will produce wrong answers even with perfect AI. |

**Description:**
Organizations often have knowledge bases with: (a) outdated procedures (e.g., VPN instructions for old client version), (b) duplicate/conflicting articles, (c) articles written for IT staff not end users, (d) missing articles for common questions, (e) articles with broken links or screenshots from old UI versions. If these issues aren't addressed before agent deployment, the agent will confidently provide wrong information.

**Mitigation Strategies:**
1. Pre-deployment KB audit: review all 150+ articles for accuracy and freshness
2. Establish KB governance: article owners, review cadence (quarterly), freshness metadata
3. Archive articles older than 12 months that haven't been reviewed
4. Standardize article format: problem, steps, verification, related articles
5. Tag articles with "last verified" date and "next review" date
6. Identify gaps: compare top 50 employee questions to available articles
7. Create missing articles before go-live (not after)
8. Implement article feedback: employees can flag outdated content
9. Monthly KB health report: stale articles, gaps, employee feedback

**Contingency Plan:**
If KB quality cannot be improved before go-live, reduce generative AI scope to only the highest-quality articles and use structured topics for the rest.

**Owner:** Knowledge Manager + Department SMEs
**Review Date:** Weekly during KB prep, monthly ongoing

---

### RISK-T003: Tool/Action Flow Failures

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T003 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | Medium (35%) |
| **Impact** | High — Power Automate flows that perform actions (password reset, case creation) may fail due to API errors, permissions, or downstream system issues. |

**Description:**
The agent relies on Power Automate flows for backend actions. If svc_Flow_PasswordReset fails because the Azure AD Graph API is throttled, the agent cannot help the user. If svc_Flow_CreateCase fails, tickets are lost. These failures create user frustration and undermine trust in the agent.

**Mitigation Strategies:**
1. Implement robust error handling in all flows: structured error responses
2. Add retry logic (3 attempts with exponential backoff) on all API calls
3. Set flow timeout to 30 seconds; agent shows "working on it" message during wait
4. Return structured error codes so agent can give meaningful error messages
5. Monitor flow success rates with alerts on >5% failure
6. Have fallback paths: if password reset flow fails, offer to create ticket
7. Test all flows under load before go-live
8. Service Principal authentication for Graph API (not user-delegated)

**Contingency Plan:**
If critical flows fail repeatedly, agent automatically offers human handoff and creates a high-priority ticket for the integration team.

**Owner:** Integration Developer
**Review Date:** Daily during pilot

---

### RISK-T004: Intent Recognition Accuracy Insufficient

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T004 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (40%) |
| **Impact** | Medium — If NLU doesn't correctly identify user intent, the agent will route to wrong topics or fall back to generic responses. |

**Description:**
Copilot Studio's NLU may struggle with: (a) domain-specific terminology, (b) typos and misspellings, (c) ambiguous phrasing ("I can't get in" could mean password, VPN, or door access), (d) users mixing multiple issues in one message, (e) regional language variations.

**Mitigation Strategies:**
1. Minimum 15 trigger phrases per topic (diverse phrasing)
2. Include common typos and abbreviations in trigger phrases
3. Use entity extraction to disambiguate ("get in" + "password" entity → password topic)
4. Implement clarifying questions for ambiguous intents
5. Monitor "fallback" topic triggers to identify missed intents
6. Weekly review of conversation transcripts to find misrouted conversations
7. Add missed phrases to trigger phrase sets
8. Consider Power Automate AI Builder for custom intent classification if needed

**Contingency Plan:**
If accuracy stays below 80% after tuning, add a "disambiguation" topic that asks clarifying questions before routing.

**Owner:** Copilot Studio Developer
**Review Date:** Weekly

---

### RISK-T005: Human Handoff Technical Failures

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T005 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (25%) |
| **Impact** | Medium — If handoff to live agents fails, frustrated users are stuck with no resolution path. |

**Description:**
Human handoff depends on Dynamics 365 Customer Service or a custom handoff mechanism. Failures can occur due to: (a) D365 CS service outage, (b) queue misconfiguration, (c) no agents available in target queue, (d) context transfer timeout, (e) authentication issues between Copilot Studio and D365.

**Mitigation Strategies:**
1. Test handoff extensively in test environment before go-live
2. Configure multiple handoff queues (IT, HR, General) with fallback
3. Monitor queue availability and alert when no agents are online
4. Implement handoff retry (3 attempts before failing)
5. If handoff fails: create ticket automatically, notify user with case number
6. Business hours awareness: don't attempt handoff outside staffed hours
7. Context backup: store full conversation in Dataverse even if handoff fails

**Contingency Plan:**
If D365 CS handoff fails, fall back to email-based escalation with full conversation transcript.

**Owner:** Copilot Studio + D365 CS Integration Lead
**Review Date:** Weekly

---

### RISK-T006: Copilot Studio Platform Limitations

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T006 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (30%) |
| **Impact** | Medium — Copilot Studio has limitations that may constrain the solution design. |

**Description:**
Copilot Studio platform limitations include: (a) maximum 1000 topics per agent, (b) conversation timeout after 30 minutes of inactivity, (c) maximum 30 seconds for Power Automate flow calls, (d) limited debugging capabilities, (e) generative AI content filtering may block legitimate responses, (f) variable type limitations (no arrays, limited object support).

**Mitigation Strategies:**
1. Stay within documented platform limits during design
2. Break complex topics into smaller, reusable sub-topics
3. Use Dataverse for complex state management (not just variables)
4. Test flow timeouts and handle gracefully
5. Have backup plans for content filtering false positives
6. Use "Conversation Boosting" (generative AI) to reduce topic count
7. Monitor platform release notes for new capabilities

**Owner:** Copilot Studio Architect
**Review Date:** Per release

---

### RISK-T007: Teams Channel Integration Issues

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T007 |
| **Category** | Technical |
| **Severity** | Low |
| **Probability** | Medium (25%) |
| **Impact** | Low — Teams-specific rendering or authentication issues. |

**Description:**
The agent deploys primarily through Teams. Issues may include: (a) SSO not working in all Teams clients, (b) adaptive cards rendering differently across platforms, (c) @mention in channels not triggering agent, (d) file upload not working in group chats, (e) mobile Teams experience differs from desktop.

**Mitigation Strategies:**
1. Test on all Teams clients: desktop, web, iOS, Android, Mac
2. Implement graceful degradation for unsupported features
3. Use simple adaptive card layouts for maximum compatibility
4. Document known limitations per client
5. Provide fallback web portal link

**Owner:** Teams Integration Developer
**Review Date:** UAT phase

---

## 2. Business Risks

### RISK-B001: Low User Adoption

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B001 |
| **Category** | Business |
| **Severity** | **HIGH** |
| **Probability** | High (50%) |
| **Impact** | Critical — If employees don't use the agent, the investment is wasted and service desk workload doesn't decrease. |

**Description:**
Employees have established habits: calling the help desk, emailing IT, asking colleagues. Changing behavior requires active promotion. Resistance comes from: (a) employees who distrust AI, (b) employees who had bad experiences with chatbots, (c) employees who prefer human interaction, (d) lack of awareness that the agent exists.

**Mitigation Strategies:**
1. Executive announcement from CIO/CHRO promoting the agent
2. Embed agent in Teams (where employees already work) — don't require new app
3. Launch campaign: email, intranet, digital signage, town halls
4. Champions program: identify enthusiasts in each department
5. Make it easy: @mention the agent in any Teams chat
6. Track adoption metrics by department; target low-adoption teams
7. Quick wins: ensure top 10 questions work perfectly
8. Gamification: department leaderboard for most agent interactions
9. Incentivize: "Skip the queue — ask the agent first!"

**Contingency Plan:**
If adoption stalls, reduce help desk phone/email hours to nudge employees toward the agent (with advance communication).

**Owner:** Change Management + Internal Communications
**Review Date:** Weekly for first 8 weeks

---

### RISK-B002: Employee Trust and Perception

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B002 |
| **Category** | Business |
| **Severity** | **HIGH** |
| **Probability** | Medium (40%) |
| **Impact** | High — If employees have bad experiences early, negative word-of-mouth will spread and adoption will suffer. |

**Description:**
First impressions matter. If an employee's first interaction with the agent results in: (a) wrong answer about benefits enrollment deadline, (b) password reset that doesn't work, (c) endless loop of "I didn't understand," (d) inability to reach human when needed — they will tell colleagues and stop using the agent.

**Mitigation Strategies:**
1. Soft launch: pilot with 200 enthusiastic users first
2. Ensure top 10 topics have >95% accuracy before broader rollout
3. Monitor CSAT from day 1; investigate every negative rating
4. Capabilitity framing: position as "augmentation" not "replacement"
5. Always offer human handoff — never trap users
6. Transparent about being AI: "I'm Cosmo, Contoso's virtual assistant"
7. Fast iteration: fix issues within 48 hours of reporting
8. Success stories: share positive feedback and time-saving examples

**Contingency Plan:**
If trust issues emerge, pause rollout, fix issues, and relaunch with targeted communications addressing concerns.

**Owner:** Service Desk Manager + Communications
**Review Date:** Weekly during pilot

---

### RISK-B003: Service Desk Analyst Resistance

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B003 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | Medium (35%) |
| **Impact** | Medium — If service desk analysts view the agent as a threat to their jobs, they may undermine adoption or provide poor handoff experiences. |

**Description:**
Service desk analysts may fear: (a) job elimination, (b) being monitored by management through agent metrics, (c) handling only complex/difficult cases while "easy" work goes to the bot, (d) loss of job satisfaction from routine interactions. This resistance can manifest as: slow handoff responses, negative comments about the agent to employees, poor documentation of knowledge gaps.

**Mitigation Strategies:**
1. Frame agent as "augmentation" not "replacement": analysts handle complex issues
2. Redeploy analysts to L2/L3 work, process improvement, knowledge management
3. Involve analysts in agent design and testing (ownership mentality)
4. Analysts become "AI trainers" — improving knowledge base
5. No layoffs承诺: reassure job security with role evolution
6. Celebrate analyst contributions to agent improvement
7. Share metrics showing analysts handle more interesting work
8. Provide training: analysts learn new skills (AI management, knowledge curation)

**Owner:** Service Desk Manager + HR
**Review Date:** Bi-weekly

---

### RISK-B004: Unrealistic ROI Expectations

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B004 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | Medium (30%) |
| **Impact** | Medium — Leadership may expect immediate 70% deflection; reality is gradual improvement over months. |

**Description:**
The business case projects 70% deflection, 40% analyst time savings, and 80% employee satisfaction. These targets won't be met on day one. Initial deflection may be 30-40%, improving to 70% over 6-12 months as the knowledge base improves and topics are refined. If leadership expects immediate results, they may lose confidence and cut funding.

**Mitigation Strategies:**
1. Set realistic phased targets: Month 1: 30%, Month 3: 50%, Month 6: 65%, Month 12: 70%+
2. Report on "soft" metrics: employee satisfaction, 24/7 availability, consistent experience
3. Show trajectory, not just current state
4. Celebrate milestones: "We just hit 50% deflection!"
5. Transparent reporting: show what's working and what's not
6. Benchmark against industry: 60-70% is excellent, not 90%

**Owner:** Project Sponsor + Service Desk Manager
**Review Date:** Monthly

---

### RISK-B005: Scope Creep — Everyone Wants Their Use Case

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B005 |
| **Category** | Business |
| **Severity** | Low |
| **Probability** | High (65%) |
| **Impact** | Low — Every department will want their own topics and integrations, potentially diverting resources. |

**Description:**
Once the agent is live, Facilities will want room booking, Security will want incident reporting, Sales will want CRM integration, etc. Each request seems small but collectively they strain the team and delay core improvements.

**Mitigation Strategies:**
1. Establish a formal intake process for new topic requests
2. Prioritize by volume: only add topics that affect >5% of users
3. Phase 2 roadmap: commit to evaluating new requests quarterly
4. Self-service: train department power users to build their own topics
5. Governance committee: reviews and approves new use cases

**Owner:** Project Manager + Steering Committee
**Review Date:** Monthly

---

## 3. Operational Risks

### RISK-O001: Copilot Studio Message Quota Exhaustion

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O001 |
| **Category** | Operational |
| **Severity** | **HIGH** |
| **Probability** | Medium (30%) |
| **Impact** | High — If message quota is exceeded, the agent stops responding, creating service disruption. |

**Description:**
Copilot Studio is priced per message (per tenant). For 2,000 employees with average 8 messages per session and 5 sessions per month, estimated consumption is 80,000 messages/month. If the organization grows, if usage exceeds projections, or if a spam/loop scenario occurs, the quota may be exhausted.

**Mitigation Strategies:**
1. Purchase quota with 50% buffer above estimated consumption
2. Monitor message consumption daily via Copilot Studio analytics
3. Set alerts at 60%, 75%, 90% of quota
4. Implement conversation efficiency: keep sessions short, avoid unnecessary clarifications
5. Detect and prevent conversation loops (max 20 turns per session)
6. Plan for quota increase process (how long it takes to add capacity)
7. Budget for annual quota review and adjustment

> **WARNING:** Copilot Studio licensing and quota pricing change frequently. Verify current pricing at https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing-subscriptions. Budget estimates in this document are illustrative only.

**Contingency Plan:**
If quota exhausted mid-month, temporarily reduce generative AI usage (more structured topics) and restrict access to business-critical topics only.

**Owner:** Power Platform Administrator
**Review Date:** Weekly

---

### RISK-O002: Conversation Loop Detection and Prevention

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O002 |
| **Category** | Operational |
| **Severity** | Medium |
| **Probability** | Medium (30%) |
| **Impact** | Medium — Users or system errors can create infinite conversation loops, consuming message quota and frustrating users. |

**Description:**
Conversation loops occur when: (a) agent doesn't understand user and repeatedly asks same clarifying question, (b) topic routing bounces between topics, (c) user repeatedly asks same question (intentionally or due to confusion), (d) technical glitch causes the same message to trigger repeatedly.

**Mitigation Strategies:**
1. Hard limit: maximum 20 turns per conversation
2. Duplicate detection: if user sends same message 3 times, offer handoff
3. Topic change tracking: if routed to same topic >2 times, escalate
4. Timeout: end conversation after 30 minutes of inactivity
5. Monitor: alert on conversations with >15 turns
6. Graceful exit: "It seems we're going in circles. Let me connect you with support."

**Owner:** Copilot Studio Developer
**Review Date:** Weekly

---

### RISK-O003: Knowledge Base Maintenance Burden

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O003 |
| **Category** | Operational |
| **Severity** | Medium |
| **Probability** | High (60%) |
| **Impact** | Medium — Knowledge base requires ongoing maintenance; if neglected, agent accuracy degrades. |

**Description:**
After go-live, the knowledge base needs: (a) new articles for unanswered questions, (b) updates when procedures change, (c) review of flagged articles, (d) retirement of outdated content. This requires dedicated effort from knowledge managers and SMEs. If not resourced, the agent's effectiveness degrades over time.

**Mitigation Strategies:**
1. Dedicate 0.5 FTE Knowledge Manager role for ongoing KB maintenance
2. Assign article owners in each department (accountability)
3. Automated freshness alerts: articles older than 12 months flagged
4. Employee feedback loop: easy "flag as outdated" button
5. Weekly 1-hour KB review meeting
6. New article template: standardized, easy to create
7. Knowledge gap report: auto-generated weekly, drives article priorities

**Owner:** Knowledge Manager
**Review Date:** Weekly

---

### RISK-O004: After-Hours Support Quality

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O004 |
| **Category** | Operational |
| **Severity** | Low |
| **Probability** | Low (20%) |
| **Impact** | Low — After-hours questions may require actions that need human approval or systems that are offline. |

**Description:**
The agent promises 24/7 support, but some actions require human intervention: (a) access requests that need manager approval (manager asleep), (b) software requests that need procurement approval, (c) critical issues that need immediate human attention (but no one is staffed).

**Mitigation Strategies:**
1. Set expectations: "Your request has been submitted. It will be reviewed during business hours."
2. For critical after-hours issues: provide emergency contact number
3. Auto-create tickets for all after-hours requests
4. Morning digest: managers receive summary of requests awaiting approval
5. Escalation: critical issues auto-page on-call engineer

**Owner:** Service Desk Manager
**Review Date:** Monthly

---

## 4. Compliance Risks

### RISK-C001: PII Exposure in Conversations

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C001 |
| **Category** | Compliance |
| **Severity** | **HIGH** |
| **Probability** | Medium (25%) |
| **Impact** | Critical — Conversations may contain PII (passwords, SSNs, medical info) that must be protected. |

**Description:**
Employees may share sensitive information in chat: passwords (before reset), SSNs (for HR questions), medical details (for leave requests), salary information. This data flows through Copilot Studio, Power Automate, Dataverse, and potentially to human agents on handoff.

**Mitigation Strategies:**
1. Never ask for passwords in chat (use reset links instead)
2. PII masking: automatically mask SSNs, account numbers in conversation logs
3. Data retention: conversation history purged after 90 days
4. Access control: only approved admins can view conversation transcripts
5. Training: human agents trained on PII handling
6. Audit: quarterly review of data handling practices
7. GDPR: data subject request process for conversation deletion
8. Encryption: all data encrypted at rest and in transit

**Owner:** Data Protection Officer
**Review Date:** Monthly

---

### RISK-C002: Accessibility Compliance

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C002 |
| **Category** | Compliance |
| **Severity** | Medium |
| **Probability** | Medium (25%) |
| **Impact** | Medium — Teams chat and adaptive cards may not be fully accessible to employees with disabilities. |

**Description:**
The agent must comply with accessibility standards (WCAG 2.1 AA, Section 508). Issues may include: (a) adaptive cards not readable by screen readers, (b) color-only indicators (red/green) not distinguishable by colorblind users, (c) no keyboard-only navigation path, (d) text too small or low contrast.

**Mitigation Strategies:**
1. Test with screen readers (NVDA, JAWS, VoiceOver)
2. Use color + icon + text (not color alone) for status indicators
3. Ensure all adaptive cards have alt text
4. Keyboard navigation support for all actions
5. WCAG 2.1 AA compliance audit before go-live
6. Include accessibility in UAT with employees who use assistive technology

**Owner:** Accessibility Lead + UX Designer
**Review Date:** Pre-launch

---

### RISK-C003: Licensing Compliance

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C003 |
| **Category** | Compliance |
| **Severity** | Medium |
| **Probability** | Low (15%) |
| **Impact** | Medium — Copilot Studio licensing is evolving and may require specific licenses for users. |

**Description:**
Copilot Studio licensing has changed significantly. Depending on the deployment model: (a) per-message pricing requires accurate quota management, (b) some features require Premium licenses, (c) Teams channel integration may require Teams-specific licensing, (d) guest users may need separate licensing.

**Mitigation Strategies:**
1. Pre-deployment licensing audit with Microsoft account team
2. Purchase with buffer: 50% above estimated consumption
3. Monitor usage weekly against quota
4. Document all licensing requirements before go-live
5. Annual licensing review
6. Budget for price changes (historically, generative AI features have been added at additional cost)

> **WARNING:** Licensing information in this document reflects the state as of early 2024. Microsoft frequently updates Copilot Studio licensing. Always verify current requirements with your Microsoft account representative before purchasing.

**Owner:** Power Platform Administrator + Procurement
**Review Date:** Quarterly

---

## 5. Risk Monitoring & Governance

### 5.1 Risk Review Cadence

| Review Type | Frequency | Participants |
|-------------|-----------|--------------|
| Daily Standup | Daily | Agent dev team |
| Weekly Risk Review | Weekly | PM + Risk Owners |
| Pilot Review | Weekly | All stakeholders during pilot |
| Steering Committee | Bi-weekly | Executive sponsor |

### 5.2 Risk Escalation Matrix

| Severity | Escalation Path | Response Time |
|----------|----------------|---------------|
| Critical | Immediate → Sponsor + CIO | 2 hours |
| High | Same day → PM + Service Desk Manager | 24 hours |
| Medium | Weekly review | 1 week |
| Low | Next scheduled review | Next cycle |
