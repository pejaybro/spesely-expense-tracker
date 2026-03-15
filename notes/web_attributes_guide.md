# HTML Attributes Guide: aria-label, data-*, and title

This guide explains three commonly used HTML attributes, their purposes, and when to use each.

---

## 1. `aria-label` (The Screen Reader Label)

### Definition
`aria-label` provides a string that labels the current element. It is specifically for **assistive technology** (like screen readers) and is invisible to sighted users.

### Use Case
Use it when an element has no visible text but needs a name to be understandable.

### Usage Example
```tsx
// Screen reader will say "Close Message" instead of just "Button"
<button aria-label="Close Message">
  <XIcon />
</button>

// For navigation landmarks
<nav aria-label="Main menu">...</nav>
```

---

## 2. `data-*` Attributes (The Custom Metadata)

### Definition
`data-*` attributes allow you to store extra information (metadata) on standard HTML elements. They are perfect for styling (via Tailwind/CSS) or for JavaScript logic.

### Use Case
- **Styling**: Grouping elements or targeting specific "types" of components in Tailwind.
- **State**: Marking an element as `data-state="active"`.
- **Testing**: Giving elements a ID for automated tests (`data-testid="submit-btn"`).

### Usage Example
```tsx
// Using in Tailwind
<div data-type="premium" className="data-[type=premium]:bg-gold">
  Premium Content
</div>

// Multiple elements can have the same data attribute (unlike ID)
<button data-action="delete">Delete Item</button>
<button data-action="delete">Delete Category</button>
```

---

## 3. `title` (The Browser Tooltip)

### Definition
The `title` attribute represents advisory information for the element. It typically appears as a **tooltip** when a user hovers over the element with a mouse.

### Use Case
Providing extra, non-essential information to sighted users using a mouse.

### Usage Example
```tsx
// Shows a small popup on hover after ~1 second
<span title="United States Dollar">$ 100</span>

// On a button to explain a shortcut
<button title="Create new expense (Ctrl+N)">+</button>
```

---

## Comparison Summary

| Attribute | Visible? | Who is it for? | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **`aria-label`** | No | Screen Readers | Accessibility (Naming) |
| **`data-*`** | No | Developers (CSS/JS) | Metadata & Styling |
| **`title`** | Yes (on hover) | Sighted Mouse Users | Extra Information |

---

### Best Practices Tip:
- **Never rely on `title` for critical info**: Users on mobile or keyboard-only users will never see it.
- **Don't duplicate**: If you have visible text like "Submit", you don't need `aria-label="Submit"`.
- **Prefer `data-*` over `aria-label` for styling**: Keep accessibility attributes strictly for accessibility.
