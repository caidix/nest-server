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

/** 用户组角色管理 */
@Entity()
export class Role extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, comment: '角色名称' })
  name: string;

  @Column('text', { nullable: true, comment: '描述' })
  desc: string;

  @Column({ default: '', comment: '角色编码' })
  code: string;

  // 所属用户组
  @Column({ nullable: false, comment: '所属用户组' })
  organization: string;
}
