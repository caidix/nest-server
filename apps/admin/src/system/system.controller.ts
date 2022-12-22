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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'libs/common/decorator/current-user.decorator';
import { returnClient } from 'libs/common/return/returnClient';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { OrganizationService } from '../organization/organization.service';
import {
  CreateSystemDto,
  DeleteSystemDto,
  QuerySystemDto,
  QuerySystemListDto,
} from './dto/SystemDto';
import { SystemService } from './system.service';

@Controller('system')
@ApiTags('system')
@UseGuards(AuthGuard('jwt'))
export class SystemController {
  constructor(
    @Inject(SystemService) private readonly systemService: SystemService,
    @Inject(OrganizationService)
    private readonly organizationService: OrganizationService,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '获取应用列表',
  })
  public async getSystemList(
    @Query() params: QuerySystemListDto,
    @CurrentUser() user,
  ) {
    try {
      const data = await this.systemService.getSystemList(params, user);
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Get('all-list')
  @ApiOperation({
    summary: '获取所有应用列表',
  })
  public async getAllSystemList(@CurrentUser() user) {
    try {
      const data = await this.systemService.getAllSystemList(user);
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('create-system')
  @ApiOperation({
    summary: '创建应用',
  })
  public async createSystem(
    @Body() createSystemDto: CreateSystemDto,
    @CurrentUser() user: User,
  ) {
    try {
      // 判断系统是否存在
      const hasSystem = await this.systemService.validSystem(
        {
          name: createSystemDto.name,
          code: createSystemDto.code,
        },
        true,
      );
      if (hasSystem) {
        return returnClient(hasSystem, ApiCodeEnum.PUBLIC_ERROR);
      }

      // 判断组织是否存在
      const organizationCode = createSystemDto.organization;
      const hasOrganization =
        await this.organizationService.getOrganizationByMyself({
          code: organizationCode,
        });
      if (!hasOrganization) {
        return returnClient('所属应用组失效', ApiCodeEnum.PUBLIC_ERROR);
      }

      const data = await this.systemService.createSystem(createSystemDto, user);
      return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient('应用创建失败', error.code);
    }
  }

  @Post('update-system')
  @ApiOperation({
    summary: '更新应用',
  })
  public async updateSystem(@Body() systemDto: any, @CurrentUser() user: User) {
    await this.systemService.updateSystem(systemDto, user);
    return returnClient('更新应用成功', ApiCodeEnum.SUCCESS);
  }

  @Post('delete-system')
  @ApiOperation({
    summary: '删除应用',
  })
  public async deleteSystem(
    @Body() systemDto: DeleteSystemDto,
    @CurrentUser() user: User,
  ) {
    try {
      await this.systemService.deleteSystem(systemDto, user);
      return returnClient('删除应用成功', ApiCodeEnum.SUCCESS);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('system-detail')
  @ApiOperation({
    summary: '获取应用详情',
  })
  public async getSystemDetail(@Body() systemDto: QuerySystemDto) {
    const data = await this.systemService.getSystemDetail(systemDto);
    return returnClient('获取应用详情成功', ApiCodeEnum.SUCCESS, data);
  }
}
