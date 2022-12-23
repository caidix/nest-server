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

/** 应用 - 角色 - 权限点的对应关系 */
@Entity()
export class RoleAuth extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80, comment: '角色id', default: '' })
  roleId: number;

  @Column({ length: 80, comment: '应用code', nullable: true })
  systemCode: string;

  @Column({ comment: '应用id' })
  systemId: number;
}
