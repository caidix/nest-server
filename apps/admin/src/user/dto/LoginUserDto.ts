import { IsString } from 'class-validator';
import { ErrorCode } from 'config/ErrorCodeEnum';

export class LoginUserDto {
  name: string;
  @IsString({
    message: '用户名或者密码不正确',
    context: { errorCode: ErrorCode.USER_PASSWORD_FAILED },
  })
  password: string;
}
