import type { Context } from 'hono';
import AppError from '../../utils/error';
import { HttpStatus } from '../../utils/httpStatus';
import { Config } from '../../../config';

function globalErrorHandling(err: Error, c: Context): Promise<Response> {
  if (Config.app.env === 'development') console.error(err);
  if (err instanceof AppError) {
    c.status(err.status());
    /** @ts-ignore */
    return c.json(err.toJSON(), err.status());
  }
  c.status(HttpStatus.INTERNAL_SERVER_ERROR);
  /** @ts-ignore */
  return c.json(AppError.internal().toJSON());
}

export default globalErrorHandling;
