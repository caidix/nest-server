import { Role } from '@libs/db/entity/RoleEntity';
import { User } from '@libs/db/entity/UserEntity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'libs/common/exception/ApiException';
import { ErrorCodeEnum } from 'libs/common/utils/errorCodeEnum';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import { CreateUserDto } from './dto/CreatUserDto';
import { LoginUserDto } from './dto/LoginUserDto';

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
            crateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
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

  /**
   * 用户登录
   * @param params
   */
  public async login(userName: string) {
    try {
      return await this.userRepository
        .createQueryBuilder('u')
        .where('u.name = :name', { name: userName })
        .getOne();
    } catch (e) {
      throw new ApiException('登录失败', 200, ErrorCodeEnum.NO_FIND_USER);
    }
  }
}
