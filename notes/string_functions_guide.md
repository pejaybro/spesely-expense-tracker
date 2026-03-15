# Essential JavaScript String Functions

Handling text is a huge part of web development. These are the functions you'll use for labels, searches, and formatting.

---

## 1. Searching & Checking

### `.includes(substring)`
Determines whether one string may be found within another string.
```javascript
"Hello world".includes("Hello"); // true
```

### `.startsWith(substring)` / `.endsWith(substring)`
Checks if the string begins or ends with specific characters.
```javascript
"file.pdf".endsWith(".pdf"); // true
```

### `.indexOf(substring)`
Returns the index of the **first occurrence** of the specified value.
```javascript
"banana".indexOf("a"); // 1
```

---

## 2. Formatting & Trimming

### `.toLowerCase()` / `.toUpperCase()`
Returns the string converted to lower or upper case.
```javascript
"React".toUpperCase(); // "REACT"
```

### `.trim()`
Removes whitespace from both ends of a string.
```javascript
"  hello  ".trim(); // "hello"
```

### `.repeat(count)`
Returns a new string which contains the specified number of copies of the string.
```javascript
"abc".repeat(2); // "abcabc"
```

---

## 3. Extraction & Modification

### `.split(separator)`
Divides a string into an **ordered list of substrings** and returns them in an array.
```javascript
"apple,banana,cherry".split(","); // ["apple", "banana", "cherry"]
```

### `.slice(start, end)`
Extracts a section of a string and returns it as a new string.
```javascript
"Hello world".slice(0, 5); // "Hello"
```

### `.replace(pattern, replacement)`
Replaces the **first occurrence** of a pattern with a replacement. Use `.replaceAll()` for all occurrences.
```javascript
"I like cats".replace("cats", "dogs"); // "I like dogs"
```

### `.padStart(length, char)` / `.padEnd(length, char)`
Pads the string with another string until it reaches the given length.
```javascript
"5".padStart(2, "0"); // "05" (Great for clock/dates!)
```

---

## Pro Tip: Template Literals
Use backticks `` ` `` instead of quotes for easy variables and multi-line strings:
```javascript
const name = "Pejay";
console.log(`Hello, ${name}!`); 
```
