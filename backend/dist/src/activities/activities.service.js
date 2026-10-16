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
var ActivitiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const ACTIVITY_INCLUDE = {
    questions: true,
    wordSearch: true,
    media: { orderBy: { order: 'asc' } },
};
let ActivitiesService = ActivitiesService_1 = class ActivitiesService {
    prisma;
    logger = new common_1.Logger(ActivitiesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, professorId) {
        this.logger.log(`Criando atividade: ${dto.title} para professor ${professorId}`);
        if (dto.type === client_1.ActivityType.MULTIPLE_CHOICE && !dto.questions?.length) {
            throw new common_1.BadRequestException('Atividade de múltipla escolha requer questões');
        }
        if (dto.type === client_1.ActivityType.WORD_SEARCH && !dto.grid?.length) {
            throw new common_1.BadRequestException('Atividade de caça palavras requer uma grade');
        }
        this.assertValidAnswers(dto.questions);
        return await this.prisma.activity.create({
            data: {
                title: dto.title,
                description: dto.description,
                type: dto.type || client_1.ActivityType.MULTIPLE_CHOICE,
                educationLevel: dto.educationLevel,
                gradeGroup: dto.gradeGroup || null,
                grade: dto.grade || null,
                highSchoolYear: dto.highSchoolYear || null,
                professorId,
                media: { create: this.toMediaData(dto.media) },
                ...(dto.type === client_1.ActivityType.MULTIPLE_CHOICE && {
                    questions: {
                        create: this.toQuestionData(dto.questions),
                    },
                }),
                ...(dto.type === client_1.ActivityType.WORD_SEARCH && {
                    wordSearch: {
                        create: {
                            grid: dto.grid,
                            words: dto.words || [],
                            orientation: dto.orientation || [],
                            positions: dto.positions || [],
                        },
                    },
                }),
            },
            include: ACTIVITY_INCLUDE,
        });
    }
    async findAll(userId, userRole, skip = 0, take = 10) {
        if (userRole === client_1.Role.PROFESSOR) {
            return await this.prisma.activity.findMany({
                where: {
                    professorId: userId,
                },
                include: ACTIVITY_INCLUDE,
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            });
        }
        const submissions = await this.prisma.submission.findMany({
            where: {
                studentId: userId,
            },
            select: {
                activityId: true,
            },
        });
        const answeredIds = submissions.map((s) => s.activityId);
        const activities = await this.prisma.activity.findMany({
            where: {
                status: 'PUBLISHED',
                id: {
                    notIn: answeredIds,
                },
                educationLevel: (await this.prisma.user.findUnique({
                    where: { id: userId },
                }))?.educationLevel || undefined,
            },
            include: ACTIVITY_INCLUDE,
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });
        return activities.map((a) => this.hideAnswers(a));
    }
    async findOneForUser(id, userId, userRole) {
        const activity = await this.findOne(id);
        if (userRole === client_1.Role.PROFESSOR) {
            if (activity.professorId !== userId) {
                throw new common_1.ForbiddenException('Você não tem permissão para ver esta atividade');
            }
            return activity;
        }
        if (activity.status !== 'PUBLISHED') {
            throw new common_1.NotFoundException('Atividade não encontrada');
        }
        return this.hideAnswers(activity);
    }
    async findOne(id) {
        const activity = await this.prisma.activity.findUnique({
            where: { id },
            include: ACTIVITY_INCLUDE,
        });
        if (!activity) {
            throw new common_1.NotFoundException('Atividade não encontrada');
        }
        return activity;
    }
    async update(id, professorId, dto) {
        const activity = await this.findOne(id);
        if (activity.professorId !== professorId) {
            throw new common_1.ForbiddenException('Você não tem permissão para editar esta atividade');
        }
        this.logger.log(`Atualizando atividade ${id}`);
        this.assertValidAnswers(dto.questions);
        const updatedData = {
            title: dto.title || activity.title,
            description: dto.description || activity.description,
        };
        if (dto.questions) {
            updatedData.questions = {
                deleteMany: {},
                create: this.toQuestionData(dto.questions),
            };
        }
        if (dto.media) {
            updatedData.media = {
                deleteMany: {},
                create: this.toMediaData(dto.media),
            };
        }
        if (dto.grid && activity.wordSearch) {
            updatedData.wordSearch = {
                update: {
                    grid: dto.grid,
                    words: dto.words || [],
                    orientation: dto.orientation || [],
                    positions: dto.positions || [],
                },
            };
        }
        return await this.prisma.activity.update({
            where: { id },
            data: updatedData,
            include: ACTIVITY_INCLUDE,
        });
    }
    async delete(id, professorId) {
        const activity = await this.findOne(id);
        if (activity.professorId !== professorId) {
            throw new common_1.ForbiddenException('Você não tem permissão para deletar esta atividade');
        }
        this.logger.log(`Deletando atividade ${id}`);
        return await this.prisma.activity.delete({
            where: { id },
        });
    }
    async submit(activityId, studentId, dto) {
        const exists = await this.prisma.submission.findFirst({
            where: {
                activityId,
                studentId,
            },
        });
        if (exists) {
            throw new common_1.BadRequestException('Você já respondeu esta atividade.');
        }
        const activity = await this.findOne(activityId);
        if (activity.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Atividade não está publicada');
        }
        this.logger.log(`Aluno ${studentId} submetendo resposta para atividade ${activityId}`);
        if (activity.type === client_1.ActivityType.MULTIPLE_CHOICE) {
            return this.submitMultipleChoice(activity, studentId, dto.answers || []);
        }
        else if (activity.type === client_1.ActivityType.WORD_SEARCH) {
            return this.submitWordSearch(activity, studentId, dto.foundWords || []);
        }
    }
    async submitMultipleChoice(activity, studentId, answers) {
        if (answers.length !== activity.questions.length) {
            throw new common_1.BadRequestException('Número de respostas inválido');
        }
        let score = 0;
        activity.questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                score++;
            }
        });
        return await this.prisma.submission.create({
            data: {
                activityId: activity.id,
                studentId,
                answers,
                score,
            },
        });
    }
    async submitWordSearch(activity, studentId, foundWords) {
        const wordSearch = activity.wordSearch;
        if (!wordSearch) {
            throw new common_1.BadRequestException('Atividade de caça palavras inválida');
        }
        let score = 0;
        foundWords.forEach((word) => {
            if (wordSearch.words.includes(word)) {
                score++;
            }
        });
        const maxScore = wordSearch.words.length;
        return await this.prisma.submission.create({
            data: {
                activityId: activity.id,
                studentId,
                foundWords,
                score: Math.round((score / maxScore) * 100),
            },
        });
    }
    async publishActivity(id, professorId) {
        const activity = await this.findOne(id);
        if (activity.professorId !== professorId) {
            throw new common_1.ForbiddenException('Você não tem permissão para publicar esta atividade');
        }
        this.logger.log(`Publicando atividade ${id}`);
        return await this.prisma.activity.update({
            where: { id },
            data: { status: 'PUBLISHED' },
        });
    }
    async getStudentResults(studentId, skip = 0, take = 10) {
        return await this.prisma.submission.findMany({
            where: {
                studentId,
            },
            include: {
                activity: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });
    }
    async getProfessorResults(professorId, skip = 0, take = 10) {
        return await this.prisma.submission.findMany({
            where: {
                activity: {
                    professorId,
                },
            },
            include: {
                student: {
                    select: { id: true, name: true, email: true },
                },
                activity: {
                    include: ACTIVITY_INCLUDE,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });
    }
    async correctSubmission(id, professorId, dto) {
        const submission = await this.prisma.submission.findUnique({
            where: { id },
            include: { activity: true },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Submission não encontrada');
        }
        if (submission.activity.professorId !== professorId) {
            throw new common_1.ForbiddenException('Você não tem permissão para corrigir este submission');
        }
        this.logger.log(`Corrigindo submission ${id}`);
        return await this.prisma.submission.update({
            where: { id },
            data: {
                score: dto.score,
                feedback: dto.feedback,
                status: 'CORRECTED',
                correctedAt: new Date(),
            },
        });
    }
    toMediaData(media) {
        return (media || []).map((m, index) => ({
            type: m.type,
            url: m.url,
            caption: m.caption || null,
            mimeType: m.mimeType || null,
            order: index,
        }));
    }
    toQuestionData(questions) {
        return (questions || []).map((q) => ({
            statement: q.statement,
            options: q.options,
            answer: q.answer,
            imageUrl: q.imageUrl || null,
            audioUrl: q.audioUrl || null,
        }));
    }
    assertValidAnswers(questions) {
        questions?.forEach((q, index) => {
            if (q.answer >= q.options.length) {
                throw new common_1.BadRequestException(`Questão ${index + 1}: a resposta correta deve ser uma das alternativas`);
            }
        });
    }
    hideAnswers(activity) {
        return {
            ...activity,
            questions: activity.questions.map(({ answer: _answer, ...q }) => q),
        };
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = ActivitiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map