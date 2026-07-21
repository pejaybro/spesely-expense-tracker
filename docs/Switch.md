# Switch Component

The `Switch` (Toggle) provides a highly visual on/off state with smooth sliding animations, a permanent dark aesthetic, and streamlined axis alignment controls.

## Props

### 1. Configuration & Layout
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string" | `undefined` | The toggle label. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"right"` | Position of the label. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning. |
| `activeColor` | `string` | `"bg-white"` | Track color when "On". |

## Usage Example
```tsx
<Switch 
  label="Enable Notifications" 
  labelPlacement="left" 
  activeColor="bg-sky-500" 
/>
```
