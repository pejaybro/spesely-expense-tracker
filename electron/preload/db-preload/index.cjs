const demoAPI = require("./demo.preload.cjs");
const primaryCategoryAPI = require("./primaryCategory.preload.cjs");
const secondaryCategoryAPI = require("./secondaryCategory.preload.cjs");
const transactionAPI = require("./transaction.preload.cjs");

module.exports = {
  demo: demoAPI,
  primaryCategory: primaryCategoryAPI,
  secondaryCategory: secondaryCategoryAPI,
  transaction: transactionAPI,
};
