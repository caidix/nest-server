import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 用户权限对应的关系
 * @param {number} System 用户拥有的系统权限
 * @param {number} Menu 用户拥有的系统里的菜单或是权限点的权限
 */
export enum RoleAuthType {
  System = 1,
  Menu = 2,
}

/** 应用 - 角色 - 权限点的对应关系
 * type为menu时 存有menuId
 */
@Entity()
export class RoleAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '角色id' })
  roleId: number;

  @Column({ length: 80, comment: '应用code', nullable: true })
  systemCode: string;

  @Column({ comment: '权限、菜单ID -- systemMenuId', nullable: true })
  menuId: number;

  @Column({ comment: '应用id' })
  systemId: number;

  @Column({ comment: '' })
  type: RoleAuthType;
}
