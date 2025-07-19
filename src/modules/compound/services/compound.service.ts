import Service from '../../../core/base/service';
import AppError from '../../../core/utils/error';
import { Announcement } from '../entities/announcement.entity';
import { Compound } from '../entities/compound.entity';

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
}

export default CompoundService;
