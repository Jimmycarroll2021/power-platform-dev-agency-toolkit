# Risk Register — AI Builder Document Intake System

## Risk Register Summary

| Category | Count | High Severity | Medium Severity | Low Severity |
|----------|-------|--------------|-----------------|--------------|
| Technical Risks | 8 | 3 | 4 | 1 |
| Business Risks | 6 | 2 | 3 | 1 |
| Operational Risks | 4 | 1 | 2 | 1 |
| Compliance Risks | 3 | 2 | 1 | 0 |
| **Total** | **21** | **8** | **10** | **3** |

---

## 1. Technical Risks

### RISK-T001: AI Builder Model Accuracy Below Target

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T001 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | Medium (40%) |
| **Impact** | Critical — If classification accuracy falls below 90% or extraction accuracy below 92%, the human review queue will be overwhelmed, defeating the purpose of automation. |

**Description:**
AI Builder models may not achieve the target accuracy (>94% classification, >96% invoice extraction) due to insufficient training data, poor document quality, or document types not well-represented in training samples. Model accuracy can also degrade over time as document formats change.

**Mitigation Strategies:**
1. Collect minimum 200 samples per document type (not just the 50 minimum) to improve model generalization
2. Implement a continuous feedback loop: reviewer corrections automatically flagged for model retraining
3. Set realistic confidence thresholds per document type rather than a universal 0.85 cutoff
4. Plan for a "human-in-the-loop" model: even with lower accuracy, the review process ensures quality output
5. Monthly model accuracy review with retraining trigger if accuracy drops below 92%
6. Keep 6-month archive of training data for A/B testing new model versions

**Contingency Plan:**
If model accuracy cannot be improved above 90% after 3 retraining cycles, evaluate Azure Form Recognizer (Document Intelligence) as an alternative AI service with more advanced extraction capabilities.

**Owner:** AI Builder Solution Architect
**Review Date:** Bi-weekly during model development, monthly in production

---

### RISK-T002: AI Builder Credit Consumption Exceeds Allocation

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T002 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | Medium (35%) |
| **Impact** | High — Processing halt if credits exhausted mid-month. Each document consumes 1-3 credits depending on pages and models called. |

**Description:**
AI Builder operates on a credit-based consumption model. At 2,500 documents/week with multiple model calls per document, estimated monthly consumption is 5,000-8,000 credits. If document volume increases or if flows enter retry loops due to errors, consumption could exceed the allocated credits.

**Mitigation Strategies:**
1. Implement real-time credit monitoring via Power Automate flow that queries consumption daily
2. Set up tiered alerts: 70% (warning), 85% (urgent), 95% (critical — halt non-essential processing)
3. Purchase AI Builder credits as add-on (per 1M service credits) before going live
4. Optimize flows to avoid unnecessary model calls (e.g., cache classification results)
5. Implement document deduplication to prevent re-processing same documents
6. Monitor for infinite retry loops — cap retries at 3 attempts
7. Budget for 2x estimated consumption in first 3 months (learning period)

**Contingency Plan:**
If credits are exhausted, switch to manual processing queue with priority-based ordering. Emergency credit purchase takes 24-48 hours through Microsoft admin center.

**Owner:** Power Platform Administrator
**Review Date:** Weekly

---

### RISK-T003: Power Automate Flow Timeouts and Throttling

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T003 |
| **Category** | Technical |
| **Severity** | **HIGH** |
| **Probability** | Medium (30%) |
| **Impact** | High — Document processing failures, data inconsistency, review queue backlogs. |

**Description:**
Power Automate has execution limits: 30-day timeout for cloud flows, API call throttling limits per connection (typically 6,000 requests per 5 minutes for Dataverse). At peak volume (500 docs/hour), the system may hit throttling limits, causing flow failures or delays.

**Mitigation Strategies:**
1. Design flows with parallel execution limits — use "Apply to each" concurrency controls
2. Implement queue-based processing: documents land in a queue table, a polling flow processes in batches
3. Use Service Principal authentication for Dataverse connections (higher API limits)
4. Implement exponential backoff retry policies on all API calls
5. Monitor flow run duration and API consumption in Power Platform Admin Center
6. Split high-volume flows into multiple smaller flows by document type
7. Use Dataverse bulk operations where possible (instead of per-record operations)

