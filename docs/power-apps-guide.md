# Power Apps Comprehensive Guide

> **Version**: 1.0 | **Last updated**: 2025-01-15
> **Applies to**: Canvas Apps, Model-Driven Apps, Custom Pages
> **Needs verification against current Microsoft docs**: Features and limits change frequently.

---

## 1. App Type Decision Matrix

This is the first decision on every project. Get this wrong and everything else suffers.

| Factor | Canvas App | Model-Driven App | Custom Page |
|--------|-----------|-------------------|-------------|
| **UI control** | Pixel-perfect | Auto-generated | Canvas inside Model |
| **Data source** | Any (flexible) | Dataverse only | Dataverse (host app) |
| **Mobile experience** | Excellent | Good | Good |
| **Complex relationships** | Harder to build | Native | Medium |
| **Security model** | App-level + connector | Row/column/field level | Inherits model app |
| **Rapid development** | Fast for simple apps | Fast for data-heavy | Extra effort |
| **Offline support** | Yes (with setup) | Limited | Limited |
| **Best for** | Field apps, custom UX | CRM, case mgmt, data apps | Custom dashboards |
| **When to choose** | Mobile-first, unique UI | Complex data, security | Custom viz in model app |

### Quick Decision Tree

```
External users needed?
  Yes -> Power Pages (not Power Apps)
  No  -> Continue...

Need complex data relationships with security?
  Yes -> Model-Driven App
  No  -> Continue...

Need pixel-perfect custom UI?
  Yes -> Canvas App
  No  -> Continue...

Need both custom UI AND Dataverse security?
  Yes -> Model-Driven + Custom Pages
  No  -> Canvas App (default choice)
```

---

## 2. Canvas Apps Deep Dive

### 2.1 Screen Size and Orientation Strategy

```
// Recommended app settings for responsive design
Settings > Display:
  - Orientation: Landscape (default)
  - Size: 16:9 (default) OR Custom for specific device
  - Scale to fit: OFF (for responsive)
  - Lock aspect ratio: OFF
  - Lock orientation: ON (prevent rotation issues)
```

### 2.2 Responsive Design Pattern

```powerapps
// Use these formulas for responsive layout:

// Full width container
Width = Parent.Width

// Two-column layout
LeftPanel.Width = Parent.Width * 0.3
RightPanel.Width = Parent.Width * 0.7
RightPanel.X = LeftPanel.Width

// Stack layout (gallery-style)
Gallery.Width = Parent.Width
Gallery.TemplateSize = If(Parent.Width < 500, 200, 150)

// Font scaling
Label.FontSize = If(Parent.Width < 500, 12, 16)

// Responsive navigation - show hamburger on small screens
MenuBar.Visible = Parent.Width > 800
HamburgerMenu.Visible = Parent.Width <= 800
```

### 2.3 Power Fx Essentials

```powerapps
// ---- VARIABLES ----
// Global variable (available across all screens)
Set(gblSelectedRecord, Gallery1.Selected)

// Context variable (single screen)
UpdateContext({locIsLoading: true})

// Collection (in-memory table)
ClearCollect(colFilteredItems, Filter(datasource, Status = "Active"))

// ---- NAVIGATION ----
Navigate(Screen2, ScreenTransition.Fade)
Navigate(Screen2, ScreenTransition.None, {contextVar: value})
Back()

// ---- DATA OPERATIONS ----
// Filter with delegation
Filter(Accounts, Status = "Active" && CreatedOn > Date(2024,1,1))

// Search (non-delegable for some sources)
Search(Accounts, TextInput1.Text, "name", "email")

// Lookup
LookUp(Accounts, accountid = selectedId)

// Patch (update single record)
Patch(Accounts, Gallery1.Selected, {Status: "Closed"})

// Patch (create new)
Patch(Accounts, Defaults(Accounts), {Name: "New Account"})

// Collect (add to collection)
Collect(colErrors, {Message: "Error occurred", Time: Now()})

// ClearCollect (clear then collect - preferred)
ClearCollect(colResults, Filter(Accounts, Owner = User().Email))

// RemoveIf
RemoveIf(Accounts, Status = "Obsolete")

// ---- COMMON FORMULAS ----
// Default selected item in dropdown
Dropdown1.Default = LookUp(Choices, Value = "Option A")

// Conditional formatting
Label1.Color = If(ThisItem.Status = "Critical", Red, Green)

// Show/hide based on role
AdminPanel.Visible = !IsBlank(LookUp(AdminUsers, Email = User().Email))

// Loading state
Gallery1.Visible = !locIsLoading
LoadingSpinner.Visible = locIsLoading

// Calculate total from gallery
Sum(Gallery1.AllItems, Amount)

// Count filtered items
CountRows(Filter(Gallery1.AllItems, Status = "Pending"))
```

