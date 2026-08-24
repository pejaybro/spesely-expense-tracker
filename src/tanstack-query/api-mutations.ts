import { DemoMutations } from "./modules/demo";
import { CategoryMutations } from "./modules/category";
import { TransactionMutations } from "./modules/transaction";

export const apiMutations = {
  demo: DemoMutations,
  category: CategoryMutations,
  transaction: TransactionMutations,
};

export * from "./modules/demo";
export * from "./modules/category";
export * from "./modules/transaction";
