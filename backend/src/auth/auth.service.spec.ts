import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'PROFESSOR' | 'ALUNO';
  }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) throw new BadRequestException('Email já cadastrado');

    const hash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
    });

    return this.sign(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    return this.sign(user);
  }

  private sign(user: any) {
    return {
      access_token: this.jwt.sign({
        sub: user.id,
        role: user.role,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}