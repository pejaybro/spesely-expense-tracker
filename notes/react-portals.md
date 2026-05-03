# Understanding React Portals

Portals provide a way to render children into a DOM node that exists **outside the DOM hierarchy** of the parent component.

---

## 1. The "Why?" (The Escape Hatch)
Normally, a React component is rendered as a child of its parent's DOM node. However, this causes problems for elements that need to "visually" break out of their container, such as:
-   **Modals / Dialogs**: Should appear centered on the screen, regardless of where they are in the code.
-   **Tooltips / Popovers**: Should never be cut off by a parent with `overflow: hidden`.
-   **Global Overlays**: Loading spinners or notification toasts.

---

## 2. The Syntax
Portals are part of the `react-dom` package.

```tsx
import { createPortal } from 'react-dom';

function MyPortalComponent({ children }) {
  // 1. What to render
  // 2. Where to render (usually document.body)
  return createPortal(
    children,
    document.body
  );
}
```

---

## 3. Key Feature: Event Bubbling
One of the most powerful things about Portals is that **Event Bubbling still works.**

Even though a portal element is physically located at the end of the `<body>` in the DOM, in the React tree, it is still a child of its parent.
-   If you click a button inside a Portal, and its React parent has an `onClick` handler, that handler **will still be triggered.**
-   This allows you to manage state in your parent component normally without worrying about where the element is physically located.

---

## 4. Portals vs. Floating UI
-   **Portal**: Is just the "transportation". It moves the element to a different part of the DOM.
-   **Floating UI**: Is the "positioning engine". It calculates where that element should sit so it *looks* like it's still attached to the trigger.

**You almost always use them together.**

---

## 5. Pro-Tip: The "Container" Node
While `document.body` is common, it's often better practice to create a specific div for portals:

**index.html:**
```html
<div id="root"></div>
<div id="portal-root"></div> <!-- Portals go here -->
```

**React:**
```tsx
createPortal(children, document.getElementById('portal-root'))
```

---

## When NOT to use Portals:
-   **Standard UI**: If an element doesn't need to break out of its container (like a normal button or card), don't use a portal. It adds unnecessary complexity to the DOM structure.
-   **SEO-sensitive content**: While search engines are getting better, very important content is safest inside the main root div.
