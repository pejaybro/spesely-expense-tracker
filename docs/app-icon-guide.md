# 🎨 Custom App Icon Guide (Development & Production)

This guide explains how to replace the default Electron icon with your custom branded icon for both **development window/taskbar** and **packaged Windows installer / .exe**.

---

## 📌 Summary: What You Need

1. **Icon Format**: A `.ico` file (Windows icon containing multiple resolutions: 16x16, 32x32, 48x48, and 256x256) and a 512x512 `.png` file.
2. **Recommended Location**: Place your icons in a `build/` directory in the project root:
   - `build/icon.ico` (for Windows Installer & Taskbar)
   - `build/icon.png` (high-resolution PNG source)

> 💡 **Tip to create a `.ico` file**: Use free online converters like [CloudConvert](https://cloudconvert.com/png-to-ico) or [favicon.io](https://favicon.io/) to convert a 512x512 PNG into `.ico`.

---

## 🛠️ Configuration Steps

### Step 1: Set the Window / Taskbar Icon (Development & Production)

In [`electron/config.cjs`](file:///c:/1.CODE/spesely-expense-tracker/electron/config.cjs), add the `icon` property to the `BrowserWindow` configurations:

```javascript
// electron/config.cjs
const path = require("path");

const CONFIG = {
  window: {
    main: {
      width: 1200,
      height: 800,
      icon: path.join(__dirname, "../build/icon.ico"), // <-- App icon
      // ...
    },
    splash: {
      width: 400,
      height: 300,
      icon: path.join(__dirname, "../build/icon.ico"), // <-- Splash icon
      // ...
    },
  },
  // ...
};
```

---

### Step 2: Configure `package.json` for the Installer & Packaged `.exe`

In [`package.json`](file:///c:/1.CODE/spesely-expense-tracker/package.json), configure the `"build"` block with your icon path:

```json
"build": {
  "appId": "com.spesely.expensetracker",
  "productName": "Spesely",
  "icon": "build/icon.ico",
  "win": {
    "icon": "build/icon.ico",
    "target": [
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ]
  },
  "nsis": {
    "installerIcon": "build/icon.ico",
    "uninstallerIcon": "build/icon.ico",
    "artifactName": "${productName}-Setup-v${version}.${ext}",
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "createUninstallerShortcut": true,
    "shortcutName": "Spesely",
    "deleteAppDataOnUninstall": true,
    "uninstallDisplayName": "Spesely"
  }
}
```

---

## 🔍 Where the Icon Will Appear

| Location | Config Source |
| :--- | :--- |
| **Desktop Shortcut Icon** | `build.win.icon` / `build.icon` |
| **Start Menu Shortcut Icon** | `build.win.icon` |
| **Installer File Icon (`.exe`)** | `build.nsis.installerIcon` |
| **Uninstaller Icon** | `build.nsis.uninstallerIcon` |
| **Taskbar & Window Title Bar** | `CONFIG.window.main.icon` in `electron/config.cjs` |
| **Windows Add/Remove Programs** | Automatically derived from `.exe` |

---

## 🚀 Testing

1. **Test in Dev**:
   ```powershell
   npm run dev:electron
   ```
   *(Check the taskbar icon when the window opens)*

2. **Test in Packaged Build**:
   ```powershell
   npm run package
   ```
   *(Inspect `release/Spesely-Setup-v1.0.0.exe` and verify the custom icon)*