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
  CreateOrganizationDto,
  GetOrganizationListDto,
  GetUnOrganizationListDto,
  RelationOrganizationDto,
  TransferOrganizationDto,
  UpdateOrganizationDto,
} from './dto/OrganizationDto';
import { CurrentUser } from 'libs/common/decorator/current-user.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    @Inject(OrganizationService)
    private readonly organizationService: OrganizationService,
  ) {}

  @Post('create')
  @ApiOperation({
    summary: '创建组织',
  })
  public async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser() user,
  ) {
    const data = await this.organizationService.createOrganization(
      createOrganizationDto,
      user,
    );
    return returnClient('创建成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('delete')
  @ApiOperation({
    summary: '删除组织',
  })
  public async deleteOrganization(@Body('id') id: number, @CurrentUser() user) {
    const countUser = await this.organizationService.countUserByOrgId(id);
    if (countUser > 0) {
      return returnClient(
        '该组织存在关联的用户，请迁移/删除用户后再进行删除操作',
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
    const countChid = await this.organizationService.countChildOrganization(id);
    if (countChid > 0) {
      return returnClient(
        '该组织存在关联的子组织，请删除子组织后再进行删除操作',
        ApiCodeEnum.PUBLIC_ERROR,
      );
    }
    await this.organizationService.deleteOrganization([id], user);
    return returnClient('组织删除成功', ApiCodeEnum.SUCCESS);
  }

  @Get('all-list')
  @ApiOperation({
    summary: '获取组织列表',
  })
  public async getOrganizationList() {
    const data = await this.organizationService.getOrganizationList();
    return returnClient('获取成功', ApiCodeEnum.SUCCESS, data);
  }

  @Post('update')
  @ApiOperation({
    summary: '更新组织',
  })
  public async updateOrganization(
    @Body() organizationDto: UpdateOrganizationDto,
    @CurrentUser() user,
  ) {
    await this.organizationService.updateOrganization(organizationDto, user);
    return returnClient('更新应用成功', ApiCodeEnum.SUCCESS);
  }

  @Get('info')
  @ApiOperation({
    summary: '获取组织信息',
  })
  async info(@Query('id') id: number) {
    return await this.organizationService.organizationInfo(id);
  }

  @Post('transfer')
  @ApiOperation({
    summary: '用户转移组织',
  })
  async transfer(@Body() transferDto: TransferOrganizationDto) {
    await this.organizationService.transfer(
      transferDto.userIds,
      transferDto.organization,
    );
    return returnClient('用户转移组织成功', ApiCodeEnum.SUCCESS);
  }

  // @Post('delete-organizations')
  // @ApiOperation({
  //   summary: '批量删除组织',
  // })
  // public async deleteOrganizations(
  //   @Body('ids') ids: Array<number | string> = [],
  // ) {
  //   await this.organizationService.deleteOrganization(ids);
  //   return returnClient('应用批量删除成功', ApiCodeEnum.SUCCESS);
  // }

  // @Post('get-unorganization-users')
  // @ApiOperation({
  //   summary: '获取用户非关联组织列表',
  // })
  // public async getUnOrganizationUserList(
  //   @Body() dto: GetUnOrganizationListDto,
  // ) {
  //   const data = await this.organizationService.getUnOrganizationUserList(dto);
  //   return returnClient('获取非关联组织列表成功', ApiCodeEnum.SUCCESS, data);
  // }

  // @Post('get-organization-users')
  // @ApiOperation({
  //   summary: '获取用户关联组织列表',
  // })
  // public async getOrganizationUserList(@Body() dto: GetOrganizationListDto) {
  //   const data = await this.organizationService.getOrganizationUserList(dto);
  //   return returnClient('获取关联组织列表成功', ApiCodeEnum.SUCCESS, data);
  // }

  // @Post('relation-organization-user')
  // @ApiOperation({
  //   summary: '为组织关联用户',
  // })
  // public async relationOrgByUser(@Body() dto: RelationOrganizationDto) {
  //   const data = await this.organizationService.relationOrgByUser(dto);
  //   return returnClient('关联用户成功', ApiCodeEnum.SUCCESS, data);
  // }

  // @Get('get-user-organizations')
  // @ApiOperation({
  //   summary: '获取用户所关联的组织',
  // })
  // public async getUserOrganizationList(@CurrentUser() user) {
  //   const data = await this.organizationService.getUserOrganizationList(user);
  //   return returnClient('获取组织成功', ApiCodeEnum.SUCCESS, data);
  // }
}
