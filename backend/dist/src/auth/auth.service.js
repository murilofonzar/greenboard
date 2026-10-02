"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const INITIAL_GRADES = [
    client_1.Grade.PRIMEIRO_ANO,
    client_1.Grade.SEGUNDO_ANO,
    client_1.Grade.TERCEIRO_ANO,
    client_1.Grade.QUARTO_ANO,
    client_1.Grade.QUINTO_ANO,
];
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwt;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async registerStudent(data) {
        const academic = this.resolveStudentAcademicData(data);
        return this.createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            birthDate: data.birthDate,
            role: client_1.Role.ALUNO,
            ...academic,
        });
    }
    async registerProfessor(data) {
        this.assertProfessorAccessCode(data.accessCode);
        return this.createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            birthDate: data.birthDate,
            role: client_1.Role.PROFESSOR,
        });
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return this.toPublicUser(user);
    }
    async createUser(data) {
        const exists = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (exists) {
            throw new common_1.BadRequestException('Email já cadastrado');
        }
        const birthDate = new Date(data.birthDate);
        if (birthDate.getTime() > Date.now()) {
            throw new common_1.BadRequestException('Data de nascimento não pode ser no futuro');
        }
        const hash = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: { ...data, password: hash, birthDate },
        });
        this.logger.log(`Novo ${user.role.toLowerCase()} registrado: ${user.email}`);
        return this.sign(user);
    }
    resolveStudentAcademicData(data) {
        if (data.educationLevel === client_1.EducationLevel.ENSINO_FUNDAMENTAL) {
            if (!data.grade) {
                throw new common_1.BadRequestException('Informe a série (grade) para alunos do Ensino Fundamental');
            }
            return {
                educationLevel: data.educationLevel,
                grade: data.grade,
                gradeGroup: INITIAL_GRADES.includes(data.grade)
                    ? client_1.GradeGroup.ANOS_INICIAIS
                    : client_1.GradeGroup.ANOS_FINAIS,
                highSchoolYear: null,
            };
        }
        if (!data.highSchoolYear) {
            throw new common_1.BadRequestException('Informe o ano (highSchoolYear) para alunos do Ensino Médio');
        }
        return {
            educationLevel: data.educationLevel,
            grade: null,
            gradeGroup: client_1.GradeGroup.ENSINO_MEDIO,
            highSchoolYear: data.highSchoolYear,
        };
    }
    assertProfessorAccessCode(accessCode) {
        const expected = process.env.PROFESSOR_REGISTRATION_CODE;
        if (!expected)
            return;
        const digest = (value) => (0, crypto_1.createHash)('sha256').update(value).digest();
        if (!accessCode || !(0, crypto_1.timingSafeEqual)(digest(accessCode), digest(expected))) {
            throw new common_1.ForbiddenException('Código de acesso de professor inválido');
        }
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        this.logger.log(`Login bem-sucedido: ${user.email}`);
        return this.sign(user);
    }
    async refreshToken(refreshToken) {
        let payload;
        try {
            payload = this.jwt.verify(refreshToken);
        }
        catch {
            throw new common_1.UnauthorizedException('Token de refresh inválido');
        }
        if (payload.type !== 'refresh') {
            throw new common_1.UnauthorizedException('Token de refresh inválido');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        }
        return this.sign(user);
    }
    sign(user) {
        const accessToken = this.jwt.sign({
            sub: user.id,
            type: 'access',
            role: user.role,
            educationLevel: user.educationLevel,
            grade: user.grade,
            highSchoolYear: user.highSchoolYear,
        }, { expiresIn: '15m' });
        const refreshToken = this.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '7d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: this.toPublicUser(user),
        };
    }
    toPublicUser(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map