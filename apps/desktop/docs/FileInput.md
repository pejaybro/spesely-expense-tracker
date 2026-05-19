# FileInput Component

The `FileInput` is a high-end file upload tool supporting single-file selection, drag-and-drop zones, and live file previews.

## Props

### 1. Core State Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `file` | `File \| null` | `null` | The currently selected file object. |
| `onChange` | `(file) => void` | `undefined` | Callback fired when a file is selected or dropped. |
| `accept` | `string` | `undefined` | Standard HTML accept attribute (e.g., `"image/*"`). |

### 2. Display Variations
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `"rounded" \| "curved" \| "square" \| "floating"` | `"rounded"` | Style of the input box. |
| `dropzoneVariant` | `"square" \| "wide" \| "narrow" \| "none"` | `"none"` | Layout of the drag-and-drop area. |

### 3. Visual & Labeling
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `undefined` | The field label. |
| `placeholder` | `string` | `"No file selected"` | Text shown when no file is present. |
| `showPreview` | `boolean` | `true` | Displays a thumbnail or icon preview for images and documents. |

## Usage Examples

### Drag-and-Drop Square Zone
```tsx
<FileInput 
  label="Upload Avatar" 
  dropzoneVariant="square" 
  accept="image/*" 
  onChange={(file) => setAvatar(file)} 
/>
```

### Simple Floating Picker
```tsx
<FileInput 
  variant="floating" 
  label="Resume / CV" 
  accept=".pdf,.doc" 
/>
```
