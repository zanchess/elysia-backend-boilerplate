import type { IDepartamentService } from './departament.service.interface';
import type { IDepartamentRepository } from '../repository/departament.repository.interface';
import type { CreateDepartamentDto, UpdateDepartamentDto, DepartamentModel } from '../type/departament.types';
import { injectable, inject } from 'tsyringe';

@injectable()
export class DepartamentService implements IDepartamentService {
  constructor(@inject('DepartamentRepository') private departamentRepository: IDepartamentRepository) {}

  async createDepartament(data: CreateDepartamentDto): Promise<DepartamentModel> {
    return this.departamentRepository.create(data);
  }

  async getDepartaments(): Promise<DepartamentModel[]> {
    return this.departamentRepository.findAll();
  }

  async getDepartamentById(id: string): Promise<DepartamentModel | undefined> {
    return this.departamentRepository.findById(id);
  }

  async updateDepartament(id: string, data: UpdateDepartamentDto): Promise<DepartamentModel | undefined> {
    return this.departamentRepository.update(id, data);
  }

  async deleteDepartament(id: string): Promise<DepartamentModel | undefined> {
    return this.departamentRepository.delete(id);
  }
} 