"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = exports.MediaUploadResponseDTO = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const multer_1 = require("multer");
const roles_decorator_1 = require("../auth/roles.decorator");
const media_constants_1 = require("./media.constants");
const upload_dir_1 = require("./upload-dir");
class MediaUploadResponseDTO {
    url;
    type;
    mimeType;
    size;
    originalName;
}
exports.MediaUploadResponseDTO = MediaUploadResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '/uploads/3f2b9c1e-1234-4c3a-9d8e-abcdef123456.png' }),
    __metadata("design:type", String)
], MediaUploadResponseDTO.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.MediaType }),
    __metadata("design:type", String)
], MediaUploadResponseDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png' }),
    __metadata("design:type", String)
], MediaUploadResponseDTO.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 204800, description: 'Tamanho em bytes' }),
    __metadata("design:type", Number)
], MediaUploadResponseDTO.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cachorro.png' }),
    __metadata("design:type", String)
], MediaUploadResponseDTO.prototype, "originalName", void 0);
let MediaController = class MediaController {
    upload(file) {
        if (!file) {
            throw new common_1.BadRequestException('Envie um arquivo no campo "file"');
        }
        const media = (0, media_constants_1.resolveMedia)(file.mimetype, file.originalname);
        return {
            url: `/uploads/${file.filename}`,
            type: media.type,
            mimeType: file.mimetype,
            size: file.size,
            originalName: file.originalname,
        };
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)('PROFESSOR'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => cb(null, (0, upload_dir_1.getUploadDir)()),
            filename: (_req, file, cb) => {
                const media = (0, media_constants_1.resolveMedia)(file.mimetype, file.originalname);
                cb(null, `${(0, crypto_1.randomUUID)()}${media?.extension ?? ''}`);
            },
        }),
        limits: { fileSize: media_constants_1.MAX_UPLOAD_SIZE_BYTES, files: 1 },
        fileFilter: (_req, file, cb) => {
            if (!(0, media_constants_1.resolveMedia)(file.mimetype, file.originalname)) {
                return cb(new common_1.BadRequestException(`Formato não suportado. Envie imagens ou áudios (${media_constants_1.ALLOWED_EXTENSIONS_LABEL})`), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Enviar imagem ou áudio (professor)',
        description: `Retorna a URL a ser usada em \`media[].url\`, \`questions[].imageUrl\` ou \`questions[].audioUrl\` ao criar/editar atividades. Tamanho máximo: ${media_constants_1.MAX_UPLOAD_SIZE_BYTES / 1024 / 1024} MB. Formatos: ${media_constants_1.ALLOWED_EXTENSIONS_LABEL}.`,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: { file: { type: 'string', format: 'binary' } },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: MediaUploadResponseDTO }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Arquivo ausente ou formato inválido' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Apenas professores' }),
    (0, swagger_1.ApiResponse)({ status: 413, description: 'Arquivo muito grande' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", MediaUploadResponseDTO)
], MediaController.prototype, "upload", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('media')
], MediaController);
//# sourceMappingURL=media.controller.js.map