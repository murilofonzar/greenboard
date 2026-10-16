import { mkdirSync } from 'fs';
import { isAbsolute, join } from 'path';

export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR || 'uploads';
  const dir = isAbsolute(configured) ? configured : join(process.cwd(), configured);
  mkdirSync(dir, { recursive: true });
  return dir;
}
