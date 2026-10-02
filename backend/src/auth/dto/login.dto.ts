import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { normalizeEmail } from './register.dto';

export class LoginDTO {
  @ApiProperty({ example: 'professor@example.com' })
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Professor123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty({ description: 'refresh_token retornado no login/cadastro' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
