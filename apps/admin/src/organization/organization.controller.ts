import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { returnClient } from 'libs/common/return/returnClient';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { OrganizationService } from './organization.service';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    @Inject(OrganizationService)
    private readonly organizationService: OrganizationService,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '获取用户组列表',
  })
  public async getOrganizationList(@Query() params: any) {
    try {
      const data = await this.organizationService.getOrganizationList(params);
      return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('create-organization')
  @ApiOperation({
    summary: '创建用户组',
  })
  public async createOrganization(@Body() createOrganizationDto: any) {
    try {
      const hasOrg = await this.organizationService.getOrganizationByName(
        createOrganizationDto.name,
      );
      if (hasOrg) {
        return returnClient('用户组已重复', ApiCodeEnum.PUBLIC_ERROR);
      }
      const data = await this.organizationService.createOrganization(
        createOrganizationDto,
      );
      return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('update-organization')
  @ApiOperation({
    summary: '更新用户组',
  })
  public async updateOrganization(@Body() systemDto: any) {
    try {
      await this.organizationService.updateOrganization(systemDto);
      return returnClient('更新应用成功', ApiCodeEnum.SUCCESS);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('delete-organization')
  @ApiOperation({
    summary: '删除用户组',
  })
  public async deleteOrganization(@Body() id: number | string) {
    try {
      await this.organizationService.deleteOrganization([id]);
      return returnClient('应用删除成功', ApiCodeEnum.SUCCESS);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }

  @Post('delete-organizations')
  @ApiOperation({
    summary: '批量删除用户组',
  })
  public async deleteOrganizations(@Body() ids: Array<number | string> = []) {
    try {
      await this.organizationService.deleteOrganization(ids);
      return returnClient('应用批量删除成功', ApiCodeEnum.SUCCESS);
    } catch (error) {
      return returnClient(error.errorMessage, error.code);
    }
  }
}
