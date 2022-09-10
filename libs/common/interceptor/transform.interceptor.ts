import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * 统一返回体拦截器， 对返回的内容进行统一的封装
 * 它无法捕获错误时的返回体
 */
interface Response<T> {
  data: T;
}
interface ResProps {
  status: number | string;
  message: number | string;
  code: number;
  data: any;
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((ctx, res) => {
        const { code, message, data, status } = ctx as any as ResProps;
        console.log({ ctx, res });

        return {
          code,
          data,
          status,
          message: message || '请求成功',
        };
      }),
    );
  }
}
