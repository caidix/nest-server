import { Organization } from '@libs/db/entity/OrganizationEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatTime } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  /** 创建用户组 */
  public async createOrganization(organization: any) {
    try {
      const res = await this.organizationRepository
        .createQueryBuilder('o')
        .insert()
        .into(Organization)
        .values([
          {
            ...organization,
            ...getFormatTime('create'),
          },
        ])
        .execute();
      return res;
    } catch (error) {
      throw new ApiException(
        '创建应用失败' + error,
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
  public async getOrganizationList(query: any) {
    try {
      const { name, size = 10, page = 1 } = query;
      const queryConditionList = ['o.isDelete = :isDelete'];
      if (name) {
        queryConditionList.push('o.name LIKE :name');
      }
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.organizationRepository
        .createQueryBuilder('o')
        .where(queryCondition, {
          name: `%${name}%`,
          isDelete: 0,
        })
        .orderBy('o.name', 'ASC')
        .addOrderBy('o.createTime')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
      return { list: res[0], total: res[1], size, page };
    } catch (e) {
      console.log({ e });
      throw new ApiException('查询用户组失败', 400, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 更新单个用户组 */
  public async updateOrganization(organization: any) {
    try {
      console.log(getFormatTime('update'));
      return await this.organizationRepository
        .createQueryBuilder()
        .update(Organization)
        .set({ ...organization, ...getFormatTime('update') })
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
}
