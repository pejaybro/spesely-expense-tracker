import type { APIs } from "@/types/db/interface";

function getElectronAPI(): Window["electronAPI"] {
  if (!window.electronAPI) {
    throw new Error("Electron API is not available in this renderer.");
  }

  return window.electronAPI;
}

export const electronClient: APIs = {
  get demo() {
    return getElectronAPI().demo;
  },
  get primaryCategory() {
    return getElectronAPI().primaryCategory;
  },
  get secondaryCategory() {
    return getElectronAPI().secondaryCategory;
  },
  get transaction() {
    return getElectronAPI().transaction;
  },
};

