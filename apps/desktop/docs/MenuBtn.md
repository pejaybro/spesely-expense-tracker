# MenuBtn Component

The `MenuBtn` component is a custom navigation button designed specifically for sidebar layouts, supporting active states, custom icon rendering, and width transitioning.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isActive` | `boolean` | `false` | Marks the item active, applying custom highlight styles. |
| `name` | `string` | `undefined` | The label text displayed next to the icon. |
| `icon` | `ReactNode` | `undefined` | Icon element shown inside the button. |
| `isMenuExpanded` | `boolean` | `false` | Sets the button styling to fit either expanded or collapsed sidebars. |
| `className` | `string` | `undefined` | Custom classes appended to button styles. |

## Usage Examples

### Expanded Menu Button
```tsx
<MenuBtn
  name="Dashboard"
  icon={<LayoutDashboard size={18} />}
  isMenuExpanded={true}
  isActive={true}
/>
```

### Collapsed Menu Button
```tsx
<MenuBtn
  name="Dashboard"
  icon={<LayoutDashboard size={18} />}
  isMenuExpanded={false}
  isActive={false}
/>
```
