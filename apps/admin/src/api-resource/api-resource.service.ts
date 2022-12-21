import { ApiResource, IApiTypeEnum } from '@libs/db/entity/ApiResourceEntity';
import { System } from '@libs/db/entity/SystemEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatData } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import {
  CreateApiResourceDto,
  UpdateApiResourceDto,
  QueryApiResourceDto,
  DeleteApiResourceDto,
  DeleteApiCategoryDto,
} from './dto/ApiResourceDto';

@Injectable()
export class ApiResourceService {
  constructor(
    @InjectRepository(ApiResource)
    private readonly apiResourceRepository: Repository<ApiResource>,

    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
  ) {}

  /** 创建api资源 */
  public async createApiResource(
    params: CreateApiResourceDto,
    user: User,
  ): Promise<InsertResult> {
    try {
      return await this.apiResourceRepository
        .createQueryBuilder('r')
        .insert()
        .into(ApiResource)
        .values([
          {
            name: params.name,
            code: params.code,
            type: params.type,
            isDelete: 0,
            categoryCode: params.categoryCode,
            value: params.value ? params.value : '',
            desc: params.desc,
            ...getFormatData('create', user),
          },
        ])
        .execute();
    } catch (error) {
      throw new ApiException(
        '创建api资源失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /**
   * 更新api资源
   */
  public async updateApiResource(
    params: UpdateApiResourceDto,
    user: User,
  ): Promise<UpdateResult> {
    try {
      return await this.apiResourceRepository
        .createQueryBuilder('r')
        .update(ApiResource)
        .set({
          name: params.name,
          type: params.type,
          isDelete: 0,
          categoryCode: params.categoryCode,
          value: params.value ? params.value : '',
          desc: params.desc,
          ...getFormatData('update', user),
        })
        .where('id = :id', { id: params.id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '更新api资源失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /**
   * 获取api列表
   * @param params
   */
  public async getApiList(
    params: QueryApiResourceDto,
  ): Promise<[ApiResource[], number]> {
    try {
      const queryConditionList = ['r.isDelete = :isDelete', 'r.type = :type'];
      if (params.name) {
        queryConditionList.push('r.name LIKE :name');
      }
      if (params.code) {
        queryConditionList.push('r.code LIKE :code');
      }
      if (params.systemCode) {
        queryConditionList.push('r.systemCode = :systemCode');
      }
      const queryCondition = queryConditionList.join(' AND ');
      return await this.apiResourceRepository
        .createQueryBuilder('r')
        .where(queryCondition, {
          name: params.name,
          code: params.code,
          systemCode: params.systemCode,
          isDelete: 0,
          type: IApiTypeEnum.ApiResource,
        })
        .orderBy('r.system', 'ASC')
        .skip((params.page - 1) * params.pageSize)
        .take(params.pageSize)
        .getManyAndCount();
    } catch (error) {
      throw new ApiException(
        '获取api资源列表失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /**
   * 获取分类列表
   * code: 应用code
   */
  public async getCategoryList(code: string): Promise<[ApiResource[], number]> {
    try {
      const queryConditionList = ['r.isDelete = :isDelete', 'r.type = :type'];
      if (code) {
        queryConditionList.push('r.systemCode = :systemCode');
      }
      const queryCondition = queryConditionList.join(' AND ');
      return await this.apiResourceRepository
        .createQueryBuilder('r')
        .where(queryCondition, {
          type: IApiTypeEnum.Category,
          isDelete: 0,
          systemCode: code,
        })
        .orderBy('r.system', 'ASC')
        .getManyAndCount();
    } catch (error) {
      throw new ApiException(
        '查询api分类列表失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 删除资源 */
  public async deleteApiResource(
    params: DeleteApiResourceDto,
  ): Promise<DeleteResult> {
    try {
      if (params.type === IApiTypeEnum.ApiResource) {
        return await this.apiResourceRepository
          .createQueryBuilder('r')
          .delete()
          .from(ApiResource)
          .where({ systemCode: params.systemCode })
          .whereInIds(params.ids.map((item) => Number(item)))
          .execute();
      }
      return await this.apiResourceRepository
        .createQueryBuilder('r')
        .delete()
        .from(ApiResource)
        .where({ categoryCode: params.categoryCode })
        .whereInIds(params.ids.map((item) => Number(item)))
        .execute();
    } catch (error) {
      throw new ApiException(
        '删除失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 注意分类模块的编码code与api接口共通，不能重复使用 */
  public async uniqueApiCode(
    apicode: string,
    systemCode: string,
  ): Promise<boolean> {
    try {
      const result = await this.apiResourceRepository.findOne({
        code: apicode,
        systemCode: systemCode,
      });
      return !!!result;
    } catch (error) {
      throw new ApiException(
        '查询唯一性失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 注意分类模块的编码code与api接口共通，不能重复使用 */
  public async uniqueCategoryCode(apicode: string): Promise<boolean> {
    try {
      const result = await this.apiResourceRepository.findOne({
        code: apicode,
      });
      return !!!result;
    } catch (error) {
      throw new ApiException(
        '查询唯一性失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  //   public async deleteApiCategory(
  //     params: DeleteApiCategoryDto,
  //   ): Promise<DeleteResult> {
  //     try {
  //       const cate = await this.apiResourceRepository.findOne({ id: params.id });

  //       await this.apiResourceRepository
  //         .createQueryBuilder('r')
  //         .delete()
  //         .from(ApiResource)
  //         .where({
  //           systemCode: params.systemCode,
  //           categoryCode: cate.code,
  //         })
  //         .whereInIds(params.ids.map((item) => Number(item)))
  //         .execute();
  //     } catch (error) {
  //       throw new ApiException(
  //         '删除失败:' + error.response || error.errorMessage,
  //         200,
  //         ApiCodeEnum.PUBLIC_ERROR,
  //       );
  //     }
  //   }
}
