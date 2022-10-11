import { User } from '@libs/db/entity/UserEntity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RedisCacheService } from '../redis/redis.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule), // 循环依赖， 引入auth
  ],
  controllers: [UserController],
  providers: [UserService, RedisCacheService],
  exports: [UserService],
})
export class UserModule {}
