import { Hono } from 'hono';
import Router from '../../core/server/router';
import UserController from './controllers/user.controller';
import UserService from './services/user.service';

function setup(app: Hono) {
  const userController = new UserController(new UserService());
  const router = new Router('/users');

  router.get('/me', userController.me.bind(userController));
  router.delete('/me', userController.deleteMe.bind(userController));
  router.put('/me', userController.updateMe.bind(userController));

  router.post('/me/avatar', userController.updateAvatar.bind(userController));

  router.get('/me/units', userController.myUnits.bind(userController));
  router.get('/me/invitations', userController.myInvitations.bind(userController));

  router.mount(app);
}

export default setup;
