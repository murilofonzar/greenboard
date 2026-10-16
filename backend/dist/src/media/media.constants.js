"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_EXTENSIONS_LABEL = exports.MAX_UPLOAD_SIZE_BYTES = void 0;
exports.resolveMedia = resolveMedia;
const path_1 = require("path");
const client_1 = require("@prisma/client");
exports.MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = {
    'image/jpeg': { type: client_1.MediaType.IMAGE, extensions: ['.jpg', '.jpeg'] },
    'image/png': { type: client_1.MediaType.IMAGE, extensions: ['.png'] },
    'image/gif': { type: client_1.MediaType.IMAGE, extensions: ['.gif'] },
    'image/webp': { type: client_1.MediaType.IMAGE, extensions: ['.webp'] },
    'audio/mpeg': { type: client_1.MediaType.AUDIO, extensions: ['.mp3'] },
    'audio/mp3': { type: client_1.MediaType.AUDIO, extensions: ['.mp3'] },
    'audio/wav': { type: client_1.MediaType.AUDIO, extensions: ['.wav'] },
    'audio/x-wav': { type: client_1.MediaType.AUDIO, extensions: ['.wav'] },
    'audio/wave': { type: client_1.MediaType.AUDIO, extensions: ['.wav'] },
    'audio/ogg': { type: client_1.MediaType.AUDIO, extensions: ['.ogg', '.oga'] },
    'audio/webm': { type: client_1.MediaType.AUDIO, extensions: ['.webm'] },
    'audio/mp4': { type: client_1.MediaType.AUDIO, extensions: ['.m4a', '.mp4'] },
    'audio/x-m4a': { type: client_1.MediaType.AUDIO, extensions: ['.m4a'] },
    'audio/aac': { type: client_1.MediaType.AUDIO, extensions: ['.aac'] },
};
function resolveMedia(mimeType, originalName) {
    const entry = ALLOWED_MIME_TYPES[mimeType?.toLowerCase()];
    if (!entry)
        return null;
    const extension = (0, path_1.extname)(originalName || '').toLowerCase();
    if (!entry.extensions.includes(extension))
        return null;
    return { type: entry.type, extension };
}
exports.ALLOWED_EXTENSIONS_LABEL = Array.from(new Set(Object.values(ALLOWED_MIME_TYPES).flatMap((e) => e.extensions))).join(', ');
//# sourceMappingURL=media.constants.js.map