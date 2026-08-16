const { ipcRenderer } = require("electron");

const primaryCategoryAPI = {
  getAll: () => ipcRenderer.invoke("primaryCategory:get-all"),
  create: (category) => ipcRenderer.invoke("primaryCategory:create", category),
  toggleStatus: (public_id) => ipcRenderer.invoke("primaryCategory:toggle-status", public_id),
  softDelete: (public_id) => ipcRenderer.invoke("primaryCategory:soft-delete", public_id),
  delete: (public_id) => ipcRenderer.invoke("primaryCategory:delete", public_id),
  update: (public_id, category) => ipcRenderer.invoke("primaryCategory:update", public_id, category),
};

module.exports = primaryCategoryAPI;
