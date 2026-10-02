import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EducationLevel,
  Grade,
  GradeGroup,
  HighSchoolGrade,
  Role,
} from '@prisma/client';

export class UserResponseDTO {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Maria Silva' })
  name: string;

  @ApiProperty({ example: 'maria@example.com' })
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiPropertyOptional({ enum: EducationLevel, nullable: true })
  educationLevel: EducationLevel | null;

  @ApiPropertyOptional({ enum: GradeGroup, nullable: true })
  gradeGroup: GradeGroup | null;

  @ApiPropertyOptional({ enum: Grade, nullable: true })
  grade: Grade | null;

  @ApiPropertyOptional({ enum: HighSchoolGrade, nullable: true })
  highSchoolYear: HighSchoolGrade | null;
}

export class AuthResponseDTO {
  @ApiProperty({ description: 'JWT de acesso (expira em 15 minutos)' })
  access_token: string;

  @ApiProperty({ description: 'JWT de renovação (expira em 7 dias)' })
  refresh_token: string;

  @ApiProperty({ type: UserResponseDTO })
  user: UserResponseDTO;
}
