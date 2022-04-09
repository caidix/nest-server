import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtPayloadToken } from '../types/JwtPayloadJwtPayloadInterface';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { ApiException } from 'libs/common/exception/ApiException';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req, payload: JwtPayloadToken, done: any) {
    const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const { name, id } = payload;
    const cacheToken = await this.authService.getRedisByToken({ name, id });
    const user = await this.authService.validateUser(name);
    console.log({ originToken, cacheToken });

    //单点登陆验证
    if (cacheToken && cacheToken !== originToken) {
      throw new ApiException(
        '您账户已经在另一处登陆，请重新登陆',
        400,
        ApiCodeEnum.USER_LOGGED,
      );
    }

    if (!user || user.id !== Number(id)) {
      return done(
        new ApiException('token无效', 400, ApiCodeEnum.TOKEN_OVERDUE),
        false,
      );
    }
    done(null, user);
  }
}
