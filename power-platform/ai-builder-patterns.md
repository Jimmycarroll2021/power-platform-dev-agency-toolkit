---
title: "AI Builder Patterns"
description: "Patterns for implementing AI Builder models in Power Platform"
category: "ai"
tags: ["ai-builder", "ai", "document-processing", "gpt", "prediction"]
verified_as_of: 2026-06-19
platform_state: 2026-H1
sources:
  - https://learn.microsoft.com/en-us/ai-builder/credit-management
  - https://learn.microsoft.com/en-us/ai-builder/administer-licensing
  - https://learn.microsoft.com/en-us/ai-builder/message-management
  - https://learn.microsoft.com/en-us/ai-builder/form-processing-model-requirements
  - https://learn.microsoft.com/en-us/ai-builder/prediction-prereq
  - https://learn.microsoft.com/en-us/ai-builder/licensing-prompt-tokens
---

# AI Builder Patterns

## 1. Document Processing Pipeline

### End-to-End Flow

```
[Document Received]
    │
    ▼
[AI Builder: Document Processing]
    │
    ├──▶ Extract: Invoice Number
    ├──▶ Extract: Date
    ├──▶ Extract: Total Amount
    ├──▶ Extract: Vendor
    │
    ▼
[Parse Results]
    │
    ├──▶ Confidence > 90%?
    │    ├── Yes → [Auto-process]
    │    └── No  → [Human review queue]
    │
    ▼
[Update Dataverse]
    │
    ▼
[Trigger downstream process]
```

### Implementation

```
Trigger: When email arrives with attachment
  │
  ▼
Action: "Predict" (AI Builder document processing)
  Model: Invoice Processing
  Document: Email attachment
  │
  ▼
Condition: confidence > 0.90
  │
  ├──▶ Yes:
  │    [Parse JSON: prediction output]
  │    [Create Dataverse record]
  │    [Send confirmation email]
  │
  └──▶ No:
       [Create review task]
       [Send Teams notification]
       [Add to review queue]
```

---

## 2. Classification then Extraction

### Two-Stage Pattern

```
Stage 1: Classification
  └── Determine document type (Invoice, PO, Contract, etc.)

Stage 2: Type-Specific Extraction
  └── Route to appropriate document processing model
```

### Implementation

```
[Trigger: File uploaded to SharePoint]
  │
  ▼
[AI Builder: Text Classification]
  Model: DocumentTypeClassifier
  Input: Document content
  │
  ▼
[Switch: Predicted class]
  │
  ├──▶ "Invoice"
  │    [AI Builder: Invoice Processing]
  │    [Extract invoice fields]
  │
  ├──▶ "Purchase Order"
  │    [AI Builder: Custom PO Model]
  │    [Extract PO fields]
  │
  ├──▶ "Contract"
  │    [AI Builder: Custom Contract Model]
  │    [Extract contract fields]
  │
  └──▶ Default
       [Flag for manual classification]
       [Add to general review queue]
```

---

## 3. GPT Prompt with JSON Output

### Structured Output Pattern

```
[Trigger: Form submitted]
  │
  ▼
[AI Builder: Create text with GPT]
  Prompt: |
    Analyze the following customer feedback and return a JSON object.
    
    Feedback: @{triggerBody()['feedback']}
    
    Return ONLY a JSON object with this structure:
    {
      "sentiment": "positive|negative|neutral",
      "category": "product|service|billing|other",
      "urgency": 1-5,
      "action_items": ["item1", "item2"],
      "summary": "brief summary"
    }
  │
  ▼
[Parse JSON]
  Schema: {"sentiment":"string","category":"string","urgency":"number",
           "action_items":["string"],"summary":"string"}
  │
  ▼
[Switch: sentiment]
  ├──▶ "negative" + urgency >= 4 → [Escalate to manager]
  ├──▶ "negative" → [Create support ticket]
  └──▶ Default → [Log and acknowledge]
```

### Prompt Template

```
You are a @{variables('Role')} assistant.

Task: @{variables('Task')}

Context:
@{variables('Context')}

Input:
@{triggerBody()['text']}

Instructions:
@{variables('Instructions')}

Return ONLY valid JSON. No additional text.
```

---

## 4. Form Processing Pattern

### Training and Usage

```
Step 1: Create model
  └── AI Builder > Models > Form processing > New

Step 2: Upload training documents
  └── Minimum 5 documents per collection (group of same-layout docs); max 20 per collection
  └── Tag fields on each document
  └── Training files must be PDF, JPG, or PNG (TIFF not allowed for training); max 20 MB per doc
  # Verified: https://learn.microsoft.com/en-us/ai-builder/form-processing-model-requirements

Step 3: Train model
  └── AI Builder > Train

Step 4: Quick test
  └── Upload test document
  └── Verify field accuracy

Step 5: Publish
  └── Make available for use

Step 6: Integrate
  └── Add to Power Automate flow or Power App
```

### Flow Integration

```
[Trigger: File created in SharePoint]
  │
  ▼
[Get file content]
  │
  ▼
[AI Builder: Extract information from documents]
  Model: MyFormModel
  Form document: File content
  │
  ▼
[Apply to each: extracted fields]
  │
  ▼
[Condition: Confidence check]
  ├──▶ All fields > 80% → [Auto-create record]
  └──▶ Any field < 80% → [Queue for review]
```

---

## 5. Prediction Pattern

### Historical Data Training

