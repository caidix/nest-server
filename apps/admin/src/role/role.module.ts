import { Role } from '@libs/db/entity/RoleEntity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleGroup } from '@libs/db/entity/RoleGroupEntity';
import { rootRoleIdProvider } from 'libs/common/factory/root-role-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleGroup])],
  controllers: [RoleController],
  providers: [RoleService, rootRoleIdProvider],
})
export class RoleModule {}
