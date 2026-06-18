# Canvas App Playbook

> **Complexity Rating:** Low / Medium / High (depending on scope)
> **Last Updated:** 2024
> **Applies To:** Power Apps Canvas Apps

---

## 1. When to Use Canvas Apps

Use Canvas Apps when:

| Scenario | Why Canvas App |
|----------|---------------|
| Custom pixel-perfect UI | Full control over layout and design |
| Mobile-first experience | Optimized for phones and tablets |
| Integration with device capabilities | Camera, GPS, accelerometer, barcode |
| Multi-data source mashup | Combine Dataverse, SharePoint, SQL, APIs |
| Task-specific focused app | Single-purpose, streamlined experience |
| Power Apps portal / embedded | Embed in Teams, SharePoint, websites |
| Offline capability needed | Local data storage and sync |
| Complex user interactions | Drag-drop, signatures, custom controls |
| Rapid prototyping | Quick iteration, citizen developer friendly |

### Decision Matrix

| Factor | Canvas App | Model-Driven App |
|--------|-----------|-----------------|
| Data source | Multiple | Dataverse primary |
| UI flexibility | Maximum | Standardized |
| Mobile experience | Excellent | Good |
| Development speed | Fast for simple | Fast for data-heavy |
| Complex data relationships | Requires custom work | Built-in |
| Enterprise forms | Requires build | Out-of-the-box |

---

## 2. When NOT to Use Canvas Apps

> **DO NOT use Canvas Apps when:**

| Scenario | Better Alternative | Why |
|----------|-------------------|-----|
| Pure Dataverse data entry with standard forms | Model-Driven App | Faster to build, native features |
| Complex business process with stages | Model-Driven App with BPF | Built-in process guidance |
| Need rich sub-grid editing | Model-Driven App | Built-in grid controls |
| Enterprise CRM requirements | Model-Driven App or Dynamics 365 | Full feature set |
| Public-facing anonymous users | Power Pages | Designed for external users |
| Very simple form (3-4 fields) | SharePoint list form | Simpler, no licensing cost |
| Need thousands of concurrent users | Custom web app | Scalability limits |
| Complex reporting | Power BI | Better visualization |

---

## 3. Architecture

### 3.1 Canvas App Architecture

```
[User Interface Layer]
  |-- Screens
  |-- Controls (galleries, forms, buttons)
  |-- Components (reusable)
  |-- Custom PCF controls (if needed)
  |
  v
[Logic Layer]
  |-- Formulas (OnSelect, OnVisible, OnChange)
  |-- Variables (global, context, collections)
  |-- Data operations (Filter, Lookup, Patch)
  |
  v
[Data Layer]
  |-- Dataverse
  |-- SharePoint
  |-- SQL Server
  |-- REST APIs
  |-- Collections (local cache)
  |
  v
[Integration Layer]
  |-- Power Automate flows
  |-- Custom connectors
  |-- Azure Functions
```

### 3.2 Screen Types Pattern

| Screen | Purpose | Key Controls |
|--------|---------|-------------|
| Landing/Home | Navigation hub | Buttons, icons, menu |
| Browse/List | View multiple records | Gallery, search, filters |
| Detail | View single record | View form, related items |
| Edit/Create | Create or edit record | Edit form, validation |
| Dashboard | KPIs and metrics | Charts, cards, indicators |
| Profile/Settings | User preferences | Toggle, dropdown, inputs |
| Help/About | App information | Labels, links |

---

## 4. Data Sources

### 4.1 Data Source Selection

| Data Source | Best For | Limitations |
|------------|----------|-------------|
| Dataverse | Enterprise data, relationships, security | Premium connector |
| SharePoint | Simple lists, document libraries | 5000 item limit per list |
| SQL Server | Relational data, complex queries | Premium, gateway needed |
| Excel (OneDrive) | Prototyping, simple data | Not for production |
| Collections | Local cache, offline, temporary data | Session-only |
| REST API | External integrations | Premium (custom connector) |
| Microsoft 365 | User data, calendar, email | Standard connectors |

### 4.2 Data Source Configuration

```
Best Practice: Always use explicit column selection

Instead of: Gallery.Items = MyTable
Use: Gallery.Items = ShowColumns(MyTable, "Id", "Name", "Status")

This reduces data transfer and improves performance.
```

### 4.3 Delegation

> **CRITICAL:** Understand delegation to avoid performance issues.

| Data Source | Delegable Functions | Non-Delegable Functions |
|------------|-------------------|------------------------|
| Dataverse | Filter, Sort, Lookup, CountRows, Sum, Average | Search (some), custom functions |
| SharePoint | Filter, Sort, Lookup | Search, CountRows, Sum |
| SQL Server | Most functions | Limited |
| Collections | All (loaded locally) | N/A |

**Delegation Warnings:**
- Blue dot = delegable
- Yellow triangle = non-delegable (limited to 500/2000 records)

