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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterProfessorDTO = exports.RegisterStudentDTO = exports.normalizeEmail = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const normalizeEmail = ({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value;
exports.normalizeEmail = normalizeEmail;
class BaseRegisterDTO {
    name;
    email;
    password;
    birthDate;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maria Silva', minLength: 3, maxLength: 120 }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(120, { message: 'Nome deve ter no máximo 120 caracteres' }),
    __metadata("design:type", String)
], BaseRegisterDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'maria@example.com' }),
    (0, class_transformer_1.Transform)(exports.normalizeEmail),
    (0, class_validator_1.IsEmail)({}, { message: 'Email inválido' }),
    __metadata("design:type", String)
], BaseRegisterDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Senha123',
        minLength: 8,
        description: 'Mínimo 8 caracteres, com ao menos uma letra maiúscula e um número',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
    (0, class_validator_1.MaxLength)(72, { message: 'Senha deve ter no máximo 72 caracteres' }),
    (0, class_validator_1.Matches)(/(?=.*[A-Z])/, {
        message: 'Senha deve conter pelo menos uma letra maiúscula',
    }),
    (0, class_validator_1.Matches)(/(?=.*[0-9])/, {
        message: 'Senha deve conter pelo menos um número',
    }),
    __metadata("design:type", String)
], BaseRegisterDTO.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2010-05-20', format: 'date' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de nascimento inválida' }),
    __metadata("design:type", String)
], BaseRegisterDTO.prototype, "birthDate", void 0);
class RegisterStudentDTO extends BaseRegisterDTO {
    educationLevel;
    grade;
    highSchoolYear;
}
exports.RegisterStudentDTO = RegisterStudentDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.EducationLevel, example: client_1.EducationLevel.ENSINO_FUNDAMENTAL }),
    (0, class_validator_1.IsEnum)(client_1.EducationLevel, { message: 'Nível de educação inválido' }),
    __metadata("design:type", String)
], RegisterStudentDTO.prototype, "educationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.Grade,
        example: client_1.Grade.OITAVO_ANO,
        description: 'Obrigatório quando educationLevel = ENSINO_FUNDAMENTAL',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Grade, { message: 'Série inválida' }),
    __metadata("design:type", String)
], RegisterStudentDTO.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.HighSchoolGrade,
        description: 'Obrigatório quando educationLevel = ENSINO_MEDIO',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.HighSchoolGrade, { message: 'Ano do ensino médio inválido' }),
    __metadata("design:type", String)
], RegisterStudentDTO.prototype, "highSchoolYear", void 0);
class RegisterProfessorDTO extends BaseRegisterDTO {
    accessCode;
}
exports.RegisterProfessorDTO = RegisterProfessorDTO;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'CODIGO-DA-ESCOLA',
        description: 'Código de acesso para cadastro de professores. Obrigatório apenas se PROFESSOR_REGISTRATION_CODE estiver definido no servidor.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterProfessorDTO.prototype, "accessCode", void 0);
//# sourceMappingURL=register.dto.js.map