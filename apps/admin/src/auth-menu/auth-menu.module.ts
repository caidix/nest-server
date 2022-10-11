import { AuthMenu } from '@libs/db/entity/AuthMenuEntity';
import { System } from '@libs/db/entity/SystemEntity';
import { SystemMenu } from '@libs/db/entity/SystemMenuEntity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMenuService } from '../system-menu/system-menu.service';
import { SystemService } from '../system/system.service';
import { AuthMenuController } from './auth-menu.controller';
import { AuthMenuService } from './auth-menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMenu, System, AuthMenu])],
  providers: [AuthMenuService, SystemMenuService, SystemService],
  controllers: [AuthMenuController],
  exports: [AuthMenuService],
})
export class AuthMenuModule {}
