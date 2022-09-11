import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { returnClient } from 'libs/common/return/returnClient';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { OrganizationService } from './organization.service';
import { AuthGuard } from '@nestjs/passport';
import {
  GetOrganizationListDto,
  GetUnOrganizationListDto,
  RelationOrganizationDto,
} from './dto/QueryOrganizationDto';

@ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
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
    const data = await this.organizationService.getOrganizationList(params);
    return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('create-organization')
  @ApiOperation({
    summary: '创建用户组',
  })
  public async createOrganization(@Body() createOrganizationDto: any) {
    const hasOrg = await this.organizationService.getOrganizationByMyself({
      code: createOrganizationDto.code,
    });
    if (hasOrg) {
      return returnClient('用户组编码已重复', ApiCodeEnum.PUBLIC_ERROR);
    }
    const data = await this.organizationService.createOrganization(
      createOrganizationDto,
    );
    return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('update-organization')
  @ApiOperation({
    summary: '更新用户组',
  })
  public async updateOrganization(@Body() systemDto: any) {
    await this.organizationService.updateOrganization(systemDto);
    return returnClient('更新应用成功', ApiCodeEnum.SUCCESS);
  }

  @Post('delete-organization')
  @ApiOperation({
    summary: '删除用户组',
  })
  public async deleteOrganization(@Body('id') id: number | string) {
    await this.organizationService.deleteOrganization([id]);
    return returnClient('应用删除成功', ApiCodeEnum.SUCCESS);
  }

  @Post('delete-organizations')
  @ApiOperation({
    summary: '批量删除用户组',
  })
  public async deleteOrganizations(
    @Body('ids') ids: Array<number | string> = [],
  ) {
    await this.organizationService.deleteOrganization(ids);
    return returnClient('应用批量删除成功', ApiCodeEnum.SUCCESS);
  }

  @Post('get-unorganization-users')
  @ApiOperation({
    summary: '获取用户非关联用户组列表',
  })
  public async getUnOrganizationUserList(
    @Body() dto: GetUnOrganizationListDto,
  ) {
    const data = await this.organizationService.getUnOrganizationUserList(dto);
    return returnClient('获取非关联用户组列表成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('get-organization-users')
  @ApiOperation({
    summary: '获取用户关联用户组列表',
  })
  public async getOrganizationUserList(@Body() dto: GetOrganizationListDto) {
    const data = await this.organizationService.getOrganizationUserList(dto);
    return returnClient('获取关联用户组列表成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('relation-organization-user')
  @ApiOperation({
    summary: '为组织关联用户',
  })
  public async relationOrgByUser(@Body() dto: RelationOrganizationDto) {
    const data = await this.organizationService.relationOrgByUser(dto);
    return returnClient('关联用户成功', ApiCodeEnum.SUCCESS, data);
  }
}
