import { ReturnClientFilter } from 'libs/common/filters/return-client.filter';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/CreateRoleDto';
import { RoleService } from './role.service';
import { ApiException } from 'libs/common/exception/ApiException';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
@ApiBearerAuth()
@ApiTags('role')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(@Inject(RoleService) private readonly roleService: RoleService) {}

  @Post('add')
  @ApiOperation({
    summary: '创建权限role',
  })
  public async creatRole(@Body() createRoleDto: CreateRoleDto) {
    try {
      const res = await this.roleService.checkName(createRoleDto.name);
      if (res) {
        return '该角色已经存在';
      }
      await this.roleService.creatRole(createRoleDto);
      return '创建成功!';
    } catch (error) {
      return '出现异常';
    }
  }

  @Get('test')
  @ApiOperation({
    summary: '测试拦截器、装饰器、统一返回体',
  })
  public async test(@Param() something) {
    throw new ApiException('注册失败', 400, -1, {
      errorType: 'wowowom d的爱',
    });
    return {
      i: 1,
      b: 2,
    };
  }
  @Get('test2')
  @ApiOperation({
    summary: '测试拦截器、装饰器、统一返回体2',
  })
  public async test2(@Param() something) {
    throw new ApiException('注册失败', 400, -1, {
      errorType: 'wowowom d的爱',
    });
    return {
      i: 1,
      b: 2,
    };
  }
}
