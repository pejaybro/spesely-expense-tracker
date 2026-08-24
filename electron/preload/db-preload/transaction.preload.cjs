const { ipcRenderer } = require("electron");

const transactionAPI = {
  getPaginated: (params) => ipcRenderer.invoke("transaction:get-paginated", params),
  create: (transaction) => ipcRenderer.invoke("transaction:create", transaction),
  update: (public_id, transaction) => ipcRenderer.invoke("transaction:update", public_id, transaction),
  delete: (public_id) => ipcRenderer.invoke("transaction:delete", public_id),
};

module.exports = transactionAPI;
