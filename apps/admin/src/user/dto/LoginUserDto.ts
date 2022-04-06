import { IsString } from 'class-validator';
import { ErrorCodeEnum } from 'libs/common/utils/errorCodeEnum';

export class LoginUserDto {
  name: string;
  @IsString({
    message: '用户名或者密码不正确',
    context: { errorCode: ErrorCodeEnum.USER_PASSWORD_FAILED },
  })
  password: string;
}
