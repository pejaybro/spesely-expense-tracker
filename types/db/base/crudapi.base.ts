interface GetAllAPI<T> {
  getAll: () => Promise<T[]>;
}

interface GetByIdAPI<T> {
  getById: (id: number) => Promise<T | null>;
}

interface CreateAPI<TInput, TOutput = TInput> {
  create: (data: TInput) => Promise<TOutput>;
}

interface UpdateAPI<TInput, TOutput = TInput> {
  update: (id: number, data: TInput) => Promise<TOutput>;
}

interface DeleteAPI {
  deleteById: (id: number) => Promise<boolean>;
}

export type { GetAllAPI, GetByIdAPI, CreateAPI, UpdateAPI, DeleteAPI };
