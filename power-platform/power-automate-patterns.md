---
title: "Power Automate Patterns"
description: "Design patterns for Power Automate cloud flows"
category: "automation"
tags: ["power-automate", "flows", "patterns", "automation"]
---

# Power Automate Patterns

## 1. Approval Patterns

### Serial Approval

```
[Trigger]
  │
  ▼
[Scope: Serial Approval]
  │
  ├──▶ [Start and wait for approval: Manager]
  │      Condition: Approved?
  │        Yes
  │         │
  │         ▼
  │        [Start and wait for approval: Director]
  │              Condition: Approved?
  │                Yes
  │                 │
  │                 ▼
  │                [Process approved request]
  │                [Notify requester: Approved]
  │
  └──▶ [Configure run after: has failed, is skipped]
        [Notify requester: Rejected]
        [Terminate: Cancelled]
```

### Parallel Approval

```
[Trigger]
  │
  ▼
[Scope: Parallel Approval]
  │
  ├──▶ [Start approval: Manager] ──┐
  │                                 │
  ├──▶ [Start approval: Finance] ──┼──▶ [Wait for all]
  │                                 │
  └──▶ [Start approval: Legal] ────┘
```

**Implementation:**
- Use **"Start and wait for approval"** in parallel branches
- Use **"Wait for all"** pattern with variable tracking

### Escalation Pattern

```
[Trigger]
  │
  ▼
[Start approval: Manager]
  │
  ├──▶ Approved → [Process]
  │
  └──▶ Timed out (2 days)
        │
        ▼
       [Send reminder]
       [Wait 1 day]
        │
        ├──▶ Responded → [Process]
        │
        └──▶ Timed out
              │
              ▼
             [Escalate to Director]
             [Start approval: Director]
```

---

## 2. Error Handling Patterns

### Scope-Based Error Handling

```
[Main Scope]
  ├──▶ [Action 1]
  ├──▶ [Action 2]
  └──▶ [Action 3]
       [Configure run after: is successful]

[Error Handler Scope]
  [Configure run after: has failed, has timed out]
  ├──▶ [Log error details]
  ├──▶ [Send alert email]
  ├──▶ [Create error record in Dataverse]
  └──▶ [Terminate: Failed]

[Success Handler Scope]
  [Configure run after: is successful]
  └──▶ [Log success]
```

### Retry with Exponential Backoff

```
[Initialize Variable: RetryCount = 0]
[Initialize Variable: MaxRetries = 3]
  │
  ▼
[Do Until: RetryCount >= MaxRetries]
  │
  ├──▶ [Try: HTTP Request]
  │      Condition: Status = 200?
  │        Yes → [Set RetryCount = MaxRetries] (exit loop)
  │        No
  │         │
  │         ▼
  │        [Increment RetryCount]
  │        [Delay: 2^RetryCount minutes]
  │        │
  │        └──▶ Loop again
  │
  └──▶ [After loop]
        Condition: RetryCount >= MaxRetries AND not success?
          Yes → [Alert: Max retries exceeded]
```

---

## 3. Loop Patterns

### Apply to Each (with batching)

```
[Get items: 5000 rows]
  │
  ▼
[Apply to each (Concurrency: On, Degree: 10)]
  │
  ├──▶ [Process item]
  ├──▶ [Update status]
  └──▶ [Delay: 1 second]  // Rate limiting
```

**Settings:**
- Enable concurrency for parallel processing
- Set degree of parallelism (5-20 typically)
- Add delay for API rate limiting

### Do Until (Polling)

```
[Initialize Variable: Status = "Pending"]
[Initialize Variable: PollCount = 0]
  │
  ▼
[Do Until: Status = "Completed" OR PollCount >= 60]
  │
  ├──▶ [HTTP GET: Check status]
  ├──▶ [Parse JSON response]
  ├──▶ [Set Status = response.status]
  ├──▶ [Increment PollCount]
  └──▶ [Delay: 1 minute]
```

### Loop with Continue

