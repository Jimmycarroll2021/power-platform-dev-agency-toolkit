# Azure Function Integration Playbook

> **Complexity Rating:** Medium / High
> **Last Updated:** 2024
> **Applies To:** Azure Functions, Power Platform, Power Automate, Power Apps, HTTP Triggers

---

## 1. When to Use Azure Functions with Power Platform

Use Azure Functions when:

| Scenario | Why Azure Function |
|----------|-------------------|
| Complex data transformation | Full .NET/Python/Node.js capabilities |
| Custom API endpoint | REST endpoint for Power Apps/Automate |
| Long-running processing | Beyond Power Automate 30-day limit |
| High-performance operations | Compiled code, not interpreted |
| Reusable business logic | Centralized code library |
| Integration with legacy systems | Custom protocol support |
| Document/image processing | Libraries not available in Power Platform |
| Batch processing | Process large datasets efficiently |
| Custom authentication | Complex auth scenarios |
| Queue-based processing | Decouple from Power Automate |
| Calling external APIs with complex auth | Certificate auth, mutual TLS |
| Need for unit testing | Standard software development practices |

### Decision Matrix

| Factor | Azure Function | Power Automate | Custom Connector |
|--------|---------------|----------------|-------------------|
| Complexity | High | Low-Medium | Medium |
| Performance | Excellent | Good | Good |
| Development speed | Slower | Faster | Medium |
| Maintainability | Standard dev practices | Visual designer | API spec |
| Cost at scale | Can be cheaper | Per-run pricing | Per-run pricing |
| Reusability | High | Medium | High |
| Need for code | Yes | No | No |
| Debugging | Full debugging | Limited | Limited |

---

## 2. When NOT to Use Azure Functions

> **DO NOT use Azure Functions when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Simple HTTP call to existing API | HTTP action in flow | No code needed |
| Simple data transformation | Power Automate data operations | Simpler, no deployment |
| Approval workflow | Power Automate approvals | Built-in, no code |
| Simple scheduled task | Power Automate scheduled flow | No infrastructure |
| Database CRUD operations | Dataverse connector | Native, no code |
| File processing (simple) | Power Automate file triggers | Built-in |
| Need quick citizen dev solution | Power Automate or canvas app | No-code |
| Simple notification | Power Automate notification | Built-in connectors |

---

## 3. Architecture

### 3.1 Integration Patterns

**Pattern 1: HTTP Trigger (Synchronous)**
```
[Power Automate / Power Apps]
       |
       | HTTP POST/GET
       v
[Azure Function: HTTP Trigger]
       |
       +-- Process request
       +-- Return response
       |
       v
[JSON Response]
```

Use for: Real-time requests, API endpoints, calculations

**Pattern 2: Queue Trigger (Asynchronous)**
```
[Power Automate]
       |
       | Add to Queue
       v
[Azure Queue Storage]
       |
       | Trigger
       v
[Azure Function: Queue Trigger]
       |
       +-- Process message
       +-- Update status in Dataverse
```

Use for: Background processing, decoupling, batch operations

**Pattern 3: Event Grid Trigger**
```
[Dataverse / Event Source]
       |
       | Event published
       v
[Azure Event Grid]
       |
       | Route
       v
[Azure Function: Event Grid Trigger]
       |
       +-- Process event
```

Use for: Event-driven architecture, reacting to data changes

**Pattern 4: Timer Trigger**
```
[Azure Function: Timer Trigger]
       |
       | Cron schedule
       v
[Process scheduled task]
       |
       v
[Update Dataverse / Send notification]
```

Use for: Complex scheduled operations

---

## 4. HTTP Triggers

### 4.1 Function Signature (.NET)

```csharp
public static class PowerPlatformIntegration
{
    [FunctionName("ProcessData")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "process")] 
        HttpRequest req,
        ILogger log)
    {
        log.LogInformation("Processing request from Power Platform");
        
        // Read request body
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        var data = JsonSerializer.Deserialize<ProcessRequest>(requestBody);
        
        // Validate input
        if (data == null || string.IsNullOrEmpty(data.Id))
        {
            return new BadRequestObjectResult(new { error = "Invalid request" });
        }
        
        // Process
        var result = await ProcessDataAsync(data);
        
        // Return structured response
        return new OkObjectResult(new 
        { 
            success = true, 
            data = result,
            processedAt = DateTime.UtcNow
        });
    }
}
```

### 4.2 Request/Response Model

**Request:**
```json
{
  "correlationId": "guid",
  "requestType": "calculation",
  "payload": {
    "input1": 100,
    "input2": 200
  },
  "callbackUrl": "optional-webhook"
}
```

