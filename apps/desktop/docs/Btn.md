# Btn Component

The `Btn` component is a flexible, highly reusable button component supporting standard project button styling, rounding constraints, loading states, and cursor settings.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `"primary" \| "secondary" \| "danger" \| "success" \| "menu" \| "none"` | `"none"` | The color styling mapping of the button. |
| `rounded` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"none"` | The border-radius mapping. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | HTML button type attribute. |
| `className` | `string` | `undefined` | Custom classes appended to the button styles. |
| `children` | `ReactNode` | `undefined` | Children elements rendered inside. |

## Usage Examples

### Primary Curved Button
```tsx
<Btn variant="primary" rounded="md">
  Click Me
</Btn>
```

### Menu Button Styling
```tsx
<Btn variant="menu" rounded="md" className="w-full">
  Dashboard
</Btn>
```
