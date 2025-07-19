import { Config } from '../../config';

export function buildUrl(path: string): string {
  const urlPath = encodeURI(path.replace(/\\/g, '/'));
  return Config.app.url + urlPath;
}
