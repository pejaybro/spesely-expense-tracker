# Electron Development Setup Notes

## Goal

Enable smooth Electron development with: - React (Vite) - Electron -
Auto-restart when Electron main process changes - Hot reload for React
UI

------------------------------------------------------------------------

# 1. Install electronmon

electronmon works like **nodemon** but for Electron.

Install inside the desktop app:

npm install -D electronmon

Purpose: - Watches Electron files - Automatically restarts Electron when
they change

------------------------------------------------------------------------

# 2. Development Script

Example script in `apps/desktop/package.json`

``` json
"dev:electron": "concurrently \"npm run dev\" \"wait-on http://localhost:3000 && cross-env NODE_ENV=development electronmon electron/main.cjs\""
```

### Tools Explained

  -----------------------------------------------------------------------
  Tool                             Purpose
  -------------------------------- --------------------------------------
  concurrently                     runs multiple commands together

  vite                             starts React dev server

  wait-on                          waits until localhost:3000 is ready

  electronmon                      launches Electron and restarts it when
                                   main files change

  cross-env                        sets environment variables in a
                                   cross-platform way
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 3. Why NODE_ENV is Needed

Electron code checks:

``` js
const isDev = process.env.NODE_ENV === "development";
```

Without setting NODE_ENV, Electron assumes **production mode**.

Then it tries loading:

    dist/index.html

But during development the **dist folder does not exist**, causing:

    ERR_FILE_NOT_FOUND

Solution:

Set

    NODE_ENV=development

------------------------------------------------------------------------

# 4. Dev vs Production Logic

In `main.cjs`:

``` js
if (isDev) {
  mainWindow.loadURL("http://localhost:3000");
} else {
  mainWindow.loadFile("../dist/index.html");
}
```

### Behavior

  Mode          What Loads
  ------------- -----------------
  Development   Vite dev server
  Production    Built HTML

------------------------------------------------------------------------

# 5. Content Security Policy Warning

Electron may show:

    Electron Security Warning (Insecure Content-Security-Policy)

Why this happens:

-   Vite uses `eval()` for hot reload
-   Electron flags it as unsafe

### Development Fix

Add at the top of `main.cjs`:

``` js
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
```

This removes warnings during development.

Production builds will not show the warning.

------------------------------------------------------------------------

# 6. Final Development Flow

Run:

    npm run electron-dev

Process:

1.  Vite starts the React dev server
2.  wait-on waits for localhost:3000
3.  Electron launches
4.  electronmon watches Electron files

### Result

  Change Type            Behavior
  ---------------------- ---------------------------------
  React UI change        Hot reload
  Electron main change   Electron restarts automatically

------------------------------------------------------------------------

# 7. Benefits of This Setup

-   Smooth development workflow
-   React hot reload
-   Automatic Electron restart
-   Proper dev vs production separation

This setup is commonly used in **modern Electron + React applications**.
