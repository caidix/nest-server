import { User } from './entity/UserEntity';
import { Organization } from './entity/OrganizationEntity';
import { Role } from './entity/RoleEntity';
import { Authority } from './entity/AuthorityEntity';
import { MenuAction } from './entity/MenuActionEntity';
import { System } from './entity/SystemEntity';
import { SystemMenu } from './entity/SystemMenuEntity';

import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';

const models = TypeOrmModule.forFeature([
  User,
  Organization,
  Role,
  Authority,
  MenuAction,
  System,
  SystemMenu,
]);

@Module({
  imports: [
    // 接入redis， 得安装才跑得起来噢！
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          name: configService.get('REDIS_NAME', 'test-redis'),
          host: configService.get('REDIS_HOST', '127.0.0.1'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD', 'cd@redis'),
        },
      }),
    }),
    // 公共接入MYSQL数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        // entities: [PostsEntity],
        autoLoadEntities: true,
        host: configService.get('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWORD', '123456'),
        database: configService.get('DB_DATABASE', 'admin'),
        // charset: 'utf8mb4',
        timezone: '+08:00',
        synchronize: true,
      }),
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
