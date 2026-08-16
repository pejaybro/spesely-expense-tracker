const { ipcMain } = require("electron");
const repo = require("../../db/repositories/transaction.repository.cjs");

function registerTransactionIPC() {
  ipcMain.handle("transaction:get-all", () => repo.getAll());
  ipcMain.handle("transaction:get-top-10", (_, is_expense) => repo.getTop10(is_expense));
  ipcMain.handle("transaction:create", (_, transaction) => repo.create(transaction));
  ipcMain.handle("transaction:delete", (_, public_id) => repo.delete(public_id));
}

module.exports = { registerTransactionIPC };
