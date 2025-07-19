import type { StatusCode } from 'hono/utils/http-status';
import { Config } from '../../config';
import type { Responsible } from '../types/response';
import { HttpStatus } from './httpStatus';

interface AppErrorInterface {
  success: boolean;
  message: string;
  statusCode: number;
  code: AppErrorCode;
  stack?: string[];
}

export enum AppErrorCode {
  UNKNOWN = 'UNKNOWN_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  VALIDATION = 'VALIDATION',
  PHONE_EXISTS = 'PHONE_EXISTS',
  INVALID_CONTENT_TYPE = 'INVALID_CONTENT_TYPE',
  INVALID_JSON = 'INVALID_JSON',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_REQUEST = 'INVALID_REQUEST',
}

class AppError extends Error implements Responsible {
  constructor(
    private readonly _message: any,
    private readonly statusCode: number,
    private readonly code: AppErrorCode,
    private readonly _stack?: string[],
  ) {
    super(_message);
  }

  toJSON() {
    let j: AppErrorInterface = {
      success: false,
      message: this._message,
      statusCode: this.statusCode,
      code: this.code,
    };
    if (Config.app.env === 'development') {
      j.stack = this._stack;
    }
    return j;
  }

  static badRequest(message: string, appError: AppErrorCode = AppErrorCode.INVALID_REQUEST, stack?: string[]) {
    return new AppError(message, HttpStatus.BAD_REQUEST, appError, stack);
  }

  static internal(message: string = 'Internal Server Error', stack?: string[]) {
    return new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR, AppErrorCode.UNKNOWN, stack);
  }

  static forbidden(message: string, appError: AppErrorCode, stack?: string[]) {
    return new AppError(message, HttpStatus.FORBIDDEN, AppErrorCode.UNKNOWN, stack);
  }

  static notFound(message: string = 'Entity Not Found', stack?: string[]) {
    return new AppError(message, HttpStatus.NOT_FOUND, AppErrorCode.NOT_FOUND, stack);
  }

  static unauthorized(message: string, stack?: string[]) {
    return new AppError(message, HttpStatus.UNAUTHORIZED, AppErrorCode.UNAUTHORIZED, stack);
  }

  status(): StatusCode {
    return this.statusCode as StatusCode;
  }
}

export default AppError;
