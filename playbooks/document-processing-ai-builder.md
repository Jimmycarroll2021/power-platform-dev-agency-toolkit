# AI Builder Document Processing Playbook

> **Complexity Rating:** Medium / High
> **Last Updated:** 2024
> **Applies To:** AI Builder Document Processing, Form Processing, Invoice Processing, Receipt Processing

---

## 1. When to Use AI Builder Document Processing

Use AI Builder document processing when:

| Scenario | Model Type | Example |
|----------|-----------|---------|
| Extract data from structured forms | Form Processing | Application forms, enrollment forms |
| Extract data from invoices | Invoice Processing | Vendor invoices, AP processing |
| Extract data from receipts | Receipt Processing | Expense reports, reimbursement |
| Extract data from identity documents | Identity Document | ID cards, passports |
| Extract data from custom document layouts | Custom Document | Contracts, agreements |
| Classify documents by type | Document Classification | Route invoices vs contracts vs POs |
| Extract text from any document | Text Recognition (OCR) | General document digitization |

### Decision Matrix

| Factor | Use AI Builder | Use Alternative |
|--------|---------------|----------------|
| Document volume | 10-10,000/month | >10,000/month: Azure AI Document Intelligence |
| Document complexity | Simple to moderate layouts | Complex tables: Azure AI Doc Intelligence |
| Integration needs | Power Platform native | Cross-platform: Azure |
| Custom training needed | Limited customization | Full control: Azure Custom Model |
| Budget | Moderate | Enterprise: Azure (more cost-effective at scale) |

---

## 2. When NOT to Use AI Builder Document Processing

> **DO NOT use AI Builder when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| > 10,000 documents/month | Azure AI Document Intelligence | Cost-effective at scale |
| Complex nested tables | Azure AI Document Intelligence | Better table extraction |
| Handwritten documents (large volume) | Azure Form Recognizer | Better handwriting recognition |
| Need custom ML model | Azure ML or custom code | Full control over model |
| Need on-premises processing | Azure Stack or local solution | Compliance requirement |
| Simple data extraction (no AI needed) | Power Automate + Parse actions | Cheaper, more reliable |
| Documents with no structure | Manual processing or human review | AI accuracy too low |
| Highly sensitive documents (classification) | Azure AI with private endpoints | Enhanced security |

---

## 3. Architecture

### 3.1 Document Processing Pipeline

```
[Document Received]
       |
       v
[Step 1: Document Intake]
       |-- Email attachment
       |-- SharePoint upload
       |-- Power Apps camera
       |-- API upload
       |
       v
[Step 2: Document Classification] (if needed)
       |-- What type of document is this?
       |-- Route to appropriate model
       |
       v
[Step 3: AI Builder Extraction]
       |-- Submit to trained model
       |-- Extract fields
       |-- Return structured data
       |
       v
[Step 4: Data Validation]
       |-- Confidence score check
       |-- Business rule validation
       |-- Reference data matching
       |
       v
[Step 5: Human Review] (if needed)
       |-- Low confidence fields flagged
       |-- Approver reviews and corrects
       |-- Corrections feed back to model
       |
       v
[Step 6: Data Export]
       |-- Save to Dataverse
       |-- Update external system
       |-- Trigger downstream processes
       |
       v
[Step 7: Archive]
       |-- Store original document
       |-- Link to extracted data
       |-- Retention policy applied
```

### 3.2 Architecture Diagram

```
[Email / SharePoint / App]
       |
       v
[Power Automate Flow]
       |
       +-->[AI Builder: Document Processing]
       |           |
       |           v
       |   [Extracted Fields + Confidence]
       |           |
       |           v
       +-->[Dataverse: Store Results]
       |           |
       |           v
       +-->[Validation Logic]
       |           |
       |       +---+---+
       |       |       |
       |    Pass    Fail (< threshold)
       |       |       |
       |       v       v
       |   [Export] [Human Review App]
       |               |
       |               v
       |           [Correct & Approve]
       |               |
       |               v
       |           [Export + Feedback]
       |
       v
[Business Process Continues]
```

---

## 4. Classification

### 4.1 Document Classification Strategy

Before extraction, classify documents to route to the correct model:

| Document Type | Identification Method | Model to Use |
|--------------|----------------------|-------------|
| Invoice | Keyword matching ("Invoice", "Bill To") | Invoice Processing |
| Receipt | Keywords + layout | Receipt Processing |
| Contract | Keywords ("Agreement", "Contract") | Custom Form Processing |
| Application | Form-specific keywords | Custom Form Processing |
| Unknown | No match | Human review queue |

