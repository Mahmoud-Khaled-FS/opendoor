import crypto from 'node:crypto';

import Service from '../../../core/base/service';
import { Unit } from '../../compound/entities/unit.entity';
import { User } from '../../user/entities/user.entity';
import { Invitation } from '../entities/invitation.entity';
import type { InvitationRule, ScanRule } from '../validation/invitation.rule';
import AppError from '../../../core/utils/error';

class InvitationService extends Service {
  async create(data: InvitationRule & { userId: number }) {
    const user = this.db.getReference(User, data.userId);
    const inv = new Invitation();
    inv.inviter = user;
    inv.type = data.type;
    inv.status = 'active';
    inv.startAt = data.startAt;
    inv.endAt = data.endAt;
    inv.totalScanCount = data.totalScanCount ?? 0;
    inv.token = crypto.randomBytes(12).toString('hex');

    await this.db.persistAndFlush(inv);
    return inv;
  }

  async getAllForUser(userId: number) {
    const user = this.db.getReference(User, userId);
    return this.db.find(Invitation, { inviter: user });
  }

  async scan(data: ScanRule & { userId: number }) {
    let invitation = await this.db.findOne(Invitation, {
      token: data.token,
      inviter: data.userId,
    });

    invitation = this.validateInvitation(invitation);
    // TODO (MAHMOUD) - save user ip
    invitation.scanCount += 1;
    invitation.lastScanAt = new Date();
    await this.db.persistAndFlush(invitation);
    return invitation;
  }

  private validateInvitation(invitation: Invitation | null): Invitation {
    if (!invitation) {
      throw AppError.badRequest('Invitation not found or invalid!');
    }

    if (invitation.status !== 'active') {
      throw AppError.badRequest('Invitation is not active!');
    }

    if (invitation.type === 'one-time') {
      if (invitation.scanCount > 0) {
        throw AppError.badRequest('Invitation is already used!');
      }
    } else {
      if (invitation.totalScanCount && invitation.scanCount >= invitation.totalScanCount) {
        throw AppError.badRequest('Invitation is already used!');
      }
      if (invitation.endAt && invitation.endAt < new Date()) {
        throw AppError.badRequest('Invitation is expired!');
      }

      if (invitation.startAt && invitation.startAt > new Date()) {
        throw AppError.badRequest('Invitation is not active yet!');
      }
    }

    return invitation;
  }
}

export default InvitationService;
