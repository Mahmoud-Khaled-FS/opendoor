import { Hono } from 'hono';
import type { EntityManager } from '@mikro-orm/core';

import setupAuth from './modules/auth';
import setupUser from './modules/user';
import setupMedia from './modules/media';
import setupIntegration from './modules/invitation';
import setupCompound from './modules/compound';
import validJsonMiddleware from './core/server/middlewares/validJsonMiddleware';
import globalErrorHandling from './core/server/middlewares/globalErrorHandling';
import { authMiddleware } from './modules/auth/middlewares/isAuth';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import type { Unit } from './modules/compound/entities/unit.entity';

export async function server() {
  const app = new Hono();
  app.use(logger());
  app.onError(globalErrorHandling);

  app.use('/u/*', serveStatic({ root: './', rewriteRequestPath: (p) => p.replace(/^\/u/, '/storage/public') }));

  const api = new Hono();
  api.use('*', validJsonMiddleware);

  setupAuth(api);

  api.use(authMiddleware);

  setupUser(api);
  setupMedia(api);
  setupIntegration(api);
  setupCompound(api);

  app.route('/api/v1', api);
  return app;
}

declare module 'hono' {
  interface ContextVariableMap {
    em: EntityManager;
    body: any;
    user: { id: number; role: string }; // TODO (MAHMOUD) - create role enum
    unit: Unit;
    compoundId: number;
  }
}
