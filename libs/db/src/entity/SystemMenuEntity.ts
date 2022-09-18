import { IShowStatusEnum } from 'libs/common/types/enums';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './Common';

export enum IMenuTypeEnum {
  MENU = 'menu',
  PAGE = 'page',
}

/** 应用菜单 */
@Entity()
export class SystemMenu extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '菜单名称', default: '' })
  name: string;

  @Column({ comment: '菜单编码', default: '' })
  code: string;

  @Column({ comment: '菜单路由', default: '/' })
  url: string;

  @Column({ comment: '菜单描述', default: '', length: 500 })
  desc: string;

  @Column('enum', {
    comment: '菜单类型',
    default: IMenuTypeEnum.PAGE,
    enum: IMenuTypeEnum,
  })
  menuType: IMenuTypeEnum;

  /** 找到同级下最大的排序 + 1 */
  @Column({ comment: '菜单排序', default: 1 })
  sort: number;

  @Column('enum', {
    comment: '显示隐藏 1：显示  2：隐藏',
    default: IShowStatusEnum.HIDDEN,
    enum: IShowStatusEnum,
  })
  isShow: IShowStatusEnum;

  @Column({ comment: '归属应用id' })
  systemId: number;

  @Column({ comment: '归属父级菜单id' })
  parentId: number;
}
