import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiException } from '../exception/ApiException';
import { ErrorCodeEnum } from '../utils/errorCodeEnum';

/**
 * 拦截错误返回统一响应体
 */
@Catch(HttpException)
export class ReturnClientFilter implements ExceptionFilter {
  catch(exception: HttpException | ApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    Logger.log('错误提示', exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    if (exception instanceof ApiException) {
      response.send({
        data: exception.getResponseData(), // 获取全部的错误信息
        message: exception.getErrorMessage(),
        code: exception.getErrorCode(), // 自定义code
        url: request.originalUrl, // 错误的url地址
      });
      return;
    }
    response.send({
      data: {},
      message: exception.message,
      code: ErrorCodeEnum.PUBLIC_ERROR,
      url: request.originalUrl,
    });
  }
}
