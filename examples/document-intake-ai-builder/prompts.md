# AI Agent Prompts — Document Intake System

This document contains the structured prompts used to guide AI agents (GitHub Copilot, ChatGPT, Claude, or Microsoft Copilot) through building the Document Intake System. Each prompt is designed to produce production-ready Power Platform artifacts.

---

## Prompt 1: Document Classification Model Training

### Context
You are a Power Platform AI Builder specialist. I need to create a custom document classification model that categorizes incoming documents into 12 types. The organization receives ~2,500 documents per week via email, SharePoint, and a Power Apps upload interface.

### Prompt
```
Help me build an AI Builder custom document classification model with the following requirements:

DOCUMENT TAXONOMY (12 categories):
1. Invoice (INV) - Vendor invoices with payment terms and line items (~45% of volume)
2. Purchase Order (PO) - Internal/external purchase orders (~10%)
3. Contract (CON) - Legal agreements, MSAs, SOWs (~8%)
4. ID Document (ID) - Government-issued identification (~5%)
5. Onboarding Form (ONB) - New customer/employee registration forms (~12%)
6. Memo (MEM) - Internal memorandums and communications (~5%)
7. Compliance Document (CMP) - Regulatory filings, tax forms (~7%)
8. Receipt (RCP) - Expense receipts and proof of payment (~4%)
9. Bank Statement (STM) - Monthly financial statements (~2%)
10. Tax Form (TAX) - W-9, 1099, W-2 forms (~1%)
11. Insurance Document (INS) - Policies, certificates of insurance (~0.5%)
12. Unknown (UNK) - Unclassifiable documents (~0.5%)

DELIVERABLES NEEDED:
1. Step-by-step guide to create the classification model in AI Builder
2. Recommended minimum training samples per category (consider class imbalance)
3. Document collection and labeling guidelines for the business team
4. Model evaluation checklist (accuracy thresholds, confusion matrix targets)
5. Testing procedure with sample documents for each category
6. Retraining schedule and trigger conditions

CONSTRAINTS:
- Maximum 20 MB per document
- Maximum 10 pages per document
- Supported formats: PDF, PNG, JPG, TIFF
- Target: >94% classification accuracy per category
- Must handle rotated/scanned documents with varying quality

Include specific AI Builder portal navigation steps and screenshot descriptions for each step.
```

### Expected Output
- Complete model creation procedure
- Sample collection templates
- Testing scripts
- Accuracy validation checklist

---

## Prompt 2: Intake Orchestrator Flow Design

### Context
You are a Power Automate solution architect. I need to build the core orchestration flow that processes documents from ingestion through classification, extraction, and routing.