**Contingency Plan:**
If throttling persists, implement a serverless Azure Function as a processing intermediary to handle high-volume API calls outside of Power Automate.

**Owner:** Integration Architect
**Review Date:** Weekly during rollout

---

### RISK-T004: Dataverse Storage Capacity Limits

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T004 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (35%) |
| **Impact** | Medium — Additional storage costs, potential service degradation if capacity exceeded. |

**Description:**
Each document stored in Dataverse as a Note attachment consumes database/file storage capacity. At 2,500 documents/week averaging 2MB each, plus extraction records and audit logs, estimated monthly storage growth is 80-100 GB. Default Dataverse capacity may be insufficient.

**Mitigation Strategies:**
1. Calculate storage requirements before deployment: (docs/week * avg size * 52) + (extraction records * record size)
2. Purchase additional Dataverse storage capacity upfront
3. Implement archival flow: move documents older than 90 days to SharePoint Online (cheaper storage)
4. Store only document metadata + thumbnail in Dataverse; archive full files to SharePoint
5. Purge rejected/quarantined documents after 30 days per retention policy
6. Monitor storage consumption weekly via Power Platform Admin Center
7. Implement compression for stored documents where feasible

**Contingency Plan:**
If storage capacity is reached, processing halts. Emergency storage purchase available through Microsoft admin center with immediate provisioning.

**Owner:** Dataverse Administrator
**Review Date:** Monthly

---

### RISK-T005: Document Quality Variability

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T005 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | High (65%) |
| **Impact** | Medium — Lower extraction accuracy, higher review queue volume. |

**Description:**
Incoming documents vary significantly in quality: blurry scans, low-resolution phone photos, skewed pages, watermarks, fax artifacts, and mixed-color backgrounds. Poor quality documents will have lower extraction confidence, requiring more human review.

**Mitigation Strategies:**
1. Implement image pre-processing: auto-rotate, deskew, contrast enhancement before AI Builder processing
2. Add document quality scoring in the upload app (warn users of low-quality uploads)
3. Provide scanning guidelines to document submitters (resolution, lighting, positioning)
4. Accept that 10-15% of documents will need human review due to quality — budget accordingly
5. For fax/scanned documents, use AI Builder's built-in OCR optimization
6. Consider Azure Computer Vision pre-processing API for severely degraded documents

**Owner:** Document Processing Team Lead
**Review Date:** Monthly accuracy review

---

### RISK-T006: Integration Failures with Downstream Systems

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T006 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (30%) |
| **Impact** | Medium — Data not reaching D365 Finance/CE, requiring manual reconciliation. |

**Description:**
Integration flows that export extracted data to Dynamics 365 Finance and Dynamics 365 CE may fail due to API throttling, data validation errors, schema mismatches, or downstream system maintenance windows.

**Mitigation Strategies:**
1. Implement retry logic with exponential backoff on all external API calls
2. Store failed export records in a "pending export" queue for manual retry
3. Validate all data against D365 schema before attempting export
4. Use Dataverse Virtual Tables for read-only D365 integration (no export needed)
5. Monitor integration flow success rate with alerts on >5% failure rate
6. Implement correlation IDs for end-to-end traceability
7. Schedule integration during off-peak hours when possible

**Contingency Plan:**
Failed exports are queued for admin review. Admin can bulk-retry failed exports from a dedicated admin screen in the review app.

**Owner:** Integration Developer
**Review Date:** Daily during initial deployment

---

### RISK-T007: Power Apps Performance Degradation

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T007 |
| **Category** | Technical |
| **Severity** | Medium |
| **Probability** | Medium (25%) |
| **Impact** | Medium — Slow review app frustrates reviewers, reducing throughput. |

**Description:**
The review canvas app may experience slow load times due to large dataset queries, unoptimized gallery loading, or loading large document images. This is especially problematic when 10+ reviewers are using the app simultaneously.

