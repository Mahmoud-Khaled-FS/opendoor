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
    const unit = c.get('unit')!;
    const services = await this.compoundService.getCompoundServices(unit.compound.id);
    const response: any = {};
    for (const service of services) {
      if (!response[service.category]) {
        response[service.category] = [];
      }
      response[service.category].push(compoundServiceResponse(service));
    }
    return this.json(c, AppResponse.success(response));
  }
}

export default CompoundController;
