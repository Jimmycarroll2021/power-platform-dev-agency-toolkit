# Approval Workflow Playbook

> **Complexity Rating:** Medium
> **Last Updated:** 2024
> **Applies To:** Power Automate Approval Actions, SharePoint Approvals, Teams Approvals

---

## 1. When to Use Approval Workflows

Use Power Automate approvals when:

| Scenario | Approval Pattern |
|----------|-----------------|
| Document/content review | Single or serial approval |
| Purchase requests | Multi-level (manager + finance) |
| Time-off requests | Manager approval |
| Expense claims | Manager + finance approval |
| Access requests | Owner + security approval |
| Change requests | CAB (Change Advisory Board) |
| Invoice processing | PO matching + approval |
| Content publishing | Editor + publisher approval |

---

## 2. Approval Patterns

### 2.1 Single Approver

```
[Trigger: New request submitted]
       |
       v
[Start and wait for approval] --> Single approver
       |
   +---+---+
   |       |
Approve  Reject
   |       |
   v       v
[Process] [Notify]
```

**Use for:** Low-value, routine approvals with clear ownership.

**Configuration:**
- Approval type: "Approve/Reject - Everyone must approve" (with 1 person)
- Timeout: Typically 3-5 business days
- Reminder: Daily after 24 hours

---

### 2.2 Serial (Sequential) Approval

```
[Trigger: New request submitted]
       |
       v
[Start and wait: Manager approval]
       |
   +---+---+
   |       |
Approve  Reject
   |       |
   v       v
[Start and wait: [Start: Notify requester]
 Finance approval]      [Status: Rejected]
       |
   +---+---+
   |       |
Approve  Reject
   |       |
   v       v
[Process] [Notify]
```

**Use for:** Multi-tier approvals where each level depends on the previous.

**Configuration:**
- Each approval step is sequential
- Each step has its own approver and timeout
- Rejection at any step stops the workflow
- Common pattern: Manager > Director > VP > CFO

---

### 2.3 Parallel Approval

```
[Trigger: New request submitted]
       |
       +--------+--------+--------+
       |        |        |        |
       v        v        v        v
   [Legal]  [IT]   [Security] [Finance]
       |        |        |        |
       +--------+--------+--------+
                  |
                  v
          [All approved?]
            |        |
           Yes       No
            |        |
            v        v
        [Process] [Notify]
```

**Use for:** Reviews requiring input from multiple departments simultaneously.

**Configuration:**
- Start multiple "Start and wait for approval" actions in parallel
- Use "Apply to each" or parallel branches
- Wait for ALL or ANY response
- Aggregate responses before next step

---

### 2.4 Approval with Escalation

```
[Trigger: New request]
       |
       v
[Start approval] --> Approver: Manager
       |
       |<--- 24 hours ---->|
       |                   |
       v                   v
   [Approved]         [Not responded]
       |                   |
       v                   v
   [Process]         [Escalate to Director]
                           |
                           |<--- 24 hours ---->|
                           |                   |
                           v                   v
                       [Approved]         [Not responded]
                           |                   |
                           v                   v
                       [Process]         [Auto-approve or reject]
```

**Use for:** Time-sensitive approvals where delays are costly.

---

### 2.5 Approval with Delegation

```
[Trigger: New request]
       |
       v
[Check: Is approver available?]
       |
   +---+---+
   |       |
  Yes      No (out of office)
   |       |
   v       v
[Send to  [Lookup delegate]
 approver]       |
                 v
           [Send to delegate]
```

**Use for:** Organizations with frequent approver unavailability.

---

## 3. Approval Configuration

### 3.1 Approval Types

| Type | Use When | Response Options |
|------|----------|-----------------|
| Approve/Reject - Everyone must approve | All approvers required | Approve, Reject |
| Approve/Reject - First to respond | Any one approver sufficient | Approve, Reject |
| Approve/Reject - Wait for all responses | Need all responses | Approve, Reject |
| Custom responses | Need more than approve/reject | Custom: "Approve", "Needs Revision", "Reject" |

