import type { MiddlewareHandler } from 'hono';
import UnitService from '../services/unit.service';
import AppError from '../../../core/utils/error';
import { User } from '../../user/entities/user.entity';
import { db } from '../../../db';

export const validUnitMiddleware: MiddlewareHandler = async (c, next) => {
  const em = db();
  const unitId = c.req.header('X-Unit-Id');
  if (!unitId) {
    const err = AppError.unauthorized('Unit not found, X-Unit-Id header is required');
    c.status(err.status());
    return c.json(err.toJSON());
  }

  const unitService = new UnitService();
  const unit = await unitService.findById(Number(unitId));
  if (!unit) {
    const err = AppError.unauthorized('Unit not found, X-Unit-Id header is required valid unit id');
    c.status(err.status());
    return c.json(err.toJSON());
  }

  const user = em.getReference(User, c.get('user').id!);
  const exists = await em.count(User, {
    id: user.id,
    units: {
      id: unit.id,
    },
  });

  if (!exists) {
    const err = AppError.unauthorized('Unit not found, X-Unit-Id header is required valid unit id');
    c.status(err.status());
    return c.json(err.toJSON());
  }

  c.set('unit', unit);
  await next();
};
