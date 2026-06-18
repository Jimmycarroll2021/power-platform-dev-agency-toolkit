# Document Intake System — Architecture Document

## 1. System Architecture Overview

The AI Builder Document Intake System follows an event-driven, serverless architecture built entirely on the Power Platform. All processing is asynchronous to handle variable document volumes and to accommodate AI Builder model latency (typically 5-30 seconds per document depending on complexity).

### 1.1 Architecture Diagram (Detailed)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INPUT LAYER                                     │
│                                                                              │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │  Email Monitor  │  │ SharePoint Drop  │  │   Power Apps Upload Canvas  │ │
│  │  (Shared Inbox) │  │   Folder (3 libs)│  │   (Mobile + Desktop)        │ │
│  │                 │  │                  │  │                             │ │
│  │ Trigger: When   │  │ Trigger: When    │  │ • Drag-and-drop upload      │ │
│  │ a new email     │  │ file created     │  │ • Camera capture            │ │
│  │ arrives with    │  │ in library       │  │ • Multi-file batch          │ │
│  │ attachments     │  │                  │  │ • Upload progress bar       │ │
│  └────────┬────────┘  └────────┬─────────┘  └──────────────┬──────────────┘ │
│           │                    │                           │                │
│           └────────────────────┼───────────────────────────┘                │
│                                ▼                                            │
│                   ┌──────────────────────┐                                  │
│                   │   Azure Blob Storage │                                  │
│                   │   (Staging Container)│                                  │
│                   │                      │                                  │
│                   │ • Raw files stored   │                                  │
│                   │ • SAS token secured  │                                  │
│                   │ • 30-day retention   │                                  │
│                   └──────────┬───────────┘                                  │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATION LAYER                                  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              "Intake Orchestrator" — Power Automate Cloud Flow       │    │
│  │                                                                     │    │
│  │  [Trigger] Blob created → [Action] Copy to Dataverse Note           │    │
│  │       │                          [Action] Call AI Builder            │    │
│  │       │                              Classification Model            │    │
│  │       ▼                                      │                     │    │
│  │  [Switch] Document Type                      ▼                     │    │
│  │    ├── Invoice ──────→ [Call] Invoice Extraction Model            │    │
│  │    ├── Purchase Order → [Call] Custom Extraction (PO)             │    │
│  │    ├── Contract ─────→ [Call] Custom Extraction (Contract)        │    │
│  │    ├── ID Document ──→ [Call] Custom Extraction (ID)              │    │
│  │    ├── Onboarding Form → [Call] Custom Extraction (Onboarding)    │    │
│  │    ├── Memo ─────────→ [Call] None (metadata only)                │    │
│  │    ├── Compliance ───→ [Call] Custom Extraction (Compliance)      │    │
│  │    ├── Receipt ──────→ [Call] Receipt Extraction (Prebuilt)       │    │
│  │    ├── Statement ────→ [Call] Custom Extraction (Statement)       │    │
│  │    ├── Tax Form ─────→ [Call] Custom Extraction (Tax)             │    │
│  │    ├── Insurance ────→ [Call] Custom Extraction (Insurance)       │    │
│  │    └── Unknown ──────→ [Route] Manual Review Queue                │    │
│  │                                                                     │    │
│  │  [After Extraction] → [Action] Store results in Dataverse         │    │
│  │              │                                                      │    │
│  │              ▼                                                      │    │
│  │       [Condition] Confidence Score >= 0.85 ?                        │    │
│  │         ├── YES → [Route] Auto-Approve → Integration Flow          │    │
│  │         └── NO  → [Route] Human Review Queue                       │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATAVERSE DATA LAYER                                 │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  doc_document    │  │ doc_extraction   │  │  doc_classification      │  │
│  │  (Main Registry) │  │  (Field Results) │  │  (Classification Log)    │  │
│  │                  │  │                  │  │                          │  │
│  │ • documentid (PK)│  │ • extractionid   │  │ • classificationid       │  │
│  │ • filename       │  │ • documentid (FK)│  │ • documentid (FK)        │  │
│  │ • filetype       │  │ • field_name     │  │ • predicted_category     │  │
│  │ • filesize       │  │ • extracted_value│  │ • confidence_score       │  │
│  │ • contenturl     │  │ • confidence     │  │ • model_version          │  │
│  │ • source_channel │  │ • is_validated   │  │ • processing_time_ms     │  │
│  │ • received_date  │  │ • validated_by   │  │ • classification_date    │  │
│  │ • status         │  │ • validated_value│  │                          │  │
│  │ • assigned_model │  │ • review_reason  │  │                          │  │
│  │ • confidence     │  │                  │  │                          │  │
│  │ • processed_date │  │                  │  │                          │  │
│  │ • reviewed_by    │  │                  │  │                          │  │
│  │ • error_message  │  │                  │  │                          │  │
│  └────────┬─────────┘  └──────────────────┘  └──────────────────────────┘  │
│           │                                                                  │
│  ┌────────▼─────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  doc_audit_log   │  │ doc_review_queue │  │  doc_document_note       │  │
│  │  (Audit Trail)   │  │  (Review Items)  │  │  (File Attachments)      │  │
│  │                  │  │                  │  │                          │  │
│  │ • auditid (PK)   │  │ • reviewid (PK)  │  │ • annotationid           │  │
│  │ • documentid (FK)│  │ • documentid (FK)│  │ • objectid (→ document)  │  │
│  │ • action         │  │ • assigned_to    │  │ • subject                │  │
│  │ • performed_by   │  │ • priority       │  │ • notetext               │  │
│  │ • performed_date │  │ • due_date       │  │ • attachment (file)      │  │
│  │ • old_value      │  │ • status         │  │ • mimetype               │  │
│  │ • new_value      │  │ • review_notes   │  │ • filesize               │  │
│  │ • correlation_id │  │ • reviewed_date  │  │                          │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INTEGRATION & OUTPUT LAYER                              │
│                                                                              │
│  ┌────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐    │
│  │  Integration Flow  │  │  Alert Flow      │  │  Review App Flow     │    │
│  │  (Data Export)     │  │  (Notifications) │  │  (HITL Validation)   │    │
│  │                    │  │                  │  │                      │    │
│  │ Sends extracted    │  │ • SLA breach     │  │ • Load review queue  │    │
│  │ data to:           │  │   alerts         │  │ • Submit corrections │    │
│  │ • D365 Finance     │  │ • Failure        │  │ • Re-extract request │    │
│  │   (invoices)       │  │   notifications  │  │ • Bulk validate      │    │
│  │ • D365 CE          │  │ • Daily digest   │  │ • Assign reviewers   │    │
│  │   (onboarding)     │  │ • Manager        │  │                      │    │
│  │ • SharePoint       │  │   escalation     │  │                      │    │
│  │   (archive)        │  │                  │  │                      │    │
│  └────────────────────┘  └──────────────────┘  └──────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Power BI Dashboard                         │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │    │
│  │  │  Processing  │  │   Accuracy   │  │      Queue Health        │ │    │
│  │  │  Volume      │  │   Trends     │  │                          │ │    │
│  │  │              │  │              │  │                          │ │    │
│  │  │ Docs/hour    │  │ By model     │  │ Avg wait time            │ │    │
│  │  │ By source    │  │ By field     │  │ Items in review          │ │    │
│  │  │ By type      │  │ Over time    │  │ SLA breach risk          │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Data Flow

