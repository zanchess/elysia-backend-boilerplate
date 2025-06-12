import type { CreateRoleDto, UpdateRoleDto } from '../type/role.types';

export type IRoleService = {
  createRole(data: CreateRoleDto): Promise<any>;
  getRoles(): Promise<any[]>;
  getRoleById(id: string): Promise<any>;
  updateRole(id: string, data: UpdateRoleDto): Promise<any>;
  deleteRole(id: string): Promise<any>;
}; 