```
Prerequisites:
- Minimum 50 historical rows to train; at least 10 rows per outcome class; 1,000+ rows recommended for accuracy
  # Verified: https://learn.microsoft.com/en-us/ai-builder/prediction-prereq
- Data must live in Microsoft Dataverse (Read privilege required)
  # Verified: https://learn.microsoft.com/en-us/ai-builder/prediction-prereq
- Binary outcome field (Yes/No) or numerical target
- At least 5 potential influencing fields (unverified as of 2026-06-19 — confirm against Microsoft Learn; the prediction prerequisites page specifies row/class minimums but does not state a minimum number of input columns)

Example: Predict customer churn
- Historical: 1000 customer records with churn outcome
- Influencers: Tenure, Support tickets, Usage, Plan type, etc.
- Target: Churned (Yes/No)
```

### Implementation

```
[Recurrence: Daily]
  │
  ▼
[List rows: Active customers]
  │
  ▼
[Apply to each: customer]
  │
  ├──▶ [AI Builder: Predict]
  │      Model: ChurnPrediction
  │      Input: Customer record fields
  │
  ├──▶ [Condition: Prediction probability > 0.7]
  │      ├── Yes → [Create retention task]
  │      │         [Assign to account manager]
  │      │         [Add to churn risk report]
  │      └── No → [Log prediction]
  │
  └──▶ [Update record: Prediction result]
```

---

## 6. Human Review Integration

### Review Queue Pattern

```
[AI Model Output]
    │
    ├──▶ High Confidence (≥ 90%)
    │    └── Auto-process
    │
    ├──▶ Medium Confidence (70-89%)
    │    └── Quick review (approve/reject)
    │
    └──▶ Low Confidence (< 70%)
         └── Full manual review
```

### Review Flow

```
[After AI prediction]
  │
  ▼
[Create review record]
  Table: AIReviewQueue
  Fields: Document, Predicted values, Confidence, Status = "Pending"
  │
  ▼
[Send approval request]
  To: Reviewer
  Details: Extracted fields with confidence scores
  │
  ▼
[Wait for approval]
  │
  ├──▶ Approved → [Update record: Status = "Verified"]
  │               [Proceed with downstream process]
  │
  └──▶ Rejected → [Update record: Status = "Needs correction"]
                  [Route to manual data entry]
```

---

## 7. Credit / Capacity Management

> Licensing note (2026-H1): AI Builder is consumed via **AI Builder credits** and/or **Copilot Credits**.
> Since **November 1, 2025**, new customers can no longer buy the AI Builder capacity add-on and must
> purchase Copilot Credits to run AI Builder features; existing customers can renew/true-up the add-on up
> to **November 1, 2026**. AI Builder credits seeded in Power Platform/Dynamics licenses are removed on
> **November 1, 2026**. In apps/flows, consumption draws AI Builder credits first, then Copilot Credits;
> agents and agent flows consume Copilot Credits only.
> Verified: https://learn.microsoft.com/en-us/ai-builder/credit-management ,
> https://learn.microsoft.com/en-us/ai-builder/message-management

### Consumption model (how credits are actually charged)

Each capability has its **own** consumption mechanism — there is no flat "credits per 1,000 calls" rate
across capabilities. Use the authoritative **AI Builder capability rate table** for the live per-capability
rates; the figures below are illustrative of the model, not a price list.

- **Document processing** is charged **per page** — every page processed consumes credits even if it
  contains no extractable data. (Microsoft's worked example: receipt processing = **32 credits per receipt**.)
- **AI prompts / "Create text with GPT"** are charged by **token count** (input + system + output/reasoning
  tokens) and by the underlying model tier (Basic/Standard/Premium) — not a fixed per-call rate.
  Verified: https://learn.microsoft.com/en-us/ai-builder/licensing-prompt-tokens
- **Prediction**, **text/category classification**, and **object detection** each consume credits per call at
  their own published rate in the rate table.
- The earlier per-1,000-call credit figures and static USD costs in this doc were not Microsoft-published
  rates and have been removed.

| Item | Verified value |
|------|----------------|
| AI Builder capacity add-on (T1/T2/T3) | 1,000,000 AI Builder credits per add-on |
| Power Automate Premium seeded credits | 5,000 (removed 2026-11-01) |
| Power Apps Premium seeded credits | 500 (removed 2026-11-01) |
| Document processing throughput | up to 360 documents per environment per 60 seconds (unverified as of 2026-06-19 — confirm against Microsoft Learn) |
| Per-capability credit/USD rate card | See AI Builder capability rate table + Power Platform Licensing Guide (PDF) |

Verified: https://learn.microsoft.com/en-us/ai-builder/credit-management ,
https://learn.microsoft.com/en-us/ai-builder/administer-licensing

### Optimization

- Cache results for identical inputs
- Batch documents where possible (note: document processing bills **per page**, so fewer pages = fewer credits)
- Use prebuilt models when they fit the need rather than training a custom model
- Implement confidence thresholds to reduce unnecessary processing
- Monitor usage in **Power Platform admin center > Licensing > Capacity add-ons > Summary**, the downloadable
  AI Builder consumption report, and the **AI Builder Activity** page in the Power Automate portal
  (verified: https://learn.microsoft.com/en-us/ai-builder/credit-management ).
  Note: training models and testing prebuilt/custom models do **not** consume credits — but AI prompts always
  do, even in preview.

---

## 8. Model Lifecycle

```
[Create] → [Train] → [Test] → [Publish] → [Monitor] → [Retrain]
  │         │         │         │           │           │
  │         │         │         │           │           └──▶ New data
  │         │         │         │           │
  │         │         │         │           └──▶ Accuracy metrics
  │         │         │         │
  │         │         │         └──▶ Available in flows/apps
  │         │         │
  │         │         └──▶ Quick test with sample docs
  │         │
  │         └──▶ Tag fields, upload docs, train
  │
  └──▶ Define model type, name, description
```
