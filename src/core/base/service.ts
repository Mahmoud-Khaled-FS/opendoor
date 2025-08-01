import type { EntityManager } from '@mikro-orm/core';
import { db } from '../../db';

abstract class Service {
  protected db: EntityManager;
  constructor() {
    this.db = db();
  }

  public async dbReset(): Promise<void> {
    this.db = db();
  }

  public getPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return {
      offset,
      limit,
    };
  }
}

export default Service;
