# AI Builder Comprehensive Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Applies to**: AI Builder in Power Platform
> **Needs verification against current Microsoft docs**: AI Builder credit allocation, model availability, and pricing change frequently. GPT model availability varies by region.

---

## 1. AI Builder vs Azure AI vs Azure OpenAI: Decision Framework

| Factor | AI Builder | Azure AI | Azure OpenAI |
|--------|------------|----------|-------------|
| **Skill level** | Low-code | Pro code | Pro code |
| **Integration** | Native Power Platform | Via custom connector | Via custom connector |
| **Custom models** | Pre-built + limited custom | Fully custom | GPT only |
| **Cost model** | Per-credit consumption | Per-call + infrastructure | Per-token |
| **Document processing** | Excellent | Good (Document Intelligence) | N/A |
| **GPT/prompts** | Included (credit cost) | N/A | Direct API |
| **When to choose** | Power Platform projects | Complex ML, custom models | GPT apps, chat |

```
Decision Tree:
  Already building in Power Platform? -> AI Builder (easiest integration)
  Need advanced ML training? -> Azure AI / Azure ML
  Need GPT-4 custom fine-tuning? -> Azure OpenAI
  Need document extraction in a flow? -> AI Builder
  Budget constraint on credits? -> Compare AI Builder vs Azure AI costs
```

---

## 2. All AI Builder Model Types

### 2.1 Document Processing Models

| Model | Use Case | Sample Docs | Credit Cost |
|-------|----------|-------------|-------------|
| **Invoice Processing** | Extract invoice fields | Invoices from vendors | ~High |
| **Receipt Processing** | Expense receipt extraction | Employee receipts | ~Medium |
| **Identity Document** | Extract passport, license info | Government IDs | ~Medium |
| **Business Card** | Contact info extraction | Business cards | ~Low |
| **Custom Document** | Any structured/semi-structured form | Your custom forms | ~High (training) |
| **Text Recognition (OCR)** | Extract text from any image | Scanned docs, photos | ~Low |

**Document Processing Pipeline**:
```
Step 1: Ingest document (email, SharePoint, upload)
Step 2: AI Builder extraction model
Step 3: Confidence score check (< 0.8 -> human review)
Step 4: Data validation (rules-based)
Step 5: Write to Dataverse/SharePoint
Step 6: Notify stakeholders
Step 7: Archive original document
```

### 2.2 Classification Models

| Model | Use Case | Training Data |
|-------|----------|---------------|
| **Category Classification** | Classify text into categories | 50+ labeled samples per category |
| **Entity Extraction** | Extract named entities from text | 50+ labeled samples |
| **Sentiment Analysis** | Determine text sentiment | Pre-built (no training) |
| **Language Detection** | Detect language of text | Pre-built (no training) |
| **Key Phrase Extraction** | Extract key phrases | Pre-built (no training) |
| **Text Translation** | Translate between languages | Pre-built (no training) |

### 2.3 Prediction and Specialized Models

| Model | Use Case | Training Data | Notes |
|-------|----------|---------------|-------|
| **Prediction** | Predict outcomes | 300+ historical records with outcomes | Dataverse only |
| **Object Detection** | Identify objects in images | 15+ images per object | Images must be labeled |
| **Formulas (GPT)** | Generate text with prompts | None (prompt-based) | Credit per call |

---

## 3. GPT Prompts in Power Automate and Power Apps

### 3.1 Creating a GPT Prompt

```
Step 1: AI Builder > Explore > GPT Prompts > Create
Step 2: Define prompt with input variables:

Prompt text:
  "You are a customer service assistant. Summarize the following
   customer complaint in 2-3 sentences. Identify the product category,
   urgency level (Low/Medium/High), and suggested action.

   Customer Message: {CustomerMessage}

   Respond in JSON format with fields: summary, category, urgency, suggestedAction"

Step 3: Test with sample inputs
Step 4: Save prompt
Step 5: Use in flow or app
```

### 3.2 Using GPT Prompt in Power Automate

```
Action: Create text with GPT (AI Builder)
  - Prompt: Select your saved prompt
  - CustomerMessage: triggerBody()['emailBody']
  - Output: Generated text (JSON string)

Next: Parse JSON action
  Content: Output from GPT action
  Schema: Define expected JSON structure

Condition: Check confidence/validity
  If valid: Continue processing
  If invalid: Route to human review
```

