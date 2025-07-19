import type { Context } from 'hono';
import Controller from '../../../core/base/controller';
import type TempMediaService from '../services/tempMedia.service';
import AppError, { AppErrorCode } from '../../../core/utils/error';
import { Config } from '../../../config';
import AppResponse from '../../../core/utils/response';
import { tempMediaResponse } from '../responses/media.response';

class TempMediaController extends Controller {
  constructor(private readonly mediaService: TempMediaService) {
    super();
  }

  public async uploadImage(c: Context) {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    if (!file) {
      return this.json(c, AppError.badRequest('No file found in request body', AppErrorCode.VALIDATION));
    }

    if (file.size > Number(Config.storage.maxImageSize)) {
      return this.json(c, AppError.badRequest('File size is too large', AppErrorCode.VALIDATION));
    }
    const media = await this.mediaService.create(file, c.get('user').id!);
    return this.json(c, AppResponse.created(tempMediaResponse(media)));
  }
}

export default TempMediaController;
