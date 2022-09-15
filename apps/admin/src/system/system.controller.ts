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
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '获取应用列表',
  })
  public async getSystemList(@Query() params: QuerySystemListDto) {
    try {
      const data = await this.systemService.getSystemList(params);
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
      const hasSystem = await this.systemService.validSystem({
        name: createSystemDto.name,
        code: createSystemDto.code,
      });
      if (hasSystem) {
        return returnClient(hasSystem, ApiCodeEnum.PUBLIC_ERROR);
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
  public async updateSystem(@Body() systemDto: any) {
    await this.systemService.updateSystem(systemDto);
    return returnClient('更新应用成功', ApiCodeEnum.SUCCESS);
  }

  @Post('delete-system')
  @ApiOperation({
    summary: '删除应用',
  })
  public async deleteSystem(@Body() systemDto: DeleteSystemDto) {
    try {
      await this.systemService.deleteSystem(systemDto);
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
