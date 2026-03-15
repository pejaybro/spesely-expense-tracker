# JavaScript Date Guide: new Date()

Handling dates in native JavaScript can be tricky because months are 0-indexed and formatting used to be difficult. This guide covers the essential modern patterns.

---

## 1. Creating Dates

### The Basics
```javascript
const now = new Date(); // Current date and time
const epoch = new Date(0); // Jan 1, 1970
const fromString = new Date("2026-03-15"); // ISO strings are best
const fromParts = new Date(2026, 2, 15, 12, 0); // Year, Month (0=Jan), Day, Hour, Min
```

---

## 2. Getting Date Parts (Getters)

| Method | Output | Range |
| :--- | :--- | :--- |
| `.getFullYear()` | `2026` | Year |
| `.getMonth()` | `2` | **0-11** (March is 2) |
| `.getDate()` | `15` | 1-31 (Day of month) |
| `.getDay()` | `0` | **0-6** (Sunday is 0) |
| `.getHours()` | `14` | 0-23 |
| `.getTime()` | `174203...` | Milliseconds since 1970 |

---

## 3. Formatting with `Intl.DateTimeFormat`
Instead of manually building strings, use the modern `Intl` API:

```javascript
const date = new Date();

// Simple Locale String
console.log(date.toLocaleDateString('en-IN')); // "15/03/2026"

// Custom Options (Premium Way)
const formatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});
console.log(formatter.format(date)); // "Sunday, Mar 15, 2026"
```

---

## 4. Common Scenarios

### Calculating Differences
```javascript
const start = new Date("2026-03-01");
const end = new Date("2026-03-15");

const diffInMs = end - start;
const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // 14
```

### Adding Days
```javascript
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
```

---

## 5. Native Date vs. Day.js
Your project already includes `dayjs` (exported in `root.config.ts`). Here is when to use which:

| Use **Native Date** when... | Use **Day.js** when... |
| :--- | :--- |
| You just need `Date.now()`. | You need complex math (add 3 months, 2 days). |
| You are doing simple comparisons. | You need human-readable formatting ("2 hours ago"). |
| You want zero dependencies/payload. | You are handling timezones or locales. |

### Example with Day.js (Available in your project):
```javascript
import dayjs from "@/root.config";

const displayDate = dayjs().format('MMMM D, YYYY'); // "March 15, 2026"
const nextMonth = dayjs().add(1, 'month').toISOString();
```

---

## Pro Tip: Zeroing out time
If you want to compare two dates without the time getting in the way, set hours to zero:
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0); // Sets time to 00:00:00:000
```
