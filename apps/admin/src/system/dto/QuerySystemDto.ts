import {
  IsEmail,
  IsInt,
  IsString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuerySystemDto {
  @ApiProperty({ title: '应用名', example: '用户信息管理' })
  @IsString({ message: '系统值不正确', context: { errorCode: 1 } })
  name?: string;
  @ApiProperty({ title: '组织归属' })
  organization?: number;
  @ApiProperty({ title: '分页尺寸', example: 10 })
  size?: number;
  @ApiProperty({ title: '当前页', example: 1 })
  page?: number;
}
