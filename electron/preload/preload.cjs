const { contextBridge, ipcRenderer } = require("electron");
const api = require("./db-preload/index.cjs");

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => ipcRenderer.invoke("ping"),
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  ...api,
});

console.log("[preload] electronAPI exposed", Object.keys(api));
