import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import AppResponse from '../../../core/utils/response';
import { compoundServiceResponse } from '../responses/compoundService.response';
import type CompoundService from '../services/compound.service';
import { userResponse } from '../../user/responses/user.response';
import { metadataResponse } from '../../../core/server/responses/metadataResponse';
import type { User } from '../../user/entities/user.entity';

class CompoundController extends Controller {
  constructor(private readonly compoundService: CompoundService) {
    super();
  }

  async services(c: Context) {
    this.compoundService.dbReset();
    // const unit = c.get('unit')!;
    const services = await this.compoundService.getCompoundServices(1); // FIXED (MAHMOUD) - Remove static compound id
    const response: Record<string, any>[] = [];
    for (const service of services) {
      const indexOfCategory = response.findIndex((r) => r.category === service.category);
      if (indexOfCategory !== -1) response[indexOfCategory]!.services.push(compoundServiceResponse(service));
      else response.push({ category: service.category, services: [compoundServiceResponse(service)] });
    }
    return this.json(c, AppResponse.success(response));
  }

  async users(c: Context) {
    this.compoundService.dbReset();
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    let users: User[];
    let total: number;
    if (c.req.query('suspended') === 'true') {
      [users, total] = await this.compoundService.getUserRequest(c.get('compoundId'), page, limit);
    } else {
      [users, total] = await this.compoundService.getCompoundUsers(c.get('compoundId'), page, limit);
    }
    return this.json(
      c,
      AppResponse.success(
        users.map((u) => userResponse(u)),
        metadataResponse(total, page, limit),
      ),
    );
  }
}

export default CompoundController;
