import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { System } from './SystemEntity';
import { User } from './UserEntity';

/**
 * 用户组织管理
 * 组织为了有一个组的映射的概念
 * 只有组内的管理员才能够拥有管理角色、配置应用、查看日志等功能
 * 用户与组织关联，组织下又关联角色， 当用户离开该组织时， 用户在该组织下的角色会被同步移除
 */
@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, default: '' })
  name: string;

  @Column({ default: '', nullable: true })
  desc: string;

  @Column()
  parentId: number;

  @Column({ default: '', nullable: true })
  parentName: string;

  @ManyToMany((type) => User, (user) => user.managers)
  @JoinTable()
  managers: User[];

  @ManyToMany((type) => User, (user) => user.organizations)
  @JoinTable()
  users: User[];

  @OneToMany(() => System, (org) => org.organization)
  @JoinTable()
  systems: System[];

  @Column({ default: 0 })
  isDelete: number;

  @Column({ default: '', nullable: true })
  crateTime: string;

  @Column({ default: '', nullable: true })
  updateTime: string;

  @Column({ default: '', nullable: true })
  deleteTime: string;
}
