import * as nodemailer from 'nodemailer';
import { EntityManager, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import fetch from 'node-fetch';

// Entity Service
import { User, UserStatusEnum } from '@libs/db/entity/UserEntity';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis/redis.service';

// Dto
import { LoginUserDto } from './dto/LoginUserDto';
import { QueryUserListDto, CreateUserDto, UpdateUserDto } from './user.dto';

// Utils
import { ApiException } from 'libs/common/exception/ApiException';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import {
  createVerificationCode,
  getFormatData,
  setEmailContent,
} from 'libs/common/utils';
import { Organization } from '@libs/db/entity/OrganizationEntity';

// https://typeorm.biunav.com/zh/select-query-builder.html#%E4%BB%80%E4%B9%88%E6%98%AFquerybuilder

type MailerOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
};
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(RedisCacheService)
    private readonly redisCacheService: RedisCacheService,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  public async createUser(userDto: CreateUserDto) {
    try {
      const user = {
        ...getFormatData('create'),
        password: userDto.password || '123456',
        name: userDto.name,
        desc: userDto.desc,
        email: userDto.email,
        nick: userDto.nick,
        address: userDto.address,
        phone: userDto.phone,
        age: userDto.age,
        status: userDto.status || UserStatusEnum.Active,
        organization: userDto.organization,
        isSuper: userDto.isSuper || false,
      };
      const res = await this.userRepository
        .createQueryBuilder('u')
        .insert()
        .into(User)
        .values([
          // 数组形式可以同时添加多个，也可以用object只添加单个
          user,
        ])
        .execute();

      return res;
    } catch (e) {
      console.log('shibei', e);
      throw new HttpException('注册失败', 200);
    }
  }

  /** 更新用户信息 */
  public async updateUserInfo(userDto: UpdateUserDto) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        return await manager.update(User, userDto.id, {
          name: userDto.name,
          desc: userDto.desc,
          email: userDto.email,
          nick: userDto.nick,
          address: userDto.address,
          phone: userDto.phone,
          age: userDto.age,
          status: userDto.status || UserStatusEnum.Active,
          organization: userDto.organization,
          isSuper: userDto.isSuper || false,
        });
      } catch (error) {
        throw new ApiException(
          '更新用户失败' + error,
          200,
          ApiCodeEnum.PUBLIC_ERROR,
        );
      }
    });
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
    const res = await this.userRepository
      .createQueryBuilder('user') // 参数别名　user
      // .leftJoinAndSelect(
      //   'user.organizations',
      //   'org',
      //   leftJoinCondition,
      //   leftJoinConditionOrganizations, // 也可以在leftJoinAndSelect中添加表达式，它相当于为你使用了where
      // )
      // .leftJoinAndSelect('user.managers', 'm', 'm.isDelete = :isDelete', {
      //   isDelete: 0,
      // })
      .where(queryCondition, {
        name,
        isDelete: 0,
      })
      .addSelect(['user.password'])
      .getOne();

    return res;
    // LEFT JOIN和INNER JOIN之间的区别在于，如果没有任何 photos，INNER JOIN将不会返回 user。 即使没有 photos，LEFT JOIN也会返回 user。
  }

  /**
   * 通过用户名查看
   * @param name
   */
  public async findOneByName(name: string): Promise<any> {
    try {
      const queryConditionList = ['u.isDelete = :isDelete', 'u.name = :name'];
      const leftJoinConditionList = [];
      const leftJoinConditionOrganizations = {};
      const queryCondition = queryConditionList.join(' AND ');
      const leftJoinCondition = leftJoinConditionList.join('');
      const res = await this.userRepository
        .createQueryBuilder('u')
        // .leftJoinAndSelect(
        //   'u.organizations',
        //   'org',
        //   'org.isDelete = :isDelete',
        //   {
        //     isDelete: 0,
        //   },
        // )
        // .leftJoinAndSelect('u.managers', 'm', 'm.isDelete = :isDelete', {
        //   isDelete: 0,
        // })
        // .select(['u', 'org', 'org.code', 'm', 'm.code'])
        .where(queryCondition, {
          name,
          isDelete: 0,
        })
        .getOne();

      return res;
    } catch (error) {
      throw new ApiException('获取用户信息失败', 200, ApiCodeEnum.NO_FIND_USER);
    }
  }

  /**
   * 通过id查看
   * @param name
   */
  public async findOneById(id: number) {
    try {
      const queryConditionList = ['u.isDelete = :isDelete', 'u.id = :id'];
      const leftJoinConditionList = [];
      const leftJoinConditionOrganizations = {};
      const queryCondition = queryConditionList.join(' AND ');
      const leftJoinCondition = leftJoinConditionList.join('');
      const res = await this.userRepository
        .createQueryBuilder('u')
        .where(queryCondition, {
          id,
          isDelete: 0,
        })
        // .select(['u', 'org', 'org.code', 'm', 'm.code'])
        .getOne();

      return res;
    } catch (error) {
      throw new ApiException('获取用户信息失败', 200, ApiCodeEnum.NO_FIND_USER);
    }
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
        .select(['u', 'org', 'org.code', 'm', 'm.code'])
        .addSelect(['u.password'])
        .getOne();
    } catch (e) {
      throw new ApiException('登录失败', 200, ApiCodeEnum.NO_FIND_USER);
    }
  }

  /** 用户列表 */
  public async getUserList(params: QueryUserListDto) {
    try {
      const { name, organization, pageSize = 10, current = 1 } = params;
      const queryConditionList = ['o.isDelete = :isDelete'];
      if (name) {
        queryConditionList.push('o.name LIKE :name');
      }
      if (organization) {
        queryConditionList.push('o.organization = :organization');
      }
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.userRepository
        .createQueryBuilder('o')
        .where(queryCondition, {
          name: `%${name}%`,
          isDelete: 0,
          organization,
        })
        .leftJoinAndMapOne(
          'o.orgName',
          Organization,
          'org',
          'o.organization = org.id',
        )
        .orderBy('o.name', 'ASC')
        .skip((current - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();
      const [list, total] = res as any;

      const formatList = list.map((item) => ({
        ...item,
        orgName: item.orgName?.name,
      }));
      return { list: formatList, total, pageSize, current };
    } catch (e) {
      console.log({ e });
      throw new ApiException('查询用户列表失败', 400, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  /**
   * 查询所有用户列表
   * @param query
   */
  public async getAllList() {
    try {
      const queryConditionList = ['u.isDelete = :isDelete'];
      const queryCondition = queryConditionList.join(' AND ');
      const res = await this.userRepository
        .createQueryBuilder('u')
        .where(queryCondition, {
          isDelete: 0,
        })
        .orderBy('u.name', 'ASC')
        .select(['u.name', 'u.id'])
        .getManyAndCount();

      console.log({ res });

      return { list: res[0], count: res[1] };
    } catch (e) {
      throw new ApiException('查询用户列表失败', 400, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  public async deleteUsers(userIds: number[]) {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(userIds)
        .execute();
    } catch (e) {
      throw new ApiException('删除用户失败', 200, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  // public formatUserData(user: User) {
  //   const { organizations = [], managers = [] } = user;
  //   const _organizations = organizations.map((i) => i.code);
  //   const _managers = managers.map((i) => i.code);
  //   return {
  //     ...user,
  //     organizationCodes: _organizations,
  //     managerCodes: _managers,
  //     roles: [...new Set(_organizations.concat(_managers))],
  //   };
  // }

  /* 发送邮件 */
  public async sendMailer(mailOptions: MailerOptions) {
    let transporter: any = null;
    return new Promise((resolve, reject) => {
      console.log(this.configService.get('EMAIL_PASS', ''));
      try {
        transporter = nodemailer.createTransport({
          host: 'smtp.qq.com',
          service: 'QQ', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
          port: 465, // SMTP 端口 ，默认情况下为587，如果设置secure为true时则默认为465.
          // secureConnection: false, // 使用了 SSL
          secure: true,
          auth: {
            user: this.configService.get('EMAIL_USER', ''),
            pass: this.configService.get('EMAIL_PASS', ''),
            // pass: 'mlemxnogjqcfecba',
          },
        });
      } catch (e) {
        reject(e);
      }
      transporter.verify((err, suc) => {
        if (err) {
          console.log({ err });
        } else {
          console.log('授权成功');
        }
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /* 生成验证码并发送邮件 */
  public async sendMailerByCode(email: string) {
    const code = createVerificationCode(6);
    const tuwei = await this.tuwei();
    console.log({ code, form: this.configService.get('EMAIL_USER', '') });

    const emailOptions: MailerOptions = {
      from: `"进场认证" <${this.configService.get('EMAIL_USER', '')}>`, // 发件人 邮箱  '昵称<发件人邮箱>'
      to: email, // 这个是前端页面注册时输入的邮箱号
      subject: `感谢您注册全国最大的南桐俱乐部！`,
      html: setEmailContent(
        'http://cd-blog.oss-cn-shenzhen.aliyuncs.com/9e55e91c318d4bb445ba4d2f75d5ca08.jpg',
        tuwei,
        code,
      ),
    };

    try {
      const res = await this.sendMailer(emailOptions);
      await this.redisCacheService.set(email, code, 3 * 60 * 1000); // 5分钟内有效
      return res;
    } catch (error) {
      throw new ApiException(error.message, 200, ApiCodeEnum.SEND_MAILER_ERROR);
    }
  }

  /* 校验邮箱发送的验证码 */
  public async verifyEmailerCode(email: string, code: string) {
    const currentCode = await this.redisCacheService.get(email);

    if (!currentCode) {
      throw new ApiException(
        '验证码已过期，请重新发送',
        200,
        ApiCodeEnum.SEND_MAILER_ERROR,
      );
    }
    const res = currentCode === code;
    if (res) {
      this.redisCacheService.del(email);
    } else {
      throw new ApiException(
        '验证码有误，请重新输入',
        200,
        ApiCodeEnum.SEND_MAILER_ERROR,
      );
    }
    return res;
  }

  /* 土味情话搞里头 */
  public async tuwei() {
    return await fetch('https://chp.shadiao.app/api.php', {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-ch-ua':
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      },
      body: null,
      method: 'GET',
    })
      .then((res) => res.text())
      .then((json) => json);
  }
}
