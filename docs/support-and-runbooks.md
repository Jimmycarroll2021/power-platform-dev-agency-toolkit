# Support and Runbooks Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Purpose**: Operational support model, troubleshooting procedures, and runbook templates for Power Platform solutions.

---

## 1. Support Tiers

### 1.1 Tier Definitions

```
TIER 1 (L1) - Helpdesk / First Line
  Scope:
    - User access issues (can't log in, password reset)
    - Basic "how-to" questions
    - App navigation help
    - Report location questions
  
  Skills needed:
    - Familiarity with Power Platform UI
    - User management basics
    - Basic troubleshooting
  
  Escalation to L2:
    - Technical errors
    - Flow failures
    - Data issues
    - Performance problems

TIER 2 (L2) - Technical Support / Second Line
  Scope:
    - Flow run failures and debugging
    - App errors and connectivity issues
    - Data import/export issues
    - Connection reference problems
    - Permission/security issues
    - Environment configuration
  
  Skills needed:
    - Power Platform admin skills
    - Flow debugging experience
    - Dataverse knowledge
    - Security model understanding
  
  Escalation to L3:
    - Plugin failures
    - Complex integration issues
    - Performance degradation
    - Data corruption
    - Architecture changes

TIER 3 (L3) - Development Team / Third Line
  Scope:
    - Code-level issues (plugins, PCF, custom APIs)
    - Architecture changes
    - Complex bug fixes
    - Performance optimization
    - Solution patching
    - Root cause analysis
  
  Skills needed:
    - Full Power Platform development
    - C# plugin development
    - Integration architecture
    - Performance tuning
```

### 1.2 Escalation Matrix

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   Issue Type    │     Response    │   Resolution    │   Escalation    │
│                 │     Time        │   Target        │   Path          │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ User can't      │ 15 min          │ 1 hour          │ L1 → L2 if      │
│ access app      │                 │                 │ permission issue│
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Flow failed     │ 1 hour          │ 4 hours         │ L2 → L3 if      │
│ single run      │                 │                 │ code issue      │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Flow failing    │ 30 min          │ 2 hours         │ L2 → L3         │
│ repeatedly      │                 │                 │                 │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Data incorrect  │ 2 hours         │ 8 hours         │ L2 → L3 if      │
│                 │                 │                 │ data corruption │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Performance     │ 2 hours         │ 24 hours        │ L2 → L3         │
│ degradation     │                 │                 │                 │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Security        │ 1 hour          │ 4 hours         │ L2 → L3 +       │
│ incident        │                 │                 │ security team   │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Outage          │ 15 min          │ 2 hours         │ All hands       │
│ (critical)      │                 │                 │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## 2. Common Issues and Resolutions

### 2.1 Flow Failures

```
ISSUE: "Flow run failed - ActionTimeout"
CAUSE: Action took longer than configured timeout
RESOLUTION:
  1. Check if external system is responding
  2. Increase timeout on action (Settings > Timeout)
  3. Check if data volume is unusually high
  4. Consider async pattern for long operations
  5. If recurring: Optimize flow or use batch processing
PREVENTION:
  - Set appropriate timeouts during development
  - Add retry policies
  - Monitor flow run durations

ISSUE: "Flow run failed - ConnectorUnauthorized"
CAUSE: Connection has expired or credentials changed
RESOLUTION:
  1. Go to Data > Connections
  2. Find the failed connection
  3. Click "Fix connection" and re-authenticate
  4. If service account: Check if password expired
  5. Update connection reference
PREVENTION:
  - Use service accounts with non-expiring passwords
  - Monitor connection health
  - Document all connection owners

ISSUE: "Flow run failed - APINotFound"
CAUSE: Referenced API endpoint changed or unavailable
RESOLUTION:
  1. Check if external system is online
  2. Verify API URL hasn't changed
  3. Check if API version deprecated
  4. Review custom connector definition
  5. Update environment variable if URL changed
PREVENTION:
  - Use environment variables for URLs
  - Subscribe to API change notifications
  - Health check flows for external systems

ISSUE: "Flow triggered too many times / infinite loop"
CAUSE: Trigger condition missing or incorrect filter
RESOLUTION:
  1. Immediately turn off flow
  2. Review trigger settings
  3. Add trigger conditions
  4. Add filter rows to narrow scope
  5. Test before turning back on
PREVENTION:
  - Always set trigger conditions
  - Use "select columns" to narrow triggers
  - Test with sample data volume
```

