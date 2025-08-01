import type { MiddlewareHandler } from 'hono';
import AppError from '../../../core/utils/error';
import { db } from '../../../db';
import { Unit } from '../entities/unit.entity';
import { Compound } from '../entities/compound.entity';

export const validCompoundMiddleware: MiddlewareHandler = async (c, next) => {
  const em = db();
  const compoundId = Number(c.req.header('X-Compound-Id'));
  if (!compoundId) {
    const err = AppError.unauthorized('Compound not found, X-Compound-Id header is required');
    c.status(err.status());
    return c.json(err.toJSON());
  }

  const isCompoundRelationExists = await em.count(Unit, {
    compound: em.getReference(Compound, compoundId),
    users: {
      id: c.get('user').id,
    },
  });

  if (!isCompoundRelationExists) {
    const err = AppError.unauthorized('Compound not found, X-Compound-Id header is required valid compound id');
    c.status(err.status());
    return c.json(err.toJSON());
  }

  c.set('compoundId', compoundId);
  await next();
};
