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
exports.ActivitiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activities_service_1 = require("./activities.service");
const create_activity_dto_1 = require("./dto/create-activity.dto");
const submit_activity_dto_1 = require("./dto/submit-activity.dto");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const roles_decorator_1 = require("../auth/roles.decorator");
const activity_owner_guard_1 = require("../auth/guards/activity-owner.guard");
let ActivitiesController = class ActivitiesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user.sub);
    }
    findAll(req, query) {
        return this.service.findAll(req.user.sub, req.user.role, query.skip, query.take);
    }
    studentResults(req, query) {
        return this.service.getStudentResults(req.user.sub, query.skip, query.take);
    }
    professorResults(req, query) {
        return this.service.getProfessorResults(req.user.sub, query.skip, query.take);
    }
    getOne(id, req) {
        return this.service.findOneForUser(id, req.user.sub, req.user.role);
    }
    update(id, dto, req) {
        return this.service.update(id, req.user.sub, dto);
    }
    delete(id, req) {
        return this.service.delete(id, req.user.sub);
    }
    publish(id, req) {
        return this.service.publishActivity(id, req.user.sub);
    }
    submit(id, dto, req) {
        return this.service.submit(id, req.user.sub, dto);
    }
    correct(id, body, req) {
        return this.service.correctSubmission(id, req.user.sub, body);
    }
};
exports.ActivitiesController = ActivitiesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('PROFESSOR'),
    (0, swagger_1.ApiOperation)({
        summary: 'Criar nova atividade (professor)',
        description: 'Para anexar imagens/áudios, envie os arquivos antes em POST /media/upload e use as URLs retornadas em `media[]` (nível da atividade) ou em `questions[].imageUrl` / `questions[].audioUrl`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Atividade criada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Apenas professores' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activity_dto_1.CreateActivityDTO, Object]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar atividades',
        description: 'Professor: suas atividades. Aluno: atividades publicadas do seu nível ainda não respondidas (sem gabarito).',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de atividades' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_query_dto_1.PaginationQueryDTO]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('results/student'),
    (0, roles_decorator_1.Roles)('ALUNO'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter resultados do aluno' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resultados do aluno' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_query_dto_1.PaginationQueryDTO]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "studentResults", null);
__decorate([
    (0, common_1.Get)('results/professor'),
    (0, roles_decorator_1.Roles)('PROFESSOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter resultados das atividades do professor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resultados dos alunos' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_query_dto_1.PaginationQueryDTO]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "professorResults", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOperation)({ summary: 'Obter atividade específica' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Atividade encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Atividade não encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('PROFESSOR'),
    (0, common_1.UseGuards)(activity_owner_guard_1.ActivityOwnerGuard),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar atividade (inclui mídias e questões)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Atividade atualizada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Não autorizado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_activity_dto_1.UpdateActivityDTO, Object]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('PROFESSOR'),
    (0, common_1.UseGuards)(activity_owner_guard_1.ActivityOwnerGuard),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar atividade' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Atividade deletada' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Não autorizado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, roles_decorator_1.Roles)('PROFESSOR'),
    (0, common_1.UseGuards)(activity_owner_guard_1.ActivityOwnerGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOperation)({ summary: 'Publicar atividade' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Atividade publicada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, roles_decorator_1.Roles)('ALUNO'),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    (0, swagger_1.ApiOperation)({ summary: 'Submeter respostas para atividade (aluno)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Respostas submetidas' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Atividade já respondida' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_activity_dto_1.SubmitActivityDTO, Object]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)('submission/:id/correct'),
    (0, roles_decorator_1.Roles)('PROFESSOR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid', description: 'ID da submissão' }),
    (0, swagger_1.ApiOperation)({ summary: 'Corrigir submissão' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Submissão corrigida' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Não autorizado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_activity_dto_1.CorrectSubmissionDTO, Object]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "correct", null);
exports.ActivitiesController = ActivitiesController = __decorate([
    (0, swagger_1.ApiTags)('Activities'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Token ausente ou inválido' }),
    (0, common_1.Controller)('activities'),
    __metadata("design:paramtypes", [activities_service_1.ActivitiesService])
], ActivitiesController);
//# sourceMappingURL=activities.controller.js.map