### 3.2 Approval Settings

| Setting | Recommendation | Notes |
|---------|---------------|-------|
| Requestor | Dynamic (submitter) | Usually the person who triggered the flow |
| Approver | Dynamic based on rules | Manager lookup, role-based |
| Title | Descriptive + record ID | "Invoice Approval: INV-001234" |
| Details | Include all context | Relevant fields, links |
| Item link | Link to record | Deep link to item |
| Enable notifications | Yes | Email + Teams |
| Attachments | As needed | Supporting documents |

### 3.3 Dynamic Approver Lookup

**Pattern 1: Manager Lookup**
```
[Trigger]
  |
  v
[Office 365 Users: Get manager]
  |-- User: [Requestor email]
  |
  v
[Start approval]
  |-- Approver: [Manager's email]
```

**Pattern 2: Role-Based Lookup (Dataverse)**
```
[Trigger]
  |
  v
[Dataverse: List rows - Approval Matrix]
  |-- Filter: Department = [Request.Department] AND Amount <= [Request.Amount]
  |
  v
[Start approval]
  |-- Approver: [Approval Matrix.Approver]
```

**Pattern 3: Hierarchical Approval Chain**
```
Store approval hierarchy in Dataverse:
- Level 1: Manager (0-$1,000)
- Level 2: Director ($1,001-$10,000)
- Level 3: VP ($10,001-$50,000)
- Level 4: CFO ($50,000+)
```

---

## 4. Escalation Patterns

### 4.1 Timeout-Based Escalation

```
[Start approval] + [Delay Until / Delay]
       |
       +---[Delay: 2 business days]
       |
       v
[Condition: Approval completed?]
   |--NO--> [Escalate]
   |--YES--> [Process response]
```

**Implementation:**
1. Start approval
2. In parallel, start a delay
3. After delay, check if approval completed
4. If not, send escalation notification
5. Optionally reassign to next approver

### 4.2 Reminder Pattern

```
[Start approval]
       |
       +---[Loop: Until approval completed]
              |
              +--[Delay: 24 hours]
              +--[Condition: Still pending?]
                    |--YES-->[Send reminder email]
                    |--NO--->[Exit loop]
```

**DO NOT:** Use infinite loops. Always set a maximum reminder count (e.g., 3 reminders then auto-escalate).

### 4.3 Auto-Approve/Reject on Timeout

```
[Start approval] + [Delay: 5 business days]
       |
       +---After delay---+
                       |
                       v
               [Condition: Responded?]
                 |--NO-->[Auto-action based on policy]
                 |       - Auto-approve if under threshold
                 |       - Auto-reject if over threshold
                 |       - Escalate to next level
                 |
                 |--YES--> [Process actual response]
```

---

## 5. Reminders

### 5.1 Reminder Strategy

| Reminder | Timing | Content |
|----------|--------|---------|
| 1st | 24 hours | Friendly reminder with context |
| 2nd | 48 hours | Urgent reminder, CC manager |
| 3rd | 72 hours | Final notice, auto-escalation warning |
| Escalation | 96 hours | Escalated to next level |

### 5.2 Reminder Flow Design

```
[Do Until: Approval completed OR count > 3]
  |
  +--[Delay: 24 hours]
  +--[Get approval status]
  +--[Condition: Still pending?]
        |--YES-->
        |  [Increment counter]
        |  [Send reminder email]
        |  [Update reminder log]
        |
        |--NO-->
           [Exit loop]

[After loop]
  |
  +--[Condition: Still pending?]
        |--YES-->[Trigger escalation]
        |--NO--->[Process as normal]
```

---

## 6. Delegation

### 6.1 Delegation Approaches

**Approach 1: Out-of-Office Check**
```
[Before sending approval]
  |
  v
[Get profile (Office 365)]
  |
  v
[Condition: Out of office?]
  |--YES-->[Get delegate from profile]
  |         [Send to delegate]
  |
  |--NO--->[Send to original approver]
```

**Approach 2: Delegation Matrix (Dataverse)**

