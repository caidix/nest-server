import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './OrganizationEntity';
import { Role } from './RoleEntity';

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

  @Column({ select: false, comment: '邮箱', length: 500 })
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

  /**
   * 状态： 启用 、 禁用
   */
  @Column({ default: 0, comment: '状态' })
  status: number;

  // 权限
  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  // 组织
  @ManyToMany(() => Organization, (orientation) => orientation.users)
  organizations: Organization[];

  // 组织管理员
  @ManyToMany(() => Organization, (orientation) => orientation.managers)
  managers: Organization[];

  @Column({ default: 0, comment: '是否不可用' })
  isDelete: number;

  @Column({ default: false, comment: '是否完成身份验证' })
  verification: boolean;

  @Column({ default: '', nullable: true })
  crateTime: string;

  @Column({ default: '', nullable: true })
  updateTime: string;

  @Column({ default: '', nullable: true })
  deleteTime: string;
}