### 2.2 App Issues

```
ISSUE: "User sees blank screen / app won't load"
CAUSE: Permission, data source, or connection issue
RESOLUTION:
  1. Verify user has app shared with them
  2. Check user has data source permissions
  3. Check connection references are valid
  4. Verify user has Dataverse security role
  5. Check for delegation errors in OnStart
  6. Test with same permissions as user

ISSUE: "Data not showing in gallery"
CAUSE: Delegation warning, filter too restrictive, or permissions
RESOLUTION:
  1. Check for blue dot (delegation warning)
  2. Simplify filter to test basic load
  3. Verify user has read permissions on table
  4. Check if data exists in Dataverse
  5. Test query directly in Dataverse

ISSUE: "App slow to load"
CAUSE: Too much data in OnStart, complex formulas, large images
RESOLUTION:
  1. Review OnStart formulas
  2. Use Concurrent() for parallel loads
  3. Reduce initial data set
  4. Implement lazy loading
  5. Compress images
  6. Check for unnecessary data sources
```

### 2.3 Dataverse Issues

```
ISSUE: "User can't see records they should see"
CAUSE: Security role, business unit, or ownership issue
RESOLUTION:
  1. Check user's security roles
  2. Verify role has Read permission on table
  3. Check record ownership (user/team)
  4. Verify business unit scope
  5. Check if hierarchy security applies
  6. Test with "Run as another user"

ISSUE: "Plugin error on record save"
CAUSE: Plugin throwing exception
RESOLUTION:
  1. Check Plugin Trace Log for error details
  2. Review plugin code for the failing step
  3. Check if pre/post images have required fields
  4. Verify plugin registration (message, entity, stage)
  5. Test with plugin disabled to isolate
  6. Check if recursive trigger (plugin triggers itself)

ISSUE: "API limit exceeded"
CAUSE: Too many API calls in short period
RESOLUTION:
  1. Identify source of high API usage
  2. Check for inefficient flows (loops without filters)
  3. Review apps for unnecessary data refreshes
  4. Implement caching where possible
  5. Spread load across time (batch vs real-time)
  6. Consider capacity add-on if persistent
```

---

## 3. Monitoring and Alerting Setup

### 3.1 Flow Monitoring

```
Built-in monitoring:
  Power Automate > My flows > [Flow] > Runs
  Shows: Success, failure, duration

Health check flow (create for each critical flow):
  Trigger: Schedule (daily at 8 AM)
  Actions:
    1. Get flow run history (last 24 hours)
    2. Calculate success rate
    3. Condition: Success rate < 95%?
       Yes:
       - Get failed run details
       - Send Teams alert to support channel
       - Send email to admin
    4. Log to monitoring Dataverse table

Alert thresholds:
  - Critical flows: > 99% success rate
  - Standard flows: > 95% success rate
  - Report flows: > 90% success rate
```

### 3.2 Environment Monitoring

```
Weekly health check:
  [ ] Review flow failure reports
  [ ] Check Dataverse capacity usage
  [ ] Review app session trends
  [ ] Check for orphaned resources
  [ ] Review API usage patterns
  [ ] Check solution imports (any failures?)
  [ ] Verify backup status
  [ ] Review DLP policy violations
  [ ] Check for license compliance issues
  [ ] Review security audit logs
```

### 3.3 Custom Monitoring Dashboard

```
Create Power BI dashboard from:
  - CoE Starter Kit data
  - Flow run history (via Data Export)
  - Admin Center API
  - Custom monitoring Dataverse tables

Key metrics to display:
  - Flow success rate (trending)
  - Top failing flows
  - App session count
  - Active users
  - API consumption
  - Dataverse capacity
  - Solution deployment history
  - Open support tickets
```

---

## 4. Runbook Templates

### 4.1 Flow Failure Runbook

