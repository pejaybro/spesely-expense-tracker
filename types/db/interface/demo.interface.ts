import type {
  GetAllAPI,
  GetByIdAPI,
  CreateAPI,
  UpdateAPI,
  DeleteAPI,
} from "../base/crudapi.base";

export interface Demo {
  id: number;
  demo: string;
  created_at: string;
  updated_at: string;
}

export interface DemoCreateData {
  demo: string;
}

export interface DemoUpdateData {
  demo: string;
}
export type DemoAPI = GetAllAPI<Demo> &
  GetByIdAPI<Demo> &
  CreateAPI<DemoCreateData, Demo> &
  UpdateAPI<DemoUpdateData, Demo> &
  DeleteAPI;
