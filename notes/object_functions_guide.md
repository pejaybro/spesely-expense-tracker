# Essential JavaScript Object Functions

While objects don't have as many built-in methods as arrays, these static methods are critical for manipulating data.

---

## 1. Accessing Data

### `Object.keys(obj)`
Returns an array of a given object's **own property names**.
```javascript
const user = { id: 1, name: 'Pejay' };
Object.keys(user); // ['id', 'name']
```

### `Object.values(obj)`
Returns an array of a given object's **own property values**.
```javascript
Object.values(user); // [1, 'Pejay']
```

### `Object.entries(obj)`
Returns an array of a given object's **own enumerable string-keyed property [key, value] pairs**.
```javascript
Object.entries(user); // [['id', 1], ['name', 'Pejay']]
```

---

## 2. Merging & Cloning

### `Object.assign(target, ...sources)`
Copies all enumerable own properties from one or more source objects to a target object.
```javascript
const base = { a: 1 };
const extra = { b: 2 };
const merged = Object.assign({}, base, extra); // { a: 1, b: 2 }
// Note: Spread syntax { ...base, ...extra } is usually preferred now.
```

---

## 3. Security & Immutability

### `Object.freeze(obj)`
Freezes an object: other code cannot delete or change any properties.
```javascript
const config = Object.freeze({ api: 'https://...' });
config.api = 'hack'; // Does nothing (fails silently or errors in strict mode)
```

### `Object.seal(obj)`
Prevents new properties from being added and marks all existing properties as non-configurable. Existing values *can* still be changed.

### `Object.hasOwn(obj, prop)`
Returns `true` if the specified object has the indicated property as its **own property**.
```javascript
Object.hasOwn(user, 'name'); // true
```

---

## 4. Derived Logic

### Using `.some()` with Objects
To check if an object has any value, combine it with `Object.values()`:
```javascript
const hasData = Object.values(formData).some(val => val !== "");
```

---

## Pro Tip: Property Shorthand
When variable names match key names, you can skip the value:
```javascript
const name = "Pejay";
const user = { name }; // same as { name: "Pejay" }
```
