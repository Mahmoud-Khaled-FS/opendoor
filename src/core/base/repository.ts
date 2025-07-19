import { EntityRepository, type FilterQuery } from '@mikro-orm/postgresql';
import AppError from '../utils/error';

class BaseRepository<T extends object> extends EntityRepository<T> {
  async exists(cond: FilterQuery<T>): Promise<boolean> {
    const count = await this.count(cond);
    return count > 0;
  }

  async findOrFail(id: FilterQuery<T>): Promise<T> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw AppError.notFound();
    }
    return entity;
  }
}

export default BaseRepository;
