const { ipcRenderer } = require("electron");

const secondaryCategoryAPI = {
  getAll: () => ipcRenderer.invoke("secondaryCategory:get-all"),
  getByPrimaryId: (primary_public_id) => ipcRenderer.invoke("secondaryCategory:get-by-primary-id", primary_public_id),
  create: (category) => ipcRenderer.invoke("secondaryCategory:create", category),
  toggleStatus: (public_id) => ipcRenderer.invoke("secondaryCategory:toggle-status", public_id),
  softDelete: (public_id) => ipcRenderer.invoke("secondaryCategory:soft-delete", public_id),
  delete: (public_id) => ipcRenderer.invoke("secondaryCategory:delete", public_id),
  update: (public_id, category) => ipcRenderer.invoke("secondaryCategory:update", public_id, category),
};

module.exports = secondaryCategoryAPI;
