import type { EntityManager } from '@mikro-orm/core';
import { db } from '../../db';

abstract class Service {
  protected db: EntityManager;
  constructor() {
    this.db = db();
  }
}

export default Service;
