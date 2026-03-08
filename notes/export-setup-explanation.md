# General Export and Import Setup Pattern

This document explains the general pattern for organizing exports and imports in a TypeScript/JavaScript project, using path aliases and central configuration files.

## The Pattern Overview

This setup creates a clean, scalable way to import utilities and configurations across a project by:

1. **Path Aliases**: Short, absolute import paths instead of relative `../../../` paths
2. **Central Export Files**: Single files that re-export multiple utilities
3. **Layered Exports**: Utilities → Index files → Central config → Components

## Export Structure Pattern

### Utility Files (e.g., `utils/dayjs.ts`)

- Contain the actual implementation or configuration
- Export functions, classes, or configured instances
- Can export as default or named exports

```typescript
// Example: configuring and exporting a utility
import someLibrary from "some-library";
import plugin from "some-library/plugin";

const configuredUtility = someLibrary.configure({
  /* options */
});
configuredUtility.use(plugin);

export default configuredUtility;
```

### Index Files (e.g., `utils/index.ts`)

- Re-export from individual utility files
- Convert default exports to named exports for consistency
- Provide a single entry point for a group of related utilities

```typescript
// Re-export utilities as named exports
export { default as utility1 } from "./utility1";
export { default as utility2 } from "./utility2";
export { helperFunction } from "./helpers";
```

### Central Config Files (e.g., `root.config.ts`)

- Located in the app root for easy access
- Re-export commonly used utilities from various sources
- Can export as default or named exports based on usage preference

```typescript
// Re-export utilities from different locations
export { utility1 as default } from "utils";
export { config } from "./local-config";
export { Component } from "./components";
```

## Configuration Changes

### TypeScript Path Aliases (`tsconfig.app.json`)

Path aliases allow you to define shortcuts for import paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"], // @/ points to app root
      "utils": ["../../utils"], // utils points to shared utils
      "utils/*": ["../../utils/*"]
    }
  }
}
```

Benefits:

- **Absolute paths**: No more `../../../` in imports
- **Refactoring safe**: Moving files doesn't break imports
- **IDE support**: Better autocomplete and navigation

### Build Tool Configuration (Vite, Webpack, etc.)

- Path aliases are typically inherited from TypeScript
- No additional configuration usually needed
- If using a bundler directly, aliases may need to be configured there too

## Usage Patterns

### Before (Relative imports)

```typescript
import { utility } from "../../../utils";
import config from "../../config";
```

### After (Path aliases + central config)

```typescript
// Direct from utils
import { utility } from "utils";

// From central config
import utility from "@/root.config";
import { config } from "@/root.config";
```

## Benefits of This Pattern

1. **Centralized Management**: All common imports in one place
2. **Consistent Naming**: Standardized import paths across the project
3. **Easy Refactoring**: Change export locations without updating many files
4. **Tree Shaking**: Bundlers can better optimize when imports are clear
5. **Developer Experience**: Shorter, cleaner import statements

## When to Use This Pattern

- **Large projects**: Where relative imports become unwieldy
- **Shared utilities**: Common functions used across many files
- **Monorepos**: Multiple apps sharing utilities
- **Team projects**: To enforce consistent import conventions

## Implementation Steps

1. Set up path aliases in `tsconfig.json`
2. Create index files for utility groups
3. Create central config files in app roots
4. Update imports to use new paths
5. Test that all imports resolve correctly</content>
   <parameter name="filePath">c:\1.CODE\spesely-expense-tracker\notes\export-setup-explanation.md