**Response:**
```json
{
  "success": true,
  "correlationId": "guid",
  "result": {
    "output": 300,
    "calculationMethod": "sum"
  },
  "processingTimeMs": 45,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4.3 Error Response Model

```json
{
  "success": false,
  "correlationId": "guid",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input value must be greater than zero",
    "details": "Field: input1, Value: -5",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 5. Queue Triggers

### 5.1 Queue Pattern for Power Platform

```
[Power Automate: Need background processing]
       |
       v
[Azure Function: HTTP Trigger (quick)]
       |-- Validate request
       |-- Add message to queue
       |-- Return "Accepted" immediately
       |
       v
[Azure Queue Storage]
       |
       v
[Azure Function: Queue Trigger]
       |-- Process message
       |-- Update Dataverse status
       |-- Log completion
```

### 5.2 Queue Message Format

```json
{
  "operationId": "guid",
  "operationType": "batch-processing",
  "data": {
    "recordIds": ["id1", "id2", "id3"],
    "processingOptions": {
      "priority": "normal",
      "notifyOnComplete": true
    }
  },
  "submittedAt": "2024-01-15T10:00:00Z",
  "maxRetryCount": 3,
  "currentRetryCount": 0
}
```

---

## 6. Error Handling

### 6.1 Error Handling Strategy

```
[Function Entry]
       |
       v
[Try]
       |
       +--[Validate Input]
       |     |--Invalid--> [Return 400 Bad Request]
       |
       +--[Authenticate]
       |     |--Failed--> [Return 401 Unauthorized]
       |
       +--[Authorize]
       |     |--Failed--> [Return 403 Forbidden]
       |
       +--[Process]
       |     |--Error--> [Return 500 + error details]
       |
       +--[Return 200 Success]
       |
[Catch (unexpected)]
       |
       +--[Log exception]
       +--[Return 500 + generic error]
       +--[Alert (if critical)]
```

### 6.2 Retry Configuration

```csharp
// host.json
{
  "extensions": {
    "queues": {
      "maxDequeueCount": 3,
      "visibilityTimeout": "00:05:00"
    }
  }
}
```

| Retry Strategy | Use For | Configuration |
|---------------|---------|--------------|
| Built-in queue retry | Transient failures | maxDequeueCount |
| Exponential backoff | External API calls | Polly library |
| Dead letter queue | Failed after all retries | Separate queue |
| Circuit breaker | Unhealthy dependencies | Custom implementation |

### 6.3 Dead Letter Pattern

```
[Queue: main-processing]
       |
       | Process (fails 3x)
       v
[Queue: main-processing-poison]
       |
       v
[Azure Function: Poison Handler]
       |-- Log failure
       |-- Alert admin
       |-- Update Dataverse (status = "Failed")
       |-- Store message for analysis
```

---

## 7. Development Steps

### 7.1 Implementation Checklist

- [ ] Define function purpose and interface
- [ ] Create Azure Function project
- [ ] Implement input validation
- [ ] Implement authentication/authorization
- [ ] Implement core logic
- [ ] Implement error handling
- [ ] Add structured logging (Application Insights)
- [ ] Add correlation ID tracking
- [ ] Implement retry logic
- [ ] Write unit tests
- [ ] Deploy to Azure
- [ ] Configure CI/CD pipeline
- [ ] Test from Power Platform
- [ ] Monitor and alert

### 7.2 Calling from Power Automate

```
[Trigger]
  |
  v
[HTTP: POST to Azure Function]
  |-- URI: https://myfunction.azurewebsites.net/api/process
  |-- Headers:
  |     x-api-key: [function key]
  |     x-correlation-id: [guid]
  |-- Body:
  |     {
  |       "correlationId": "@{guid()}",
  |       "requestType": "calculation",
  |       "payload": @{json(outputs('Prepare_Data'))}
  |     }
  |
  v
[Parse JSON: Parse response]
  |
  v
[Condition: Response.success = true?]
  |--YES-->[Process result]
  |--NO--->[Handle error, log, alert]
```

### 7.3 Calling from Power Apps

```
// In Power Apps, use a flow as intermediary
// (Power Apps can't call Functions directly with auth)

[Power Apps Button.OnSelect]
  |
  v
[Power Automate Flow]
  |-- Receive parameters from app
  |-- Call Azure Function (HTTP)
  |-- Return result to app
  |
  v
[Power Apps receives result]
  |-- Update UI
  |-- Notify user
```

---

## 8. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Valid request | Post valid JSON | Correct response |
| Invalid JSON | Post malformed JSON | 400 error, clear message |
| Missing required field | Omit required field | Validation error |
| Wrong authentication | Invalid/no API key | 401/403 error |
| Large payload | Post max size data | Handled gracefully |
| Error in processing | Force internal error | 500 error, logged |
| Timeout scenario | Slow dependency | Timeout handled |
| Queue trigger | Add message to queue | Function processes |
| Poison message | Fail multiple times | Moves to poison queue |
| From Power Automate | Call via flow | Works end-to-end |
| From Power Apps | Call via flow | Works end-to-end |
| Load test | 100 concurrent requests | No failures, acceptable latency |

---

## 9. Licensing

| Component | Cost |
|-----------|------|
| Azure Functions (Consumption) | Pay per execution + GB-s |
| Azure Functions (Premium) | Fixed instance cost |
| Application Insights | Data ingestion |
| Queue Storage | Storage + transactions |
| Power Automate HTTP calls | Premium (if using HTTP connector) |

> **NOTE:** Azure Functions can be very cost-effective for low-volume scenarios. Consumption plan means you pay only for what you use.

---

## 10. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Cold start latency | Medium | Use Premium plan for consistent performance |
| Function app downtime | High | Monitor, use availability zones |
| Security (API key exposure) | High | Use managed identity, Key Vault |
| Version management | Medium | CI/CD pipeline, semantic versioning |
| Debugging production issues | Medium | Application Insights, structured logging |
| Cost escalation at scale | Medium | Monitor consumption, set budgets |
| Dependency failures | Medium | Circuit breaker, retry logic |
| Timeout limits (HTTP: 230s) | Medium | Use async pattern for long operations |