```
RUNBOOK: Flow Failure Investigation
VERSION: 1.0
LAST UPDATED: 2025-01-15

TRIGGER: Alert received (Teams/email) or user reports flow not working

STEP 1: Identify (5 min)
  [ ] Identify which flow failed
  [ ] Identify the failure time
  [ ] Check if it's isolated or widespread
  [ ] Note the error message

STEP 2: Initial Assessment (10 min)
  [ ] Open flow in Power Automate
  [ ] Check run history (last 10 runs)
  [ ] Identify which action failed
  [ ] Note the error details:
      - Error code: _____________
      - Error message: _____________
      - Failed action: _____________

STEP 3: Common Cause Check (15 min)
  [ ] Connection expired? → Fix connection
  [ ] Permission issue? → Check service account
  [ ] External API down? → Check external system
  [ ] Data issue? → Check input data
  [ ] Timeout? → Check performance
  [ ] Trigger condition issue? → Review filter

STEP 4: Resolution (varies)
  If connection issue:
    [ ] Navigate to Data > Connections
    [ ] Find failed connection
    [ ] Click "Fix connection"
    [ ] Re-authenticate
    [ ] Re-run failed flow

  If permission issue:
    [ ] Check service account status
    [ ] Verify security role
    [ ] Check if password expired
    [ ] Update if needed
    [ ] Re-run failed flow

  If external API issue:
    [ ] Check API status page
    [ ] Test API independently (Postman)
    [ ] Contact API owner if needed
    [ ] Document incident
    [ ] Re-run when API available

  If data issue:
    [ ] Examine trigger data
    [ ] Check data format/validity
    [ ] Fix source data if possible
    [ ] Re-run with corrected data

STEP 5: Verification (10 min)
  [ ] Re-run the failed flow (test trigger)
  [ ] Confirm successful completion
  [ ] Check output is correct
  [ ] Monitor next few scheduled runs

STEP 6: Documentation (10 min)
  [ ] Log incident in support tracker
  [ ] Document root cause
  [ ] Document resolution
  [ ] Update runbook if needed
  [ ] Notify stakeholders if needed

ESCALATION: If not resolved in 1 hour, escalate to L3
```

### 4.2 User Access Issue Runbook

```
RUNBOOK: User Cannot Access App
VERSION: 1.0
LAST UPDATED: 2025-01-15

TRIGGER: User reports they cannot access an app

STEP 1: Verify Symptom (5 min)
  [ ] Exact error message:
  [ ] App name:
  [ ] User email:
  [ ] When did it last work:
  [ ] Other users affected? (Y/N)

STEP 2: Check App Sharing (5 min)
  [ ] Go to make.powerapps.com
  [ ] Find the app
  [ ] Check app sharing:
      [ ] Is user listed? (Y/N)
      [ ] Is a security group listed that includes user? (Y/N)
  [ ] If not shared: Add user and test

STEP 3: Check Data Permissions (10 min)
  [ ] Does app use Dataverse? (Y/N)
  [ ] If yes:
      [ ] Check user's security roles
      [ ] Verify role has permissions on required tables
      [ ] Verify user is in correct Business Unit
      [ ] Check if field-level security blocking
  [ ] Does app use SharePoint? (Y/N)
  [ ] If yes:
      [ ] Check SharePoint list/library permissions
      [ ] Verify user has at least Read access

STEP 4: Check Connection Issues (5 min)
  [ ] Are all data source connections valid?
  [ ] Is user getting connection prompt?
  [ ] Check if implicit connection needed

STEP 5: Resolution
  - If not shared: Share app with user
  - If role missing: Assign appropriate security role
  - If BU wrong: Move user to correct BU (or adjust role scope)
  - If SharePoint: Grant list/library permissions
  - If connection: Guide user to create connection

STEP 6: Verification
  [ ] Ask user to try accessing again
  [ ] Confirm they can open the app
  [ ] Confirm they can see data
  [ ] Confirm they can perform key actions

ESCALATION: If not resolved in 30 min, escalate to L2
```

### 4.3 Deployment Runbook

