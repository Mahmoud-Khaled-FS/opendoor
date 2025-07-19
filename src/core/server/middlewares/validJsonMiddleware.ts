import type { Context, Next } from 'hono';
import AppError, { AppErrorCode } from '../../utils/error';
import { HttpStatus } from '../../utils/httpStatus';

async function validJsonMiddleware(c: Context, next: Next) {
  const contentType = c.req.header('content-type');
  if (contentType === 'application/json') {
    try {
      const body = await c.req.json();
      c.set('body', body);
    } catch (error) {
      c.status(HttpStatus.BAD_REQUEST);
      return c.json(AppError.badRequest('Invalid JSON', AppErrorCode.INVALID_JSON).toJSON());
    }
  }
  return next();
}

export default validJsonMiddleware;
