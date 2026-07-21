# DatePicker Component

The `DatePicker` is a premium temporal selection tool featuring an animated calendar popup, permanent dark aesthetic, and streamlined layout variations.

## Props

### 1. Configuration & Layout
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The field label. |
| `isFloating` | `boolean` | `false` | Enables the floating label effect. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"top"` | Position of the label. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning. |
| `isTypeable` | `boolean` | `true` | Enables direct keyboard entry. |

## Usage Examples

### Side Label Layout
```tsx
<DatePicker 
  label="Deadline" 
  labelPlacement="left" 
  labelWidth="w-40" 
  labelAlign-Y="top"
/>
```
