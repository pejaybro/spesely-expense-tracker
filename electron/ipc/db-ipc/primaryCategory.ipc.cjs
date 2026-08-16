const { ipcMain } = require("electron");
const repo = require("../../db/repositories/primaryCategory.repository.cjs");

function registerPrimaryCategoryIPC() {
  ipcMain.handle("primaryCategory:get-all", () => repo.getAll());
  ipcMain.handle("primaryCategory:create", (_, category) => repo.create(category));
  ipcMain.handle("primaryCategory:toggle-status", (_, public_id) => repo.toggleStatus(public_id));
  ipcMain.handle("primaryCategory:soft-delete", (_, public_id) => repo.softDelete(public_id));
  ipcMain.handle("primaryCategory:delete", (_, public_id) => repo.delete(public_id));
  ipcMain.handle("primaryCategory:update", (_, public_id, category) => repo.update(public_id, category));
}

module.exports = { registerPrimaryCategoryIPC };
