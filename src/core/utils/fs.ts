import * as fs from 'node:fs/promises';
import path from 'node:path';

export async function rmFiles(files: string[]) {
  for (const f in files) {
    // TODO (MAHMOUD) - improve to promise all
    await fs.unlink(f);
  }
}

export async function moveToPublic(file: string, publicDir: string = '/public') {
  const newPath = path.join(publicDir, path.basename(file));
  await fs.rename(file, newPath);
  return '/' + path.basename(newPath);
}
