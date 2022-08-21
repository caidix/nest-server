import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { returnClient } from 'libs/common/return/returnClient';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { QuerySystemDto } from './dto/QuerySystemDto';
import { SystemService } from './system.service';

@Controller('system')
@ApiTags('system')
export class SystemController {
  constructor(
    @Inject(SystemService) private readonly systemService: SystemService,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '获取应用列表',
  })
  public async getSystemList(@Query() params: QuerySystemDto) {
    try {
      const data = await this.systemService.getSystemList(params);
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (e) {
      return {
        message: e.errorMessage,
        data: null,
        code: -1,
      };
    }
  }

  @Post('create-system')
  @ApiOperation({
    summary: '创建应用',
  })
  public async createSystem(@Body() createSystemDto: any) {
    try {
      const hasSystem = await this.systemService.getSystemByName(
        createSystemDto.name,
      );
      if (hasSystem) {
        return returnClient('应用名已重复', ApiCodeEnum.PUBLIC_ERROR);
      }
      const data = await this.systemService.createSystem(createSystemDto);
      return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, ApiCodeEnum.PUBLIC_ERROR);
    }
  }

  @Post('update-system')
  @ApiOperation({
    summary: '更新应用',
  })
  public async updateSystem(@Body() systemDto: any) {
    try {
      await this.systemService.updateSystem(systemDto);
      return returnClient('更新应用成功', ApiCodeEnum.SUCCESS);
    } catch (error) {
      return returnClient(error.errorMessage, ApiCodeEnum.PUBLIC_ERROR);
    }
  }
}