### 2.4 Delegation Warnings (CRITICAL)

**The 2000-row limit**: Canvas apps can only process 2000 rows locally. Everything beyond that must be delegated to the data source.

| Data Source | Delegable Functions | Non-Delegable |
|-------------|--------------------| --------------|
| Dataverse | Filter, Sort, SortByColumns, Lookup, First, CountRows, Max, Min, Avg, Sum | Search (partial), AddColumns, ShowColumns |
| SharePoint | Filter, Sort, SortByColumns, First | CountRows, Max, Min, Sum, Avg, Search |
| SQL Server | Most functions | Varies by setup |
| Excel Online | None (not delegable) | Everything |

```powerapps
// BAD: Non-delegable - will only get 2000 rows then filter
Filter(Collect(MyLocalCollection, Accounts), Status = "Active")

// GOOD: Delegable - filter happens at data source
Filter(Accounts, Status = "Active")

// BAD: CountRows on large table (not delegable in SharePoint)
CountRows(Filter(SharePointList, Status = "Active"))

// GOOD: Use delegable alternative
CountIf(SharePointList, Status = "Active")  // SharePoint delegable

// BAD: Multiple non-delegable functions chained
First(Sort(Filter(Accounts, Year(CreatedOn) = 2024), Name))

// GOOD: Use delegable date comparison
First(Sort(Filter(Accounts, CreatedOn >= Date(2024,1,1)), Name))
```

### 2.5 Component Library Best Practices

```
Step 1: Create Component Library
  make.powerapps.com > Apps > Component Libraries > New

Step 2: Build reusable components
  - Header: Logo, user name, notification bell, back button
  - Navigation: Tab bar, sidebar, breadcrumb
  - Footer: Status bar, save/cancel buttons
  - Dialog: Confirmation, error, info dialogs
  - Loading: Spinner overlay

Step 3: Publish version
  After changes: ... > Publish

Step 4: Import into app
  Insert > Get more components > Your component library

Step 5: Update when library changes
  Check for updates periodically
```

**Example Header Component Properties**:
```powerapps
// Input properties (custom)
HeaderTitle (Text): "App Title"
ShowBackButton (Boolean): true
BackgroundColor (Color): ColorValue("#0078D4")

// Output properties
BackButtonClicked (Behavior): Navigate(PreviousScreen)
```

### 2.6 Performance Optimization Checklist

```powerapps
// 1. OnStart - load only what you need
OnStart:
  Concurrent(
    ClearCollect(colAccounts, Filter(Accounts, Owner = User().Email)),
    ClearCollect(colStatuses, Choices(Accounts.Status)),
    Set(gblUserEmail, User().Email)
  )

// 2. Use Concurrent() for independent data loads
Concurrent(
  ClearCollect(colData1, Table1),
  ClearCollect(colData2, Table2),
  ClearCollect(colData3, Table3)
)

// 3. Avoid formula repetition - use variables
// BAD: Same lookup in 5 places
// GOOD: Set once in OnVisible, reference variable

// 4. Limit gallery items with delegation
Items = Filter(LargeTable, Status = "Active")
// NOT: Filter(Collect(...), ...) - loads everything first

// 5. Use explicit column selection if supported
ShowColumns(Accounts, "name", "emailaddress1", "statuscode")

// 6. Disable Delayed Load if not needed
App > Settings > Advanced > Delayed Load: OFF (for simple apps)

// 7. Image optimization
// Use thumbnails, not full images
// Set Image property to thumbnail URL
Image = ThisItem.'Thumbnail URL'
```

---

## 3. Model-Driven Apps Deep Dive

### 3.1 App Designer Structure

```
Model-Driven App components:
  - Site Map (navigation structure)
    - Area (e.g., "Sales", "Service")
      - Group (e.g., "Customers", "Orders")
        - Subarea (table/view/dashboard)
  - Tables (Dataverse entities)
    - Forms (create, edit, quick create)
    - Views (filtered/sorted data grids)
    - Charts (visual summaries)
  - Dashboards (interactive landing pages)
  - Business Process Flows (guided processes)
  - Custom Pages (canvas components)
```

### 3.2 Form Design Best Practices

```
DO:
[+] Use tabs to organize (General, Details, Related)
[+] Put frequently used fields on first tab
[+] Use quick view forms for related data
[+] Use business rules for show/hide logic
[+] Limit to 5-7 tabs maximum
[+] Use consistent field ordering (label above field)
[+] Add header fields for key info (status, owner)

DO NOT:
[X] Put all 100 fields on one form
[X] Use business rules for complex logic (use plugin or flow)
[X] Make forms wider than screen
[X] Ignore mobile form layout
[X] Skip form-level validation
```

