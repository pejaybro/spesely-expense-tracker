# DateRangePicker Component

The `DateRangePicker` is a heavy-duty selection tool for date intervals, featuring a permanent dark aesthetic and streamlined layout variations.

## Props

### 1. Configuration & Layout
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The field label. |
| `isFloating` | `boolean" | `false` | Enables the floating label effect. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"top"` | Position of the label. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning. |

## Usage Examples

### Side Label (Left)
```tsx
<DateRangePicker 
  label="Billing Period" 
  labelPlacement="left" 
  labelWidth="w-48" 
  presets={["this-month", "last-3-months"]} 
/>
```
