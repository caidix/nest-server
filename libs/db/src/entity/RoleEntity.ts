import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Authority } from './AuthorityEntity';
import { User } from './UserEntity';

/** 角色表 */
@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  name: string;

  @Column({ length: 500, nullable: true })
  desc: string;

  @Column({
    length: 50,
    unique: true,
  })
  code: string;

  @ManyToMany(() => Authority, (authority) => authority.roles)
  @JoinTable()
  authority: Authority[];

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];

  @Column({ default: 0 })
  isDelete: number;

  @Column({ default: '', nullable: true })
  crateTime: string;

  @Column({ default: '', nullable: true })
  updateTime: string;

  @Column({ default: '', nullable: true })
  deleteTime: string;
}
