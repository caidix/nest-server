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
    nullable: true,
    length: 100,
    comment: '密码',
  })
  password: string;

  @Column({ select: false, comment: '邮箱', length: 500 })
  email: string;

  @Column({ default: '', comment: '手机号' })
  phone: string;

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
  @ManyToOne((type) => Role, (role) => role.users)
  role: Role;

  // 组织
  @ManyToMany((type) => Organization, (orientation) => orientation.users)
  organizations: Organization[];

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
