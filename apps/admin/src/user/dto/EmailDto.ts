import { IsEmail, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailDto {
  @IsEmail({
    message: '邮箱格式不正确',
    context: { errorCode: 20004 },
  })
  @ApiProperty({ description: '邮箱', example: '615326423@qq.com' })
  email: string;

  // @IsString({
  //   message: '用户名格式有误',
  //   context: { errorCode: 20005 },
  // })
  // @ApiProperty({ description: '用户名', example: '轩宝' })
  // name: string;
}

export class VerifyEmailDto {
  @IsEmail({
    message: '邮箱格式不正确',
    context: { errorCode: 20004 },
  })
  @ApiProperty({ description: '邮箱', example: '615326423@qq.com' })
  email: string;

  @IsString({
    message: '验证码格式有误',
    context: { errorCode: 20005 },
  })
  @ApiProperty({ description: '用户名', example: 'DCgetT' })
  value: string;
}
