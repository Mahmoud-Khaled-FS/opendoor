import crypto from 'node:crypto';

import Service from '../../../core/base/service';
import AppError from '../../../core/utils/error';
import { User } from '../../user/entities/user.entity';
import { Announcement } from '../entities/announcement.entity';
import { Compound } from '../entities/compound.entity';
import { CompoundInvitationCode } from '../entities/invitationCode.entity';
import { Unit } from '../entities/unit.entity';
import type { InvitationRule } from '../validation/invitation.rule';
import { UserUnitRole } from '../constant/userUnitRole.enum';
import { UnitUser } from '../entities/unitUser.entity';
import { buildUrl } from '../../../core/utils/url';

class CompoundService extends Service {
  async getCompoundServices(id: number) {
    const compound = await this.db.findOne(Compound, { id }, { populate: ['services'] });
    if (!compound) throw AppError.notFound('Compound not found');
    return compound.services;
  }

  async getCompoundAnnouncements(id: number) {
    const compound = await this.db.findOne(Compound, { id }, { populate: ['announcements'] });
    if (!compound) throw AppError.notFound('Compound not found');
    return compound.announcements;
  }

  async voteAnnouncement(compoundId: number, announcementId: number, index: number) {
    const announcement = await this.db.findOne(Announcement, { id: announcementId, compound: { id: compoundId } });
    if (!announcement) {
      throw AppError.notFound('Announcement not found');
    }

    if (announcement.type !== 'voting') {
      throw AppError.badRequest('Announcement is not voting type');
    }

    if (index < 0 || index >= announcement.answers.length) {
      throw AppError.badRequest('Invalid index');
    }

    announcement.answers[index].votes += 1;
    await this.db.persistAndFlush(announcement);
    return announcement;
  }

  async getCompoundUsers(id: number, page: number, limit: number) {
    const unitsIds = await this.db.find(Unit, { compound: { id } }, { fields: ['id'] });
    const users = await this.db.findAndCount(
      User,
      { units: { id: { $in: unitsIds.map((u) => u.id) } }, unitUsers: { status: 'active' } },
      {
        limit,
        offset: this.getPagination(page, limit).offset,
        populate: ['unitUsers.unit', 'units'],
      },
    );
    return users;
  }

  async getUserRequest(id: number, page: number, limit: number) {
    const users = await this.db.findAndCount(
      User,
      { unitUsers: { status: 'suspended', unit: { id } } },
      { limit, offset: this.getPagination(page, limit).offset, populate: ['unitUsers.unit'] },
    );
    return users;
  }

  async createInvitationCode(compoundId: number, userId: number): Promise<CompoundInvitationCode> {
    const code = crypto.randomBytes(8).toString('hex');
    const inv = await this.db.findOne(CompoundInvitationCode, { code, compound: { id: compoundId } });
    if (inv) return this.createInvitationCode(compoundId, userId);
    const newInv = new CompoundInvitationCode();
    newInv.code = code;
    newInv.user = this.db.getReference(User, userId);
    const compound = await this.db.findOne(Compound, { id: compoundId });
    if (!compound) throw AppError.notFound('Compound not found');
    newInv.compound = compound;
    await this.db.persistAndFlush(newInv);
    return newInv;
  }

  async getInvitationCode(code: string, data: InvitationRule, userId: number) {
    const inv = await this.db.findOne(CompoundInvitationCode, { code });
    if (!inv) throw AppError.notFound('Invitation code not found');
    const compound = inv.compound;

    const unit = new Unit();
    unit.name = data.unitName;
    unit.compound = compound;
    const user = await this.db.findOne(User, { id: userId });
    if (!user) throw AppError.notFound('User not found');
    const unitUser = this.db.create(UnitUser, {
      unit: unit,
      user: user,
      role: UserUnitRole.OWNER,
      status: 'suspended',
    });

    await this.db.nativeDelete(CompoundInvitationCode, inv);

    this.db.persist([unit, unitUser]);
    await this.db.flush();
    return unit;
  }

  async getInvitations(compoundId: number) {
    const compound = await this.db.findOne(Compound, { id: compoundId });
    if (!compound) throw AppError.notFound('Compound not found');
    const [invitations, count] = await this.db.findAndCount(
      CompoundInvitationCode,
      { compound: { id: compoundId } },
      { populate: ['user'] },
    );
    return {
      invitations: invitations.map((i) => ({
        id: i.id,
        code: i.code,
        createdBy: {
          id: i.user.id,
          fullName: i.user.fullName,
          avatar: i.user.avatar && buildUrl('/u' + i.user.avatar),
        },
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
      count,
    };
  }

  async acceptRequest(compoundId: number, userId: number) {
    const user = await this.db.findOne(User, { id: userId });
    if (!user) throw AppError.notFound('User not found');
    const unitUser = await this.db.findOne(UnitUser, {
      user: { id: userId },
      unit: { compound: { id: compoundId } },
      status: 'suspended',
    });
    if (!unitUser) throw AppError.notFound('Unit user not found');
    unitUser.status = 'active';
    await this.db.persistAndFlush(unitUser);
    return user;
  }
}

export default CompoundService;
