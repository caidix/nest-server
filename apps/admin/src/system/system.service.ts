import { System } from '@libs/db/entity/SystemEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { Repository } from 'typeorm';
import { QuerySystemDto } from './dto/QuerySystemDto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
  ) {}

  /** 创建应用 */
  public async createSystem(system: any) {
    try {
      const res = await this.systemRepository
        .createQueryBuilder('s')
        .insert()
        .into(System)
        .values([system])
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
      const { name, organization, size = 10, page = 1 } = query;
      const queryConditionList = [];
      if (organization) {
        queryConditionList.push('s.organization=:organization');
      }
      if (name) {
        queryConditionList.push('s.name=:name');
      }
      const res = this.systemRepository
        .createQueryBuilder('s')
        .where(queryConditionList.join('AND'), {
          name,
          organization,
        })
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
      return { list: res[0], total: res[1], size, page };
    } catch (error) {
      throw new ApiException('查询应用失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }
}
