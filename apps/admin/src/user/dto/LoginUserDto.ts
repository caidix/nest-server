import { IsString } from 'class-validator';
import { ApiCodeEnum } from 'libs/common/utils/apiCodeEnum';

export class LoginUserDto {
  name: string;
  @IsString({
    message: '用户名或者密码不正确',
    context: { errorCode: ApiCodeEnum.USER_PASSWORD_FAILED },
  })
  password: string;
}