### Prompt
```
Design a Power Automate cloud flow that orchestrates the entire document intake pipeline. The flow must handle documents arriving from multiple sources and coordinate AI Builder model calls.

FLOW SPECIFICATION:
Name: doc_Flow_IntakeOrchestrator
Trigger: When a file is created in Azure Blob Storage (document-staging container)
Concurrency: 50 parallel runs
Timeout: 10 minutes
Error handling: Try-catch scopes with 3 retries

FLOW STEPS (design each in detail):

STEP 1 — Document Registration
- Initialize correlation ID (guid)
- Create record in Dataverse doc_document table with status "Received"
- Store blob metadata (filename, size, content type, source channel)

STEP 2 — Document Classification
- Call AI Builder: Predict using doc_ClassificationModel_v1
- Handle classification failure (route to Unknown review queue)
- Store classification result and confidence in Dataverse
- If confidence < 0.70, route to manual classification review

STEP 3 — Document Routing (Switch)
- Based on classification result, branch to appropriate extraction model:
  * Invoice → Call Invoice Extraction Model
  * Purchase Order → Call Custom PO Extraction Model
  * Contract → Call Custom Contract Extraction Model
  * ID Document → Call Custom ID Extraction Model
  * Onboarding Form → Call Custom Onboarding Extraction Model
  * Compliance → Call Custom Compliance Extraction Model
  * Receipt → Call Receipt Extraction Model (prebuilt)
  * Memo → Skip extraction (metadata only)
  * Other types → Custom extraction or manual review

STEP 4 — Data Extraction
- Call appropriate AI Builder extraction model
- Parse JSON response to extract field-value-confidence tuples
- Create doc_extraction records in Dataverse for each field
- Calculate average extraction confidence

STEP 5 — Confidence Evaluation
- If ALL fields have confidence >= 0.85:
  * Update doc_document status to "Auto-Approved"
  * Call Integration Export flow
  * Log audit entry
- If ANY field has confidence < 0.85:
  * Update doc_document status to "Pending Review"
  * Create doc_review_queue record
  * Send notification to review team
  * Log audit entry

STEP 6 — Error Handling
- Catch scope around entire flow
- On error: Update document status to "Failed"
- Store error message in doc_document.error_message
- Send admin alert via Teams
- Dead-letter failed documents with metadata

DELIVERABLES:
1. Complete flow design with action-by-action specifications
2. Expression formulas for JSON parsing and confidence calculations
3. Error handling scope design
4. Variable initialization list
5. Connection reference requirements
6. Performance optimization recommendations

Include the exact Dataverse table and column names from this schema:
- doc_document (main table)
- doc_extraction (field results)
- doc_review_queue (review items)
- doc_audit_log (audit trail)
```

### Expected Output
- Complete flow specification document
- JSON parsing expressions
- Error handling patterns
- Connection reference list

---

## Prompt 3: Review & Validation Canvas App

### Context
You are a Power Apps canvas app developer. I need to build a review application for document validators who review AI-extracted data and make corrections.

### Prompt
```
Build a Power Apps canvas app for document review and validation with the following specifications:

APP NAME: Document Review & Validation
AUDIENCE: AP Clerks, Onboarding Specialists, Document Reviewers
DATA SOURCE: Dataverse (doc_document, doc_extraction, doc_review_queue)

SCREEN 1 — QUEUE SCREEN
- Gallery showing documents assigned to current user
- Filter by: Priority (High/Normal), Status (Pending/In Progress), Document Type
- Sort by: Due Date (ascending), Priority
- Each item shows:
  * Document thumbnail (first page)
  * Document type badge (color-coded)
  * Priority indicator (red/yellow)
  * SLA countdown timer
  * Number of fields needing review
- Search bar for document number or filename
- Bulk select for mass assignment/reassignment

SCREEN 2 — REVIEW SCREEN (Split Pane)
Left Pane (60% width):
- PDF/Image viewer showing document pages
- Zoom in/out controls
- Page navigation (previous/next)
- Rotate button for sideways scans
- Fit-to-width and fit-to-page modes

Right Pane (40% width):
- Scrollable form of extracted fields
- Each field shows:
  * Field label and original extracted value
  * Confidence score indicator (green >=0.85, yellow 0.70-0.85, red <0.70)
  * Text input for corrected value (pre-filled with extracted value)
  * Reason code dropdown: Correct, WrongValue, Illegible, Missing, Other
  * Checkbox: "Confirm as correct" (one-click validation)
- "Confirm All" button to validate all fields at once
- "Submit Review" button with validation

SCREEN 3 — STATISTICS SCREEN
- Personal productivity cards:
  * Documents reviewed today/this week/this month
  * Average review time per document
  * Accuracy rate (fields confirmed vs corrected)
  * Current queue depth
- Bar chart: Daily review volume (last 7 days)
- Pie chart: Correction reason breakdown

TECHNICAL REQUIREMENTS:
- Responsive design (works on desktop tablets 1280x800 and above)
- Offline capability for review data caching
- Keyboard shortcuts: Ctrl+Enter (submit), Space (confirm field), Tab (next field)
- Auto-save draft reviews every 30 seconds
- Loading states for all async operations
- Error handling for network failures

DELIVERABLES:
1. Complete screen-by-screen design specification
2. Gallery and form control formulas
3. Data connection and delegation-safe query patterns
4. Component library specifications (reusable field editor, document viewer)
5. Performance optimization checklist
6. Accessibility compliance notes (WCAG 2.1 AA)
```

