import { Role } from '@libs/db/entity/RoleEntity';
import { RoleGroup } from '@libs/db/entity/RoleGroupEntity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateRoleGroupDto, DeleteRoleGroupDto, UpdateRoleGroupDto } from './role.dto';
import { getFormatData } from 'libs/common/utils';
import { User } from '@libs/db/entity/UserEntity';
import { ApiException } from 'libs/common/exception/ApiException';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleGroup)
    private readonly roleGroupRepository: Repository<RoleGroup>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject('ROOT_ROLE_ID')private roleRootId:number
  ) { }

  /**
   * 创建角色分组
   * @param createRoleGroupDto 
   * @param user 
   * @returns 
   */
  public async createRoleGroup(createRoleGroupDto: CreateRoleGroupDto, user: User) {
    try {
      const res = await this.roleGroupRepository.save({
        name: createRoleGroupDto.name,
        desc: createRoleGroupDto.desc,
        ...getFormatData('create', user),
      });
      return res;
    } catch (error) {
      throw new ApiException(
        '创建角色分组失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  public async updateRoleGroup(updateRoleGroupDto: UpdateRoleGroupDto, user: User) {
    try {
      return await this.roleGroupRepository.createQueryBuilder().update(RoleGroup).set({
        name: updateRoleGroupDto.name,
        desc: updateRoleGroupDto.desc,
        ...getFormatData('update', user),

      })
      .where('id=:id', { id: updateRoleGroupDto.id })
      .execute();
    } catch (error) {
      throw new ApiException(
        '更新角色分组失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
   }

   public async deleteRoleGroup(id: number) {
     const res = await this.queryRoleGroupChilds(id)
     if (res) {
      console.log(res)
     }
    try {
      return await this.roleGroupRepository.createQueryBuilder().delete()
      .where('id=:id', { id })
      .execute();
    } catch (error) {
      throw new ApiException(
        '删除角色分组失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
   }

   public async getAllRoleGroup() {
    try {
      const result = await this.roleGroupRepository.find({
        where: { id: Not(this.roleRootId) },
      });
      return {
        list:result
      };
    } catch (error) {
      throw new ApiException(
        '角色分组列表获取失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
   }

   public async queryRoleGroupChilds(id: number) {
    try {
      const res = await this.roleRepository.find({
        where:{roleGroupId:id}
      })
      return res
    } catch (error) {
      throw new ApiException(
        '查找角色失败queryRoleGroupChilds:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
   }
}
