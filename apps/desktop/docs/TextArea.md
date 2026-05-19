# TextArea Component

The `TextArea` component is a powerful, multi-line text entry field designed for premium content management. It features dynamic auto-resizing, content capping, and a permanent dark aesthetic.

## Props

### 1. Core TextArea Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The title of the textarea field. |
| `description` | `string` | `undefined` | Secondary hint text. |
| `error` | `string` | `undefined` | Error message string. |
| `variant` | `"rounded" \| "curved" \| "square"` | `"curved"` | Border style. |
| `isFloating` | `boolean` | `false` | Enables the animated label-inside-border effect. |

### 2. Sizing & Content Controls
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoResize` | `boolean` | `false` | If true, the box grows automatically as you type. |
| `maxHeight` | `string` | `undefined` | Height limit for `autoResize` mode. |
| `showCount` | `"characters" \| "words" \| "both" \| "none"` | `"none"` | Displays a sleek counter. |
| `maxWordLimit` | `number` | `undefined` | Hard limit on the number of words allowed. |

### 3. Layout & Alignment Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `labelPlacement` | `"top" \| "left" \| "right"` | `"top"` | Position of the label. |
| `labelWidth` | `string` | `"w-32"` | Width of label container in side-aligned layouts. |
| `labelAlign-X` | `"left" \| "center" \| "right"` | `Derived` | Horizontal text alignment. |
| `labelAlign-Y` | `"top" \| "middle" \| "bottom"` | `"middle"` | Vertical positioning. |

## Usage Example
```tsx
<TextArea 
  isFloating={true} 
  label="Detailed Feedback" 
  autoResize={true} 
  maxHeight="300px" 
  placeholder="Type your message..." 
/>
```
