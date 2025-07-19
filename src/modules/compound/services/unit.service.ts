import type BaseRepository from '../../../core/base/repository';
import Service from '../../../core/base/service';
import { Unit } from '../entities/unit.entity';

class UnitService extends Service {
  private readonly unitRepo: BaseRepository<Unit>;
  constructor() {
    super();
    this.unitRepo = this.db.getRepository(Unit);
  }

  async findById(id: number): Promise<Unit | null> {
    return await this.unitRepo.findOne({ id });
  }
}

export default UnitService;
