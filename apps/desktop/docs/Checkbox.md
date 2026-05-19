# Checkbox Component

The `Checkbox` is a versatile selection tool featuring a permanent dark aesthetic and streamlined axis alignment controls.

## Props

### 1. Configuration & Layout
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The checkbox label. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"right"` | Position of the label. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning. |
| `activeColor` | `string` | `"bg-white"` | Color when checked. |

## Usage Example
```tsx
<Checkbox 
  label="I agree to the terms" 
  labelPlacement="right" 
  activeColor="bg-sky-500" 
/>
```
