import { join } from 'node:path';
import { randomUUIDv7 } from 'bun';
import Service from '../../../core/base/service';
import type { ID } from '../../../core/types/common';
import { daysToMs } from '../../../core/utils/dateTime';
import { moveToPublic, rmFiles } from '../../../core/utils/fs';
import { TempMedia } from '../entities/tempMedia.entity';
import AppError, { AppErrorCode } from '../../../core/utils/error';
import { Config } from '../../../config';
import { User } from '../../user/entities/user.entity';

class TempMediaService extends Service {
  async clean() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - daysToMs(1));
    const files = await this.db.find(TempMedia, {
      createdAt: { $gte: oneDayAgo },
    });

    await rmFiles(files.map((f) => f.path));

    await this.db.nativeDelete(TempMedia, { createdAt: { $gte: oneDayAgo } });
  }

  // TODO (MAHMOUD) - add file to tmp dir
  async create(file: File, userId: ID): Promise<TempMedia> {
    const filePath = join('/temp', file.name);
    /** @ts-ignore */
    const writer = Bun.file(join(Config.storage.publicPath, filePath), { create: true, truncate: true }).writer();
    const reader = file.stream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      writer.write(value);
    }
    await writer.end();

    const media: TempMedia = new TempMedia();
    media.path = filePath;
    media.user = this.db.getReference(User, userId);
    media.uuid = randomUUIDv7(); // TODO (MAHMOUD) - check if it's valid uuid!
    await this.db.persistAndFlush(media);
    return media;
  }

  async saveMedia(uuid: string): Promise<string> {
    const media = await this.db.findOne(TempMedia, { uuid: uuid });
    if (!media) {
      throw AppError.badRequest('Invalid media uuid!', AppErrorCode.VALIDATION);
    }
    const path = await moveToPublic(Config.storage.publicPath + media.path, Config.storage.publicPath);
    await this.db.removeAndFlush(media);
    return path;
  }
}

export default TempMediaService;
