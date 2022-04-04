import { Strategy, IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // local为校验策略名字
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    } as IStrategyOptions);
  }
  // super会从request数据包里拿到请求过来的字段名，并带给validate函数进行校验验证
  // 我们就需要在validate里写验证的逻辑，它代表如何去校验这个策略
  async validate(name: string, password: string) {
    const user = await this.authService.validateUser(name);
    console.log({ user });
    if (!user) {
      throw new BadRequestException('用户名或密码不正确1');
    }
    if (password !== user.password) {
      throw new BadRequestException('用户名或密码不正确2');
    }
    // if (!compareSync(password, user.password)) {
    //   throw new BadRequestException('用户名或密码不正确2');
    // }
    return user;
  }
}
