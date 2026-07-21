# Radio Component

The `Radio` component is used for single-selection lists, featuring a permanent dark aesthetic and streamlined axis alignment controls.

## Props

### 1. Configuration & Layout
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The option label. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"right"` | Position of the label. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning. |

## Usage Example
```tsx
<Radio 
  label="Option A" 
  labelPlacement="right" 
  activeColor="bg-white" 
/>
```
