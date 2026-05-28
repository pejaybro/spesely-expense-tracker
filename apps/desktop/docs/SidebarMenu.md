# SidebarMenu Component

The `SidebarMenu` component is a navigation menu that renders an accordion list of routes, menu groups, and divider lines. It supports automated fallback character icons when sidebar is collapsed, submenu click states, and click event callbacks.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `config` | `MenuConfigElement[]` | `[]` | List of items, groups, or bottom items defined in schema configuration. |
| `isExpanded` | `boolean` | `required` | Sets the sidebar's collapse state (expanding accordion lists or rendering inline hover blocks). |
| `onItemClick` | `() => void` | `undefined` | Callback triggered when a menu item link is clicked (e.g. to auto-collapse the drawer). |
| `tooltipsDisabled` | `boolean` | `false` | Disables tooltips temporarily during panel collapse/expand transitions. |

## Usage Examples

### Config Declarations
```tsx
const menuConfig = [
  {
    id: "dashboard",
    type: "item",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    link: "/home",
  },
  {
    id: "transactions-group",
    type: "group",
    label: "Transactions",
    items: [
      {
        id: "expenses",
        label: "Expenses",
        children: [
          { id: "daily", label: "Daily", link: "/expense" }
        ],
      }
    ]
  }
];

<SidebarMenu
  config={menuConfig}
  isExpanded={true}
  onItemClick={() => setExpandMenu(false)}
/>
```
