import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Grade, GradeGroup } from '@prisma/client';

export class SubmitActivityDTO {
  @ApiPropertyOptional({
    type: [Number],
    example: [0, 1, 1],
    description:
      'Índices das alternativas escolhidas (MULTIPLE_CHOICE), na ordem das questões',
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Min(0, { each: true })
  answers?: number[];

  @ApiPropertyOptional({
    type: [String],
    example: ['CAT', 'DOG'],
    description: 'Palavras encontradas (WORD_SEARCH)',
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  foundWords?: string[];
}

export class GuestSubmitActivityDTO extends SubmitActivityDTO {
  @ApiProperty({ example: 'Ana Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: GradeGroup, example: GradeGroup.ANOS_INICIAIS })
  @IsEnum(GradeGroup)
  gradeGroup: GradeGroup;

  @ApiProperty({ enum: Grade, example: Grade.PRIMEIRO_ANO })
  @IsEnum(Grade)
  grade: Grade;
}

export class GuestActivityQueryDTO extends OmitType(GuestSubmitActivityDTO, [
  'answers',
  'foundWords',
] as const) {}

export class CorrectSubmissionDTO {
  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @ApiProperty({ example: 'Excelente trabalho!' })
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
