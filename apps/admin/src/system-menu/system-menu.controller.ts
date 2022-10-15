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
import { SystemService } from '../system/system.service';
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
    @Inject(SystemService) private readonly systemService: SystemService,
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
    try {
      // 判断系统是否存在
      const { code, systemCode, parentId } = createSystemDto;
      const hasSystem = await this.systemService.validSystem({
        code: systemCode,
      });
      if (hasSystem) {
        return returnClient(hasSystem, ApiCodeEnum.PUBLIC_ERROR);
      }

      // 判断父级菜单是否存在
      if (parentId) {
        const hasParentMenu = await this.systemMenuiService.validParentMenu(
          parentId,
        );
        if (!hasParentMenu) {
          return returnClient('父级菜单不存在', ApiCodeEnum.PUBLIC_ERROR);
        }
      }

      const hasCode = await this.systemMenuiService.validMenuCode({
        code: code,
        systemCode,
      });
      if (!hasCode) {
        return returnClient(hasCode, ApiCodeEnum.PUBLIC_ERROR);
      }

      // 获取当前菜单应有排序
      const childMenus = await this.systemMenuiService.getChildrens(
        parentId || null,
      );
      let lastMenu = 1;
      if (childMenus && childMenus.length) {
        const lastSort = childMenus[childMenus.length - 1].sort;
        lastMenu = lastSort + 1;
        if (childMenus.find((menu) => menu.code === code)) {
          return returnClient('菜单编码已存在', ApiCodeEnum.PUBLIC_ERROR);
        }
      }
      const data = await this.systemMenuiService.createSystemMenu(
        { ...createSystemDto, sort: lastMenu },
        user,
      );
      return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
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
