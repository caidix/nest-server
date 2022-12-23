import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './Common';

/**
 * 用户组织管理
 * 组织为了有一个组的映射的概念
 * 只有组内的管理员才能够拥有管理角色、配置应用、查看日志等功能
 * 用户与组织关联，组织下又关联角色， 当用户离开该组织时， 用户在该组织下的角色会被同步移除
 */
@Entity()
export class Organization extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, default: '' })
  name: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ default: '', nullable: true })
  desc: string;

  @Column({ default: '', nullable: true })
  code: string;

  @Column({ default: 0, nullable: true, comment: '权重排序，默认为0' })
  sort: number;
}
