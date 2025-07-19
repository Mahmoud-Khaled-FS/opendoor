import type { StatusCode } from 'hono/utils/http-status';
import type { Responsible } from '../types/response';
import { codeToString, HttpStatus } from './httpStatus';

interface AppResponseInterface {
  success: boolean;
  statusCode: number;
  data: unknown;
  metadata: unknown;
  message: string;
}

class AppResponse implements Responsible {
  private readonly message: string = '';

  constructor(
    private readonly data: unknown,
    private readonly statusCode: number,
    private readonly metadata?: unknown,
    message?: string,
  ) {
    this.message = message ?? codeToString(this.statusCode);
  }

  toJSON(): AppResponseInterface {
    return {
      success: true,
      data: this.data,
      statusCode: this.statusCode,
      metadata: this.metadata,
      message: this.message,
    };
  }

  static success(data: unknown, metadata: unknown = undefined, message?: string) {
    return new AppResponse(data, HttpStatus.OK, metadata, message);
  }

  static created(data: unknown, metadata: unknown = undefined, message?: string) {
    return new AppResponse(data, HttpStatus.CREATED, metadata, message);
  }

  static accepted(data: unknown, metadata: unknown = undefined, message?: string) {
    return new AppResponse(data, HttpStatus.ACCEPTED, metadata, message);
  }

  status(): StatusCode {
    return this.statusCode as StatusCode;
  }
}

export default AppResponse;