```
RUNBOOK: Solution Deployment to Production
VERSION: 1.0
LAST UPDATED: 2025-01-15

TRIGGER: Scheduled deployment or emergency fix

PRE-DEPLOYMENT (Day Before):
  [ ] Managed solution exported from TEST
  [ ] Solution checker passed
  [ ] Deployment window confirmed with client
  [ ] PROD environment backed up
  [ ] Rollback plan documented
  [ ] Support team on standby
  [ ] Stakeholders notified

DEPLOYMENT DAY:

Step 1: Pre-Check (15 min)
  [ ] Verify service accounts are active
  [ ] Verify connection references have valid connections
  [ ] Verify environment variables set correctly
  [ ] Check no flows currently running
  [ ] Confirm deployment window is open

Step 2: Backup (10 min)
  [ ] Export current PROD solution (backup)
  [ ] Verify backup is valid
  [ ] Store backup with timestamp

Step 3: Import (timing varies)
  [ ] Import managed solution
  [ ] Select: Activate plugins
  [ ] Select: Overwrite customizations (if needed - be careful)
  [ ] Wait for import to complete
  [ ] Monitor progress

Step 4: Post-Import (15 min)
  [ ] Publish all customizations
  [ ] Verify solution version updated
  [ ] Check for import errors/warnings
  [ ] Activate flows
  [ ] Verify plugins registered

Step 5: Verification (30 min)
  [ ] Smoke test: Open app, verify loads
  [ ] Smoke test: Trigger flow manually, verify runs
  [ ] Smoke test: Create test record
  [ ] Smoke test: Verify security roles
  [ ] Smoke test: Check key integrations

Step 6: Monitoring (4 hours)
  [ ] Monitor flow run success rates
  [ ] Monitor for error alerts
  [ ] Check user reports
  [ ] Keep rollback option ready

POST-DEPLOYMENT:
  [ ] Notify stakeholders of successful deployment
  [ ] Update environment documentation
  [ ] Log deployment in change log
  [ ] Schedule post-deployment review (next day)
  [ ] Archive deployment package

ROLLBACK (if needed):
  [ ] Import previous managed solution (backup)
  [ ] Verify rollback successful
  [ ] Notify stakeholders
  [ ] Document rollback reason
  [ ] Schedule root cause analysis
```

---

## 5. Change Management

### 5.1 Change Request Process

```
All changes to production must follow this process:

1. REQUEST (anyone)
   Submit change request form:
   - Change description
   - Business justification
   - Requested by / Date

2. ASSESS (L2/L3)
   - Impact analysis
   - Effort estimate
   - Risk assessment
   - Recommended approach

3. APPROVE (change manager / client)
   - Review assessment
   - Approve / reject / defer
   - Set priority

4. SCHEDULE (project manager)
   - Assign to developer
   - Schedule in sprint/maintenance window
   - Communicate timeline

5. BUILD (developer)
   - Make changes in DEV
   - Unit test
   - Peer review
   - Export managed solution

6. TEST (QA)
   - Deploy to TEST
   - Regression testing
   - Verify fix/feature

7. DEPLOY (L2/L3)
   - Follow deployment runbook
   - Deploy to PROD
   - Verify in production

8. CLOSE
   - Update documentation
   - Notify requester
   - Log in change register
```

### 5.2 Emergency Change Procedure

```
For critical production fixes only:

1. IDENTIFY (L2/L3)
   - Critical issue confirmed
   - Business impact assessed
   - No workaround available

2. AUTHORIZE (client + internal lead)
   - Emergency change approved verbally
   - Documented after the fact
   - Rollback plan confirmed

3. FIX (L3)
   - Fix in DEV
   - Minimal testing (smoke test)
   - Deploy directly to PROD
   - Full testing after deployment

4. DOCUMENT (within 24 hours)
   - Post-hoc change request
   - Root cause
   - Fix applied
   - Testing performed
   - Any issues encountered

5. REVIEW (within 1 week)
   - Was emergency classification correct?
   - Could normal process have been used?
   - Lessons learned
```

---

## 6. Backup and Disaster Recovery

### 6.1 Backup Strategy

```
Automatic backups (Dataverse):
  - Daily: System-managed, 28-day retention
  - Manual: On-demand before changes
  - No extra cost for automatic

What IS backed up automatically:
  - Dataverse data (tables, records)
  - Solution components
  - App definitions
  - Flow definitions
  - Security roles
  - Business rules

What is NOT backed up:
  - Individual flow run history (30/90 days only)
  - Audit logs (based on retention)
  - Connection credentials
  - Environment variable current values
  - Custom connector connections

Recommended additional backups:
  [ ] Export managed solution monthly to source control
  [ ] Document environment variable values
  [ ] Document connection reference mappings
  [ ] Export configuration data (using Config Migration Tool)
  [ ] Document plugin registration settings
```

### 6.2 Recovery Procedures

