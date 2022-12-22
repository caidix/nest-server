import { System } from '@libs/db/entity/SystemEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatData } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { NotBrackets, Repository } from 'typeorm';
import {
  CreateSystemDto,
  DeleteSystemDto,
  QuerySystemDto,
  QuerySystemListDto,
} from './dto/SystemDto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
  ) {}

  /** 创建应用 */
  public async createSystem(system: any, user: User) {
    try {
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .insert()
        .into(System)
        .values([
          {
            ...system,
            ...getFormatData('create', user),
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

  /** 判断是否存在应用 */
  public async validSystem(
    query: { name?: string; code?: string },
    validCode = false, // 是否需要额外判断应用重复
  ) {
    try {
      const { code } = query;
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .where('s.code=:code AND s.isDelete=:isDelete', {
          code,
          isDelete: 0,
        })
        .getOne();

      if (!validCode) {
        return Boolean(res && res.id) ? '' : '应用code不存在';
      }
      if (res && res.code === code) {
        return '应用code已重复';
      }
      return '';
    } catch (error) {
      throw new ApiException('查询应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 获取单个应用 */
  public async getSystemDetail(systemDto: QuerySystemDto) {
    try {
      const queryConditionList = [];
      Object.keys(systemDto).map((key) => {
        queryConditionList.push(`s.${key}=:${key}`);
      });
      const queryCondition = queryConditionList.join(' AND ');
      return await this.systemRepository
        .createQueryBuilder('s')
        .where(queryCondition, systemDto)
        .getOne();
    } catch (error) {
      throw new ApiException('查询应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 更新单个应用 */
  public async updateSystem(system: any, user: User) {
    try {
      return await this.systemRepository
        .createQueryBuilder()
        .update(System)
        .set({ ...system, ...getFormatData('update', user) })
        .where('id=:id', { id: system.id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '应用更新失败:' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 获取应用列表 */
  public async getSystemList(query: QuerySystemListDto, user) {
    try {
      const { search, organization, pageSize = 10, current = 1 } = query;
      const queryConditionList = ['s.isDelete = :isDelete'];
      if (organization) {
        queryConditionList.push('s.organization=:organization');
      }
      if (search) {
        queryConditionList.push('s.name LIKE :name OR s.code = :code');
      }
      /** 用户没有列表权限 */
      if (user) {
        if (!user.roles || !user.roles.length) {
          return { list: [], total: 0, pageSize, current };
        }
        queryConditionList.push('s.organization in (:...roles)');
      }
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .where(queryConditionList.join(' AND '), {
          name: `%${search}%`,
          organization,
          isDelete: 0,
          code: search,
          roles: user.roles,
        })
        // 非关联型联查方法
        // .leftJoinAndMapOne(
        //   's.organization',
        //   Organization,
        //   'photo',
        //   's.organization=photo.code',
        // )
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      return { list: res[0], total: res[1], pageSize, current };
    } catch (error) {
      console.log({ error });
      throw new ApiException('查询应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  public async getAllSystemList(user) {
    try {
      /** 用户没有列表权限 */
      if (user) {
        if (!user.roles || !user.roles.length) {
          return { list: [] };
        }
      }
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .where('s.isDelete = :isDelete AND s.organization in (:...roles)', {
          roles: user.roles,
          isDelete: 0,
        })
        .getMany();
      return {
        list: res,
      };
    } catch (error) {
      throw new ApiException('获取应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  public async deleteSystem(data: DeleteSystemDto, user: User) {
    try {
      return await this.systemRepository
        .createQueryBuilder()
        .update(System)
        .set({ isDelete: 1, ...getFormatData('delete', user) })
        .whereInIds([data.id])
        .execute();
    } catch (e) {
      throw new ApiException('删除应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }
}
