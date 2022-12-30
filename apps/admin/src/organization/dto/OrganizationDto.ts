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

export class GetOrganizationListDto {
  @ApiProperty({ title: '组织id', example: 1 })
  id: number;
}

export class GetUnOrganizationListDto extends PageDto {
  @ApiProperty({ title: '组织id', example: 1 })
  id: number;
}

export class RelationOrganizationDto {
  @ApiProperty({ title: '组织id', example: 1 })
  id: number;
  @ApiProperty({ title: '用户id数组', example: [2, 3] })
  userIds: number[];
}

export class CreateOrganizationDto {
  @ApiProperty({ title: '组织名称', example: 'asd' })
  name: string;

  @ApiProperty({ title: '组织概述', example: 'asd' })
  desc?: string;

  @ApiProperty({ title: '父级id' })
  parentId?: number;

  @ApiProperty({ title: '组织排序' })
  sort?: number;
}

export class UpdateOrganizationDto extends CreateOrganizationDto {
  @ApiProperty({ title: '组织id', example: 1 })
  id: number;
}

export class DeleteOrganizationDto {
  @ApiProperty({ title: '父级id' })
  parentId?: number;
}
export class TransferOrganizationDto {
  @ApiProperty({ description: '需要转移的用户列表编号', type: [Number] })
  userIds: number[];

  @ApiProperty({ description: '需要转移过去的系统部门ID' })
  @IsInt()
  @Min(0)
  organization: number;
}
