# AI Builder Document Intake System

## Project Overview

The **AI Builder Document Intake System** is a production-ready Power Platform solution that automates the ingestion, classification, and data extraction from unstructured documents (PDFs, scanned images, email attachments). It replaces a manual document sorting and data entry process that previously required 3-5 FTEs across the organization's Accounts Payable and Customer Onboarding departments.

## Business Problem

Contoso Ltd. receives approximately 2,500 documents per week across multiple channels:
- Vendor invoices via email (45%)
- Customer onboarding forms uploaded via portal (25%)
- Scanned mail and faxes (20%)
- Inter-department memos and compliance documents (10%)

Prior to this solution, documents were manually sorted, classified, and had critical data typed into downstream systems. This process suffered from:
- **Average 3.2 day processing delay** from receipt to data entry completion
- **8.4% error rate** in manual data transcription
- **No audit trail** for document handling or processing decisions
- **Inconsistent classification** with 4 different taxonomies across departments
- **No visibility** into processing bottlenecks or queue depths

## Solution Summary

This solution provides an end-to-end automated document intake pipeline:

1. **Ingestion Layer** — Documents arrive via email monitors, SharePoint drop folders, and Power Apps upload canvas
2. **Classification Engine** — AI Builder custom document classification model categorizes documents into 12 types (Invoice, PO, Contract, ID Document, Onboarding Form, etc.)
3. **Data Extraction** — AI Builder prebuilt and custom form processing models extract field-level data with 94%+ accuracy
4. **Validation & Review** — Low-confidence extractions route to a Power Apps review canvas for human validation
5. **Integration** — Extracted data flows to Dataverse staging tables, then to downstream ERP (Dynamics 365 Finance) and CRM (Dynamics 365 CE) systems
6. **Monitoring** — Power BI dashboard provides real-time visibility into processing volumes, accuracy trends, and queue depths

## Key Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Document Classification Model | AI Builder (Custom) | Classify incoming documents into 12 categories |
| Invoice Extraction Model | AI Builder (Prebuilt) | Extract header/line-item data from invoices |
| Custom Form Extraction Model | AI Builder (Custom) | Extract data from onboarding forms and contracts |
| Intake Orchestrator Flow | Power Automate (Cloud) | Trigger on document arrival, route to correct model |
| Validation Flow | Power Automate (Cloud) | Route low-confidence extractions for human review |
| Document Upload App | Power Apps (Canvas) | End-user document upload and submission interface |
| Review & Validation App | Power Apps (Canvas) | Human-in-the-loop validation of extracted data |
| Document Registry | Dataverse | Central document metadata and extraction results store |
| Processing Dashboard | Power BI | Operational visibility and trend analysis |
| Alert System | Power Automate + Outlook | Notify stakeholders of processing failures and SLA breaches |

## Solution Architecture Highlights

```
┌─────────────────────────────────────────────────────────────┐
│                        INPUT CHANNELS                        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Email   │  │  SharePoint  │  │   Power Apps Upload  │  │
│  │ Monitor  │  │  Drop Folder │  │       Canvas         │  │
│  └────┬─────┘  └──────┬───────┘  └──────────┬───────────┘  │
└───────┼───────────────┼─────────────────────┼──────────────┘
        │               │                     │
        └───────────────┼─────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 AI BUILDER PROCESSING LAYER                  │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Classification  │  │   Invoice    │  │   Custom     │  │
│  │     Model       │  │  Extraction  │  │  Extraction  │  │
│  │  (12 categories)│  │    Model     │  │    Model     │  │
│  └────────┬────────┘  └──────┬───────┘  └──────┬───────┘  │
└───────────┼──────────────────┼─────────────────┼──────────┘
            │                  │                 │
            ▼                  ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATAVERSE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Document   │  │  Extraction  │  │ Classification   │  │
│  │    Table     │  │    Table     │  │    Table         │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼───────────────────┼────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   OUTPUT & INTEGRATION                       │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Power   │  │  Dynamics    │  │   Review & Validate  │  │
│  │   BI     │  │  365 (ERP/   │  │   Power Apps Canvas  │  │
│  │Dashboard │  │     CRM)     │  │                      │  │
│  └──────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Benefits

| Metric | Before | After (Projected) |
|--------|--------|-------------------|
| Document processing time | 3.2 days | < 5 minutes |
| Data extraction accuracy | 91.6% | 96.5% (with HITL) |
| FTEs allocated to data entry | 3.5 | 0.5 (review only) |
| Processing cost per document | $4.20 | $0.35 |
| Audit compliance | Manual logs | Full Dataverse audit trail |
| Classification consistency | 4 taxonomies | Unified 12-type taxonomy |

## Licensing Requirements

> **WARNING:** This solution requires AI Builder credits. Estimated consumption: ~5,000 AI Builder credits per month at 2,500 documents/week.
>
> Required licenses:
> - Power Apps Premium (per user) for upload and review apps
> - AI Builder credits (allocate per environment)
> - Power Automate Premium for cloud flows with Dataverse connectors
> - Dataverse database capacity for document storage
>
> Review [Microsoft AI Builder licensing](https://learn.microsoft.com/en-us/ai-builder/administer-licensing) for current credit allocations.

## Estimated Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| Discovery & Design | 2 weeks | Requirements, taxonomy definition, data model |
| Model Training | 3 weeks | Collect samples, train classification and extraction models |
| Flow Development | 2 weeks | Build orchestration, validation, and integration flows |
| App Development | 2 weeks | Upload app and review/validation canvas apps |
| Testing & UAT | 2 weeks | End-to-end testing, accuracy validation, UAT |
| Deployment | 1 week | Production deployment, monitoring setup, training |
| **Total** | **12 weeks** | |

## Folder Structure

```
document-intake-ai-builder/
├── README.md           # This file
├── architecture.md     # Detailed architecture and data flow
├── prd.md              # Product Requirements Document
├── prompts.md          # AI agent prompts for building this solution
└── risks.md            # Risk register and mitigation strategies
```
