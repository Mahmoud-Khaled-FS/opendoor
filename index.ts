import { Config } from './src/config';
import logger from './src/core/utils/logger';
import { initDB } from './src/db';
import { server } from './src/server';
import { serve } from 'bun';

async function main() {
  await initDB();
  const app = await server();
  logger.info(`Listening on ${Config.app.host}:${Config.app.port}`);
  serve({
    port: Config.app.port,
    fetch: app.fetch,
  });
}

main();
