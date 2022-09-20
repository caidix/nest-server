import { System } from '@libs/db/entity/SystemEntity';
import { SystemMenu } from '@libs/db/entity/SystemMenuEntity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMenuController } from './system-menu.controller';
import { SystemMenuService } from './system-menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMenu, System])],
  controllers: [SystemMenuController],
  providers: [SystemMenuService],
  exports: [SystemMenuService],
})
export class SystemMenuModule {}
