import { Hono } from 'hono';
import Router from '../../core/server/router';
import TempMediaService from './services/tempMedia.service';
import TempMediaController from './controllers/tempMedia.controller';

function setup(app: Hono) {
  const controller = new TempMediaController(new TempMediaService());
  const router = new Router('/media');

  router.post('/images', controller.uploadImage.bind(controller));

  router.mount(app);
}

export default setup;
