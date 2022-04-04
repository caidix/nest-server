import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './types/JwtPayloadInterface';
import { UserService } from '../user/user.service';
import { User } from 'libs/db/src/entity/UserEntity';
import { JwtPayloadToken } from './types/JwtPayloadJwtPayloadInterface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user: JwtPayload): Promise<string> {
    return this.jwtService.sign(user);
  }

  /**
   * 用户验证
   * @param user
   */
  async validateUser(username: string): Promise<User> {
    return await this.userService.login(username);
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
    const expiration = 60 * 60;
    const accessToken = await this.jwtService.sign(user, {
      expiresIn: expiration,
    });
    return {
      expiration,
      accessToken,
      success: true,
    };
  }
}
