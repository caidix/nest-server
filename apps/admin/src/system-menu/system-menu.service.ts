import { System } from '@libs/db/entity/SystemEntity';
import { SystemMenu } from '@libs/db/entity/SystemMenuEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatTime } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { listToTree } from 'libs/common/utils/tree';
import { Repository } from 'typeorm';
import { CreateSystemMenuDto, UpdateSystemMenu } from './dto/SystemMenuDto';

@Injectable()
export class SystemMenuService {
  constructor(
    @InjectRepository(SystemMenu)
    private readonly systemMenuRepository: Repository<SystemMenu>,
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
  ) {}

  /** 创建菜单 */
  public async createSystemMenu(
    systemMenuDto: CreateSystemMenuDto,
    user: User,
  ) {
    try {
      const hasParentMenu = await this.hasParentMenu(systemMenuDto.parentId);
      if (!hasParentMenu) {
        throw new ApiException('父级菜单不存在', 200, ApiCodeEnum.PUBLIC_ERROR);
      }
      const childMenus = await this.getChildrens(systemMenuDto.parentId);
      console.log({ childMenus });
      let lastMenu = 1;
      if (childMenus && childMenus.length) {
        const lastSort = childMenus[childMenus.length - 1].sort;
        lastMenu = lastSort + 1;
      }
      const res = await this.systemMenuRepository
        .createQueryBuilder('s')
        .insert()
        .into(SystemMenu)
        .values([
          {
            ...systemMenuDto,
            ...getFormatTime('create'),
            creator: user.id,
            operator: user.id,
            sort: lastMenu,
          },
        ])
        .execute();

      return {
        childMenus,
        res,
      };
    } catch (error) {
      throw new ApiException(
        '创建菜单失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /**
   * 更新菜单
   * @param params
   */
  public async updateSystemMenu(systemMenuDto: UpdateSystemMenu, user: User) {
    try {
      return await this.systemMenuRepository
        .createQueryBuilder('s')
        .update(SystemMenu)
        .set({
          ...systemMenuDto,
          operator: user.id,
        })
        .where('id = :id', { id: systemMenuDto.id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '更新菜单失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 获取单个菜单 */
  public async getSystemMenu(systemDto: any) {
    try {
      const queryConditionList = [];
      Object.keys(systemDto).map((key) => {
        queryConditionList.push(`s.${key}=:${key}`);
      });
      const queryCondition = queryConditionList.join(' AND ');
      return await this.systemMenuRepository
        .createQueryBuilder('s')
        .where(queryCondition, systemDto)
        .getOne();
    } catch (error) {
      throw new ApiException(
        '查询单个菜单失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 删除菜单 */
  public async deleteSystemMenu(id: number) {
    try {
      return await this.systemMenuRepository
        .createQueryBuilder('s')
        .delete()
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '菜单删除失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 菜单唯一性 */
  public async hasMenuCode(code: string) {
    try {
      const res = await this.systemMenuRepository.findOne({ code });
      return !!res;
    } catch (error) {
      throw new ApiException(
        '菜单查找失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }
  /** 是否存在父级菜单 */
  public async hasParentMenu(id: number) {
    try {
      const res = await this.systemMenuRepository.findOne({ id });
      return !!res;
    } catch (error) {
      throw new ApiException(
        '父级菜单查找失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 获取菜单列表 */
  public async getSystemMenuList(code: string, user: User) {
    try {
      const queryConditionList = ['s.isDelete = :isDelete'];

      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.systemMenuRepository
        .createQueryBuilder('s')
        .where(queryCondition, {
          isDelete: 0,
        })
        .orderBy('s.sort', 'DESC')
        .addOrderBy('s.id', 'DESC')
        .getManyAndCount();

      const treeData = listToTree(res[0], 'id', 'parentId', 'children');
      return { data: treeData, count: res[1] };
    } catch (error) {
      throw new ApiException(
        '菜单查找失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  public async getChildrens(parentId: number) {
    try {
      const res = await this.systemMenuRepository.find({
        where: { parentId },
        order: { sort: 'DESC' },
      });
      return res;
    } catch (error) {
      throw new ApiException(
        '菜单查找失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }
}
