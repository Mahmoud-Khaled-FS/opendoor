import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import AppResponse from '../../../core/utils/response';
import { AnnouncementResponse } from '../responses/announcement.response';
import type CompoundService from '../services/compound.service';

class AnnouncementController extends Controller {
  constructor(private readonly compoundService: CompoundService) {
    super();
  }

  async announcements(c: Context) {
    const unit = c.get('unit')!;
    const announcements = await this.compoundService.getCompoundAnnouncements(unit.compound.id);
    return this.json(c, AppResponse.success(announcements.map((ann) => AnnouncementResponse(ann))));
  }

  async voteAnnouncement(c: Context) {
    const unit = c.get('unit')!;
    const announcementId = Number(c.req.param('id'));
    const index = Number(c.req.param('index'));
    const announcement = await this.compoundService.voteAnnouncement(unit.compound.id, announcementId, index);
    return this.json(c, AppResponse.success(AnnouncementResponse(announcement)));
  }
}

export default AnnouncementController;