> **DO NOT:** Ignore delegation warnings. They will cause your app to show incorrect results with large datasets.

---

## 5. Screens

### 5.1 Screen Templates

**Browse Screen:**
```
[Header Bar]
  |-- App title
  |-- User profile
  |-- Settings icon
  |
[Search Bar]
  |-- Search input
  |-- Filter dropdown
  |-- Sort button
  |
[Gallery]
  |-- Item template with key fields
  |-- Navigate to detail on select
  |
[Footer]
  |-- Create new button (FAB)
  |-- Pagination (if needed)
```

**Detail Screen:**
```
[Header Bar]
  |-- Back button
  |-- Title (record name)
  |-- Edit button
  |
[Content]
  |-- Key information cards
  |-- Related items gallery
  |-- Action buttons
  |
[Footer]
  |-- Primary action button
```

**Edit Screen:**
```
[Header Bar]
  |-- Cancel button
  |-- Title ("New" or "Edit")
  |-- Save button
  |
[Form]
  |-- Edit form control
  |-- Validation labels
  |-- Section headers
  |
[Footer]
  |-- Save button (primary)
```

### 5.2 Screen Navigation

```
Navigation pattern:

[Home Screen]
    |-->[Browse Screen]
    |       |-->[Detail Screen]
    |       |       |-->[Edit Screen]
    |       |       |
    |       |       |-->[Related Detail]
    |       |
    |       |-->[Create Screen]
    |
    |-->[Dashboard Screen]
    |-->[Profile Screen]
    |-->[Settings Screen]
```

---

## 6. Formulas

### 6.1 Essential Formulas

| Purpose | Formula Pattern |
|---------|----------------|
| Filter gallery | `Filter(DataSource, Status = "Active")` |
| Search gallery | `Search(DataSource, SearchInput.Text, "Name", "Email")` |
| Sort gallery | `SortByColumns(FilterResult, "CreatedOn", Descending)` |
| Count items | `CountRows(Filter(Gallery.AllItems, IsSelected))` |
| Lookup record | `LookUp(DataSource, ID = SelectedID)` |
| Patch update | `Patch(DataSource, Gallery.Selected, {Status: "Approved"})` |
| Navigate | `Navigate(DetailScreen, ScreenTransition.Fade)` |
| Back | `Back()` |
| Set variable | `Set(varSelectedRecord, Gallery.Selected)` |
| Context variable | `UpdateContext({locIsLoading: true})` |
| Notify user | `Notify("Record saved", NotificationType.Success)` |
| Confirm dialog | `Confirm("Are you sure?")` |

### 6.2 Performance Formulas

| Purpose | Formula | Why |
|---------|---------|-----|
| Load data once | `ClearCollect(colData, DataSource)` | Reduces server calls |
| Filter in memory | `Filter(colData, Condition)` | After ClearCollect |
| Show loading state | `UpdateContext({locLoading: true})` | Better UX |
| Delayed search | `Timer.OnTimerEnd` | Don't search on every keystroke |
| Pagination | `FirstN(Skip(DataSource, Page*Size), Size)` | Reduce load |

### 6.3 Common Patterns

**Loading Pattern:**
```
App.OnStart:
  Set(varIsLoading, true);
  ClearCollect(colData, MyTable);
  Set(varIsLoading, false);

Screen.OnVisible:
  If(varIsLoading,
    Show loading spinner,
    Show content
  )
```

**Form Validation Pattern:**
```
Button.OnSelect:
  If(IsBlank(NameInput.Text),
    Notify("Name is required", NotificationType.Error),
    If(Value(AmountInput.Text) <= 0,
      Notify("Amount must be greater than 0", NotificationType.Error),
      SubmitForm(EditForm)
    )
  )
```

---

## 7. Components

### 7.1 When to Create Components

Create a component when:
- Same control pattern used on 3+ screens
- Header/footer repeated across screens
- Navigation menu used globally
- Custom button style applied consistently
- Loading spinner used everywhere

### 7.2 Recommended Component Library

| Component | Purpose | Custom Properties |
|-----------|---------|-------------------|
| cmp_Header | Consistent header bar | Title, ShowBack, OnBack |
| cmp_Footer | Consistent footer | PrimaryAction, OnAction |
| cmp_NavMenu | Navigation drawer | Items, SelectedItem |
| cmp_Loading | Loading overlay | IsLoading, Message |
| cmp_EmptyState | No data message | Message, Icon, Action |
| cmp_ConfirmDialog | Confirmation dialog | Title, Message, OnConfirm |
| cmp_DataCard | Reusable data display | Label, Value, Icon |
| cmp_StatusBadge | Status indicator | Status, Color |

### 7.3 Component Best Practices

- Use custom properties for all configurable values
- Keep components self-contained
- Document component API (properties, expected inputs)
- Version component library separately from apps
- Test components in isolation