### 3.3 JSON Structured Outputs

```
ALWAYS request JSON output from GPT prompts:

Prompt template:
  "Extract the following information from the document text.
   Return ONLY a JSON object with no markdown, no explanation.

   Required fields:
   - invoiceNumber (string)
   - invoiceDate (YYYY-MM-DD format)
   - totalAmount (number, no currency symbol)
   - vendorName (string)
   - lineItems (array of objects with: description, quantity, unitPrice, lineTotal)

   Document text: {DocumentText}"

After GPT action:
  1. Parse JSON (with error handling)
  2. Validate required fields exist
  3. Validate data types
  4. Check reasonable ranges (amount > 0, date not in future)
  5. If any validation fails -> human review queue
```

---

## 4. AI Builder Credits and Capacity

### 4.1 Credit Allocation Model

```
Credit consumption by model type (approximate - verify current rates):

Model Type                          Credits per Call (approximate)
--------------------------------    ------------------------------
Text Recognition (OCR)              ~1-5
Language Detection                  ~1
Sentiment Analysis                  ~1
Key Phrase Extraction               ~1
Text Translation                    ~1-5
Category Classification             ~5-20
Entity Extraction                   ~5-20
Receipt Processing                  ~50-100
Invoice Processing                  ~100-300
Identity Document                   ~50-100
Business Card                       ~10-50
Custom Document (per page)          ~100-500
Object Detection                    ~50-200
Prediction (per row)                ~1-10
GPT Prompt                          ~Variable (depends on tokens)

Training costs:
  Custom document model: ~5,000-50,000 credits
  Category classification: ~1,000-5,000 credits
  Prediction model: ~5,000-20,000 credits
```

**Needs verification against current Microsoft docs**: Credit consumption rates change. Verify current rates before estimating costs.

### 4.2 Credit Licensing

```
Included credits (verify current allocation):
  - Some Power Apps licenses include credits
  - Dynamics 365 licenses may include credits
  - Standalone: $500 per 1M credits/month

How to check tenant credits:
  Power Platform Admin Center > Resources > Capacity > AI Builder credits

How to check environment credits:
  make.powerapps.com > AI Builder > Help > Credits
```

### 4.3 Estimating Credit Usage for a Project

```
Example: Invoice Processing for 1000 invoices/month

Step 1: Identify all AI Builder actions per invoice:
  - AI Builder Invoice model: 1 call = ~200 credits
  - GPT prompt for summary: 1 call = ~50 credits
  - Total per invoice: ~250 credits

Step 2: Calculate monthly consumption:
  1000 invoices x 250 credits = 250,000 credits/month

Step 3: Add training costs (amortized):
  Custom model training: 20,000 credits (one-time)
  Monthly: 250,000 + (20,000 / 12) = ~252,000 credits

Step 4: Add 30% buffer:
  252,000 x 1.3 = ~328,000 credits/month

Step 5: Convert to licensing:
  If included credits < 328,000/month:
    Need to purchase additional capacity
```

---

## 5. Monitoring Credit Usage

### 5.1 Monitoring Methods

```
Method 1: Admin Center
  Power Platform Admin Center > Resources > Capacity > AI Builder
  Shows: Total allocated, used, remaining

Method 2: AI Builder Portal
  make.powerapps.com > AI Builder > Help
  Shows: Environment-level usage

Method 3: Power Automate Analytics
  Flow runs > Filter by AI Builder actions
  Shows: Per-flow consumption

Method 4: Custom monitoring flow
  Trigger: Daily schedule
  Action: Call Dataverse API to read usage
  Action: Write to monitoring SharePoint list
  Action: Alert if usage > threshold
```

### 5.2 Setting Up Alerts

```
Recommended approach:
1. Create "AI Credit Alert" cloud flow
2. Daily recurrence at 9 AM
3. HTTP call to admin API for usage
4. Condition: If usage > 80% of allocation
5. If true:
   - Send Teams notification to admin
   - Send email to project manager
   - Log to Dataverse monitoring table

Alert thresholds:
  - Yellow: 70% of monthly allocation
  - Orange: 85% of monthly allocation
  - Red: 95% of monthly allocation (emergency)
```

---

## 6. Human Review Design Patterns

### 6.1 Confidence Score Routing

