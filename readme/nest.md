
## providers

在Nestjs 凡被 @Injectable 装饰的类 都是Providers

## Middleware中间件

> nest中间件拦截器与Express中基本保持一致，通过是否执行传入的next函数决定是否向后执行

1. 创建一个xx.middleware.ts文件

```js
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

 // **需要被Injectable装饰，如你所见它是一个** Provider
@Injectable() 
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

2. 使用

```js
// 1. 可以直接丢到provider数组里
providers: [XXMiddleware]

//2 . 全局使用. 在main.ts中直接use
app.use(XXMiddleware)

```

## filter 过滤器
> Nest中过滤器一般是指[异常处理]过滤器,他们开箱即用，返回一些指定的JSON信息

1. 基础异常类使用

```js
// HttpException是Nest内置的一个基础过滤器，使用它我们可以到一些 美观的内容返回
@Get()
async findAll() {
// 构造函数有两个必要的参数来决定响应: 一是返回体，二是Http状态吗
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
// 它将会返回如下内容
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

2. 自定义异常类

```js
// 定义 其实只是继承 HttpException类
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
// 使用
@Get()
async findAll() {
  throw new ForbiddenException();
}
```

3. 编写异常过滤类

首先 nest g f 创建filter 文件



```js
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

// @Catch() 装饰器绑定所需的元数据到异常过滤器上, 捕获类里产生的报错。
// 它告诉 Nest这个特定的过滤器正在寻找HttpException 而不是其他的。
// 在实践中，@Catch() 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤  器。
@Catch(HttpException)
export class ReturnClientFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // ArgumentsHost叫做参数主机，它是一个实用的工具, 我们能从中获取上下文context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const message = exception.message;
    Logger.log('错误提示', message);
    const errorResponse = {
      data: {
        error: message,
      }, // 获取全部的错误信息
      message: '请求失败',
      code: 1, // 自定义code
      url: request.originalUrl, // 错误的url地址
    };
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}

```

全局绑定

```js
// main.ts
// 一般来说 像上面的这个过滤器全局处理异常的，都应该作为全局使用
app.useGlobalFilters(new ReturnClientFilter());
```

局部绑定

```js

@Post()
@UseFilters(ReturnClientFilter()) // nest会为我们自动实例化它
async create(@Body() createDto: CreateDto) {
  throw new ForbiddenException();
}
```

## Interceptor 拦截器

首先 nest g in 创建拦截器

```js
// transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        console.log(data)
        return {
          data,
          code: 0,
          message: '请求成功',
        };
      }),
    );
  }
}
```

使用

```js
// main.ts
  app.useGlobalInterceptors(new TransformInterceptor());
```