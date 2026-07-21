# TimePicker Component

The `TimePicker` is an elite precision tool for selecting time values, featuring a permanent dark aesthetic and streamlined layout variations.

## Props

### 1. Configuration & Layout
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The field label. |
| `isFloating` | `boolean` | `false` | Enables the floating label effect. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"top"` | Position of the label. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning. |
| `hour12` | `boolean` | `true` | Toggles 12/24-hour formats. |

## Usage Examples

### Floating Time Picker
```tsx
<TimePicker 
  isFloating={true} 
  label="Meeting Time" 
  hour12={true} 
/>
```
