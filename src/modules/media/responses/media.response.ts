import { buildUrl } from '../../../core/utils/url';
import type { TempMedia } from '../entities/tempMedia.entity';

type TempMediaResponse = {
  uuid: string;
  url: string;
};

export function tempMediaResponse(tm: TempMedia): TempMediaResponse {
  return {
    uuid: tm.uuid,
    url: buildUrl('/u' + tm.path),
  };
}
