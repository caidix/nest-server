import {
  IsEmail,
  IsInt,
  IsString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
// import { ApiErrorCode } from '../../../config/ApiErrorCodeEnum';

export class CreateUserDto {
  @IsString({ message: '用户姓名格式不正确', context: { errorCode: 12 } })
  name: string;

  @IsString({ message: '用户年龄格式不准确', context: { errorCode: 12 } })
  age: string;

  @IsEmail({}, { message: '邮箱格式不正确', context: { errorCode: 12 } })
  email: string;

  @IsString({ message: '地址格式不正确', context: { errorCode: 12 } })
  address: string;

  @IsString({ message: '密码', context: { errorCode: 1 } })
  password: string;

  @IsNotEmpty({ message: '角色不能为空', context: { errorCode: 22 } })
  roleId: string;
  desc: string;

  nick: string;

  id: any;
  // 创建用户
  other: any;

  phone: string;
}
