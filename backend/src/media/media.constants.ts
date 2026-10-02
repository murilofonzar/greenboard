import { extname } from 'path';
import { MediaType } from '@prisma/client';

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

// SVG fica de fora de propósito: pode conter scripts
const ALLOWED_MIME_TYPES: Record<string, { type: MediaType; extensions: string[] }> = {
  'image/jpeg': { type: MediaType.IMAGE, extensions: ['.jpg', '.jpeg'] },
  'image/png': { type: MediaType.IMAGE, extensions: ['.png'] },
  'image/gif': { type: MediaType.IMAGE, extensions: ['.gif'] },
  'image/webp': { type: MediaType.IMAGE, extensions: ['.webp'] },
  'audio/mpeg': { type: MediaType.AUDIO, extensions: ['.mp3'] },
  'audio/mp3': { type: MediaType.AUDIO, extensions: ['.mp3'] },
  'audio/wav': { type: MediaType.AUDIO, extensions: ['.wav'] },
  'audio/x-wav': { type: MediaType.AUDIO, extensions: ['.wav'] },
  'audio/wave': { type: MediaType.AUDIO, extensions: ['.wav'] },
  'audio/ogg': { type: MediaType.AUDIO, extensions: ['.ogg', '.oga'] },
  'audio/webm': { type: MediaType.AUDIO, extensions: ['.webm'] },
  'audio/mp4': { type: MediaType.AUDIO, extensions: ['.m4a', '.mp4'] },
  'audio/x-m4a': { type: MediaType.AUDIO, extensions: ['.m4a'] },
  'audio/aac': { type: MediaType.AUDIO, extensions: ['.aac'] },
};

export function resolveMedia(
  mimeType: string,
  originalName: string,
): { type: MediaType; extension: string } | null {
  const entry = ALLOWED_MIME_TYPES[mimeType?.toLowerCase()];
  if (!entry) return null;

  const extension = extname(originalName || '').toLowerCase();
  if (!entry.extensions.includes(extension)) return null;

  return { type: entry.type, extension };
}

export const ALLOWED_EXTENSIONS_LABEL = Array.from(
  new Set(Object.values(ALLOWED_MIME_TYPES).flatMap((e) => e.extensions)),
).join(', ');
