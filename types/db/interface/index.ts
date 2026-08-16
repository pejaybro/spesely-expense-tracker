import { type DemoAPI } from "./demo.interface";
import {
  type PrimaryCategoryAPI,
  type SecondaryCategoryAPI,
  type TransactionAPI,
} from "./spesely.interface";

export interface APIs {
  demo: DemoAPI;
  primaryCategory: PrimaryCategoryAPI;
  secondaryCategory: SecondaryCategoryAPI;
  transaction: TransactionAPI;
}
