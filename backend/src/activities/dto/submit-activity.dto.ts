import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitActivityDTO {
  @ApiPropertyOptional({
    type: [Number],
    example: [0, 1, 1],
    description: 'Índices das alternativas escolhidas (MULTIPLE_CHOICE), na ordem das questões',
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
