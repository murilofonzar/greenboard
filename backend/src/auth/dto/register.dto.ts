import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationLevel, Grade, HighSchoolGrade } from '@prisma/client';

export const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

class BaseRegisterDTO {
  @ApiProperty({ example: 'Maria Silva', minLength: 3, maxLength: 120 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(120, { message: 'Nome deve ter no máximo 120 caracteres' })
  name: string;

  @ApiProperty({ example: 'maria@example.com' })
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    example: 'Senha123',
    minLength: 8,
    description: 'Mínimo 8 caracteres, com ao menos uma letra maiúscula e um número',
  })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(72, { message: 'Senha deve ter no máximo 72 caracteres' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Senha deve conter pelo menos uma letra maiúscula',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Senha deve conter pelo menos um número',
  })
  password: string;

  @ApiProperty({ example: '2010-05-20', format: 'date' })
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birthDate: string;
}

export class RegisterStudentDTO extends BaseRegisterDTO {
  @ApiProperty({ enum: EducationLevel, example: EducationLevel.ENSINO_FUNDAMENTAL })
  @IsEnum(EducationLevel, { message: 'Nível de educação inválido' })
  educationLevel: EducationLevel;

  @ApiPropertyOptional({
    enum: Grade,
    example: Grade.OITAVO_ANO,
    description: 'Obrigatório quando educationLevel = ENSINO_FUNDAMENTAL',
  })
  @IsOptional()
  @IsEnum(Grade, { message: 'Série inválida' })
  grade?: Grade;

  @ApiPropertyOptional({
    enum: HighSchoolGrade,
    description: 'Obrigatório quando educationLevel = ENSINO_MEDIO',
  })
  @IsOptional()
  @IsEnum(HighSchoolGrade, { message: 'Ano do ensino médio inválido' })
  highSchoolYear?: HighSchoolGrade;
}

export class RegisterProfessorDTO extends BaseRegisterDTO {
  @ApiPropertyOptional({
    example: 'CODIGO-DA-ESCOLA',
    description:
      'Código de acesso para cadastro de professores. Obrigatório apenas se PROFESSOR_REGISTRATION_CODE estiver definido no servidor.',
  })
  @IsOptional()
  @IsString()
  accessCode?: string;
}
