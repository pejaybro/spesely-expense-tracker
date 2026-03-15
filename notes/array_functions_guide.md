# Essential JavaScript Array Functions

Arrays are the most versatile data structure in JavaScript. Here are the most important functions you'll use daily.

---

## 1. Transformation & Filtering

### `.map(callback)`
Creates a **new array** by applying a function to every element.
```javascript
const prices = [10, 20, 30];
const taxed = prices.map(p => p * 1.2); // [12, 24, 36]
```

### `.filter(callback)`
Creates a **new array** with all elements that pass a test.
```javascript
const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
```

### `.reduce(callback, initialValue)`
Executes a reducer function on each element, resulting in a **single output value**.
```javascript
const total = [1, 2, 3].reduce((sum, n) => sum + n, 0); // 6
```

---

## 2. Searching & Checking

### `.find(callback)`
Returns the **first element** that satisfies the condition.
```javascript
const users = [{id: 1, name: 'A'}, {id: 2, name: 'B'}];
const user = users.find(u => u.id === 2); // {id: 2, name: 'B'}
```

### `.findIndex(callback)`
Returns the **index** of the first element that satisfies the condition.
```javascript
const idx = [10, 20, 30].findIndex(n => n === 20); // 1
```

### `.includes(value)`
Returns `true` if the array contains a certain value.
```javascript
['apple', 'orange'].includes('apple'); // true
```

### `.some(callback)`
Returns `true` if **at least one** element passes the test.
```javascript
[1, -1, 3].some(n => n < 0); // true
```

### `.every(callback)`
Returns `true` if **all** elements pass the test.
```javascript
[2, 4, 6].every(n => n % 2 === 0); // true
```

---

## 3. Order & Modification

### `.sort(callback)`
Sorts the elements of an array **in place** (mutates original).
```javascript
[3, 1, 2].sort((a, b) => a - b); // [1, 2, 3]
```

### `.reverse()`
Reverses the array **in place**.
```javascript
[1, 2, 3].reverse(); // [3, 2, 1]
```

### `.slice(start, end)`
Returns a **shallow copy** of a portion of an array (non-mutating).
```javascript
[1, 2, 3, 4].slice(1, 3); // [2, 3]
```

### `.splice(start, deleteCount, ...items)`
Changes contents by removing or replacing existing elements **in place**.
```javascript
const arr = [1, 2, 3];
arr.splice(1, 1, 'x'); // arr is now [1, 'x', 3]
```
