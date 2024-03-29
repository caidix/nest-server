import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './OrganizationEntity';

export enum UserStatusEnum {
  Active = 1,
  Disable = 2,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, comment: '用户名' })
  name: string;

  @Column({ nullable: true, type: 'text', comment: '用户描述' })
  desc: string;

  @Column({
    length: 100,
    comment: '密码',
    select: false,
  })
  password: string;

  @Column({ select: true, comment: '邮箱', length: 500 })
  email: string;

  @Column({ default: '', comment: '手机号' })
  phone: string;

  @Column({ default: '', comment: '头像' })
  avatar: string;

  @Column({ nullable: true, comment: '年龄' })
  age: string;

  @Column({ nullable: true, comment: '地址' })
  address: string;

  @Column({ nullable: true, comment: '昵称' })
  nick: string;

  @Column('enum', {
    comment: '状态 1：启用  2：禁用',
    enum: UserStatusEnum,
    default: UserStatusEnum.Active,
  })
  status: UserStatusEnum;

  // 所属组织
  // @ManyToMany(() => Organization, (organization) => organization.users)
  @Column({ comment: '所属组织' })
  organization: number;

  // 组织管理员
  // @ManyToMany(() => Organization, (organization) => organization.managers)
  // managers: Organization[];

  @Column({ default: 0, comment: '是否不可用' })
  isDelete: number;

  @Column({ default: false, comment: '是否是超级管理员' })
  isSuper: boolean;

  @Column({ default: false, comment: '是否完成身份验证' })
  verification: boolean;

  @Column({ default: '', nullable: true })
  createTime: string;

  @Column({ default: '', nullable: true })
  updateTime: string;

  @Column({ default: '', nullable: true })
  deleteTime: string;
}
