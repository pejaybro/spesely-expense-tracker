# Tooltip Component

The `Tooltip` component is built on Floating UI to handle precise float positioning, portal rendering to escape parent containers (`overflow: hidden`), hover state delays, and dismiss clicks.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode \| string` | `required` | The trigger element which displays the tooltip on hover/focus. |
| `content` | `ReactNode \| string \| null` | `null` | The descriptive message or custom markup inside the floating tooltip box. |
| `direction` | `Placement` | `"top"` | Tooltip positioning relative to trigger (e.g. `"top"`, `"right"`, `"bottom"`, `"left"`, etc.). |
| `disabled` | `boolean` | `false` | When true, completely suppresses the tooltip from appearing. |
| `className` | `string` | `undefined` | Custom classes appended to the floating tooltip element. |

## Usage Examples

### Standard Tooltip on Button
```tsx
<Tooltip content="Save Document" direction="top">
  <Btn variant="primary">Save</Btn>
</Tooltip>
```

### Disabled Tooltip
```tsx
<Tooltip content="Always open menu" disabled={true} direction="right">
  <span>Static Label</span>
</Tooltip>
```