```
SCENARIO 1: Accidental data deletion
  1. Stop all flows that create/modify data
  2. Identify what was deleted and when
  3. Check audit log for details
  4. Option A: Restore from backup (loses data since backup)
  5. Option B: Recreate manually if small amount
  6. Option C: Use audit data to reconstruct
  7. Re-enable flows after recovery

SCENARIO 2: Solution import corrupted environment
  1. Assess scope of corruption
  2. If isolated component: Revert specific change
  3. If widespread: Restore from pre-import backup
  4. Notify all users of outage
  5. Root cause analysis
  6. Fix issue in DEV, re-test, re-deploy

SCENARIO 3: Full environment failure
  1. Contact Microsoft Support (if platform issue)
  2. If environment-level: Restore from backup
  3. Verify all components restored
  4. Re-establish connections
  5. Re-verify environment variables
  6. Smoke test all apps and flows
  7. Notify users when ready

RECOVERY TIME OBJECTIVES (RTO):
  - Critical systems: 4 hours
  - Standard systems: 24 hours
  - Non-critical: 72 hours

RECOVERY POINT OBJECTIVES (RPO):
  - Maximum acceptable data loss: 24 hours
```

---

## 7. Service Level Expectations

### 7.1 SLA Definitions

```
Response Time = Time from ticket creation to first acknowledgment
Resolution Time = Time from ticket creation to fix/workaround

Standard SLA:
  Severity 1 (Critical - system down):
    Response: 15 minutes
    Resolution: 2 hours
    Escalation: Immediate

  Severity 2 (High - major function broken):
    Response: 1 hour
    Resolution: 8 hours
    Escalation: 4 hours

  Severity 3 (Medium - partial impact):
    Response: 4 hours
    Resolution: 2 business days
    Escalation: 1 business day

  Severity 4 (Low - question/minor issue):
    Response: 8 hours
    Resolution: 5 business days
    Escalation: N/A

Premium SLA (optional add-on):
  24/7 coverage for Severity 1-2
  Faster response times
  Dedicated support engineer
```

### 7.2 SLA Monitoring

```
Track monthly:
  - Total tickets by severity
  - Average response time by severity
  - Average resolution time by severity
  - SLA compliance percentage
  - Escalation count
  - Repeat issue count
  - Customer satisfaction score

Report monthly to client:
  - Ticket summary
  - SLA performance
  - Top issues
  - Recommendations
```

---

## 8. Handover Process

### 8.1 From Build Team to Support Team

```
Before handover, provide:

[ ] Solution documentation (architecture, components)
[ ] Runbook for each app and flow
[ ] Environment documentation
[ ] Security model documentation
[ ] Known issues list
[ ] Contact list (who to call for what)
[ ] Access credentials (service accounts)
[ ] Training session recording
[ ] Support knowledge base articles
[ ] Monitoring dashboard access
[ ] Escalation procedures
[ ] Change management process

Handover meeting agenda:
  1. Solution walkthrough (2 hours)
  2. Common issue demonstration (1 hour)
  3. Q&A session (1 hour)
  4. Shadow support for 1 week (optional)
```

### 8.2 From Our Team to Client Internal Team

```
Knowledge transfer sessions:
  Session 1: Platform overview (2 hours)
    - Architecture
    - Key components
    - Data model

  Session 2: Administration (2 hours)
    - Environment management
    - User/security management
    - Monitoring

  Session 3: Development basics (4 hours)
    - Making small changes
    - Solution management
    - Testing approach

  Session 4: Troubleshooting (2 hours)
    - Common issues
    - Debugging techniques
    - When to escalate

Documentation handover:
  [ ] All source code in client repository
  [ ] All documentation in client SharePoint
  [ ] Admin credentials transferred
  [ ] License ownership transferred
  [ ] Third-party accounts transferred
```

---

## 9. Knowledge Base Maintenance

```
KNOWLEDGE BASE STRUCTURE:

/ Power Platform Support KB
  / Apps
    / [App Name]
      - Overview
      - Common Issues
      - Admin Procedures
  / Flows
    / [Flow Name]
      - Overview
      - Trigger and Schedule
      - Common Failures
      - Recovery Procedures
  / Dataverse
    - Table Reference
    - Security Model
    - Data Procedures
  / Integrations
    / [System Name]
      - Connection Details
      - API Reference
      - Troubleshooting
  / How-To
    - Reset password
    - Request access
    - Run reports
    - Export data

MAINTENANCE SCHEDULE:
  Weekly: Add new issues/resolutions
  Monthly: Review and update existing articles
  Quarterly: Full review, archive outdated content
```

---

*End of Support and Runbooks Guide. Customize runbooks for each client's specific solution.*
