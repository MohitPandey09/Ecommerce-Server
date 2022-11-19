export default class CustomError {
  status: number;
  message: string;
  info: string;

  constructor(status = 500, message: string, info: any = {}) {
    this.status = status;
    this.message = message;
    this.info = info;
  }
}
