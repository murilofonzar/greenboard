import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterProfessorDTO, RegisterStudentDTO } from './dto/register.dto';
import { EducationLevel, Grade, GradeGroup, Prisma, Role, User } from '@prisma/client';

const INITIAL_GRADES: Grade[] = [
  Grade.PRIMEIRO_ANO,
  Grade.SEGUNDO_ANO,
  Grade.TERCEIRO_ANO,
  Grade.QUARTO_ANO,
  Grade.QUINTO_ANO,
];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async registerStudent(data: RegisterStudentDTO) {
    const academic = this.resolveStudentAcademicData(data);

    return this.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      role: Role.ALUNO,
      ...academic,
    });
  }

  async registerProfessor(data: RegisterProfessorDTO) {
    this.assertProfessorAccessCode(data.accessCode);

    return this.createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      role: Role.PROFESSOR,
    });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.toPublicUser(user);
  }

  private async createUser(
    data: Omit<Prisma.UserCreateInput, 'birthDate'> & { birthDate: string },
  ) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new BadRequestException('Email já cadastrado');
    }

    const birthDate = new Date(data.birthDate);
    if (birthDate.getTime() > Date.now()) {
      throw new BadRequestException('Data de nascimento não pode ser no futuro');
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { ...data, password: hash, birthDate },
    });

    this.logger.log(`Novo ${user.role.toLowerCase()} registrado: ${user.email}`);
    return this.sign(user);
  }

  private resolveStudentAcademicData(data: RegisterStudentDTO) {
    if (data.educationLevel === EducationLevel.ENSINO_FUNDAMENTAL) {
      if (!data.grade) {
        throw new BadRequestException(
          'Informe a série (grade) para alunos do Ensino Fundamental',
        );
      }

      return {
        educationLevel: data.educationLevel,
        grade: data.grade,
        gradeGroup: INITIAL_GRADES.includes(data.grade)
          ? GradeGroup.ANOS_INICIAIS
          : GradeGroup.ANOS_FINAIS,
        highSchoolYear: null,
      };
    }

    if (!data.highSchoolYear) {
      throw new BadRequestException(
        'Informe o ano (highSchoolYear) para alunos do Ensino Médio',
      );
    }

    return {
      educationLevel: data.educationLevel,
      grade: null,
      gradeGroup: GradeGroup.ENSINO_MEDIO,
      highSchoolYear: data.highSchoolYear,
    };
  }

  private assertProfessorAccessCode(accessCode?: string) {
    const expected = process.env.PROFESSOR_REGISTRATION_CODE;
    if (!expected) return;

    const digest = (value: string) => createHash('sha256').update(value).digest();

    if (!accessCode || !timingSafeEqual(digest(accessCode), digest(expected))) {
      throw new ForbiddenException('Código de acesso de professor inválido');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.log(`Login bem-sucedido: ${user.email}`);
    return this.sign(user);
  }

  async refreshToken(refreshToken: string) {
    let payload: { sub: string; type?: string };
    try {
      payload = this.jwt.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Token de refresh inválido');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token de refresh inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return this.sign(user);
  }

  private sign(user: User) {
    const accessToken = this.jwt.sign(
      {
        sub: user.id,
        type: 'access',
        role: user.role,
        educationLevel: user.educationLevel,
        grade: user.grade,
        highSchoolYear: user.highSchoolYear,
      },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwt.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.toPublicUser(user),
    };
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      educationLevel: user.educationLevel,
      gradeGroup: user.gradeGroup,
      grade: user.grade,
      highSchoolYear: user.highSchoolYear,
    };
  }
}