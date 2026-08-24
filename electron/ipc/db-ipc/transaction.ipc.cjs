const { ipcMain } = require("electron");
const repo = require("../../db/repositories/transaction.repository.cjs");

function registerTransactionIPC() {
  ipcMain.handle("transaction:get-paginated", (_, params) => repo.getPaginated(params));
  ipcMain.handle("transaction:create", (_, transaction) => repo.create(transaction));
  ipcMain.handle("transaction:update", (_, public_id, transaction) => repo.update(public_id, transaction));
  ipcMain.handle("transaction:delete", (_, public_id) => repo.delete(public_id));
}

module.exports = { registerTransactionIPC };
