# AI Builder GPT Prompts Playbook

> **Complexity Rating:** Medium
> **Last Updated:** 2024
> **Applies To:** AI Builder GPT Model, Power Automate "Create text with GPT", Power Apps AI Features

---

## 1. When to Use GPT Prompts in Power Platform

Use AI Builder GPT prompts when:

| Scenario | Example Prompt |
|----------|---------------|
| Summarize long text | "Summarize this email in 2 sentences" |
| Extract structured data from text | "Extract name, date, and amount from this text" |
| Classify text | "Classify this email as: Sales, Support, or Billing" |
| Generate content | "Write a response to this customer inquiry" |
| Translate text | "Translate this text to Spanish" |
| Answer questions from knowledge | "Answer this question based on the provided document" |
| Sentiment analysis | "Analyze the sentiment of this feedback" |
| Data transformation | "Convert this unstructured address to JSON" |
| Code generation | "Generate a SQL query based on this description" |

---

## 2. When NOT to Use GPT Prompts

> **DO NOT use GPT prompts when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Simple string manipulation | Power Automate expressions | Cheaper, faster, deterministic |
| Mathematical calculations | Power Automate expressions or Excel | Accurate, no hallucination |
| Deterministic business rules | Business rules or classic workflows | Consistent, auditable |
| High-volume processing (>1000/day) | Azure OpenAI Service directly | Cost-effective at scale |
| Need guaranteed factual accuracy | Verified data source + code | GPT can hallucinate |
| PII/Sensitive data processing | Azure OpenAI with private endpoints | Better data protection |
| Real-time requirements (< 1 second) | Pre-computed responses or caching | GPT calls take 2-10 seconds |
| Regulatory compliance (healthcare, legal) | Human review always required | Liability, accuracy concerns |

---

## 3. Architecture

### 3.1 GPT Prompt in Power Automate

```
[Trigger: Record created / Button clicked]
       |
       v
[Prepare Input: Compose prompt context]
       |
       v
[AI Builder: Create text with GPT]
       |-- Prompt: [Your engineered prompt]
       |-- Input text: [Dynamic content]
       |-- Temperature: [0.0 - 1.0]
       |
       v
[Parse Response: Parse JSON]
       |
       v
[Validate Output: Check structure and content]
       |
       v
[Condition: Valid output?]
   |--YES--> [Save to Dataverse / Use in flow]
   |--NO---> [Log error / Request human review]
```

### 3.2 GPT Prompt in Power Apps

```
[User enters text in Text Input]
       |
       v
[Button: "Analyze" clicked]
       |
       v
[Power Automate: Call GPT flow]
       |
       v
[Parse JSON response]
       |
       v
[Display result in app]
       |
       v
[User reviews and confirms]
```

---

## 4. JSON Structured Output

### 4.1 Why Structured Output?

> **ALWAYS** request JSON output from GPT prompts. Never rely on free-text parsing.

**Benefits:**
- Predictable output format
- Easy parsing with "Parse JSON" action
- Type safety
- Validation possible
- Error handling easier

### 4.2 Prompt Pattern for JSON Output

```
You are a data extraction assistant. Extract the following information 
from the provided text and return ONLY a valid JSON object.

Extract these fields:
- customerName (string)
- orderDate (date in YYYY-MM-DD format)
- totalAmount (number)
- items (array of objects with name and quantity)
- priority (string: "High", "Medium", or "Low")

Rules:
1. Return ONLY the JSON object, no markdown, no explanations
2. Use null for missing fields
3. Ensure all dates are valid
4. Amounts should be numeric, no currency symbols

Text to analyze:
{InputText}
```

### 4.3 JSON Schema Example

Expected output:
```json
{
  "customerName": "Acme Corporation",
  "orderDate": "2024-01-15",
  "totalAmount": 1234.56,
  "items": [
    {
      "name": "Widget A",
      "quantity": 10
    },
    {
      "name": "Widget B",
      "quantity": 5
    }
  ],
  "priority": "High"
}
```

### 4.4 Parse JSON Schema in Power Automate

```json
{
  "type": "object",
  "properties": {
    "customerName": {"type": "string"},
    "orderDate": {"type": "string"},
    "totalAmount": {"type": "number"},
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "quantity": {"type": "integer"}
        }
      }
    },
    "priority": {"type": "string"}
  }
}
```

