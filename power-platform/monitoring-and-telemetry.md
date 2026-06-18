---
title: "Monitoring and Telemetry"
description: "Monitoring patterns for Power Platform solutions"
category: "operations"
tags: ["monitoring", "telemetry", "analytics", "alerts", "application-insights"]
---

# Monitoring and Telemetry

## 1. Power Platform Admin Center Analytics

### Accessing Analytics

```
https://admin.powerplatform.microsoft.com
  └── Analytics > (select component)
```

### Available Analytics

| Component | Metrics Available | Refresh Rate |
|-----------|------------------|--------------|
| Power Apps | Daily active users, sessions, errors | 24 hours |
| Power Automate | Runs, success rate, latency | Near real-time |
| Dataverse | Storage usage, API calls, capacity | 24 hours |
| Copilot Studio | Conversations, sessions, CSAT | Near real-time |
| AI Builder | Model usage, credit consumption | 24 hours |
| Power Pages | Page views, unique users | 24 hours |
| Connectors | Calls, errors, latency | 24 hours |

### PowerShell Export

```powershell
# Get environment capacity
Get-AdminPowerAppEnvironment -EnvironmentName <guid> |
    Select-Object DisplayName, @{N="DatabaseCapacity";E={$_.Capacity[0].ActualConsumption}},
                  @{N="FileCapacity";E={$_.Capacity[1].ActualConsumption}}

# Get app usage
Get-AdminPowerApp -EnvironmentName <guid> |
    Select-Object DisplayName, AppVersion, CreatedTime, LastModifiedTime,
                  @{N="Sessions7Days";E={$_.UsageMetrics.Sessions}}
```

---

## 2. Dataverse Auditing

### Enable Auditing

```powershell
# Organization-level
Set-CrmRecord -EntityLogicalName organization `
    -Id $orgId `
    -Fields @{"isauditenabled"=$true}

# Table-level
Set-CrmRecord -EntityLogicalName aluma_project `
    -Id $tableMetadataId `
    -Fields @{"auditenabled"=$true}

# Column-level (via maker portal)
# Tables > [Table] > Columns > [Column] > Advanced options > Enable auditing
```

### Query Audit Logs

```csharp
// C# SDK
var query = new QueryExpression("audit");
query.ColumnSet = new ColumnSet("createdon", "operation", "attributemask",
                                 "objectid", "objecttypecode", "userid");
query.Criteria.AddCondition("createdon", ConditionOperator.LastXDays, 7);
query.Criteria.AddCondition("objecttypecode", ConditionOperator.Equal, "aluma_project");

var results = service.RetrieveMultiple(query);
```

### Web API Query

```javascript
// Get audit records for a specific record
GET /api/data/v9.2/audits?
  $filter=_objectid_value eq <record-id>
  &$orderby=createdon desc
  &$top=50
```

---

## 3. Flow Run History and Analytics

### Via Power Automate Portal

```
https://make.powerautomate.com
  └── My flows > [Flow] > Run history
  └── Analytics (28-day view)
```

### Programmatic Access

```powershell
# Get flow runs via Power Automate Management API
$token = (Get-AzAccessToken -ResourceUrl "https://service.flow.microsoft.com").Token

Invoke-RestMethod -Uri "https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/{env}/flows/{flow}/runs?api-version=2016-11-01" `
    -Headers @{Authorization="Bearer $token"} `
    -Method Get
```

### Flow Health Check Flow

```
[Recurrence: Every hour]
  │
  ▼
[Get flows in environment]
  │
  ▼
[Apply to each: Flow]
  │
  ├──▶ [Get last 10 runs]
  │
  ├──▶ [Calculate success rate]
  │      Failed runs / Total runs
  │
  ├──▶ [Condition: Success rate < 80%?]
  │      ├── Yes → [Create alert record]
  │      │         [Send Teams notification]
  │      │         [Log to Application Insights]
  │      └── No  → [Continue]
  │
  └──▶ [Condition: Any run stuck > 1 hour?]
         ├── Yes → [Send alert: Stuck flow]
         └── No  → [Continue]
```

---

## 4. AI Builder Monitoring

### Model Performance Tracking

```
AI Builder > Models > [Model] > Performance

Metrics:
- Accuracy (training vs. test set)
- Precision / Recall
- Confidence distribution
- Usage (predictions per day)
```

### Credit Consumption

```powershell
# Get AI Builder credit usage
# Admin Center > Analytics > AI Builder
# Or via PowerShell:
Get-AdminPowerAppEnvironment |
    Select-Object DisplayName,
                  @{N="AICreditsUsed";E={$_.AICapacity.ActualConsumption}}
```

### Model Retraining Trigger

```
[Recurrence: Weekly]
  │
  ▼
[Get model performance metrics]
  │
  ▼
[Condition: Accuracy < threshold?]
  │
  ├──▶ Yes → [Create retraining task]
  │         [Notify model owner]
  │         [Log accuracy drop]
  │
  └──▶ No  → [Log: Model healthy]
```

---

