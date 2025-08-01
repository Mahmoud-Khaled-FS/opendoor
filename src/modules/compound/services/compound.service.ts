import Service from '../../../core/base/service';
import AppError from '../../../core/utils/error';
import { User } from '../../user/entities/user.entity';
import { Announcement } from '../entities/announcement.entity';
import { Compound } from '../entities/compound.entity';
import { Unit } from '../entities/unit.entity';

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
      { units: { id: { $in: unitsIds.map((u) => u.id) } } },
      {
        limit,
        offset: this.getPagination(page, limit).offset,
      },
    );
    return users;
  }
}

export default CompoundService;