### 2.1 Happy Path Flow

```
Document Arrives (Email/SharePoint/App)
    │
    ▼
┌─────────────────┐
│  Azure Blob     │ ◄── File stored with UUID filename
│  Staging        │     Metadata: source, timestamp, original name
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Intake         │ ◄── Triggered by blob creation event
│  Orchestrator   │     (HTTP trigger from blob event grid)
│  Flow           │
└────────┬────────┘
         │
         ├──► Creates Document record in Dataverse (status: "Received")
         │
         ├──► Calls AI Builder Classification Model
         │    Returns: Document Type + Confidence Score
         │
         ├──► Updates Document with classification result
         │
         ├──► Calls appropriate AI Builder Extraction Model
         │    Returns: Field-value pairs with confidence per field
         │
         ├──► Creates Extraction records for each field
         │
         └──► Evaluates confidence threshold
              │
              ├──► Confidence >= 0.85
              │    ├──► Status → "Auto-Approved"
              │    ├──► Calls Integration Flow
              │    └──► Archives document
              │
              └──► Confidence < 0.85
                   ├──► Status → "Pending Review"
                   ├──► Creates Review Queue item
                   ├──► Sends notification to reviewer
                   └──► Document appears in Review App
```

### 2.2 Human Review Flow

```
Reviewer opens Power Apps Review Canvas
    │
    ▼
┌─────────────────┐
│  Review Queue   │ ◄── Loads items assigned to reviewer
│  Screen         │     Sorted by priority and SLA due date
└────────┬────────┘
         │
         ├──► Reviewer views document image alongside extracted fields
         │
         ├──► Reviewer can:
         │    • Confirm extracted value (→ is_validated = true)
         │    • Correct extracted value (→ validated_value + reason)
         │    • Mark as wrong document type (→ re-classify)
         │    • Reject document (→ status = "Rejected")
         │    • Request re-extraction with different model
         │
         └──► On submit:
              ├──► Updates Extraction records
              ├──► Updates Document status → "Reviewed"
              ├──► Calls Integration Flow
              ├──► Removes from review queue
              └──► Logs audit entry
```

