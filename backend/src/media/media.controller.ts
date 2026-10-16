import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { Roles } from '../auth/roles.decorator';
import {
  ALLOWED_EXTENSIONS_LABEL,
  MAX_UPLOAD_SIZE_BYTES,
  resolveMedia,
} from './media.constants';
import { getUploadDir } from './upload-dir';

interface UploadedMediaFile {
  originalname: string;
  mimetype: string;
  size: number;
  filename: string;
}

export class MediaUploadResponseDTO {
  @ApiProperty({ example: '/uploads/3f2b9c1e-1234-4c3a-9d8e-abcdef123456.png' })
  url: string;

  @ApiProperty({ enum: MediaType })
  type: MediaType;

  @ApiProperty({ example: 'image/png' })
  mimeType: string;

  @ApiProperty({ example: 204800, description: 'Tamanho em bytes' })
  size: number;

  @ApiProperty({ example: 'cachorro.png' })
  originalName: string;
}

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  @Post('upload')
  @Roles('PROFESSOR')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, getUploadDir()),
        filename: (_req, file, cb) => {
          const media = resolveMedia(file.mimetype, file.originalname);
          cb(null, `${randomUUID()}${media?.extension ?? ''}`);
        },
      }),
      limits: { fileSize: MAX_UPLOAD_SIZE_BYTES, files: 1 },
      fileFilter: (_req, file, cb) => {
        if (!resolveMedia(file.mimetype, file.originalname)) {
          return cb(
            new BadRequestException(
              `Formato não suportado. Envie imagens ou áudios (${ALLOWED_EXTENSIONS_LABEL})`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Enviar imagem ou áudio (professor)',
    description: `Retorna a URL a ser usada em \`media[].url\`, \`questions[].imageUrl\` ou \`questions[].audioUrl\` ao criar/editar atividades. Tamanho máximo: ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024} MB. Formatos: ${ALLOWED_EXTENSIONS_LABEL}.`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiCreatedResponse({ type: MediaUploadResponseDTO })
  @ApiResponse({ status: 400, description: 'Arquivo ausente ou formato inválido' })
  @ApiResponse({ status: 403, description: 'Apenas professores' })
  @ApiResponse({ status: 413, description: 'Arquivo muito grande' })
  upload(@UploadedFile() file?: UploadedMediaFile): MediaUploadResponseDTO {
    if (!file) {
      throw new BadRequestException('Envie um arquivo no campo "file"');
    }

    const media = resolveMedia(file.mimetype, file.originalname)!;

    return {
      url: `/uploads/${file.filename}`,
      type: media.type,
      mimeType: file.mimetype,
      size: file.size,
      originalName: file.originalname,
    };
  }
}
