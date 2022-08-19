import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './OrganizationEntity';

/** 应用表 */
@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, comment: '应用名称' })
  name: string;

  @Column('text', { nullable: true, comment: '应用描述' })
  desc: string;

  @Column({ length: 80, comment: '应用密钥' })
  appSecret: string;

  @Column({ length: 1024, comment: '资源地址' })
  resourcesUrl: string;

  @Column({ length: 1024, comment: 'LOGO地址' })
  logoUrl: string;

  @Column({ default: '', comment: '应用编码' })
  code: string;

  // 所属用户组
  @ManyToOne(() => Organization, (org) => org.systems)
  organization: Organization;

  @Column({ default: '', nullable: true })
  crateTime: string;

  @Column({ default: '', nullable: true })
  updateTime: string;
}
