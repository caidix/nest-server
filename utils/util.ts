/* eslint-disable prettier/prettier */
type ReturnClientProps = {
  code: number;
  message: string;
  data: any;
  success: boolean;
};
export class returnClient {
  public code: number;
  public message: string;
  public data: any;
  public success: boolean;
  constructor(code: number, message = '', data = null, success = true) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.success = success;
  }
}
