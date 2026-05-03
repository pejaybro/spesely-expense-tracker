# Understanding useLayoutEffect

`useLayoutEffect` is a version of `useEffect` that fires **synchronously** after all DOM mutations but **before the browser has a chance to paint.**

---

## 1. The Rendering Pipeline
To understand `useLayoutEffect`, you must understand the difference in timing compared to `useEffect`:

### Standard `useEffect` (Asynchronous)
1.  React renders the component.
2.  The browser **paints** the changes to the screen (the user sees the update).
3.  `useEffect` runs.
*   **Result**: If `useEffect` changes the layout again, the user might see a brief "flicker" of the old state.

### `useLayoutEffect` (Synchronous)
1.  React renders the component.
2.  `useLayoutEffect` runs **immediately**.
3.  The browser **paints** the screen once everything is settled.
*   **Result**: The user never sees the intermediate state. No flickering.

---

## 2. When to use it?

### A. Measuring Layout
If you need to know the exact width, height, or position of an element to decide what to render next.
-   **Example**: "If this div is wider than 500px, show a different icon."

### B. Preventing Visual "Jank"
If your effect modifies the DOM in a way that would be visible if it happened a few milliseconds later.
-   **Our Sidebar Example**: When resizing the window, we use `useLayoutEffect` to update the `isMobile` state so the sidebar snaps to the correct size **before** the browser draws the next frame.

### C. Syncing with External APIs
When you are interacting with non-React libraries (like D3.js or jQuery) that need to touch the DOM as soon as it's ready.

---

## 3. Why not use it everywhere?
**Performance.** 
Because `useLayoutEffect` is synchronous, it **blocks the browser from painting.** If you put a heavy calculation inside it, your app will feel sluggish or "frozen" because the browser is waiting for your code to finish before it can show anything to the user.

> [!TIP]
> **Rule of Thumb:** 
> Start with `useEffect`. Only switch to `useLayoutEffect` if you notice visual flickering or if you are specifically measuring DOM elements.

---

## 4. Summary Table

| Feature | `useEffect` | `useLayoutEffect` |
| :--- | :--- | :--- |
| **Timing** | After paint (Async) | Before paint (Sync) |
| **User Impact** | Potential flickering | Smooth, invisible updates |
| **Performance** | Better (non-blocking) | Worse (blocks painting) |
| **Best For** | Data fetching, events, logging | Measuring DOM, animations, layout fixes |

---

## Example from our code:
```tsx
useLayoutEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) setExpandMenu(false);
  };
  
  window.addEventListener("resize", handleResize);
  handleResize(); // Run immediately so first paint is correct
  
  return () => window.removeEventListener("resize", handleResize);
}, []);
```
*In this case, we use it so the sidebar doesn't "jump" from expanded to collapsed after the page has already appeared.*
