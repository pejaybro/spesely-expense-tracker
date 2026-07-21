# AmountInput Component

A styled form input component optimized for Tailwind.

---

## Usage

```tsx
import { AmountInput } from "../../components/form";

<AmountInput
  label="Price Value"
  currency="USD"
  value={amount}
  onChange={setAmount}
/>
```

---

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `currency` | `string` | `"$"` | Currency prefix symbol. |
| `allowDecimals` | `boolean` | `true` | Allows float decimals. |
