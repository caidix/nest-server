import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from './types/JwtPayloadInterface';
import { UserService } from '../user/user.service';
import { RedisCacheService } from '../redis/redis.service';
import { User } from 'libs/db/src/entity/UserEntity';
import { JwtPayloadToken } from './types/JwtPayloadJwtPayloadInterface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(RedisCacheService)
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async signIn(user: JwtPayload): Promise<string> {
    return this.jwtService.sign(user);
  }

  /**
   * 用户验证
   * @param user
   */
  async validateUser(
    username: string,
  ): Promise<Omit<User, 'organizations' | 'managers'>> {
    return await this.userService.findSpecifiedUser(username);
  }

  /**
   * 核查用户
   * @param token
   */
  async verifyUser(token: string) {
    return await this.jwtService.verify(token);
  }

  /**
   * 产生token
   * @param user
   */
  async creatToken(user: { name: string; id: any }): Promise<any> {
    const expiration = Number(this.configService.get('JWT_TIMEOUT', 60 * 60));
    const accessToken = await this.jwtService.sign(user, {
      expiresIn: expiration,
    });
    return {
      expiration,
      accessToken,
      success: true,
    };
  }

  /**
   * 存入用户登录redis
   * @param param0
   */
  async createRedisByToken({ name, id, token }): Promise<any> {
    this.redisCacheService.set(
      `jwt-${id}-${name}`,
      token,
      Number(this.configService.get('REDIS_CACHE_TIME', 60 * 60)),
    );
  }

  /**
   * 取出用户登录redis
   * @param param0
   */
  async getRedisByToken({ name, id }): Promise<string> {
    return this.redisCacheService.get(`jwt-${id}-${name}`);
  }
}