```
After AI Builder extraction:

Condition: Check confidence scores
  - All fields >= 0.9: Auto-process (no human review)
  - Any field 0.7-0.9: Human review required (flagged)
  - Any field < 0.7: Full manual entry required

Implementation:
  1. AI Builder extracts data
  2. Parse output including confidence per field
  3. Calculate minimum confidence
  4. Route based on threshold:
     - Auto: Write to system directly
     - Flagged: Create review task in Dataverse
     - Manual: Create blank entry with original doc attached
  5. Track human review metrics (accuracy, time)
```

### 6.2 Human Review UI (Power Apps)

```
Screen: "Document Review"
  - Left side: Original document viewer (PDF/image)
  - Right side: Extracted data fields
    - Green border: High confidence (>0.9)
    - Yellow border: Medium confidence (0.7-0.9) - editable
    - Red border: Low confidence (<0.7) - empty, manual entry
  - Buttons: Approve, Reject, Send Back
  - Save: Writes corrected data to Dataverse

Gallery: "Review Queue"
  - Filter: Status = "Pending Review"
  - Sorted: Priority (high confidence first = faster processing)
  - Shows: Document thumbnail, AI confidence, time in queue
```

---

## 7. Hallucination Mitigation

### 7.1 Strategies for GPT Prompts

```
1. STRUCTURED OUTPUT
   Always request JSON with specific schema
   Validate returned JSON against schema
   Reject outputs that don't match expected format

2. CONFIDENCE THRESHOLDS
   GPT doesn't provide native confidence scores
   Implement indirect confidence checks:
   - Required fields present?
   - Values in expected ranges?
   - Consistency across related fields?

3. HUMAN-IN-THE-LOOP
   First 100 outputs: 100% human review
   After validation: Gradual reduction based on accuracy metrics
   Maintain 10-20% random sampling for ongoing QA

4. PROMPT ENGINEERING
   - Be specific about output format
   - Include examples in prompt (few-shot)
   - Set constraints ("respond with only the JSON object")
   - Add validation rules in prompt

5. FALLBACK HANDLING
   If GPT output fails validation:
   - Don't fail the flow
   - Route to human review queue
   - Log failure reason for prompt improvement
```

### 7.2 Validation Rules for AI Output

```
Always validate before writing to system:

Date fields:
  - Not null
  - Not in the future (for invoice dates)
  - Within reasonable range (not 1900 or 2100)
  - Valid date format

Numeric fields:
  - Not null
  - Positive (for amounts)
  - Within expected range (flag $1M invoice)
  - Reasonable precision

Text fields:
  - Not null (for required fields)
  - Length within limits
  - No suspicious characters (SQL injection check)
  - Matches expected patterns (regex)

Cross-field validation:
  - Line items sum = total amount
  - Invoice date < due date
  - Vendor exists in master data
```

---

## 8. Document Processing Pipeline Design

### 8.1 End-to-End Architecture

```
Ingestion Layer:
  - Email inbox (Power Automate trigger)
  - SharePoint document library
  - Power Apps upload
  - Power Pages portal upload
  - Direct API upload

Classification Layer:
  - AI Builder Category Classification
  - OR: Rules-based (email subject, folder, sender)
  - Output: Document type (invoice, receipt, contract)

Extraction Layer:
  - Route to appropriate model:
    Invoice -> Invoice Processing model
    Receipt -> Receipt Processing model
    Custom -> Custom Document model
  - Extract all fields
  - Return structured data + confidence scores

Validation Layer:
  - Business rules validation
  - Master data matching (vendor lookup)
  - Cross-field validation
  - Duplicate detection

Review Layer (conditional):
  - Auto-approve if confidence high
  - Human review if confidence medium
  - Manual entry if confidence low

Integration Layer:
  - Write to Dataverse/ERP/Accounting system
  - Create workflow tasks
  - Send notifications
  - Archive document
```

### 8.2 Classification -> Extraction -> Approval Pattern

