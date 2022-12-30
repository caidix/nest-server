# nest - typeorm 如何联查没有关联关系的实体

> 很多时候我们在写 sql 表的时候，外键因为有诸多限制不被推荐使用，所以大部分的都是无关系的表连接，所以，下面总结两钟联查的方法以供选择。

下面先定义两张表
_User 表_

```js
@Entity({ name: 'user', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  desc: string;
}
```

与 user 关联的表 - 其内的 userId 对应 user 表的主键
_userRole_

```js
@Entity({ name: 'userRole', schema: 'public' })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  name: string;
}
```

### 采用 getRawOne 重置原始数据

> 通过左联 leftJoinAndSelect 找到数据后通过 getRawOne 将所有数据变为原始数据，再通过 select 重新编排得出结果

首先我们需要在 imports 导入我们两张表

```js
@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  ...
})
```

然后在 service 文件中书写:

```js
// ...
constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}
return this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect(UserRole, 'role', 'user.id = role.userId')
  .select(
    `
        user.roles as role,
        user.id as userId,
        user.nickname as nickname,
        user.username as usernmae,
        user.avator as avator,
      `,
  )
  .getRawMany();
// ...
```

## 使用 leftJoinAndMapOne 或 leftJoinAndMapMany 映射属性

```js
constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}
return this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndMapOne('user.role',UserRole, 'role', 'user.id=role.userId')
  .getManyAndCount();
```

