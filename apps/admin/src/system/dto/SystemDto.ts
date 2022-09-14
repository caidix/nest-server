import {
  IsEmail,
  IsInt,
  IsString,
  Min,
  Max,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuerySystemDto {
  @ApiProperty({ title: '应用名称或编码', example: '用户信息管理' })
  @IsString({ message: '系统值不正确', context: { errorCode: 1 } })
  search?: string;
  @ApiProperty({ title: '组织归属' })
  organization?: number;
  @ApiProperty({ title: '分页尺寸', example: 10 })
  size?: number;
  @ApiProperty({ title: '当前页', example: 1 })
  page?: number;
}

export class CreateSystemDto {
  @ApiProperty({ title: '应用名', example: '用户信息管理' })
  @IsString({ message: '应用名有误', context: { errorCode: 1 } })
  name: string;

  @ApiProperty({ title: '组织归属' })
  organization?: number;

  @ApiProperty({ title: '应用编码', example: '' })
  code: string;

  @ApiProperty({ title: '资源地址', example: '' })
  resourcesUrl: string;

  @ApiProperty({ title: '访问地址', example: '' })
  url: string;

  @ApiProperty({ title: '应用密钥', example: '' })
  appSecret?: string;

  @ApiProperty({ title: 'LOGO地址', example: '' })
  logoUrl?: string;

  @ApiProperty({ title: '描述', example: '' })
  desc?: string;
}

export class DeleteSystemDto {
  @ApiProperty({ title: 'id', example: 1 })
  @IsNumber()
  id: number;
}
