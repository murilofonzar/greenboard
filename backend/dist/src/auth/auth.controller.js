"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const throttler_1 = require("@nestjs/throttler");
const public_decorator_1 = require("./public.decorator");
const CREDENTIALS_THROTTLE = { default: { limit: 10, ttl: 60000 } };
let AuthController = class AuthController {
    service;
    constructor(service) {
        this.service = service;
    }
    registerStudent(body) {
        return this.service.registerStudent(body);
    }
    registerProfessor(body) {
        return this.service.registerProfessor(body);
    }
    login(body) {
        return this.service.login(body.email, body.password);
    }
    refresh(body) {
        return this.service.refreshToken(body.refreshToken);
    }
    me(req) {
        return this.service.me(req.user.sub);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)(CREDENTIALS_THROTTLE),
    (0, common_1.Post)('register/student'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cadastrar aluno',
        description: 'Ensino Fundamental exige `grade` (o `gradeGroup` é calculado automaticamente). Ensino Médio exige `highSchoolYear`.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: auth_response_dto_1.AuthResponseDTO, description: 'Aluno cadastrado e autenticado' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos ou email já cadastrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterStudentDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerStudent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)(CREDENTIALS_THROTTLE),
    (0, common_1.Post)('register/professor'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cadastrar professor',
        description: 'Se a variável PROFESSOR_REGISTRATION_CODE estiver configurada no servidor, o campo `accessCode` é obrigatório.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: auth_response_dto_1.AuthResponseDTO, description: 'Professor cadastrado e autenticado' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos ou email já cadastrado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Código de acesso inválido' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterProfessorDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerProfessor", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)(CREDENTIALS_THROTTLE),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Fazer login' }),
    (0, swagger_1.ApiOkResponse)({ type: auth_response_dto_1.AuthResponseDTO, description: 'Login realizado com sucesso' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Credenciais inválidas' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Renovar token de acesso usando o refresh token' }),
    (0, swagger_1.ApiOkResponse)({ type: auth_response_dto_1.AuthResponseDTO, description: 'Token renovado com sucesso' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Refresh token inválido ou expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.RefreshTokenDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Dados do usuário autenticado' }),
    (0, swagger_1.ApiOkResponse)({ type: auth_response_dto_1.UserResponseDTO }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Token ausente ou inválido' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map