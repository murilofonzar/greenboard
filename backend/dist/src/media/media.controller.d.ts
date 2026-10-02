import { MediaType } from '@prisma/client';
interface UploadedMediaFile {
    originalname: string;
    mimetype: string;
    size: number;
    filename: string;
}
export declare class MediaUploadResponseDTO {
    url: string;
    type: MediaType;
    mimeType: string;
    size: number;
    originalName: string;
}
export declare class MediaController {
    upload(file?: UploadedMediaFile): MediaUploadResponseDTO;
}
export {};
