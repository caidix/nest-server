import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from './Common';

/** 角色分组管理 */
@Entity()
export class RoleGroup extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, comment: '角色分组名称' })
  name: string;

  @Column('text', { nullable: true, comment: '描述' })
  desc: string;
}
