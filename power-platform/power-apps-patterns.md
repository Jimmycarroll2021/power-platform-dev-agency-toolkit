---
title: "Power Apps Patterns"
description: "Design patterns for Canvas and Model-driven Power Apps"
category: "apps"
tags: ["power-apps", "canvas", "model-driven", "patterns", "ui"]
---

# Power Apps Patterns

## 1. Navigation Patterns

### Tab Navigation (Canvas)

```
┌─────────────────────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3] [Tab 4]     │
├─────────────────────────────────────┤
│                                     │
│  Content Area (changes per tab)     │
│                                     │
└─────────────────────────────────────┘
```

**Implementation:**
```powerapps
// OnSelect of Tab button
Set(varActiveTab, "Tab1");

// Visible property of content containers
Container_Tab1.Visible = varActiveTab = "Tab1"
Container_Tab2.Visible = varActiveTab = "Tab2"
```

### Drawer Navigation (Canvas)

```powerapps
// Hamburger menu button
Set(varMenuOpen, !varMenuOpen);

// Drawer container
X: If(varMenuOpen, 0, -250)
Transition: Transition.Push

// Overlay
Visible: varMenuOpen
OnSelect: Set(varMenuOpen, false)
Fill: RGBA(0,0,0,0.3)
```

### Drill-Down Navigation

```powerapps
// Screen 1: List
Navigate(Screen_Detail, ScreenTransition.Cover, 
  {selectedRecord: ThisItem})

// Screen 2: Detail
Navigate(Screen_Edit, ScreenTransition.Cover, 
  {selectedRecord: varSelectedRecord})

// Back navigation
Back(ScreenTransition.UnCover)
```

---

## 2. Form Patterns

### View/Edit/Create Pattern

```powerapps
// Single form, mode-based
Set(varFormMode, FormMode.View);  // or Edit, New

// Form properties
DefaultMode: varFormMode
Item: If(varFormMode = FormMode.New, Defaults(Table), varSelectedRecord)

// Button: Edit
Visible: varFormMode = FormMode.View
OnSelect: Set(varFormMode, FormMode.Edit)

// Button: Save
Visible: varFormMode <> FormMode.View
OnSelect: SubmitForm(Form1); Set(varFormMode, FormMode.View)
```

### Inline Edit (Gallery)

```powerapps
// Gallery with edit capability
// Default view: Labels
// Edit mode: Input controls

// Item template
If(ThisItem.IsEditing,
  // Show TextInput
  TextInput_Default: ThisItem.FieldName,
  // Show Label
  Label_Text: ThisItem.FieldName
)

// Edit button
OnSelect: Patch(Table, ThisItem, {IsEditing: true})

// Save button
OnSelect: 
  Patch(Table, ThisItem, 
    {FieldName: TextInput_Field.Text, IsEditing: false})
```

### Wizard/Multi-Step Form

```powerapps
// Progress indicator
Set(varStep, 1);  // Steps: 1, 2, 3, 4

// Navigation
If(varStep > 1, Set(varStep, varStep - 1));  // Back
If(varStep < 4 && ValidateStep(), Set(varStep, varStep + 1));  // Next

// Step validation
ValidateStep() = Switch(varStep,
  1, !IsBlank(TextInput_Name.Text),
  2, !IsBlank(Dropdown_Type.Selected.Value),
  3, Value(TextInput_Amount.Text) > 0,
  true
)

// Submit on final step
If(varStep = 4, 
  SubmitForm(Form_Step4);
  Navigate(Screen_Success))
```

---

## 3. Gallery Patterns

### Master-Detail

```powerapps
// Gallery (Master): BrowseGallery
// Form (Detail): DetailForm

// OnSelect in gallery
Set(varSelectedRecord, ThisItem);
EditForm(DetailForm);
Navigate(Screen_Detail)

// Detail form item property
Item: varSelectedRecord
```

### Gallery with Checkboxes

```powerapps
// Collection for selection
colSelected: [{ID: 1, Selected: false}, ...]

// Checkbox in gallery
Default: LookUp(colSelected, ID = ThisItem.ID).Selected
OnCheck: Patch(colSelected, LookUp(colSelected, ID = ThisItem.ID), {Selected: true})
OnUncheck: Patch(colSelected, LookUp(colSelected, ID = ThisItem.ID), {Selected: false})

// Bulk actions
CountRows(Filter(colSelected, Selected = true)) & " selected"
```

