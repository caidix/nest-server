import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/CreateRoleDto';
import { RoleService } from './role.service';

@Controller('role')
// @ApiBearerAuth()
@ApiTags('role')
export class RoleController {
  constructor(@Inject(RoleService) private readonly roleService: RoleService) {}

  @Post('add')
  @ApiOperation({
    summary: '创建权限role',
  })
  public async creatRole(@Body() createRoleDto: CreateRoleDto) {
    try {
      const res = await this.roleService.checkName(createRoleDto.name);
      if (res) {
        return '该角色已经存在';
      }
      await this.roleService.creatRole(createRoleDto);
      return '创建成功!';
    } catch (error) {
      return '出现异常';
    }
  }
}
