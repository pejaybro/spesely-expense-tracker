const { ipcRenderer } = require("electron");
const demoAPI = {
  getAll: () => ipcRenderer.invoke("demo:get-all"),

  getById: (id) => ipcRenderer.invoke("demo:get-by-id", id),

  create: (demo) => ipcRenderer.invoke("demo:create", demo),

  update: (id, demo) => ipcRenderer.invoke("demo:update", { id, demo }),

  deleteById: (id) => ipcRenderer.invoke("demo:delete", id),
};

module.exports = demoAPI;
