# 🚀 GitHub Release & Distribution Guide

This document explains step-by-step how to publish and distribute new versions of **Spesely Expense Tracker** via GitHub Releases.

---

## 📌 Why Use GitHub Releases?
- **Keeps Git lightweight**: Avoids committing large binary files (`.exe` > 100 MB) into git repository history.
- **Easy download for users**: Gives users a direct 1-click download link for the installer.
- **Version history & changelogs**: Keeps track of previous releases and update notes.

---

## 🛠️ Step-by-Step Publishing Process

### 1. Build the Latest Installer
Before publishing, ensure your working tree is clean and package the installer:

```powershell
npm run package
```

This generates your installer file in the `release/` folder:
👉 `release/Spesely-Setup-v1.0.0.exe`

---

### 2. Push Your Source Code to GitHub
Push your latest commits to GitHub:

```powershell
git add .
git commit -m "chore: release version 1.0.0"
git push origin main
```

---

### 3. Create the Release on GitHub.com

1. Open your repository on [GitHub.com](https://github.com/).
2. On the right-hand sidebar, click **"Releases"** (or go to `https://github.com/<owner>/<repo>/releases`).
3. Click the **"Draft a new release"** button.
4. **Choose a tag**: Type your release tag (e.g. `v1.0.0`) and select *Create new tag*.
5. **Release title**: Enter a title (e.g. `Spesely v1.0.0 - Initial Release`).
6. **Description / Changelog**: List new features, bug fixes, or release notes.
7. **Attach Binary**:
   - In the **"Attach binaries by dropping them here"** section, drag and drop:
     📁 `release/Spesely-Setup-v1.0.0.exe`
8. Click **"Publish release"**.

---

## 🔄 Releasing Future Updates (Checklist)

When releasing a new version (e.g. `1.0.1` or `1.1.0`):

1. **Bump version in `package.json`**:
   ```json
   "version": "1.0.1"
   ```
2. **Build the installer**:
   ```powershell
   npm run package
   ```
   *(Outputs `release/Spesely-Setup-v1.0.1.exe`)*
3. **Commit & Tag**:
   ```powershell
   git add package.json
   git commit -m "chore: bump version to 1.0.1"
   git push origin main
   ```
4. **Publish on GitHub Releases** and attach `Spesely-Setup-v1.0.1.exe`.

---

## ⚡ Automating with GitHub Actions (Optional for later)
You can optionally set up a `.github/workflows/release.yml` workflow using `electron-builder action` to automatically build and attach `.exe` files whenever you push a Git tag (`git push origin v1.0.0`).