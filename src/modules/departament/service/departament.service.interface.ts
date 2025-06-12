import type { CreateDepartamentDto, UpdateDepartamentDto, DepartamentModel } from '../type/departament.types';

export type IDepartamentService = {
  createDepartament(data: CreateDepartamentDto): Promise<DepartamentModel>;
  getDepartaments(): Promise<DepartamentModel[]>;
  getDepartamentById(id: string): Promise<DepartamentModel | undefined>;
  updateDepartament(id: string, data: UpdateDepartamentDto): Promise<DepartamentModel | undefined>;
  deleteDepartament(id: string): Promise<DepartamentModel | undefined>;
}; 