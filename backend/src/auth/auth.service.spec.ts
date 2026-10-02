import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerStudent', () => {
    it('should throw BadRequestException if email already exists', async () => {
      const dto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        birthDate: '2000-01-01',
        educationLevel: 'ENSINO_FUNDAMENTAL' as const,
        grade: 'OITAVO_ANO' as const,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hash',
        role: 'ALUNO',
        birthDate: new Date('2000-01-01'),
        educationLevel: 'ENSINO_FUNDAMENTAL',
        gradeGroup: null,
        grade: null,
        highSchoolYear: null,
        createdAt: new Date(),
      });

      await expect(service.registerStudent(dto)).rejects.toThrow(BadRequestException);
    });

    it('should require grade for ENSINO_FUNDAMENTAL', async () => {
      await expect(
        service.registerStudent({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          birthDate: '2000-01-01',
          educationLevel: 'ENSINO_FUNDAMENTAL',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully register a new student', async () => {
      const dto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        birthDate: '2000-01-01',
        educationLevel: 'ENSINO_FUNDAMENTAL' as const,
        grade: 'OITAVO_ANO' as const,
      };

      const newUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed',
        role: 'ALUNO',
        birthDate: new Date('2000-01-01'),
        educationLevel: 'ENSINO_FUNDAMENTAL',
        gradeGroup: null,
        grade: null,
        highSchoolYear: null,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token' as any);

      const result = await service.registerStudent(dto);

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          role: 'ALUNO',
          gradeGroup: 'ANOS_FINAIS',
          grade: 'OITAVO_ANO',
        }),
      });
    });
  });

  describe('registerProfessor', () => {
    const dto = {
      name: 'Prof Test',
      email: 'prof@example.com',
      password: 'Password123',
      birthDate: '1985-01-01',
    };

    afterEach(() => {
      delete process.env.PROFESSOR_REGISTRATION_CODE;
    });

    it('should reject invalid access code when configured', async () => {
      process.env.PROFESSOR_REGISTRATION_CODE = 'secret-code';

      await expect(
        service.registerProfessor({ ...dto, accessCode: 'wrong' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should register professor with role PROFESSOR', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: '2',
        email: dto.email,
        name: dto.name,
        password: 'hashed',
        role: 'PROFESSOR',
        birthDate: new Date(dto.birthDate),
        educationLevel: null,
        gradeGroup: null,
        grade: null,
        highSchoolYear: null,
        createdAt: new Date(),
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('token' as any);

      const result = await service.registerProfessor(dto);

      expect(result.user.role).toBe('PROFESSOR');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: await bcrypt.hash('CorrectPassword', 10),
        role: 'ALUNO',
        birthDate: new Date('2000-01-01'),
        educationLevel: 'ENSINO_FUNDAMENTAL',
        gradeGroup: null,
        grade: null,
        highSchoolYear: null,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token' as any);

      await expect(
        service.login('test@example.com', 'WrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should successfully login a user', async () => {
      const password = 'Password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'ALUNO',
        birthDate: new Date('2000-01-01'),
        educationLevel: 'ENSINO_FUNDAMENTAL',
        gradeGroup: null,
        grade: null,
        highSchoolYear: null,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token' as any);

      const result = await service.login('test@example.com', password);

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });
  });
});