### 3.3 Command Bar Customization

```javascript
// Use Power Apps command designer (modern) or Ribbon Workbench (classic)
// Modern command designer:
// make.powerapps.com > Solutions > Table > Commands

// Example: Add custom "Quick Close" button
Command: "Quick Close Case"
  Label: "Quick Close"
  Icon: "CheckMark"
  Action: Run flow "Case Quick Close"
  Visibility: Selected.Case.StatusCode != "Resolved"
```

### 3.4 Business Rules vs Flows vs Plugins

| Scenario | Use | Don't Use |
|----------|-----|-----------|
| Field show/hide | Business Rule | Cloud Flow |
| Set field value | Business Rule | Plugin |
| Validation | Business Rule + JavaScript | Flow (too slow) |
| Cross-table logic | Cloud Flow / Plugin | Business Rule |
| Complex calculation | Plugin / PCF | Business Rule |
| External API call | Cloud Flow | Business Rule |
| Real-time validation | JavaScript (form) | Cloud Flow |

---

## 4. Data Sources: Decision Guide

### 4.1 Dataverse vs SharePoint vs SQL vs Excel

| Factor | Dataverse | SharePoint | SQL Server | Excel Online |
|--------|-----------|------------|------------|-------------|
| **Cost** | Included with license | M365 license | Separate/Azure | M365 license |
| **Relationships** | Rich (1:N, N:N) | Limited lookup | Full SQL | None |
| **Security** | Row/column/field level | Item-level | Row-level | File-level |
| **Delegation** | Excellent | Limited | Excellent | None |
| **Offline** | Yes (Dataverse) | Yes (limited) | No | No |
| **ALM** | Excellent | Poor | Good | None |
| **Best for** | Business apps | Document mgmt | Existing systems | Quick prototypes |
| **Premium?** | Included | Standard | Premium connector | Standard |

### 4.2 When to Use What

```
Use Dataverse when:
- Complex relationships between tables
- Row/column-level security needed
- Model-driven app planned
- ALM/governance required
- Offline mobile needed
- More than 10,000 rows expected

Use SharePoint when:
- Document-centric process
- Simple lists with minimal relationships
- Users already work in SharePoint
- No complex security needed
- Budget is tight (standard connector)
- Prototyping only

Use SQL Server when:
- Existing SQL database
- Complex queries needed
- Integration with other SQL apps
- Reporting requirements

NEVER use Excel Online for production apps:
- No delegation
- Concurrent edit issues
- 5MB file limit
- No relationships
- No security
```

---

## 5. PCF Controls Overview

### 5.1 When to Use PCF

```
Consider PCF when:
- Standard controls don't meet the need
- Need third-party JS library (charts, maps, etc.)
- Same complex control needed across multiple apps
- Performance of standard controls is insufficient

DON'T use PCF when:
- Standard control works fine
- Only needed in one app (use canvas components)
- Team has no TypeScript/React skills
- Timeline is tight (has build/deploy overhead)
```

### 5.2 PCF Quick Start

```bash
# Install Power Apps CLI
npm install -g pac

# Create new PCF component
pac pcf init --namespace MyNamespace --name StarRating --template field --run-npm-install

# Build
cd StarRating
npm run build

# Push to environment
pac auth create --url https://yourorg.crm.dynamics.com
pac pcf push --publisher-prefix mypref

# Add to form via form designer
```

### 5.3 PCF Limitations

```
- Canvas apps: limited PCF support (dataset components not supported)
- Must use pac CLI (no visual designer)
- Security review required for AppSource publishing
- Cannot use external CDN resources (must be bundled)
- Must handle theming manually
- Mobile performance needs testing
```

---

## 6. Offline Capabilities

### 6.1 Canvas App Offline (Dataverse)

```
Requirements:
- Dataverse as data source
- Power Apps mobile app (not browser)
- Offline profile configured

Setup:
1. App > Settings > Offline
2. Enable "Can be used offline"
3. Choose tables to download:
   - Download all rows (small tables only)
   - Download my rows (recommended)
   - Custom filter
4. Set repeat interval (how often to sync)
5. Publish

// In app, check connection state:
Connection.Connected  // true/false

// Show offline indicator:
If(!Connection.Connected, Notify("Working offline", NotificationType.Warning))
```

### 6.2 Offline Limitations

```
- Canvas apps only (not model-driven)
- Dataverse only (not SharePoint, SQL)
- Must use Power Apps mobile app
- Images/files have special handling
- Initial sync can be slow
- Conflict resolution is last-write-wins
- Not suitable for real-time collaboration
```

---

## 7. Security and Sharing

### 7.1 Canvas App Sharing

