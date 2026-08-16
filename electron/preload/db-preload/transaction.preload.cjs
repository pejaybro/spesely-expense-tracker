const { ipcRenderer } = require("electron");

const transactionAPI = {
  getAll: () => ipcRenderer.invoke("transaction:get-all"),
  getTop10: (is_expense) => ipcRenderer.invoke("transaction:get-top-10", is_expense),
  create: (transaction) => ipcRenderer.invoke("transaction:create", transaction),
  delete: (public_id) => ipcRenderer.invoke("transaction:delete", public_id),
};

module.exports = transactionAPI;
