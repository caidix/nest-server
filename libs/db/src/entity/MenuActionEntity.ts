import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** 菜单功能表 - 与菜单 1-1关联，菜单移除时同时移除功能数据 */
@Entity()
export class MenuAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '权限点名称', length: 100 })
  name: string;

  @Column({ comment: '权限点描述', length: 500, nullable: true, default: '' })
  desc: string;

  @Column({
    comment: '权限点编码',
    length: 100,
    unique: true,
  })
  code: string;

  @Column({ comment: '排序，从1递增', default: 1 })
  sort: number;

  @Column({ comment: '所属菜单id' })
  menuId: number;

  @Column({ default: '', nullable: true })
  crateTime: string;

  @Column({ default: '', nullable: true })
  updateTime: string;
}
