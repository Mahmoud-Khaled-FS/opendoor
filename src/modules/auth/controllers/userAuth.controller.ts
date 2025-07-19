import type { Context } from 'hono';
import { loginRule, refreshRule, registerRule } from '../validation/auth.rule';
import type UserAuthService from '../services/userAuth.service';
import AppResponse from '../../../core/utils/response';
import Controller from '../../../core/base/controller';
import { authUserResponse } from '../responses/auth.response';

class UserAuthController extends Controller {
  constructor(private readonly authService: UserAuthService) {
    super();
  }

  public async login(c: Context) {
    const credentials = this.validated(c, loginRule);
    const res = await this.authService.login(credentials);

    return this.json(c, AppResponse.success(authUserResponse(res.user, res.accessToken, res.refreshToken)));
  }

  public async register(c: Context) {
    const userData = this.validated(c, registerRule);
    const res = await this.authService.register(userData);

    return this.json(c, AppResponse.created(authUserResponse(res.user, res.accessToken, res.refreshToken)));
  }

  public async refresh(c: Context) {
    const token = this.validated(c, refreshRule).refreshToken;

    const res = await this.authService.refresh(token);
    return this.json(c, AppResponse.created(res));
  }
}

export default UserAuthController;