### 4.5 Handling Malformed JSON

> **DO NOT:** Assume GPT always returns valid JSON. Always handle parse errors.

```
[Scope: Try]
  |
  +--[Parse JSON: GPT Output]
  |
[Scope: Catch]
  |
  +--[Log: Parse error details]
  +--[Send: Alert admin]
  +--[Set: Output = null]
  +--[Flag: For human review]
```

---

## 5. Error Handling

### 5.1 GPT-Specific Error Types

| Error | Cause | Handling |
|-------|-------|----------|
| Timeout | Prompt too complex or service busy | Retry with simpler prompt |
| Content filter | Output flagged by safety system | Review input, sanitize |
| Token limit exceeded | Input + output too long | Truncate input, split request |
| Rate limiting | Too many requests | Implement delay/retry |
| Service unavailable | Azure OpenAI outage | Queue for retry, use fallback |
| Invalid JSON | Model didn't follow instructions | Retry with stronger prompt, human review |

### 5.2 Error Handling Pattern

```
[Scope: Main Logic]
  |
  +--[Scope: GPT Call]
  |     +--[Create text with GPT]
  |     +--[Parse JSON]
  |     +--[Validate required fields]
  |     +--[Validate data types]
  |     +--[Validate value ranges]
  |
[Scope: Error Handler]
  | (run after: has failed, is skipped)
  +--[Condition: Error type?]
        |--Timeout--> [Retry with delay]
        |--Content Filter--> [Log, sanitize, retry]
        |--Token Limit--> [Split request]
        |--Rate Limit--> [Delay 60s, retry]
        |--Invalid JSON--> [Retry with stronger prompt]
        |--Other--> [Human review queue]
```

### 5.3 Retry Logic

| Attempt | Delay | Action |
|---------|-------|--------|
| 1 | 0s | Initial call |
| 2 | 10s | Simplified prompt |
| 3 | 30s | Minimal prompt + human flag |

---

## 6. Token Limits

### 6.1 Understanding Tokens

- 1 token ~= 4 characters in English
- GPT-4: 8,192 token context (input + output)
- GPT-4 Turbo: 128,000 token context
- Each model has different limits

### 6.2 Token Estimation

| Content | Approximate Tokens |
|---------|-------------------|
| Short email (100 words) | ~150 tokens |
| Long email (500 words) | ~750 tokens |
| Document page (500 words) | ~750 tokens |
| Complex prompt with examples | ~500-1000 tokens |
| JSON output (10 fields) | ~200 tokens |

### 6.3 Managing Token Limits

| Strategy | Implementation |
|----------|---------------|
| Truncate input | Take first N characters or last N characters |
| Summarize first | Pre-process with a summary step |
| Chunk processing | Split long documents into sections |
| Remove boilerplate | Strip headers, footers, signatures |
| Use references | Pass IDs instead of full content |

### 6.4 Token Optimization Pattern

```
[Long document input]
       |
       v
[Condition: Length > 3000 characters?]
   |--YES-->
   |  [Extract key sections only]
   |  [Remove headers/footers/signatures]
   |  [Summarize if still too long]
   |
   |--NO-->
   |  [Use full text]
   |
   v
[Build prompt with optimized input]
       |
       v
[Call GPT with optimized context]
```

---

## 7. Human Review

### 7.1 When to Require Human Review

| Scenario | Action |
|----------|--------|
| Confidence below threshold | Route to reviewer |
| Output contains flagged keywords | Route to reviewer |
| Output structure unexpected | Route to reviewer |
| High-value or high-risk decision | Always require review |
| Financial/legal/medical content | Always require review |
| First 50 uses of new prompt | Require review for validation |

### 7.2 Human Review Integration

```
[GPT generates output]
       |
       v
[Confidence/validation check]
       |
       +-->[Auto-approved]--> [Save and proceed]
       |
       +-->[Needs review]--> [Create review task]
                                 |
                                 v
                           [Reviewer sees:
                            - Original input
                            - GPT output
                            - Confidence score
                            - Edit and approve/reject]
                                 |
                                 v
                           [Approved]--> [Save and proceed]
                           [Rejected]--> [Log feedback, retry]
```

### 7.3 Feedback Loop

Track human corrections to improve prompts:

| Field | Purpose |
|-------|---------|
| Original GPT Output | What GPT produced |
| Corrected Output | What human changed it to |
| Correction Type | Factual, formatting, missing info |
| Prompt Version | Which prompt was used |
| Date | When correction made |

