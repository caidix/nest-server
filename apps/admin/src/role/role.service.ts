import { Role } from '@libs/db/entity/RoleEntity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formatDate } from 'utils/dataTime';
import { CreateRoleDto } from './dto/CreateRoleDto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  public async creatRole(role: CreateRoleDto) {
    try {
      const newRole = new Role();
      newRole.name = role.name;
      newRole.desc = role.desc;
      newRole.code = role.code;
      newRole.crateTime = formatDate();
      newRole.updateTime = formatDate();
      return await this.roleRepository.save(newRole);
    } catch (e) {
      throw new HttpException('添加失败', 200);
    }
  }

  // 确认是否已存在role
  public async checkName(query: string) {
    try {
      return await this.roleRepository
        .createQueryBuilder('r')
        .where('r.name = :name', { name: query })
        .getOne();
    } catch (e) {
      throw new HttpException('角色已经存在', 200);
    }
  }
}
