import { readFileSync } from 'node:fs';

import AppError, { AppErrorCode } from '../../../core/utils/error';
import Hash from '../../../core/utils/hash';
import { HttpStatus } from '../../../core/utils/httpStatus';
import JWT from '../../../core/utils/jwt';
import { User } from '../../user/entities/user.entity';
import type { LoginRule, RegisterRule } from '../validation/auth.rule';
import { Config } from '../../../config';
import Service from '../../../core/base/service';
import type { ID } from '../../../core/types/common';
import { TokenBlackList } from '../entities/tokenBlackList.entity';
import type BaseRepository from '../../../core/base/repository';

class UserAuthService extends Service {
  private readonly userRepo: BaseRepository<User>;
  constructor() {
    super();
    this.userRepo = this.db.getRepository(User);
  }
  async login(credentials: LoginRule) {
    const userExists = await this.userRepo.findOne({ phone: credentials.phone });
    if (!userExists) {
      throw new AppError('Invalid Credentials', HttpStatus.BAD_REQUEST, AppErrorCode.INVALID_CREDENTIALS);
    }
    if (!Hash.verify(userExists.password, credentials.password)) {
      throw new AppError('Invalid Credentials', HttpStatus.BAD_REQUEST, AppErrorCode.INVALID_CREDENTIALS);
    }
    const { access, refresh } = await this.createTokens(userExists.id);
    return {
      user: userExists,
      accessToken: access,
      refreshToken: refresh,
    };
  }

  async register(userData: RegisterRule) {
    const userExists = await this.userRepo.exists({ phone: userData.phone });
    if (userExists) {
      throw new AppError('Phone already Exists', HttpStatus.BAD_REQUEST, AppErrorCode.PHONE_EXISTS);
    }

    const hashPassword = await Hash.make(userData.password);
    const user = new User();
    user.fullName = userData.fullName;
    user.password = hashPassword;
    user.phone = userData.phone;
    user.email = userData.email;
    await this.db.persist(user).flush();
    const { access, refresh } = await this.createTokens(user.id);
    return { user, accessToken: access, refreshToken: refresh };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const data = await JWT.verify<{ id: ID; exp: number }>(
      refreshToken,
      readFileSync(Config.token.publicPath, { encoding: 'utf-8' }),
    );

    const tokenExists = await this.db.findOne(TokenBlackList, {
      user: data.id,
      type: 'refresh',
      token: refreshToken,
    });

    if (tokenExists) {
      throw AppError.unauthorized('Refresh token used before!');
    }

    const { access, refresh } = await this.createTokens(data.id);
    const tbl = new TokenBlackList();
    tbl.exp = data.exp;
    tbl.user = this.db.getReference(User, data.id);
    tbl.token = refreshToken;
    tbl.type = 'refresh';
    await this.db.persistAndFlush(tbl);
    return { accessToken: access, refreshToken: refresh };
  }

  private async createTokens(id: ID): Promise<{ access: string; refresh: string }> {
    const access = await JWT.make(
      { id: id, role: 'user' },
      readFileSync(Config.token.privatePath, { encoding: 'utf8' }),
      Math.floor(+Config.token.accessExp),
    );
    const refresh = await JWT.make(
      { id: id, role: 'user' },
      readFileSync(Config.token.privatePath, { encoding: 'utf8' }),
      Math.floor(+Config.token.refreshExp),
    );
    return { access, refresh };
  }
}

export default UserAuthService;
