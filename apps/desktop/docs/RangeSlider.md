# RangeSlider Component

The `RangeSlider` provides a tactile, visual way to select numeric values with streamlined layout variations.

## Props

### 1. Core Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The slider label. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"top"` | Position of the label relative to the slider. |
| `min` \| `max` | `number` | `0` \| `100` | Numeric range bounds. |
| `showValue` | `boolean` | `true` | Displays current value next to label. |

## Usage Example
```tsx
<RangeSlider 
  label="Volume" 
  labelPlacement="left" 
  min={0} 
  max={100} 
  value={vol} 
  onChange={setVol} 
/>
```
