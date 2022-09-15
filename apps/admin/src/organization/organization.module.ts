import { Organization } from '@libs/db/entity/OrganizationEntity';
import { System } from '@libs/db/entity/SystemEntity';
import { User } from '@libs/db/entity/UserEntity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, System])],
  exports: [OrganizationService],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
