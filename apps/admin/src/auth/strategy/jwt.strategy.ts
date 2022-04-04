import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtPayloadToken } from '../types/JwtPayloadJwtPayloadInterface';
import { ErrorCodeEnum } from 'libs/common/utils/errorCodeEnum';
import { ApiException } from 'libs/common/exception/ApiException';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    } as StrategyOptions);
  }

  async validate(payload: JwtPayloadToken, done: any) {
    const { name, id } = payload;
    const user = await this.authService.validateUser(name);
    if (!user || user.id !== Number(id)) {
      return done(
        new ApiException('token无效', 400, ErrorCodeEnum.TOKEN_OVERDUE),
        false,
      );
    }
    done(null, user);
  }
}
