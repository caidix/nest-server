import { Organization } from '@libs/db/entity/OrganizationEntity';
import { System } from '@libs/db/entity/SystemEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from '../organization/organization.service';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [TypeOrmModule.forFeature([System, Organization, User])],
  providers: [SystemService, OrganizationService],
  controllers: [SystemController],
  exports: [SystemService],
})
export class SystemModule {}