**Mitigation Strategies:**
1. Use delegation-safe queries (Filter, Sort, FirstN) on Dataverse — avoid non-delegable functions
2. Implement pagination in galleries (load 50 items at a time, load more on scroll)
3. Cache document thumbnails (small images) instead of full-resolution files
4. Use Concurrent() function to load independent data sources in parallel
5. Optimize OnStart loading — defer non-critical data loads
6. Use collections for local data manipulation instead of direct Dataverse writes
7. Enable Power Apps monitor to identify performance bottlenecks
8. Use responsive layouts that don't require complex calculations

**Contingency Plan:**
If performance issues persist, split the review app into two apps: Queue Management (lightweight) and Document Review (heavyweight with image viewer).

**Owner:** Power Apps Developer
**Review Date:** Weekly during UAT

---

### RISK-T008: Unsupported File Formats or Corrupted Files

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-T008 |
| **Category** | Technical |
| **Severity** | Low |
| **Probability** | Low (15%) |
| **Impact** | Low — Individual document rejected, user notified. |

**Description:**
Users may attempt to upload files that are corrupted, password-protected, or in unsupported formats (e.g., HEIC, BMP, GIF, Word documents). These files cannot be processed by AI Builder.

**Mitigation Strategies:**
1. Client-side file type validation in upload app before submission
2. Server-side file validation in orchestrator flow
3. Clear error messages to users explaining why file was rejected
4. Virus scan integration (Microsoft Defender) before processing
5. Accept that ~2% of submissions will be rejected for format issues

**Owner:** Power Apps Developer
**Review Date:** Per release

---

## 2. Business Risks

### RISK-B001: User Adoption Resistance

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B001 |
| **Category** | Business |
| **Severity** | **HIGH** |
| **Probability** | High (55%) |
| **Impact** | Critical — If employees continue submitting documents via email (old process), the automated system won't receive documents and ROI will not be realized. |

**Description:**
Employees in Accounts Payable, Customer Onboarding, and other departments have established habits of emailing documents directly or dropping files in network folders. Changing these behaviors requires active change management.

**Mitigation Strategies:**
1. Executive sponsor communication: mandate use of new system from go-live date
2. Department-by-department rollout (not big-bang) — start with most enthusiastic team
3. In-person training sessions: 1 hour per department showing the new upload process
4. Embed upload app in Teams and SharePoint for easy access
5. Remove old email addresses and network folders after 30-day transition period
6. Identify and empower "champions" in each department to help peers
7. Gamification: show leaderboard of departments with highest adoption
8. Make the new process visibly easier than the old process (mobile upload, instant confirmation)

**Contingency Plan:**
If adoption stalls below 70% after 60 days, implement mandatory routing: all documents to the shared mailbox are auto-forwarded into the system, making the new process the only path.

**Owner:** Change Management Lead + Department Managers
**Review Date:** Weekly for first 8 weeks

---

### RISK-B002: Reviewer Capacity Bottleneck

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B002 |
| **Category** | Business |
| **Severity** | **HIGH** |
| **Probability** | Medium (40%) |
| **Impact** | High — If 30%+ of documents route to human review (higher than projected 15%), the review team will be overwhelmed and SLA breaches will occur. |

**Description:**
The business case assumes 85% of documents will be auto-approved (requiring no human review). If model accuracy is lower than expected, or if confidence thresholds are set too conservatively, the review queue will grow faster than reviewers can process it.

**Mitigation Strategies:**
1. Start with 0.80 confidence threshold (not 0.85) to allow more auto-approvals, then tighten based on observed accuracy
2. Cross-train 8+ reviewers (not just the planned 3) to provide surge capacity
3. Implement a "reviewer marketplace" where any trained employee can pick up review tasks
4. Monitor daily: if queue depth exceeds 50 items, trigger emergency all-hands review
5. Adjust thresholds per document type (invoices can auto-approve at 0.80, contracts need 0.90)
6. Hire temporary contract reviewers during peak periods (month-end, tax season)
7. Calculate and display cost-per-review vs cost-per-error to optimize threshold

**Contingency Plan:**
If review queue consistently exceeds capacity, lower confidence thresholds to increase auto-approval rate, accepting a slightly higher error rate that is caught in downstream systems.

