import { MediaType } from '@prisma/client';
export declare const MAX_UPLOAD_SIZE_BYTES: number;
export declare function resolveMedia(mimeType: string, originalName: string): {
    type: MediaType;
    extension: string;
} | null;
export declare const ALLOWED_EXTENSIONS_LABEL: string;
