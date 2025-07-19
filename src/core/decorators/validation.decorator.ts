import type { ZodSchema } from 'zod';

/**
 * This decorator is used to validate the request body
 * @param schema
 */
export function Validation(schema: ZodSchema, validateTarget: 'body' | 'query' | 'params' = 'body'): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const context = args[0];
      let target: unknown;
      if (validateTarget === 'body') {
        target = context.req.body();
      } else if (validateTarget === 'query') {
        target = context.req.query();
      } else if (validateTarget === 'params') {
        target = context.req.param();
      }

      const result = await schema.safeParseAsync(target);
      if (!result.success) {
        return context.json(result.error, 400);
      }

      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
