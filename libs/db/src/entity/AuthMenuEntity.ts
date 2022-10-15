import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './Common';

/** 菜单功能表 - 与菜单 1-1关联，菜单移除时同时移除功能数据 */
@Entity()
export class AuthMenu extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '权限点名称', length: 100 })
  name: string;

  @Column({ comment: '权限点描述', length: 500, nullable: true, default: '' })
  desc: string;

  @Column({
    comment: '权限点编码',
    length: 100,
  })
  code: string;

  // @Column({ comment: '排序，从1递增', default: 1 })
  // sort: number;

  @Column({ comment: '归属应用code -- System' })
  systemCode: string;

  @Column({ comment: '所属菜单code -- SystemMenu' })
  menuCode: string;
}
