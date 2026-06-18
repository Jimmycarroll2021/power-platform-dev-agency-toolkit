---
title: "Desktop Flow Patterns"
description: "Patterns for Power Automate Desktop (RPA) flows"
category: "automation"
tags: ["desktop-flows", "rpa", "ui-automation", "patterns"]
---

# Desktop Flow Patterns

## 1. UI Automation Patterns

### Element Selection Strategy

```
Priority order for element selection:
1. Name/Automation ID (most stable)
2. Class name + Position
3. Image recognition (least stable)

Avoid:
- Absolute coordinates
- Index-based selection (can change)
- Class name only (too generic)
```

### Login Form Pattern

```
[Flow: Automated Login]
  │
  ├──▶ [Launch application: "App.exe"]
  │
  ├──▶ [Wait for window: "Login" (timeout: 10s)]
  │      Condition: Not found → [Error: Login window not found]
  │
  ├──▶ [Populate text field: Username]
  │      Value: %Credentials.Username%
  │
  ├──▶ [Populate password field: Password]
  │      Value: %Credentials.Password%
  │
  ├──▶ [Click button: Login]
  │
  ├──▶ [Wait for window: "Main Window" (timeout: 15s)]
  │      Condition: Not found → [Capture screenshot] → [Error: Login failed]
  │
  └──▶ [Success: Logged in]
```

### Data Entry Pattern

```
[Read from Excel: DataSheet]
  │
  ▼
[Loop: For each row]
  │
  ├──▶ [Focus application window]
  ├──▶ [Click: New Record button]
  ├──▶ [Wait for form to load]
  │
  ├──▶ [Populate: Field 1] ← %CurrentRow['Field1']%
  ├──▶ [Populate: Field 2] ← %CurrentRow['Field2']%
  ├──▶ [Populate: Field 3] ← %CurrentRow['Field3']%
  │
  ├──▶ [Click: Save button]
  ├──▶ [Wait for save confirmation]
  │
  ├──▶ [Update Excel: Status = "Done"]
  └──▶ [Delay: 2s]
```

---

## 2. Excel Automation Patterns

### Read and Process

```
[Launch Excel: Open workbook]
  │
  ├──▶ [Read from Excel worksheet]
  │      Worksheet: "Data"
  │      Start column: "A"
  │      Start row: 2 (skip header)
  │
  ├──▶ [Loop: For each row]
  │      ├──▶ [Extract values]
  │      ├──▶ [Validate data]
  │      ├──▶ [Process record]
  │      └──▶ [Write status to column E]
  │
  └──▶ [Save workbook]
```

### Template Population

```
[Copy template file: "Template.xlsx" → "Report_2024.xlsx"]
  │
  ├──▶ [Launch Excel: Open new file]
  │
  ├──▶ [Write to Excel worksheet]
  │      Worksheet: "Summary"
  │      Cell: B2 ← %ReportDate%
  │      Cell: B3 ← %TotalRecords%
  │      Cell: B4 ← %TotalAmount%
  │
  ├──▶ [Write to Excel worksheet]
  │      Worksheet: "Details"
  │      Start cell: A2
  │      Value: %DataTable%
  │
  ├──▶ [Run Excel macro: "FormatReport"]
  │
  └──▶ [Save and close Excel]
```

---

## 3. Browser Automation Patterns

### Web Data Extraction

```
[Launch browser: Chrome]
  │
  ├──▶ [Go to web page: "https://portal.example.com"]
  │
  ├──▶ [Populate text field: Username]
  ├──▶ [Populate text field: Password]
  ├──▶ [Click: Login]
  │
  ├──▶ [Wait for page load]
  │
  ├──▶ [Loop: For each page]
  │      ├──▶ [Extract data from web page]
  │      │      Table: Data rows
  │      │      Store to: DataTable
  │      │
  │      ├──▶ [Click: Next page]
  │      │
  │      └──▶ [Wait for page load]
  │
  ├──▶ [Write to Excel: DataTable]
  │
  └──▶ [Close browser]
```

### Form Submission

