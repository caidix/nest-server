import { System } from '@libs/db/entity/SystemEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatTime } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { Repository } from 'typeorm';
import {
  CreateSystemDto,
  DeleteSystemDto,
  QuerySystemDto,
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
      const userId = user.id;
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .insert()
        .into(System)
        .values([
          {
            ...system,
            creator: userId,
            operator: userId,
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

  /** 判断是否存在应用 */
  public async validSystem(query: { name?: string; code?: string }) {
    try {
      const { code } = query;
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .where('s.code=:code AND s.isDelete=:isDelete', {
          code,
          isDelete: 0,
        })
        .getOne();
      console.log({ res });
      if (res && res.code === code) {
        return '应用code已重复';
      }
      return '';
    } catch (error) {
      throw new ApiException('查询应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 获取单个应用 */
  public async getSystemByName(name: string) {
    try {
      return await this.systemRepository
        .createQueryBuilder('s')
        .where('s.name=:name', { name })
        .getOne();
    } catch (error) {
      throw new ApiException('查询应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 更新单个应用 */
  public async updateSystem(system: any) {
    try {
      return await this.systemRepository
        .createQueryBuilder()
        .update(System)
        .set({ ...system })
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
  public async getSystemList(query: QuerySystemDto) {
    try {
      const { search, organization, size = 10, page = 1 } = query;
      const queryConditionList = ['s.isDelete = :isDelete'];
      if (organization) {
        queryConditionList.push('o.id=:organization');
      }
      if (search) {
        queryConditionList.push('s.name LIKE :name OR s.code = :code');
      }
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.organization', 'o')
        .where(queryConditionList.join(' AND '), {
          name: `%${search}%`,
          organization,
          isDelete: 0,
          code: search,
        })
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
      console.log({ res });
      return { list: res[0], total: res[1], size, page };
    } catch (error) {
      console.log({ error });
      throw new ApiException('查询应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  public async deleteSystem(data: DeleteSystemDto) {
    try {
      return await this.systemRepository
        .createQueryBuilder()
        .update(System)
        .set({ isDelete: 1, ...getFormatTime('delete') })
        .whereInIds([data.id])
        .execute();
    } catch (e) {
      throw new ApiException('删除应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }
}