### Expected Output
- App design specification
- Power Fx formulas
- Component designs
- Performance guidelines

---

## Prompt 4: Document Upload Canvas App

### Context
You are building a self-service document upload application for employees and external submitters.

### Prompt
```
Create a Power Apps canvas app that allows users to upload documents for automated processing.

APP NAME: Document Upload Portal
AUDIENCE: All employees, external vendors (guest access)
DATA SOURCE: Dataverse (doc_document), Azure Blob Storage

REQUIREMENTS:
1. Multi-file drag-and-drop upload zone (accept PDF, PNG, JPG, TIFF)
2. Camera capture for mobile users (auto-crop and enhance)
3. File validation: size < 20MB, type check, page count warning >10
4. Optional metadata fields: Department, Document Description, Priority
5. Upload progress indicator with per-file status
6. Submission history showing processing status
7. Email notification on processing completion

SCREENS NEEDED:
- Welcome/Login screen
- Upload screen with drag-drop zone
- Camera capture screen
- Batch review and submit screen
- Submission history gallery
- Document detail/status screen

DELIVERABLES:
1. Screen layouts and navigation flow
2. Upload connector configuration (Azure Blob SAS token approach)
3. File validation formulas
4. Status polling mechanism for processing updates
5. Guest access configuration notes
```

---

## Prompt 5: Power BI Dashboard Design

### Context
You need to create an operational dashboard for managers and administrators to monitor the document intake system.

### Prompt
```
Design a Power BI dashboard for monitoring the AI Builder Document Intake System.

DATA SOURCE: Dataverse DirectQuery (doc_document, doc_extraction, doc_review_queue, doc_audit_log)

DASHBOARD PAGES:

PAGE 1 — EXECUTIVE SUMMARY
- KPI Cards:
  * Total Documents Processed (Today / This Week / This Month)
  * Auto-Approval Rate (%)
  * Average Processing Time (minutes)
  * SLA Compliance Rate (%)
  * Cost Per Document ($)
  * AI Builder Credits Consumed (vs allocation)
- Trend sparklines for each KPI
- Date range slicer (Today / 7 Days / 30 Days / Custom)

PAGE 2 — PROCESSING VOLUME
- Line chart: Documents processed per hour (last 24h)
- Bar chart: Documents by type (stacked by status)
- Area chart: Cumulative volume vs target
- Filter by: Source channel, Department, Document type

PAGE 3 — ACCURACY ANALYTICS
- Bar chart: Classification accuracy by document type
- Matrix: Field-level accuracy heatmap (fields x document types)
- Line chart: Accuracy trend over time (by week)
- Histogram: Confidence score distribution
- Filter by: Model version, Date range

PAGE 4 — QUEUE MANAGEMENT
- Cards: Current queue depth, Avg wait time, Items past SLA
- Table: Review queue items with assignee, due date, priority
- Gauge: Queue depth vs capacity
- Bar chart: Reviewer workload distribution

PAGE 5 — ERROR ANALYSIS
- Pie chart: Error types (classification, extraction, system, timeout)
- Trend line: Error rate over time
- Table: Recent failures with document ID and error message
- Drill-through capability to individual document details

TECHNICAL REQUIREMENTS:
- DirectQuery mode for real-time data
- Row-level security (managers see their department only)
- Mobile-optimized layout
- Scheduled refresh every 15 minutes
- Export to PDF and PowerPoint support

DELIVERABLES:
1. DAX measures for all KPIs
2. Data model relationships diagram
3. Row-level security DAX expressions
4. Report theme JSON specification
5. Mobile layout configuration notes
```

### Expected Output
- DAX measures
- Data model design
- RLS configuration
- Theme specification

