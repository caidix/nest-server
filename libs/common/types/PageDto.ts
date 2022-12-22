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

export class PageDto {
  @ApiProperty({ description: '页码', example: 1 })
  @IsNumber(
    { allowNaN: false },
    { message: '缺少当前页码', context: { errorCode: 12 } },
  )
  current: number;

  @ApiProperty({ description: '一页几行', example: 10 })
  @IsNumber({}, { message: '缺少当前页数', context: { errorCode: 12 } })
  pageSize: number;
}
