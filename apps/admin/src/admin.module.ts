import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from '@libs/common';
import { DbModule } from '@libs/db';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CommonModule, DbModule, AuthModule, UserModule, RoleModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
