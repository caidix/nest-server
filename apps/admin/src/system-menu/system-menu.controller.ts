import { User } from '@libs/db/entity/UserEntity';
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
import { CurrentUser } from 'libs/common/decorator/current-user.decorator';
import { returnClient } from 'libs/common/return/returnClient';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import {
  CreateSystemMenuDto,
  HandleMenu,
  OperationMenu,
  UpdateSystemMenu,
} from './dto/SystemMenuDto';
import { SystemMenuService } from './system-menu.service';

@Controller('system-menu')
@ApiTags('system-menu')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class SystemMenuController {
  constructor(
    @Inject(SystemMenuService)
    private readonly systemMenuiService: SystemMenuService,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '获取菜单菜单列表',
  })
  public async getSystemMenuList(
    @Query() params: { code: string },
    @CurrentUser() user: User,
  ) {
    try {
      const data = await this.systemMenuiService.getSystemMenuList(
        params.code,
        user,
      );
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('create')
  @ApiOperation({
    summary: '创建菜单',
  })
  public async createSystemMenu(
    @Body() createSystemDto: CreateSystemMenuDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.systemMenuiService.createSystemMenu(
      createSystemDto,
      user,
    );
    return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('update')
  @ApiOperation({
    summary: '更新菜单',
  })
  public async updateSystem(
    @Body() systemMenuDto: UpdateSystemMenu,
    @CurrentUser() user: User,
  ) {
    await this.systemMenuiService.updateSystemMenu(systemMenuDto, user);
    return returnClient('更新菜单成功', ApiCodeEnum.SUCCESS);
  }

  @Post('delete')
  @ApiOperation({
    summary: '删除菜单',
  })
  public async deleteSystem(
    @Body() data: HandleMenu,
    @CurrentUser() user: User,
  ) {
    try {
      await this.systemMenuiService.deleteSystemMenu(data, user);
      return returnClient('删除菜单成功', ApiCodeEnum.SUCCESS);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('detail')
  @ApiOperation({
    summary: '获取菜单详情',
  })
  public async getSystemDetail(@Body() id: number) {
    const data = await this.systemMenuiService.getSystemMenu({ id });
    return returnClient('获取菜单详情成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('move')
  @ApiOperation({
    summary: '菜单排序上下移',
  })
  public async moveMenu(
    @Body() OperationMenuDto: OperationMenu,
    @CurrentUser() user: User,
  ) {
    const res = await this.systemMenuiService.moveMenu(OperationMenuDto, user);
    return returnClient('更新菜单成功', ApiCodeEnum.SUCCESS, res);
  }

  @Post('status')
  @ApiOperation({
    summary: '菜单显示隐藏',
  })
  public async changeMenuStatus(
    @Body() OperationMenuDto: OperationMenu,
    @CurrentUser() user: User,
  ) {
    const res = await this.systemMenuiService.changeMenuStatus(
      OperationMenuDto,
      user,
    );
    return returnClient('更新菜单成功', ApiCodeEnum.SUCCESS, res);
  }
}
