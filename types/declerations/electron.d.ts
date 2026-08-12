import type { APIs } from "../db/interface";

export {};

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    } & APIs;
  }
}
