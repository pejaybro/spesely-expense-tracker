# JavaScript Iteration Guide: Arrays & Objects

Understanding the best way to loop through data is key to writing clean, readable code. This guide covers simple to complex nested structures.

---

## 1. Simple Arrays
**Best Way**: `forEach` (for side effects) or `map` (to transform data).

```javascript
const colors = ["red", "blue", "green"];

// Simple looping
colors.forEach((color) => console.log(color));

// Transforming (returns a new array)
const upperColors = colors.map((color) => color.toUpperCase());
```

---

## 2. Objects (Key-Value Parents)
**Best Way**: `Object.entries()` or `Object.keys()`.

```javascript
const user = { name: "Pejay", role: "Developer" };

// Loop through keys and values
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Just the keys
Object.keys(user).forEach((key) => console.log(key));
```

---

## 3. Arrays of Objects
This is the most common format in React (e.g., a list of expenses).

```javascript
const expenses = [
  { id: 1, amount: 50, category: "Food" },
  { id: 2, amount: 20, category: "Transport" }
];

// Best way: map over them
expenses.map((expense) => {
  return `${expense.category}: $${expense.amount}`;
});
```

---

## 4. Complex Nested Structures

### A. Array of Objects (with nested keys)
```javascript
const data = [
  { id: 1, tags: ["work", "urgent"] },
  { id: 2, tags: ["home"] }
];

// Double mapping
data.map(item => {
  item.tags.map(tag => console.log(tag));
});
```

### B. Object of Objects
```javascript
const groups = {
  admin: { id: 10, name: "Alice" },
  guest: { id: 20, name: "Bob" }
};

Object.values(groups).forEach(user => {
  console.log(user.name);
});
```

### C. Object where each key is an Array
```javascript
const categories = {
  Food: ["Pizza", "Burger"],
  Transport: ["Bus", "Uber"]
};

Object.entries(categories).forEach(([category, items]) => {
  console.log(`--- ${category} ---`);
  items.forEach(item => console.log(item));
});
```

---

## The "Best Way" Summary Table

| Structure | Recommendation | Why? |
| :--- | :--- | :--- |
| **Array** | `.map()` / `.forEach()` | Native, readable, and functional. |
| **Object** | `Object.entries()` | Converts object to a loopable array of [key, value]. |
| **Async Loop** | `for...of` | Supports `await` inside the loop (unlike forEach). |
| **Nested** | Destructuring | `map(({ id, stats }) => ...)` keeps code clean. |

### Pro Tip: Use Optional Chaining
When dealing with deep nested objects, always use `?.` to prevent your app from crashing if a key is missing:
`user?.profile?.address?.city`