### 4.2 Classification Implementation

**Option 1: Keyword-Based (Simple)**
```
[Read document text via OCR]
       |
       v
[Condition: Contains "Invoice" or "INVOICE"]
   |--YES--> [Route to Invoice Model]
   |--NO---> [Condition: Contains "Receipt"]
                 |--YES--> [Route to Receipt Model]
                 |--NO---> [Human Review Queue]
```

**Option 2: AI Builder Classification (Advanced)**
Train a document classification model:
- Upload samples of each document type
- Label each sample with its type
- Train classification model
- Use model to route documents

---

## 5. Extraction

### 5.1 Model Training Process

```
Step 1: Gather Training Documents
  |-- Minimum 5 documents per layout
  |-- Recommended: 10-20 for accuracy
  |-- Include variations (different vendors, formats)

Step 2: Create Model in AI Builder
  |-- Navigate to AI Builder > Models
  |-- Select model type (Form, Invoice, Receipt, etc.)
  |-- Upload training documents

Step 3: Tag Fields
  |-- Identify each field to extract
  |-- Draw bounding boxes around values
  |-- Label each field with meaningful name
  |-- Tag all training documents

Step 4: Train Model
  |-- Click "Train"
  |-- Wait for training to complete
  |-- Review training results

Step 5: Quick Test
  |-- Upload test document
  |-- Review extraction accuracy
  |-- Iterate on training if needed

Step 6: Publish Model
  |-- Publish when accuracy is acceptable
  |-- Model becomes available in Power Automate
```

### 5.2 Field Tagging Best Practices

| Practice | Why |
|----------|-----|
| Use consistent field names | Easier to use in flows |
| Tag ALL instances in training set | Improves accuracy |
| Include variations (different formats) | Improves generalization |
| Check for OCR errors in tags | Bad tags = bad model |
| Use descriptive field names | `InvoiceNumber` not `Field1` |

### 5.3 Supported Field Types

| Field Type | Description | Example |
|-----------|-------------|---------|
| String | Text values | Vendor name, description |
| Number | Numeric values | Amount, quantity |
| Date | Date values | Invoice date, due date |
| Checkbox | Checked/unchecked | Approved, received |
| Table | Repeating rows | Line items, details |

---

## 6. Validation

### 6.1 Confidence Score Thresholds

| Confidence Score | Action | Human Review Required |
|-----------------|--------|----------------------|
| > 90% | Auto-process | No |
| 70-90% | Process with flag | Optional |
| 50-70% | Flag for review | Yes |
| < 50% | Reject, manual entry | Required |

### 6.2 Validation Rules

| Rule Type | Example | Implementation |
|-----------|---------|---------------|
| Format validation | Invoice number format: INV-XXXX | Regex check |
| Range validation | Amount between $0 and $1,000,000 | Numeric check |
| Reference validation | Vendor exists in vendor master | Dataverse lookup |
| Cross-field validation | Total = sum of line items | Calculation check |
| Date validation | Invoice date not in future | Date comparison |
| Duplicate check | Invoice not already processed | Dataverse query |

### 6.3 Validation Flow

```
[Extracted Data]
       |
       v
[Check Confidence Scores]
       |
       +-->[Field 1: Confidence?]
       |       |--LOW--> [Flag for review]
       |       |--HIGH--> [Pass]
       |
       +-->[Field 2: Confidence?]
       |       |--LOW--> [Flag for review]
       |       |--HIGH--> [Pass]
       |
       v
[Apply Business Rules]
       |
       +-->[Format valid?]
       +-->[Reference exists?]
       +-->[Cross-field check?]
       |
       v
[All Passed?]
   |--YES--> [Auto-export]
   |--NO---> [Human Review Queue]
```

---

## 7. Approval Pipeline (Human Review)

### 7.1 Human Review App

Build a Canvas App for human reviewers:

| Screen | Purpose |
|--------|---------|
| Review Queue | List documents needing review |
| Review Detail | Side-by-side: original + extracted data |
| Correction Form | Edit extracted values |
| Approval Action | Approve / Reject / Send back |

### 7.2 Review Screen Layout

```
+------------------------------------------------+
| Document Review - Invoice #12345               |
+------------------------------------------------+
| +----------------+  +------------------------+ |
| |                |  | Extracted Data          | |
| |  [Document     |  |                         | |
| |   Preview]     |  | Invoice #: [12345  ]    | |
| |                |  | Date:      [01/15/24]   | |
| |                |  | Vendor:    [ABC Corp]   | |
| |                |  | Amount:    [$1,234.56]  | |
| |                |  |                         | |
| |                |  | Confidence: 87%         | |
| |                |  |                         | |
| +----------------+  | [Correct] [Approve]     | |
|                     | [Reject]  [Send Back]   | |
|                     +------------------------+ |
+------------------------------------------------+
```

