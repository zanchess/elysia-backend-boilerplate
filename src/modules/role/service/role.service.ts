import type { IRoleService } from './role.service.interface';
import type { IRoleRepository } from '../repository/role.repository.interface';
import type { CreateRoleDto, UpdateRoleDto } from '../type/role.types';
import { injectable, inject } from 'tsyringe';

@injectable()
export class RoleService implements IRoleService {
  constructor(@inject('RoleRepository') private roleRepository: IRoleRepository) {}

  async createRole(data: CreateRoleDto) {
    return this.roleRepository.create(data);
  }

  async getRoles() {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: string) {
    return this.roleRepository.findById(id);
  }

  async updateRole(id: string, data: UpdateRoleDto) {
    return this.roleRepository.update(id, data);
  }

  async deleteRole(id: string) {
    return this.roleRepository.delete(id);
  }
}
