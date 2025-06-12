import type { CreateDepartamentDto, UpdateDepartamentDto, DepartamentModel } from '../type/departament.types';

export type IDepartamentRepository = {
  create(data: CreateDepartamentDto): Promise<DepartamentModel>;
  findAll(): Promise<DepartamentModel[]>;
  findById(id: string): Promise<DepartamentModel | undefined>;
  update(id: string, data: UpdateDepartamentDto): Promise<DepartamentModel | undefined>;
  delete(id: string): Promise<DepartamentModel | undefined>;
}; 