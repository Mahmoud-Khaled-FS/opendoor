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
    const response: Record<string, any>[] = [];
    for (const service of services) {
      const indexOfCategory = response.findIndex((r) => r.category === service.category);
      if (indexOfCategory !== -1) response[indexOfCategory]!.services.push(compoundServiceResponse(service));
      else response.push({ category: service.category, services: [compoundServiceResponse(service)] });
    }
    return this.json(c, AppResponse.success(response));
  }
}

export default CompoundController;
