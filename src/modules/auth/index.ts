import { Hono } from 'hono';
import UserAuthController from './controllers/userAuth.controller';
import UserAuthService from './services/userAuth.service';
import Router from '../../core/server/router';

function setup(app: Hono) {
  const userAuthController = new UserAuthController(new UserAuthService());
  const router = new Router('/auth');

  router.post('/user/login', userAuthController.login.bind(userAuthController));
  router.post('/user/register', userAuthController.register.bind(userAuthController));
  router.post('/user/refresh', userAuthController.refresh.bind(userAuthController));

  router.mount(app);
}

export default setup;
