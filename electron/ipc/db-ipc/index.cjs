const { registerDemoIPC } = require("./demo.ipc.cjs");

function registerIPC_DB() {
  registerDemoIPC();
}

module.exports = registerIPC_DB;
