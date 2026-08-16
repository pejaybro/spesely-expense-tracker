const { ipcMain } = require("electron");
const repo = require("../../db/repositories/secondaryCategory.repository.cjs");

function registerSecondaryCategoryIPC() {
  ipcMain.handle("secondaryCategory:get-all", () => repo.getAll());
  ipcMain.handle("secondaryCategory:get-by-primary-id", (_, primary_public_id) => repo.getByPrimaryId(primary_public_id));
  ipcMain.handle("secondaryCategory:create", (_, category) => repo.create(category));
  ipcMain.handle("secondaryCategory:toggle-status", (_, public_id) => repo.toggleStatus(public_id));
  ipcMain.handle("secondaryCategory:soft-delete", (_, public_id) => repo.softDelete(public_id));
  ipcMain.handle("secondaryCategory:delete", (_, public_id) => repo.delete(public_id));
  ipcMain.handle("secondaryCategory:update", (_, public_id, category) => repo.update(public_id, category));
}

module.exports = { registerSecondaryCategoryIPC };
