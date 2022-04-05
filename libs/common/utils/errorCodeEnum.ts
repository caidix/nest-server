export enum ErrorCodeEnum {
  SUCCESS = 0, // 成功
  TOKEN_OVERDUE = 10001, // token过期
  USER_LOGGED = 10002, // 用户已登录
  PUBLIC_ERROR = 10086, // 常规报错

  NO_FIND_USER = 40001, // 找不到该用户
}