**Owner:** Operations Manager
**Review Date:** Daily during first month

---

### RISK-B003: ROI Not Realized Within Expected Timeline

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B003 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | Medium (35%) |
| **Impact** | Medium — Executive confidence in Power Platform initiatives may decline. |

**Description:**
The business case projects $180,000 annual savings (3 FTEs at $60K each). If implementation costs exceed budget, adoption is slow, or accuracy requires more human review than planned, ROI may not be achieved in the first 12 months.

**Mitigation Strategies:**
1. Track actual vs projected metrics from week 1: processing time, accuracy, FTE hours saved
2. Phase the implementation: start with highest-volume document type (invoices) for quick win
3. Measure and report "soft" benefits: error reduction, audit compliance, employee satisfaction
4. Keep implementation timeline aggressive (12 weeks) to start realizing savings sooner
5. Monthly executive dashboard showing ROI trajectory
6. Identify and eliminate scope creep early

**Owner:** Project Sponsor (CFO Office)
**Review Date:** Monthly

---

### RISK-B004: Insufficient Training Data for Model Accuracy

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B004 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | Medium (35%) |
| **Impact** | Medium — Model accuracy below target, requiring more human review. |

**Description:**
Some document types (Insurance Documents, Tax Forms) represent <2% of volume, making it difficult to collect the 200+ training samples needed for high accuracy. Additionally, departments may have shredded historical documents, reducing available training data.

**Mitigation Strategies:**
1. Start collecting training data 4 weeks before model training begins
2. For low-volume types, supplement with synthetic/generated sample documents
3. Partner with vendors/customers to obtain sample documents (anonymized)
4. Accept lower accuracy for low-volume types and route more to human review
5. Group similar low-volume types under a single model initially, then split later
6. Consider "unknown" classification as acceptable fallback for rare document types

**Owner:** Business Analyst + Department SMEs
**Review Date:** Weekly during data collection phase

---

### RISK-B005: Vendor/Customer Reluctance to Use New Submission Channel

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B005 |
| **Category** | Business |
| **Severity** | Medium |
| **Probability** | Medium (30%) |
| **Impact** | Medium — External documents continue arriving via email, bypassing the structured upload process. |

**Description:**
External vendors and customers may resist using a new upload portal, preferring their existing email-based submission process. This creates a two-track system where some documents enter the automated pipeline and others don't.

**Mitigation Strategies:**
1. Keep the shared email address active — documents received there are automatically ingested
2. Provide vendors with a simple, no-login-required upload link
3. Communicate the change 60 days in advance with clear instructions
4. Offer training webinars for key vendors
5. Embed upload link in invoice payment reminders and onboarding emails
6. Gradually transition: accept both methods for 90 days, then email-only for automated ingestion

**Owner:** Vendor Relations + Customer Success
**Review Date:** Bi-weekly

---

### RISK-B006: Key Person Dependency on AI Builder Expertise

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-B006 |
| **Category** | Business |
| **Severity** | Low |
| **Probability** | Medium (30%) |
| **Impact** | Low — Knowledge gap if primary AI Builder expert leaves. |

**Description:**
AI Builder model training, tuning, and retraining requires specialized expertise that may be concentrated in one individual. If that person leaves, the organization may struggle to maintain and improve models.

**Mitigation Strategies:**
1. Cross-train at least 2 additional team members on AI Builder model management
2. Document all model training procedures, parameter choices, and lessons learned
3. Record video walkthroughs of model training and retraining processes
4. Maintain a "runbook" with step-by-step procedures for common tasks
5. Establish relationship with Microsoft partner for escalation support
6. Keep models versioned and exportable as part of managed solution

**Owner:** IT Manager
**Review Date:** Quarterly

---

## 3. Operational Risks

### RISK-O001: AI Builder Service Outage

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O001 |
| **Category** | Operational |
| **Severity** | **HIGH** |
| **Probability** | Low (10%) |
| **Impact** | Critical — Complete processing halt if AI Builder service is unavailable. |

**Description:**
AI Builder is a cloud service subject to Microsoft SLAs (99.9% uptime). In the event of an outage, document classification and extraction cannot proceed, creating a processing backlog.