### 7.3 Feedback Loop

> **IMPORTANT:** Corrections from human review should feed back to retrain the model:

```
[Human makes correction]
       |
       v
[Store corrected value in Dataverse]
       |
       v
[Weekly: Export corrected documents]
       |
       v
[Retrain AI model with corrections]
       |
       v
[Republish improved model]
```

---

## 8. Data Model

### 8.1 Document Processing Table

| Column | Type | Purpose |
|--------|------|---------|
| Document ID | Auto-number | Unique identifier |
| Document Type | Choice | Invoice, Receipt, Form |
| Status | Choice | Received, Processing, Review, Approved, Rejected |
| Original File | File | Uploaded document |
| Extracted JSON | Text | Raw AI Builder output |
| Confidence Score | Decimal | Overall confidence |
| Review Required | Yes/No | Flag for human review |
| Reviewed By | Lookup (User) | Who reviewed |
| Review Date | DateTime | When reviewed |
| Exported | Yes/No | Whether sent to downstream system |
| Error Details | Text | Any processing errors |

### 8.2 Audit Trail

| Column | Type | Purpose |
|--------|------|---------|
| Action | Choice | Extracted, Validated, Reviewed, Approved, Exported |
| Performed By | Lookup (User) | Who performed action |
| Performed At | DateTime | When action occurred |
| Details | Text | Additional information |
| Before Value | Text | Value before change |
| After Value | Text | Value after change |

---

## 9. Development Steps

### 9.1 Implementation Checklist

- [ ] Identify document types and volumes
- [ ] Collect minimum 5 sample documents per type
- [ ] Create AI Builder model
- [ ] Tag all fields in training documents
- [ ] Train and test model
- [ ] Build document intake flow
- [ ] Build validation logic
- [ ] Build human review app (if needed)
- [ ] Build export/integration flow
- [ ] Test end-to-end pipeline
- [ ] Train users on review process
- [ ] Set up monitoring and feedback loop

### 9.2 Flow Structure

```
[Trigger: Document uploaded to SharePoint]
  |
  v
[Get file content]
  |
  v
[AI Builder: Predict]
  |-- Model: [Your Model]
  |-- Document: [File Content]
  |
  v
[Parse JSON: Extraction results]
  |
  v
[Apply to each: Extracted fields]
  |-- Check confidence score
  |-- Store in Dataverse
  |
  v
[Condition: Any low confidence?]
  |--YES-->[Create review task]
  |--NO--->[Trigger export flow]
```

---

## 10. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| Model accuracy | Test with 20+ documents | > 85% field-level accuracy |
| Confidence calibration | Compare confidence vs actual accuracy | Well-calibrated |
| Validation rules | Test with invalid data | All invalid data caught |
| Human review workflow | Simulate low-confidence extraction | Review task created correctly |
| End-to-end timing | Time full pipeline | < 2 minutes per document |
| Error handling | Submit corrupted document | Graceful error, no data loss |
| Feedback loop | Submit correction | Correction stored, model improves |
| Scale test | Process 50 documents | No throttling, stable performance |

---

## 11. Licensing

| Component | License Required | Cost |
|-----------|-----------------|------|
| AI Builder model training | AI Builder credits | Part of base allocation |
| AI Builder model prediction | AI Builder credits per page | ~1 credit/page |
| Power Automate flow | Standard or Premium | Depends on connectors |
| Dataverse storage | Per GB | $48/GB/month |
| Power Apps (review app) | Per user or per app | Per app: $10/user/month |

> **WARNING:** AI Builder credits are consumed per page processed. A 10-page invoice uses ~10 credits. Monitor usage carefully. Base allocation: 1M credits/user/month (capped at tenant level).

---

## 12. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Model accuracy insufficient | High | More training data, human review fallback |
| Document layout changes | High | Retrain model, monitor accuracy |
| AI Builder credit exhaustion | Medium | Monitor usage, purchase additional |
| Data privacy (document content) | High | Secure storage, access controls |
| Processing delays | Medium | Queue-based architecture |
| Vendor invoice format variety | Medium | Multiple models or pre-processing |
| Over-reliance on auto-processing | Medium | Mandatory review for high-value items |
