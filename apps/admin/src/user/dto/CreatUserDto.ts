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

export class CreateUserDto {
  @ApiProperty({ title: '用户名', example: 'admin' })
  @IsString({ message: '用户姓名格式不正确', context: { errorCode: 12 } })
  name: string;

  @ApiProperty({ description: '年龄', example: 18 })
  @IsString({ message: '用户年龄格式不准确', context: { errorCode: 12 } })
  age: string;

  @ApiProperty({ description: '邮箱', example: '123456@qq.com' })
  @IsEmail({}, { message: '邮箱格式不正确', context: { errorCode: 12 } })
  email: string;

  @IsString({ message: '地址格式不正确', context: { errorCode: 12 } })
  address: string;

  @ApiProperty({ title: '密码', example: '123456' })
  @IsString({ message: '密码', context: { errorCode: 1 } })
  password: string;

  @ApiProperty({ description: '角色id', example: 18 })
  @IsNotEmpty({ message: '角色不能为空', context: { errorCode: 22 } })
  roleId: string;

  desc: string;

  @ApiProperty({ description: '验证码' })
  verifyCode: string;

  @ApiProperty({
    description: '是否需要验证码，隐藏的逻辑，方便自身swagger注册用',
  })
  needVerifyCode: boolean;

  phone: string;

  nick: string;
}
