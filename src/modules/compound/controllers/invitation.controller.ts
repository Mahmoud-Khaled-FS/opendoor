import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import AppResponse from '../../../core/utils/response';
import type CompoundService from '../services/compound.service';
import { invitationRule } from '../validation/invitation.rule';
import { unitWithCompoundResponse } from '../responses/unit.response';
import { metadataResponse } from '../../../core/server/responses/metadataResponse';
import { userResponse } from '../../user/responses/user.response';
import AppError from '../../../core/utils/error';

class InvitationController extends Controller {
  constructor(private readonly compoundService: CompoundService) {
    super();
  }

  async getInvitations(c: Context) {
    this.compoundService.dbReset();
    const invitations = await this.compoundService.getInvitations(c.get('compoundId')!);
    return this.json(
      c,
      AppResponse.success(
        invitations.invitations,
        metadataResponse(invitations.count, Number(c.req.query('page')) || 1, Number(c.req.query('limit')) || 10),
      ),
    );
  }

  async create(c: Context) {
    this.compoundService.dbReset();
    const inv = await this.compoundService.createInvitationCode(c.get('compoundId')!, c.get('user').id!);
    return this.json(
      c,
      AppResponse.created({
        code: inv.code,
      }),
    );
  }

  async join(c: Context) {
    this.compoundService.dbReset();
    const data = this.validated(c, invitationRule);
    const unit = await this.compoundService.getInvitationCode(c.req.param('code'), data, c.get('user').id!);
    return this.json(
      c,
      AppResponse.created({
        unit: unitWithCompoundResponse(unit, c.get('user')),
      }),
    );
  }

  async acceptRequest(c: Context) {
    this.compoundService.dbReset();
    if (!c.req.param('userId') || isNaN(Number(c.req.param('userId')))) throw AppError.badRequest('Invalid user ID');
    const user = await this.compoundService.acceptRequest(c.get('compoundId'), Number(c.req.param('userId')));
    return this.json(c, AppResponse.success(userResponse(user)));
  }
}

export default InvitationController;
