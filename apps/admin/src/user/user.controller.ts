import type { User } from '@libs/db/entity/UserEntity';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'libs/common/decorator/current-user.decorator';
import { returnClient } from 'libs/common/return/returnClient';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/CreatUserDto';
import { LoginUserDto } from './dto/LoginUserDto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

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
  @ApiOperation({
    summary: '测试登录 jwt生成， redis单点验证',
  })
  @UseGuards(AuthGuard('local'))
  public async login(@Body() params: LoginUserDto, @CurrentUser() user) {
    try {
      if (user) {
        const { name, id } = user;
        const token = await this.authService.creatToken({
          name,
          id,
        });
        await this.authService.createRedisByToken({
          name,
          id,
          token: token.accessToken,
        });
        return returnClient('登录成功', 200, { token });
      }
    } catch (error) {}
    return { params };
  }

  @Get('test')
  public async test() {
    console.log({ configService: this.configService, pre: process.env.SECRET });
    return {};
  }
}
