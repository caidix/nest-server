import { Organization } from '@libs/db/entity/OrganizationEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatData } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { Brackets, NotBrackets, Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** 创建用户组 */
  public async createOrganization(organization: any, user: User) {
    try {
      console.log({ organization });

      const res = await this.organizationRepository.save({
        ...organization,
        managers: [user],
        users: [user],
        ...getFormatData('create', user),
      });
      return res;
    } catch (error) {
      throw new ApiException(
        '创建用户组失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 通过名称获取单个用户组 */
  public async getOrganizationByName(name: string) {
    try {
      return await this.organizationRepository
        .createQueryBuilder('o')
        .where('o.name=:name', { name })
        .getOne();
    } catch (error) {
      throw new ApiException('查询用户组失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 通过指定字段读取用户组 */
  public async getOrganizationByMyself(obj: unknown) {
    try {
      const queryConditionList = [];
      Object.keys(obj).map((key) => {
        queryConditionList.push(`o.${key}=:${key}`);
      });
      const queryCondition = queryConditionList.join(' AND ');
      return await this.organizationRepository
        .createQueryBuilder('o')
        .where(queryCondition, obj)
        .getOne();
    } catch (error) {
      throw new ApiException(
        '查询用户组失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 删除用户组 */
  public async deleteOrganization(ids: Array<number | string>) {
    try {
      return await this.organizationRepository
        .createQueryBuilder()
        .update(Organization)
        .set({ isDelete: 1, deleteTime: dayjs().format('YYYY-MM-DD HH:mm:ss') })
        .whereInIds(ids)
        .execute();
    } catch (e) {
      throw new ApiException('删除用户组失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 查询用户组列表 */
  public async getOrganizationList(query: any, user) {
    try {
      const { name, pageSize = 10, current = 1 } = query;
      const queryConditionList = ['o.isDelete = :isDelete'];
      if (name) {
        queryConditionList.push('o.name LIKE :name');
      }
      if (user) {
        queryConditionList.push('u.id = :id');
      }
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.organizationRepository
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.users', 'u', 'u.isDelete = :isDelete', {
          isDelete: 0,
        })
        .where(queryCondition, {
          name: `%${name}%`,
          isDelete: 0,
          id: user.id,
        })
        .orderBy('o.name', 'ASC')
        .addOrderBy('o.createTime')
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      return { list: res[0], total: res[1], pageSize, current };
    } catch (e) {
      console.log({ e });
      throw new ApiException('查询用户组失败', 400, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 更新单个用户组 */
  public async updateOrganization(organization: any) {
    try {
      return await this.organizationRepository
        .createQueryBuilder()
        .update(Organization)
        .set({ ...organization, ...getFormatData('update') })
        .where('id=:id', { id: organization.id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '用户组更新失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 为组织关联用户 */
  public async relationOrgByUser(addUserDto) {
    try {
      const { id, userIds = [] } = addUserDto;
      const organization = await this.organizationRepository.findOne(id, {
        relations: ['users'],
      });
      if (!organization) {
        throw new ApiException(
          '请先添加组织',
          200,
          ApiCodeEnum.ORIZATION_CREATED_FILED,
        );
      }
      await this.organizationRepository
        .createQueryBuilder()
        .relation(Organization, 'users')
        .of(id)
        .addAndRemove(
          userIds,
          organization.users ? organization.users.map((u) => u.id) : [],
        );
      return await this.organizationRepository.findOne(id, {
        relations: ['users'],
      });
    } catch (error) {
      throw new ApiException(
        '关联用户组失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 获取用户关联用户组列表 */
  public async getOrganizationUserList(data: any) {
    try {
      const { id } = data;
      const queryConditionList = ['o.isDelete = :isDelete'];
      if (id) {
        queryConditionList.push('o.id=:id');
      }
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.organizationRepository
        .createQueryBuilder('o')
        .where(queryCondition, { id, isDelete: 0 })
        .leftJoinAndSelect('o.users', 'u')
        .orderBy('u.name', 'ASC')
        .getOne();

      const users = (res.users || []).map((user) => {
        return {
          name: user.name,
          id: user.id,
        };
      });
      return { list: users, total: users.length };
    } catch (error) {
      throw new ApiException(
        '用户列表获取失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 根据组织id获取用户非关联用户组列表 */
  public async getUnOrganizationUserList(data: any) {
    try {
      const { id, pageSize = 10, current = 1 } = data;
      const res = await this.userRepository
        .createQueryBuilder('u')
        .select(['u.id', 'u.name'])
        .leftJoinAndSelect('u.organizations', 'o', 'o.isDelete = :isDelete', {
          isDelete: false,
        })
        .where(
          new NotBrackets((qb) => qb.where('o.id IN (:...ids)', { ids: [id] })),
        )
        .orderBy('u.id', 'ASC')
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      return { list: res[0], total: res[1], pageSize, current };
    } catch (error) {
      throw new ApiException(
        '用户列表获取失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 获取用户所关联的用户组 */
  public async getUserOrganizationList(user: User) {
    try {
      const res = await this.userRepository
        .createQueryBuilder('u')
        .where('u.id=:id', { id: user.id })
        .leftJoinAndSelect('u.organizations', 'o')
        .where('o.isDelete = :isDelete', {
          isDelete: 0,
        })
        .getOne();

      const orgs = res?.organizations || [];
      return orgs;
    } catch (error) {
      throw new ApiException(
        '用户组获取失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }
}
