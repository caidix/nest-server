import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from './user/user.module';
import { CommonModule } from 'libs/common';
import { AuthModule } from './auth/auth.module';
import { RedisCacheService } from './redis/redis.service';
import { SystemModule } from './system/system.module';
import { OrganizationModule } from './organization/organization.module';
import { SystemMenuModule } from './system-menu/system-menu.module';
import { AuthMenuController } from './auth-menu/auth-menu.controller';
import { AuthMenuModule } from './auth-menu/auth-menu.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    SystemModule,
    OrganizationModule,
    SystemMenuModule,
    AuthMenuModule,
  ],
  controllers: [AdminController, AuthMenuController],
  providers: [AdminService, RedisCacheService],
})
export class AdminModule {}