**Mitigation Strategies:**
1. Monitor AI Builder service health via Microsoft 365 Service Health Dashboard
2. Subscribe to outage alerts via Microsoft 365 Admin Center
3. Design fallback: during outage, documents queue in Dataverse with "Queued" status
4. When service resumes, queued documents auto-process in FIFO order
5. Maintain capacity for manual processing during extended outages (>4 hours)
6. SLA credits available from Microsoft for qualifying outages

**Contingency Plan:**
During extended outage (>2 hours), activate manual processing team. When service resumes, queued documents auto-process based on priority.

**Owner:** IT Operations
**Review Date:** Per incident

---

### RISK-O002: Reviewer Absence/Sick Leave During Peak Period

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O002 |
| **Category** | Operational |
| **Severity** | Medium |
| **Probability** | Medium (40%) |
| **Impact** | Medium — Queue backlog during reviewer absences, especially at month-end. |

**Description:**
The review team (planned 3-5 FTEs) has no redundancy. If 2+ reviewers are out simultaneously, the queue will backlog quickly. Peak periods (month-end close, tax season) exacerbate this risk.

**Mitigation Strategies:**
1. Cross-train 8+ employees as backup reviewers
2. Implement queue auto-reassignment when reviewer is marked out-of-office
3. Monitor queue depth daily — if >30 items per active reviewer, trigger surge protocol
4. During peak periods, pre-schedule temporary/contract reviewer support
5. Lower auto-approval thresholds during understaffed periods (accept higher error rate)
6. Enable remote review capability so reviewers can work from home if needed

**Owner:** Department Manager
**Review Date:** Weekly

---

### RISK-O003: Model Drift Over Time

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O003 |
| **Category** | Operational |
| **Severity** | Medium |
| **Probability** | High (60%) |
| **Impact** | Medium — Gradual accuracy decline as document formats evolve. |

**Description:**
Document formats change over time: vendors update invoice templates, new form versions are introduced, scanning practices evolve. A model trained in January may have reduced accuracy by June if not retrained.

**Mitigation Strategies:**
1. Monthly accuracy review: compare current month accuracy to baseline
2. Automatic retraining trigger: if accuracy drops >2% from baseline
3. Collect reviewer corrections as retraining data continuously
4. Quarterly model version update with latest training data
5. A/B testing: run new model version in parallel before promoting to production
6. Track accuracy by document source — identify which vendors/forms cause degradation

**Owner:** AI Builder Administrator
**Review Date:** Monthly

---

### RISK-O004: Retention and Purge Policy Complexity

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-O004 |
| **Category** | Operational |
| **Severity** | Low |
| **Probability** | Medium (25%) |
| **Impact** | Low — Compliance risk if documents retained too long or purged too early. |

**Description:**
Different document types have different legal retention requirements (7 years for financial, 3 years for general). Automating retention and purge requires careful policy configuration to avoid compliance violations or unnecessary storage costs.

**Mitigation Strategies:**
1. Legal review of retention requirements per document type before go-live
2. Implement retention tags in Dataverse based on document type classification
3. Automated archival flow: move to SharePoint after required retention period
4. Audit trail of all purge actions for compliance evidence
5. GDPR-compliant deletion workflow for personal data requests

**Owner:** Compliance Officer + Dataverse Admin
**Review Date:** Quarterly

---

## 4. Compliance Risks

### RISK-C001: PII Exposure in Document Processing

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C001 |
| **Category** | Compliance |
| **Severity** | **HIGH** |
| **Probability** | Medium (30%) |
| **Impact** | Critical — GDPR/privacy violation fines, reputational damage if personal data is exposed. |

**Description:**
Documents (especially ID documents, onboarding forms, tax forms) contain PII (Personally Identifiable Information) including names, addresses, SSNs, dates of birth. This data flows through AI Builder, Dataverse, Power Apps, and potentially Power BI.

