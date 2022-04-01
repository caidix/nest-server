import type { User } from '@libs/db/entity/UserEntity';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/CreatUserDto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: '用户注册',
  })
  public async createUser(@Body() createUserDto: CreateUserDto) {
    const userInfo: User = await this.userService.findSpecifiedUser(
      createUserDto.name,
    );
    console.log(createUserDto, userInfo);
    if (userInfo) {
      return {
        message: '用户名被占用',
        data: userInfo,
        code: -1,
      };
    }
    try {
      await this.userService.createUser(createUserDto);
      return {
        message: '注册成功',
        data: userInfo,
        code: 0,
      };
    } catch (e) {
      return {
        message: e.errorMessage,
        data: userInfo,
        code: -1,
      };
    }
  }

  @Post('login')
  public async login() {
    return {};
  }
}
