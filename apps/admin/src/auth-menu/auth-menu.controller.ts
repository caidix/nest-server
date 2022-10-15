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
import { SystemMenuService } from '../system-menu/system-menu.service';
import { SystemService } from '../system/system.service';
import { AuthMenuService } from './auth-menu.service';
import {
  AuthMenuListDto,
  CreateAuthMenuDto,
  DeleteAuthMenuDto,
  UpdateAuthMenuDto,
} from './dto/AuthMenuDto';

@Controller('auth-menu')
@ApiTags('auth-menu')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class AuthMenuController {
  constructor(
    @Inject(AuthMenuService) private readonly authMenuService: AuthMenuService,
    @Inject(SystemMenuService)
    private readonly systemMenuService: SystemMenuService,
    @Inject(SystemService)
    private readonly systemService: SystemService,
  ) {}

  @Post('create')
  @ApiOperation({
    summary: '创建权限点',
  })
  public async createAuthMenu(
    @Body() authMenuDto: CreateAuthMenuDto,
    @CurrentUser() user,
  ) {
    try {
      const { systemCode, menuCode, code } = authMenuDto;
      const hasSystem = await this.systemService.validSystem({
        code: systemCode,
      });
      if (hasSystem) {
        return returnClient(hasSystem, ApiCodeEnum.PUBLIC_ERROR);
      }

      const hasMenu = await this.systemMenuService.validMenuCode({
        code: menuCode,
        systemCode,
      });
      if (hasMenu) {
        return returnClient(hasMenu, ApiCodeEnum.PUBLIC_ERROR);
      }

      const hasCode = await this.authMenuService.validAuthMenu({
        code,
        systemCode,
        menuCode,
      });
      if (hasCode) {
        return returnClient(hasCode, ApiCodeEnum.PUBLIC_ERROR);
      }

      const data = await this.authMenuService.createAuthMenu(authMenuDto, user);
      return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Get('list')
  @ApiOperation({
    summary: '获取权限点列表',
  })
  public async getSystemList(@Query() params: AuthMenuListDto) {
    try {
      const { menuCode, systemCode } = params;
      if (!menuCode || !systemCode) {
        return returnClient('缺少必要参数', ApiCodeEnum.PUBLIC_ERROR);
      }
      const data = await this.authMenuService.getAuthMenuList(params);
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('update')
  @ApiOperation({
    summary: '更新权限点',
  })
  public async updateAuthMenu(
    @Body() authMenuDto: UpdateAuthMenuDto,
    @CurrentUser() user,
  ) {
    try {
      const { id } = authMenuDto;
      if (!id) {
        return returnClient('缺少必要参数id', ApiCodeEnum.PUBLIC_ERROR);
      }
      const data = await this.authMenuService.updateAuthMenu(authMenuDto, user);
      return returnClient('修改成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('delete')
  @ApiOperation({
    summary: '删除权限点',
  })
  public async deleteAuthMenu(
    @Body() authMenuDto: DeleteAuthMenuDto,
    @CurrentUser() user,
  ) {
    try {
      const { code } = authMenuDto;
      if (!code) {
        return returnClient('缺少必要参数code', ApiCodeEnum.PUBLIC_ERROR);
      }
      const data = await this.authMenuService.deleteAuthMenu(authMenuDto, user);
      return returnClient('删除成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }
}
