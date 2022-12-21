import { ApiResource } from '@libs/db/entity/ApiResourceEntity';
import { System } from '@libs/db/entity/SystemEntity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from '../system/system.service';
import { ApiResourceController } from './api-resource.controller';
import { ApiResourceService } from './api-resource.service';

@Module({
  imports: [TypeOrmModule.forFeature([System, ApiResource])],
  controllers: [ApiResourceController],
  providers: [ApiResourceService, SystemService],
})
export class ApiResourceModule {}
