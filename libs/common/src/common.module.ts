import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import envConfig from 'config/env';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from '@libs/db';

@Module({
  imports: [],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