Create a Delegation table:

| Column | Type | Purpose |
|--------|------|---------|
| Original Approver | Lookup (User) | Who is delegating |
| Delegate | Lookup (User) | Who receives approvals |
| Start Date | Date | When delegation starts |
| End Date | Date | When delegation ends |
| Is Active | Yes/No | Whether delegation is active |

```
[Before sending approval]
  |
  v
[Dataverse: List rows - Delegations]
  |-- Filter: Original Approver = [Approver] AND Is Active = Yes
  |           AND Today between Start/End Date
  |
  v
[Condition: Delegation found?]
  |--YES-->[Use Delegate as approver]
  |--NO--->[Use original approver]
```

---

## 7. Data Model

### 7.1 Approval Tracking Table (Recommended)

Create a custom Dataverse table for tracking:

| Column | Type | Purpose |
|--------|------|---------|
| Approval ID | Auto-number | Unique identifier |
| Related Record | Lookup | Link to business record |
| Approval Type | Choice | Single/Serial/Parallel |
| Requestor | Lookup (User) | Who submitted |
| Current Approver | Lookup (User) | Who needs to act |
| Status | Choice | Pending/Approved/Rejected/Escalated |
| Request Date | DateTime | When submitted |
| Due Date | DateTime | When approval due |
| Response Date | DateTime | When responded |
| Response | Choice | Approved/Rejected |
| Comments | Text | Approver comments |
| Escalation Level | Number | Current escalation tier |

---

## 8. Development Steps

### 8.1 Build Checklist

- [ ] Identify approval pattern needed
- [ ] Design approver lookup logic
- [ ] Configure escalation rules
- [ ] Design reminder schedule
- [ ] Create approval tracking table
- [ ] Build main approval flow
- [ ] Build reminder flow (if separate)
- [ ] Build escalation flow (if separate)
- [ ] Add error handling
- [ ] Test all paths (approve, reject, timeout, escalate)
- [ ] Document approver roles and responsibilities

### 8.2 Common Expression Patterns

| Purpose | Expression |
|---------|-----------|
| Add business days | Use a custom function or loop |
| Check if timeout | Compare utcNow() with Due Date |
| Format approval email | Use HTML in approval details |
| Deep link to record | Concatenate environment URL + record ID |

---

## 9. Testing Scenarios

| Test Case | Expected Result |
|-----------|----------------|
| Approver approves | Request processed, approver notified |
| Approver rejects | Request rejected, requestor notified |
| Approver doesn't respond (timeout) | Escalation triggered |
| Approver is out of office | Delegation triggered |
| Multiple parallel approvers - all approve | Request processed |
| Multiple parallel approvers - one rejects | Request rejected |
| Serial approval - first rejects | Second approver never notified |
| Serial approval - all approve | Request processed |
| Record deleted during approval | Flow handles gracefully |
| Approver no longer in organization | Error handled, reassigned |

---

## 10. Monitoring

| Metric | How to Track | Alert |
|--------|-------------|-------|
| Average approval time | Approval tracking table | > SLA threshold |
| Approval backlog | Pending count | > threshold |
| Escalation rate | Escalated / Total | > 20% |
| Timeout rate | Timed out / Total | > 10% |
| Approver response rate | Responded / Assigned | < 80% |

---

## 11. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Approver leaves organization | High | Dynamic lookup, delegate pattern |
| Approval loops | Medium | Max depth tracking |
| Performance (many parallel) | Medium | Batch processing |
| Audit requirements | Medium | Comprehensive tracking table |
| Mobile approval experience | Low | Teams mobile app |

---

## 12. Licensing

| Component | License Required |
|-----------|-----------------|
| Approval actions | Included with Power Automate (standard) |
| Approvers receiving approvals | No license required for basic approvals |
| Approvers using Teams approvals | Microsoft Teams license |
| Premium connectors in approval flow | Power Automate Premium |

> **Note:** Basic approvals (Approve/Reject) are included with most Microsoft 365 licenses. Custom responses and advanced features may require Power Automate Premium.
