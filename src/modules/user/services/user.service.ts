import { wrap } from '@mikro-orm/core';
import type BaseRepository from '../../../core/base/repository';
import Service from '../../../core/base/service';
import { User } from '../entities/user.entity';

class UserService extends Service {
  private readonly userRepo: BaseRepository<User>;
  constructor() {
    super();
    this.userRepo = this.db.getRepository(User);
  }

  async findById(id: number): Promise<User> {
    return this.userRepo.findOrFail(id);
  }

  async delete(id: number): Promise<void> {
    await this.db.removeAndFlush(this.db.getReference(User, id));
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    const user = await this.userRepo.findOrFail(id);
    wrap(user).assign(data, { mergeObjectProperties: true });
    await this.db.persistAndFlush(user);
  }
}

export default UserService;
