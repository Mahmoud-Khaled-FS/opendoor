import { readFileSync } from 'node:fs';

import type { MiddlewareHandler } from 'hono';
import AppError, { AppErrorCode } from '../../../core/utils/error';
import { HttpStatus } from '../../../core/utils/httpStatus';
import JWT from '../../../core/utils/jwt';
import type { ID } from '../../../core/types/common';
import { Config } from '../../../config';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new AppError('Unauthorized', HttpStatus.UNAUTHORIZED, AppErrorCode.UNAUTHORIZED);
    c.status(error.status());
    return c.json(error.toJSON());
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    const error = new AppError('Unauthorized', HttpStatus.UNAUTHORIZED, AppErrorCode.UNAUTHORIZED);
    c.status(error.status());
    return c.json(error.toJSON());
  }

  try {
    const user = await JWT.verify<{ id: ID; role: string }>(
      token,
      readFileSync(Config.token.publicPath, { encoding: 'utf-8' }),
    );

    c.set('user', user);
    await next();
  } catch (err) {
    const error = new AppError('Invalid or expired token', HttpStatus.UNAUTHORIZED, AppErrorCode.UNAUTHORIZED);
    c.status(error.status());
    return c.json(error.toJSON());
  }
};