```
[Read CSV: Submissions.csv]
  │
  ▼
[Loop: For each row]
  │
  ├──▶ [Launch new browser instance]
  ├──▶ [Go to form URL]
  │
  ├──▶ [Populate: Name field] ← %Name%
  ├──▶ [Populate: Email field] ← %Email%
  ├──▶ [Populate: Phone field] ← %Phone%
  │
  ├──▶ [Select dropdown: Country] ← %Country%
  ├──▶ [Click radio: Gender] ← %Gender%
  │
  ├──▶ [Click: Submit button]
  ├──▶ [Wait for confirmation]
  │
  ├──▶ [Capture: Confirmation message]
  ├──▶ [Update CSV: Status = "Submitted"]
  │
  └──▶ [Close browser]
```

---

## 4. Credential Management

### Azure Key Vault Integration

```
[Retrieve credentials from Key Vault]
  │
  ├──▶ [Azure Key Vault: Get secret]
  │      Secret name: "app-username"
  │      Store to: %Username%
  │
  ├──▶ [Azure Key Vault: Get secret]
  │      Secret name: "app-password"
  │      Store to: %Password%
  │
  └──▶ [Use in desktop flow actions]
```

### Credential Asset

```
[Credential asset: "ERP_Credentials"]
  ├── Username: stored securely
  ├── Password: stored securely
  │
  └── Usage:
      [Populate text field: Username]
        Value: %ERP_Credentials.Username%
      [Populate password field: Password]
        Value: %ERP_Credentials.Password%
```

### Best Practices

| Practice | Implementation |
|----------|---------------|
| Never hard-code credentials | Use credential assets or Key Vault |
| Rotate credentials quarterly | Update in one central location |
| Use service accounts | Dedicated RPA accounts |
| Log access | Track credential usage |
| Least privilege | Minimum permissions for RPA account |

---

## 5. Error Recovery Patterns

### Try-Catch-Finally

```
[Scope: Main Process]
  ├──▶ [On error: Jump to "ErrorHandler"]
  │
  ├──▶ [Action 1]
  ├──▶ [Action 2]
  ├──▶ [Action 3]
  │
  └──▶ [On error: Disable]

[Label: ErrorHandler]
  ├──▶ [Capture screenshot]
  ├──▶ [Log error details]
  ├──▶ [Write error to Excel log]
  ├──▶ [Send email: Error notification]
  │
  └──▶ [Label: Cleanup]
       ├──▶ [Close all applications]
       ├──▶ [Release file locks]
       └──▶ [End flow]
```

### Checkpoint Pattern

```
[Initialize: Checkpoint = "Start"]
  │
  ▼
[Action Group 1]
  ├──▶ [Set Checkpoint = "Group1Complete"]
  ├──▶ [Save state to file]
  │
  ▼
[Action Group 2]
  ├──▶ [Set Checkpoint = "Group2Complete"]
  ├──▶ [Save state to file]
  │
  ▼
[Error Handler]
  ├──▶ [Read last checkpoint]
  ├──▶ [Jump to checkpoint + 1]
  └──▶ [Resume processing]
```

---

## 6. Attended vs Unattended Patterns

### Attended Flow Trigger

```
[Trigger: User clicks desktop shortcut]
  │
  ├──▶ [Show input dialog: Select file]
  ├──▶ [Show input dialog: Select options]
  │
  ├──▶ [Display message: "Processing started..."]
  │
  ├──▶ [Run automation]
  │
  ├──▶ [Show message: "Processing complete. Result: X"]
  │
  └──▶ [Ask user: Continue?]
         ├── Yes → [Next step]
         └── No → [End]
```

### Unattended Flow Trigger

```
[Trigger: Cloud flow calls desktop flow]
  │
  ├──▶ [Receive input parameters]
  │      - FilePath
  │      - ProcessingOptions
  │
  ├──▶ [Validate inputs]
  │
  ├──▶ [Run automation silently]
  │
  ├──▶ [Return output]
  │      - Status: Success/Failed
  │      - ResultFile: path
  │      - RecordCount: number
  │
  └──▶ [Cloud flow continues processing]
```

### Comparison

| Aspect | Attended | Unattended |
|--------|----------|------------|
| Trigger | User action | Cloud flow / Schedule |
| Interaction | User dialogs | None |
| Machine | User workstation | Dedicated VM |
| Scheduling | On-demand | Automated |
| Error handling | User can intervene | Automated retry |
| Licensing | Attended RPA | Unattended RPA |
