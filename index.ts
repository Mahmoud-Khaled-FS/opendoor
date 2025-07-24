import { Config } from './src/config';
import logger from './src/core/utils/logger';
import { initDB } from './src/db';
import { seeder } from './src/seeder';
import { server } from './src/server';
import { serve } from 'bun';

async function main() {
  await initDB();
  if (process.argv[2] === 'seed') {
    await seeder();
    return;
  }
  const app = await server();
  logger.info(`Listening on ${Config.app.host}:${Config.app.port}`);
  serve({
    port: Config.app.port,
    fetch: app.fetch,
  });
}

main();