---

## 8. Offline

### 8.1 Offline Strategy

```
Online Mode:
  App loads data directly from server
  Changes saved immediately

Offline Mode:
  App uses cached data (Collections)
  Changes queued locally
  Sync when connection restored
```

### 8.2 Offline Implementation

```
App.OnStart:
  |
  +--[Check Connection]
  |     |--Connected-->
  |     |  [Load from server]
  |     |  [ClearCollect(colLocal, ServerData)]
  |     |  [Set(varIsOffline, false)]
  |     |
  |     |--Offline-->
  |        [Load from local cache]
  |        [Set(varIsOffline, true)]
  |
  +--[Monitor Connection]
        [Connection.OnSignalChange]

On Save (when offline):
  |
  +--[Collect(colPendingChanges, ChangeRecord)]
  +--[Notify("Will sync when online", Warning)]

When connection restored:
  |
  +--[ForAll(colPendingChanges, Patch(Server, ThisRecord))]
  +--[Clear(colPendingChanges)]
  +--[Notify("Changes synced", Success)]
```

### 8.3 Offline Limitations

- Cannot use LookUp, Filter on server data
- Cannot save to server directly
- Images/videos may not load
- User must have loaded data while online
- Limited to 2000 cached records per collection

---

## 9. Responsive Design

### 9.1 Responsive Layout Pattern

```
Use these properties for responsive design:

- Width: Parent.Width * 0.9 (90% of parent)
- X: (Parent.Width - Self.Width) / 2 (centered)
- Height: If(IsMobile, 50, 70) (different sizes)

Screen size detection:
Set(varIsMobile, App.Width < 800);
Set(varIsTablet, App.Width >= 800 && App.Width < 1200);
Set(varIsDesktop, App.Width >= 1200);
```

### 9.2 Layout Strategies

| Device | Layout Approach |
|--------|----------------|
| Mobile | Single column, full width, bottom nav |
| Tablet | Two columns, side nav |
| Desktop | Three columns, top nav, more detail |

### 9.3 Responsive Formula Examples

```
Gallery layout:
  Layout: If(varIsMobile, Layout.Vertical, Layout.Horizontal)
  Template width: If(varIsMobile, Parent.Width, 300)

Font sizes:
  Header: If(varIsMobile, 20, 28)
  Body: If(varIsMobile, 12, 14)

Button sizes:
  Height: If(varIsMobile, 44, 36)
  (44px minimum for touch targets)
```

---

## 10. Development Steps

### 10.1 Development Checklist

- [ ] Define user personas and use cases
- [ ] Design screen wireframes (Figma or paper)
- [ ] Identify data sources and relationships
- [ ] Create Dataverse tables (if needed)
- [ ] Build data layer (connectors, collections)
- [ ] Create component library
- [ ] Build screens (browse, detail, edit)
- [ ] Implement navigation
- [ ] Add formulas and business logic
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test on mobile devices
- [ ] Performance optimization
- [ ] Accessibility review
- [ ] User acceptance testing

### 10.2 Screen Development Order

1. **Data layer first:** Connect to data sources, verify connectivity
2. **Browse screen:** Gallery with search/filter
3. **Detail screen:** View record details
4. **Edit screen:** Create and edit records
5. **Navigation:** Wire up all screen transitions
6. **Polish:** Loading states, error handling, UI refinement

---

## 11. Testing

| Test Case | Method | Pass Criteria |
|-----------|--------|--------------|
| CRUD operations | Manual test | Create, read, update, delete work |
| Search and filter | Manual test | Results accurate and fast |
| Navigation | Manual test | All screens accessible |
| Form validation | Manual test | Invalid data rejected |
| Mobile experience | Test on phone | Usable, touch-friendly |
| Tablet experience | Test on tablet | Layout appropriate |
| Offline mode (if applicable) | Airplane mode test | Graceful degradation |
| Performance (< 3s load) | Timer | Screens load quickly |
| Accessibility | Screen reader test | Labels, tab order correct |
| Data delegation | Large dataset test | No delegation warnings |

---

## 12. Licensing

| Component | License Required |
|-----------|-----------------|
| Standard connectors | Microsoft 365 |
| Premium connectors (Dataverse, SQL) | Power Apps per user ($20/mo) or per app ($10/mo) |
| AI Builder features | AI Builder credits |
| Custom connectors | Premium |
| Offline sync | Premium |

---

## 13. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Performance with large datasets | High | Delegation, pagination, collections |
| Complex app maintenance | Medium | Component library, documentation |
| Mobile device compatibility | Medium | Test on multiple devices |
| Data source changes | Medium | Abstraction layer |
| Security (app-level) | High | Proper sharing, DLP compliance |
| User adoption | Medium | UX testing, training |
| Premium connector licensing cost | Medium | Optimize data source usage |
