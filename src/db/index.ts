import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Config } from '../config';

let orm: MikroORM;

export async function initDB() {
  orm = await MikroORM.init();

  if (Config.app.env === 'development') {
    await orm.getSchemaGenerator().updateSchema();
  }
  return orm;
}

export function getORM(): MikroORM {
  if (!orm) initDB();
  return orm;
}

export function db(): EntityManager {
  return orm.em.fork();
}
