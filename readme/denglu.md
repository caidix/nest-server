# 登录鉴权

> 登录的策略一般分为两种，一种是登录接口登录时需要的登录策略，一种是登录获取token之后验证token的策略， 这里我们使用的就是市面上比较通俗的，也是官方推荐的passport来做策略管理

## 安装依赖

```js
pnpm add @nestjs/passport passport passport-local passport-jwt bcryptjs
// 类型提示
pnpm add @types/passport @types/passport-jwt @types/passport-local -D
```

接下来我们需要书写拦截器，也就是下面所说的策略类，来为我们的登录生成jwt和接口鉴权提供帮助.
我们知道拦截器的作用有下面几点：

- 在函数执行之前/之后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据所选条件完全重写函数 (例如, 缓存目的)

这类被看作在接口调用前后做处理的函数，在nest中需要添加@Injectable装饰器，他能告诉nest被装饰的函数是需要被注入的，同时nest会在构造函数中声明依赖。比如在constructor内注入某个service时， 如果这个类没有增加@Injectable装饰器, 它是无法获取到依赖的服务的。例如

```js
// @Injectable 装饰的类 都是Providers ，他们都可以通过 constructor 注入依赖关系
// @Injectable() 不使用Injectable
export class XXXX extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) { }
  async validate(payload: string, done: any) {
    // 报错，无法找到this.authService实例
    const user = await this.authService.validateUser(payload);
  }
}
```

下面我们就来书写登录前置的demo

## 创建本地登录、token策略类

> 创建一个文件来书写策略，这里命名为 local.strategy.ts

```js
export class LocalStrategy extends PassportStrategy(Strategy, 'local')// local为校验策略名字 
{
  constructor(
    @InjectModel(User) private userModel,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }
  // super会从request数据包里拿到请求过来的字段名，并带给validate函数进行校验验证
  // 我们就需要在validate里写验证的逻辑，它代表如何去校验这个策略
  async validate(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select('+password');
    if (!user) {
      throw new BadRequestException('用户名不正确');
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码不正确');
    }
    return user;
  }
}

```

## 生成TOKEN

> 这里采用nestjs官方生成jwt的包，我们到我们common的公共包里，注入jwt的模块
> 
```js
pnpm add @nestjs/jwt
```


```js
import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
/**
 * 用于注入环境变量
 * Global 标记该模块为全局模块
 * 当我们引用了Common模块之后再任意地方都可以引用common模块里面引用的东西
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // 实现环境变量全局化
      isGlobal: true,
    }),
    // 异步全局注入jwt模块， useFactory里return原本同步时应该传入的参数
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env.JWT_SECRET,
        };
      },
    }),
    DbModule,
  ],
  providers: [CommonService],
   // JwtModule 在common模块被引用了，我们需要把他导出成公共的模块，让其他的模块也可以引用
  exports: [CommonService, JwtModule],
})
export class CommonModule {}

```

当我们导入了jwt模块后，我们就可以在别的模块的控制器内增加jwt的散列，调用其中的服务

```js
// xxx.controller.ts

import {JwtService} from '@nestjs/jwt'
export class XXController {
  constructor(
    private jwtService: JwtService
  )

  xx() {
    // 生成jsonwebtoken的方法。传入一个唯一的id，可以是某一个表的主键，这样生成的jwt就是唯一的
    this.jwtService.sign(xx.id)

  }
}
```

> 接下来我们为swagger增加 填写 bearer token的功能..

```js
// main.ts
const options = new DocumentBuilder()
    .setTitle('xx')
    .setDescription('xxx')
    .addBearerAuth() // 增加bearer
```

## 创建校验tokenJWT策略类

> 创建jwt.strategy.ts文件

```js
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './AuthService';
import {JwtPayloadToken} from './interfaces/JwtPayloadJwtPayloadInterfface';
import {ApiException} from '../error/exceptions/ApiException';
import {ApiErrorCode} from '../../config/ApiErrorCodeEnum';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  /**
   * 这里的构造函数向父类传递了授权时必要的参数，在实例化时，父类会得知授权时，客户端的请求必须使用 Authorization 作为请求头，
   * 而这个请求头的内容前缀也必须为 Bearer，在解码授权令牌时，使用秘钥 secretOrKey: 'secretKey' 来将授权令牌解码为创建令牌时的 payload。
   */
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'xxxxxxxxxx',
    });
  }

  /**
   * validate 方法实现了父类的抽象方法，在解密授权令牌成功后，即本次请求的授权令牌是没有过期的，
   * 此时会将解密后的 payload 作为参数传递给 validate 方法，这个方法需要做具体的授权逻辑，比如这里我使用了通过用户名查找用户是否存在。
   * 当用户不存在时，说明令牌有误，可能是被伪造了，此时需抛出 UnauthorizedException 未授权异常。
   * 当用户存在时，会将 user 对象添加到 req 中，在之后的 req 对象中，可以使用 req.user 获取当前登录用户。
   */
  async validate(payload: JwtPayloadToken, done: any) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      return done(new ApiException('token无效', ApiErrorCode.TOKEN_FAIL, 30001), false);
      // return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}

```

最后将其引用进auth.module

## 自定义装饰器

> 创建获取当前用户信息的装饰器。 通过上面的jwt鉴权后 ，我们可以在req中拿到jwt模块帮我们注入的user信息，通过装饰器快速提取user的信息

```js
// 新建文件current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest()
  return req.user
})
```

## 使用策略

1. 打开我们的controller文件
2. 从nestjs/common中引入 UseGuards 装饰器
3. 将UseGuards装饰器以：UseGuards('local') 的形式加在路由上

用什么策略加在路由或是类上。

```js
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@UseGuards(AuthGuard('local'))
class xxx{}
```
