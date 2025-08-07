import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import type InvitationService from '../services/invitation.service';
import { invitationRule, scanRule } from '../validation/invitation.rule';
import AppResponse from '../../../core/utils/response';
import { invitationResponse } from '../responses/invitation.response';
import { metadataResponse } from '../../../core/server/responses/metadataResponse';

class InvitationController extends Controller {
  constructor(private readonly invitationService: InvitationService) {
    super();
  }

  async create(c: Context) {
    this.invitationService.dbReset();
    const data = this.validated(c, invitationRule);
    const inv = await this.invitationService.create({
      ...data,
      userId: c.get('user').id!,
      compoundId: c.get('compoundId'),
    });
    return this.json(c, AppResponse.created(invitationResponse(inv)));
  }

  async scan(c: Context) {
    this.invitationService.dbReset();
    const data = this.validated(c, scanRule);
    const inv = await this.invitationService.scan({ ...data, userId: c.get('user').id! });
    return this.json(c, AppResponse.success(invitationResponse(inv)));
  }

  async getInvitations(c: Context) {
    this.invitationService.dbReset();
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const [invitations, total] = await this.invitationService.getInvitations(c.get('compoundId'), page, limit);
    return this.json(
      c,
      AppResponse.success(
        invitations.map((i) => invitationResponse(i)),
        metadataResponse(total, page, limit),
      ),
    );
  }

  async getInvitationsByUser(c: Context) {
    this.invitationService.dbReset();
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const [invitations, total] = await this.invitationService.getInvitations(
      c.get('compoundId'),
      page,
      limit,
      c.get('user').id,
    );
    return this.json(
      c,
      AppResponse.success(
        invitations.map((i) => invitationResponse(i)),
        metadataResponse(total, page, limit),
      ),
    );
  }
}

export default InvitationController;
