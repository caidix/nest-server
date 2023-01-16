import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import {
  CreateRoleDto,
  CreateRoleGroupDto,
  DeleteRoleGroupDto,
  SearchRoleDto,
  SearchSystemRoleAuthDto,
  UpdateRoleDto,
  UpdateRoleGroupDto,
} from './role.dto';
import { CurrentUser } from 'libs/common/decorator/current-user.decorator';
import { User } from '@libs/db/entity/UserEntity';
import { returnClient } from 'libs/common/return/returnClient';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { SystemMenuService } from '../system-menu/system-menu.service';
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(
    @Inject(RoleService)
    private readonly roleService: RoleService,

    @Inject(SystemMenuService)
    private readonly systemMenuService: SystemMenuService,
  ) {}

  @Post('group/create')
  @ApiOperation({
    summary: '创建分组',
  })
  public async createRoleGroup(
    @Body() createRoleGroupDto: CreateRoleGroupDto,
    @CurrentUser() user: User,
  ) {
    await this.roleService.createRoleGroup(createRoleGroupDto, user);
    return returnClient('创建成功', ApiCodeEnum.SUCCESS);
  }

  @Post('group/update')
  @ApiOperation({
    summary: '更新分组',
  })
  public async updateRoleGroup(
    @Body() updateRoleGroup: UpdateRoleGroupDto,
    @CurrentUser() user: User,
  ) {
    await this.roleService.updateRoleGroup(updateRoleGroup, user);
    return returnClient('更新成功', ApiCodeEnum.SUCCESS);
  }

  @Post('group/delete')
  @ApiOperation({
    summary: '删除分组',
  })
  public async deleteRoleGroup(@Body('id') id: DeleteRoleGroupDto['id']) {
    await this.roleService.deleteRoleGroup(id);
    return returnClient('删除成功', ApiCodeEnum.SUCCESS);
  }

  @Get('group/all-list')
  @ApiOperation({
    summary: '获取分组列表',
  })
  public async getAllGroupList() {
    const res = await this.roleService.getAllRoleGroup();
    return returnClient('获取列表成功', ApiCodeEnum.SUCCESS, res);
  }

  @Post('create')
  @ApiOperation({
    summary: '创建角色',
  })
  public async createRole(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: User,
  ) {
    const hasRoleGroup = await this.roleService.hasRoleGroup(
      createRoleDto.roleGroupId,
    );
    if (!hasRoleGroup) {
      return returnClient('该角色分组不存在', ApiCodeEnum.PUBLIC_ERROR);
    }
    const hasRole = await this.roleService.getRoleDetail({
      name: createRoleDto.name,
      roleGroupId: createRoleDto.roleGroupId,
    });
    console.log({ hasRole });

    if (!!hasRole) {
      return returnClient('相同分组下角色名称重复', ApiCodeEnum.PUBLIC_ERROR);
    }
    await this.roleService.createRole(createRoleDto, user);
    return returnClient('创建角色成功', ApiCodeEnum.SUCCESS);
  }

  @Post('update')
  @ApiOperation({
    summary: '更新角色',
  })
  public async updateRole(
    @Body() updateRole: UpdateRoleDto,
    @CurrentUser() user: User,
  ) {
    await this.roleService.updateRole(updateRole, user);
    return returnClient('更新成功', ApiCodeEnum.SUCCESS);
  }

  @Get('list')
  @ApiOperation({
    summary: '获取角色列表',
  })
  public async getRoleList(@Query() params: SearchRoleDto) {
    try {
      const data = await this.roleService.roleList(params);
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Get('all-list')
  @ApiOperation({
    summary: '获取所有角色列表',
  })
  public async getAllRoleList(@Query() params: SearchRoleDto) {
    try {
      const data = await this.roleService.getAllRoles(params);
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Get('role-auth-system')
  public async getSystemRoleAuth(@Query() query: SearchSystemRoleAuthDto) {
    const res = await this.roleService.getSystemRoleAuth(query.roleId);
    return returnClient('获取成功', ApiCodeEnum.SUCCESS, res);
  }

  @Post('menu-auth-list')
  @ApiOperation({
    summary: '获取所有角色列表',
  })
  public async getMenuAuthList(@Body() data) {
    const { code, roleId, systemId } = data;
    const auths = await this.roleService.getRoleAuthBySystem({
      roleId,
      systemId,
    });
    if (auths) {
      // const _auths = auths.map((auth) => {
      //   const menus = await this.systemMenuService.getSystemMenuList(code);
      // });
    }

    return returnClient('获取成功', ApiCodeEnum.SUCCESS, {
      // menus,
      auths,
    });
  }

  @Post('update-auth-system')
  @ApiOperation({
    summary: '为角色绑定应用权限',
  })
  public async updateRoleAuthBySystem(@Body() data) {
    await this.roleService.updateRoleAuthBySystem(data);
    return returnClient('配置成功', ApiCodeEnum.SUCCESS);
  }
}
