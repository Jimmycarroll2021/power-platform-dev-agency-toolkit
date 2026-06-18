# Agent Flow (Copilot Studio Agent Flow) Playbook

> **Complexity Rating:** Medium / High
> **Last Updated:** 2024
> **Applies To:** Copilot Studio Agent Flow, Workflow Automation with AI Agents

---

## 1. When to Use Agent Flows

Use Agent Flows when:

| Scenario | Why Agent Flow |
|----------|---------------|
| Complex multi-step business workflows | Orchestrate across multiple systems |
| Need AI + human collaboration | AI handles routine, escalates to humans |
| Long-running processes with checkpoints | Pause, wait for input, resume |
| Dynamic workflow paths | AI determines next steps based on context |
| Integration-heavy workflows | Connect to multiple services via natural language |
| Approval + action workflows | Combine approvals with automated actions |
| Data collection workflows | Conversational form filling |
| Exception handling workflows | Intelligent routing based on error type |

### Agent Flow vs. Power Automate Cloud Flow

| Factor | Agent Flow | Cloud Flow |
|--------|-----------|------------|
| User interaction | Conversational, natural language | Structured, form-based |
| Decision making | AI-powered routing | Predefined branches |
| Human handoff | Built-in, conversational | Email/Teams notification |
| Complexity handling | Better for complex decisions | Better for structured processes |
| Integration depth | Agent actions | Full connector library |
| Error handling | Conversational recovery | Technical retry/scope |

---

## 2. When NOT to Use Agent Flows

> **DO NOT use Agent Flows when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Simple scheduled automation | Power Automate Scheduled Flow | Simpler, more reliable |
| Event-triggered automation | Power Automate Automated Flow | Direct, no conversation overhead |
| Need guaranteed < 5 second response | Power Automate Instant Flow | Agent has conversation latency |
| Fully deterministic process | Power Automate with conditions | Predictable, auditable |
| High-volume batch processing | Azure Data Factory / Functions | Scalable, cost-effective |
| No user interaction needed | Power Automate Cloud Flow | No need for conversational layer |
| Complex data transformations | Azure Functions / Logic Apps | Better data handling |

---

## 3. Workflow Design

### 3.1 Agent Flow Architecture

```
[Conversation Trigger]
       |
       v
[Intent Recognition]
       |
       +-->[Intent A] --> [Workflow A]
       +-->[Intent B] --> [Workflow B]
       +-->[Unknown] --> [Clarify / Fallback]
       |
       v
[Workflow Execution]
       |
       +-->[Collect Information]
       |     +-- Ask questions
       |     +-- Validate inputs
       |     +-- Store in variables
       |
       +-->[Execute Actions]
       |     +-- Call APIs
       |     +-- Query databases
       |     +-- Trigger other flows
       |
       +-->[Human Review Gate]
       |     +-- Present for approval
       |     +-- Wait for response
       |     +-- Route based on decision
       |
       +-->[Complete]
             +-- Confirm completion
             +-- Provide summary
             +-- Offer next actions
```

### 3.2 Workflow Patterns

**Pattern 1: Information Collection**
```
[Trigger: "Submit expense report"]
  |
  +-->[Ask: Expense date?]
  +-->[Ask: Amount?]
  +-->[Ask: Category?]
  +-->[Ask: Receipt uploaded?]
  +-->[Validate: Policy compliance]
  +-->[Action: Submit to system]
  +-->[Confirm: Reference number]
```

**Pattern 2: Approval with Routing**
```
[Trigger: "Request equipment"]
  |
  +-->[Collect: Equipment details]
  +-->[Query: Budget availability]
  +-->[Condition: Under threshold?]
  |     |--YES-->[Auto-approve]
  |     |--NO--->[Route to manager]
  |               [Wait for approval]
  |               [Condition: Approved?]
  |                 |--YES-->[Process order]
  |                 |--NO--->[Notify rejection]
  |
  +-->[Confirm: Final status]
```

**Pattern 3: Exception Handling**
```
[Trigger: "Process refund"]
  |
  +-->[Collect: Order number]
  +-->[Query: Order details]
  +-->[Validate: Eligible for refund?]
  |     |--YES-->[Process refund]
  |     |--NO--->[Explain reason]
  |               [Offer alternative]
  |               [Escalate if requested]
  |
  +-->[Confirm: Resolution]
```

---

## 4. Human Review

### 4.1 Human Review Patterns

| Pattern | Use When | Implementation |
|---------|----------|---------------|
| Approval gate | Financial transactions | Present details, wait for approve/reject |
| Verification | Data accuracy check | Show extracted data, ask for confirmation |
| Escalation | Complex exceptions | Transfer to human with full context |
| Clarification | Ambiguous input | Ask human to clarify intent |

### 4.2 Human Review Flow

