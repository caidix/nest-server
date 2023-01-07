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
