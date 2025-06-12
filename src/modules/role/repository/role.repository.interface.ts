import type { CreateRoleDto, UpdateRoleDto } from '../type/role.types';

export type IRoleRepository = {
  create(data: CreateRoleDto): Promise<any>;
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  update(id: string, data: UpdateRoleDto): Promise<any>;
  delete(id: string): Promise<any>;
}; 