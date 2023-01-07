import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleGroupDto, DeleteRoleGroupDto, UpdateRoleGroupDto } from './role.dto';
import { CurrentUser } from 'libs/common/decorator/current-user.decorator';
import { User } from '@libs/db/entity/UserEntity';
import { returnClient } from 'libs/common/return/returnClient';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  @Post('group/create')  @ApiOperation({
    summary: '创建分组',
  })
  public async createRoleGroup(@Body()createRoleGroupDto: CreateRoleGroupDto,@CurrentUser()user:User) {
    const res = await this.roleService.createRoleGroup(createRoleGroupDto, user)
    return returnClient('创建成功', ApiCodeEnum.SUCCESS);
  }

  @Post('group/update')@ApiOperation({
    summary: '更新分组',
  })
  public async updateRoleGroup(@Body()updateRoleGroup: UpdateRoleGroupDto,@CurrentUser()user:User) {
    const res = await this.roleService.updateRoleGroup(updateRoleGroup, user)
    return returnClient('更新成功', ApiCodeEnum.SUCCESS);
  }

  @Post('group/delete')@ApiOperation({
    summary: '删除分组',
  })
  public async deleteRoleGroup(@Body('id')id: DeleteRoleGroupDto['id']) {
    const res = await this.roleService.deleteRoleGroup(id)
    return returnClient('删除成功', ApiCodeEnum.SUCCESS);
  }

  @Get('group/all-list')@ApiOperation({
    summary: '获取分组列表',
  })
  public async getAllGroupList() {
    const res = await this.roleService.getAllRoleGroup()
    return returnClient('获取列表成功', ApiCodeEnum.SUCCESS,res);
  }

}
