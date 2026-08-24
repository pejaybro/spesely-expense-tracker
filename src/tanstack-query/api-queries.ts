import { DemoQueries } from "./modules/demo";
import { CategoryQueries } from "./modules/category";
import { TransactionQueries } from "./modules/transaction";

export const apiQueries = {
  demo: DemoQueries,
  category: CategoryQueries,
  transaction: TransactionQueries,
};

export * from "./modules/demo";
export * from "./modules/category";
export * from "./modules/transaction";
