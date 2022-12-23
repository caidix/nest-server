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
import { Organization } from './OrganizationEntity';

/** 用户组角色管理 */
@Entity()
export class System extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, comment: '应用名称' })
  name: string;

  @Column('text', { nullable: true, comment: '应用描述' })
  desc: string;

  @Column({ length: 80, comment: '应用密钥', default: '' })
  appSecret: string;

  @Column({ length: 2048, comment: '资源地址', default: '' })
  resourcesUrl: string;

  @Column({ length: 2048, comment: '访问地址', default: '' })
  url: string;

  @Column({ length: 2048, comment: 'LOGO地址', default: '' })
  logoUrl: string;

  @Column({ default: '', comment: '应用编码' })
  code: string;

  // 所属用户组
  @Column({ nullable: false, comment: '所属用户组' })
  organization: string;
}
