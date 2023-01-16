import { Role } from '@libs/db/entity/RoleEntity';
import { RoleGroup } from '@libs/db/entity/RoleGroupEntity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Not, Repository } from 'typeorm';
import {
  CreateRoleDto,
  CreateRoleGroupDto,
  DeleteRoleGroupDto,
  SearchRoleAuthDto,
  SearchRoleDto,
  UpdateRoleDto,
  UpdateRoleGroupDto,
} from './role.dto';
import { getFormatData } from 'libs/common/utils';
import { User } from '@libs/db/entity/UserEntity';
import { ApiException } from 'libs/common/exception/ApiException';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { RoleAuth, RoleAuthType } from '@libs/db/entity/RoleAuthEntity';
import { System } from '@libs/db/entity/SystemEntity';
import { difference, filter, includes, isEmpty, map } from 'lodash';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleGroup)
    private readonly roleGroupRepository: Repository<RoleGroup>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleAuth)
    private readonly roleAuthRepository: Repository<RoleAuth>,
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject('ROOT_ROLE_ID') private roleRootId: number,
  ) {}

  /**
   * 创建角色分组
   * @param createRoleGroupDto
   * @param user
   * @returns
   */
  public async createRoleGroup(
    createRoleGroupDto: CreateRoleGroupDto,
    user: User,
  ) {
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

  public async updateRoleGroup(
    updateRoleGroupDto: UpdateRoleGroupDto,
    user: User,
  ) {
    try {
      return await this.roleGroupRepository
        .createQueryBuilder()
        .update(RoleGroup)
        .set({
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
    const res = await this.queryRoleGroupChilds(id);
    if (res) {
      console.log(res);
    }
    try {
      return await this.roleGroupRepository
        .createQueryBuilder()
        .delete()
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
        list: result,
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
        where: { roleGroupId: id },
      });
      return res;
    } catch (error) {
      throw new ApiException(
        '查找角色失败queryRoleGroupChilds:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  public async createRole(createRoleDto: CreateRoleDto, user) {
    try {
      const res = await this.roleRepository
        .createQueryBuilder('r')
        .insert()
        .into(Role)
        .values([
          {
            name: createRoleDto.name,
            desc: createRoleDto.desc,
            roleGroupId: createRoleDto.roleGroupId,
            ...getFormatData('create', user),
          },
        ])
        .execute();
      return res;
    } catch (error) {
      throw new ApiException(
        '创建角色失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  public async updateRole(updateRoleDto: UpdateRoleDto, user: User) {
    try {
      return await this.roleRepository
        .createQueryBuilder()
        .update(Role)
        .set({
          name: updateRoleDto.name,
          desc: updateRoleDto.desc,
          ...getFormatData('update', user),
        })
        .where('id=:id', { id: updateRoleDto.id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '更新角色失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /**
   * 分页加载角色信息
   */
  public async roleList(params: Partial<SearchRoleDto>, needGroup = false) {
    try {
      const { name = '', roleGroupId, current, pageSize } = params;
      let request = this.roleRepository
        .createQueryBuilder('r')
        .where(
          'r.id <> :id AND r.name LIKE :name AND r.roleGroupId = :roleGroupId',
          {
            id: this.roleRootId,
            name: `%${name}%`,
            roleGroupId: roleGroupId,
          },
        );

      if (needGroup) {
        request = request.leftJoinAndMapOne(
          'r.group',
          RoleGroup,
          'rg',
          'r.roleGroupId = rg.id',
        );
      }
      const res = await request
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      return { list: res[0], total: res[1], pageSize, current };
    } catch (error) {
      console.log({ error });
      throw new ApiException('查询角色列表失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  public async getAllRoles(params: Partial<SearchRoleDto>) {
    try {
      const { name = '', roleGroupId } = params;
      const queryConditionList = ['r.id <> :id'];
      if (name) {
        queryConditionList.push('r.name LIKE :name');
      }
      if (roleGroupId) {
        queryConditionList.push('r.roleGroupId = :roleGroupId');
      }
      const res = await this.roleRepository
        .createQueryBuilder('r')
        .where(queryConditionList.join(' AND '), {
          id: this.roleRootId,
          name: `%${name}%`,
          roleGroupId: roleGroupId,
        })
        .leftJoinAndMapOne('r.group', RoleGroup, 'rg', 'r.roleGroupId = rg.id')
        .getManyAndCount();

      return { list: res[0], total: res[1] };
    } catch (error) {
      throw new ApiException(
        '获取所有角色列表失败',
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  public async hasRoleGroup(id: number) {
    try {
      const res = await this.roleGroupRepository.findOne({ id });
      return !!res;
    } catch (error) {
      throw new ApiException(
        'hasRoleGroup - error:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  public async getRoleDetail(params: Partial<UpdateRoleDto>) {
    try {
      const { id, name, roleGroupId } = params;
      const queryConditionList = [];
      if (id) {
        queryConditionList.push('r.id = :id');
      }
      if (name) {
        queryConditionList.push('r.name = :name');
      }
      if (roleGroupId) {
        queryConditionList.push('r.roleGroupId = :roleGroupId');
      }
      const res = await this.roleRepository
        .createQueryBuilder('r')
        .where(queryConditionList.join(' AND '), {
          name,
          id,
          roleGroupId,
        })
        .getOne();
      return res;
    } catch (error) {
      throw new ApiException(
        'getRoleDetail - error',
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 权限分配 */
  /** 获取该角色授权了的应用 */
  public async getSystemRoleAuth(roleId, type = RoleAuthType.System) {
    try {
      const res = await this.roleAuthRepository
        .createQueryBuilder('ra')
        .where('ra.roleId = :roleId AND  ra.type = :type', {
          roleId,
          type,
        })
        .innerJoinAndMapOne('ra.system', System, 'sys', 'sys.id = ra.systemId')
        .getMany();
      return res.map((ra: RoleAuth & { system?: System }) => {
        const systemName = ra?.system.name || '';
        delete ra.system;
        return {
          ...ra,
          systemName,
        };
      });
    } catch (error) {}
  }

  /**
   * 获取角色授权的应用 -- 及应用详情信息
   * @param {SearchRoleAuthDto} dto
   */
  public async getRoleAuthBySystem(dto: SearchRoleAuthDto) {
    try {
      const { roleId, systemId, type = RoleAuthType.System } = dto;
      const res = await this.roleAuthRepository
        .createQueryBuilder('ra')
        .where(
          'ra.roleId = :roleId AND ra.systemId = :systemId AND ra.type = :type',
          {
            roleId,
            systemId,
            type,
          },
        )
        .innerJoinAndMapOne('ra.system', System, 'sys', 'sys.id = ra.systemId')
        .getMany();
      return res;
    } catch (error) {}
  }

  /**
   * 变更/添加 角色授权的应用
   * @param dto
   */
  public async updateRoleAuthBySystem(dto: any) {
    try {
      const { roleId, systemIds = [], type = RoleAuthType.System } = dto;
      const roleRows = await this.roleAuthRepository.find({
        roleId,
        type,
      });
      const originSystemIds = roleRows.map((e) => e.systemId);
      const insertSystemRowIds = difference(systemIds, originSystemIds);
      const deleteSystemRowIds = difference(originSystemIds, systemIds);
      await this.entityManager.transaction(async (manager) => {
        // 菜单
        if (insertSystemRowIds.length > 0) {
          // 有条目更新
          const insertRows = insertSystemRowIds.map((e) => {
            return {
              roleId,
              systemId: e,
              type,
            };
          });
          await manager.insert(RoleAuth, insertRows);
        }
        if (deleteSystemRowIds.length > 0) {
          // 有条目需要删除
          const realDeleteRowIds = filter(roleRows, (e) => {
            return includes(deleteSystemRowIds, e.systemId);
          }).map((e) => {
            return e.id;
          });
          await manager.delete(RoleAuth, realDeleteRowIds);
        }
      });
      // const insertRoles = systemIds.map((e) => {
      //   return {
      //     roleId,
      //     systemId: e,
      //     type,
      //   };
      // });
      // // 重新分配角色
      // await manager.insert(UserRole, insertRoles);
    } catch (error) {
      throw new ApiException(
        '用户角色关系分配失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }
}
