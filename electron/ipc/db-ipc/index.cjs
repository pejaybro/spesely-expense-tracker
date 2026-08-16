const { registerDemoIPC } = require("./demo.ipc.cjs");
const { registerPrimaryCategoryIPC } = require("./primaryCategory.ipc.cjs");
const { registerSecondaryCategoryIPC } = require("./secondaryCategory.ipc.cjs");
const { registerTransactionIPC } = require("./transaction.ipc.cjs");

function registerIPC_DB() {
  registerDemoIPC();
  registerPrimaryCategoryIPC();
  registerSecondaryCategoryIPC();
  registerTransactionIPC();
}

module.exports = registerIPC_DB;
