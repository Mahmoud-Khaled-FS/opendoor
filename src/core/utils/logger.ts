import type { Logger as PinoLogger } from 'pino';
import pino from 'pino';
import { Config } from '../../config';

class Logger {
  // TODO (MAHMOUD) - create logger interface
  private logger: PinoLogger;
  constructor() {
    // TODO (MAHMOUD) - create transports to file in production
    this.logger = pino({
      level: Config.log.level,
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        ],
      },
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  trace(message: string) {
    this.logger.trace(message);
  }

  fatal(message: string) {
    this.logger.fatal(message);
  }
}

export default new Logger();
