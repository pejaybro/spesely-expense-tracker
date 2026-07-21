# Spesely Layout V2 Structure & Architecture

This document explains the architecture of the new `AppLayoutV2` component, covering custom hooks, components, routing contexts, and responsive layout variant flows.

---

## 1. Unified State & Responsive Logic (`useAppMenu`)

The entire layout state and configuration are encapsulated inside the custom hook `useAppMenu(variant)`.

### Responsiveness Breakpoints
The hook listens to window resizes and dynamically maps the layout variant to the active viewport size:
- **`hybrid` Variant**:
  - **Desktop (width >= 1024px)**: `activeVariant` becomes `"none"` (always expanded sidebar).
  - **Tablet (768px <= width < 1024px)**: `activeVariant` becomes `"semi"` (collapsible inline icons sidebar).
  - **Mobile (width < 768px)**: `activeVariant` becomes `"full"` (hidden overlay drawer sidebar).
- **`full` Variant**:
  - **Desktop (width >= 768px)**: `activeVariant` becomes `"none"` (always expanded).
  - **Mobile (width < 768px)**: `activeVariant` becomes `"full"` (hidden overlay drawer).
- **`none` / `semi`**: Preserves selection across all viewports.

### Active Path Matching
The hook automatically monitors route transitions (`useLocation()`) and matches them against `menuConfig` to resolve:
1. `pathname`: Exposes the current URL pathway.
2. `activeMenuId`: Exposes the ID of the current active menu item (e.g. `"expenses"`, `"dashboard"`), which is passed down to child components.

### Tooltip & Flashing Suppression (`tooltipsDisabled`)
To prevent tooltips from popping up or flashing during collapse/expand transition animations, `useAppMenu` temporarily disables all tooltips for `500ms` whenever the menu state changes.

### Keyboard Navigation: Escape Key
The hook listens for `"Escape"` keypress events on the window. If the menu is expanded, pressing `Escape` collapses the drawer instantly.

---

## 2. Desktop Context Menu (`useContextMenu`)

`useContextMenu()` is a layout-level hook that registers Electron context menu event listeners on the DOM.
- It attaches custom desktop window handlers for actions like inspect element, reloads, copy, paste, etc.
- By placing it at the root of `AppLayoutV2`, all subcomponents and nested page outlets inherit this context menu behavior.

---

## 3. Component Architecture

`AppLayoutV2` acts as an orchestrator, decomposing rendering into 3 specialized components:

### `SidePanel`
Renders the navigation sidebar:
- In `full` mode, it is rendered as a **sliding drawer** (`fixed top-0 left-0 h-full z-50 transition-transform duration-300`).
- **Floating Close Button**: Renders a dedicated rounded white close button (`X`) outside the right border of the drawer, sliding together with it. It has a fadeout opacity animation (`duration-150`) to immediately disappear when clicked, preventing overlapping slide animations.
- Displays the toggle button header or a static "Menu" title.
- Receives the navigation config and delegates the accordion rendering to `<SidebarMenu />`.

### `TopBar`
Renders the horizontal navigation header:
- Integrates the toggle button on the left when the sidebar is collapsed in `"full"` mode, creating a seamless, full-width top bar layout.

### `MainArea`
A simple wrapper block (`Flex`) handling content padding, white styling context, and overflow scrolling.

---

## 4. Web Accessibility (Aria Roles)
Semantic accessibility attributes are integrated across interactive controls:
* Toggle buttons utilize `aria-expanded={isExpanded}` and descriptive `aria-label` definitions (e.g., `aria-label="Collapse Menu"`).
* Visual-only icons (like the floating close `X` button) have `aria-label="Close Menu"` configured for screen readers.

---

## 5. Outlet Routing & State Propagation
The child pages are matched dynamically and rendered inside the React Router `<Outlet />`:
```tsx
<Outlet context={{ activeMenuId, pathname }} />
```

Any child component rendered within the layout can tap into this routing state by invoking:
```tsx
import { useOutletContext } from "react-router-dom";

export const ChildPage = () => {
  const { activeMenuId, pathname } = useOutletContext<{ activeMenuId: string; pathname: string }>();
  // Use activeMenuId or pathname to load data or render specific sub-views!
};
```
