import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 定义统一的错误返回函数规则
 * service处使用 - 为httpException增加一个code返回，可以让前端通过code知晓错误原因
 */

export class ApiException extends HttpException {
  private readonly code: number;
  private readonly errorMessage: string;
  private readonly responseData: any;
  constructor(
    message: string,
    status: HttpStatus,
    code?: number,
    responseData?: any,
  ) {
    super(message, status);
    this.errorMessage = message;
    this.code = code;
    this.responseData = responseData || {};
  }
  getErrorCode() {
    return this.code;
  }
  getErrorMessage() {
    return this.errorMessage;
  }
  getResponseData() {
    return this.responseData;
  }
}
