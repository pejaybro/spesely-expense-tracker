# Input Component

The `Input` component is a high-performance, premium text entry field featuring a robust floating label system, dynamic icon containment, and a permanent dark aesthetic.

## Props

### 1. Core Input Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The title of the input field. |
| `description` | `string` | `undefined` | Secondary hint or explanation text. |
| `error` | `string` | `undefined` | Error message string. Triggers red border and animated warning. |
| `variant` | `"rounded" \| "curved" \| "square"` | `"curved"` | The visual border style. |
| `isFloating` | `boolean` | `false` | Enables the animated label-inside-border effect. |

### 2. Icon & Content Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `leftIcon` | `ReactNode` | `undefined` | Icon displayed on the left. |
| `icon` | `ReactNode` | `undefined` | Alias for `leftIcon`. |
| `rightIcon` | `ReactNode` | `undefined` | Icon displayed on the right. |
| `prefix` | `ReactNode` | `undefined` | Element fixed to the left inside the box (e.g., "$"). |
| `suffix` | `ReactNode` | `undefined` | Element fixed to the right inside the box (e.g., ".com"). |

### 3. Layout & Alignment Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"top"` | Position of the label relative to the input. |
| `labelWidth` | `string` | `"w-32"` | Width of label container in side-aligned layouts. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal text alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning (for side labels). |

## Usage Examples

### Floating Label with Icon
```tsx
<Input 
  isFloating={true} 
  label="Email Address" 
  leftIcon={<Mail size={14} />} 
  placeholder="your@email.com" 
/>
```

### Side Label Layout (Left)
```tsx
<Input 
  label="Username" 
  labelPlacement="left" 
  labelWidth="w-48" 
  variant="square" 
  labelAlign-Y="top"
/>
```
