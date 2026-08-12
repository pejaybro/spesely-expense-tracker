const { ipcMain } = require("electron");
const demoRepository = require("../../db/repositories/demo.repository.cjs");

function registerDemoIPC() {
  ipcMain.handle("demo:get-all", () => {
    return demoRepository.getAll();
  });

  ipcMain.handle("demo:get-by-id", (_, id) => {
    return demoRepository.getById(id);
  });

  ipcMain.handle("demo:create", (_, demo) => {
    return demoRepository.create(demo);
  });

  ipcMain.handle("demo:update", (_, { id, demo }) => {
    return demoRepository.update(id, demo);
  });

  ipcMain.handle("demo:delete", (_, id) => {
    return demoRepository.deleteById(id);
  });
}

module.exports = { registerDemoIPC };
