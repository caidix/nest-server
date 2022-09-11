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
