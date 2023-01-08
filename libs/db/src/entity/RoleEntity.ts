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

/** 角色管理 */
@Entity()
export class Role extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, comment: '角色名称' })
  name: string;

  @Column('text', { nullable: true, comment: '描述' })
  desc: string;

  @Column({ comment: '所属分组ID' })
  roleGroupId: number;
}
