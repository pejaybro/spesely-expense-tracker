# React HTML Attribute Extenders Guide

When building reusable components in React with TypeScript, you should almost always extend the built-in React attribute types. This gives your components all the standard HTML props (like `id`, `className`, `onClick`, `style`) for free.

## The General Pattern

The pattern usually looks like this:
`React.[Type]HTMLAttributes<HTML[Element]Element>`

---

## Common Extenders List

| Element | React Attribute Type | HTML Element Type |
| :--- | :--- | :--- |
| `<div>` | `React.HTMLAttributes<T>` | `HTMLDivElement` |
| `<button>` | `React.ButtonHTMLAttributes<T>` | `HTMLButtonElement` |
| `<a>` | `React.AnchorHTMLAttributes<T>` | `HTMLAnchorElement` |
| `<input>` | `React.InputHTMLAttributes<T>` | `HTMLInputElement` |
| `<form>` | `React.FormHTMLAttributes<T>` | `HTMLFormElement` |
| `<img>` | `React.ImgHTMLAttributes<T>` | `HTMLImageElement` |
| `<label>` | `React.LabelHTMLAttributes<T>` | `HTMLLabelElement` |
| `<textarea>` | `React.TextareaHTMLAttributes<T>` | `HTMLTextAreaElement` |
| `<select>` | `React.SelectHTMLAttributes<T>` | `HTMLSelectElement` |
| `<ul>` / `<ol>` | `React.HTMLAttributes<T>` | `HTMLUListElement` / `HTMLOListElement` |

---

## Detailed Examples

### 1. General Container (div, span, section)
For elements that don't have special attributes (like `href` or `type`), use the base `HTMLAttributes`.

```typescript
interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
}
```

### 2. Inputs (Very Useful)
`InputHTMLAttributes` is powerful because it includes `value`, `onChange`, `type`, `placeholder`, etc.

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
```

### 3. Links (Anchor)
This includes `href`, `target`, `rel`, etc.

```typescript
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isExternal?: boolean;
}
```

---

## Why Use This Approach?

1.  **IntelliSense**: When you use your component, your code editor will suggest every valid HTML attribute (like `title`, `aria-label`, `data-*`).
2.  **Type Safety**: TypeScript will prevent you from passing a `number` to `className` or a `string` to `onClick`.
3.  **Future Proof**: If React or the HTML spec adds a new standard attribute, your component will support it automatically without you changing a single line of code.
4.  **Standardization**: Other developers working on your project will immediately understand your component's API because it follows standard React patterns.

---

## Pro Tip: `ComponentPropsWithoutRef`
If you don't want to type the long `React.XHTMLAttributes` string, React provides a helper:

```typescript
import { ComponentPropsWithoutRef } from 'react';

// This is equivalent to extending ButtonHTMLAttributes
interface Props extends ComponentPropsWithoutRef<'button'> {
  variant: string;
}
```
