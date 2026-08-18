# Spesely - Expense Tracker

A modern desktop expense tracker application built with **React**, **TypeScript**, **Tailwind CSS**, and **Electron** powered by **SQLite** (`better-sqlite3`).

---

## 🚀 Available NPM Commands

Here is the complete reference of all available npm scripts and their purposes:

### 🛠️ Development

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the **Vite development server** (default: `http://localhost:3000`) for web UI development in the browser. |
| `npm run dev:electron` | **Full Development Mode** — Concurrently starts the Vite frontend server and launches Electron with live hot-reloading (`electronmon`). |
| `npm run electron` | Launches the Electron desktop shell directly against the active environment. |

---

### 🗄️ Database Management

| Command | Description |
| :--- | :--- |
| `npm run db-migrate` | **Runs database migrations headlessly** without opening any Electron UI window. Executes all pending SQL files from `electron/db/migrations/`. |
| `npm run db-reset` | **Wipes the local database** — terminates processes holding file locks and deletes `%APPDATA%\Electron\spesely-db-v1.sqlite` (plus `-wal` and `-shm` files). |
| `npm run db-reset; npm run db-migrate` | Reset the database and immediately run fresh migrations in one step. |

---

### 📦 Build & Packaging

| Command | Description |
| :--- | :--- |
| `npm run build` | Runs TypeScript type checking (`tsc -b`) and builds the optimized frontend bundle into `dist/`. |
| `npm run package` | **Creates the Windows Installer (`.exe`)** — builds frontend assets, compiles native modules, and generates the installer: `release/Spesely-Setup-v1.0.0.exe`. |
| `npm run package:dir` | Packages an **unpacked** production build in `release/win-unpacked/` for rapid testing without compressing into an installer. |
| `npm run preview` | Locally serves and previews the production `dist/` build. |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |

---

## ⚙️ Installer & Packaging Configuration

Configured under the `"build"` block in `package.json`:

- **Installer Output**: `release/Spesely-Setup-v1.0.0.exe` (`artifactName`: `"${productName}-Setup-v${version}.${ext}"`)
- **Desktop & Start Menu Shortcut**: Labeled **"Spesely"** (`shortcutName`: `"Spesely"`)
- **Uninstaller**: Labeled **"Spesely"** in Windows Installed Apps (`uninstallDisplayName`: `"Spesely"`)
- **Start Menu Uninstaller Shortcut**: Enabled (`createUninstallerShortcut`: `true`)
- **Clean Uninstall**: Completely wipes app data and local database on uninstall (`deleteAppDataOnUninstall`: `true`)

---

## 📁 Project Structure Overview

```
├── dist/                  # Built frontend assets (HTML, CSS, JS)
├── electron/
│   ├── db/                # SQLite initialization and migration runner
│   │   ├── migrations/    # SQL migration files (*.sql)
│   │   └── repositories/  # Database data access layer
│   ├── ipc/               # Electron Main IPC handlers
│   ├── preload/           # Secure Electron preload scripts
│   ├── config.cjs         # App & window configurations
│   └── main.cjs           # Electron main process entry point
├── release/               # Output folder for packaged installers (.exe)
├── scripts/               # Standalone dev scripts (migrate, reset, reset-db.sql)
└── src/                   # React frontend application
```

---

## 💻 System Requirements
- **Node.js**: v20+ recommended
- **OS**: Windows (x64) for NSIS builds

---

## 📚 Documentation
- 📖 [GitHub Release & Distribution Guide](docs/release-guide.md)