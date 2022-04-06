import { Controller, Get, Inject } from '@nestjs/common';
import { AdminService } from './admin.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    return this.adminService.getHello();
  }
}
