import { User } from './entity/UserEntity';
import { Organization } from './entity/OrganizationEntity';
import { Role } from './entity/RoleEntity';
import { Authority } from './entity/AuthorityEntity';

import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import envConfig from 'config/env';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
const models = TypeOrmModule.forFeature([User, Organization, Role, Authority]);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [envConfig.path] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        // entities: [PostsEntity],
        autoLoadEntities: true,
        host: configService.get('DB_HOST', '127.0.0.0'),
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
