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
exports.CorrectSubmissionDTO = exports.GuestActivityQueryDTO = exports.GuestSubmitActivityDTO = exports.SubmitActivityDTO = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class SubmitActivityDTO {
    answers;
    foundWords;
}
exports.SubmitActivityDTO = SubmitActivityDTO;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [Number],
        example: [0, 1, 1],
        description: 'Índices das alternativas escolhidas (MULTIPLE_CHOICE), na ordem das questões',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    __metadata("design:type", Array)
], SubmitActivityDTO.prototype, "answers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ['CAT', 'DOG'],
        description: 'Palavras encontradas (WORD_SEARCH)',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SubmitActivityDTO.prototype, "foundWords", void 0);
class GuestSubmitActivityDTO extends SubmitActivityDTO {
    name;
    gradeGroup;
    grade;
}
exports.GuestSubmitActivityDTO = GuestSubmitActivityDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ana Silva' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], GuestSubmitActivityDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.GradeGroup, example: client_1.GradeGroup.ANOS_INICIAIS }),
    (0, class_validator_1.IsEnum)(client_1.GradeGroup),
    __metadata("design:type", String)
], GuestSubmitActivityDTO.prototype, "gradeGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Grade, example: client_1.Grade.PRIMEIRO_ANO }),
    (0, class_validator_1.IsEnum)(client_1.Grade),
    __metadata("design:type", String)
], GuestSubmitActivityDTO.prototype, "grade", void 0);
class GuestActivityQueryDTO extends (0, swagger_1.OmitType)(GuestSubmitActivityDTO, [
    'answers',
    'foundWords',
]) {
}
exports.GuestActivityQueryDTO = GuestActivityQueryDTO;
class CorrectSubmissionDTO {
    score;
    feedback;
}
exports.CorrectSubmissionDTO = CorrectSubmissionDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CorrectSubmissionDTO.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Excelente trabalho!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CorrectSubmissionDTO.prototype, "feedback", void 0);
//# sourceMappingURL=submit-activity.dto.js.map