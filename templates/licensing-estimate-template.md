# Licensing Estimate Template

> **Project:** _________________________________
> **Client:** _________________________________
> **Date:** _________________________________
> **Prepared by:** _________________________________
> **Valid Until:** _________________________________

---

> **IMPORTANT DISCLAIMER:**
> This licensing estimate is based on Microsoft's pricing at the time of creation. Microsoft licensing changes frequently. Always validate current pricing at https://www.microsoft.com/licensing before purchase. This document is for estimation purposes only and does not constitute a commitment from Microsoft or the service provider.

---

## 1. Executive Summary

| Item | Amount |
|------|--------|
| **Total Monthly Cost** | |
| **Total Annual Cost** | |
| **One-Time Setup Cost** | |
| **Year 1 Total** | |

---

## 2. Component Breakdown

### 2.1 Power Apps Licensing

| License Type | Users | Unit Price/Month | Total/Month | Total/Year |
|-------------|-------|-----------------|-------------|------------|
| Power Apps per user plan | | $20.00 | | |
| Power Apps per app plan | | $10.00 | | |
| Power Apps pay-as-you-go | [Estimated sessions] | Variable | | |
| **Power Apps Subtotal** | | | | |

### 2.2 Power Automate Licensing

| License Type | Users/Flows | Unit Price/Month | Total/Month | Total/Year |
|-------------|------------|-----------------|-------------|------------|
| Power Automate per user plan | | $15.00 | | |
| Power Automate per user with attended RPA | | $40.00 | | |
| Power Automate per user with unattended RPA | | $150.00 | | |
| Power Automate pay-as-you-go | [Estimated runs] | Variable | | |
| Process mining | | $5,000.00 | | |
| **Power Automate Subtotal** | | | | |

### 2.3 Dataverse and Capacity

| Capacity Type | Quantity | Unit Price/Month | Total/Month | Total/Year |
|--------------|----------|-----------------|-------------|------------|
| Dataverse database capacity (per GB) | | $48.00 | | |
| Dataverse file capacity (per GB) | | $2.40 | | |
| Dataverse log capacity (per GB) | | $12.00 | | |
| **Dataverse Subtotal** | | | | |

### 2.4 AI Builder

| Item | Quantity | Unit Price | Total/Month | Total/Year |
|------|----------|-----------|-------------|------------|
| AI Builder credits (per 1M service credits) | | $500.00 | | |
| **AI Builder Subtotal** | | | | |

> **WARNING:** AI Builder credit consumption varies significantly by model type. Document processing uses ~1 credit per page. Prediction models use credits per training and per prediction.

### 2.5 Copilot Studio

| Item | Quantity | Unit Price | Total/Month | Total/Year |
|------|----------|-----------|-------------|------------|
| Copilot Studio messages (per 25k messages) | | $200.00 | | |
| **Copilot Studio Subtotal** | | | | |

> **NOTE:** Copilot Studio is licensed by messages (not users). Estimate message volume carefully. A typical internal support agent may consume 500-2000 messages per month.

### 2.6 Power Pages

| Item | Quantity | Unit Price | Total/Month | Total/Year |
|------|----------|-----------|-------------|------------|
| Power Pages authenticated users (per 100 users/day) | | $200.00 | | |
| Power Pages anonymous users (per 500 users/day) | | $75.00 | | |
| **Power Pages Subtotal** | | | | |

### 2.7 Power BI

| License Type | Users | Unit Price/Month | Total/Month | Total/Year |
|-------------|-------|-----------------|-------------|------------|
| Power BI Pro | | $14.00 | | |
| Power BI Premium Per User | | $20.00 | | |
| Power BI Premium (dedicated capacity) | | $4,995.00 | | |
| **Power BI Subtotal** | | | | |

### 2.8 Microsoft 365 Base Licensing (if not already licensed)

| License Type | Users | Unit Price/Month | Total/Month | Total/Year |
|-------------|-------|-----------------|-------------|------------|
| Microsoft 365 E3 | | $36.00 | | |
| Microsoft 365 E5 | | $57.00 | | |
| **M365 Subtotal** | | | | |

---

## 3. Premium Connector Requirements

### 3.1 Premium Connectors Inventory

| Connector | Purpose | License Requirement | Users Affected |
|-----------|---------|-------------------|---------------|
| Dataverse | Core data storage | Power Apps/Automate license | All |
| Azure Blob Storage | File storage | Power Apps/Automate license | All |
| SQL Server | Legacy integration | Power Apps/Automate license | Some |
| HTTP | Custom API calls | Power Apps/Automate license | Flow runs |
| Salesforce | CRM integration | Power Apps/Automate license | Flow runs |
| ServiceNow | ITSM integration | Power Apps/Automate license | Flow runs |

### 3.2 Premium Connector Cost Impact

| Scenario | Cost Impact |
|----------|------------|
| All users already have Power Apps/Automate licenses | No additional cost |
| Some users need premium connector access | License upgrade required |
| Service account for flows | Per flow or per user license |

> **DO NOT:** Assume standard connectors are sufficient. Always audit every connector used in the solution. Using a single premium connector in an app requires all app users to have a premium license.

---

## 4. AI Builder Credits Estimate

### 4.1 Credit Consumption by Model Type

