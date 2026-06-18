---
title: "AI Builder Patterns"
description: "Patterns for implementing AI Builder models in Power Platform"
category: "ai"
tags: ["ai-builder", "ai", "document-processing", "gpt", "prediction"]
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
  └── Minimum 5 documents
  └── Tag fields on each document

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
- Minimum 50 historical records
- Binary outcome field (Yes/No) or numerical target
- At least 5 potential influencing fields

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

## 7. Credit Management

### Estimation

| Model Type | Credits per 1,000 calls | Cost (USD) |
|-----------|------------------------|------------|
| Document processing | 60 | $30 |
| Text classification | 30 | $15 |
| Prediction | 45 | $22.50 |
| Object detection | 90 | $45 |
| GPT prompt | 15 | $7.50 |

### Optimization

- Cache results for identical inputs
- Batch documents where possible
- Use prebuilt models when available (cheaper)
- Implement confidence thresholds to reduce unnecessary processing
- Monitor usage in AI Builder > Models > Usage

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
