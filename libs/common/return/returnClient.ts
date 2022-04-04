/**
 * 返回函数
 * @param {*} ctx 必填项
 * @param {*} Status 选填，默认200
 * @param {*} code 选填，默认0 0为成功，1为异常
 * @param {*} message
 * @param {*} data
 */

export function returnClient(
  status?: number | string,
  message?: number | string,
  code?: any,
  data?: any,
) {
  if (typeof status === 'string') {
    data = code || {};
    code = message || 0;
    message = status;
    status = 200;
    code = 0;
  }
  data = data || {};
  return {
    code,
    message,
    data,
    status,
  };
}