Use correction data to refine prompts quarterly.

---

## 8. Prompt Engineering Best Practices

### 8.1 Prompt Structure

```
[Role Definition]
You are an expert [role] specializing in [domain].

[Task Definition]
Your task is to [specific task] from the provided [input type].

[Output Format]
Return your response as a JSON object with these fields:
- field1 (type): description
- field2 (type): description

[Rules/Constraints]
1. Rule one
2. Rule two
3. Rule three

[Examples - Few-shot learning]
Example 1:
Input: [example input]
Output: {"field1": "value1", "field2": "value2"}

[Input]
{DynamicContent}
```

### 8.2 Temperature Setting

| Temperature | Use Case | Consistency | Creativity |
|-------------|----------|-------------|------------|
| 0.0 | Data extraction, classification | Maximum | None |
| 0.3 | Structured output, JSON | High | Low |
| 0.5 | General purpose | Medium | Medium |
| 0.7 | Content generation | Low | High |
| 1.0 | Creative writing | Minimum | Maximum |

> **For business automation:** Use temperature 0.0-0.3. Consistency and accuracy are more important than creativity.

### 8.3 Prompt Versioning

Version control your prompts:

| Version | Date | Changes | Performance |
|---------|------|---------|-------------|
| 1.0 | 2024-01-15 | Initial prompt | 75% accuracy |
| 1.1 | 2024-02-01 | Added examples | 85% accuracy |
| 1.2 | 2024-03-01 | Stronger JSON constraint | 92% accuracy |

---

## 9. Security and Compliance

### 9.1 Data Handling

| Concern | Mitigation |
|---------|-----------|
| PII in prompts | Sanitize inputs before sending to GPT |
| Sensitive data | Use Azure OpenAI with private endpoints |
| Data residency | Confirm Azure region meets requirements |
| Output storage | Store securely, follow data classification |
| Audit trail | Log all GPT interactions |

### 9.2 Input Sanitization Checklist

- [ ] Remove SSN, credit card numbers, account numbers
- [ ] Remove names and personal identifiers (if not needed)
- [ ] Remove proprietary/confidential information
- [ ] Anonymize customer data
- [ ] Confirm data classification allows AI processing

---

## 10. Development Steps

### 10.1 Implementation Checklist

- [ ] Define use case and success criteria
- [ ] Identify input data sources
- [ ] Design output schema (JSON)
- [ ] Write initial prompt
- [ ] Test with 10-20 sample inputs
- [ ] Measure accuracy against human baseline
- [ ] Iterate on prompt (add examples, constraints)
- [ ] Implement error handling
- [ ] Build human review process
- [ ] Implement logging and monitoring
- [ ] Test edge cases and error scenarios
- [ ] Document prompt and expected behavior
- [ ] Train users on review process

### 10.2 Testing Prompts

Create a test matrix:

| Test Case | Input | Expected Output | Actual | Pass? |
|-----------|-------|----------------|--------|-------|
| Normal case | Standard input | Valid JSON | | |
| Empty input | "" | Error/null handled | | |
| Long input | Max tokens | Truncated/processed | | |
| Gibberish input | Random text | Graceful error | | |
| Malicious input | SQL injection attempt | Sanitized/error | | |
| Multi-language | Spanish text | Correct output | | |
| Edge values | Zero, null, max | Correct handling | | |

---

## 11. Licensing

| Component | License Required |
|-----------|-----------------|
| AI Builder GPT | AI Builder credits |
| Power Automate flow | Standard (if standard connectors) or Premium |
| Power Apps integration | Per user or per app |

> **WARNING:** GPT credits are consumed per call and depend on input+output token count. Monitor usage closely. Costs can escalate quickly with high-volume scenarios.

---

## 12. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Hallucination (false output) | Critical | Human review, validation rules, factual constraints |
| Inconsistent output | High | Low temperature, structured output, few-shot examples |
| Token cost escalation | Medium | Input optimization, caching, batching |
| Service availability | Medium | Retry logic, fallback process |
| Data privacy | High | Input sanitization, private endpoints |
| Regulatory compliance | High | Human review for regulated industries |
| Prompt injection attacks | Medium | Input validation, output sanitization |
| Model deprecation | Low | Monitor Microsoft announcements |
