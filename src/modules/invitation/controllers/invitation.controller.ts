import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import type InvitationService from '../services/invitation.service';
import { invitationRule, scanRule } from '../validation/invitation.rule';
import AppResponse from '../../../core/utils/response';
import { invitationResponse } from '../responses/invitation.response';

class InvitationController extends Controller {
  constructor(private readonly invitationService: InvitationService) {
    super();
  }

  async create(c: Context) {
    this.invitationService.dbReset();
    const data = this.validated(c, invitationRule);
    const inv = await this.invitationService.create({ ...data, userId: c.get('user').id!, unitId: c.get('unit').id! });
    return this.json(c, AppResponse.created(invitationResponse(inv)));
  }

  async scan(c: Context) {
    this.invitationService.dbReset();
    const data = this.validated(c, scanRule);
    const inv = await this.invitationService.scan({ ...data, userId: c.get('user').id!, unitId: c.get('unit').id! });
    return this.json(c, AppResponse.success(invitationResponse(inv)));
  }
}

export default InvitationController;