---

## Prompt 6: End-to-End Testing Strategy

### Context
You need a comprehensive testing plan for the document intake system before production deployment.

### Prompt
```
Create a comprehensive test plan for the AI Builder Document Intake System covering all components.

TEST CATEGORIES:

1. AI BUILDER MODEL TESTING
- Classification accuracy test: 50 held-out documents per type
- Extraction accuracy test: Field-level precision and recall
- Confidence calibration test: Verify scores correlate with accuracy
- Edge case testing: Blurry scans, rotated documents, multi-page, mixed content
- Adversarial testing: Empty pages, wrong document types, corrupted files

2. POWER AUTOMATE FLOW TESTING
- Trigger testing: All 3 input channels (email, SharePoint, app)
- Routing logic: Verify correct model called for each document type
- Error handling: Simulate failures at each step
- Concurrency testing: 20 simultaneous document submissions
- Timeout testing: Large files, slow model responses
- Retry logic: Verify 3-attempt retry with backoff

3. POWER APPS TESTING
- Upload app: File validation, progress tracking, error messages
- Review app: Queue loading, field editing, submission, keyboard shortcuts
- Cross-browser testing: Chrome, Edge, Safari
- Mobile testing: iOS Safari, Android Chrome
- Accessibility testing: Screen reader compatibility, keyboard navigation

4. INTEGRATION TESTING
- Dataverse write/read operations
- D365 Finance invoice export
- D365 CE contact/account export
- SharePoint archival
- Email notification delivery
- Teams notification delivery

5. PERFORMANCE TESTING
- 500 documents/hour throughput validation
- 10 concurrent reviewers on review app
- Dashboard load time < 5 seconds
- Flow completion time < 2 minutes (auto-approve path)

6. SECURITY TESTING
- Role-based access control verification
- Data isolation between departments
- PII masking in review app
- Audit log completeness

DELIVERABLES:
1. Test case spreadsheet with: ID, Component, Test Description, Steps, Expected Result, Priority
2. Test data set: 100 sample documents across all 12 types
3. Automated test scripts (Power Automate test framework)
4. Performance test script and benchmarks
5. UAT sign-off checklist
6. Regression test suite for future releases
```

### Expected Output
- Complete test plan document
- Test case templates
- Sample test data requirements
- UAT checklist

---

## Prompt 7: Security Model Configuration

### Context
Configure Dataverse security roles and access controls for the document intake system.

### Prompt
```
Design the complete Dataverse security model for the Document Intake System.

REQUIREMENTS:
- 6 security roles with specific table permissions
- Column-level security for PII fields
- Row-level filtering by department
- Audit configuration for compliance
- Guest access for external submitters

DELIVERABLES:
1. Security role definition matrix (Role x Table x Permission)
2. Column security profile for PII fields
3. Business unit structure recommendation
4. Team configuration for reviewer assignment
5. Owner vs Team ownership strategy
6. Guest access configuration (Azure AD B2B)
7. Audit log configuration (what to audit, retention)
8. Data loss prevention (DLP) policy recommendations
```

---

## Usage Notes

### How to Use These Prompts
1. Copy the prompt text (between the triple backticks) into your AI assistant
2. Provide any additional context about your specific environment
3. Review the output for your organization's specific needs
4. Adapt Dataverse table names and schema to match your naming conventions
5. Test all generated formulas and expressions in a development environment before production deployment

### Recommended AI Tools
| Tool | Best For |
|------|----------|
| GitHub Copilot (VS Code) | Power Fx formulas, JSON parsing expressions |
| ChatGPT 4 / Claude 3 | Architecture design, flow logic, documentation |
| Microsoft Copilot Studio | Copilot integration guidance |
| Power Platform Copilot | In-product formula and flow assistance |

> **Note:** AI-generated code should always be reviewed by a human expert before production deployment. AI Builder models require manual training and cannot be fully generated by AI assistants.