```
[Agent determines human review needed]
       |
       v
[Prepare review package]
       |-- Extracted data
       |-- AI recommendation
       |-- Confidence score
       |-- Source references
       |
       v
[Present to human reviewer]
       |-- In conversation (if synchronous)
       |-- Via Teams/email (if asynchronous)
       |-- In app (if embedded)
       |
       v
[Wait for human response]
       |-- Timeout: 24 hours default
       |-- Reminder: After 12 hours
       |-- Escalation: After timeout
       |
       v
[Process human response]
       |-- Approved --> Continue workflow
       |-- Rejected --> Handle rejection
       |-- Modified --> Use modified values
       |-- Escalated --> Transfer to senior
```

### 4.3 Context Preservation

When handing off to human, always include:

| Context Item | Purpose |
|-------------|---------|
| Full conversation history | Human understands what happened |
| Extracted data points | What AI understood |
| AI recommendation | What AI suggests |
| Confidence level | How certain AI is |
| Relevant documents | Source material |
| User intent | What user asked for |

---

## 5. Variables

### 5.1 Variable Management

| Variable Type | Scope | Use For |
|--------------|-------|---------|
| Conversation variables | Session | Data collected during conversation |
| Input parameters | Per action | Pass data to actions |
| Output parameters | Per action | Receive data from actions |
| Global variables | Cross-session | User preferences, profile |

### 5.2 Variable Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| User input | `user[Description]` | `userExpenseAmount` |
| Extracted entity | `entity[Type]` | `entityDate`, `entityAmount` |
| Action result | `result[Action]` | `resultLookup`, `resultApproval` |
| Temporary | `temp[Description]` | `tempFormattedDate` |
| Flag | `is[Condition]` | `isApproved`, `isValid` |

### 5.3 Variable Validation

Always validate variables before use:

```
[After collecting variable]
       |
       v
[Validate: Required?]
       |--Missing--> [Re-prompt user]
       |
       v
[Validate: Format correct?]
       |--Invalid--> [Ask again with guidance]
       |
       v
[Validate: Business rules?]
       |--Violates--> [Explain, ask again]
       |
       v
[Variable confirmed valid]
```

---

## 6. Development Steps

### 6.1 Implementation Checklist

- [ ] Define workflow scope and boundaries
- [ ] Map happy path (ideal scenario)
- [ ] Identify edge cases and error paths
- [ ] Design conversation script
- [ ] Define variables and data types
- [ ] Build agent flow nodes
- [ ] Configure AI actions
- [ ] Build human review gates
- [ ] Add validation logic
- [ ] Configure escalation paths
- [ ] Test happy path
- [ ] Test all error paths
- [ ] Test human review flow
- [ ] Performance testing
- [ ] User acceptance testing

### 6.2 Node Types Reference

| Node Type | Purpose | When to Use |
|-----------|---------|-------------|
| Message | Send text to user | Information, confirmation |
| Question | Ask user for input | Data collection |
| Condition | Branch based on value | Decision points |
| Action | Call external system | Execute operations |
| Set Variable | Store/Update value | Data management |
| Topic Redirect | Go to another topic | Reuse logic |
| End | End conversation | Completion |
| Agent Action | Call AI capability | Use generative AI |

---

## 7. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Happy path | Walk through ideal scenario | Completes successfully |
| Invalid input | Provide wrong data type | Graceful re-prompt |
| Missing information | Skip required fields | Field marked required, re-asked |
| Off-topic interruption | Change subject mid-flow | Handles gracefully, can resume |
| Timeout | Don't respond | Appropriate timeout message |
| Human review approval | Approve request | Workflow continues |
| Human review rejection | Reject request | Rejection handled |
| Action failure | API unavailable | Error caught, user notified |
| Context switching | Ask about different topic | Maintains context, can return |
| Edge values | Min/max values | Handles correctly |
| Multi-language (if supported) | Test in other languages | Responds correctly |
| Concurrent users | Multiple simultaneous sessions | No cross-contamination |

---

## 8. Licensing

| Component | License Required |
|-----------|-----------------|
| Copilot Studio Agent Flow | Copilot Studio messages |
| Power Automate actions | Standard or Premium |
| Dataverse queries | Power Apps license |
| AI features | AI Builder credits (if applicable) |
| Human handoff | Teams license (for Teams handoff) |

---

## 9. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Conversation abandonment | Medium | Save progress, allow resume |
| Context loss in long flows | Medium | Summary nodes, context refresh |
| Action timeouts | Medium | Set appropriate timeouts, handle gracefully |
| Over-complex flows | High | Keep under 20 nodes, use sub-topics |
| Unclear user intent | Medium | Clarification questions, confidence thresholds |
| Human review bottleneck | High | Multiple reviewers, SLA monitoring |
| Data privacy in conversations | High | Don't log PII, secure variable handling |
| Loop detection missing | Medium | Max retry counters, exit paths |
