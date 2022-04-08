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
// https://typeorm.biunav.com/zh/select-query-builder.html#%E4%BB%80%E4%B9%88%E6%98%AFquerybuilder
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  public async createUser(user: CreateUserDto) {
    let role;
    try {
      role = await this.roleRepository // 使用 repository 创建Query Builder
        .createQueryBuilder('r') // 查找role实体， r为SQL 别名. SQL 查询中，Role是表名，r是我们分配给该表的别名。
        .where('r.id = :id', { id: user.roleId || 0 }) //　等同　WHERE role.id = user.roleId || 0. 你多次使用.where，你将覆盖所有以前的WHERE表达式,这时候需要使用andWhere
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
          // 数组形式可以同时添加多个，也可以用object只添加单个
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
    const queryConditionList = [
      'user.isDelete = :isDelete',
      'user.name = :name',
    ];
    const leftJoinConditionList = [];
    const leftJoinConditionOrganizations = {};
    const queryCondition = queryConditionList.join(' AND ');
    const leftJoinCondition = leftJoinConditionList.join('');
    return await this.userRepository
      .createQueryBuilder('user') // 参数别名　user
      .leftJoinAndSelect('user.role', 'r') // 自动加载了 user 的 role. 第一个参数是你要加载的关系，第二个参数是你为此关系的表分配的别名
      .leftJoinAndSelect(
        'user.organizations',
        'org',
        leftJoinCondition,
        leftJoinConditionOrganizations, // 也可以在leftJoinAndSelect中添加表达式，它相当于为你使用了where
      )
      .where(queryCondition, {
        name,
        isDelete: 0,
      })
      .getOne();
    // LEFT JOIN和INNER JOIN之间的区别在于，如果没有任何 photos，INNER JOIN将不会返回 user。 即使没有 photos，LEFT JOIN也会返回 user。
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

  /**发送邮件 */
  public async sendMailer() {
    // let transporter: any = null;
    // return new Promise((resolve, reject) => {
    //   try {
    //     transporter = nodemailer.createTransport({
    //       // host: 'smtp.ethereal.email',
    //       service: 'QQ', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    //       port: 465, // SMTP 端口
    //       secureConnection: false, // 使用了 SSL
    //       auth: {
    //         user: emailConfig.user,
    //         pass: emailConfig.authPass,
    //         // pass: 'mlemxnogjqcfecba',
    //       },
    //     });
    //   } catch (e) {
    //     reject(e);
    //   }
    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       reject(error);
    //     }
    //     resolve(true);
    //   });
    // });
  }
}
