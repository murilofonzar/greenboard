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
exports.UpdateActivityDTO = exports.CreateActivityDTO = exports.CreateQuestionDTO = exports.ActivityMediaDTO = exports.MEDIA_URL_REGEX = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
exports.MEDIA_URL_REGEX = /^(\/uploads\/[A-Za-z0-9._-]+|https?:\/\/[^\s"'<>]+)$/;
const MEDIA_URL_MESSAGE = 'URL de mídia inválida. Use a URL retornada por /media/upload ou um link http(s)';
class ActivityMediaDTO {
    type;
    url;
    caption;
    mimeType;
}
exports.ActivityMediaDTO = ActivityMediaDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.MediaType, example: client_1.MediaType.IMAGE }),
    (0, class_validator_1.IsEnum)(client_1.MediaType, { message: 'Tipo de mídia deve ser IMAGE ou AUDIO' }),
    __metadata("design:type", String)
], ActivityMediaDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '/uploads/3f2b9c1e-1234-4c3a-9d8e-abcdef123456.png',
        description: 'URL retornada por POST /media/upload ou link http(s) externo',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.Matches)(exports.MEDIA_URL_REGEX, { message: MEDIA_URL_MESSAGE }),
    __metadata("design:type", String)
], ActivityMediaDTO.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ouça a pronúncia antes de responder' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ActivityMediaDTO.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'image/png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ActivityMediaDTO.prototype, "mimeType", void 0);
class CreateQuestionDTO {
    statement;
    options;
    answer;
    imageUrl;
    audioUrl;
}
exports.CreateQuestionDTO = CreateQuestionDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Qual é a tradução de "casa" em inglês?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestionDTO.prototype, "statement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['House', 'Tree', 'Car', 'Door'], minItems: 2 }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2, { message: 'Deve haver no mínimo 2 opções' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateQuestionDTO.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Índice (base 0) da alternativa correta' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuestionDTO.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/3f2b9c1e-1234-4c3a-9d8e-abcdef123456.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.Matches)(exports.MEDIA_URL_REGEX, { message: MEDIA_URL_MESSAGE }),
    __metadata("design:type", String)
], CreateQuestionDTO.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/9a8b7c6d-1234-4c3a-9d8e-abcdef123456.mp3' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2048),
    (0, class_validator_1.Matches)(exports.MEDIA_URL_REGEX, { message: MEDIA_URL_MESSAGE }),
    __metadata("design:type", String)
], CreateQuestionDTO.prototype, "audioUrl", void 0);
class CreateActivityDTO {
    title;
    description;
    type = client_1.ActivityType.MULTIPLE_CHOICE;
    educationLevel;
    gradeGroup;
    grade;
    highSchoolYear;
    media;
    questions;
    grid;
    words;
    orientation;
    positions;
}
exports.CreateActivityDTO = CreateActivityDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vocabulário em Inglês' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActivityDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ouça o áudio e observe as imagens antes de responder' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActivityDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ActivityType, default: client_1.ActivityType.MULTIPLE_CHOICE }),
    (0, class_validator_1.IsEnum)(client_1.ActivityType, { message: 'Tipo de atividade inválido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateActivityDTO.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.EducationLevel }),
    (0, class_validator_1.IsEnum)(client_1.EducationLevel, { message: 'Nível de educação inválido' }),
    __metadata("design:type", String)
], CreateActivityDTO.prototype, "educationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.GradeGroup }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.GradeGroup, { message: 'Grupo de série inválido' }),
    __metadata("design:type", String)
], CreateActivityDTO.prototype, "gradeGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Grade }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Grade, { message: 'Série inválida' }),
    __metadata("design:type", String)
], CreateActivityDTO.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.HighSchoolGrade }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.HighSchoolGrade, { message: 'Ano do ensino médio inválido' }),
    __metadata("design:type", String)
], CreateActivityDTO.prototype, "highSchoolYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [ActivityMediaDTO],
        description: 'Imagens e áudios exibidos aos alunos junto com a atividade',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20, { message: 'Máximo de 20 mídias por atividade' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ActivityMediaDTO),
    __metadata("design:type", Array)
], CreateActivityDTO.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [CreateQuestionDTO],
        description: 'Obrigatório para MULTIPLE_CHOICE',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuestionDTO),
    __metadata("design:type", Array)
], CreateActivityDTO.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Grade do caça palavras (obrigatório para WORD_SEARCH)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateActivityDTO.prototype, "grid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateActivityDTO.prototype, "words", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateActivityDTO.prototype, "orientation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateActivityDTO.prototype, "positions", void 0);
class UpdateActivityDTO {
    title;
    description;
    media;
    questions;
    grid;
    words;
    orientation;
    positions;
}
exports.UpdateActivityDTO = UpdateActivityDTO;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateActivityDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateActivityDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [ActivityMediaDTO],
        description: 'Se enviado, substitui todas as mídias da atividade',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20, { message: 'Máximo de 20 mídias por atividade' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ActivityMediaDTO),
    __metadata("design:type", Array)
], UpdateActivityDTO.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [CreateQuestionDTO],
        description: 'Se enviado, substitui todas as questões da atividade',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuestionDTO),
    __metadata("design:type", Array)
], UpdateActivityDTO.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateActivityDTO.prototype, "grid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateActivityDTO.prototype, "words", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateActivityDTO.prototype, "orientation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateActivityDTO.prototype, "positions", void 0);
//# sourceMappingURL=create-activity.dto.js.map