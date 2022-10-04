import { MenuAction } from '@libs/db/entity/MenuActionEntity';
import { System } from '@libs/db/entity/SystemEntity';
import { SystemMenu } from '@libs/db/entity/SystemMenuEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { getFormatTime, getIds } from 'libs/common/utils';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { findTarget, listToTree } from 'libs/common/utils/tree';
import { Repository } from 'typeorm';
import {
  CreateSystemMenuDto,
  HandleMenu,
  IMenuOperationEnum,
  OperationMenu,
  UpdateSystemMenu,
} from './dto/SystemMenuDto';

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
      console.log({ systemMenuDto });

      if (systemMenuDto.parentId) {
        const hasParentMenu = await this.hasParentMenu(systemMenuDto.parentId);
        if (!hasParentMenu) {
          throw new ApiException(
            '父级菜单不存在',
            200,
            ApiCodeEnum.PUBLIC_ERROR,
          );
        }
      }
      const childMenus = await this.getChildrens(
        systemMenuDto.parentId || null,
      );
      let lastMenu = 1;
      if (childMenus && childMenus.length) {
        const lastSort = childMenus[childMenus.length - 1].sort;
        lastMenu = lastSort + 1;
        if (childMenus.find((menu) => menu.code === systemMenuDto.code)) {
          throw new ApiException(
            '菜单编码已存在',
            200,
            ApiCodeEnum.PUBLIC_ERROR,
          );
        }
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
        '创建菜单失败:' + error.response || error.errorMessage,
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
          ...getFormatTime('update'),
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
  public async deleteSystemMenu(data: HandleMenu, user: User) {
    try {
      const { systemCode, id } = data;
      const list = await this.getSystemMenuList(systemCode, user);
      const item = findTarget<any>(
        list.list,
        (item) => item.id === id,
        (item) => item.children,
      );
      const ids = getIds([item]);
      return await this.systemMenuRepository
        .createQueryBuilder('s')
        .delete()
        .from(SystemMenu)
        .whereInIds(ids)
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
      const res = await this.systemMenuRepository
        .createQueryBuilder('s')
        .where('s.isDelete = :isDelete AND s.systemCode = :code', {
          isDelete: 0,
          code,
        })
        .orderBy('s.sort', 'ASC')
        .addOrderBy('s.id', 'ASC')
        .getManyAndCount();

      const treeData = listToTree(res[0], 'id', 'parentId', 'children');
      return { list: treeData, total: res[1] };
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
        order: { sort: 'ASC' },
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

  /** 上下移动菜单 */
  public async moveMenu(data: OperationMenu, user: User) {
    try {
      const { type, id } = data;
      const menu = await this.getSystemMenu({ id });
      if (!menu) {
        throw new ApiException('该菜单不存在', 200, ApiCodeEnum.PUBLIC_ERROR);
      }
      // 获取同级菜单
      const menus = await this.getChildrens(menu.parentId || null);
      if (!menus || menus.length <= 1) {
        return;
      }

      const currentIndex = menus.findIndex((i) => i.id === id);
      const otherIndex =
        type === IMenuOperationEnum.MoveDown
          ? currentIndex + 1
          : currentIndex - 1;
      if (otherIndex < 0 || currentIndex < 0 || currentIndex >= menus.length) {
        throw Error;
      }
      const currentMenu = menus[currentIndex];
      const otherMenu = menus[otherIndex];
      [currentMenu['sort'], otherMenu['sort']] = [
        otherMenu['sort'],
        currentMenu['sort'],
      ];
      await Promise.all([
        this.updateSystemMenu(currentMenu, user),
        this.updateSystemMenu(otherMenu, user),
      ]);
      return;
    } catch (error) {
      throw new ApiException(
        '菜单移动失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }

  /** 修改菜单状态 */
  public async changeMenuStatus(data: OperationMenu, user: User) {
    try {
      const { id, type } = data;
      return await this.systemMenuRepository
        .createQueryBuilder('s')
        .update(SystemMenu)
        .set({
          isShow: type as number,
          ...getFormatTime('update'),
          operator: user.id,
        })
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      throw new ApiException(
        '菜单状态修改失败' + error,
        200,
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
  }
}
