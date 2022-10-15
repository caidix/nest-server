import { AuthMenu } from '@libs/db/entity/AuthMenuEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatData } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { Repository } from 'typeorm';
import {
  AuthMenuListDto,
  CreateAuthMenuDto,
  DeleteAuthMenuDto,
  UpdateAuthMenuDto,
  ValidAuthMenuDto,
} from './dto/AuthMenuDto';

@Injectable()
export class AuthMenuService {
  constructor(
    @InjectRepository(AuthMenu)
    private readonly authMenuRepository: Repository<AuthMenu>,
  ) {}

  /** 创建权限点 */
  public async createAuthMenu(authMenuDto: CreateAuthMenuDto, user: User) {
    try {
      console.log({ authMenuDto });

      return await this.authMenuRepository
        .createQueryBuilder('a')
        .insert()
        .into(AuthMenu)
        .values([
          {
            ...authMenuDto,
            ...getFormatData('create', user),
          },
        ])
        .execute();
    } catch (error) {
      console.log({ error });
      throw new ApiException(
        '创建权限点失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 查找单个权限点 */
  public async getAuthMenu(authMenuDto: any) {
    try {
      const queryConditionList = [];
      Object.keys(authMenuDto).map((key) => {
        queryConditionList.push(`s.${key}=:${key}`);
      });
      const queryCondition = queryConditionList.join(' AND ');
      return await this.authMenuRepository
        .createQueryBuilder('s')
        .where(queryCondition, authMenuDto)
        .getOne();
    } catch (error) {
      throw new ApiException('查询权限点失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 判断是否存在权限点 */
  public async validAuthMenu(query: ValidAuthMenuDto) {
    try {
      const { name = '', code = '' } = query;
      const res = await this.authMenuRepository
        .createQueryBuilder('a')
        .where('a.name LIKE :name AND a.code=:code AND a.isDelete=:isDelete', {
          ...query,
          isDelete: 0,
          name: `%${name}%`,
        })
        .getOne();
      if (res && res.code === code) {
        return '权限点code已重复';
      }
      return '';
    } catch (error) {
      throw new ApiException('查询权限点失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 更新权限点 */
  public async updateAuthMenu(authMenuDto: UpdateAuthMenuDto, user: User) {
    try {
      return await this.authMenuRepository
        .createQueryBuilder()
        .update(AuthMenu)
        .set({ ...authMenuDto, ...getFormatData('update', user) })
        .where('id=:id', { id: authMenuDto.id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '权限点更新失败:' + error.response || error.errorMessage,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 删除权限点 */
  public async deleteAuthMenu(authMenuDto: DeleteAuthMenuDto, user: User) {
    try {
      return await this.authMenuRepository
        .createQueryBuilder()
        .update(AuthMenu)
        .set({ isDelete: 1, ...getFormatData('delete', user) })
        .where(
          'code=:code AND systemCode=:systemCode AND menuCode=:menuCode',
          authMenuDto,
        )
        .execute();
    } catch (e) {
      throw new ApiException('删除权限点失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /** 权限点列表 */
  public async getAuthMenuList(authMenuListDto: AuthMenuListDto) {
    try {
      const res = await this.authMenuRepository
        .createQueryBuilder('a')
        .where(
          'a.isDelete = :isDelete AND a.systemCode = :systemCode AND a.menuCode = :menuCode',
          {
            isDelete: 0,
            ...authMenuListDto,
          },
        )
        .orderBy('a.id', 'ASC')
        .getManyAndCount();
      return { list: res[0], total: res[1] };
    } catch (error) {
      throw new ApiException(
        '权限点列表查询失败',
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }
}
