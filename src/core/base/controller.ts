import type { Context } from 'hono';
import type { Responsible } from '../types/response';
import { z, ZodObject } from 'zod';
import AppError, { AppErrorCode } from '../utils/error';
import { HttpStatus } from '../utils/httpStatus';

class Controller {
  protected json(c: Context, response: Responsible) {
    c.status(response.status());
    return c.json(response.toJSON());
  }

  protected validated<T extends ZodObject>(c: Context, schema: T): z.infer<T> {
    const body = c.get('body');

    const result = schema.safeParse(body);
    if (!result.success) {
      const pretty = z.flattenError(result.error);
      throw new AppError(pretty, HttpStatus.BAD_REQUEST, AppErrorCode.VALIDATION);
    }
    return body as z.infer<typeof schema>;
  }

  protected noContent(c: Context) {
    return c.body(null, HttpStatus.NO_CONTENT);
  }
}

export default Controller;