```
1. Share the app:
   make.powerapps.com > Apps > ... > Share
   - Add users/security groups
   - Assign role (User, Co-owner)

2. Share data source connections:
   - User must have their own connection, OR
   - Use "Share" on the connection to share with user
   - BEST: Use service principal (premium)

3. For Dataverse:
   - Users need Dataverse security role
   - Role must have table permissions

4. For SharePoint:
   - Users need SharePoint list/library permissions

IMPORTANT: Sharing an app does NOT share the data.
Users need separate permissions on the data source.
```

### 7.2 Security Best Practices

```
DO:
[+] Use Azure AD security groups for app sharing
[+] Assign least-privilege Dataverse roles
[+] Use connection references (not shared connections)
[+] Audit who has access quarterly
[+] Remove access when employees leave
[+] Use environment variables for sensitive URLs (not visible to users)

DO NOT:
[X] Share apps with "Everyone in organization" unless intended
[X] Give users System Administrator role unnecessarily
[X] Store sensitive data in app variables (visible in debug)
[X] Use implicit connections in production (user context)
[X] Forget to secure the underlying data source
```

---

## 8. Mobile Considerations

### 8.1 Mobile-Specific Design

```powerapps
// Detect form factor
Set(gblIsMobile, Parent.Width < 800)
Set(gblIsTablet, Parent.Width >= 800 && Parent.Width < 1200)
Set(gblIsDesktop, Parent.Width >= 1200)

// Adjust layout
Gallery1.Layout = If(gblIsMobile, Layout.Vertical, Layout.Horizontal)
Form1.Columns = If(gblIsMobile, 1, 2)

// Mobile-optimized touch targets
Button1.Height = If(gblIsMobile, 60, 40)
Button1.Width = If(gblIsMobile, Parent.Width - 40, 200)

// Hide complex controls on mobile
ComplexChart.Visible = gblIsDesktop
```

### 8.2 Mobile Hardware Features

```powerapps
// Camera
Camera1.Photo // Capture image
AddPicture1.Media // Upload from gallery

// Location
Location.Latitude
Location.Longitude
Location.Altitude

// Barcode scanner
BarcodeScanner1.Value

// Accelerometer
Acceleration.X, Accelerometer.Y, Acceleration.Z

// Pen input (signature)
PenInput1.Image

// Audio recording
Microphone1.Audio
```

### 8.3 Mobile App Distribution

```
Option 1: Power Apps Mobile (easiest)
  - Users download "Power Apps" from app store
  - Sign in with company credentials
  - App appears in their list
  - Works immediately

Option 2: App Center / Wrapped App (branded)
  - Requires additional licensing
  - Custom icon and splash screen
  - Distributed via MDM or app stores

Option 3: Embedded in Teams
  - Publish as Teams app
  - Users access via Teams sidebar
  - Good for internal corporate apps
```

---

## 9. Common Mistakes and How to Avoid Them

| Mistake | Impact | Solution |
|---------|--------|----------|
| Not delegating queries | App only sees 2000 rows | Use delegable functions with Dataverse/SQL |
| Loading all data OnStart | Slow app start | Use Concurrent(), lazy load |
| Hardcoding record IDs | Breaks across environments | Use environment variables |
| No error handling | Silent failures | Add error labels, Notify() |
| Testing only on desktop | Mobile users suffer | Test on actual devices |
| Using Excel as data source | Scale and concurrency issues | Migrate to Dataverse |
| Not using component library | Inconsistent UX, duplicated work | Create component library first |
| Sharing connections | Security risk | Use connection references |
| Ignoring accessibility | Compliance issues | Test with screen reader, check contrast |
| Forgetting to publish | Users see old version | Always publish after changes |
| Using OnVisible for data load | Loads every screen visit | Use OnStart or cache data |
| Not testing with real data volumes | Performance surprise in production | Load test with production-sized data |
| Hardcoding colors | Rebranding nightmare | Use theme variables |
| Not using named formulas | Hard to maintain | Use Set() for globals |

---

## 10. Pre-Launch Checklist

```
[ ] App tested on target devices (phone, tablet, desktop)
[ ] Offline mode tested (if applicable)
[ ] Performance acceptable with production data volume
[ ] All data sources use connection references
[ ] No hardcoded IDs, emails, URLs
[ ] Error handling on every screen
[ ] Accessibility: labels, contrast, tab order
[ ] Security: least privilege roles assigned
[ ] App shared with correct users/groups
[ ] Documentation complete
[ ] Training materials prepared
[ ] Rollback plan documented
[ ] Monitoring and analytics enabled
[ ] Backup/export of app saved
```

---

*End of Power Apps Guide. Verify all formulas and features against current Microsoft documentation.*