| Model Type | Usage Pattern | Credits per Use | Monthly Volume | Monthly Credits |
|-----------|-------------|----------------|----------------|----------------|
| Document processing (form) | Per page | ~1 credit/page | pages | |
| Document processing (invoice) | Per page | ~1 credit/page | pages | |
| Text recognition (OCR) | Per image | ~1 credit/image | images | |
| Sentiment analysis | Per text block | ~0.01 credit/text | texts | |
| Category classification | Per text | ~0.01 credit/text | texts | |
| Prediction | Per prediction | ~1 credit/prediction | predictions | |
| Entity extraction | Per text | ~0.01 credit/text | texts | |

### 4.2 AI Builder Total Credits

| Period | Estimated Credits | Cost |
|--------|------------------|------|
| Monthly | | |
| Annual | | |

### 4.3 AI Builder Capacity Notes

- [ ] Base allocation included with Power Apps/Automate license: 1M credits/user/month (capped at organization level)
- [ ] Additional credits may be purchased in increments
- [ ] Credit usage varies by model complexity and data volume
- [ ] Unused credits do not roll over month-to-month

---

## 5. Copilot Studio Messages Estimate

### 5.1 Message Consumption Estimate

| Conversation Type | Messages per Conversation | Daily Conversations | Daily Messages | Monthly Messages |
|------------------|--------------------------|-------------------|----------------|-----------------|
| Simple Q&A | 5-10 | | | |
| Multi-turn workflow | 15-25 | | | |
| Complex with actions | 20-40 | | | |

### 5.2 Copilot Studio Total Messages

| Period | Estimated Messages | Cost |
|--------|-------------------|------|
| Monthly | | |
| Annual | | |

---

## 6. Capacity Requirements

### 6.1 Storage Capacity Planning

| Data Type | Initial Size | Growth/Month | 12-Month Projection | Capacity Required |
|-----------|-------------|-------------|--------------------|--------------------|
| Database | GB | GB | GB | GB |
| File storage | GB | GB | GB | GB |
| Log storage | GB | GB | GB | GB |

### 6.2 API Request Capacity

| Component | Daily Requests | Monthly Requests | Notes |
|-----------|---------------|-----------------|-------|
| Power Automate | | | |
| Custom connectors | | | |
| Dataverse API | | | |

---

## 7. Monthly/Annual Cost Projection

### 7.1 Monthly Cost Breakdown

| Category | Month 1 | Month 3 | Month 6 | Month 12 |
|----------|---------|---------|---------|----------|
| Power Apps | | | | |
| Power Automate | | | | |
| Dataverse capacity | | | | |
| AI Builder | | | | |
| Copilot Studio | | | | |
| Power Pages | | | | |
| Power BI | | | | |
| **Total Monthly** | | | | |

### 7.2 Annual Cost Summary

| Category | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| Power Apps | | | |
| Power Automate | | | |
| Dataverse capacity | | | |
| AI Builder | | | |
| Copilot Studio | | | |
| Power Pages | | | |
| Power BI | | | |
| **Total Annual** | | | |

### 7.3 Cost Trend

```
Year 1: $$$$$$$$$$$$$$$$$$$$$
Year 2: $$$$$$$$$$$$$$$$$$$$$$$$ (growth)
Year 3: $$$$$$$$$$$$$$$$$$$$$$$$$$ (growth)
```

---

## 8. Alternatives Considered

### 8.1 Licensing Scenario Comparison

| Scenario | Description | Monthly Cost | Annual Cost | Pros | Cons |
|----------|-------------|-------------|-------------|------|------|
| **Recommended** | Per-user plans for core users | | | Predictable cost, full features | Higher upfront cost |
| Alternative A | Per-app plans for limited users | | | Lower cost for light users | Limited to 2 apps/user |
| Alternative B | Pay-as-you-go | | | Pay only for usage | Unpredictable costs |
| Alternative C | Mixed (per-user + per-app) | | | Cost-optimized | Complex management |

### 8.2 Recommendation

| Scenario | Recommended | Rationale |
|----------|-------------|-----------|
| | Yes / No | |

---

## 9. Cost Optimization Recommendations

| # | Recommendation | Potential Savings | Impact |
|---|---------------|------------------|--------|
| 1 | Use per-app plans for users accessing < 2 apps | | Reduced functionality |
| 2 | Implement pay-as-you-go for seasonal users | | Variable costs |
| 3 | Start with included AI credits before buying more | | Risk of running out |
| 4 | Use Power BI Pro instead of Premium PPU for small teams | | |
| 5 | Share service accounts for unattended flows | | Audit complexity |

---

## 10. Approval

| Role | Name | Approval Date | Notes |
|------|------|--------------|-------|
| Solution Architect | | | Technical validation |
| Account Manager | | | Commercial validation |
| Client Budget Owner | | | Budget approval |

---

## Appendix A: Pricing Source

| Item | Source | Date Validated |
|------|--------|---------------|
| Power Apps pricing | Microsoft website | |
| Power Automate pricing | Microsoft website | |
| Dataverse capacity | Microsoft website | |
| AI Builder credits | Microsoft website | |
| Copilot Studio | Microsoft website | |

## Appendix B: Notes

1. All prices in USD (or local currency)
2. Prices exclude taxes
3. Annual commitment pricing may offer 15-20% discount
4. EA (Enterprise Agreement) pricing may differ
5. Non-profit and education pricing may apply
6. Currency exchange rates may affect non-USD pricing
