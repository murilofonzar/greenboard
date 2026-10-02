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
exports.AuthResponseDTO = exports.UserResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UserResponseDTO {
    id;
    name;
    email;
    role;
    educationLevel;
    gradeGroup;
    grade;
    highSchoolYear;
}
exports.UserResponseDTO = UserResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maria Silva' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'maria@example.com' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Role }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EducationLevel, nullable: true }),
    __metadata("design:type", Object)
], UserResponseDTO.prototype, "educationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.GradeGroup, nullable: true }),
    __metadata("design:type", Object)
], UserResponseDTO.prototype, "gradeGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Grade, nullable: true }),
    __metadata("design:type", Object)
], UserResponseDTO.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.HighSchoolGrade, nullable: true }),
    __metadata("design:type", Object)
], UserResponseDTO.prototype, "highSchoolYear", void 0);
class AuthResponseDTO {
    access_token;
    refresh_token;
    user;
}
exports.AuthResponseDTO = AuthResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT de acesso (expira em 15 minutos)' }),
    __metadata("design:type", String)
], AuthResponseDTO.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JWT de renovação (expira em 7 dias)' }),
    __metadata("design:type", String)
], AuthResponseDTO.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserResponseDTO }),
    __metadata("design:type", UserResponseDTO)
], AuthResponseDTO.prototype, "user", void 0);
//# sourceMappingURL=auth-response.dto.js.map