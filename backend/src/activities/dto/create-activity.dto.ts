import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  Min,
  Matches,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EducationLevel,
  GradeGroup,
  Grade,
  HighSchoolGrade,
  ActivityType,
  MediaType,
} from '@prisma/client';

// Aceita arquivos enviados via POST /media/upload ou links http(s) externos
export const MEDIA_URL_REGEX = /^(\/uploads\/[A-Za-z0-9._-]+|https?:\/\/[^\s"'<>]+)$/;
const MEDIA_URL_MESSAGE =
  'URL de mídia inválida. Use a URL retornada por /media/upload ou um link http(s)';

export class ActivityMediaDTO {
  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @IsEnum(MediaType, { message: 'Tipo de mídia deve ser IMAGE ou AUDIO' })
  type: MediaType;

  @ApiProperty({
    example: '/uploads/3f2b9c1e-1234-4c3a-9d8e-abcdef123456.png',
    description: 'URL retornada por POST /media/upload ou link http(s) externo',
  })
  @IsString()
  @MaxLength(2048)
  @Matches(MEDIA_URL_REGEX, { message: MEDIA_URL_MESSAGE })
  url: string;

  @ApiPropertyOptional({ example: 'Ouça a pronúncia antes de responder' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;

  @ApiPropertyOptional({ example: 'image/png' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mimeType?: string;
}

export class CreateQuestionDTO {
  @ApiProperty({ example: 'Qual é a tradução de "casa" em inglês?' })
  @IsString()
  @IsNotEmpty()
  statement: string;

  @ApiProperty({ type: [String], example: ['House', 'Tree', 'Car', 'Door'], minItems: 2 })
  @IsArray()
  @ArrayMinSize(2, { message: 'Deve haver no mínimo 2 opções' })
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ example: 0, description: 'Índice (base 0) da alternativa correta' })
  @IsInt()
  @Min(0)
  answer: number;

  @ApiPropertyOptional({ example: '/uploads/3f2b9c1e-1234-4c3a-9d8e-abcdef123456.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @Matches(MEDIA_URL_REGEX, { message: MEDIA_URL_MESSAGE })
  imageUrl?: string;

  @ApiPropertyOptional({ example: '/uploads/9a8b7c6d-1234-4c3a-9d8e-abcdef123456.mp3' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @Matches(MEDIA_URL_REGEX, { message: MEDIA_URL_MESSAGE })
  audioUrl?: string;
}

export class CreateActivityDTO {
  @ApiProperty({ example: 'Vocabulário em Inglês' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Ouça o áudio e observe as imagens antes de responder' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: ActivityType, default: ActivityType.MULTIPLE_CHOICE })
  @IsEnum(ActivityType, { message: 'Tipo de atividade inválido' })
  @IsOptional()
  type: ActivityType = ActivityType.MULTIPLE_CHOICE;

  @ApiProperty({ enum: EducationLevel })
  @IsEnum(EducationLevel, { message: 'Nível de educação inválido' })
  educationLevel: EducationLevel;

  @ApiPropertyOptional({ enum: GradeGroup })
  @IsOptional()
  @IsEnum(GradeGroup, { message: 'Grupo de série inválido' })
  gradeGroup?: GradeGroup;

  @ApiPropertyOptional({ enum: Grade })
  @IsOptional()
  @IsEnum(Grade, { message: 'Série inválida' })
  grade?: Grade;

  @ApiPropertyOptional({ enum: HighSchoolGrade })
  @IsOptional()
  @IsEnum(HighSchoolGrade, { message: 'Ano do ensino médio inválido' })
  highSchoolYear?: HighSchoolGrade;

  @ApiPropertyOptional({
    type: [ActivityMediaDTO],
    description: 'Imagens e áudios exibidos aos alunos junto com a atividade',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'Máximo de 20 mídias por atividade' })
  @ValidateNested({ each: true })
  @Type(() => ActivityMediaDTO)
  media?: ActivityMediaDTO[];

  @ApiPropertyOptional({
    type: [CreateQuestionDTO],
    description: 'Obrigatório para MULTIPLE_CHOICE',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDTO)
  questions?: CreateQuestionDTO[];

  @ApiPropertyOptional({ type: [String], description: 'Grade do caça palavras (obrigatório para WORD_SEARCH)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grid?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  words?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orientation?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  positions?: string[];
}

export class UpdateActivityDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    type: [ActivityMediaDTO],
    description: 'Se enviado, substitui todas as mídias da atividade',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'Máximo de 20 mídias por atividade' })
  @ValidateNested({ each: true })
  @Type(() => ActivityMediaDTO)
  media?: ActivityMediaDTO[];

  @ApiPropertyOptional({
    type: [CreateQuestionDTO],
    description: 'Se enviado, substitui todas as questões da atividade',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDTO)
  questions?: CreateQuestionDTO[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grid?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  words?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  orientation?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  positions?: string[];
}
