import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { RedisCacheService } from '../redis/redis.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env.JWT_SECRET,
        };
      },
    }),
    forwardRef(() => UserModule), // 处理循环依赖的关系
  ],
  providers: [
    AuthService,
    ConfigService,
    RedisCacheService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
