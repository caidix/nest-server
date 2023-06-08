import { Role } from '@libs/db/entity/RoleEntity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleGroup } from '@libs/db/entity/RoleGroupEntity';
import { rootRoleIdProvider } from 'libs/common/factory/root-role-id.provider';
import { RoleAuth } from '@libs/db/entity/RoleAuthEntity';
import { SystemMenuModule } from '../system-menu/system-menu.module';
import { UserRole } from '@libs/db/entity/UserRoleEntity';

@Module({
  imports: [
    SystemMenuModule,
    TypeOrmModule.forFeature([Role, RoleGroup, RoleAuth, UserRole]),
  ],
  controllers: [RoleController],
  providers: [RoleService, rootRoleIdProvider],
})
export class RoleModule {}
