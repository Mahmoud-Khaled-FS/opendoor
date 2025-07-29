import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import AppResponse from '../../../core/utils/response';
import { compoundServiceResponse } from '../responses/compoundService.response';
import type CompoundService from '../services/compound.service';

class CompoundController extends Controller {
  constructor(private readonly compoundService: CompoundService) {
    super();
  }

  async services(c: Context) {
    this.compoundService.dbReset();
    const unit = c.get('unit')!;
    const services = await this.compoundService.getCompoundServices(unit.compound.id);
    return this.json(c, AppResponse.success(services));
  }
}

export default CompoundController;