### Grouped Gallery

```powerapps
// Group data by category
ClearCollect(colGrouped,
  AddColumns(
    GroupBy(colData, "Category", "Items"),
    "Expanded", false
  )
);

// Toggle group
OnSelect: Patch(colGrouped, ThisItem, {Expanded: !ThisItem.Expanded})

// Nested gallery
Items: ThisItem.Items
Visible: ThisItem.Expanded
```

---

## 4. Search and Filter Patterns

### Search with Debounce

```powerapps
// Search input
OnChange: Set(varSearchText, Self.Text)

// Gallery items with debounce
Items: If(
  !IsBlank(varSearchText),
  Search(Table, varSearchText, "Name", "Email", "Phone"),
  Table
)
```

### Multi-Filter

```powerapps
// Filter variables
Set(varStatusFilter, "All");
Set(varDateFrom, Today() - 30);
Set(varDateTo, Today());
Set(varCategoryFilter, "All");

// Filtered gallery
Items: Filter(
  Table,
  (varStatusFilter = "All" || Status = varStatusFilter) &&
  (varCategoryFilter = "All" || Category = varCategoryFilter) &&
  Created >= varDateFrom &&
  Created <= varDateTo
)
```

### Cascading Dropdowns

```powerapps
// Dropdown 1: Country
Items: Distinct(Addresses, Country)
OnChange: 
  Set(varSelectedCountry, Self.Selected.Result);
  Reset(Dropdown_State);

// Dropdown 2: State
Items: Filter(Distinct(Addresses, State), Country = varSelectedCountry)
OnChange: Set(varSelectedState, Self.Selected.Result);

// Dropdown 3: City
Items: Filter(Distinct(Addresses, City), 
  Country = varSelectedCountry && State = varSelectedState)
```

---

## 5. Offline Patterns

### SaveData/LoadData Pattern

```powerapps
// On App Start: Check connectivity
If(Connection.Connected,
  // Online: Load from source
  ClearCollect(colData, Table);
  RemoveIf(colOfflineChanges, true);
  Set(varIsOnline, true),
  // Offline: Load from local
  LoadData(colData, "localData");
  Set(varIsOnline, false)
)

// On change: Queue for sync
Patch(colOfflineChanges, Defaults(colOfflineChanges),
  {Action: "Update", Record: ThisItem, Changes: {Status: "Completed"}}
)

// On reconnect: Sync
If(Connection.Connected && CountRows(colOfflineChanges) > 0,
  ForAll(colOfflineChanges,
    Switch(Action,
      "Update", Patch(Table, Record, Changes);
      "Create", Collect(Table, Changes);
      "Delete", Remove(Table, Record)
    )
  );
  RemoveIf(colOfflineChanges, true);
  SaveData(colData, "localData")
)
```

### Offline Indicator

```powerapps
// Status indicator
Fill: If(varIsOnline, Green, Red)
Text: If(varIsOnline, "Online", "Offline - " & CountRows(colOfflineChanges) & " pending")
Visible: !varIsOnline || CountRows(colOfflineChanges) > 0
```

---

## 6. Responsive Layout Patterns

### Fluid Grid

```powerapps
// Container properties
X: 0
Width: Parent.Width
Height: Parent.Height

// Gallery inside container
Width: Parent.Width - 40
Layout: Layout.Vertical
TemplateSize: If(Parent.Width < 600, 200, 120)

// Adaptive columns
WrapCount: If(Parent.Width < 600, 1, 
           If(Parent.Width < 900, 2, 3))
```

### Responsive Navigation

```powerapps
// Navigation container
Width: If(Parent.Width < 768, 60, 250)

// Nav items
Text: If(Parent.Width < 768, "", "Dashboard")  // Icon only on small
Icon: Icon.Dashboard

// Hamburger button (mobile only)
Visible: Parent.Width < 768
```

### Responsive Form

```powerapps
// Two-column layout on desktop, single on mobile
DataCard1.X: 0
DataCard1.Width: If(Parent.Width < 600, Parent.Width, Parent.Width / 2 - 10)

DataCard2.X: If(Parent.Width < 600, 0, Parent.Width / 2 + 10)
DataCard2.Width: DataCard1.Width
```
