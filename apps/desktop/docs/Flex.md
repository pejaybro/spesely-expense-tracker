# Flex Component

The `Flex` component is a layout utility built on CSS Flexbox. It handles directions, items alignment, justifications, gaps, and wrapping.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `direction` | `"row" \| "column" \| "row-reverse" \| "column-reverse"` | `"row"` | Flexbox layout direction. |
| `items` | `"start" \| "end" \| "center" \| "baseline" \| "stretch"` | `"start"` | `align-items` positioning alignment. |
| `justify` | `"start" \| "end" \| "center" \| "between" \| "around" \| "evenly"` | `"start"` | `justify-content` spacing alignment. |
| `wrap` | `boolean` | `false` | Enables `flex-wrap: wrap` when true. |
| `noGap` | `boolean` | `false` | Removes the default flex gap spacing (5px/20px depending on config). |
| `className` | `string` | `undefined` | Custom classes appended to the flex layout container. |

## Usage Examples

### Row layout with centered items
```tsx
<Flex direction="row" items="center" justify="between">
  <div>Left Item</div>
  <div>Right Item</div>
</Flex>
```

### Column layout with custom classes
```tsx
<Flex direction="column" className="w-full h-full p-4 bg-dark-c1">
  <div>Header</div>
  <div>Content</div>
</Flex>
```
