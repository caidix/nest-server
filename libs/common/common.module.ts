import { Module } from '@nestjs/common';
import envConfig from 'config/env';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from '@libs/db';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

// imports 内的方法，在引入的时候都是并行同步加载的，这里我们用config插件为其增加公共的环境变量
// 需要注意的是，同时加载的模块可能先一步加载就会拿不到环境变量或者想要的参数
// 通常编写的插件里有同步forRoot方法和异步forRootAsync方法，我们就需要给其他的插件采用异步形式导入
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [envConfig.path] }),
    DbModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
        }),
      ],
    }),
  ],
})
export class CommonModule {}
