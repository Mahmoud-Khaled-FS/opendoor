import { env } from '../core/utils/env';

export const Config = {
  app: {
    name: env('APP_NAME', 'OpenDoor'),
    port: env('PORT', '3000'),
    host: env('HOST', 'localhost'),
    env: env('NODE_ENV', 'development'),
    url: env('APP_URL', 'http://localhost'),
  },
  storage: {
    maxImageSize: env('MAX_IMAGE_SIZE', (5 * 1024 * 1024).toString()),
    publicPath: env('PUBLIC_PATH', process.cwd() + '/storage/public/'),
  },
  log: {
    level: env('LOG_LEVEL', 'info'),
  },
  db: {
    name: env('DB_NAME', 'opendoor'),
    user: env('DB_USER', 'postgres'),
    password: env('DB_PASSWORD', ''),
    host: env('DB_HOST', 'localhost'),
    port: env('DB_PORT', '5432'),
  },
  token: {
    privatePath: env('TOKEN_PRIVATE_PATH', process.cwd() + '/keys/private.key'),
    publicPath: env('TOKEN_PUBLIC_PATH', process.cwd() + '/keys/public.key'),
    accessExp: env('TOKEN_ACCESS_EXPIRATION', (Date.now() / 1000 + 60 * 5 * 10000).toString()), // TODO (MAHMOUD) - fix time
    refreshExp: env('TOKEN_ACCESS_EXPIRATION', (Date.now() / 1000 + 60 * 60 * 24 * 90).toString()),
  },
} as const;