## 3. Component Specifications

### 3.1 AI Builder Classification Model

| Property | Value |
|----------|-------|
| Model Type | Custom document classification |
| AI Builder Version | v2.0 |
| Document Types | 12 categories |
| Minimum Training Samples | 50 per category (recommended: 200+) |
| Supported Formats | PDF, PNG, JPG, TIFF |
| Max File Size | 20 MB per document |
| Max Pages | 10 pages per document |

**Document Type Taxonomy:**

| Code | Name | Description | Extraction Model |
|------|------|-------------|------------------|
| INV | Invoice | Vendor invoice with line items | Invoice (Prebuilt) |
| PO | Purchase Order | Purchase order document | Custom Extraction |
| CON | Contract | Legal agreement/contract | Custom Extraction |
| ID | ID Document | Government-issued ID | Custom Extraction |
| ONB | Onboarding Form | New customer/employee form | Custom Extraction |
| MEM | Memo | Internal memorandum | None (metadata only) |
| CMP | Compliance Document | Regulatory filing | Custom Extraction |
| RCP | Receipt | Expense receipt | Receipt (Prebuilt) |
| STM | Bank Statement | Financial statement | Custom Extraction |
| TAX | Tax Form | W-9, 1099, etc. | Custom Extraction |
| INS | Insurance Document | Policy/certificate | Custom Extraction |
| UNK | Unknown | Unclassifiable | Manual Review |

### 3.2 AI Builder Extraction Models

**Invoice Extraction (Prebuilt):**
- Vendor name, address, phone
- Invoice number, date, due date
- PO number, tax amount, total amount
- Line items: description, quantity, unit price, amount

**Custom Extraction Models:**
- Each trained on 50+ labeled samples
- Field schema defined per document type
- Confidence threshold: 0.85 for auto-approval

### 3.3 Power Automate Flows

| Flow Name | Trigger | Actions | Frequency |
|-----------|---------|---------|-----------|
| Intake Orchestrator | Blob creation event | Classify, extract, route | Per document |
| Email Monitor | New email in shared inbox | Save attachments to blob | Per email |
| SharePoint Monitor | File created in library | Copy to blob, delete original | Per file |
| Validation Router | Dataverse record created | Evaluate confidence, route | Per extraction |
| Integration Export | Status = "Approved" | Export to D365/SharePoint | Per approval |
| SLA Monitor | Scheduled (every 15 min) | Check SLA, send alerts | 15 minutes |
| Daily Digest | Scheduled (daily 8 AM) | Summary email to managers | Daily |
| Review Assignment | Review item created | Assign to reviewer round-robin | Per review item |

### 3.4 Power Apps

**Document Upload Canvas App:**
- Target: End users submitting documents
- Screens: Upload, Camera, Batch Upload, Submission History
- Connectors: Dataverse, Camera, PDF Viewer
- Responsive design: Mobile + Desktop

