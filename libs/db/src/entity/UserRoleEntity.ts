/**用户和角色的关系枚举字段表
 * 1. 需要userId
 * 2. 需要角色id
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** 角色分组管理 */
@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', comment: '用户id' })
  userId: number;

  @Column({ name: 'roleId', comment: '角色id' })
  roleId: number;
}
