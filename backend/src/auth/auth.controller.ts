import { Controller, Post, Body, Get, Req, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterProfessorDTO, RegisterStudentDTO } from './dto/register.dto';
import { LoginDTO, RefreshTokenDTO } from './dto/login.dto';
import { AuthResponseDTO, UserResponseDTO } from './dto/auth-response.dto';
import { Throttle } from '@nestjs/throttler';
import { Public } from './public.decorator';

const CREDENTIALS_THROTTLE = { default: { limit: 10, ttl: 60000 } };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Throttle(CREDENTIALS_THROTTLE)
  @Post('register/student')
  @ApiOperation({
    summary: 'Cadastrar aluno',
    description:
      'Ensino Fundamental exige `grade` (o `gradeGroup` é calculado automaticamente). Ensino Médio exige `highSchoolYear`.',
  })
  @ApiCreatedResponse({ type: AuthResponseDTO, description: 'Aluno cadastrado e autenticado' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou email já cadastrado' })
  registerStudent(@Body() body: RegisterStudentDTO) {
    return this.service.registerStudent(body);
  }

  @Public()
  @Throttle(CREDENTIALS_THROTTLE)
  @Post('register/professor')
  @ApiOperation({
    summary: 'Cadastrar professor',
    description:
      'Se a variável PROFESSOR_REGISTRATION_CODE estiver configurada no servidor, o campo `accessCode` é obrigatório.',
  })
  @ApiCreatedResponse({ type: AuthResponseDTO, description: 'Professor cadastrado e autenticado' })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou email já cadastrado' })
  @ApiForbiddenResponse({ description: 'Código de acesso inválido' })
  registerProfessor(@Body() body: RegisterProfessorDTO) {
    return this.service.registerProfessor(body);
  }

  @Public()
  @Throttle(CREDENTIALS_THROTTLE)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiOkResponse({ type: AuthResponseDTO, description: 'Login realizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  login(@Body() body: LoginDTO) {
    return this.service.login(body.email, body.password);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acesso usando o refresh token' })
  @ApiOkResponse({ type: AuthResponseDTO, description: 'Token renovado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido ou expirado' })
  refresh(@Body() body: RefreshTokenDTO) {
    return this.service.refreshToken(body.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dados do usuário autenticado' })
  @ApiOkResponse({ type: UserResponseDTO })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  me(@Req() req: any) {
    return this.service.me(req.user.sub);
  }
}