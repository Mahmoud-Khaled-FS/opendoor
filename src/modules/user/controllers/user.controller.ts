import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import type UserService from '../services/user.service';
import AppResponse from '../../../core/utils/response';
import { userResponse } from '../responses/user.response';
import { avatarRule, updateUserRule } from '../validation/user.rule';
import TempMediaService from '../../media/services/tempMedia.service';
import { unitWithCompoundResponse } from '../../compound/responses/unit.response';
import { invitationResponse } from '../../invitation/responses/invitation.response';

class UserController extends Controller {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async me(c: Context) {
    this.userService.dbReset();
    const user = c.get('user');

    return this.json(c, AppResponse.success(userResponse(await this.userService.findById(user.id))));
  }

  public async deleteMe(c: Context) {
    this.userService.dbReset();
    const user = c.get('user');

    await this.userService.delete(user.id);
    return this.noContent(c);
  }

  public async updateMe(c: Context) {
    this.userService.dbReset();
    const user = c.get('user');
    const userData = this.validated(c, updateUserRule);
    await this.userService.update(user.id, userData);
    return this.noContent(c);
  }

  public async updateAvatar(c: Context) {
    this.userService.dbReset();
    const user = c.get('user');
    const imageUUID = this.validated(c, avatarRule).avatar;
    const image = await new TempMediaService().saveMedia(imageUUID);
    await this.userService.update(user.id, { avatar: image });
    return this.noContent(c);
  }

  public async myUnits(c: Context) {
    this.userService.dbReset();
    const ud = c.get('user');
    const user = await this.userService.findById(ud.id);
    await user.units.load({ populate: ['compound', 'unitUsers'] });
    return this.json(c, AppResponse.success(user.units.map((unit) => unitWithCompoundResponse(unit, user))));
  }

  public async myInvitations(c: Context) {
    this.userService.dbReset();
    const ud = c.get('user');
    const user = await this.userService.findById(ud.id);
    await user.invitations.load();
    return this.json(c, AppResponse.success(user.invitations.map((inv) => invitationResponse(inv))));
  }
}

export default UserController;
