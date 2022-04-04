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
      map((data, res) => {
        const { message, code } = res as any as ResProps;
        return {
          data,
          code,
          message: message || '请求成功',
        };
      }),
    );
  }
}
