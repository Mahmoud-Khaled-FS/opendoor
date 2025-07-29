import { Hono } from 'hono';
import Router from '../../core/server/router';
import InvitationController from './controllers/invitation.controller';
import InvitationService from './services/invitation.service';
import { validUnitMiddleware } from '../compound/middlewares/validUnit';

function setup(app: Hono) {
  const invitationController = new InvitationController(new InvitationService());
  const router = new Router('/invitations');
  // router.use(validUnitMiddleware);

  router.post('/', invitationController.create.bind(invitationController));
  router.post('/scan', invitationController.scan.bind(invitationController));

  router.mount(app);
}

export default setup;
