import { electronClient } from "../../client";
import type {
  DemoCreateData,
  DemoUpdateData,
} from "@/types/db/interface/demo.interface";

export const DemoService = {
  getAll: () => electronClient.demo.getAll(),
  getById: (id: number) => electronClient.demo.getById(id),
  create: (data: DemoCreateData) => electronClient.demo.create(data),
  update: (id: number, data: DemoUpdateData) =>
    electronClient.demo.update(id, data),
  deleteById: (id: number) => electronClient.demo.deleteById(id),
};
