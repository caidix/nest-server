import { Role } from '@libs/db/entity/RoleEntity';
import { User } from '@libs/db/entity/UserEntity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formatDate } from 'utils/dataTime';
import { CreateUserDto } from './dto/CreatUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  public async createUser(user: CreateUserDto) {
    let role;
    try {
      role = await this.roleRepository
        .createQueryBuilder('r')
        .where('r.id = :id', { id: user.roleId || 0 })
        .getOne();
    } catch (e) {
      console.log('角色不在');
      throw new HttpException('角色不存在', 200);
    }
    try {
      const res = await this.userRepository
        .createQueryBuilder('u')
        .insert()
        .into(User)
        .values([
          {
            crateTime: formatDate(),
            updateTime: formatDate(),
            password: user.password,
            name: user.name,
            desc: user.desc,
            role,
            email: user.email,
            nick: user.nick,
            address: user.address,
            phone: user.phone,
            age: user.age,
          },
        ])
        .execute();

      console.log({ role, res });
      return res;
    } catch (e) {
      console.log('shibei', e);
      throw new HttpException('注册失败', 200);
    }
  }

  // 查找指定用户
  public async findSpecifiedUser(name: string) {
    const queryConditionList = ['u.isDelete = :isDelete', 'u.name = :name'];
    const leftJoinConditionList = [];
    const leftJoinConditionOrganizations = {};
    const queryCondition = queryConditionList.join(' AND ');
    const leftJoinCondition = leftJoinConditionList.join('');
    return await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect(
        'u.organizations',
        'org',
        leftJoinCondition,
        leftJoinConditionOrganizations,
      )
      .where(queryCondition, {
        name,
        isDelete: 0,
      })
      .getOne();
  }

  /**
   * 通过用户名查看
   * @param name
   */
  public async findOneByName(name: string): Promise<User> {
    const queryConditionList = ['u.isDelete = :isDelete', 'u.name = :name'];
    const leftJoinConditionList = [];
    const leftJoinConditionOrganizations = {};
    const queryCondition = queryConditionList.join(' AND ');
    const leftJoinCondition = leftJoinConditionList.join('');
    return await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect(
        'u.organizations',
        'org',
        leftJoinCondition,
        leftJoinConditionOrganizations,
      )
      .where(queryCondition, {
        name,
        isDelete: 0,
      })
      .getOne();
  }
}
