# Routing in Electron

Electron applications have unique constraints compared to normal web apps because they are served via the `file://` protocol rather than `http://`.

## Why `createHashRouter`?

In a standard web app, you use `createBrowserRouter` for clean URLs like `example.com/dashboard`. However, if you refresh that page, the server handles the request and sends back `index.html`.

In Electron:
1. There is no web server to handle redirects.
2. If the URL is `C:/app/index.html/dashboard`, the OS looks for a folder named `index.html` and fails.
3. **`HashRouter`** fixes this by using the `#` symbol: `index.html#/dashboard`. The browser (Chromium) ignores everything after the `#` when looking for the file, but React Router sees it and loads the correct component.

## The Shell Architecture

Our routing follows the **Persistent Shell** pattern:
- **`WindowLayout`**: Stays mounted at all times (Title Bar).
- **`AppLayout`**: Stays mounted at all times (Sidebar & Footer).
- **`<Outlet />`**: The only part that changes when you navigate.

This ensures that animations, music players, or background tasks are never interrupted during navigation.

## Navigating

Always use the `useNavigate()` hook or the `<Link />` component from `react-router-dom`. Avoid `window.location.href` as it will cause a full app reload and break Electron's window state.