**Review & Validation Canvas App:**
- Target: Document reviewers (AP clerks, onboarding specialists)
- Screens: Review Queue, Document Viewer, Field Editor, Reports
- Connectors: Dataverse, AI Builder (for re-extraction), Office 365 Users
- Features: Side-by-side viewer, keyboard shortcuts, bulk actions

## 4. Security Model

### 4.1 Dataverse Security

| Role | Permissions | Users |
|------|-------------|-------|
| Document Intake Admin | Full CRUD on all tables, model management | IT Admin, Solution Owner |
| Document Reviewer | Read/Update on Review Queue, Read on Documents, Create on Extractions | AP Clerks, Onboarding Team |
| Document Submitter | Create on Documents, Read own submissions | All employees |
| Integration Account | Read on approved documents, Write to external systems | Service Principal |
| Auditor | Read all tables (no update) | Compliance, Managers |
| Guest Submitter | Create on Documents (limited) | External vendors/customers |

### 4.2 Environment Strategy

| Environment | Purpose | Dataverse |
|-------------|---------|-----------|
| Development | Feature development, model experimentation | Yes (copy of prod) |
| Test | Integration testing, UAT | Yes (anonymized prod data) |
| Production | Live processing | Yes (production data) |

### 4.3 Data Protection

- Documents stored in Dataverse Notes (encrypted at rest)
- Azure Blob uses SSE + customer-managed keys
- AI Builder models process in Microsoft-managed infrastructure
- No document data leaves Microsoft tenant boundary
- Retention: 7 years for financial documents, 3 years for general
- Purge process for documents marked for deletion (GDPR compliance)

## 5. Integration Points

| System | Direction | Method | Data |
|--------|-----------|--------|------|
| Dynamics 365 Finance | Outbound | Dataverse Virtual Table | Invoice header + lines |
| Dynamics 365 CE | Outbound | Power Automate + CDS connector | Contact, Account, Case |
| SharePoint Online | Outbound | Power Automate + SharePoint connector | Archived documents |
| Office 365 Outlook | Outbound | Power Automate + Outlook connector | Alerts, notifications |
| Power BI | Inbound | Dataverse DirectQuery | All processing tables |
| Azure Blob Storage | Internal | Power Automate + Blob connector | Staging storage |
| Microsoft Teams | Outbound | Power Automate + Teams connector | Channel notifications |

## 6. Performance Considerations

| Factor | Target | Mitigation |
|--------|--------|------------|
| Throughput | 500 docs/hour | Parallel flow runs, batch processing |
| Latency (auto-route) | < 2 minutes | Async processing, no human gate |
| Latency (review route) | < 4 hours during business hours | SLA monitoring, escalation |
| AI Builder quota | Monitor credit consumption | Alerts at 70%, 85%, 95% of allocation |
| Dataverse storage | Monitor database growth | Archival flow moves old docs to SharePoint |
| Concurrent reviewers | 10+ | Queue assignment with load balancing |

## 7. Monitoring & Alerting

| Alert | Condition | Recipients | Channel |
|-------|-----------|------------|---------|
| AI Builder credit threshold | Credits > 85% of allocation | Admin | Email + Teams |
| Processing failure rate | > 5% failures in 1 hour | Admin + Manager | Email + Teams |
| Review queue depth | > 50 items pending | Review Team Lead | Email |
| SLA breach imminent | Item approaching 4-hour SLA | Assigned reviewer | Teams notification |
| Model accuracy drop | Avg confidence < 0.80 | Admin | Email |
| Daily processing summary | Every day at 8 AM | Managers | Email |

## 8. Disaster Recovery

- **Dataverse**: Microsoft-managed backup (14-day point-in-time restore)
- **AI Builder models**: Versioned, exportable as part of solution
- **Flows**: Source-controlled via Power Platform Pipelines / ALM
- **Documents**: Re-processable from Azure Blob staging (30-day retention)
- **RTO**: 4 hours (redeploy solution to new environment)
- **RPO**: 15 minutes (Dataverse continuous backup)
