const path = require("path");

const isDev = process.env.NODE_ENV === "development";

const CONFIG = {
  isDev,
  window: {
    main: {
      width: 1200,
      height: 800,
      frame: false,
      show: false,
      titleBarStyle: "hidden",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        preload: path.join(__dirname, "preload.cjs"),
      },
    },
    splash: {
      width: 400,
      height: 300,
      frame: false,
      alwaysOnTop: true,
      transparent: true,
    },
  },
  urls: {
    dev: "http://localhost:3000",
    prod: path.join(__dirname, "../dist/index.html"),
  },
  timeouts: {
    splash: 5000,
  },
};

module.exports = CONFIG;
