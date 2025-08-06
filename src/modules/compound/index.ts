import { Hono } from 'hono';
import Router from '../../core/server/router';
import { validUnitMiddleware } from '../compound/middlewares/validUnit';
import CompoundController from './controllers/compound.controller';
import CompoundService from './services/compound.service';
import AnnouncementController from './controllers/announcement.controller';
import { validCompoundMiddleware } from './middlewares/validCompound';
import InvitationController from './controllers/invitation.controller';

function setup(app: Hono) {
  const compoundService = new CompoundService();
  const compoundController = new CompoundController(compoundService);
  const announcementController = new AnnouncementController(compoundService);
  const invitationController = new InvitationController(compoundService);
  const cr = new Router('/');
  cr.use(validCompoundMiddleware);

  cr.get('/users', compoundController.users.bind(compoundController));
  cr.get('/compounds/invitations', invitationController.getInvitations.bind(invitationController));
  cr.post('/compounds/invitations', invitationController.create.bind(invitationController));
  cr.post('/compounds/invitations/:code', invitationController.join.bind(invitationController));
  cr.post('/compounds/invitations/:userId/accept', invitationController.acceptRequest.bind(invitationController));
  cr.mount(app);

  const router = new Router('/');
  router.use(validUnitMiddleware);

  router.get('/services', compoundController.services.bind(compoundController));
  router.get('/announcements', announcementController.announcements.bind(compoundController));
  router.post('/announcements/:id/vote/:index', announcementController.voteAnnouncement.bind(compoundController));
  router.mount(app);
}

export default setup;