```
[Apply to each: Items]
  │
  ├──▶ [Scope: Process Item]
  │      │
  │      ├──▶ [Validate item]
  │      │      Condition: Invalid?
  │      │        Yes → [Log skip] → [Terminate scope: Skip]
  │      │
  │      ├──▶ [Process valid item]
  │      │
  │      └──▶ [Update status]
  │
  └──▶ [Configure run after: has failed, is skipped]
        [Log continuation]
```

---

## 4. Child Flow Patterns

### Synchronous Child Flow

**Parent Flow:**
```
[HTTP Request trigger]
  │
  ▼
[Run a Child Flow]
  ├── Input: RecordId, Action
  └── Output: Result, Status
  │
  ▼
[Process child flow result]
```

**Child Flow:**
```
[Manually trigger a flow]
  ├── Input: RecordId (Text)
  ├── Input: Action (Text)
  │
  ▼
[Switch: Action]
  ├── Case "Approve" → [Approve record] → [Return: Success]
  ├── Case "Reject" → [Reject record] → [Return: Rejected]
  └── Default → [Return: Invalid action]
```

### Async Fire-and-Forget

```
[Parent Flow]
  │
  ├──▶ [Respond to PowerApps: "Processing started"]
  │
  └──▶ [Call Child Flow: async]
        (Do not wait for response)
```

---

## 5. HTTP Trigger Patterns

### Secured HTTP Endpoint

```
[When a HTTP request is received]
  ├── Method: POST
  ├── Relative path: /webhook/incoming
  ├── Authentication: Any
  │
  ▼
[Parse JSON: Validate schema]
  │
  ▼
[Condition: Validate API key header]
  ├── Valid → [Process request] → [Response: 200 OK]
  └── Invalid → [Response: 401 Unauthorized]
```

### Webhook Processing

```
[HTTP trigger]
  │
  ▼
[Compose: Extract event type]
  │
  ▼
[Switch: Event Type]
  ├── "created" → [Process create event]
  ├── "updated" → [Process update event]
  ├── "deleted" → [Process delete event]
  └── Default → [Log unknown event] → [Return 400]
```

---

## 6. Recurrence Patterns

### Business Hours Only

```
[Recurrence: Every 15 minutes]
  │
  ▼
[Condition: Is business day?]
  ├── Yes
  │   │
  │   ▼
  │  [Condition: Business hours (9-17)?]
  │    ├── Yes → [Process scheduled tasks]
  │    └── No → [Skip]
  │
  └── No (Weekend/Holiday) → [Skip]
```

### Monthly End-of-Month

```
[Recurrence: Every month, on day 28]
  │
  ▼
[Delay until: End of month]
  │
  ▼
[Run: Month-end processing]
```

---

## 7. Batch Processing Patterns

### Large Dataset Processing

```
[Recurrence trigger]
  │
  ▼
[Initialize Variable: BatchSize = 100]
[Initialize Variable: ProcessedCount = 0]
[Initialize Variable: HasMore = true]
  │
  ▼
[Do Until: HasMore = false]
  │
  ├──▶ [List rows: Top count = BatchSize]
  │      ├── Fetch XML with paging cookie
  │      │
  ├──▶ [Apply to each: Batch]
  │      ├── [Process record]
  │      └── [Increment ProcessedCount]
  │
  ├──▶ [Set HasMore = length(outputs) = BatchSize]
  │
  └──▶ [Delay: 5 seconds]  // Throttling

[Send summary email: Processed X records]
```

### Queue-Based Processing

```
[Scheduled trigger: Every 5 minutes]
  │
  ▼
[Get items from queue table]
  ├── Status = "Pending"
  ├── Top count: 50
  │
  ▼
[Apply to each: Queue item]
  ├── [Update status: "Processing"]
  ├── [Process item]
  ├── Condition: Success?
  │    ├── Yes → [Update: "Completed"]
  │    └── No → [Update: "Failed"] + [Log error]
  └── [Delay: 2 seconds]
```
