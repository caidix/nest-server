import {
  IsEmail,
  IsInt,
  IsString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
// import { ApiErrorCode } from '../../../config/ApiApiCodeEnum';
import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from 'libs/common/types/PageDto';
import { RoleAuthType } from '@libs/db/entity/RoleAuthEntity';

export class CreateRoleGroupDto {
  @ApiProperty({ title: '角色分组名称', example: 'asd' })
  name: string;

  @ApiProperty({ title: '描述', example: 'asd' })
  desc?: string;
}

export class UpdateRoleGroupDto extends CreateRoleGroupDto {
  @ApiProperty({ title: '角色分组id', example: 1 })
  id: number;
}

export class DeleteRoleGroupDto {
  @ApiProperty({ title: '角色分组id', example: 1 })
  id: number;
}

export class CreateRoleDto {
  @ApiProperty({ title: '角色名称', example: 'asd' })
  name: string;

  @ApiProperty({ title: '描述', example: 'asd' })
  desc?: string;

  @ApiProperty({ title: '分组ID', example: 1 })
  roleGroupId: number;
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ title: '角色id', example: 1 })
  id: number;
}

export class SearchRoleDto extends PageDto {
  @ApiProperty({ title: '角色名称', example: 'asd' })
  name?: string;

  @ApiProperty({ title: '描述', example: 'asd' })
  desc?: string;

  @ApiProperty({ title: '分组ID', example: 1 })
  roleGroupId?: number;
}

export class SearchRoleAuthDto {
  roleId?: number;
  systemId?: number;
  type?: RoleAuthType;
}

export class SearchSystemRoleAuthDto {
  @ApiProperty({ title: '角色id', example: 12 })
  roleId: number;

  @ApiProperty({ title: '', example: RoleAuthType.Menu })
  type?: RoleAuthType;
}

export class RoleAuthBySystemDto {
  @ApiProperty({ title: '角色id' })
  roleId: number;

  @ApiProperty({ title: '系统id' })
  systemIds: number[];

  @ApiProperty({ title: '', example: RoleAuthType.System })
  type?: RoleAuthType;
}

export class RoleAuthByMenusDto {
  @ApiProperty({ title: '角色id' })
  roleId: number;

  @ApiProperty({ title: '系统id' })
  systemId: number;

  @ApiProperty({ title: '系统id' })
  menuIds: number[];

  @ApiProperty({ title: '', example: RoleAuthType.Menu })
  type?: RoleAuthType;
}

export class AppUserMenuDto {
  @ApiProperty({ title: '系统Code' })
  systemCode: string;
}