**Mitigation Strategies:**
1. Column-level security on all PII fields in Dataverse — only authorized roles can view
2. PII masking in review app: show only last 4 digits of SSN, mask email addresses
3. Power BI row-level security restricts dashboard access by department
4. Data Loss Prevention (DLP) policies prevent PII export to unauthorized connectors
5. All reviewers sign confidentiality agreements and complete privacy training
6. Data residency: ensure all processing in organization's Microsoft tenant region
7. GDPR Article 30 record of processing activities maintained
8. Data Processing Addendum (DPA) with Microsoft covers AI Builder processing
9. Right-to-erasure workflow: ability to purge all data for a specific individual within 30 days

**Owner:** Data Protection Officer (DPO)
**Review Date:** Monthly

---

### RISK-C002: Audit Trail Completeness

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C002 |
| **Category** | Compliance |
| **Severity** | **HIGH** |
| **Probability** | Low (15%) |
| **Impact** | High — Regulatory audit failure if processing decisions cannot be traced. |

**Description:**
Financial document processing requires complete audit trails showing: who processed what, when, what AI model was used, what confidence scores were returned, and what human corrections were made. Gaps in the audit trail create compliance risk.

**Mitigation Strategies:**
1. Comprehensive audit logging: every status change, every field validation, every model call
2. Immutable audit table in Dataverse (no delete permissions for anyone)
3. Correlation IDs propagated through all systems for end-to-end tracing
4. Audit log retention: 7 years (matching financial record requirements)
5. Monthly audit log integrity verification (hash/checksum validation)
6. Pre-built audit report for external auditor consumption
7. Model versioning tracked: every document linked to specific model version used

**Owner:** Compliance Officer
**Review Date:** Quarterly

---

### RISK-C003: Licensing Compliance

| Field | Description |
|-------|-------------|
| **Risk ID** | RISK-C003 |
| **Category** | Compliance |
| **Severity** | Medium |
| **Probability** | Medium (25%) |
| **Impact** | Medium — Service disruption if licensing is non-compliant. |

**Description:**
Power Platform licensing is complex. Users accessing the review app need Power Apps Premium licenses. AI Builder requires allocated credits. Guest users may need additional licensing. Non-compliance can result in service disruption.

**Mitigation Strategies:**
1. Pre-deployment licensing audit: count all users and required licenses
2. Purchase licenses before go-live, not after
3. Monitor license usage via Power Platform Admin Center
4. Use per-app licenses for infrequent users (cheaper than per-user)
5. Document all license assignments with business justification
6. Annual license review to right-size allocations
7. Include licensing costs in the operational budget (not just implementation)

> **WARNING:** Microsoft licensing terms change frequently. Review the latest Power Platform licensing guide at https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus before purchasing. This document's licensing guidance reflects terms as of January 2024 and may be outdated.

**Owner:** Power Platform Administrator + Procurement
**Review Date:** Quarterly

---

## 5. Risk Monitoring & Governance

### 5.1 Risk Review Cadence

| Review Type | Frequency | Participants |
|-------------|-----------|--------------|
| Daily Standup | Daily | Project Team (risks with impact > High) |
| Weekly Risk Review | Weekly | Project Manager + Risk Owners |
| Steering Committee | Bi-weekly | Executive Sponsor + Project Leads |
| Post-Incident Review | Per incident | All stakeholders |
| Quarterly Portfolio Review | Quarterly | PMO + Risk Management |

### 5.2 Risk Escalation Matrix

| Risk Severity | Escalation Path | Response Time |
|---------------|----------------|---------------|
| Critical (Impact > $100K or compliance violation) | Immediate → Project Sponsor + CIO | 2 hours |
| High (Impact $50K-$100K or SLA breach) | Same day → Project Manager + Department Head | 24 hours |
| Medium (Impact $10K-$50K) | Weekly review → Project Team | 1 week |
| Low (Impact <$10K) | Next scheduled review | Next review cycle |

### 5.3 Risk Score Calculation

Risk Score = Impact × Probability

| Score | Rating | Action Required |
|-------|--------|----------------|
| 15-25 | Critical | Immediate action + executive escalation |
| 8-14 | High | Active mitigation + weekly monitoring |
| 4-7 | Medium | Planned mitigation + monthly monitoring |
| 1-3 | Low | Accept + periodic review |
