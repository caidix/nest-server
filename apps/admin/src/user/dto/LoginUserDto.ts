import { IsString } from 'class-validator';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ title: '用户名', example: 'admin' })
  name: string;
  @ApiProperty({ title: '密码', example: '123456' })
  @IsString({
    message: '用户名或者密码不正确',
    context: { errorCode: ApiCodeEnum.USER_PASSWORD_FAILED },
  })
  password: string;
}
