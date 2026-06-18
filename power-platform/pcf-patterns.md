---
title: "PCF Patterns"
description: "Power Apps Component Framework patterns and best practices"
category: "development"
tags: ["pcf", "component-framework", "react", "custom-components"]
---

# PCF (Power Apps Component Framework) Patterns

## 1. When to Use PCF

### Use PCF When

| Scenario | Why PCF |
|----------|---------|
| Complex data visualization | Charts, dashboards, KPI tiles |
| Custom input controls | Rich text editor, color picker, signature pad |
| Integration with JS libraries | D3.js, Chart.js, mapping libraries |
| Offline complex validation | Rules that exceed Power Fx capability |
| Reusable across apps | Component used in 3+ apps |

### Don't Use PCF When

| Scenario | Better Alternative |
|----------|-------------------|
| Simple UI customization | Power Apps built-in controls |
| Basic validation | Power Fx + business rules |
| Single app use | Canvas app components |
| Simple styling | CSS in canvas apps |
| Quick prototype | Standard controls first |

---

## 2. Component Types

### Field Component

Bound to a single column. Replaces the default input/output for that column.

```typescript
// ControlManifest.Input.xml
<property name="value" display-name-key="Value" 
  description-key="The value to display" 
  of-type="SingleLine.Text" 
  usage="bound" 
  required="true" />

<property name="maxLength" display-name-key="Max Length"
  description-key="Maximum character length"
  of-type="Whole.None"
  usage="input"
  required="false"
  default-value="100" />
```

**Use for:**
- Custom text inputs (masked, rich text)
- Custom pickers (color, date range, slider)
- Read-only displays (ratings, badges, progress bars)

### Dataset Component

Bound to a table or view. Replaces or supplements a gallery/subgrid.

```typescript
// ControlManifest.Input.xml
<data-set name="dataSet" 
  display-name-key="Dataset" 
  cds-data-set-options="displayCommandBar:true;displayViewSelector:true">
</data-set>
```

**Use for:**
- Custom grids with advanced features
- Data visualizations based on table data
- Interactive lists with complex interactions

---

## 3. Manifest Configuration

### Full Manifest Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
  <control namespace="Aluma" 
    constructor="RichTextEditor" 
    version="1.0.0" 
    display-name-key="Rich Text Editor" 
    description-key="A rich text editor component"
    control-type="standard"
    preview-image="img/preview.png">

    <!-- Properties -->
    <property name="content" 
      display-name-key="Content" 
      description-key="HTML content"
      of-type="Multiple" 
      usage="bound" 
      required="true" />

    <property name="placeholder" 
      display-name-key="Placeholder"
      of-type="SingleLine.Text" 
      usage="input" 
      required="false"
      default-value="Enter text..." />

    <property name="readOnly" 
      display-name-key="Read Only"
      of-type="TwoOptions" 
      usage="input" 
      required="false"
      default-value="false" />

    <!-- Resources -->
    <resources>
      <code path="index.ts" order="1" />
      <css path="css/styles.css" order="1" />
      <img path="img/preview.png" />
    </resources>

    <!-- Feature usage -->
    <feature-usage>
      <uses-feature name="WebAPI" required="true" />
      <uses-feature name="Utility" required="false" />
    </feature-usage>
  </control>
</manifest>
```

---

## 4. React Integration

### Setup with React

```bash
# Create PCF project
pac pcf init --namespace Aluma --name StarRating --template field

# Install React
cd StarRating
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# Install Fluent UI (optional)
npm install @fluentui/react
```

### React Component Pattern

```typescript
// index.ts - Entry point
import * as React from "react";
import { createRoot } from "react-dom/client";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { StarRating } from "./StarRating";

export class StarRatingControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private container: HTMLDivElement;
  private root: React.Root;
  private notifyOutputChanged: () => void;
  private value: number;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.value = context.parameters.value.raw || 0;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.value = context.parameters.value.raw || 0;
    const maxStars = context.parameters.maxStars.raw || 5;
    const readOnly = context.parameters.readOnly.raw;

    this.root.render(
      React.createElement(StarRating, {
        value: this.value,
        maxStars: maxStars,
        readOnly: readOnly,
        onChange: (newValue: number) => {
          this.value = newValue;
          this.notifyOutputChanged();
        }
      })
    );
  }

  public getOutputs(): IOutputs {
    return { value: this.value };
  }

  public destroy(): void {
    this.root.unmount();
  }
}
```

```tsx
// StarRating.tsx
import * as React from "react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  maxStars: number;
  readOnly: boolean;
  onChange: (value: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  maxStars,
  readOnly,
  onChange
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="star-rating">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoverValue || value) ? "filled" : "empty"}`}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};
```

---

## 5. Debugging

### Local Debugging

```bash
# Start PCF debug harness
npm start

# Opens browser with interactive test harness
# Edit control, auto-reloads
```

### Debugging in Power Apps

```bash
# Build and package
npm run build

# Add to solution
pac solution init --publisher-name Aluma --publisher-prefix alu
pac solution add-reference --path .
pac solution build

# Import solution
pac solution import --path "bin/Debug/AlumaControls.zip"

# Debug with F12 developer tools
# Source maps enabled for TypeScript
```

### Fiddler/Network Debugging

```typescript
// Add logging during development
public updateView(context: ComponentFramework.Context<IInputs>): void {
  console.log("UpdateView called", {
    value: context.parameters.value.raw,
    mode: context.mode.allocatedHeight
  });
  // ...
}
```

---

## 6. Deployment

### Build and Package

```bash
# Production build
npm run build -- --production

# Create solution
pac solution init --publisher-name Aluma --publisher-prefix alu
pac solution add-reference --path .

# Build managed solution
msbuild /t:restore
msbuild /p:configuration=Release
msbuild /p:configuration=Release /p:SolutionPackageType=Managed
```

### Versioning

```xml
<!-- Increment version in manifest for updates -->
<control namespace="Aluma" constructor="StarRating" version="1.1.0">
  <!-- changes -->
</control>
```

### Multi-Component Solutions

```bash
# Solution structure
AlumaComponents/
├── Aluma.RichTextEditor/
│   ├── ControlManifest.Input.xml
│   └── index.ts
├── Aluma.StarRating/
│   ├── ControlManifest.Input.xml
│   └── index.ts
└── Solution/
    ├── Other/
    │   └── Solution.xml
    └── bin/
```

```bash
# Add all components to one solution
cd Solution
pac solution add-reference --path ../Aluma.RichTextEditor
pac solution add-reference --path ../Aluma.StarRating
pac solution build
```

### Code Component Registration

```bash
# Push component to environment
pac pcf push --publisher-prefix alu

# Or import via solution
pac solution import --path "AlumaComponents_managed.zip"
```
