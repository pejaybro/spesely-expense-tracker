# Form Groups & Card Variants

Manage collections of inputs or high-impact selection interfaces with streamlined layout controls and a permanent dark aesthetic.

## 1. CheckboxGroup & RadioGroup
Groups allow you to manage multiple selection controls under a single heading with advanced alignment options.

### CheckboxGroup Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The title of the group. |
| `type` | `"single" \| "multiple"` | `"multiple"` | Selection behavior. |
| `options` | `CheckboxOption[]` | `[]` | Array of objects `{ id?: string, label: string, value: string, description?: string, disabled?: boolean }`. |
| `isHorizontal` | `boolean` | `false` | Arranges items in a row instead of a column. |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"top"` | Position of the group heading. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal heading alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"top"` | Vertical heading alignment. |

## 2. Card Selection
Premium selectable cards for high-impact forms. Inherit the permanent dark theme with white selection indicators.
*   **CardCheckbox**
*   **CardRadio**
*   **CardSwitch**

## Usage Example
```tsx
const options = [
  { value: "tech", label: "Technology", description: "Stay updated with tech news" },
  { value: "design", label: "Design", description: "UI/UX and visual arts" },
  { value: "art", label: "Art", disabled: true }
];

<CheckboxGroup 
  label="Interests" 
  type="multiple" 
  options={options}
  isHorizontal={true} 
  labelPlacement="left" 
  labelWidth="w-40"
/>
```