```
Flow: "Document Processing Pipeline"

Trigger: When email arrives in invoices@company.com

1. Save attachment to SharePoint (Processing folder)

2. AI Builder: Text Recognition (OCR)
   - Extract all text from document

3. AI Builder: Category Classification
   - Input: OCR text
   - Categories: ["Invoice", "Receipt", "Statement", "Other"]
   - Output: Document type + confidence

4. Switch (based on document type):
   Case "Invoice":
     4a. AI Builder: Invoice Processing
     4b. Validate extracted fields
     4c. Check confidence scores
   Case "Receipt":
     4a. AI Builder: Receipt Processing
     4b. Validate extracted fields
   Default:
     4a. Flag for manual processing
     4b. Create support ticket

5. Condition: All confidence scores > 0.85?
   Yes:
     6a. Write to Dataverse (Invoices table)
     6b. Create approval task (if amount > $1000)
     6c. Move to Processed folder
   No:
     6a. Create review task in Power Apps
     6b. Move to Review folder
     6c. Notify reviewer

7. Send confirmation email to sender

8. Log to audit table (processing time, accuracy, action taken)
```

---

## 9. Region Availability Notes

```
AI Builder models are NOT available in all regions.

Before proposing AI Builder to client:
1. Check region availability:
   https://learn.microsoft.com/en-us/ai-builder/availability-region

2. Common limitations:
   - GPT prompts: Limited regions (check current list)
   - Custom models: May not be available in sovereign clouds
   - Preview models: Usually only in select regions

3. Workaround if not available:
   - Use Azure OpenAI via custom connector
   - Use Azure AI Document Intelligence
   - Process in available region (data residency considerations)

Needs verification against current Microsoft docs:
  Region availability changes frequently with new model releases.
```

---

## 10. Licensing and Cost Estimation

### 10.1 Cost Components

```
AI Builder project costs:

1. Base licensing:
   - Power Apps/Automate licenses (if not already owned)
   - AI Builder credit allocation

2. Credit consumption:
   - Model training (one-time per model)
   - Model inference (per document/call, ongoing)
   - GPT prompts (per token, ongoing)

3. Storage:
   - Dataverse storage for extracted data
   - SharePoint/File storage for source documents

4. Development:
   - Model training and testing time
   - Flow development
   - Review UI development
   - Integration development

5. Ongoing operations:
   - Human review staffing (if needed)
   - Model retraining (periodic)
   - Monitoring and support
```

### 10.2 Quick Cost Calculator

```
Project: Invoice Processing
Volume: 2,000 invoices/month

AI Builder Credits:
  Inference: 2,000 x 200 credits = 400,000/month
  Training: 20,000 (one-time, amortize over 12 months) = ~1,700/month
  Buffer (30%): 120,500/month
  Total: ~522,000 credits/month

Licensing:
  If client has existing allocation: Check if sufficient
  If not: 1M credits = ~$500/month (verify current pricing)
  Cost: ~$250/month (using half of 1M pack)

Storage:
  2,000 invoices x 500KB = 1GB/month
  Dataverse: Included in existing capacity likely
  SharePoint: Included in M365

Human Review (estimate 10% need review):
  200 invoices x 5 minutes = ~17 hours/month
  At $30/hour = $510/month

Total monthly: ~$260 (AI) + $510 (review) = ~$770/month
Compare to manual processing: 2,000 x 15 min = 500 hours/month = $15,000
Savings: ~95%
```

---

## 11. Common Mistakes and Anti-Patterns

| Mistake | Why It's Bad | Solution |
|---------|-------------|----------|
| Not estimating credit usage | Budget overrun mid-project | Calculate before starting |
| No human review design | AI errors go straight to system | Build review queue |
| Training with too few samples | Poor accuracy | Minimum 5-10 samples, more is better |
| Ignoring confidence scores | Accepting low-confidence extractions | Always check and route |
| Not validating AI output | Data corruption in downstream systems | Validation rules in flow |
| Single model for all doc types | Poor accuracy across variations | Separate models per type |
| No retraining plan | Model degrades over time | Schedule quarterly review |
| Not testing with real data | Surprises in production | Test with 100+ real documents |
| No fallback for AI failure | Flow breaks, data lost | Try-catch + human queue |
| Expecting 100% accuracy | AI will make mistakes | Design for ~85-95% accuracy |
| Not monitoring usage | Run out of credits unexpectedly | Set up monitoring alerts |
| Using AI when rules suffice | Unnecessary cost and complexity | Rules-based first, AI if needed |
| Ignoring data privacy | Sending sensitive data to AI | Review data handling, use private endpoints |

---

*End of AI Builder Guide. Verify all credit rates, model availability, and pricing against current Microsoft documentation before client engagements.*