## 5. Copilot Studio Analytics

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Conversation completion rate | > 80% | < 70% |
| Escalation rate | < 20% | > 30% |
| Avg session duration | 2-5 min | > 10 min |
| CSAT score | > 4.0 | < 3.5 |
| Deflection rate | > 60% | < 50% |

### Analytics Query

```powershell
# Get session summaries
# Copilot Studio > Analytics > Sessions
# Export to CSV for analysis

# Power BI integration available
# Connect to Copilot Studio analytics dataset
```

---

## 6. Azure Application Insights Integration

### Setup for Canvas Apps

```javascript
// In Canvas App > OnStart
Set(varAppInsightsKey, "your-instrumentation-key");

// Track event
AppInsights.LogEvent(varAppInsightsKey, "ScreenLoaded", 
  JSON({screen: "Dashboard", user: User().Email, timestamp: Now()}));
```

### Setup for Model Apps

```javascript
// Web resource with Application Insights SDK
var appInsights = new Microsoft.ApplicationInsights.ApplicationInsights({
    config: {
        instrumentationKey: "your-key",
        endpointUrl: "https://dc.services.visualstudio.com/v2/track"
    }
});

// Track page view
appInsights.trackPageView({name: "Account Form"});

// Track event
appInsights.trackEvent({name: "ButtonClick", properties: {button: "Save"}});
```

### Setup for Power Pages

```html
<!-- Power Pages > Site Settings > Custom JavaScript -->
<script src="https://js.monitor.azure.com/scripts/b/ai.2.min.js"></script>
<script>
  var appInsights = new Microsoft.ApplicationInsights.ApplicationInsights({
    config: { instrumentationKey: "{{ settings['aluma/appinsights-key'] }}" }
  });
  appInsights.trackPageView();
</script>
```

### Custom Dimensions

```csharp
// In plug-in
var telemetry = new Dictionary<string, string>
{
    ["Entity"] = context.PrimaryEntityName,
    ["Operation"] = context.MessageName,
    ["UserId"] = context.UserId.ToString(),
    ["Duration"] = sw.ElapsedMilliseconds.ToString(),
    ["Organization"] = orgName
};

// Send to Application Insights
appInsights.TrackEvent("DataverseOperation", telemetry);
```

---

## 7. Custom Logging Patterns

### Dataverse Log Table

```
Table: aluma_LogEntry
Columns:
  - aluma_Source (string) - Component name
  - aluma_Level (choice) - Error, Warning, Information, Debug
  - aluma_Message (string) - Log message
  - aluma_Details (string) - JSON details
  - aluma_CorrelationId (string) - Trace ID
  - aluma_User (lookup to contact/systemuser)
  - aluma_Timestamp (datetime)
```

### Flow Logging Pattern

```
[Scope: Main Logic]
  │
  ├──▶ [Initialize: varCorrelationId = guid()]
  ├──▶ [Initialize: varStartTime = utcNow()]
  │
  ├──▶ [Try: Main Actions]
  │
  └──▶ [Catch: Error Handler]
         │
         ├──▶ [Calculate duration]
         ├──▶ [Create Log Entry]
         │      Source: "Flow: ApprovalProcess"
         │      Level: "Error"
         │      Message: outputs('Main Logic')['errors']
         │      Details: {
         │        correlationId: varCorrelationId,
         │        duration: sub(utcNow(), varStartTime),
         │        runId: workflow().run.name
         │      }
         │
         └──▶ [Send alert if critical]
```

---

## 8. Alert Configuration

### Dataverse Alerts (via Flow)

```
[Trigger: When record is created (aluma_Alert)]
  │
  ▼
[Switch: Severity]
  ├──▶ Critical → [Send email: On-call team]
  │             → [Post to Teams: Emergency channel]
  │             → [Create PagerDuty incident]
  │
  ├──▶ High    → [Send email: Team lead]
  │             → [Post to Teams: Alerts channel]
  │
  ├──▶ Medium  → [Post to Teams: General channel]
  │
  └──▶ Low     → [Log only]
```

### Azure Monitor Alerts

```json
{
  "alert": {
    "name": "Flow Failure Rate",
    "condition": {
      "metric": "flow.failure.percentage",
      "operator": "GreaterThan",
      "threshold": 20
    },
    "action": {
      "type": "email",
      "recipients": ["admin@example.com"]
    }
  }
}
```

### Health Dashboard Query (Application Insights)

```kusto
// Application Insights - Custom Dashboard
let timeRange = 24h;
// Flow success rate
customEvents
| where timestamp > ago(timeRange)
| where name == "FlowRun"
| summarize 
    Total = count(),
    Success = countif(customDimensions.status == "Succeeded"),
    Failed = countif(customDimensions.status == "Failed")
    by bin(timestamp, 1h)
| extend SuccessRate = (Success * 100.0) / Total
| project timestamp, Total, Success, Failed, SuccessRate
| render timechart

// Top errors
customEvents
| where timestamp > ago(timeRange)
| where name == "Error"
| summarize Count = count() by 
    Source = tostring(customDimensions.source),
    ErrorType = tostring(customDimensions.errorType)
| order by Count desc
| take 10
```
